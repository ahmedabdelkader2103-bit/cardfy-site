const SUPA_URL='https://ytixcczbjmjnuotzavbb.supabase.co';
const SUPA_KEY='sb_publishable_0j9jf0boDrMGGO8S6mw-4Q_5bOeHIuU';
const TOKEN_KEY='cardfy_client_token_v1';
const sb=window.supabase.createClient(SUPA_URL,SUPA_KEY);

const state={token:'',session:null,snapshot:null,settings:{},saving:false};
const qs=(s,r=document)=>r.querySelector(s);
const qsa=(s,r=document)=>[...r.querySelectorAll(s)];

function safe(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(msg){const el=qs('#toast');el.textContent=msg;el.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('on'),2400)}
function setStatus(id,msg,type=''){const el=qs(id);if(!el)return;el.textContent=msg||'';el.className='status'+(type?' '+type:'')}
function objectHasData(o){return o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).length>0}
function normalSettings(raw={}){
  return {
    display_name:raw.display_name||'',description:raw.description||'',logo_url:raw.logo_url||'',cover_url:raw.cover_url||'',
    restaurant_phone:raw.restaurant_phone||'',restaurant_whatsapp:raw.restaurant_whatsapp||'',address:raw.address||'',map_link:raw.map_link||'',
    theme_mode:raw.theme_mode||'light',accent_color:/^#[0-9a-f]{6}$/i.test(raw.accent_color||'')?raw.accent_color:'#ff6b1a',layout_preset:raw.layout_preset||'classic',
    show_cover:raw.show_cover!==false,show_description:raw.show_description!==false,show_contact_buttons:raw.show_contact_buttons!==false,
    restaurant_open:raw.restaurant_open!==false,opening_hours:raw.opening_hours||{},delivery_enabled:raw.delivery_enabled!==false,
    takeaway_enabled:raw.takeaway_enabled!==false,dinein_enabled:raw.dinein_enabled===true,currency:raw.currency||'EGP'
  };
}

async function boot(){
  state.token=localStorage.getItem(TOKEN_KEY)||'';
  if(!state.token){location='/client-dashboard.html';return}
  const {data:s,error:se}=await sb.rpc('cfy_client_session',{p_token:state.token});
  if(se||!s?.client||!(s.services||[]).includes('menu')){location='/client-dashboard.html';return}
  state.session=s;
  const {data:snap,error}=await sb.rpc('cfy_menu_manage_snapshot',{p_token:state.token});
  if(error){renderFatal('تعذر تحميل بيانات Professional Menu حاليًا.');return}
  state.snapshot=snap||{};
  state.settings=normalSettings(state.snapshot.settings||{});
  hydrateShell();bindUI();hydrateForms();renderChecklist();renderPreview();
}

function renderFatal(msg){document.body.innerHTML=`<div class="main"><div class="error-box">${safe(msg)}</div><p><a href="/client-dashboard.html">رجوع للخدمات</a></p></div>`}

function hydrateShell(){
  const c=state.session.client;
  qs('#restaurantChip').innerHTML=`<b>${safe(c.brand_name_ar||c.brand_name_en||'CARDfy Client')}</b><span>${safe(c.code)}</span>`;
  qs('#topTitle').textContent=state.settings.display_name||c.brand_name_ar||c.brand_name_en||'Professional Menu';
  qs('#clientCode').textContent=c.code;
  if(state.session.admin_session){const b=qs('#adminBadge');b.hidden=false;b.textContent='دخول إدارة مؤقت'}
  qs('#appLoading').hidden=true;qs('#appContent').hidden=false;
}

function bindUI(){
  qsa('.nav button').forEach(btn=>btn.addEventListener('click',()=>{
    if(btn.dataset.section!=='tools'){toast(btn.dataset.message||'سيتم تنفيذ هذا القسم في مرحلة لاحقة.');return}
    qsa('.nav button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
  }));
  qsa('.tools-tabs button').forEach(btn=>btn.addEventListener('click',()=>switchTab(btn.dataset.tab)));
  qs('#saveProfile').addEventListener('click',saveProfile);
  qs('#saveAppearance').addEventListener('click',saveAppearance);
  qs('#logoInput').addEventListener('change',e=>uploadAsset(e,'logo_url','#logoStatus'));
  qs('#coverInput').addEventListener('change',e=>uploadAsset(e,'cover_url','#coverStatus'));
  ['displayName','description','restaurantPhone','restaurantWhatsapp','address','mapLink'].forEach(id=>qs('#'+id).addEventListener('input',renderPreviewFromForm));
  qs('#accentColor').addEventListener('input',()=>{qs('#accentText').value=qs('#accentColor').value;renderPreviewFromForm()});
  qs('#accentText').addEventListener('input',()=>{if(/^#[0-9a-f]{6}$/i.test(qs('#accentText').value)){qs('#accentColor').value=qs('#accentText').value;renderPreviewFromForm()}});
  qsa('input[name=themeMode],input[name=layoutPreset]').forEach(x=>x.addEventListener('change',renderPreviewFromForm));
  ['showCover','showDescription','showContactButtons'].forEach(id=>qs('#'+id).addEventListener('change',renderPreviewFromForm));
  qs('#refreshPreview').addEventListener('click',()=>{hydrateForms();renderPreview();toast('تم تحديث المعاينة من البيانات المحفوظة')});
}

function switchTab(tab){
  qsa('.tools-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  qsa('.panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===tab));
}

function hydrateForms(){
  const s=state.settings;
  qs('#displayName').value=s.display_name||'';qs('#description').value=s.description||'';qs('#restaurantPhone').value=s.restaurant_phone||'';
  qs('#restaurantWhatsapp').value=s.restaurant_whatsapp||'';qs('#address').value=s.address||'';qs('#mapLink').value=s.map_link||'';
  qs('#logoUrl').value=s.logo_url||'';qs('#coverUrl').value=s.cover_url||'';renderThumb('#logoThumb',s.logo_url,'Logo');renderThumb('#coverThumb',s.cover_url,'Cover');
  const theme=qs(`input[name=themeMode][value="${s.theme_mode}"]`);if(theme)theme.checked=true;
  const layout=qs(`input[name=layoutPreset][value="${s.layout_preset}"]`);if(layout)layout.checked=true;
  qs('#accentColor').value=s.accent_color;qs('#accentText').value=s.accent_color;
  qs('#showCover').checked=s.show_cover;qs('#showDescription').checked=s.show_description;qs('#showContactButtons').checked=s.show_contact_buttons;
}

function renderThumb(selector,url,fallback){const el=qs(selector);el.innerHTML=url?`<img src="${safe(url)}" alt="">`:safe(fallback)}

function previewSettingsFromForm(){
  const selected=(name,def)=>qs(`input[name=${name}]:checked`)?.value||def;
  return {...state.settings,
    display_name:qs('#displayName').value.trim(),description:qs('#description').value,restaurant_phone:qs('#restaurantPhone').value.trim(),
    restaurant_whatsapp:qs('#restaurantWhatsapp').value.trim(),address:qs('#address').value,map_link:qs('#mapLink').value,
    logo_url:qs('#logoUrl').value,cover_url:qs('#coverUrl').value,theme_mode:selected('themeMode','light'),layout_preset:selected('layoutPreset','classic'),
    accent_color:/^#[0-9a-f]{6}$/i.test(qs('#accentText').value.trim())?qs('#accentText').value.trim():state.settings.accent_color,
    show_cover:qs('#showCover').checked,show_description:qs('#showDescription').checked,show_contact_buttons:qs('#showContactButtons').checked
  };
}
function renderPreviewFromForm(){renderPreview(previewSettingsFromForm())}

async function saveSettings(payload,statusSelector){
  if(state.saving)return null;state.saving=true;setStatus(statusSelector,'جاري الحفظ...');
  const {data,error}=await sb.rpc('cfy_menu_save_tools_settings',{p_token:state.token,p_data:payload});
  state.saving=false;
  if(error){setStatus(statusSelector,'تعذر الحفظ: '+error.message,'err');return null}
  state.settings=normalSettings({...state.settings,...data});
  state.snapshot.settings={...(state.snapshot.settings||{}),...data};
  setStatus(statusSelector,'تم الحفظ بنجاح','ok');renderChecklist();hydrateShell();renderPreview();return data;
}

async function saveProfile(){
  const payload={display_name:qs('#displayName').value.trim(),description:qs('#description').value,restaurant_phone:qs('#restaurantPhone').value.trim(),restaurant_whatsapp:qs('#restaurantWhatsapp').value.trim(),address:qs('#address').value,map_link:qs('#mapLink').value,logo_url:qs('#logoUrl').value,cover_url:qs('#coverUrl').value};
  await saveSettings(payload,'#profileStatus');
}
async function saveAppearance(){
  const accent=qs('#accentText').value.trim();if(!/^#[0-9a-f]{6}$/i.test(accent)){setStatus('#appearanceStatus','لون Accent غير صالح. استخدم صيغة مثل #ff6b1a','err');return}
  const payload={theme_mode:qs('input[name=themeMode]:checked')?.value||'light',layout_preset:qs('input[name=layoutPreset]:checked')?.value||'classic',accent_color:accent,show_cover:qs('#showCover').checked,show_description:qs('#showDescription').checked,show_contact_buttons:qs('#showContactButtons').checked};
  await saveSettings(payload,'#appearanceStatus');
}

async function uploadAsset(event,key,statusSelector){
  const file=event.target.files?.[0];if(!file)return;
  setStatus(statusSelector,'جاري رفع الصورة...');
  try{
    const result=await CardfyAssets.upload('menu',file);
    if(!result?.url)throw new Error('upload_failed');
    const data=await saveSettings({[key]:result.url},statusSelector);
    if(!data)return;
    const input=key==='logo_url'?'#logoUrl':'#coverUrl';const thumb=key==='logo_url'?'#logoThumb':'#coverThumb';
    qs(input).value=result.url;renderThumb(thumb,result.url,key==='logo_url'?'Logo':'Cover');renderPreview();
  }catch(e){setStatus(statusSelector,'تعذر رفع الصورة: '+(e.message||'upload_failed'),'err')}
  finally{event.target.value=''}
}

function renderChecklist(){
  const s=state.settings,cats=state.snapshot.categories||[],products=state.snapshot.products||[];
  const checks=[
    ['بيانات المطعم',!!(s.display_name&&(s.restaurant_phone||s.restaurant_whatsapp))],
    ['الهوية البصرية',!!s.logo_url],
    ['قسم واحد على الأقل',cats.length>0],
    ['منتج واحد على الأقل',products.length>0],
    ['نوع طلب مفعّل',!!(s.delivery_enabled||s.takeaway_enabled||s.dinein_enabled)],
    ['ساعات العمل',objectHasData(s.opening_hours)]
  ];
  const done=checks.filter(x=>x[1]).length,pct=Math.round(done/checks.length*100);
  qs('#setupPct').textContent=pct+'%';qs('#setupBar').style.width=pct+'%';
  qs('#checklist').innerHTML=checks.map(([label,ok])=>`<div class="check ${ok?'ok':''}"><span class="dot">${ok?'✓':'·'}</span><span>${safe(label)}</span></div>`).join('');
}

function renderPreview(settings=state.settings){
  const p=qs('#menuPreview');if(!p)return;
  const c=state.session.client;const name=settings.display_name||c.brand_name_ar||c.brand_name_en||'اسم المطعم';
  p.className='preview '+(settings.theme_mode==='dark'?'dark ':'')+'layout-'+settings.layout_preset;
  p.style.setProperty('--accent',settings.accent_color||'#ff6b1a');
  const cover=qs('#previewCover');cover.classList.toggle('hidden',!settings.show_cover);
  cover.style.backgroundImage=settings.show_cover&&settings.cover_url?`url("${settings.cover_url.replace(/"/g,'')}")`:'';
  qs('#previewLogo').innerHTML=settings.logo_url?`<img src="${safe(settings.logo_url)}" alt="">`:safe(name.slice(0,2));
  qs('#previewName').textContent=name;
  qs('#previewDescription').textContent=settings.description||'وصف قصير للمطعم يظهر هنا.';
  qs('#previewDescription').hidden=!settings.show_description;
  const contacts=[];if(settings.restaurant_phone)contacts.push('اتصال');if(settings.restaurant_whatsapp)contacts.push('واتساب');if(settings.map_link||settings.address)contacts.push('الموقع');
  qs('#previewContacts').innerHTML=(contacts.length?contacts:['تواصل']).map(x=>`<span class="contact-chip">${safe(x)}</span>`).join('');
  qs('#previewContacts').hidden=!settings.show_contact_buttons;
  renderPreviewCatalog();
}

function renderPreviewCatalog(){
  const cats=(state.snapshot.categories||[]).filter(x=>x.enabled!==false).slice(0,4);
  const products=(state.snapshot.products||[]).filter(x=>x.enabled!==false).slice(0,4);
  qs('#previewCats').innerHTML=(cats.length?cats:[{name_ar:'الأكثر طلبًا'},{name_ar:'برجر'},{name_ar:'مشروبات'}]).map((x,i)=>`<span class="cat ${i===0?'on':''}">${safe(x.name_ar||x.name||'قسم')}</span>`).join('');
  qs('#previewProducts').innerHTML=(products.length?products:[{name_ar:'مثال منتج',base_price:120},{name_ar:'مثال منتج',base_price:85},{name_ar:'مثال منتج',base_price:150},{name_ar:'مثال منتج',base_price:65}]).map(x=>`<div class="product-card" style="${x.available===false?'opacity:.55;':''}"><div class="product-img" ${x.image_url?`style="background-image:url('${safe(x.image_url)}');background-size:cover;background-position:center"`:''}></div><div class="product-info"><b>${x.featured?'★ ':''}${safe(x.name_ar||'منتج')}</b><span>${safe(x.base_price??'')} ${safe(state.settings.currency||'EGP')}${x.available===false?' · غير متاح':''}</span></div></div>`).join('');
  qs('#previewNote').textContent=products.length?'المعاينة تستخدم الأقسام والمنتجات المحفوظة فعليًا.':'أضف أقسامًا ومنتجات من تبويب الأقسام والمنتجات.';
}

function loadPhase2(){
  const css=document.createElement('link');css.rel='stylesheet';css.href='/dashboard/menu/catalog.css';document.head.appendChild(css);
  const cat=document.createElement('script');cat.src='/dashboard/menu/catalog.js';cat.onload=()=>{const init=document.createElement('script');init.src='/dashboard/menu/phase2-init.js';document.body.appendChild(init)};document.body.appendChild(cat);
}
loadPhase2();
boot();
