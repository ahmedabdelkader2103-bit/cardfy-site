import {useMemo,useState} from "react";
import {toast,Toaster} from "sonner";
import {PosHeader} from "@/components/pos/PosHeader";
import {ProductArea} from "@/components/pos/ProductArea";
import {OrderPanel,type OrderType} from "@/components/pos/OrderPanel";
import {ProductConfiguratorDialog} from "@/components/pos/ProductConfiguratorDialog";
import {AddressDialog,emptyCustomer,isValidDeliveryCustomer,type CustomerInfo} from "@/components/pos/AddressDialog";
import {PaymentDialog} from "@/integration/PaymentDialog";
import {ReceiptDialog} from "@/integration/ReceiptDialog";
import {deliveryZones,modifierGroups,type Product} from "@/lib/pos-data";
import {emptySelections,getProduct,hasRequiredSelections,lineTotal,selectionIssues,signature,type OrderLine} from "@/lib/pos-order";
import type {PosServices} from "@/integration/types";

let counter=0;
const newId=()=>`line-${++counter}`;
type ConfiguratorState={mode:"add"|"edit";line:OrderLine};

const deliveryErrorMessage=(error:any,fallback:string)=>{
 const message=String(error?.message||"");
 if(message.includes("delivery_zone_required"))return "اختار منطقة التوصيل قبل متابعة الطلب.";
 if(message.includes("delivery_details_required"))return "راجع بيانات التوصيل: الاسم حرفين على الأقل، رقم الهاتف 8 أرقام على الأقل، والعنوان 5 أحرف على الأقل.";
 return message||fallback;
};

function applyConfiguredLine(lines:OrderLine[],draft:OrderLine,mode:ConfiguratorState["mode"]){
 const draftSignature=signature(draft.productId,draft.selections);
 const twin=lines.find(line=>(mode==="add"||line.id!==draft.id)&&signature(line.productId,line.selections)===draftSignature);
 if(twin)return lines.filter(line=>mode!=="edit"||line.id!==draft.id).map(line=>line.id===twin.id?{...line,quantity:line.quantity+draft.quantity}:line);
 return mode==="edit"?lines.map(line=>line.id===draft.id?draft:line):[...lines,draft];
}

export function App({services}:{services:PosServices}){
 const settings=services.snapshot.catalog.settings||{},deliveryEnabled=Boolean(settings.delivery_enabled),draftKey=`cardfy_pos_draft:${services.context.client_id}:${services.branchId}`;
 const saved=useMemo(()=>{try{return JSON.parse(sessionStorage.getItem(draftKey)||"null")}catch{return null}},[draftKey]);
 const initialType:OrderType=saved?.orderType==="delivery"&&deliveryEnabled?"delivery":"pickup";
 const [orderType,setOrderType]=useState<OrderType>(initialType);
 const [lines,setLines]=useState<OrderLine[]>(Array.isArray(saved?.lines)?saved.lines:[]),[notes,setNotes]=useState(typeof saved?.notes==="string"?saved.notes:""),[customer,setCustomer]=useState<CustomerInfo>(saved?.customer||emptyCustomer),[addressOpen,setAddressOpen]=useState(false),[paymentOpen,setPaymentOpen]=useState(false),[busy,setBusy]=useState(false),[headerQuery,setHeaderQuery]=useState(""),[receipt,setReceipt]=useState<any>(null),[configurator,setConfigurator]=useState<ConfiguratorState|null>(null),[configBusy,setConfigBusy]=useState(false);
 const checkout=useMemo(()=>({busy:false,key:"",fingerprint:""}),[]);
 const subtotal=useMemo(()=>lines.reduce((sum,line)=>sum+lineTotal(line),0),[lines]),zone=deliveryZones.find(item=>item.id===customer.zoneId)||null,deliveryFee=orderType==="delivery"&&zone?zone.fee:0;
 const pendingCount=(services.snapshot.orders||[]).filter((order:any)=>order.order_type!=="dinein"&&!['completed','cancelled','delivered','on_the_way'].includes(order.status)&&!order.assigned_driver_id).length;
 const methods=(settings.payment_methods||['cash']).filter((method:string)=>orderType==="delivery"?['pay_on_delivery','cash'].includes(method):['cash','card_at_venue'].includes(method));

 const addProduct=(product:Product)=>{
  const line={id:newId(),productId:product.id,quantity:1,selections:emptySelections(product)};
  if(hasRequiredSelections(product)){setConfigurator({mode:"add",line});return}
  setLines(current=>applyConfiguredLine(current,line,"add"));
 };
 const editProduct=(id:string)=>{const line=lines.find(item=>item.id===id);if(line)setConfigurator({mode:"edit",line:{...line,selections:Object.fromEntries(Object.entries(line.selections).map(([key,value])=>[key,[...value]]))}})};
 const changeQuantity=(id:string,delta:number)=>setLines(previous=>previous.flatMap(line=>{if(line.id!==id)return[line];const quantity=line.quantity+delta;return quantity<=0?[]:[{...line,quantity}]}));
 const removeLine=(id:string)=>setLines(previous=>previous.filter(line=>line.id!==id));
 const clearAll=()=>{setLines([]);setNotes("");setConfigurator(null);sessionStorage.removeItem(draftKey)};
 const toggleConfigurator=(groupId:string,optionId:string)=>setConfigurator(current=>{
  if(!current)return current;
  const group=modifierGroups[groupId];if(!group)return current;
  const selected=current.line.selections[groupId]||[];
  let next:string[];
  if(group.multi)next=selected.includes(optionId)?selected.filter(id=>id!==optionId):(selected.length>=group.max?selected:[...selected,optionId]);
  else next=selected.includes(optionId)&&!group.required?[]:[optionId];
  return{...current,line:{...current.line,selections:{...current.line.selections,[groupId]:next}}};
 });
 const payload=(payment_method:string,orderLines:OrderLine[]=lines)=>({order_type:orderType==="pickup"?"takeaway":"delivery",source:"pos",branch_id:services.branchId,payment_method,...(orderType==="delivery"?{customer_name:customer.name,phone:customer.phone,delivery_zone_id:customer.zoneId,address:customer.address}:{}),notes:[notes,orderType==="delivery"&&customer.notes?`ملاحظات التوصيل: ${customer.notes}`:""].filter(Boolean).join("\n"),table_id:"",coupon_code:"",items:orderLines.map(line=>{const variant=Object.entries(line.selections).find(([groupId])=>modifierGroups[groupId]?.kind==="variant")?.[1]?.[0]||"";const option_ids=Object.entries(line.selections).filter(([groupId])=>modifierGroups[groupId]?.kind==="option").flatMap(([,ids])=>ids);return{product_id:line.productId,quantity:line.quantity,variant_id:variant,option_ids,notes:""}})});
 const confirmConfigurator=async()=>{
  if(!configurator||selectionIssues(configurator.line).length)return;
  const nextLines=applyConfiguredLine(lines,configurator.line,configurator.mode);
  setConfigBusy(true);
  try{
   if(orderType!=="delivery"||customer.zoneId)await services.rpc('cfy_os_pos_quote',{p_token:services.context.token,p_page:'takeaway',p_order:payload(methods[0]||'cash',nextLines)});
   setLines(nextLines);setConfigurator(null);toast.success(configurator.mode==="add"?"تمت إضافة المنتج":"تم تحديث المنتج");
  }catch(error:any){toast.error(deliveryErrorMessage(error,"تعذر مراجعة سعر المنتج."))}
  finally{setConfigBusy(false)}
 };
 const validate=()=>{for(const line of lines){const product=getProduct(line.productId);for(const groupId of product.groups){const group=modifierGroups[groupId],count=(line.selections[groupId]||[]).length;if(group&&(count<group.min||count>group.max)){editProduct(line.id);throw new Error(`راجع اختيارات ${group.name}.`)}}}if(orderType==="delivery"&&!isValidDeliveryCustomer(customer)){setAddressOpen(true);throw new Error("راجع بيانات التوصيل: الاسم حرفين على الأقل، رقم الهاتف 8 أرقام على الأقل، والعنوان 5 أحرف على الأقل.")}if(!methods.length)throw new Error("لا توجد طريقة دفع مفعّلة لهذا النوع من الطلبات.")};
 const beginComplete=()=>{try{validate();setPaymentOpen(true)}catch(error:any){toast.error(error.message)}};
 const submit=async(method:string)=>{if(checkout.busy)return;checkout.busy=true;setBusy(true);try{const order=payload(method),fingerprint=JSON.stringify(order);if(checkout.fingerprint!==fingerprint){checkout.fingerprint=fingerprint;checkout.key=crypto.randomUUID()}await services.rpc('cfy_os_pos_quote',{p_token:services.context.token,p_page:'takeaway',p_order:order});const result=await services.rpc('cfy_os_pos_order',{p_token:services.context.token,p_page:'takeaway',p_order:order,p_intent:'save',p_request_key:checkout.key});checkout.key="";checkout.fingerprint="";setPaymentOpen(false);setAddressOpen(false);clearAll();setCustomer(emptyCustomer);setReceipt(result);services.status(`تم إنشاء ${result.reference} وإرساله إلى محضّر الطلب.`);toast.success(`تم إنشاء ${result.reference}`)}catch(error:any){const message=deliveryErrorMessage(error,"تعذر إنشاء الطلب.");services.status(message,true);toast.error(message)}finally{checkout.busy=false;setBusy(false)}};

 return <div className="flex min-h-screen flex-col bg-background lg:h-screen lg:overflow-hidden"><PosHeader actorName={services.context.name||"CARDfy"} actorRole={services.context.role==='owner'?"مالك المطعم":"موظف المطعم"} pendingCount={pendingCount} onMenu={services.onMenu} onBell={services.onBell} onSearch={setHeaderQuery}/><main className="cfy-pos-workspace grid min-h-0 flex-1 gap-3 p-3 sm:gap-4 sm:p-4 lg:grid-cols-[minmax(0,1fr)_25rem] xl:grid-cols-[minmax(0,1fr)_28rem]"><ProductArea onAdd={addProduct} externalQuery={headerQuery}/><OrderPanel orderType={orderType} onOrderTypeChange={type=>type!=="delivery"||deliveryEnabled?setOrderType(type):undefined} lines={lines} onSelectLine={editProduct} onQuantity={changeQuantity} onRemove={removeLine} onClearAll={clearAll} notes={notes} onNotesChange={setNotes} subtotal={subtotal} deliveryFee={deliveryFee} zoneName={zone?.name||null} hasAddress={Boolean(customer.address)} onOpenAddress={()=>setAddressOpen(true)} onSaveOrder={()=>{sessionStorage.setItem(draftKey,JSON.stringify({lines,notes,customer,orderType}));toast.success("تم حفظ الطلب مؤقتاً")}} onComplete={beginComplete} deliveryEnabled={deliveryEnabled}/></main><footer className="cfy-pos-footer hidden items-center justify-between gap-2 border-t border-border/70 px-5 py-2 text-xs text-muted-foreground lg:flex"><span className="font-bold"><bdi dir="ltr">CARD<span className="text-brand">fy</span> Restaurant POS</bdi></span><span>كل شيء في مكان واحد .. إدارة أسهل .. مطعم أكثر نجاحاً</span></footer><ProductConfiguratorDialog open={Boolean(configurator)} line={configurator?.line||null} busy={configBusy} onOpenChange={open=>!open&&setConfigurator(null)} onToggle={toggleConfigurator} onConfirm={confirmConfigurator}/><AddressDialog open={addressOpen} onOpenChange={setAddressOpen} value={customer} onSave={info=>{setCustomer(info);setAddressOpen(false);toast.success("تم حفظ بيانات التوصيل")}}/><PaymentDialog open={paymentOpen} onOpenChange={setPaymentOpen} methods={methods} busy={busy} onConfirm={submit}/>{receipt&&<ReceiptDialog result={receipt} handoffHtml={services.customerHandoff(receipt)} onClose={()=>setReceipt(null)}/>}<Toaster richColors position="top-center" dir="rtl"/></div>;
}
