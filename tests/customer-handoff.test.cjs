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
test('POS save and customer receipt expose matching handoff without recording payment',async()=>{
  const {customerHandoff}=await handoff();
  const dom=new JSDOM('<div id="osStatus"></div>',{url:'https://cardfy.example/restaurant/',runScripts:'outside-only'}),w=dom.window;
  w.esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));w.money=v=>String(v);w.customerHandoff=r=>customerHandoff(r,w.location.origin);
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true};
  let printed='',printCount=0;w.open=()=>({document:{write:text=>printed=text,close(){}},print:()=>printCount++});
  w.eval(fs.readFileSync(path.join(root,'restaurant/pos.js'),'utf8').replace(/^import .*;\r?\n/gm,'').replace(/export /g,''));
  w.receipt(order,false);
  const dialog=w.document.querySelector('dialog');assert.equal(dialog.querySelector('h2').textContent,'تم حفظ الطلب');
  assert.ok(dialog.textContent.includes('123456'));
  dialog.querySelector('.primary').click();
  assert.equal(printCount,1);assert.equal(new JSDOM(printed).window.document.querySelector('a').href,dialog.querySelector('a').href);
  assert.equal(customerHandoff({...order,tracking_token:null},w.location.origin),'');
  const attack=new JSDOM(customerHandoff({...order,reference:'<img src=x onerror=alert(1)>',tracking_token:'" onclick="alert(1)'},w.location.origin));
  assert.equal(attack.window.document.querySelector('[onclick],img'),null);
  dom.window.close();attack.window.close();
});
