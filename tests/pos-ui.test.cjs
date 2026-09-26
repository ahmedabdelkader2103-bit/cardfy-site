const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'..');
const pos=fs.readFileSync(path.join(root,'restaurant','pos.js'),'utf8');
const legacyDinein=fs.readFileSync(path.join(root,'restaurant','pos-dinein.js'),'utf8');
const app=fs.readFileSync(path.join(root,'restaurant','app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'restaurant','pos.css'),'utf8');
const html=fs.readFileSync(path.join(root,'restaurant','index.html'),'utf8');

test('approved Takeaway and Delivery POS stays in the existing CARDfy shell',()=>{
  assert.match(app,/page==='takeaway'.+\.\/pos\.js\?v=20260922-pos-ui/);
  assert.match(app,/page==='dinein'.+\.\/pos-dinein\.js\?v=20260922-pos-ui/);
  assert.match(html,/pos\.css\?v=20260922-pos-ui/);
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
  assert.match(css,/@media\(max-width:1320px\)/);
  assert.match(css,/@media\(max-width:900px\)/);
  assert.match(css,/@media\(max-width:620px\)/);
  assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/overflow-y:auto/);
  assert.match(css,/\.pos-workspace\{display:grid.+height:calc\(100dvh - 98px\)/);
  assert.match(css,/\.pos-order\{position:static/);
  assert.match(css,/\.pos-product:hover.+translateY\(-4px\)/);
});

test('POS uses the approved hero and keeps operational fields secondary',()=>{
  assert.match(pos,/pos-brand-banner\.jpg/);
  assert.match(pos,/طعم أصيل/);
  assert.match(pos,/<details class="pos-settings">/);
  assert.match(pos,/syncPaymentMethods/);
  assert.match(pos,/class="pos-header"/);
  assert.match(pos,/class="pos-global-search"/);
  assert.match(pos,/data-filter="popular"/);
  assert.match(pos,/data-filter="new"/);
  assert.match(pos,/class="pos-footer"/);
  assert.match(pos,/<bdi dir="ltr">CARD<em>fy<\/em><\/bdi>/);
  assert.doesNotMatch(pos,/class="pos-meta"/);
});

test('Delivery and Takeaway toggles keep real order payload and payment contracts aligned',async()=>{
  const dom=new JSDOM('<!doctype html><body><div id="osStatus"></div><div id="osContent"></div></body>',{url:'https://cardfy.example/restaurant/?page=takeaway',runScripts:'outside-only'}),w=dom.window;
  const catalog={settings:{delivery_enabled:true,payment_methods:['cash','card_at_venue','pay_on_delivery']},categories:[],products:[{id:'p1',name_ar:'منتج',base_price:10,available:true,variant_required:false,variants:[],option_groups:[]}],delivery_zones:[]};
  w.catalog=catalog;
  w.crypto.randomUUID=()=>String(Math.random());
  w.eval(`const context={client_id:'client',id:'staff',token:'token'};const $=selector=>document.querySelector(selector);const esc=value=>String(value??'');const money=value=>String(value);const status=()=>{};const customerHandoff=()=>'';const run=async(button,action)=>action();const rpc=async name=>name==='cfy_os_operational_snapshot'?{catalog:window.catalog,branches:[{id:'b1',name:'الفرع'}]}:{};`+pos.replace(/^import .*;\r?\n/gm,'').replace(/export /g,'')+';window.testMount=mountPOS;window.testPayload=payload;');
  await w.testMount('takeaway');
  w.document.querySelector('[data-product]').click();
  w.document.querySelector('[data-type="takeaway"]').click();
  assert.equal(w.testPayload().order_type,'takeaway');
  assert.equal(w.document.querySelector('#addressPOS').hidden,true);
  assert.deepEqual([...w.document.querySelector('[name="payment_method"]').options].map(option=>option.value),['cash','card_at_venue']);
  w.document.querySelector('[data-type="delivery"]').click();
  assert.equal(w.testPayload().order_type,'delivery');
  assert.equal(w.document.querySelector('#addressPOS').hidden,false);
  assert.deepEqual([...w.document.querySelector('[name="payment_method"]').options].map(option=>option.value),['cash','pay_on_delivery']);
  dom.window.close();
});
