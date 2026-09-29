import banner from "@/assets/brand-banner.jpg";
export type ModifierOption={id:string;name:string;price:number;rawPrice:number};
export type ModifierGroup={id:string;name:string;multi:boolean;required:boolean;min:number;max:number;kind:"variant"|"option";options:ModifierOption[]};
export type Product={id:string;name:string;price:number;category:string;image:string;badge?:string;groups:string[]};
export type DeliveryZone={id:string;name:string;fee:number;branch_id?:string};
export const categories:Array<{id:string;name:string}>=[{id:"all",name:"الكل"}];
export const products:Product[]=[];
export const modifierGroups:Record<string,ModifierGroup>={};
export const deliveryZones:DeliveryZone[]=[];
const safeImage=(v:unknown)=>{
 const value=String(v||"").trim();
 return /^(?:https:\/\/|\/(?!\/)|data:image\/(?:png|jpe?g|webp|gif);base64,)/i.test(value)?value:banner;
};
export function hydrateCatalog(catalog:any,branchId:string){
 categories.splice(1,categories.length,...(catalog.categories||[]).map((c:any)=>({id:c.id,name:c.name_ar||c.name_en||"قسم"})));
 products.splice(0);deliveryZones.splice(0);Object.keys(modifierGroups).forEach(k=>delete modifierGroups[k]);
 for(const raw of catalog.products||[]){if(!raw.available)continue;const groupIds:string[]=[];
  if(raw.variants?.length){const id=`variant:${raw.id}`;groupIds.push(id);modifierGroups[id]={id,name:"الحجم",multi:false,required:Boolean(raw.variant_required),min:raw.variant_required?1:0,max:1,kind:"variant",options:raw.variants.map((v:any)=>({id:v.id,name:v.name,price:Number(v.price||0)-Number(raw.base_price||0),rawPrice:Number(v.price||0)}))};}
  for(const g of raw.option_groups||[]){const id=`option:${g.id}`;groupIds.push(id);modifierGroups[id]={id,name:g.name,multi:Number(g.max_select||1)>1,required:Boolean(g.required)||Number(g.min_select||0)>0,min:Math.max(g.required?1:0,Number(g.min_select||0)),max:Math.max(1,Number(g.max_select||1)),kind:"option",options:(g.options||[]).map((o:any)=>({id:o.id,name:o.name,price:Number(o.price_delta||0),rawPrice:Number(o.price_delta||0)}))};}
  products.push({id:raw.id,name:raw.name_ar||raw.name_en||"منتج",price:Number(raw.base_price||0),category:raw.category_id,image:safeImage(raw.image_url),badge:raw.badge||(raw.is_featured?"الأكثر مبيعاً":raw.is_new?"جديد":undefined),groups:groupIds});
 }
 deliveryZones.push(...(catalog.delivery_zones||[]).filter((z:any)=>!z.branch_id||z.branch_id===branchId).map((z:any)=>({id:z.id,name:z.name,fee:Number(z.fee||0),branch_id:z.branch_id})));
}
export const egp=(value:number)=>`EGP ${value.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
