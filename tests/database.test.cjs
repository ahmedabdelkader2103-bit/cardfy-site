const {test,before,after,beforeEach}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {PGlite}=require('@electric-sql/pglite');
const {pgcrypto}=require('@electric-sql/pglite/contrib/pgcrypto');
const baseline=require('./fixtures/batch-1-baseline.json');
const columns=require('./fixtures/batch-1-columns.json');
const root=path.join(__dirname,'..');
const migration=fs.readFileSync(path.join(root,'supabase/migrations/20260910161007_audit_batch_1_security.sql'),'utf8');
const CID='00000000-0000-4000-8000-000000000001';
const OTHER='00000000-0000-4000-8000-000000000002';
const ORDER='00000000-0000-4000-8000-000000000003';
const DRIVER='00000000-0000-4000-8000-000000000004';
const ADMIN='00000000-0000-4000-8000-000000000005';
let db;
const quote=s=>"'"+s.replaceAll("'","''")+"'";
const ident=s=>'"'+s.replaceAll('"','""')+'"';
const one=async(sql,args=[])=>(await db.query(sql,args)).rows[0];
async function asRole(role,uid,fn){
  await db.exec('SET ROLE '+ident(role));
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false),set_config('request.jwt.claim.role',$2,false)",[uid||'',role]);
  try{return await fn()}finally{await db.exec('RESET ROLE')}
}
async function finalize(payment='pay_on_delivery',result={}){
  return (await one('select public.cfy_menu_finalize_created_order_v3($1,$2::jsonb,$3::jsonb) as result',[ORDER,JSON.stringify({payment_method:payment,total:0}),JSON.stringify(result)])).result;
}
async function action(role,actor=DRIVER,client=CID){
  return (await one("select public.cfy_menu_order_action_core($1,'staff',$2,$3,$4,'issue','{\"text\":\"local test\"}') as result",[client,actor,role,ORDER])).result;
}
async function reset(){
  await db.exec(`RESET ROLE; DELETE FROM cfy_menu_order_events; DELETE FROM cfy_menu_orders;
    INSERT INTO cfy_menu_orders(id,reference,client_id,order_type,products_subtotal,product_discount,delivery_fee,total,coupon_code,assigned_driver_id)
    VALUES('${ORDER}','LOCAL-TEST','${CID}','delivery',110,10,20,120,'FREEDEL','${DRIVER}');`);
}

before(async()=>{
  db=new PGlite({extensions:{pgcrypto}});
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth; CREATE SCHEMA extensions; CREATE EXTENSION pgcrypto WITH SCHEMA extensions;
    GRANT USAGE ON SCHEMA public,auth TO anon,authenticated,service_role;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT current_setting('request.jwt.claim.role',true) $$;`);
  for(const table of new Set(columns.map(c=>c.table_name))){
    const fields=columns.filter(c=>c.table_name===table).map(c=>ident(c.column_name)+' '+c.data_type+(c.not_null?' NOT NULL':'')+(c.default_expr?' DEFAULT '+c.default_expr:''));
    await db.exec('CREATE TABLE public.'+ident(table)+'('+fields.join(',')+');');
  }
  // Real affected row shapes/defaults and policies; unrelated FKs/triggers are not a full production clone.
  await db.exec(`ALTER TABLE clients ENABLE ROW LEVEL SECURITY; ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
    GRANT SELECT,INSERT,UPDATE,DELETE,TRUNCATE ON clients,app_settings TO anon,authenticated,service_role;`);
  for(const p of baseline.policies){
    await db.exec('CREATE POLICY '+ident(p.policyname)+' ON public.'+ident(p.tablename)+' FOR '+p.cmd+' TO '+p.roles.join(',')+(p.qual?' USING ('+p.qual+')':'')+(p.with_check?' WITH CHECK ('+p.with_check+')':'')+';');
  }
  for(const definition of Object.values(baseline.functions))await db.exec(definition.trim()+';');
  await db.exec(`CREATE UNIQUE INDEX clients_code_test_unique ON clients(code);
    CREATE TABLE cfy_clients(id uuid,code text,brand_name_ar text,brand_name_en text,business_type text,whatsapp text,tier text,active boolean,sub_start date,sub_end date);
    CREATE TABLE cfy_social_data(client_id uuid,tagline text,facebook text,instagram text,tiktok text,website text,map_link text,instapay text,vodafone_cash text,gallery jsonb,design jsonb,card jsonb);`);
  for(const definition of Object.values(require('./fixtures/legacy-sync-functions.json')))await db.exec(definition.trim()+';');
  await db.exec(`CREATE TRIGGER cfy_clients_delete_legacy AFTER DELETE ON public.cfy_clients FOR EACH ROW EXECUTE FUNCTION cfy_delete_legacy_client();
    CREATE TRIGGER cfy_clients_sync_legacy AFTER INSERT OR UPDATE OF code,business_type,brand_name_ar,brand_name_en,whatsapp,tier,active,sub_start,sub_end ON public.cfy_clients FOR EACH ROW EXECUTE FUNCTION cfy_sync_core_to_legacy();
    CREATE TRIGGER cfy_social_sync_legacy AFTER INSERT OR UPDATE ON public.cfy_social_data FOR EACH ROW EXECUTE FUNCTION cfy_sync_social_to_legacy();`);
  await db.exec(`REVOKE ALL ON FUNCTION cfy_is_admin() FROM PUBLIC,anon;
    GRANT EXECUTE ON FUNCTION cfy_is_admin() TO authenticated,service_role;
    REVOKE ALL ON FUNCTION cfy_menu_order_action_core(uuid,text,uuid,text,uuid,text,jsonb) FROM PUBLIC,anon,authenticated;
    GRANT EXECUTE ON FUNCTION cfy_menu_order_action_core(uuid,text,uuid,text,uuid,text,jsonb) TO service_role;
    GRANT EXECUTE ON FUNCTION cfy_menu_finalize_created_order_v3(uuid,jsonb,jsonb) TO anon,authenticated,service_role;
    CREATE FUNCTION cfy_menu_order_payload(p_id uuid) RETURNS jsonb LANGUAGE sql AS $$ SELECT to_jsonb(o) FROM cfy_menu_orders o WHERE id=p_id $$;
    INSERT INTO cfy_admin_users(user_id) VALUES('${ADMIN}');
    INSERT INTO clients(code,name_ar) VALUES('LOCAL-QR','مطعم اختبار');
    INSERT INTO app_settings(key,value) VALUES('local-test','{}');
    INSERT INTO cfy_menu_settings(client_id,payment_methods) VALUES('${CID}','["cash","card_at_venue","pay_on_delivery"]');
    INSERT INTO cfy_menu_coupons(client_id,code,discount_type,value) VALUES('${CID}','FREEDEL','free_delivery',0);`);
  // Keep the actual three V3 wrappers. Stub only their upstream creators to isolate
  // the nested SECURITY DEFINER/EXECUTE contract; this is NOT checkout/login E2E.
  for(const [name,args] of [
    ['cfy_menu_create_order','p_code text,p_order jsonb'],
    ['cfy_menu_owner_create_order','p_token text,p_source text,p_order jsonb'],
    ['cfy_menu_staff_create_order','p_token text,p_source text,p_order jsonb']]){
    await db.exec(`CREATE FUNCTION ${name}(${args}) RETURNS jsonb LANGUAGE sql SECURITY DEFINER AS $$
      SELECT jsonb_build_object('id','${ORDER}','reference','LOCAL-TEST','tracking_token','test-only') $$;`);
  }
  await reset();
});
after(async()=>{if(db)await db.close()});
beforeEach(reset);

test('Baseline failures are reproducible only in the isolated database, then migration applies',async()=>{
  const a=await asRole('anon',null,()=>finalize());
  const b=await asRole('anon',null,()=>finalize());
  assert.equal(a.total,100);assert.equal(b.total,80);
  await asRole('authenticated',OTHER,async()=>{
    assert.equal((await db.query("UPDATE clients SET tag='baseline' WHERE code='LOCAL-QR' RETURNING code")).rows.length,1);
  });
  await action('delivery',OTHER);
  assert.equal((await one('select issue_open from cfy_menu_orders where id=$1',[ORDER])).issue_open,true);
  await db.exec(migration);
});

test('Anonymous and authenticated callers cannot execute finalizer; core stays private',async()=>{
  for(const role of ['anon','authenticated'])await asRole(role,OTHER,async()=>{
    await assert.rejects(()=>finalize(),e=>e.code==='42501');
    await assert.rejects(()=>action('delivery'),e=>e.code==='42501');
  });
  const row=await one('select total,payment_method from cfy_menu_orders where id=$1',[ORDER]);
  assert.equal(Number(row.total),120);assert.equal(row.payment_method,'cash');
});

test('Free delivery finalization is idempotent and ignores client-provided totals',async()=>{
  const first=await finalize(),second=await finalize();
  assert.equal(first.total,100);assert.equal(second.total,100);
  assert.equal(second.coupon_discount,20);assert.equal(second.payment_method,'pay_on_delivery');
  await db.exec(`UPDATE cfy_menu_orders SET products_subtotal=5,product_discount=10,total=15 WHERE id='${ORDER}'`);
  assert.equal((await finalize()).total,0);
});

test('Finalizer does not alter paid, progressed or duplicate orders',async()=>{
  for(const change of ["payment_status='paid'","status='preparing'"]){
    await reset();await db.exec('UPDATE cfy_menu_orders SET '+change);
    const result=await finalize();assert.equal(result.total,120);assert.equal(result.payment_method,'cash');
  }
  await reset();const duplicate=await finalize('pay_on_delivery',{duplicate:true});
  assert.equal(duplicate.total,120);assert.equal(duplicate.payment_method,'cash');
});

test('Three public V3 creation wrappers retain nested finalization permission',async()=>{
  for(const [name,args] of [
    ['cfy_menu_create_order_v3',["'TEST'","'{\"payment_method\":\"pay_on_delivery\"}'"]],
    ['cfy_menu_owner_create_order_v3',["'test-session'","'pos'","'{\"payment_method\":\"pay_on_delivery\"}'"]],
    ['cfy_menu_staff_create_order_v3',["'test-session'","'phone'","'{\"payment_method\":\"pay_on_delivery\"}'"]]]){
    await reset();
    const result=await asRole('anon',null,()=>one('SELECT '+name+'('+args.join(',')+') AS result'));
    assert.equal(result.result.total,100,name);
    assert.equal(result.result.tracking_token,'test-only');
    assert.equal(result.result.payment_method,'pay_on_delivery');
  }
});

test('Non-free coupons/takeaway totals stay unchanged and payment validation still rejects invalid methods',async()=>{
  await db.exec("UPDATE cfy_menu_orders SET coupon_code=null,total=120");
  assert.equal((await finalize()).total,120);
  await assert.rejects(()=>finalize('card_at_venue'),/invalid_payment_method_for_order/);
  await db.exec("UPDATE cfy_menu_orders SET order_type='takeaway',delivery_fee=0,total=100");
  const result=await finalize('card_at_venue');assert.equal(result.total,100);assert.equal(result.payment_method,'card_at_venue');
});

test('Legacy public reads survive; anon and non-admin writes are rejected or affect zero rows',async()=>{
  for(const role of ['anon','authenticated'])await asRole(role,OTHER,async()=>{
    assert.equal((await db.query("SELECT code FROM clients WHERE code='LOCAL-QR'")).rows.length,1);
    assert.equal((await db.query("SELECT key FROM app_settings WHERE key='local-test'")).rows.length,1);
    for(const table of ['clients','app_settings']){
      const key=table==='clients'?'code':'key',value=table==='clients'?'LOCAL-QR':'local-test';
      await assert.rejects(()=>db.exec(`TRUNCATE public.${table}`),e=>e.code==='42501');
      await assert.rejects(()=>db.query(`INSERT INTO ${table}(${key}) VALUES('unauthorized')`),e=>e.code==='42501');
      assert.equal((await db.query(`UPDATE ${table} SET ${key}=${quote(value)} WHERE ${key}=${quote(value)} RETURNING ${key}`)).rows.length,0);
      assert.equal((await db.query(`DELETE FROM ${table} WHERE ${key}=${quote(value)} RETURNING ${key}`)).rows.length,0);
    }
  });
});

test('Existing allowlisted admin can create/update/delete Legacy and save app settings',async()=>{
  await asRole('authenticated',ADMIN,async()=>{
    await db.exec("INSERT INTO clients(code) VALUES('ADMIN-TEST')");
    assert.equal((await db.query("UPDATE clients SET tag='saved' WHERE code='ADMIN-TEST' RETURNING code")).rows.length,1);
    assert.equal((await db.query("DELETE FROM clients WHERE code='ADMIN-TEST' RETURNING code")).rows.length,1);
    await db.exec("INSERT INTO app_settings(key,value) VALUES('admin-test','{}')");
    assert.equal((await db.query("UPDATE app_settings SET value='{\"ok\":true}' WHERE key='admin-test' RETURNING key")).rows.length,1);
  });
});

test('Driver issue is denied for another assignment, no assignment, missing actor and non-delivery',async()=>{
  await assert.rejects(()=>action('delivery',OTHER),/not_assigned_driver/);
  await assert.rejects(()=>action('delivery',null),/not_assigned_driver/);
  await db.exec('UPDATE cfy_menu_orders SET assigned_driver_id=null');
  await assert.rejects(()=>action('delivery'),/not_assigned_driver/);
  await db.exec(`UPDATE cfy_menu_orders SET assigned_driver_id='${DRIVER}',order_type='takeaway'`);
  await assert.rejects(()=>action('delivery'),/not_assigned_driver/);
  assert.equal((await one('select count(*)::int as n from cfy_menu_order_events')).n,0);
  assert.equal((await one('select issue_open from cfy_menu_orders')).issue_open,false);
});

test('Existing core/Social synchronization triggers still create, update and delete Legacy rows',async()=>{
  // These upstream tables are minimal test fixtures, not a replacement for their production authorization.
  await db.exec(`INSERT INTO cfy_clients(id,code,brand_name_ar,tier,active) VALUES('${OTHER}','SYNC-TEST','اسم أول','premium',true);
    UPDATE cfy_clients SET brand_name_ar='اسم محدث' WHERE id='${OTHER}';
    INSERT INTO cfy_social_data(client_id,tagline,gallery,design,card) VALUES('${OTHER}','وصف اختبار','[]','{}','{}');`);
  await asRole('anon',null,async()=>{
    const result=await one("SELECT name_ar,tag,tier FROM clients WHERE code='SYNC-TEST'");
    assert.deepEqual(result,{name_ar:'اسم محدث',tag:'وصف اختبار',tier:'prem'});
  });
  await db.exec(`DELETE FROM cfy_clients WHERE id='${OTHER}'`);
  assert.equal((await db.query("SELECT code FROM clients WHERE code='SYNC-TEST'")).rows.length,0);
});

test('Assigned driver and authorized operational roles retain issue action; cross-tenant request fails',async()=>{
  for(const role of ['delivery','owner','cashier','coordinator']){
    await reset();const result=await action(role,role==='delivery'?DRIVER:OTHER);
    assert.equal(result.issue_open,true,role);
    assert.equal((await one('select count(*)::int as n from cfy_menu_order_events')).n,1);
  }
  await assert.rejects(()=>action('delivery',DRIVER,OTHER),/order_not_found/);
});

test('Migration can be applied again locally without reopening access',async()=>{
  await db.exec(migration);
  const row=await one("SELECT has_function_privilege('anon','cfy_menu_finalize_created_order_v3(uuid,jsonb,jsonb)','EXECUTE') AS allowed");
  assert.equal(row.allowed,false);
});
