const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const pos=fs.readFileSync(path.join(root,'restaurant','pos.js'),'utf8');
const legacyDinein=fs.readFileSync(path.join(root,'restaurant','pos-dinein.js'),'utf8');
const app=fs.readFileSync(path.join(root,'restaurant','app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'restaurant','pos.css'),'utf8');
const html=fs.readFileSync(path.join(root,'restaurant','index.html'),'utf8');

test('approved Takeaway and Delivery POS stays in the existing CARDfy shell',()=>{
  assert.match(app,/page==='takeaway'.+\.\/pos\.js\?v=20260920-pos-ui/);
  assert.match(app,/page==='dinein'.+\.\/pos-dinein\.js\?v=20260920-pos-ui/);
  assert.match(html,/pos\.css\?v=20260920-pos-ui/);
  assert.match(html,/<bdi dir="ltr">CARD<span>fy<\/span><\/bdi>/);
  assert.doesNotMatch(pos,/أحمد محمد|8 سبتمبر 2026|وسط البلد|مدينة نصر/);
  assert.match(legacyDinein,/مخطط الصالة/);
});

test('POS renders real catalog and validates real production modifiers',()=>{
  assert.match(pos,/cfy_os_operational_snapshot/);
  assert.match(pos,/snapshot\.catalog\.categories/);
  assert.match(pos,/snapshot\.catalog\.products/);
  assert.match(pos,/variant_required/);
  assert.match(pos,/min_select/);
  assert.match(pos,/max_select/);
  assert.doesNotMatch(pos,/shawarma-chicken|const products\s*=|deliveryZones\s*=/);
});

test('complete order persists as new for Order Prep and cannot bypass Kitchen',()=>{
  assert.match(pos,/p_intent:'save'/);
  assert.match(pos,/يُرسل الطلب إلى محضّر الطلب أولًا/);
  assert.match(pos,/حالة الطلب: جديد لدى محضّر الطلب/);
  assert.doesNotMatch(pos,/p_intent:'(?:kitchen|pay)'/);
  assert.doesNotMatch(pos,/إرسال للمطبخ/);
});

test('cart supports click-to-edit and merges only identical configurations',()=>{
  assert.match(pos,/card\.onclick=.*selectedId/);
  assert.match(pos,/line\.option_ids/);
  assert.match(pos,/String\(line\.notes\|\|''\)\.trim\(\)/);
  assert.match(pos,/const twin=next\.find\(x=>signature\(x\)===signature\(line\)\)/);
  assert.match(pos,/data-variant/);
  assert.match(pos,/data-option/);
});

test('Delivery fields are required while Takeaway clears address and fee inputs',()=>{
  assert.match(pos,/type!=='delivery'.+delivery_zone_id/);
  assert.match(pos,/data\.order_type==='delivery'.+customer_name\.trim\(\).+phone\.trim\(\).+delivery_zone_id.+address\.trim\(\)/);
  assert.match(pos,/snapshot\.catalog\.delivery_zones/);
  assert.match(pos,/deliveryAllowed=Boolean\(c\.settings\.delivery_enabled\)/);
  assert.match(pos,/if\(type==='delivery'&&!deliveryAllowed\)return/);
  assert.doesNotMatch(pos,/name="coupon_code"/);
});

test('approved POS layout keeps desktop tablet and mobile breakpoints',()=>{
  assert.match(css,/@media\(max-width:1250px\)/);
  assert.match(css,/@media\(max-width:900px\)/);
  assert.match(css,/@media\(max-width:620px\)/);
  assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/overflow:auto/);
});
