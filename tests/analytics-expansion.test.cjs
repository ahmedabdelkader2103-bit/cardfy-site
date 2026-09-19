const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
test('Six Analytics Expansion views use guarded real aggregates, scoped branch/date, and anonymous customer output',async()=>{
 const {PGlite}=require('@electric-sql/pglite'),{pgcrypto}=require('@electric-sql/pglite/contrib/pgcrypto');
 const fixture=fs.readFileSync(path.join(__dirname,'master-migration.test.cjs'),'utf8');
 const {baseline,migration,owner}=vm.runInNewContext(fixture.slice(0,fixture.indexOf("test('Restaurant OS"))+'\n({baseline,migration,owner})',{require,__dirname});
 const db=new PGlite({extensions:{pgcrypto}});
 try{
  await db.exec(baseline);await db.exec(migration);
  await db.exec(fs.readFileSync(path.join(root,'supabase/migrations/20260914170626_analytics_stitch_read_metrics.sql'),'utf8'));
  await db.exec(fs.readFileSync(path.join(root,'supabase/migrations/20260915124500_analytics_expansion_read_metrics.sql'),'utf8'));
  const branch=(await db.query('select id from cfy_os_branches where client_id=$1',[owner])).rows[0].id;
  const otherBranch=(await db.query("insert into cfy_os_branches(client_id,name) values($1,'فرع ثان') returning id",[owner])).rows[0].id;
  const product='33333333-3333-4333-8333-333333333333';
  await db.query("insert into cfy_menu_products(id,client_id,name_ar) values($1,$2,'صنف حقيقي')",[product,owner]);
  const orders=[
   ['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',branch,100,'completed','paid','delivery','online'],
   ['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',branch,50,'completed','paid','takeaway','pos'],
   ['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',otherBranch,200,'completed','paid','delivery','online'],
   ['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',branch,90,'cancelled','paid','delivery','online']
  ];
  for(const [id,b,total,status,payment,type,source] of orders){
   await db.query("insert into cfy_menu_orders(id,reference,client_id,branch_id,total,status,payment_status,order_type,order_source,created_at,preparing_at,ready_at,rating) values($1,$2,$3,$4,$5,$6,$7,$8,$9,'2026-09-01 18:00:00+00','2026-09-01 18:05:00+00','2026-09-01 18:15:00+00',4)",[id,id.slice(-4),owner,b,total,status,payment,type,source]);
   await db.query('insert into cfy_menu_order_items(order_id,product_id,quantity,unit_price,line_total) values($1,$2,1,$3,$3)',[id,product,total]);
  }
  await db.query("insert into cfy_menu_order_events(client_id,order_id,event_type,data,created_at) values($1,$2,'cancelled','{\"reason\":\"ألغاه العميل\"}','2026-09-01 18:20:00+00')",[owner,orders[3][0]]);
  await db.query("insert into cfy_menu_order_events(client_id,order_id,event_type,created_at) values($1,$2,'ready','2026-09-01 18:15:00+00')",[owner,orders[0][0]]);
  const profile=(await db.query("insert into cfy_os_customer_profiles(client_id,device_token_hash,phone_normalized,profile) values($1,'device-hash','+201012345678','{\"name\":\"Private Person\",\"phone\":\"01012345678\"}') returning id",[owner])).rows[0].id;
  for(const id of orders.slice(0,2).map(x=>x[0]))await db.query("insert into cfy_os_customer_orders(profile_id,order_id,tracking_token) values($1,$2,'private-token')",[profile,id]);
  const query=async b=>(await db.query('select cfy_os_analytics($1,$2::date,$3::date,$4::uuid) d',['1234567890123456','2026-09-01','2026-09-01',b])).rows[0].d;
  const current=await query(branch);
  assert.equal(current.summary.orders,3);assert.equal(current.summary.revenue,150);
  assert.equal(current.product_detail[0].value,150);assert.equal(current.product_detail[0].quantity,2);
  assert.equal(current.customer_summary.registered_customers,1);assert.equal(current.customer_summary.returning_customers,1);
  assert.equal(current.customer_summary.linked_orders,2);assert.equal(current.customer_top[0].spent,150);
  assert.equal(current.customer_months[0].returning_customers,1);
  assert.equal(current.type_detail.reduce((n,x)=>n+x.orders,0),3);
  assert.equal(current.type_hours.reduce((n,x)=>n+x.orders,0),3);
  assert.equal(current.status_detail.length,3);assert.equal(current.kitchen_detail.length,3);
  assert.equal(current.kitchen_days[0].preparation_minutes,10);
  assert.equal(current.status_hours.reduce((n,x)=>n+x.orders,0),3);
  assert.equal(current.status_events.reduce((n,x)=>n+x.events,0),2);
  assert.equal(current.status_detail.find(x=>x.status==='cancelled').cancel_reason,'ألغاه العميل');
  assert.equal(JSON.stringify(current).includes('Private Person'),false);
  assert.equal(JSON.stringify(current).includes('+201012345678'),false);
  assert.equal(JSON.stringify(current).includes('private-token'),false);
  const second=await query(otherBranch);assert.equal(second.summary.orders,1);assert.equal(second.customer_summary.registered_customers,0);assert.equal(second.product_detail[0].value,200);
  const staff='55555555-5555-4555-8555-555555555555',staffToken='expansion-staff-session';
  await db.query("insert into cfy_menu_staff(id,client_id,name,role,pin_hash,page_permissions) values($1,$2,'Cashier','cashier','x',array['takeaway'])",[staff,owner]);
  await db.query("insert into cfy_menu_staff_sessions(staff_id,client_id,token_hash,expires_at) values($1,$2,encode(extensions.digest($3,'sha256'),'hex'),now()+interval '1 day')",[staff,owner,staffToken]);
  await assert.rejects(()=>db.query("select cfy_os_analytics($1,'2026-09-01','2026-09-01',$2)",[staffToken,branch]),/page_forbidden/);
  await db.query("update cfy_menu_staff set page_permissions=array['analytics'] where id=$1",[staff]);
  assert.equal((await db.query("select cfy_os_analytics($1,'2026-09-01','2026-09-01',$2)->'customer_summary'->>'linked_orders' linked",[staffToken,branch])).rows[0].linked,'2');
  await assert.rejects(()=>db.query("select cfy_os_analytics('bad','2026-09-01','2026-09-01',null)"),/invalid_session/);
  await assert.rejects(()=>db.query("select cfy_os_analytics('1234567890123456','2026-09-02','2026-09-01',null)"),/invalid_date_range/);
  await assert.rejects(()=>db.query("select cfy_os_analytics('1234567890123456','2026-09-01','2026-09-01',$1)",['99999999-9999-4999-8999-999999999999']),/invalid_branch/);
 }finally{await db.close();}
});
test('Expansion renderer omits Stitch mocks and leaves unsupported operational metrics unavailable',async()=>{
 const code=fs.readFileSync(path.join(root,'analytics/expansion.js'),'utf8');
 const {renderExpansion}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 const dataCode=fs.readFileSync(path.join(root,'analytics/data.js'),'utf8');
 const {normalise}=await import('data:text/javascript;base64,'+Buffer.from(dataCode).toString('base64'));
 const d=normalise({summary:{orders:0,revenue:0,cancelled:0},branches:[],customer_summary:{}});
 const h={esc:s=>String(s??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),number:v=>v==null?'غير متاح':String(v),currency:v=>v==null?'غير متاح':'EGP '+v,share:(v,n)=>n?100*v/n:0,delta:()=>null,empty:()=>'<p>لا توجد بيانات</p>',donut:()=>'<p>لا توجد بيانات</p>',bars:()=>'<p>لا توجد بيانات</p>',line:()=>'<p>لا توجد بيانات</p>',table:(heads,rows)=>'<table>'+rows.length+'</table>',url:id=>'/analytics/'+id,titles:{kitchen:'أداء المطبخ',customers:'رؤى العملاء',insights:'رؤى ذكية',products:'أداء الأصناف','order-types':'أنواع الطلبات','order-status':'حالة الطلبات'},icon:()=>'<svg></svg>'};
 for(const page of Object.keys(h.titles)){const view=renderExpansion(page,d,null,h);assert.match(view.html,new RegExp(h.titles[page]));assert.doesNotMatch(view.html,/شاورما عربي دبل|أحمد|توصية AI-generated/);assert.equal(view.html.includes('/analytics/fake'),false);assert.ok(view.exportRows.length||page==='insights');}
 assert.match(renderExpansion('kitchen',d,null,h).html,/غير متاح: محطة تجهيز/);
 assert.match(renderExpansion('order-status',d,null,h).html,/تصنيف موحد للتعثر/);
});
