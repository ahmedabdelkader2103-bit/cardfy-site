(function(){
async function syncPublicState(){
  if(typeof state==='undefined'||typeof sb==='undefined'||!state?.code||!state?.catalog){setTimeout(syncPublicState,80);return}
  const {data,error}=await sb.rpc('cfy_menu_public_state',{p_code:state.code});
  if(error||!data)return;
  state.publicState=data;
  const badge=document.querySelector('#openBadge');
  if(!badge)return;
  const open=!!data.is_open_now;
  badge.textContent=open?'مفتوح الآن':(data.restaurant_open?'مغلق حسب مواعيد العمل':'مغلق مؤقتًا');
  badge.classList.toggle('closed',!open);
}
syncPublicState();
})();
