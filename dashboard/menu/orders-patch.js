(function(){
function install(){
  if(typeof printJob!=='function'||typeof printOrder!=='function'||typeof ticketHtml!=='function'||typeof M==='undefined'||typeof ctx==='undefined'){setTimeout(install,80);return}
  if(window.__cardfyOrdersPatch)return;window.__cardfyOrdersPatch=true;

  const baseTicketHtml=ticketHtml;
  ticketHtml=function(payload,type){
    const p=payload||{};
    if(type==='cashier'&&Array.isArray(p.orders)){
      const orders=p.orders,rows=[];
      for(const o of orders){
        rows.push(`<div style="font-weight:bold;margin-top:8px">${M.safe(o.reference||'')}</div>`);
        for(const i of (o.items||[])){
          const s=i.snapshot||{},prod=s.product||{},v=s.variant,opts=s.options||[];
          rows.push(`<div class="item"><b>${i.quantity} × ${M.safe(prod.name_ar||prod.name_en||'منتج')}</b><div class="muted">${v?M.safe(v.name):''}${opts.length?' · '+opts.map(x=>M.safe(x.name)).join('، '):''}${s.notes?'<br>'+M.safe(s.notes):''}</div></div>`);
        }
      }
      return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>TABLE RECEIPT</title><style>body{font-family:Arial,sans-serif;width:72mm;margin:0 auto;padding:4mm;font-size:12px}h2{text-align:center}.line{border-top:1px dashed #000;margin:8px 0}.item{margin:6px 0}.muted{font-size:10px}.total{font-size:16px;font-weight:bold;text-align:center}</style></head><body><h2>الحساب النهائي</h2>${rows.join('')}<div class="line"></div><div class="total">${M.money(p.running_total||0,ops.settings?.currency)}</div><script>window.onload=()=>{window.print();setTimeout(()=>window.close(),500)}<\/script></body></html>`;
    }
    return baseTicketHtml(payload,type);
  };

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
