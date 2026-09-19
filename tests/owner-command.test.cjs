const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {PGlite}=require('@electric-sql/pglite');
const {pgcrypto}=require('@electric-sql/pglite/contrib/pgcrypto');

const fixture=fs.readFileSync(path.join(__dirname,'master-migration.test.cjs'),'utf8');
const {baseline,migration,owner}=vm.runInNewContext(fixture.slice(0,fixture.indexOf("test('Restaurant OS"))+'\n({baseline,migration,owner})',{require,__dirname});
const ownerMigration=fs.readFileSync(path.join(__dirname,'../supabase/migrations/20260919183811_owner_command_center_read_model.sql'),'utf8');

async function dataModule(){
  const code=fs.readFileSync(path.join(__dirname,'../restaurant/owner-data.js'),'utf8');
  return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
}

test('Owner command RPC is owner-only, tenant-scoped and branch-aware',async()=>{
  const db=new PGlite({extensions:{pgcrypto}});await db.exec(baseline);await db.exec(migration);await db.exec(ownerMigration);
  const branch=(await db.query('select id from cfy_os_branches where client_id=$1',[owner])).rows[0].id;
  const second=(await db.query("insert into cfy_os_branches(client_id,name) values($1,'فرع ثان') returning id",[owner])).rows[0].id;
  const other='99999999-9999-4999-8999-999999999999';
  await db.query("insert into cfy_clients(id,code,brand_name_ar) values($1,'OTHER','مطعم آخر')",[other]);
  await db.query("insert into cfy_os_branches(client_id,name) values($1,'فرع عميل آخر')",[other]);
  await db.query("insert into cfy_menu_orders(reference,client_id,branch_id,order_type,status,payment_status,total,created_at,paid_at) values('OWN-PAID',$1,$2,'takeaway','completed','paid',300,'2026-09-19 10:00+00','2026-09-19 10:10+00'),('OWN-READY',$1,$2,'delivery','ready','unpaid',120,'2026-09-19 11:00+00',null),('SECOND',$1,$3,'takeaway','completed','paid',200,'2026-09-19 12:00+00','2026-09-19 12:10+00')",[owner,branch,second]);
  await db.query("insert into cfy_menu_orders(reference,client_id,order_type,status,payment_status,total,created_at) values('OTHER-ORDER',$1,'takeaway','completed','paid',900,'2026-09-19 10:00+00')",[other]);
  await db.query("insert into cfy_os_finance_entries(client_id,branch_id,kind,title,amount,occurred_on) values($1,$2,'expense','إيجار',50,'2026-09-19'),($1,$2,'revenue','إيراد يدوي',25,'2026-09-19')",[owner,branch]);
  await db.query("insert into cfy_os_inventory(client_id,branch_id,name,unit,quantity,minimum_quantity) values($1,$2,'صلصة','kg',0,2)",[owner,branch]);
  const response=(await db.query("select cfy_os_owner_command('1234567890123456','2026-09-19','2026-09-19',$1) data",[branch])).rows[0].data;
  assert.equal(response.summary.orders,2);
  assert.equal(Number(response.summary.revenue),325);
  assert.equal(Number(response.summary.expenses),50);
  assert.equal(Number(response.summary.operating_profit),275);
  assert.equal(response.summary.low_stock,1);
  assert.equal(response.operations.ready,1);
  assert.ok(response.alerts.some(alert=>alert.kind==='inventory'));
  assert.ok(response.alerts.some(alert=>alert.kind==='driver_assignment'));
  assert.equal(response.alerts.some(alert=>String(alert.detail).includes('OTHER')),false);
  await assert.rejects(()=>db.query("select cfy_os_owner_command('1234567890123456','2026-09-19','2026-09-19',$1)",[other]),/invalid_branch/);
  const staff='22222222-2222-4222-8222-222222222222',token='staff-owner-command-token';
  await db.query("insert into cfy_menu_staff(id,client_id,code,name,role,pin_hash,page_permissions) values($1,$2,'STF','Staff','cashier','x',array['analytics','accounts'])",[staff,owner]);
  await db.query("insert into cfy_menu_staff_sessions(staff_id,client_id,token_hash,expires_at) values($1,$2,encode(extensions.digest($3,'sha256'),'hex'),now()+interval '1 day')",[staff,owner,token]);
  await assert.rejects(()=>db.query("select cfy_os_owner_command($1,'2026-09-19','2026-09-19',null)",[token]),/owner_required/);
  assert.equal((await db.query("select has_function_privilege('public','cfy_os_owner_command(text,date,date,uuid)','EXECUTE') ok")).rows[0].ok,false);
  assert.equal((await db.query("select has_function_privilege('anon','cfy_os_owner_command(text,date,date,uuid)','EXECUTE') ok")).rows[0].ok,true);
  await db.close();
});

test('Owner alert helpers filter data and reject unsafe routes',async()=>{
  const {ownerModel,filterAlerts,safeOwnerRoute,operationLabel}=await dataModule();
  const model=ownerModel({alerts:[
    {severity:'warning',kind:'inventory',title:'مخزون',detail:'صلصة',created_at:'2026-09-19T10:00:00Z'},
    {severity:'critical',kind:'order_issue',title:'بلاغ',detail:'طلب',created_at:'2026-09-19T11:00:00Z'}
  ]});
  assert.equal(model.alerts[0].severity,'critical');
  assert.equal(model.counts.warning,1);
  assert.equal(filterAlerts(model.alerts,{kind:'inventory'}).length,1);
  assert.equal(filterAlerts(model.alerts,{query:'طلب'}).length,1);
  assert.equal(safeOwnerRoute('/restaurant/?page=accounts-inventory'),'/restaurant/?page=accounts-inventory');
  assert.equal(safeOwnerRoute('/restaurant/?page=owner-alerts'),'/restaurant/?page=owner-alerts');
  assert.equal(safeOwnerRoute('/analytics/order-status/'),'/analytics/order-status/');
  assert.equal(safeOwnerRoute('javascript:alert(1)'),'/restaurant/?page=owner');
  assert.equal(operationLabel('driver_assigned'),'إسناد مندوب');
});

test('Owner UI contains only the two approved pages with RTL responsive safeguards',()=>{
  const js=fs.readFileSync(path.join(__dirname,'../restaurant/owner.js'),'utf8');
  const css=fs.readFileSync(path.join(__dirname,'../restaurant/owner.css'),'utf8');
  const shared=fs.readFileSync(path.join(__dirname,'../restaurant/shared.js'),'utf8');
  const html=fs.readFileSync(path.join(__dirname,'../restaurant/index.html'),'utf8');
  assert.match(js,/owner-alerts/);assert.match(js,/مركز قيادة المالك/);assert.match(js,/مركز التنبيهات والإجراءات/);
  assert.match(js,/الربح التشغيلي التقديري/);assert.doesNotMatch(js,/صافي الربح|تنبيهات ذكية|ذكاء اصطناعي/);
  assert.match(js,/<bdi dir="ltr">CARDfy<\/bdi>/);assert.doesNotMatch(js,/fy CARD|FY CARD|CARD fy/);
  assert.match(shared,/context\.role!=='owner'/);assert.match(shared,/id==='owner'\?context\.role==='owner'/);
  assert.match(html,/owner\.css\?v=20260919-owner/);assert.match(css,/@media\(max-width:1200px\)/);assert.match(css,/@media\(max-width:820px\)/);assert.match(css,/@media\(max-width:480px\)/);
});
