// Run after the POS build: node --test tests/pos-responsive.browser.cjs
// Requires Playwright and its Chromium browser. All data/RPCs are synthetic.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const viewports=[[390,844],[768,900],[1023,600],[1024,600],[1366,650],[1366,768],[1920,650],[1920,900],[1366,759],[1366,760],[1366,761],[1024,500]];
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png'};

async function geometry(page){return page.evaluate(()=>{
 const aside=document.querySelector('#lovablePosRoot aside');
 const panels=[...aside.children],current=panels[1],summary=panels[2],notes=current.querySelector('input');
 const buttons=[...summary.querySelectorAll('button')],complete=buttons.find(b=>b.textContent.includes('إتمام الطلب')),save=buttons.find(b=>b.textContent.includes('حفظ الطلب'));
 const rect=e=>{const r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,width:r.width,height:r.height};};
 const cart=current.children[1],n=rect(notes),s=rect(summary),c=rect(current),a=rect(aside);
 return {viewport:[innerWidth,innerHeight],notes:n,summary:s,current:c,aside:a,complete:rect(complete),save:rect(save),
  buttons:buttons.map(rect),cart:rect(cart),cartOverflow:cart.scrollHeight>cart.clientHeight+1,
  cartScroll:cart.scrollTop,asideOverflow:aside.scrollHeight>aside.clientHeight+1,
  horizontal:document.documentElement.scrollWidth>innerWidth+1,
  notesExposed:document.elementFromPoint(n.left+n.width/2,n.top+n.height/2)===notes,
  font:getComputedStyle(notes).fontFamily,
  gap:getComputedStyle(aside).gap,notesHeight:getComputedStyle(notes).height,
  primaryBackground:getComputedStyle(complete).backgroundImage,secondaryBackground:getComputedStyle(save).backgroundImage,
  gridColumns:getComputedStyle(document.querySelector('#lovablePosRoot main')).gridTemplateColumns,
 };
});}

test('POS panels never overlap and compact checkout stays reachable across height/width boundaries',async t=>{
 const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const base=pathname.startsWith('/baseline/')&&process.env.CARDFY_POS_BASELINE?path.resolve(process.env.CARDFY_POS_BASELINE):root;
  const filename=path.resolve(base,'.'+(base===root?pathname:pathname.slice('/baseline'.length)));
  if(!filename.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(filename,(error,body)=>{res.writeHead(error?404:200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream'});res.end(error?'not found':body);});
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 const browser=await chromium.launch({headless:true,...(process.env.CARDFY_BROWSER_CHANNEL?{channel:process.env.CARDFY_BROWSER_CHANNEL}:{})});t.after(()=>browser.close());
 const page=await browser.newPage();
 // Permit fonts and this local fixture only; no Supabase or other remote API.
 await page.route('**/*',route=>{const url=new URL(route.request().url());return url.hostname==='127.0.0.1'||['fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname)?route.continue():route.abort();});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let cases=0;
 for(const [width,height] of viewports)for(const mode of ['pickup','delivery'])for(const cart of ['empty','long']){
  await page.setViewportSize({width,height});
  const fixtureUrl=`http://127.0.0.1:${server.address().port}/tests/fixtures/pos-responsive.html?mode=${mode}&cart=${cart}&longZone=1${width>=1024&&height<760?'&stressZone=1':''}`;
  let baseline;
  if(process.env.CARDFY_POS_BASELINE&&(width<1024||height>=760)){
   await page.goto(fixtureUrl+'&baseline=1');
   await page.getByRole('heading',{name:/الطلب الحالي/}).waitFor();await page.evaluate(()=>document.fonts.ready);
   baseline=await geometry(page);
  }
  await page.goto(fixtureUrl);
  await page.getByRole('heading',{name:/الطلب الحالي/}).waitFor();await page.evaluate(()=>document.fonts.ready);
  const g=await geometry(page),label=`${width}x${height} ${mode} ${cart}`;
  if(baseline)assert.deepEqual(g,baseline,`${label}: normal layout differs from original HEAD`);
  assert.equal(g.horizontal,false,`${label}: horizontal overflow`);
  assert.ok(g.notes.bottom<=g.current.bottom+1,`${label}: notes overflow current-order panel`);
  assert.ok(g.current.bottom<=g.summary.top,`${label}: summary overlaps current panel`);
  assert.ok(g.notes.bottom<=g.summary.top,`${label}: summary overlaps notes`);
  if(width>=1024&&height>=600){
   assert.equal(g.asideOverflow,false,`${label}: normal laptop requires column scrolling`);
   assert.equal(g.notesExposed,true,`${label}: notes obscured`);
   for(const b of g.buttons)assert.ok(b.bottom<=height&&b.top>=0,`${label}: action outside viewport`);
  }
  if(width>=1024&&height<760){
   assert.equal(g.complete.top,g.save.top,`${label}: compact checkout not on same row`);
   assert.ok(g.complete.width>g.save.width*1.7,`${label}: primary action loses dominance`);
   assert.ok(g.complete.height>=44&&g.save.height>=44,`${label}: small action target`);
   if(mode==='delivery'){const address=g.buttons[2];assert.ok(address.top>=g.complete.bottom,`${label}: address must be below checkout`);assert.ok(address.width>g.complete.width,`${label}: address must span row`);}
  }else{
   assert.ok(g.save.top>=g.complete.bottom,`${label}: normal checkout arrangement changed`);
   assert.equal(g.notesHeight,'44px',`${label}: normal notes height changed`);
  }
  if(width>=1024&&cart==='long'){
   assert.equal(g.cartOverflow,true,`${label}: long cart should scroll internally`);
   await page.locator('aside > div:nth-child(2) > div:nth-child(2)').evaluate(e=>{e.scrollTop=100;});
   const after=await geometry(page);assert.ok(after.cartScroll>0,`${label}: cart cannot scroll`);
   assert.deepEqual(after.notes,g.notes,`${label}: cart scrolling moves notes`);
   assert.deepEqual(after.summary,g.summary,`${label}: cart scrolling moves summary`);
  }
  if(width<1024||height===500){
   for(const button of await page.locator('aside').getByRole('button').all()){
    await button.scrollIntoViewIfNeeded();
    const rect=await button.boundingBox();assert.ok(rect.y>=0&&rect.y+rect.height<=height+1,`${label}: fallback action unreachable`);
   }
  }
  if(width===1366&&height===650&&mode==='delivery'&&cart==='long'){
   if(process.env.CARDFY_POS_SCREENSHOTS){fs.mkdirSync(process.env.CARDFY_POS_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.CARDFY_POS_SCREENSHOTS,'compact-delivery-1366x650.png')});}
   await page.getByRole('button',{name:'تعديل العنوان',exact:true}).click();
   await page.getByRole('dialog').waitFor();
   assert.equal(await page.getByRole('dialog').isVisible(),true,'address dialog remains reachable');
  }
  cases++;
 }
 assert.deepEqual(errors,[],'no fixture runtime errors');
 console.log(`Verified ${cases} responsive combinations, including long modifiers and long delivery zones${process.env.CARDFY_POS_BASELINE?', with exact original-layout comparisons outside compact mode':''}.`);
});
