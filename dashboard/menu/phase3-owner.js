(function(){
let started=false;
function val(id){return document.getElementById(id)}
function modeLabel(v){return v==='cafe'?'كافيه / خدمة ترابيزات':v==='hybrid'?'هجين — مطعم + كافيه':'مطعم'}
function renderOperatingPanel(){
  const panel=document.querySelector('[data-panel="delivery"]');if(!panel)return;
  const s=state.snapshot?.settings||{};
  panel.innerHTML=`<div class="section-title"><div><h3>نظام التشغيل وأنواع الطلب</h3><div class="muted">نفس Professional Menu يعمل كمطعم أو كافيه أو نظام هجين — بدون أنظمة منفصلة.</div></div></div>
  <div class="choice-grid" style="margin-top:14px">
    <label class="choice"><input type="radio" name="operatingMode" value="restaurant" ${(!s.operating_mode||s.operating_mode==='restaurant')?'checked':''}><strong>مطعم</strong><span>Delivery / Takeaway / Dine-in حسب الخدمات المفعلة.</span></label>
    <label class="choice"><input type="radio" name="operatingMode" value="cafe" ${s.operating_mode==='cafe'?'checked':''}><strong>كافيه / ترابيزات</strong><span>Dine-in هو الأساس، مع إمكانية تفعيل باقي الأنواع.</span></label>
    <label class="choice"><input type="radio" name="operatingMode" value="hybrid" ${s.operating_mode==='hybrid'?'checked':''}><strong>هجين</strong><span>مطعم + كافيه بنفس الـCore والـSettings.</span></label>
  </div>
  <div class="toggles" style="margin-top:16px">
    <label class="toggle"><span>Delivery</span><input id="opDelivery" type="checkbox" ${s.delivery_enabled!==false?'checked':''}></label>
    <label class="toggle"><span>Takeaway</span><input id="opTakeaway" type="checkbox" ${s.takeaway_enabled!==false?'checked':''}></label>
    <label class="toggle"><span>Dine-in</span><input id="opDinein" type="checkbox" ${s.dinein_enabled===true?'checked':''}></label>
    <label class="toggle"><span>Table QR Ordering</span><input id="opTableQr" type="checkbox" ${s.table_qr_enabled===true?'checked':''}></label>
  </div>
  <div class="phase-note">Table QR اختياري. عند إيقافه يظل Dine-in متاحًا للكاشير أو فريق التشغيل من الـPOS، وتظل نفس بنية المنيو مستخدمة في كل أوضاع التشغيل.</div>
  <div class="save-row"><button id="saveOperating" class="btn">حفظ نظام التشغيل</button><div id="operatingStatus" class="status"></div></div>`;
  val('opTableQr').addEventListener('change',()=>{if(val('opTableQr').checked&&!val('opDinein').checked){val('opDinein').checked=true;toast('تم تفعيل Dine-in لأن Table QR يحتاجه')}});
  val('opDinein').addEventListener('change',()=>{if(!val('opDinein').checked&&val('opTableQr').checked){val('opTableQr').checked=false;toast('تم إيقاف Table QR مع Dine-in')}});
  val('saveOperating').onclick=saveOperating;
}
async function saveOperating(){
  const mode=document.querySelector('input[name="operatingMode"]:checked')?.value||'restaurant';
  const payload={operating_mode:mode,delivery_enabled:val('opDelivery').checked,takeaway_enabled:val('opTakeaway').checked,dinein_enabled:val('opDinein').checked,table_qr_enabled:val('opTableQr').checked};
  setStatus('#operatingStatus','جاري الحفظ...');
  const {data,error}=await sb.rpc('cfy_menu_save_tools_settings',{p_token:state.token,p_data:payload});
  if(error){setStatus('#operatingStatus','تعذر الحفظ: '+error.message,'err');return}
  state.snapshot.settings={...(state.snapshot.settings||{}),...data};
  state.settings={...state.settings,delivery_enabled:data.delivery_enabled!==false,takeaway_enabled:data.takeaway_enabled!==false,dinein_enabled:data.dinein_enabled===true};
  setStatus('#operatingStatus','تم الحفظ — '+modeLabel(data.operating_mode),'ok');renderChecklist();
}
function installPublicMenuActions(){
  const panel=document.querySelector('[data-panel="preview"]');if(!panel||document.getElementById('publicMenuActions'))return;
  const code=state.session?.client?.code||'';const url=location.origin+'/menu/?code='+encodeURIComponent(code);
  const note=panel.querySelector('.phase-note');
  const wrap=document.createElement('div');wrap.id='publicMenuActions';wrap.className='phase-note';wrap.style.marginTop='12px';wrap.innerHTML=`<b>المنيو العامة</b><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:9px"><input id="publicMenuUrl" readonly dir="ltr" value="${url}" style="flex:1;min-width:220px;border:1px solid #dfe4ec;border-radius:10px;padding:9px 10px;background:#fff"><button id="copyPublicMenu" class="btn secondary">نسخ الرابط</button><a class="btn" href="${url}" target="_blank" rel="noopener" style="text-decoration:none">فتح المنيو الحقيقية</a></div><div class="muted" style="font-size:10px;margin-top:7px">هذا رابط Professional Menu المستقل، والـQR/URL القديم يظل محفوظًا حتى قرار التحويل النهائي.</div>`;
  if(note)note.after(wrap);else panel.appendChild(wrap);
  val('copyPublicMenu').onclick=async()=>{try{await navigator.clipboard.writeText(url);toast('تم نسخ رابط المنيو')}catch(_){val('publicMenuUrl').select();document.execCommand('copy');toast('تم نسخ رابط المنيو')}};
}
function markProduction(){
  const badge=document.querySelector('.top-actions .badge:not(.admin)');if(badge)badge.textContent='Professional Menu';
  const sub=document.querySelector('.topbar .muted');if(sub)sub.innerHTML=`<span id="clientCode">${state.session?.client?.code||''}</span> · Owner Console`;
  const status=[...document.querySelectorAll('.card h3')].find(x=>x.textContent.trim()==='حالة المرحلة')?.parentElement;
  if(status){const h=status.querySelector('h3');if(h)h.textContent='حالة النظام';const p=status.querySelector('p');if(p)p.textContent='لوحة Professional Menu متصلة بالحساب والكتالوج والطلبات التشغيلية. استخدم الأقسام بالأعلى لإدارة المنيو ثم افتح الرابط العام للمعاينة والاختبار.'}
}
function start(){if(started)return;if(typeof state==='undefined'||!state?.snapshot||!state?.session){setTimeout(start,80);return}started=true;markProduction();renderOperatingPanel();installPublicMenuActions()}
start();
})();