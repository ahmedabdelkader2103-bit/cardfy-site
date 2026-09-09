(function(){
let started=false;
async function reloadPhase2(){
  const {data:snap,error}=await sb.rpc('cfy_menu_manage_snapshot',{p_token:state.token});
  if(error)throw error;
  state.snapshot=snap||{};
  state.settings=normalSettings(state.snapshot.settings||{});
  renderChecklist();
  renderPreview();
  window.MenuCatalog?.render(state.snapshot);
  return state.snapshot;
}
function installPhase2Preview(){
  renderPreviewCatalog=function(){
    const allCats=state.snapshot.categories||[];
    const visibleCats=allCats.filter(x=>x.enabled!==false);
    const visibleCatIds=new Set(visibleCats.map(x=>x.id));
    const products=(state.snapshot.products||[]).filter(x=>x.enabled!==false&&(!x.category_id||visibleCatIds.has(x.category_id))).slice(0,4);
    const cats=visibleCats.slice(0,4);
    qs('#previewCats').innerHTML=(cats.length?cats:[{name_ar:'الأكثر طلبًا'},{name_ar:'برجر'},{name_ar:'مشروبات'}]).map((x,i)=>`<span class="cat ${i===0?'on':''}">${safe(x.name_ar||x.name||'قسم')}</span>`).join('');
    qs('#previewProducts').innerHTML=(products.length?products:[{name_ar:'مثال منتج',base_price:120},{name_ar:'مثال منتج',base_price:85},{name_ar:'مثال منتج',base_price:150},{name_ar:'مثال منتج',base_price:65}]).map(x=>`<div class="product-card" style="${x.available===false?'opacity:.55;':''}"><div class="product-img" ${x.image_url?`style="background-image:url('${safe(x.image_url)}');background-size:cover;background-position:center"`:''}></div><div class="product-info"><b>${x.featured?'★ ':''}${safe(x.name_ar||'منتج')}</b><span>${safe(x.base_price??'')} ${safe(state.settings.currency||'EGP')}${x.available===false?' · غير متاح':''}</span></div></div>`).join('');
    qs('#previewNote').textContent=products.length?'المعاينة تستخدم الأقسام والمنتجات المحفوظة فعليًا.':'أضف أقسامًا ومنتجات ظاهرة من تبويب الأقسام والمنتجات.';
  };
}
function markPhase2(){
  const badge=document.querySelector('.top-actions .badge:not(.admin)');if(badge)badge.textContent='Professional Menu';
  const sub=document.querySelector('.topbar .muted');if(sub)sub.innerHTML=`<span id="clientCode">${state.session?.client?.code||''}</span> · Owner Console`;
}
function installOwnerNav(){
  const routes={orders:'/dashboard/menu/orders.html',pos:'/dashboard/menu/pos.html',analytics:'/dashboard/menu/analytics.html',settings:'/dashboard/menu/settings.html'};
  const labels={orders:'Live',pos:'Live',analytics:'Live',settings:'Live',tools:'نشط'};
  document.querySelectorAll('.nav button[data-section]').forEach(btn=>{
    const section=btn.dataset.section,tag=btn.querySelector('.tag');if(tag&&labels[section])tag.textContent=labels[section];
    if(!routes[section]||btn.dataset.navReady==='1')return;btn.dataset.navReady='1';
    btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();location.href=routes[section]},true);
  });
}
function loadPhase3Owner(){
  if(document.querySelector('script[data-phase3-owner]'))return;
  const s=document.createElement('script');s.src='/dashboard/menu/phase3-owner.js';s.dataset.phase3Owner='1';s.onload=loadCompletionTools;document.body.appendChild(s);
}
function loadDemoDisplay(){
  if(document.querySelector('script[data-demo-display]'))return;
  const s=document.createElement('script');s.src='/dashboard/menu/tools-demo-display.js';s.dataset.demoDisplay='1';document.body.appendChild(s);
}
function loadCompletionTools(){
  if(document.querySelector('script[data-completion-tools]')){loadDemoDisplay();return}
  const s=document.createElement('script');s.src='/dashboard/menu/completion-tools.js';s.dataset.completionTools='1';s.onload=loadDemoDisplay;document.body.appendChild(s);
}
function tryStart(){
  if(started)return;
  if(typeof state==='undefined'||!state?.token||!state?.snapshot||!window.MenuCatalog){setTimeout(tryStart,80);return}
  started=true;installPhase2Preview();markPhase2();installOwnerNav();renderPreview();
  window.MenuCatalog.init({sb,token:state.token,getSnapshot:()=>state.snapshot,reload:reloadPhase2,toast});
  loadPhase3Owner();
}
tryStart();
})();
