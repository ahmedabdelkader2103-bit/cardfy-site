/* The six approved Stitch inner-page compositions, fed only by the guarded CARDfy Analytics RPC. */
export function renderExpansion(page,d,prior,h){
 const {esc,number,currency,share,delta,empty,donut,bars,line,table,url,titles,icon}=h;
 const s=d.summary||{},c=d.customer_summary||{},details={};
 let cards=[],panels=[],heads=[],rows=[];
 const label=v=>({delivery:'توصيل',takeaway:'استلام',dinein:'الصالة',completed:'مكتمل',cancelled:'ملغي',ready:'جاهز',preparing:'جاري التجهيز',new:'جديد',on_the_way:'في الطريق',delivered:'تم التوصيل',online:'المنيو الإلكتروني',pos:'كاشير POS',phone:'طلب هاتفي'}[v]||v||'غير محدد');
 const fmtDate=v=>v?new Intl.DateTimeFormat('ar-EG',{timeZone:'Africa/Cairo',year:'numeric',month:'short',day:'numeric'}).format(new Date(v)):'غير متاح';
 const fmtDateTime=v=>v?new Intl.DateTimeFormat('ar-EG',{timeZone:'Africa/Cairo',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(v)):'غير متاح';
 const metric=(title,value,kind='number',note='')=>({title,value:kind==='money'?currency(value):kind==='minutes'?(value==null?'غير متاح':number(value)+' دقيقة'):kind==='percent'?(value==null?'غير متاح':number(value)+'%'):number(value),note});
 const change=(current,previous)=>{const v=delta(current,previous);return v==null?'المقارنة غير متاحة':(v>=0?'↑ ':'↓ ')+number(Math.abs(v))+'% مقارنة بالفترة السابقة';};
 const panel=(title,body,span='wide',detail=null)=>{panels.push({title,body,span,detail});if(detail)details[title]=detail;};
 const unavailable=what=>'<p class="analytics-unavailable">غير متاح: '+esc(what)+' غير مسجل بشكل موثوق في CARDfy حاليًا.</p>';
 const list=(items)=>items.length?'<div class="analytics-facts">'+items.map(x=>'<div><span>'+esc(x[0])+'</span><strong>'+esc(x[1])+'</strong></div>').join('')+'</div>':empty();
 const finish=()=>{
  const cardHTML='<section class="analytics-exp-kpis">'+cards.map(x=>'<article class="analytics-exp-card"><div class="analytics-exp-card-top"><span>'+esc(x.title)+'</span><span class="analytics-exp-icon">'+icon(x.title.includes('إيراد')?'wallet':'chart-no-axes-combined')+'</span></div><strong dir="auto">'+esc(x.value)+'</strong><small>'+esc(x.note||'بيانات الفترة المحددة')+'</small></article>').join('')+'</section>';
  const panelHTML='<section class="analytics-exp-panels">'+panels.map(x=>'<article class="analytics-exp-panel '+esc(x.span)+'"><header><h2>'+esc(x.title)+'</h2>'+(x.detail?'<button type="button" data-detail="'+esc(x.title)+'">عرض التفاصيل</button>':'')+'</header>'+x.body+'</article>').join('')+'</section>';
  const tableHTML=heads.length?'<section class="analytics-exp-table"><header><h2>تفاصيل '+esc(titles[page])+'</h2><button id="exportDetails" type="button">تصدير CSV</button></header>'+table(heads,rows)+'</section>':'';
  return {html:'<div class="analytics-exp-title"><p><a href="'+url('overview')+'">التحليلات</a> / '+esc(titles[page])+'</p><h1>'+esc(titles[page])+'</h1><small>المؤشرات من بيانات المطعم الفعلية، حسب الفرع والفترة المحددين بتوقيت القاهرة.</small></div>'+cardHTML+panelHTML+tableHTML,exportRows:heads.length?[heads,...rows]:[],details};
 };
 if(page==='kitchen'){
  const readyCount=d.kitchen_days.reduce((n,x)=>n+Number(x.ready_count||0),0);
  cards=[metric('متوسط وقت التحضير',s.preparation_minutes,'minutes',change(s.preparation_minutes,prior?.summary?.preparation_minutes)),metric('طلبات لها وقت تحضير',d.kitchen_days.length?readyCount:null),metric('طلبات قيد التجهيز',d.statuses.find(x=>x.label==='preparing')?.value||0),metric('الطلبات المسجلة',s.orders)];
  panel('منحنى سرعة التحضير على مدار الفترة',d.kitchen_days.some(x=>x.preparation_minutes!=null)?line(d.kitchen_days.map(x=>({label:x.calendar_day,value:x.preparation_minutes||0}))):unavailable('أوقات بدء وانتهاء التحضير'), 'wide');
  panel('الضغط حسب ساعة إنشاء الطلب',bars(d.hours.filter(x=>Number(x.value)>0).map(x=>({label:x.label+':00',value:x.value}))), 'half');
  panel('حالة طلبات المطبخ',donut(d.statuses,'value'), 'half');
  panel('أبطأ الأصناف تحضيرًا',unavailable('زمن تحضير مستقل لكل صنف داخل الطلب'),'half');
  panel('طاقم المطبخ المناوب',unavailable('بداية ونهاية وردية طاقم المطبخ'),'half');
  panel('محطات المطبخ وحدود التأخير',unavailable('محطة تجهيز لكل صنف وحد قياسي معتمد للتأخير'), 'wide');
  heads=['رقم الطلب','وقت الإنشاء','الحالة الحالية','بدء التحضير','وقت الجاهزية','مدة التحضير'];
  rows=d.kitchen_detail.map(x=>[x.reference||'غير متاح',fmtDateTime(x.created_at),label(x.status),fmtDateTime(x.preparing_at),fmtDateTime(x.ready_at),x.preparation_minutes==null?'غير متاح':number(x.preparation_minutes)+' دقيقة']);
 }
 if(page==='customers'){
  cards=[metric('عملاء حساب العميل المرتبطون',c.registered_customers),metric('عملاء لديهم أكثر من طلب مرتبط',c.returning_customers),metric('طلبات مرتبطة بحساب عميل',c.linked_orders),metric('متوسط التقييم',c.average_rating,'number',c.rated_orders==null?'غير متاح':number(c.rated_orders)+' طلبات مقيمة')];
  panel('توزيع العملاء المسجلين',donut(d.customer_segments,'value','عميل'),'half');
  panel('معدل تكرار الطلب لدى الحسابات حسب الشهر',d.customer_months.length?line(d.customer_months.map(x=>({label:x.calendar_month,value:share(x.returning_customers,x.registered)}))):empty(),'half');
  panel('المبيعات لعملاء الحساب المرتبطين',d.customer_top.length?bars(d.customer_top.slice(0,6).map(x=>({label:'عميل '+x.rank,value:x.spent}))):empty(),'half');
  panel('مؤشرات شكاوى العملاء',unavailable('تصنيف شكوى عميل وربطها بحساب العميل'),'half');
  panel('حدود بيانات العملاء',list([['تغطية الطلبات',c.linked_orders==null?'غير متاح':number(c.linked_orders)+' من '+number(s.orders)],['هوية العميل','مجهولة في هذا التقرير'],['شكاوى العملاء','غير متاحة دون تصنيف شكوى مسجل']]),'wide');
  heads=['الترتيب المجهول','الطلبات المرتبطة','إجمالي المدفوع','أول طلب في الفترة','آخر طلب في الفترة'];
  rows=d.customer_top.map(x=>['عميل مسجل '+x.rank,x.orders,currency(x.spent),fmtDate(x.first_order),fmtDate(x.last_order)]);
 }
 if(page==='insights'){
  const peak=[...d.hours].sort((a,b)=>Number(b.value)-Number(a.value))[0],top=d.product_detail[0],cancelRate=share(s.cancelled,s.orders),prepChange=delta(s.preparation_minutes,prior?.summary?.preparation_minutes);
  cards=[metric('الطلبات المسجلة',s.orders),metric('نسبة الإلغاء',s.orders?cancelRate:null,'percent'),metric('ساعة أعلى طلبات',peak?.value?peak.label:null,'number',peak?.value?number(peak.value)+' طلب':'لا توجد طلبات'),metric('متوسط التحضير',s.preparation_minutes,'minutes')];
  const insight=(title,body,route)=>'<article class="analytics-insight"><h3>'+esc(title)+'</h3><p>'+esc(body)+'</p><a href="'+url(route)+'">عرض البيانات</a></article>';
  const findings=[];
  if(Number(s.orders)>0&&s.cancelled!=null)findings.push(insight('معدل الإلغاء المرصود',number(s.cancelled)+' من '+number(s.orders)+' طلب ('+number(cancelRate)+'%) في الفترة المختارة.','order-status'));
  if(peak?.value)findings.push(insight('ساعة الذروة المسجلة',number(peak.value)+' طلب أُنشئ بين '+number(peak.label)+':00 و'+number(peak.label)+':59 بتوقيت القاهرة.','peak-hours'));
  if(top?.quantity)findings.push(insight('الصنف الأعلى بالمبيعات المدفوعة',top.label+' — '+number(top.quantity)+' وحدة، '+currency(top.value)+'.','products'));
  if(prepChange!=null)findings.push(insight('تغير متوسط التحضير',number(Math.abs(prepChange))+'% '+(prepChange<0?'أقل':'أعلى')+' من الفترة السابقة وفق أوقات التحضير المسجلة.','kitchen'));
  if(c.registered_customers!=null&&c.registered_customers>0)findings.push(insight('حسابات العملاء المرتبطة',number(c.returning_customers)+' من '+number(c.registered_customers)+' عملاء مسجلين لديهم أكثر من طلب مرتبط في الفترة.','customers'));
  panel('ملاحظات محسوبة من البيانات',findings.length?'<div class="analytics-insight-grid">'+findings.join('')+'</div>':empty(),'wide');
  panel('طريقة احتساب الرؤى',list([['المصدر','دالة Analytics المحمية بالصلاحيات'],['الأسلوب','قواعد وصفية وحسابات محددة'],['الذكاء الاصطناعي','لا يوجد محرك AI للإنتاج في هذه الصفحة']]),'wide');
 }
 if(page==='products'){
  const p=d.product_detail,top=p[0],total=p.reduce((n,x)=>n+Number(x.value||0),0);
  cards=[metric('أعلى صنف بإيراد مدفوع',top?.value,'money',top?.label||'لا توجد أصناف'),metric('وحدات الصنف الأعلى',top?.quantity),metric('أصناف ذات مبيعات مدفوعة',p.length),metric('إيرادات الأصناف',p.length?total:null,'money')];
  panel('مقارنة إيرادات أعلى 6 أصناف',bars(p.slice(0,6).map(x=>({label:x.label,value:x.value}))),'wide');
  panel('توزيع إيرادات الأصناف',donut(p.slice(0,6).map(x=>({label:x.label,value:x.value})),'value','EGP'),'half');
  panel('أفضل الفئات',bars(d.categories.slice(0,6)),'half');
  panel('الإضافات والهوامش',unavailable('توزيع إضافات مستقل وتكلفة صنف موثوقة لحساب هامش الربح'),'wide');
  heads=['اسم الصنف','الفئة','الوحدات','الطلبات المدفوعة','متوسط سعر الوحدة','الإيراد المدفوع','نسبة المساهمة','النمو'];
  rows=p.map(x=>[x.label,x.category,x.quantity,x.order_count,currency(x.unit_price),currency(x.value),number(share(x.value,total))+'%',(()=>{const v=delta(x.value,prior?.product_detail.find(y=>y.id===x.id)?.value);return v==null?'غير متاح':number(v)+'%';})()]);
 }
 if(page==='order-types'){
  const types=d.type_detail,total=types.reduce((n,x)=>n+Number(x.orders||0),0);
  cards=[metric('إجمالي الطلبات',s.orders),metric('أنواع الطلبات المستخدمة',types.length),metric('أكثر نوع استخدامًا',types[0]?.orders,'number',label(types[0]?.label)),metric('الإيراد المدفوع',s.revenue,'money')];
  panel('توزيع الطلبات حسب النوع',donut(types),'half');
  panel('مقارنة حجم الطلبات',bars(types.map(x=>({label:label(x.label),value:x.orders}))),'half');
  panel('الطلبات حسب النوع وساعة الإنشاء',bars(d.type_hours.map(x=>({label:x.hour_of_day+':00 · '+label(x.label),value:x.orders}))),'wide');
  panel('مصادر الطلبات داخل كل نوع',types.length?'<div class="analytics-facts">'+types.map(x=>'<div><span>'+esc(label(x.label))+'</span><strong>'+esc(d.type_sources.filter(y=>y.label===x.label).map(y=>label(y.source)+' '+number(y.orders)).join(' · ')||'غير متاح')+'</strong></div>').join('')+'</div>':empty(),'wide');
  heads=['نوع الطلب','عدد الطلبات','النسبة','الإيراد المدفوع','متوسط الإيراد لكل طلب','مكتمل','ملغي','نسبة الإلغاء'];
  rows=types.map(x=>[label(x.label),x.orders,number(share(x.orders,total))+'%',currency(x.revenue),currency(x.orders?x.revenue/x.orders:0),x.completed,x.cancelled,number(share(x.cancelled,x.orders))+'%']);
 }
 if(page==='order-status'){
  cards=[metric('إجمالي الطلبات',s.orders),metric('طلبات مكتملة',s.completed),metric('طلبات ملغاة',s.cancelled),metric('متوسط التحضير',s.preparation_minutes,'minutes'),metric('متوسط التوصيل',s.delivery_minutes,'minutes')];
  panel('توزيع الحالات الحالية',donut(d.statuses,'value'),'half');
  panel('انتقالات الحالات المسجلة حسب الساعة',d.status_events.length?bars(d.status_events.map(x=>({label:x.hour_of_day+':00 · '+label(x.label),value:x.events}))):unavailable('أحداث انتقال الحالات لهذه الفترة'),'half');
  panel('وقت إنشاء الطلب والحالة الحالية',bars(d.status_hours.map(x=>({label:x.hour_of_day+':00 · '+label(x.label),value:x.orders}))),'half');
  panel('كفاءة التحويل الزمني',list([['التحضير المسجل',s.preparation_minutes==null?'غير متاح':number(s.preparation_minutes)+' دقيقة'],['التوصيل المسجل',s.delivery_minutes==null?'غير متاح':number(s.delivery_minutes)+' دقيقة']]),'half');
  panel('أسباب الإلغاء والتعثر',list([['طلبات ملغاة',number(s.cancelled)],['سبب إلغاء نصي مسجل',number(d.status_detail.filter(x=>x.status==='cancelled'&&x.cancel_reason).length)],['تصنيف موحد للتعثر','غير متاح']]),'half');
  heads=['رقم الطلب','نوع الطلب','المصدر','الحالة الحالية','وقت الإنشاء','آخر تحديث','المدة في الحالة','سبب الإلغاء المسجل'];
  rows=d.status_detail.map(x=>[x.reference||'غير متاح',label(x.order_type),label(x.order_source),label(x.status),fmtDateTime(x.created_at),fmtDateTime(x.updated_at),'غير متاح',x.cancel_reason||'غير متاح']);
 }
 return finish();
}
