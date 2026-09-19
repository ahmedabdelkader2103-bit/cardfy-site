const number=value=>Number(value)||0;
export const active=list=>(list||[]).filter(row=>!row.archived);
export const total=(list,key='amount')=>active(list).reduce((sum,row)=>sum+number(row[key]),0);
export const group=(list,key,valueKey='amount')=>Object.values(active(list).reduce((groups,row)=>{
  const label=row[key]||'غير محدد';
  groups[label]??={label,value:0,count:0};
  groups[label].value+=number(row[valueKey]);
  groups[label].count++;
  return groups;
},{})).sort((a,b)=>b.value-a.value);
export const byDate=list=>group(list,'occurred_on');
export const percent=(value,whole)=>whole?Math.round(number(value)/number(whole)*100):0;
export function financeModel(snapshot={}){
  const entries=active(snapshot.entries);
  const orderRevenue=active(snapshot.order_revenue);
  const manualRevenue=entries.filter(row=>row.kind==='revenue');
  const revenue=[...orderRevenue,...manualRevenue];
  const expenses=entries.filter(row=>['expense','payroll'].includes(row.kind));
  const payroll=entries.filter(row=>row.kind==='payroll');
  const cashEntries=entries.filter(row=>row.payment_method==='cash');
  const cashOrders=orderRevenue.filter(row=>['cash','pay_on_delivery'].includes(row.payment_method));
  const cashIn=total(cashEntries.filter(row=>['cash_in','revenue'].includes(row.kind)))+total(cashOrders);
  const cashOut=total(cashEntries.filter(row=>['cash_out','expense','payroll'].includes(row.kind)));
  const closing=number(snapshot.cash_balance);
  const inventory=active(snapshot.inventory);
  const recipes=active(snapshot.recipes);
  const employees=active(snapshot.employees);
  const inventoryValue=inventory.reduce((sum,row)=>sum+number(row.quantity)*number(row.unit_price),0);
  const revenueTotal=total(revenue);
  const expenseTotal=total(expenses);
  return {entries,orderRevenue,manualRevenue,revenue,expenses,payroll,cashEntries,cashOrders,cashIn,cashOut,closing,opening:closing-cashIn+cashOut,inventory,recipes,employees,inventoryValue,revenueTotal,expenseTotal,operatingProfit:revenueTotal-expenseTotal};
}
export const safeMargin=(price,cost)=>number(price)>0?Math.round((number(price)-number(cost))/number(price)*1000)/10:null;
export const suggestedPrice=(cost,target)=>number(target)>=100?null:number(cost)/(1-number(target)/100);
