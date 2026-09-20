const number=value=>Number(value)||0;

export const severityOrder={critical:0,warning:1,info:2};
export const severityLabel={critical:'حرج',warning:'متوسط',info:'معلومة'};
export const kindLabel={
  inventory:'المخزون',order_issue:'الطلبات',receipt_confirmation:'التوصيل',
  driver_assignment:'المندوبون',table_payment:'الصالة',cancelled_orders:'الطلبات',
  negative_result:'الحسابات'
};

export function ownerModel(snapshot={}){
  const summary=snapshot.summary||{},operations=snapshot.operations||{};
  const alerts=[...(snapshot.alerts||[])].sort((a,b)=>(severityOrder[a.severity]??9)-(severityOrder[b.severity]??9)||new Date(b.created_at||0)-new Date(a.created_at||0));
  const counts={critical:0,warning:0,info:0};
  alerts.forEach(alert=>{if(alert.severity in counts)counts[alert.severity]++;});
  return {summary,operations,alerts,counts,inventory:snapshot.inventory||[],events:snapshot.alert_events||[],actions:snapshot.recent_actions||[],branches:snapshot.branches||[]};
}

export function filterAlerts(alerts,{severity='',kind='',query=''}={}){
  const needle=String(query).trim().toLowerCase();
  return (alerts||[]).filter(alert=>(!severity||alert.severity===severity)&&(!kind||alert.kind===kind)&&(!needle||[alert.title,alert.detail,kindLabel[alert.kind]].join(' ').toLowerCase().includes(needle)));
}

export function safeOwnerRoute(value){
  const route=String(value||'');
  return (/^\/restaurant\/\?page=(owner(?:-alerts)?|accounts(?:-[a-z]+)?|analytics(?:-[a-z]+)?|prep|kitchen|delivery|dinein|takeaway)$/.test(route)||
    /^\/analytics(?:\/(customers|order-status))?\/?$/.test(route))?route:'/restaurant/?page=owner';
}

export function actionLabel(kind){
  return ({inventory:'فتح المخزون',order_issue:'متابعة الطلب',receipt_confirmation:'متابعة التسليم',driver_assignment:'إسناد مندوب',table_payment:'فتح الصالة',cancelled_orders:'تحليل الإلغاءات',negative_result:'مراجعة الحسابات'})[kind]||'عرض التفاصيل';
}

export function operationLabel(value){
  return ({accepted:'بدء تجهيز طلب',ready:'طلب جاهز',driver_assigned:'إسناد مندوب',picked_up:'استلام مندوب',delivered:'تسليم طلب',completed:'إغلاق طلب',cancelled:'إلغاء طلب',issue_opened:'فتح بلاغ',issue_resolved:'حل بلاغ',receipt_verified:'تأكيد استلام',receipt_disputed:'اعتراض على الاستلام'})[value]||String(value||'إجراء تشغيلي');
}

export const percent=(value,total)=>number(total)?Math.round(number(value)/number(total)*100):0;
