const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const scripts=html=>[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m=>! /\bsrc\s*=/.test(m[1])).map(m=>m[2]);
test('Restaurant logout revokes only the selected role session, including on denied pages',async()=>{
  for(const role of ['cashier','owner']){
    const dom=new JSDOM(read('restaurant/index.html'),{url:'https://cardfy.example/restaurant/?as=staff',runScripts:'outside-only'}),w=dom.window;
    const calls=[];
    w.supabase={createClient:()=>({rpc:async(name,args)=>{calls.push([name,args]);return {data:name==='cfy_os_session'?{role,permissions:[]}:true,error:null};}})};
    w.localStorage.setItem('cardfy_client_token_v1','owner-test-session');
    w.localStorage.setItem('cardfy_menu_staff_token_v1','staff-test-session');
    // Select owner explicitly for the second case without changing the other stored session.
    if(role==='owner')w.history.replaceState(null,'','/restaurant/');
    w.eval(read('restaurant/shared.js').replace(/export /g,'')+'; window.testBoot=boot;');
    await assert.rejects(w.testBoot('settings'),/صلاحية/);
    const button=w.document.querySelector('#osLogout');assert.equal(button.hidden,false);
    await button.onclick();
    assert.equal(calls.at(-1)[0],role==='owner'?'cfy_client_logout':'cfy_menu_staff_logout');
    assert.equal(calls.at(-1)[1].p_token,role==='owner'?'owner-test-session':'staff-test-session');
    assert.equal(w.localStorage.getItem(role==='owner'?'cardfy_client_token_v1':'cardfy_menu_staff_token_v1'),null);
    assert.ok(w.localStorage.getItem(role==='owner'?'cardfy_menu_staff_token_v1':'cardfy_client_token_v1'));
    dom.window.close();
  }
});
function legacy(){
  const dom=new JSDOM('<style id="style-tag"></style><div id="app"></div>',{url:'https://cardfy.example/QBL-TEST',runScripts:'outside-only'});
  dom.window.eval(scripts(read('index.html'))[0]);
  dom.window.cfyTrack=()=>{};
  return dom;
}
function render(w,c,d){const result=w.buildClientBody(c,d,{preview:true});w.document.getElementById('style-tag').textContent=result.style;w.document.getElementById('app').innerHTML=result.body;return result;}

test('Legacy treats stored names/tagline/labels/gallery captions as text',()=>{
  const dom=legacy(),w=dom.window;
  const attack='<img id="injected" src=x onerror="window.pwned=1">';
  render(w,{nameAr:attack,nameEn:attack,tag:attack,gallery:[{src:'https://example.com/a.png',caption:attack}]},{logoTxt:attack,tiles:[{key:'gallery',on:true,label:attack,color:'#123456'}]});
  assert.equal(w.document.querySelector('.c-names .ar').textContent,attack);
  assert.equal(w.document.querySelector('.c-tag').textContent,attack);
  assert.equal(w.document.querySelector('.c-logo-fb').textContent,attack);
  w.cOpenGallery();
  assert.equal(w.document.querySelector('.c-gal-item span').textContent,attack);
  assert.equal(w.document.querySelector('#injected'),null);
  assert.equal(w.pwned,undefined);
  dom.window.close();
});

test('Legacy blocks attribute/script URLs and design injection while retaining valid images',()=>{
  const dom=legacy(),w=dom.window;
  const result=render(w,{nameAr:'مطعم',gallery:[]},{logo:'javascript:alert(1)',bg:'solid',bg1:'red; background:url(https://evil.example)',columns:'2); color:red',tiles:[{key:'custom',on:true,value:'javascript:alert(1)',label:'Website',style:'wide" onmouseover="alert(1)',color:'red" onclick="alert(1)'}]});
  const link=w.document.querySelector('.c-tile');
  assert.equal(link.getAttribute('href'),'#');
  assert.equal(link.hasAttribute('onmouseover'),false);
  assert.equal(link.hasAttribute('onclick'),false);
  assert.equal(result.style.includes('evil.example'),false);
  assert.equal(w.document.querySelector('.c-logo'),null);
  assert.equal(w.normUrl('https://example.com/?x=" onmouseover="alert(1)').startsWith('https://example.com/'),true);
  assert.equal(w.imageUrl('data:text/html,<script>alert(1)</script>'),'');
  assert.equal(w.imageUrl('data:image/webp;base64,AAAA'),'data:image/webp;base64,AAAA');
  assert.equal(w.imageUrl('/logo.svg'),'https://cardfy.example/logo.svg');
  assert.equal(w.normUrl('instagram.com/test'),'https://instagram.com/test');
  dom.window.close();
});

test('Legacy payment copy uses literal data, including quotes and backslashes',()=>{
  const dom=legacy(),w=dom.window;
  const value="123\\');window.pwned=1;//\"&<";
  render(w,{nameAr:'مطعم',voda:value,insta:value,gallery:[]},{tiles:[{key:'vodafone',on:true,label:'Copy',color:'#123456'}]});
  const button=w.document.querySelector('[data-copy-text]');
  assert.equal(button.dataset.copyText,value);
  // Execute the real constant handler with the DOM element as its receiver.
  let copied;w.cCopyText=(_,text)=>copied=text;
  w.Function(button.getAttribute('onclick')).call(button);
  assert.equal(copied,value);assert.equal(w.pwned,undefined);
  dom.window.close();
});

test('Legacy normal QR content, gallery/lightbox and expired screen remain functional',()=>{
  const dom=legacy(),w=dom.window;
  render(w,{nameAr:'مطعم شاورما البلد',nameEn:'Restaurant',tag:'أهلًا',phone:'01012345678',gallery:[{src:'/meal.webp',caption:'وجبة'}]},{columns:2,bg:'gradient',bg1:'#fff6ec',bg2:'#6d4df6',logo:'/logo.svg',tiles:[{key:'whatsapp',on:true,label:'واتساب',color:'#25d366'},{key:'gallery',on:true,label:'الصور',color:'#123456'}]});
  assert.equal(w.document.querySelector('.c-names .ar').textContent,'مطعم شاورما البلد');
  assert.equal(w.document.querySelectorAll('.c-tile').length,2);
  assert.equal(w.document.querySelector('a.c-tile').href,'https://wa.me/01012345678');
  w.cOpenGallery();w.cLightbox(0);
  assert.equal(w.document.querySelector('#cLbImg').src,'https://cardfy.example/meal.webp');
  assert.equal(w.document.querySelector('#cLbCap').textContent,'وجبة');
  const expired=w.buildClientBody({nameAr:'<img id="attack">',end:'2000-01-01'},{});
  w.document.getElementById('app').innerHTML=expired.body;
  assert.equal(w.document.querySelector('#attack'),null);
  assert.match(w.document.body.textContent,/انتهى اشتراك/);
  dom.window.close();
});

test('Client home escapes identity fields and preserves enabled-service navigation',()=>{
  const dom=new JSDOM('<div id="app"></div>',{url:'https://cardfy.example/client-dashboard.html',runScripts:'outside-only'}),w=dom.window;
  w.supabase={createClient:()=>({rpc:async()=>({})})};
  w.eval(scripts(read('client-dashboard.html'))[0]);
  const attack='<img id="attack" src=x onerror="alert(1)">';
  w.renderHome({client:{brand_name_ar:attack,code:attack,business_type:attack},services:['menu']});
  assert.equal(w.document.querySelector('h1').textContent,attack);
  assert.equal(w.document.querySelector('#attack'),null);
  assert.equal(w.document.querySelectorAll('.service').length,1);
  assert.equal(w.document.querySelector('.service').getAttribute('href'),'/restaurant/');
  w.loginUI(attack);assert.equal(w.document.querySelector('#err').textContent,attack);
  dom.window.close();
});

async function settings(){
  const dom=new JSDOM(read('dashboard/menu/settings.html'),{url:'https://cardfy.example/dashboard/menu/settings.html',runScripts:'outside-only'}),w=dom.window;
  const ticks=[],calls=[];let fail=false;
  const state={settings:{payment_methods:['cash','card_at_venue','pay_on_delivery']},tables:[],staff:[]};
  w.setInterval=fn=>{ticks.push(fn);return ticks.length};
  w.MenuOwner={safe:String,money:String,toast:()=>{},boot:async()=>({key:'local-test',session:{client:{code:'TEST'}},ops:state}),sb:{rpc:async(fn,args)=>{
    calls.push({fn,args});
    if(fn==='cfy_menu_operational_snapshot')return {data:state};
    if(fail)return {error:{message:'test failure'}};
    Object.assign(state.settings,args.p_data);
    return {data:{...state.settings}};
  }}};
  w.eval(read('dashboard/menu/settings.js'));
  w.eval(read('dashboard/menu/settings-final-polish.js'));
  w.eval(read('dashboard/menu/settings-demo-support.js'));
  await new Promise(resolve=>setImmediate(resolve));
  return {dom,w,ticks,calls,state,setFail:v=>fail=v};
}

test('Payment edits survive repeated 700ms callbacks and save the chosen methods',async()=>{
  const {dom,w,ticks,calls}=await settings();
  const field=w.document.querySelector('[data-pay-method="card_at_venue"]');
  field.click();
  for(let i=0;i<5;i++)ticks.forEach(fn=>fn());
  assert.equal(w.document.querySelector('[data-pay-method="card_at_venue"]'),field);
  assert.equal(field.checked,false);
  await w.saveGeneral();
  assert.deepEqual(Array.from(calls.at(-1).args.p_data.payment_methods),['cash','pay_on_delivery']);
  await w.reload();
  assert.equal(w.document.querySelector('[data-pay-method="card_at_venue"]').checked,false);
  dom.window.close();
});

test('Failed settings save keeps edits; printing save does not accidentally save payment edits',async()=>{
  const {dom,w,ticks,calls,setFail}=await settings();
  const field=w.document.querySelector('[data-pay-method="cash"]');field.click();
  setFail(true);await w.saveGeneral();ticks.forEach(fn=>fn());
  assert.equal(field.checked,false);
  assert.match(w.document.querySelector('#generalStatus').textContent,/تعذر الحفظ/);
  setFail(false);await w.savePrint();
  assert.equal('payment_methods' in calls.at(-1).args.p_data,false);
  assert.equal(field.checked,false);
  dom.window.close();
});

test('All tracked frontend JavaScript and inline scripts parse',()=>{
  const {execFileSync}=require('node:child_process');
  const files=execFileSync('git',['ls-files'],{cwd:root,encoding:'utf8'}).trim().split(/\r?\n/);
  for(const file of files){
    if(file.endsWith('.js'))assert.doesNotThrow(()=>file.startsWith('restaurant/')?execFileSync(process.execPath,['--check',file],{cwd:root}):new Function(read(file)),file);
    if(file.endsWith('.html'))for(const script of scripts(read(file)))assert.doesNotThrow(()=>new Function(script),file);
  }
});
