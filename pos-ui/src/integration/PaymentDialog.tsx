import {useEffect,useState} from "react";
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle} from "@/components/ui/dialog";

const labels:Record<string,string>={cash:"نقدي",card_at_venue:"بطاقة عند المطعم",pay_on_delivery:"الدفع عند الاستلام"};
export type PaymentCustomerDetails={name:string;phone:string};

export function PaymentDialog({open,onOpenChange,methods,busy,requireCustomerDetails,customer,onConfirm}:{
 open:boolean;
 onOpenChange:(value:boolean)=>void;
 methods:string[];
 busy:boolean;
 requireCustomerDetails:boolean;
 customer:PaymentCustomerDetails;
 onConfirm:(method:string,customer:PaymentCustomerDetails)=>void;
}){
 const [selected,setSelected]=useState("");
 const [details,setDetails]=useState<PaymentCustomerDetails>(customer);
 useEffect(()=>{if(open){setSelected(methods.length===1?methods[0]:"");setDetails(customer)}},[open]);
 const phoneDigits=details.phone.replace(/\D/g,"").replace(/^0020/,"").replace(/^20(?=1\d{9}$)/,"");
 const phoneValid=/^01\d{9}$/.test(phoneDigits);
 const validDetails=!requireCustomerDetails||(details.name.trim().length>=2&&phoneValid);
 return <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent dir="rtl" className="max-w-md border-border bg-surface text-right">
   <DialogHeader className="text-right sm:text-right">
    <DialogTitle className="text-lg font-extrabold">تأكيد الطلب وطريقة الدفع</DialogTitle>
    <DialogDescription>{requireCustomerDetails?"أدخل بيانات الاستلام واختر طريقة الدفع قبل إرسال الطلب.":"اختر طريقة الدفع المتاحة لهذا الطلب قبل الإرسال."}</DialogDescription>
   </DialogHeader>
   {requireCustomerDetails&&<div className="grid gap-3 sm:grid-cols-2">
    <label className="space-y-1.5"><span className="text-xs font-bold text-muted-foreground">اسم العميل</span><input value={details.name} onChange={event=>setDetails(value=>({...value,name:event.target.value}))} className="h-11 w-full rounded-xl border border-border bg-surface-2/70 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60" placeholder="اسم العميل" autoComplete="name"/></label>
    <label className="space-y-1.5"><span className="text-xs font-bold text-muted-foreground">رقم الهاتف</span><input value={details.phone} onChange={event=>setDetails(value=>({...value,phone:event.target.value}))} className="h-11 w-full rounded-xl border border-border bg-surface-2/70 px-3 text-right text-sm outline-none placeholder:text-muted-foreground focus:border-brand/60" placeholder="01000000000" inputMode="tel" dir="ltr" autoComplete="tel"/>{details.phone&&!phoneValid&&<span className="block text-xs font-bold text-destructive">اكتب رقمًا مصريًا صحيحًا بصيغة 01xxxxxxxxx</span>}</label>
   </div>}
   <div className="grid gap-2">{methods.map(method=><button key={method} type="button" onClick={()=>setSelected(method)} className={`h-12 rounded-xl border px-4 text-right text-sm font-bold transition-colors ${selected===method?"border-brand bg-brand/15 text-brand":"border-border bg-surface-2 text-foreground"}`}>{labels[method]||method}</button>)}</div>
   <DialogFooter className="gap-2 sm:justify-start">
    <button type="button" disabled={!selected||!validDetails||busy} onClick={()=>onConfirm(selected,{name:details.name.trim(),phone:details.phone.trim()})} className="h-12 flex-1 rounded-xl brand-gradient text-base font-extrabold text-brand-foreground shadow-[var(--shadow-brand)] disabled:opacity-40">{busy?"جاري إرسال الطلب...":"تأكيد وإرسال الطلب"}</button>
    <button type="button" disabled={busy} onClick={()=>onOpenChange(false)} className="h-12 rounded-xl border border-border bg-surface-2 px-5 text-sm font-bold text-muted-foreground">إلغاء</button>
   </DialogFooter>
  </DialogContent>
 </Dialog>;
}
