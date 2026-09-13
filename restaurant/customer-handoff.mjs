import qrcode from './vendor/qrcode-2.0.4.mjs';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function customerHandoff(order,origin=location.origin){
  if(!order.reference||!order.tracking_token)return '';
  const url=new URL('/menu/track/',origin);
  url.searchParams.set('ref',order.reference);url.searchParams.set('token',order.tracking_token);
  const qr=qrcode(0,'M');qr.addData(url.href);qr.make();
  const otp=order.order?.order_type==='delivery'&&/^\d{4,8}$/.test(String(order.delivery_otp||''))?`<p>رمز التسليم للعميل: <b dir="ltr">${esc(order.delivery_otp)}</b></p><p>لا تعطِ الرمز للمندوب إلا بعد استلام الطلب.</p>`:'';
  return `<section aria-label="متابعة الطلب للعميل"><h3>متابعة الطلب للعميل</h3><div role="img" aria-label="QR لفتح متابعة الطلب" style="background:white;color:black;width:192px;max-width:100%;padding:8px">${qr.createSvgTag({scalable:true})}</div><p><a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer" style="overflow-wrap:anywhere">فتح متابعة الطلب</a></p><p style="direction:ltr;overflow-wrap:anywhere;font-size:11px">${esc(url.href)}</p>${otp}<p>سلّم هذا الرابط أو الإيصال للعميل فقط؛ الرابط يتيح متابعة طلبه وتأكيد الاستلام.</p></section>`;
}
