import {$,rpc,run,status,money,escapeHTML as esc,dateFilters,bindPeriods,filterArgs} from './shared.js?v=20260920-pos-ui';
import {ownerModel,filterAlerts,safeOwnerRoute,actionLabel,operationLabel,severityLabel,kindLabel} from './owner-data.js?v=20260920-pos-ui';

let page='owner',actor,model={},filters={severity:'',kind:'',query:''};
const num=value=>Number(value)||0;
const route=value=>`${value}${actor.role==='owner'?'':'&as=staff'}`;
const value=(number,digits=0)=>new Intl.NumberFormat('ar-EG',{maximumFractionDigits:digits}).format(num(number));
const unavailable=(reason='لا يدعمه نموذج البيانات الحالي')=>`<span class="owner-unavailable">غير متاح</span><small>${esc(reason)}</small>`;
const metric=(title,number,caption,{tone='',icon='◆',missing=false}={})=>`<article class="owner-kpi ${tone} ${missing?'is-missing':''}"><span class="owner-icon" aria-hidden="true">${icon}</span><div><span>${esc(title)}</span>${missing?unavailable(caption):`<strong>${esc(number)}</strong><small>${esc(caption)}</small>`}</div></article>`;
const panel=(title,body,link='',caption='',classes='')=>`<section class="owner-panel ${classes}"><header><div><h2>${esc(title)}</h2>${caption?`<p>${esc(caption)}</p>`:''}</div>${link?`<a href="${safeOwnerRoute(link)}">عرض التفاصيل ←</a>`:''}</header>${body}</section>`;
const empty=message=>`<p class="owner-empty">${esc(message)}</p>`;
const nowCairo=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Africa/Cairo'});

export async function mountOwner(value,session){
  actor=session;
  if(actor?.role!=='owner')throw new Error('هذه الصفحة متاحة لمالك المطعم فقط.');
  page=value==='owner-alerts'?'owner-alerts':'owner';document.body.classList.add('owner-active');
  $('#osContent').innerHTML=`<div class="owner-heading"><div><span class="owner-eyebrow"><bdi dir="ltr">CARDfy</bdi> · المالك</span><h1>${page==='owner-alerts'?'مركز التنبيهات والإجراءات':'مركز قيادة المالك'}</h1><p>${page==='owner-alerts'?'كل التنبيهات التشغيلية المهمة مرتبة حسب الأولوية، مع انتقال مباشر إلى مكان المعالجة.':'نظرة تنفيذية على التشغيل والمال والعملاء والمخزون لاتخاذ القرار من مكان واحد.'}</p></div><div class="owner-heading-actions"><a class="os-button ${page==='owner'?'primary':''}" href="?page=owner">مركز القيادة</a><a class="os-button ${page==='owner-alerts'?'primary':''}" href="?page=owner-alerts">التنبيهات والإجراءات</a></div></div><div id="ownerFilters">${dateFilters()}</div><div id="ownerBody"></div>`;
  bindPeriods();$('#applyFilters').onclick=e=>run(e.target,load);await load();
}

async function load(){
  status('جارٍ تحميل بيانات مركز القيادة…');const selected=$('#branch').value;
  model=ownerModel(await rpc('cfy_os_owner_command',{p_token:actor.token,...filterArgs()}));
  $('#branch').innerHTML='<option value="">جميع الفروع</option>'+model.branches.map(branch=>`<option value="${esc(branch.id)}">${esc(branch.name)}</option>`).join('');
  $('#branch').value=selected;render();status('');
}

function render(){if(page==='owner-alerts')renderAlerts();else renderCommand();}

function renderCommand(){
  const s=model.summary,o=model.operations,profit=num(s.operating_profit),rating=s.average_rating==null?'لا توجد تقييمات':`${value(s.average_rating,1)} / 5`;
  const today=$('#from').value===nowCairo()&&$('#to').value===nowCairo();
  const kpis=`<div class="owner-kpi-strip owner-executive-strip">
    ${metric('رصيد الخزنة','', 'يحتاج حركة خزنة وتسويات نقدية معتمدة',{icon:'▤',missing:true})}
    ${metric(today?'مبيعات اليوم':'مبيعات الفترة',money(s.revenue),`${value(s.paid_orders)} طلب مدفوع`,{tone:'good',icon:'↗'})}
    ${metric('الطلبات الجارية',value(s.active_orders),'الحالة التشغيلية الآن',{icon:'▣'})}
    ${metric('الطلبات المتأخرة','', 'يحتاج حد تأخير تشغيلي معتمد',{icon:'!',missing:true})}
    ${metric('متوسط التحضير',s.preparation_minutes==null?'—':`${value(s.preparation_minutes,1)} دقيقة`,'للطلبات المكتملة زمنيًا',{icon:'◷'})}
    ${metric('متوسط التوصيل',s.delivery_minutes==null?'—':`${value(s.delivery_minutes,1)} دقيقة`,'من الاستلام حتى التسليم',{icon:'⌁'})}
    ${metric('المندوبون النشطون',`${value(s.active_drivers)} / ${value(s.total_drivers)}`,'على مستوى المطعم',{icon:'♟'})}
    ${metric('التقييم العام',rating,`${value(s.rated_orders)} طلب مقيّم · ${value(s.low_stock)} تنبيه مخزون`,{tone:num(s.low_stock)?'warn':'',icon:'★'})}
  </div>`;
  const alertPreview=model.alerts.slice(0,3).map(alert=>alertCard(alert,true)).join('')||empty('لا توجد تنبيهات تشغيلية حالية وفق القواعد المسجلة.');
  const operations=`<div class="owner-operation-grid">
    ${operationCard('حالة المطبخ',o.preparing,'قيد التحضير','/restaurant/?page=kitchen','◴')}
    ${operationCard('حالة التوصيل',o.on_the_way,'في الطريق','/restaurant/?page=delivery','⌁')}
    ${operationCard('نقاط البيع (POS)',null,'حالة الأجهزة والاتصال غير مرصودة','/restaurant/?page=takeaway','▦',true)}
    ${operationCard('الطلبات الآن',s.active_orders,`${value(o.new)} جديد · ${value(o.ready)} جاهز`,'/restaurant/?page=prep','▣')}
  </div>`;
  const financial=`<div class="owner-snapshot-grid"><div><span>الإيرادات</span><strong>${money(s.revenue)}</strong></div><div><span>المصروفات المسجلة</span><strong>${money(s.expenses)}</strong></div><div><span>الرواتب المسجلة</span><strong>${money(s.payroll)}</strong></div><div class="${profit>=0?'positive':'negative'}"><span>الربح التشغيلي التقديري</span><strong>${money(profit)}</strong></div></div><div class="owner-data-gap"><span>توزيع طرق الدفع</span>${unavailable('غير متاح في قراءة مركز القيادة الحالية')}</div><p class="owner-note">لا يشمل الربح تكلفة الطعام حتى اعتماد الاستهلاك الآلي للوصفات، ولا يمثل صافي ربح قانوني أو ضريبي.</p>`;
  const customers=`<div class="owner-rating"><strong>${rating}</strong><span>بناءً على ${value(s.rated_orders)} طلب مقيّم</span></div><div class="owner-snapshot-grid"><div><span>طلبات مكتملة</span><strong>${value(s.completed)}</strong></div><div><span>طلبات ملغاة</span><strong>${value(s.cancelled)}</strong></div><div><span>بلاغات مفتوحة</span><strong>${value(s.open_issues)}</strong></div><div><span>متوسط الطلب المدفوع</span><strong>${money(s.average_order)}</strong></div></div><div class="owner-data-gap"><span>نص آخر تقييم</span>${unavailable('لا تعرض القراءة الحالية نصوص تقييمات العملاء')}</div>`;
  const inventory=model.inventory.length?`<div class="owner-inventory-list">${model.inventory.slice(0,5).map(item=>`<div><span>${esc(item.name)}</span><strong>${value(item.quantity,2)} ${esc(item.unit)}</strong><small>حد الطلب ${value(item.minimum_quantity,2)}</small></div>`).join('')}</div>`:empty('المخزون ضمن الحدود المسجلة حاليًا.');
  const quick=`<div class="owner-quick-actions"><a class="primary" href="/restaurant/?page=owner-alerts">مراجعة التنبيهات</a><a href="/restaurant/?page=prep">متابعة الطلبات</a><a href="/restaurant/?page=kitchen">عرض المطبخ</a><a href="/restaurant/?page=accounts-inventory">إدارة المخزون</a><a href="/restaurant/?page=analytics">فتح التحليلات</a><a href="/restaurant/?page=accounts">فتح الحسابات</a></div>`;
  $('#ownerBody').innerHTML=`${kpis}<div class="owner-command-grid"><div class="owner-span-7">${panel('التنبيهات ذات الأولوية',alertPreview,'/restaurant/?page=owner-alerts','تنبيهات آلية من بيانات التشغيل المسجلة')}</div><div class="owner-span-5">${panel('العمليات الآن',operations,'/restaurant/?page=prep','حالة الطلبات الحالية')}</div></div><div class="owner-three">${panel('لقطة مالية سريعة',financial,'/restaurant/?page=accounts-profit')}${panel('تجربة العملاء',customers,'/analytics/customers/')}${panel('المخزون والمتابعة',inventory,'/restaurant/?page=accounts-inventory',`${value(s.low_stock)} صنف عند حد إعادة الطلب`)}</div>${panel('إجراءات سريعة',quick,'','روابط مباشرة إلى وحدات CARDfy الحالية')}`;
}

function operationCard(title,number,caption,href,icon,missing=false){return `<a class="owner-operation-card ${missing?'is-missing':''}" href="${route(href)}"><span class="owner-operation-icon">${icon}</span><div><strong>${esc(title)}</strong>${missing?'<b>غير مرصود</b>':`<b>${value(number)}</b>`}<small>${esc(caption)}</small></div></a>`;}
function alertCard(alert,compact=false){return `<article class="owner-alert ${esc(alert.severity)} ${compact?'compact':''}"><span class="owner-alert-dot"></span><div><div class="owner-alert-meta"><span>${esc(severityLabel[alert.severity]||'تنبيه')}</span><span>${esc(kindLabel[alert.kind]||alert.kind)}</span></div><h3>${esc(alert.title)}</h3><p>${esc(alert.detail)}</p>${!compact?`<time>${formatDate(alert.created_at)}</time>`:''}</div><a href="${safeOwnerRoute(alert.route)}">${esc(actionLabel(alert.kind))}</a></article>`;}
function formatDate(input){if(!input)return 'الوقت غير مسجل';const date=new Date(input);return Number.isNaN(date.getTime())?'الوقت غير مسجل':date.toLocaleString('ar-EG',{dateStyle:'short',timeStyle:'short'});}

function renderAlerts(){
  const uniqueKinds=[...new Set(model.alerts.map(alert=>alert.kind))],list=filterAlerts(model.alerts,filters),total=model.alerts.length;
  const summary=`<div class="owner-alert-summary">
    ${metric('التنبيهات الحرجة',value(model.counts.critical),'تحتاج إجراءً مباشرًا',{tone:model.counts.critical?'bad':'good',icon:'!'})}
    ${metric('التنبيهات المتوسطة',value(model.counts.warning),'تحتاج مراجعة',{tone:model.counts.warning?'warn':'good',icon:'◆'})}
    ${metric('تم حلها اليوم','','لا يوجد سجل دورة حياة للتنبيه',{icon:'✓',missing:true})}
    ${metric('في انتظار المتابعة',value(total),'التنبيهات الحالية المفتوحة',{icon:'◉'})}
    ${metric('متوسط وقت الاستجابة','','لا تُسجل أوقات الاستجابة بعد',{icon:'◷',missing:true})}
  </div>`;
  const controls=`<div class="owner-alert-filters"><label><span>بحث</span><input id="ownerAlertSearch" placeholder="عنوان أو تفاصيل التنبيه" value="${esc(filters.query)}"></label><label><span>الأولوية</span><select id="ownerSeverity"><option value="">كل الأولويات</option>${Object.entries(severityLabel).map(([id,label])=>`<option value="${id}" ${filters.severity===id?'selected':''}>${esc(label)}</option>`).join('')}</select></label><label><span>المصدر</span><select id="ownerKind"><option value="">كل الأقسام</option>${uniqueKinds.map(id=>`<option value="${esc(id)}" ${filters.kind===id?'selected':''}>${esc(kindLabel[id]||id)}</option>`).join('')}</select></label></div>`;
  const table=list.length?`<div class="owner-alert-table-wrap"><table class="owner-alert-table"><thead><tr><th>عنوان التنبيه</th><th>المصدر</th><th>الوقت</th><th>الحالة</th><th>المسؤول</th><th>الإجراء</th></tr></thead><tbody>${list.map(alert=>`<tr><td><strong>${esc(alert.title)}</strong><small>${esc(alert.detail)}</small></td><td>${esc(kindLabel[alert.kind]||alert.kind)}</td><td>${esc(formatDate(alert.created_at))}</td><td><span class="owner-severity ${esc(alert.severity)}">${esc(severityLabel[alert.severity]||'تنبيه')}</span></td><td><span class="owner-muted">غير مسند</span></td><td><a href="${safeOwnerRoute(alert.route)}">${esc(actionLabel(alert.kind))}</a></td></tr>`).join('')}</tbody></table></div>`:empty('لا توجد تنبيهات مطابقة للفلاتر.');
  const priority=model.alerts.filter(alert=>alert.severity==='critical').slice(0,3).map(alert=>alertCard(alert,true)).join('')||empty('لا توجد أولوية حرجة الآن.');
  const max=Math.max(...model.events.map(x=>num(x.value)),1);
  const events=model.events.length?`<div class="owner-event-chart" role="img" aria-label="عدد أحداث التنبيه المسجلة خلال آخر 24 ساعة">${model.events.map(event=>`<div><span>${value(event.value)}</span><i style="height:${Math.max(8,num(event.value)/max*120)}px"></i><small>${new Date(event.hour).toLocaleTimeString('ar-EG',{hour:'numeric'})}</small></div>`).join('')}</div><p class="owner-note">عرض إجمالي للأحداث المسجلة؛ الفصل التاريخي حسب الأولوية غير متاح.</p>`:empty('لم تُسجل أحداث تنبيه خلال آخر 24 ساعة في الفترة المختارة.');
  const suggestions=[...new Map(model.alerts.map(alert=>[alert.kind,alert])).values()].slice(0,5).map(alert=>`<a class="owner-suggestion" href="${safeOwnerRoute(alert.route)}"><div><strong>${esc(actionLabel(alert.kind))}</strong><span>${esc(alert.title)}</span></div><b>فتح ←</b></a>`).join('')||empty('لا توجد إجراءات مقترحة الآن.');
  const actions=model.actions.length?`<div class="owner-recent-actions">${model.actions.map(action=>`<div><span>${esc(operationLabel(action.operation))}</span><strong>${esc(action.entity||'')}</strong><time>${esc(formatDate(action.created_at))}</time></div>`).join('')}</div>`:empty('لا توجد إجراءات تشغيلية حديثة في الفترة المحددة.');
  $('#ownerBody').innerHTML=`${summary}${controls}${panel(`قائمة التنبيهات (${value(list.length)})`,table,'','مرتبة حسب الأولوية والوقت','owner-alert-table-panel')}<div class="owner-alert-support">${panel('أولوية الآن',priority,'','التنبيهات الحرجة فقط')}${panel('حجم التنبيهات خلال 24 ساعة',events,'','الأحداث التشغيلية المسجلة')}</div><div class="owner-two">${panel('الإجراءات المقترحة',suggestions,'','روابط حتمية إلى الوحدة المسؤولة')}${panel('أحدث الإجراءات',actions,'','من سجل أحداث الطلبات')}</div>`;
  $('#ownerAlertSearch').oninput=e=>{filters.query=e.target.value;renderAlerts();};$('#ownerSeverity').onchange=e=>{filters.severity=e.target.value;renderAlerts();};$('#ownerKind').onchange=e=>{filters.kind=e.target.value;renderAlerts();};
}