import {modifierGroups,products,type Product} from "./pos-data";
export type Selections=Record<string,string[]>;
export type OrderLine={id:string;productId:string;quantity:number;selections:Selections};
export const getProduct=(id:string)=>products.find(p=>p.id===id)!;
export const defaultSelections=(product:Product):Selections=>Object.fromEntries(product.groups.map(id=>{const g=modifierGroups[id];return[id,g?.required?g.options.slice(0,Math.max(1,g.min)).map(o=>o.id):[]]}));
export const signature=(productId:string,selections:Selections)=>productId+"|"+Object.keys(selections).sort().map(g=>`${g}:${[...(selections[g]||[])].sort().join(",")}`).join("|");
export const unitPrice=(line:OrderLine)=>getProduct(line.productId).price+Object.entries(line.selections).reduce((sum,[gid,ids])=>sum+ids.reduce((n,id)=>n+(modifierGroups[gid]?.options.find(o=>o.id===id)?.price||0),0),0);
export const lineTotal=(line:OrderLine)=>unitPrice(line)*line.quantity;
export const selectionLabels=(line:OrderLine)=>Object.entries(line.selections).flatMap(([gid,ids])=>ids.map(id=>modifierGroups[gid]?.options.find(o=>o.id===id)?.name).filter(Boolean) as string[]);
