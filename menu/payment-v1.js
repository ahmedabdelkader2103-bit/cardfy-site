(function(){
function label(){const active=document.querySelector('#checkoutBody .order-type.active')?.textContent||'';if(active.includes('توصيل'))return 'طريقة الدفع: نقدًا عند الاستلام.';if(active.includes('استلام'))return 'طريقة الدفع: عند الاستلام من المطعم.';if(active.includes('داخل'))return 'طريقة الدفع: داخل المطعم.';return 'طريقة الدفع الحالية: نقدي.'}
let scheduled=false;function apply(){scheduled=false;const body=document.getElementById('checkoutBody');if(!body)return;const place=document.getElementById('placeOrder');if(!place)return;let note=document.getElementById('paymentV1Note');if(!note){note=document.createElement('div');note.id='paymentV1Note';note.className='server-note';note.style.margin='10px 0';place.before(note)}const next=label();if(note.textContent!==next)note.textContent=next}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(apply)}
const obs=new MutationObserver(schedule);function start(){const modal=document.getElementById('checkoutModal');if(!modal){setTimeout(start,80);return}obs.observe(modal,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});schedule()}start();
})();
