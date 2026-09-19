const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
test('Analytics date periods and zero comparisons preserve Cairo date boundaries',async()=>{const code=fs.readFileSync(path.join(__dirname,'../analytics/data.js'),'utf8');const d=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));assert.deepEqual(d.periodDates('week','2026-01-03'),{from:'2025-12-28',to:'2026-01-03'});assert.deepEqual(d.previousDates('2026-03-01','2026-03-07'),{from:'2026-02-22',to:'2026-02-28'});assert.equal(d.delta(12,0),null);assert.equal(d.share(1,0),0);const result=d.normalise({hours:[{label:3,value:2,revenue:20}]});assert.equal(result.hours.length,24);assert.equal(result.hours[3].value,2);assert.equal(result.hours[4].value,0);assert.equal(d.number(null),'غير متاح');});
test('Stitch additive metrics preserve paid revenue, tenant isolation, branch filters and analytics permission',async()=>{
 const {PGlite}=require('@electric-sql/pglite'),{pgcrypto}=require('@electric-sql/pglite/contrib/pgcrypto');
 const fixture=fs.readFileSync(path.join(__dirname,'master-migration.test.cjs'),'utf8');const setup=vm.runInNewContext(fixture.slice(0,fixture.indexOf("test('Restaurant OS"))+'\n({baseline,migration,owner})',{require,__dirname});
 const db=new PGlite({extensions:{pgcrypto}});try{await db.exec(setup.baseline);await db.exec(setup.migration);await db.exec(fs.readFileSync(path.join(__dirname,'../supabase/migrations/20260914170626_analytics_stitch_read_metrics.sql'),'utf8'));
 const branch=(await db.query('select id from cfy_os_branches limit 1')).rows[0].id;
 const other='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';await db.query("insert into cfy_clients(id,code) values($1,'OTHER')",[other]);
 await db.query("insert into cfy_menu_staff(id,client_id,name,role,pin_hash,shift_state) values('22222222-2222-4222-8222-222222222222',$1,'Driver','delivery','x','available')",[setup.owner]);
 const product='33333333-3333-4333-8333-333333333333';await db.query("insert into cfy_menu_products(id,client_id,name_ar) values($1,$2,'Product')",[product,setup.owner]);
 for(const [i,client,paid,status,total] of [[1,setup.owner,'paid','completed',100],[2,setup.owner,'unpaid','new',900],[3,setup.owner,'paid','cancelled',800],[4,other,'paid','completed',700]]){const id=`44444444-4444-4444-8444-${String(i).padStart(12,'0')}`;await db.query("insert into cfy_menu_orders(id,client_id,branch_id,total,payment_status,status,order_source,created_at) values($1,$2,$3,$4,$5,$6,'pos','2026-09-01 18:00:00+00')",[id,client,client===setup.owner?branch:null,total,paid,status]);await db.query('insert into cfy_menu_order_items(order_id,product_id,quantity,line_total) values($1,$2,2,$3)',[id,product,total]);}
 const args=['1234567890123456','2026-09-01','2026-09-01',branch];const result=(await db.query('select cfy_os_analytics($1,$2::date,$3::date,$4::uuid) d',args)).rows[0].d;
 assert.equal(result.summary.orders,3);assert.equal(result.summary.revenue,100);assert.equal(result.summary.active_drivers,1);assert.equal(result.products[0].quantity,2);assert.equal(result.products[0].value,100);assert.equal(result.source_days[0].orders,3);
 await assert.rejects(()=>db.query("select cfy_os_analytics('invalid-token','2026-09-01','2026-09-01',null)"),/invalid_session/);
 const staff='55555555-5555-4555-8555-555555555555',staffToken='analytics-test-staff-session';
 await db.query("insert into cfy_menu_staff(id,client_id,name,role,pin_hash,page_permissions) values($1,$2,'Cashier','cashier','x',array['takeaway'])",[staff,setup.owner]);
 await db.query("insert into cfy_menu_staff_sessions(staff_id,client_id,token_hash,expires_at) values($1,$2,encode(extensions.digest($3,'sha256'),'hex'),now()+interval '1 day')",[staff,setup.owner,staffToken]);
 await assert.rejects(()=>db.query("select cfy_os_analytics($1,'2026-09-01','2026-09-01',null)",[staffToken]),/page_forbidden/);
 await db.query("update cfy_menu_staff set page_permissions=array['analytics'] where id=$1",[staff]);
 assert.equal((await db.query("select cfy_os_analytics($1,'2026-09-01','2026-09-01',null)->'summary'->>'revenue' revenue",[staffToken])).rows[0].revenue,'100');
 await assert.rejects(()=>db.query("select cfy_os_analytics('1234567890123456','2026-09-01','2026-09-01',$1)",[other]),/invalid_branch/);
 }finally{await db.close();}
});
