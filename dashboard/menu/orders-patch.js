(function(){
function install(){
  if(typeof printJob!=='function'||typeof printOrder!=='function'||typeof M==='undefined'||typeof ctx==='undefined'){setTimeout(install,80);return}
  if(window.__cardfyOrdersPatch)return;window.__cardfyOrdersPatch=true;
  printJob=async function(j){
    let ok=false,errorText='';
    try{ok=await printOrder(j.payload||{},j.job_type)}catch(e){ok=false;errorText=e?.message||'print_failed'}
    const r=await M.sb.rpc('cfy_menu_mark_print_job',{p_token:ctx.key,p_job_id:j.id,p_status:ok?'printed':'failed',p_error:ok?'':(errorText||'popup_blocked')});
    if(r.error)M.toast('تمت محاولة الطباعة لكن تعذر تحديث حالتها.');
    await reload();
  };
}
install();
})();
