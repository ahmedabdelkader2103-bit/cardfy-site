(function(){
function install(){
  if(typeof reload!=='function'||typeof tableAction!=='function'||typeof sb==='undefined'||typeof token==='undefined'){setTimeout(install,80);return}
  if(window.__cardfyStaffPatch)return;window.__cardfyStaffPatch=true;
  reload=async function(){
    const r=await sb.rpc('cfy_menu_staff_operational_snapshot',{p_token:token,p_limit:200});
    if(r.error){const msg=String(r.error.message||'');if(msg.includes('invalid_staff_session')){localStorage.removeItem(TOKEN);location='/menu/staff/';return}toast('تعذر تحديث البيانات');return}
    snap=r.data||{};staff=snap.staff||staff;render();
  };
  tableAction=async function(id,act){
    if(act==='close_paid'&&!confirm('تأكيد الدفع وإغلاق الترابيزة؟'))return;
    const r=await sb.rpc('cfy_menu_staff_table_action',{p_token:token,p_session_id:id,p_action:act});
    if(r.error){const msg=String(r.error.message||'');toast(msg.includes('table_has_active_orders')?'لا يمكن إغلاق الترابيزة وهناك طلبات ما زالت قيد التشغيل.':'تعذر تحديث الترابيزة');return}
    toast('تم التحديث');await reload();
  };
}
install();
})();
