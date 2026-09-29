const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {JSDOM}=require('jsdom');
const qrcode=require('qrcode-generator'),decode=require('jsqr');
const root=path.join(__dirname,'..');
const handoff=()=>import(pathToFileURL(path.join(root,'restaurant/customer-handoff.mjs')).href);
const order={reference:'MN-TEST',tracking_token:'test-customer-token',delivery_otp:'123456',total:75,order:{order_type:'delivery',items:[]}};
test('Customer QR decodes to the exact same private tracking URL as the link',async()=>{
  const {customerHandoff}=await handoff();
  const dom=new JSDOM(customerHandoff(order,'https://cardfy.example'));
  const url=dom.window.document.querySelector('a').href;
  assert.equal(url,'https://cardfy.example/menu/track/?ref=MN-TEST&token=test-customer-token');
  const qr=qrcode(0,'M');qr.addData(url);qr.make();
  assert.equal(dom.window.document.querySelector('svg').outerHTML,new JSDOM(qr.createSvgTag({scalable:true})).window.document.querySelector('svg').outerHTML);
  const scale=4,quiet=4,size=(qr.getModuleCount()+quiet*2)*scale,pixels=new Uint8ClampedArray(size*size*4);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
    const row=Math.floor(y/scale)-quiet,col=Math.floor(x/scale)-quiet;
    const dark=row>=0&&col>=0&&row<qr.getModuleCount()&&col<qr.getModuleCount()&&qr.isDark(row,col);
    const i=(y*size+x)*4;pixels[i]=pixels[i+1]=pixels[i+2]=dark?0:255;pixels[i+3]=255;
  }
  assert.equal(decode(pixels,size,size).data,url);
  assert.equal(dom.window.document.querySelector('img'),null); // No external QR service.
  dom.window.close();
});
test('POS receipt integration preserves the private customer handoff and safe print contract',async()=>{
  const {customerHandoff}=await handoff();
  const receipt=fs.readFileSync(path.join(root,'pos-ui/src/integration/ReceiptDialog.tsx'),'utf8');
  const app=fs.readFileSync(path.join(root,'pos-ui/src/App.tsx'),'utf8');
  assert.match(app,/handoffHtml=\{services\.customerHandoff\(receipt\)\}/);
  assert.match(receipt,/dangerouslySetInnerHTML=\{\{__html:handoffHtml\}\}/);
  assert.match(receipt,/win\.document\.write\(.+\$\{handoffHtml\}/);
  const dom=new JSDOM(customerHandoff(order,'https://cardfy.example'));
  assert.ok(dom.window.document.body.textContent.includes('123456'));
  assert.equal(dom.window.document.querySelector('a').href,'https://cardfy.example/menu/track/?ref=MN-TEST&token=test-customer-token');
  assert.equal(customerHandoff({...order,tracking_token:null},'https://cardfy.example'),'');
  const attack=new JSDOM(customerHandoff({...order,reference:'<img src=x onerror=alert(1)>',tracking_token:'" onclick="alert(1)'},'https://cardfy.example'));
  assert.equal(attack.window.document.querySelector('[onclick],img'),null);
  dom.window.close();attack.window.close();
});
