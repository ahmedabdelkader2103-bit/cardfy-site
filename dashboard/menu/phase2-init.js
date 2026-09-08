(function(){
let started=false;
try{safe=function(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}}catch(e){}
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
function markPhase2(){
  const badge=document.querySelector('.top-actions .badge:not(.admin)');if(badge)badge.textContent='Phase 2';
  const sub=document.querySelector('.topbar .muted');if(sub)sub.innerHTML=`<span id="clientCode">${state.session?.client?.code||''}</span> · Catalog Management`;
  const status=[...document.querySelectorAll('.card h3')].find(x=>x.textContent.trim()==='حالة المرحلة')?.parentElement;
  if(status){const p=status.querySelector('p');if(p)p.textContent='Phase 2 تفعّل إدارة الأقسام والمنتجات والصور وDuplicate وVariants والإضافات الديناميكية القابلة لإعادة الاستخدام. الطلبات العامة وPOS وAnalytics تظل لمراحلها اللاحقة.'}
}
function tryStart(){
  if(started)return;
  if(typeof state==='undefined'||!state?.token||!state?.snapshot||!window.MenuCatalog){setTimeout(tryStart,80);return}
  started=true;markPhase2();
  window.MenuCatalog.init({sb,token:state.token,getSnapshot:()=>state.snapshot,reload:reloadPhase2,toast});
}
tryStart();
})();