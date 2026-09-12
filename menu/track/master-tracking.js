(function(){
let last=null,installed=false;
async function refresh(){const r=await sb.rpc('cfy_os_public_track',{p_reference:ref,p_tracking_token:token});if(r.error||!r.data)return;last=r.data;const box=document.getElementById('receiptConfirm');box.hidden=last.receipt_verification!=='pending';if(['pending','disputed'].includes(last.receipt_verification))document.getElementById('ratingBox').hidden=true;if(last.receipt_verification==='disputed'){document.getElementById('issue').hidden=false;document.getElementById('issue').textContent='تم تسجيل عدم الاستلام، والمطعم يتابع البلاغ.'}}
async function confirm(received,button){button.disabled=true;const out=document.getElementById('receiptStatus'),r=await sb.rpc('cfy_os_customer_receipt',{p_reference:ref,p_tracking_token:token,p_received:received});button.disabled=false;if(r.error){out.textContent='تعذر تسجيل التأكيد. حدّث الصفحة وحاول مرة أخرى.';return}out.textContent=received?'شكرًا، تم تأكيد الاستلام.':'تم فتح بلاغ عدم استلام للمطعم.';await refresh();setTimeout(()=>load(),250)}
function install(){if(installed||typeof sb==='undefined'||typeof ref==='undefined'){setTimeout(install,80);return}installed=true;document.querySelectorAll('#receiptConfirm [data-received]').forEach(b=>b.onclick=()=>confirm(b.dataset.received==='true',b));refresh();setInterval(refresh,15000)}
install();
})();
