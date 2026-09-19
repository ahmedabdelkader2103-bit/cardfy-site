import {$,context,rpc,run,status,money,escapeHTML as esc,dateFilters,bindPeriods,filterArgs} from './shared.js?v=20260919-owner';
import {ownerModel,filterAlerts,safeOwnerRoute,actionLabel,operationLabel,severityLabel,kindLabel,percent} from './owner-data.js?v=20260919-owner';

let page='owner',snapshot={},model={},filters={severity:'',kind:'',query:''};
const num=value=>Number(value)||0;
const route=value=>`${value}${context.role==='owner'?'':'&as=staff'}`;
const value=(number,digits=0)=>new Intl.NumberFormat('ar-EG',{maximumFractionDigits:digits}).format(num(number));
const kpi=(title,number,caption,tone='',icon='◆')=>`<article class="owner-kpi ${tone}"><span class="owner-icon">${icon}</span><div><span>${esc(title)}</span><strong>${esc(number)}</strong><small>${esc(caption)}</small></div></article>`;
const panel=(title,body,link='',caption='')=>`<section class="owner-panel"><header><div><h2>${esc(title)}</h2>${caption?`<p>${esc(caption)}</p>`:''}</div>${link?`<a href="${safeOwnerRoute(link)}">عرض التفاصيل ←</a>`:''}</header>${body}</section>`;
const empty=message=>`<p class="owner-empty">${esc(message)}</p>`;

export async function mountOwner(value){
  if(context.role!=='owner')throw new Error('هذه الصفحة متاحة لمالك المطعم فقط.');
  page=value==='owner-alerts'?'owner-alerts':'owner';
  document.body.classList.add('owner-active');
  $('#osContent').innerHTML=`<div class="owner-heading"><div><span class="owner-eyebrow"><bdi dir="ltr">CARDfy</bdi> · المالك</span><h1>${page==='owner-alerts'?'مركز التنبيهات والإجراءات':'مركز قيادة المالك'}</h1><p>${page==='owner-alerts'?'تنبيهات تشغيلية حتمية من البيانات المسجلة مع انتقال مباشر لمكان المعالجة.':'لقطة تنفيذية موحّدة تساعدك على اتخاذ القرار دون تكرار شاشات التشغيل.'}</p></div><div class="owner-heading-actions"><a class="os-button ${page==='owner'?'primary':''}" href="?page=owner">مركز القيادة</a><a class="os-button ${page==='owner-alerts'?'primary':''}" href="?page=owner-alerts">التنبيهات والإجراءات</a></div></div><div id="ownerFilters">${dateFilters()}</div><div id="ownerBody"></div>`;
  bindPeriods();$('#applyFilters').onclick=e=>run(e.target,load);await load();
}

async function load(){
  status('جارٍ تحميل بيانات مركز القيادة…');
  const selected=$('#branch').value;
  snapshot=await rpc('cfy_os_owner_command',{p_token:context.token,...filterArgs()});
  model=ownerModel(snapshot);
  $('#branch').innerHTML='<option value="">جميع الفروع</option>'+model.branches.map(branch=>`<option value="${esc(branch.id)}">${esc(branch.name)}</option>`).join('');
  $('#branch').value=selected;
  render();status('');
}

function render(){if(page==='owner-alerts')renderAlerts();else renderCommand();}

function renderCommand(){
  const s=model.summary,o=model.operations,profit=num(s.operating_profit),rating=s.average_rating==null?'لا توجد تقييمات':`${value(s.average_rating,1)} / 5`;
  const kpis=`<div class="owner-kpi-strip">${kpi('إيرادات الفترة',money(s.revenue),'طلبات مدفوعة + إيرادات مسجلة','good','↗')}${kpi('الربح التشغيلي التقديري',money(profit),'بعد المصروفات والرواتب المسجلة',profit>=0?'good':'bad','◈')}${kpi('إجمالي الطلبات',value(s.orders),'خلال الفترة المحددة','','▣')}${kpi('الطلبات الجارية',value(s.active_orders),'الحالة التشغيلية الآن','','◷')}${kpi('بلاغات مفتوحة',value(s.open_issues),'تحتاج متابعة',num(s.open_issues)?'bad':'good','!')}${kpi('مواد منخفضة',value(s.low_stock),'حسب حد إعادة الطلب',num(s.low_stock)?'warn':'good','▥')}${kpi('المندوبون المتاحون',`${value(s.active_drivers)} / ${value(s.total_drivers)}`,'حالة الشيفت الحالية','','⌁')}${kpi('تقييم العملاء',rating,`${value(s.rated_orders)} طلب مقيّم`,'','★')}</div>`;
  const alertPreview=model.alerts.slice(0,3).map(alert=>alertCard(alert,true)).join('')||empty('لا توجد تنبيهات تشغيلية حالية وفق القواعد المسجلة.');
  const operations=`<div class="owner-operation-grid"><a href="${route('/restaurant/?page=prep')}"><strong>${value(o.new)}</strong><span>طلبات جديدة</span></a><a href="${route('/restaurant/?page=kitchen')}"><strong>${value(o.preparing)}</strong><span>قيد التحضير</span></a><a href="${route('/restaurant/?page=prep')}"><strong>${value(o.ready)}</strong><span>جاهزة</span></a><a href="${route('/restaurant/?page=delivery')}"><strong>${value(o.on_the_way)}</strong><span>في الطريق</span></a><a href="${route('/restaurant/?page=dinein')}"><strong>${value(o.table_payments)}</strong><span>طاولات تنتظر التحصيل</span></a></div>`;
  const financial=`<div class="owner-snapshot-grid"><div><span>الإيرادات</span><strong>${money(s.revenue)}</strong></div><div><span>المصروفات المسجلة</span><strong>${money(s.expenses)}</strong></div><div><span>الرواتب المسجلة</span><strong>${money(s.payroll)}</strong></div><div class="${profit>=0?'positive':'negative'}"><span>الربح التشغيلي التقديري</span><strong>${money(profit)}</strong></div></div><p class="owner-note">لا يشمل الرقم تكلفة الطعام حتى اعتماد الاستهلاك الآلي للوصفات، ولا يمثل صافي ربح قانوني أو ضريبي.</p>`;
  const customers=`<div class="owner-snapshot-grid"><div><span>طلبات مكتملة</span><strong>${value(s.completed)}</strong></div><div><span>طلبات ملغاة</span><strong>${value(s.cancelled)}</strong></div><div><span>متوسط الطلب المدفوع</span><strong>${money(s.average_order)}</strong></div><div><span>متوسط التقييم</span><strong>${rating}</strong></div></div>`;
  const inventory=model.inventory.length?`<div class="owner-inventory-list">${model.inventory.slice(0,5).map(item=>`<div><span>${esc(item.name)}</span><strong>${value(item.quantity,2)} ${esc(item.unit)}</strong><small>حد الطلب ${value(item.minimum_quantity,2)}</small></div>`).join('')}</div>`:empty('المخزون ضمن الحدود المسجلة حاليًا.');
  const quick=`<div class="owner-quick-actions"><a class="primary" href="/restaurant/?page=owner-alerts">مراجعة التنبيهات</a><a href="/restaurant/?page=prep">متابعة الطلبات</a><a href="/restaurant/?page=kitchen">عرض المطبخ</a><a href="/restaurant/?page=accounts-inventory">إدارة المخزون</a><a href="/restaurant/?page=analytics">فتح التحليلات</a><a href="/restaurant/?page=accounts">فتح الحسابات</a></div>`;
  $('#ownerBody').innerHTML=`${kpis}<div class="owner-command-grid"><div class="owner-span-7">${panel('الأولوية الآن',alertPreview,'/restaurant/?page=owner-alerts','تنبيهات من الحالة الفعلية المسجلة')}</div><div class="owner-span-5">${panel('العمليات الآن',operations,'/restaurant/?page=prep','حالة الطلبات والطاولات الحالية')}</div></div><div class="owner-three">${panel('لقطة مالية سريعة',financial,'/restaurant/?page=accounts-profit')}${panel('تجربة العملاء',customers,'/analytics/customers/')} ${panel('المخزون والمتابعة',inventory,'/restaurant/?page=accounts-inventory')}</div>${panel('إجراءات سريعة',quick,'','روابط آمنة إلى الوحدات الحالية')}`;
}

function alertCard(alert,compact=false){return `<article class="owner-alert ${esc(alert.severity)} ${compact?'compact':''}"><span class="owner-alert-dot"></span><div><div class="owner-alert-meta"><span>${esc(severityLabel[alert.severity]||'تنبيه')}</span><span>${esc(kindLabel[alert.kind]||alert.kind)}</span></div><h3>${esc(alert.title)}</h3><p>${esc(alert.detail)}</p></div><a href="${safeOwnerRoute(alert.route)}">${esc(actionLabel(alert.kind))}</a></article>`;}

function renderAlerts(){
  const uniqueKinds=[...new Set(model.alerts.map(alert=>alert.kind))];
  const list=filterAlerts(model.alerts,filters),total=model.alerts.length;
  const summary=`<div class="owner-alert-summary">${kpi('إجمالي التنبيهات',value(total),'الحالة الحالية','','◉')}${kpi('تنبيهات حرجة',value(model.counts.critical),'تتطلب متابعة مباشرة',model.counts.critical?'bad':'good','!')}${kpi('تنبيهات متوسطة',value(model.counts.warning),'تحتاج مراجعة',model.counts.warning?'warn':'good','◆')}${kpi('معلومات تشغيلية',value(model.counts.info),'للمتابعة','','i')}${kpi('نسبة الحرجة',`${percent(model.counts.critical,total)}%`,'من التنبيهات الحالية','','%')}</div>`;
  const controls=`<div class="owner-alert-filters"><input id="ownerAlertSearch" placeholder="ابحث داخل التنبيهات" value="${esc(filters.query)}"><select id="ownerSeverity"><option value="">كل الأولويات</option>${Object.entries(severityLabel).map(([id,label])=>`<option value="${id}" ${filters.severity===id?'selected':''}>${esc(label)}</option>`).join('')}</select><select id="ownerKind"><option value="">كل الأقسام</option>${uniqueKinds.map(id=>`<option value="${esc(id)}" ${filters.kind===id?'selected':''}>${esc(kindLabel[id]||id)}</option>`).join('')}</select></div>`;
  const alertList=list.length?`<div class="owner-alert-list">${list.map(alert=>alertCard(alert)).join('')}</div>`:empty('لا توجد تنبيهات مطابقة للفلاتر.');
  const priority=model.alerts.filter(alert=>alert.severity==='critical').slice(0,3).map(alert=>alertCard(alert,true)).join('')||empty('لا توجد أولوية حرجة الآن.');
  const events=model.events.length?`<div class="owner-event-chart">${model.events.map(event=>`<div><span>${value(event.value)}</span><i style="height:${Math.max(8,num(event.value)/Math.max(...model.events.map(x=>num(x.value)),1)*120)}px"></i><small>${new Date(event.hour).toLocaleTimeString('ar-EG',{hour:'numeric'})}</small></div>`).join('')}</div>`:empty('لم تُسجل أحداث تنبيه خلال آخر 24 ساعة في الفترة المختارة.');
  const suggestions=[...new Map(model.alerts.map(alert=>[alert.kind,alert])).values()].slice(0,5).map(alert=>`<a class="owner-suggestion" href="${safeOwnerRoute(alert.route)}"><div><strong>${esc(actionLabel(alert.kind))}</strong><span>${esc(alert.title)}</span></div><b>فتح ←</b></a>`).join('')||empty('لا توجد إجراءات مقترحة الآن.');
  const actions=model.actions.length?`<div class="owner-recent-actions">${model.actions.map(action=>`<div><span>${esc(operationLabel(action.operation))}</span><strong>${esc(action.entity||'')}</strong><time>${new Date(action.created_at).toLocaleString('ar-EG',{dateStyle:'short',timeStyle:'short'})}</time></div>`).join('')}</div>`:empty('لا توجد إجراءات تشغيلية حديثة في الفترة المحددة.');
  $('#ownerBody').innerHTML=`${summary}${controls}<div class="owner-alert-layout"><div class="owner-alert-main">${panel(`قائمة التنبيهات (${value(list.length)})`,alertList,'','مرتبة حسب الأولوية والوقت')}</div><div>${panel('أولوية الآن',priority,'','التنبيهات الحرجة فقط')}</div></div><div class="owner-three">${panel('أحداث التنبيه خلال 24 ساعة',events,'','بلاغات وإلغاءات واستثناءات مسجلة')}${panel('الإجراءات المقترحة',suggestions,'','انتقال مباشر للوحدة المسؤولة')}${panel('أحدث الإجراءات',actions,'','من سجل أحداث الطلبات')}</div>`;
  $('#ownerAlertSearch').oninput=e=>{filters.query=e.target.value;renderAlerts();};
  $('#ownerSeverity').onchange=e=>{filters.severity=e.target.value;renderAlerts();};
  $('#ownerKind').onchange=e=>{filters.kind=e.target.value;renderAlerts();};
}
