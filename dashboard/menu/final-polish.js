(function(){
const SOUND_KEY='cardfy_menu_order_sound_v1';
let installed=false,baseline=null,audioCtx=null,lastCount=-1;
function moneyLabel(o){const paid=o.payment_status==='paid'?'مدفوع':o.payment_status==='pending'?'قيد الدفع':o.payment_status==='refunded'?'مسترد':'غير مدفوع';return `الدفع: نقدي · ${paid}`}
function ensureSoundButton(){
  if(document.getElementById('orderSoundToggle'))return;
  const host=document.querySelector('.ops-top .actions');if(!host)return;
  const b=document.createElement('button');b.id='orderSoundToggle';b.className='btn secondary';host.prepend(b);
  const sync=()=>{const on=localStorage.getItem(SOUND_KEY)==='1';b.textContent=on?'🔔 صوت الطلبات: مفعّل':'🔕 تفعيل صوت الطلبات';b.setAttribute('aria-pressed',String(on))};
  b.onclick=async()=>{const on=localStorage.getItem(SOUND_KEY)==='1';localStorage.setItem(SOUND_KEY,on?'0':'1');if(!on){await beep(true);M.toast('تم تفعيل صوت الطلبات على هذا الجهاز')}else M.toast('تم إيقاف صوت الطلبات');sync()};sync();
}
async function beep(test=false){
  if(!test&&localStorage.getItem(SOUND_KEY)!=='1')return;
  try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;audioCtx=audioCtx||new C();if(audioCtx.state==='suspended')await audioCtx.resume();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=880;g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.18,audioCtx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.32);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.34)}catch(_){ }
}
function visualBadge(count){
  ensureSoundButton();
  let b=document.getElementById('newOrderAlertBadge');const host=document.querySelector('.ops-top .actions');
  if(!b&&host){b=document.createElement('span');b.id='newOrderAlertBadge';b.style.cssText='display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:32px;padding:0 10px;border-radius:999px;font-weight:900;font-size:11px;background:#fff1df;color:#a34b00;border:1px solid #ffd8aa';host.prepend(b)}
  if(b){b.textContent=count?`جديد ${count}`:'لا جديد';b.style.opacity=count?'1':'.6'}
  const clean=document.title.replace(/^\(\d+\)\s*/,'');document.title=count?`(${count}) ${clean}`:clean;
}
function decorate(){
  if(typeof ops==='undefined'||!ops)return;
  const all=ops.orders||[],newOrders=all.filter(o=>o.status==='new');visualBadge(newOrders.length);
  const currentIds=new Set(all.map(o=>o.id));
  if(baseline===null){baseline=currentIds}else{
    const fresh=newOrders.filter(o=>!baseline.has(o.id));
    if(fresh.length){beep();M.toast(fresh.length===1?`طلب جديد ${fresh[0].reference||''}`:`وصل ${fresh.length} طلبات جديدة`);if(document.hidden&&'Notification'in window&&Notification.permission==='granted'){try{new Notification('CARDfy — طلب جديد',{body:fresh.length===1?(fresh[0].reference||'طلب جديد'):`${fresh.length} طلبات جديدة`})}catch(_){}}}
    baseline=currentIds;
  }
  if(typeof isVisible==='function'){
    const visible=all.filter(isVisible),cards=[...document.querySelectorAll('#orders .order-card')];
    cards.forEach((card,i)=>{if(card.querySelector('.payment-meta'))return;const o=visible[i];if(!o)return;const el=document.createElement('div');el.className='order-meta payment-meta';el.textContent=moneyLabel(o);const body=card.querySelector('.items')||card.querySelector('.order-body')||card;body.appendChild(el)})
  }
}
function install(){
  if(installed)return;if(typeof render!=='function'||typeof M==='undefined'){setTimeout(install,60);return}installed=true;
  const baseRender=render;render=function(){const r=baseRender.apply(this,arguments);queueMicrotask(decorate);return r};
  ensureSoundButton();setInterval(decorate,1200);setTimeout(decorate,100);
}
install();
})();
