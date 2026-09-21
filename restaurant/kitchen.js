import {$,context,rpc,run,status,escapeHTML as esc} from './shared.js?v=20260920-pos-ui';

let snapshot;
let filter='all';
let timer;

const typeLabel={delivery:'توصيل',takeaway:'تيك أواي',dinein:'صالة'};
const typeClass={delivery:'delivery',takeaway:'takeaway',dinein:'dinein'};
const icon=(name)=>({
  kitchen:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10a5 5 0 1 1 10 0v2H7v-2Zm-1 5h12v5H6v-5Zm6-10v3M5 9l3 1M19 9l-3 1"/></svg>',
  timer:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v5l3 2M9 2h6"/></svg>',
  note:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 8h8M8 12h8"/></svg>',
  check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
  print:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M7 14h10v7H7z"/></svg>'
})[name];

export async function mountKitchen(){
  $('#osContent').innerHTML=`<section class="kitchen-shell" aria-labelledby="kitchenTitle">
    <div class="kitchen-titlebar">
      <div class="kitchen-title"><span class="kitchen-title-icon">${icon('kitchen')}</span><div><h1 id="kitchenTitle">المطبخ</h1><p>الطلبات النشطة في انتظار التحضير</p></div></div>
      <div class="kitchen-title-actions"><span class="kitchen-active"><strong id="kitchenActive">0</strong> طلب نشط</span><button class="os-button" id="refreshKitchen">تحديث</button></div>
    </div>
    <div class="kitchen-filters" id="kitchenFilters" aria-label="تصفية الطلبات"></div>
    <div class="kitchen-board" id="kitchenBoard"></div>
  </section>`;
  $('#refreshKitchen').onclick=e=>run(e.currentTarget,load);
  await load();
  timer=setInterval(()=>{
    renderElapsed();
    if(!document.querySelector('.kitchen-ready[disabled]'))load().catch(()=>status('تعذر التحديث. البيانات المعروضة قديمة.',true));
  },15000);
  window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
}

async function load(){
  snapshot=await rpc('cfy_os_operational_snapshot',{p_token:context.token,p_page:'kitchen'});
  render();
  status('');
}

function kitchenOrders(){
  return (snapshot?.orders||[]).filter(order=>order.status==='preparing');
}

function render(){
  const orders=kitchenOrders();
  const counts={all:orders.length,delivery:0,takeaway:0,dinein:0};
  orders.forEach(order=>{if(order.order_type in counts)counts[order.order_type]+=1;});
  $('#kitchenActive').textContent=orders.length;
  $('#kitchenFilters').innerHTML=[['all','الكل'],['delivery','توصيل'],['takeaway','تيك أواي'],['dinein','صالة']]
    .map(([value,label])=>`<button class="kitchen-filter ${filter===value?'active':''}" data-filter="${value}">${label} (${counts[value]})</button>`).join('');
  $('#kitchenFilters').querySelectorAll('[data-filter]').forEach(button=>button.onclick=()=>{filter=button.dataset.filter;render();});
  const visible=orders.filter(order=>filter==='all'||order.order_type===filter);
  $('#kitchenBoard').innerHTML=visible.length?visible.map(card).join(''):`<div class="kitchen-empty"><span>✓</span><strong>لا توجد طلبات في انتظار التحضير</strong><p>ستظهر الطلبات هنا تلقائيًا بمجرد وصولها للمطبخ.</p></div>`;
  $('#kitchenBoard').querySelectorAll('[data-ready]').forEach(button=>button.onclick=()=>markReady(button.dataset.ready,button));
  $('#kitchenBoard').querySelectorAll('[data-print]').forEach(button=>button.onclick=()=>printOrder(button.dataset.print));
  renderElapsed();
}

function card(order){
  const items=(order.items||[]);
  const count=items.reduce((sum,item)=>sum+Number(item.quantity||0),0);
  const table=order.table_label||order.table_number;
  const received=order.preparing_at||order.accepted_at||order.created_at;
  return `<article class="kitchen-card ${typeClass[order.order_type]||''}" data-order="${esc(order.id)}">
    <div class="kitchen-card-head"><span class="kitchen-type">${esc(typeLabel[order.order_type]||order.order_type)}</span><b dir="ltr">${esc(order.reference)}</b><span class="kitchen-timer" data-received="${esc(received)}">${icon('timer')}<strong dir="ltr">00:00</strong></span></div>
    <div class="kitchen-meta">${table?`<span class="kitchen-table">${esc(table)}</span>`:''}<span>${count} صنف</span><span>${esc(order.order_source||'غير محدد')}</span></div>
    <ul class="kitchen-items">${items.map(itemCard).join('')}</ul>
    ${order.notes?`<div class="kitchen-note">${icon('note')}<div><small>ملاحظات الطلب</small><strong>${esc(order.notes)}</strong></div></div>`:''}
    <div class="kitchen-actions"><button class="kitchen-ready" data-ready="${esc(order.id)}">${icon('check')} تم التحضير</button><button class="kitchen-print" data-print="${esc(order.id)}" aria-label="طباعة الطلب ${esc(order.reference)}">${icon('print')}</button></div>
  </article>`;
}

function itemCard(item){
  const detail=item.snapshot||{};
  const name=detail.product?.name_ar||detail.product?.name_en||'منتج';
  const additions=[detail.variant?.name,...(detail.options||[]).map(option=>option.name),detail.notes].filter(Boolean);
  return `<li><span class="kitchen-qty">${Number(item.quantity||0)}</span><div><strong>${esc(name)}</strong>${additions.length?`<div class="kitchen-addons"><small>إضافات:</small>${additions.map(value=>`<span>+ ${esc(value)}</span>`).join('')}</div>`:''}</div></li>`;
}

function renderElapsed(){
  document.querySelectorAll('.kitchen-timer').forEach(host=>{
    const start=new Date(host.dataset.received).getTime();
    const seconds=Number.isFinite(start)?Math.max(0,Math.floor((Date.now()-start)/1000)):0;
    const minutes=Math.floor(seconds/60);
    host.classList.toggle('late',minutes>=20);
    host.classList.toggle('warning',minutes>=10&&minutes<20);
    host.querySelector('strong').textContent=`${String(minutes).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  });
}

async function markReady(id,button){
  await run(button,async()=>{
    await rpc('cfy_os_order_action',{p_token:context.token,p_page:'kitchen',p_order_id:id,p_action:'ready',p_data:{}});
    await load();
  });
}

function printOrder(id){
  const order=kitchenOrders().find(value=>value.id===id);
  if(!order)return;
  const popup=window.open('','_blank');
  if(!popup){status('المتصفح منع نافذة الطباعة. اسمح بها ثم أعد المحاولة.',true);return;}
  popup.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${esc(order.reference)}</title></head><body><h2>${esc(order.reference)}</h2><p>${esc(typeLabel[order.order_type]||order.order_type)}</p><ul>${(order.items||[]).map(item=>`<li>${Number(item.quantity||0)} × ${esc(item.snapshot?.product?.name_ar||item.snapshot?.product?.name_en||'منتج')}</li>`).join('')}</ul><p>${esc(order.notes||'')}</p></body></html>`);
  popup.document.close();
  popup.print();
  status('تم فتح حوار الطباعة. تحقق من خروج الورقة على الطابعة.');
}
