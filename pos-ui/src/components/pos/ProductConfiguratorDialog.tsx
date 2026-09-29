import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle} from "@/components/ui/dialog";
import {selectionIssues,type OrderLine} from "@/lib/pos-order";
import {ModifierPanel} from "./ModifierPanel";

export function ProductConfiguratorDialog({open,line,busy,onOpenChange,onToggle,onConfirm}:{
 open:boolean;
 line:OrderLine|null;
 busy:boolean;
 onOpenChange:(open:boolean)=>void;
 onToggle:(groupId:string,optionId:string)=>void;
 onConfirm:()=>void;
}){
 const issues=line?selectionIssues(line):[];
 return <Dialog open={open} onOpenChange={value=>!busy&&onOpenChange(value)}>
  <DialogContent dir="rtl" className="lovable-product-configurator flex h-[100dvh] max-h-[100dvh] max-w-none flex-col gap-3 overflow-hidden border-border bg-surface p-3 text-right sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:p-4">
   <DialogHeader className="sr-only"><DialogTitle>تهيئة المنتج</DialogTitle><DialogDescription>اختر خيارات وإضافات المنتج ثم أكد الاختيارات.</DialogDescription></DialogHeader>
   <div className="min-h-0 flex-1 overflow-y-auto pos-scroll">{line&&<ModifierPanel line={line} onToggle={onToggle}/>}</div>
   <DialogFooter className="shrink-0 gap-2 sm:justify-start">
    <button type="button" disabled={issues.length>0||busy} onClick={onConfirm} className="h-12 flex-1 rounded-xl brand-gradient text-base font-extrabold text-brand-foreground shadow-[var(--shadow-brand)] transition-opacity disabled:opacity-40">{busy?"جاري مراجعة السعر...":"تم"}</button>
    <button type="button" disabled={busy} onClick={()=>onOpenChange(false)} className="h-12 rounded-xl border border-border bg-surface-2 px-5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground">إلغاء</button>
   </DialogFooter>
   {issues.length>0&&<p className="shrink-0 text-xs font-bold text-destructive">أكمل الاختيارات المطلوبة: {issues.join(" • ")}</p>}
  </DialogContent>
 </Dialog>;
}
