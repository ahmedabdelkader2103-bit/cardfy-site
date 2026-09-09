(function(){
function discountAmount(product,gross){
  const ds=Array.isArray(product?.discounts)?product.discounts:[];let best=0;
  for(const d of ds){const value=Math.max(0,Number(d.value||0));const amount=d.type==='percent'?gross*Math.min(value,100)/100:Math.min(value,gross);if(amount>best)best=amount}
  return Math.max(0,Math.min(best,gross));
}
function install(){
  if(typeof priceOf!=='function'||typeof renderProducts!=='function'||typeof send!=='function'||typeof catalog==='undefined'){setTimeout(install,80);return}
  if(window.__cardfyOwnerPosCommerce)return;window.__cardfyOwnerPosCommerce=true;
  priceOf=function(p,variant,options){const gross=(variant?Number(variant.price||0):Number(p.base_price||0))+(options||[]).reduce((a,o)=>a+Number(o.price_delta||0),0);return Math.max(0,gross-discountAmount(p,gross))};
  renderProducts=function(){
    document.querySelector('#products').innerHTML=filtered().map(p=>{const gross=Number(p.base_price||0),net=Math.max(0,gross-discountAmount(p,gross)),price=net<gross?`<small><b style="color:#c82f41">${M.money(net,catalog.settings?.currency)}</b> <s style="opacity:.55">${M.money(gross,catalog.settings?.currency)}</s></small>`:`<small>${M.money(gross,catalog.settings?.currency)}</small>`;return `<button class="pos-product ${selected?.id===p.id?'selected':''}" data-id="${p.id}"><div class="pos-img" ${p.image_url?`style="background-image:url('${M.safe(p.image_url).replace(/'/g,'%27')}')"`:''}></div><strong>${M.safe(p.name_ar||p.name_en||'منتج')}</strong>${price}</button>`}).join('');
    document.querySelector('#products').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>tapProduct(b.dataset.id));
  };
  send=async function(){
    if(!lines.length){M.toast('الطلب فارغ');return}if(orderType==='dinein'&&!document.querySelector('#tableSelect').value){M.toast('اختر الترابيزة');return}
    const btn=document.querySelector('#sendOrder');btn.disabled=true;document.querySelector('#status').textContent='جاري حفظ الطلب...';
    const r=await M.sb.rpc('cfy_menu_owner_create_order',{p_token:ctx.key,p_source:document.querySelector('#source').value,p_order:orderPayload()});btn.disabled=false;
    if(r.error){document.querySelector('#status').textContent='تعذر الحفظ: '+r.error.message;return}
    const o=r.data;document.querySelector('#status').innerHTML=`تم حفظ الطلب <b>${M.safe(o.reference)}</b> · الإجمالي النهائي <b>${M.money(o.total,catalog.settings?.currency)}</b>${o.delivery_otp?` · رمز التسليم: <b>${M.safe(o.delivery_otp)}</b>`:''}`;
    M.toast('تم إرسال الطلب لمركز الطلبات');lines=[];renderOrder();renderProducts();
  };
  const wait=()=>{if(catalog){renderProducts();renderOrder();const b=document.querySelector('#sendOrder');if(b)b.onclick=send}else setTimeout(wait,80)};wait();
}
install();
})();
