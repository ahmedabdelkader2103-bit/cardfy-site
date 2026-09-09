(function(){
function discountAmount(product,gross){
  const ds=Array.isArray(product?.discounts)?product.discounts:[];
  let best=0;
  for(const d of ds){
    const value=Math.max(0,Number(d.value||0));
    const amount=d.type==='percent'?gross*Math.min(value,100)/100:Math.min(value,gross);
    if(amount>best)best=amount;
  }
  return Math.max(0,Math.min(best,gross));
}
function discountedUnit(product,gross){return Math.max(0,gross-discountAmount(product,gross))}
async function refreshOpenState(){
  if(typeof sb==='undefined'||typeof state==='undefined'||!state.code)return;
  const {data}=await sb.rpc('cfy_menu_public_state',{p_code:state.code});if(!data)return;
  state.settings={...state.settings,is_open_now:data.is_open_now,scheduled_ordering_enabled:data.scheduled_ordering_enabled,asap_enabled:data.asap_enabled,timezone:data.timezone};
  const b=document.getElementById('openBadge');if(!b)return;
  if(data.is_open_now){b.textContent='مفتوح الآن';b.classList.remove('closed')}
  else{b.textContent=data.scheduled_ordering_enabled?'مغلق الآن · الطلب المجدول متاح':'مغلق حاليًا';b.classList.add('closed')}
}
function install(){
  if(typeof productCard!=='function'||typeof currentDetailUnit!=='function'||typeof addCartItem!=='function'||typeof state==='undefined'){setTimeout(install,80);return}
  if(window.__cardfyCommerceVisuals)return;window.__cardfyCommerceVisuals=true;
  const style=document.createElement('style');style.textContent='.old-price{text-decoration:line-through;opacity:.55;font-size:11px;margin-inline-start:6px}.sale-price{color:#d63b45}.discount-pill{display:inline-flex;align-items:center;border-radius:999px;background:#fff0f1;color:#bd2634;padding:3px 7px;font-size:9px;font-weight:900;margin-inline-start:5px}.theme-dark .discount-pill{background:#3b171d;color:#ff9ca6}';document.head.appendChild(style);

  const baseProductCard=productCard;
  productCard=function(p){
    let html=baseProductCard(p);const gross=Number(p.base_price||0),net=discountedUnit(p,gross);
    if(p.available!==false&&net<gross){
      const old=`<span class="price">${money(p.base_price)}</span>`;
      const label=`<span class="price sale-price">${money(net)}</span><span class="old-price">${money(gross)}</span><span class="discount-pill">عرض</span>`;
      html=html.replace(old,label);
    }
    return html;
  };

  currentDetailUnit=function(){
    const p=state.detail;if(!p)return 0;const s=readSelection();
    const gross=(s.variant?Number(s.variant.price||0):Number(p.base_price||0))+s.options.reduce((a,o)=>a+Number(o.price_delta||0),0);
    return discountedUnit(p,gross);
  };

  addCartItem=function(product,{variant=null,options=[],notes='',qty=1}){
    const gross=(variant?Number(variant.price||0):Number(product.base_price||0))+options.reduce((a,o)=>a+Number(o.price_delta||0),0);
    const unit=discountedUnit(product,gross),key=lineKey(product,variant,options,notes),existing=state.cart.find(x=>x.key===key);
    if(existing){existing.qty=Math.min(99,existing.qty+qty);existing.unit_price=unit}else state.cart.push({key,product_id:product.id,name:product.name_ar||product.name_en||'منتج',image_url:product.image_url||'',variant,options,notes,unit_price:unit,qty});
    persistCart();
  };

  const wait=()=>{if(state.catalog){renderAll();renderCartBar();if(state.detail)renderDetails();refreshOpenState()}else setTimeout(wait,80)};wait();
  setInterval(refreshOpenState,60000);
}
install();
})();
