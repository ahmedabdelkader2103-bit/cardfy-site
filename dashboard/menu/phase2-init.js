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
function tryStart(){
  if(started)return;
  if(typeof state==='undefined'||!state?.token||!state?.snapshot||!window.MenuCatalog){setTimeout(tryStart,80);return}
  started=true;
  window.MenuCatalog.init({sb,token:state.token,getSnapshot:()=>state.snapshot,reload:reloadPhase2,toast});
}
tryStart();
})();