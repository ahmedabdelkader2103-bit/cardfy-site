(function(){
function discountAmount(product,gross){
  const ds=Array.isArray(product?.discounts)?product.discounts:[];let best=0;
  for(const d of ds){const value=Math.max(0,Number(d.value||0));const amount=d.type==='percent'?gross*Math.min(value,100)/100:Math.min(value,gross);if(amount>best)best=amount}
  return Math.max(0,Math.min(best,gross));
}
function install(){
  if(typeof unit!=='function'||typeof renderProducts!=='function'||typeof catalog==='undefined'){setTimeout(install,80);return}
  if(window.__cardfyStaffPosCommerce)return;window.__cardfyStaffPosCommerce=true;
  unit=function(p,v,os){const gross=Number(v?.price??p.base_price??0)+(os||[]).reduce((a,o)=>a+Number(o.price_delta||0),0);return Math.max(0,gross-discountAmount(p,gross))};
  renderProducts=function(){
    document.querySelector('#products').innerHTML=products().map(p=>{const gross=Number(p.base_price||0),net=Math.max(0,gross-discountAmount(p,gross)),price=net<gross?`<small><b style="color:#c82f41">${money(net)}</b> <s style="opacity:.55">${money(gross)}</s></small>`:`<small>${money(gross)}</small>`;return `<button class="pos-product ${selected?.id===p.id?'selected':''}" data-p="${p.id}"><div class="pos-img" ${p.image_url?`style="background-image:url('${safe(p.image_url).replace(/'/g,'%27')}')"`:''}></div><strong>${safe(p.name_ar||p.name_en)}</strong>${price}</button>`}).join('');
    document.querySelector('#products').querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>tap(b.dataset.p));
  };
  const wait=()=>{if(catalog){renderProducts();renderOrder()}else setTimeout(wait,80)};wait();
}
install();
})();
