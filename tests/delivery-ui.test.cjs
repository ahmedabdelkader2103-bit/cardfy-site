const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createRequire}=require('node:module');
const ts=require('../delivery-ui/node_modules/typescript');
const file=path.resolve(__dirname,'../delivery-ui/src/integration.ts');
const packages=createRequire(path.resolve(__dirname,'../delivery-ui/package.json'));
const moduleSource=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const loaded={exports:{}};
new Function('require','module','exports',moduleSource)(packages,loaded,loaded.exports);
const {mapDeliveryOrder}=loaded.exports;
test('Delivery order mapping preserves actual invoice, addons and collection state without exposing OTP',()=>{
 const o=mapDeliveryOrder({id:'actual',reference:'REF',status:'on_the_way',created_at:'2026-09-14T10:00:00Z',phone:'01012345678',address:'عنوان',delivery_fee:20,total:125,payment_method:'pay_on_delivery',payment_status:'unpaid',delivery_otp:'secret',items:[{id:'i',quantity:2,snapshot:{product:{name_ar:'منتج'},variant:{name:'كبير'},options:[{name:'جبنة'}],notes:'بدون بصل'}}]});
 assert.equal(o.status,'on_the_way');assert.equal(o.total,125);assert.equal(o.deliveryFee,20);assert.equal(o.paymentState,'due');assert.equal(o.paymentLabel,'دفع عند الاستلام');assert.equal(o.whatsapp,'201012345678');assert.equal(o.distanceKm,null);assert.equal(o.otp,undefined);assert.equal(o.items[0].name,'منتج · كبير · جبنة · بدون بصل');assert.equal(o.items[0].quantity,2);
});
test('Exceptional delivery retains pending customer verification and does not fabricate payment collection',()=>{
 const o=mapDeliveryOrder({id:'actual',reference:'REF',status:'delivered',created_at:'2026-09-14T10:00:00Z',receipt_verification:'pending',payment_method:'cash',payment_status:'unpaid',total:75});
 assert.equal(o.status,'delivered');assert.equal(o.paymentState,'due');assert.match(o.notes,/بانتظار تأكيد استلام العميل/);
});
