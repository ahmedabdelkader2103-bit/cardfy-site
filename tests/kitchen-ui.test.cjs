const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'restaurant','kitchen.js'),'utf8');
const app=fs.readFileSync(path.join(root,'restaurant','app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'restaurant','index.html'),'utf8');

test('Kitchen uses the dedicated approved presentation inside the existing shell',()=>{
  assert.match(app,/page==='kitchen'.+mountKitchen/);
  assert.match(html,/kitchen\.css\?v=20260920-kitchen-ui/);
  assert.match(source,/المطبخ/);
  assert.match(source,/الطلبات النشطة في انتظار التحضير/);
  assert.match(source,/تم التحضير/);
});

test('Kitchen uses real CARDfy snapshot and action endpoints without mock data',()=>{
  assert.match(source,/cfy_os_operational_snapshot/);
  assert.match(source,/p_page:'kitchen'/);
  assert.match(source,/cfy_os_order_action/);
  assert.match(source,/p_action:'ready'/);
  assert.doesNotMatch(source,/mockKitchenOrders|#1024|شاورما فراخ صاج/);
});

test('Kitchen queue contains only orders that reached preparation',()=>{
  assert.match(source,/order\.status==='preparing'/);
  assert.doesNotMatch(source,/\['new','preparing'\]/);
});

test('Kitchen output escapes real order content and keeps CARDfy shell branding',()=>{
  assert.match(source,/esc\(order\.reference\)/);
  assert.match(source,/esc\(order\.notes/);
  assert.match(source,/esc\(order\.order_source/);
  assert.match(html,/<bdi dir="ltr">CARD<span>fy<\/span><\/bdi>/);
});
