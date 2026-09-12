/* Shared Restaurant OS presentation and RPC boundary. Existing owner/staff sessions are reused. */
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const money=value=>new Intl.NumberFormat('ar-EG',{style:'currency',currency:'EGP'}).format(Number(value)||0);
export const modules=[['tools','أدوات المنيو','/dashboard/menu/'],['takeaway','كاشير تيك أواي','/restaurant/?page=takeaway'],['dinein','كاشير الصالة','/restaurant/?page=dinein'],['prep','محضّر الطلب','/restaurant/?page=prep'],['kitchen','المطبخ','/restaurant/?page=kitchen'],['delivery','التوصيل','/restaurant/?page=delivery'],['analytics','التحليلات','/restaurant/?page=analytics'],['accounts','الحسابات','/restaurant/?page=accounts'],['settings','الإعدادات والصلاحيات','/restaurant/?page=settings']];
export const $=selector=>document.querySelector(selector);
export const sb=window.supabase.createClient('https://ytixcczbjmjnuotzavbb.supabase.co','sb_publishable_0j9jf0boDrMGGO8S6mw-4Q_5bOeHIuU');
export let context;
export async function rpc(name,args={}){const {data,error}=await sb.rpc(name,args);if(error)throw error;return data;}
export function status(message,error=false){const host=$('#osStatus');host.textContent=message;host.className=error?'os-error':'os-status';}
export async function run(button,action){if(button?.disabled)return;try{if(button)button.disabled=true;await action();}catch(error){status(error.message||'تعذر تنفيذ العملية. حاول مرة أخرى.',true);}finally{if(button)button.disabled=false;}}
export function applyTheme(theme){document.documentElement.dataset.theme=theme==='light'?'light':'dark';localStorage.setItem('cardfy_os_theme',document.documentElement.dataset.theme);}
export async function boot(page){
  applyTheme(localStorage.getItem('cardfy_os_theme')||'dark');
  const staffToken=localStorage.getItem('cardfy_menu_staff_token_v1');
  const ownerToken=localStorage.getItem('cardfy_client_token_v1');
  const preferStaff=new URLSearchParams(location.search).get('as')==='staff';
  const candidates=preferStaff?[staffToken,ownerToken]:[ownerToken,staffToken];
  for(const token of candidates.filter(Boolean)){try{context=await rpc('cfy_os_session',{p_token:token});if(context){context.token=token;break;}}catch{/* Try the other existing session, without granting any page access. */}}
  if(!context){location.href='/menu/staff/?next='+encodeURIComponent(location.pathname+location.search);return null;}
  const allowed=context.permissions||[];
  const module=page.startsWith('analytics')?'analytics':page.startsWith('accounts')?'accounts':page;
  if(!allowed.includes(module)){throw new Error('ليس لديك صلاحية دخول هذه الصفحة. اطلب من المالك تعديل صلاحياتك.');}
  document.body.classList.toggle('os-collapsed',matchMedia('(max-width:1050px)').matches);
  $('#osNav').innerHTML=modules.filter(([id])=>allowed.includes(id)).map(([id,title,url])=>`<a href="${url}${context.role==='owner'?'':(url.includes('?')?'&':'?')+'as=staff'}" ${id===module?'aria-current="page"':''}>${title}</a>`).join('');
  $('#osIdentity').textContent=context.name||'CARDfy';
  $('#osMenu').onclick=()=>{document.body.classList.toggle('os-collapsed');$('#osMenu').setAttribute('aria-expanded',String(!document.body.classList.contains('os-collapsed')));};
  $('#osTheme').onclick=()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
  const connectivity=()=>{$('#osOffline').hidden=navigator.onLine;};window.addEventListener('online',connectivity);window.addEventListener('offline',connectivity);connectivity();
  return context;
}
export function dateFilters(branches=[]){const date=new Date().toLocaleDateString('en-CA',{timeZone:'Africa/Cairo'});return `<div class="os-filters"><label class="os-field">الفترة<select id="period"><option value="today">اليوم</option><option value="week">الأسبوع</option><option value="month">الشهر</option><option value="year">السنة</option><option value="custom">فترة مخصصة</option></select></label><label class="os-field">من<input id="from" type="date" value="${date}"></label><label class="os-field">إلى<input id="to" type="date" value="${date}"></label><label class="os-field">الفرع<select id="branch"><option value="">جميع الفروع</option>${branches.map(b=>`<option value="${escapeHTML(b.id)}">${escapeHTML(b.name)}</option>`).join('')}</select></label><button class="os-button primary" id="applyFilters">تطبيق</button></div>`;}
export function bindPeriods(){ $('#period').onchange=()=>{const value=$('#period').value;if(value==='custom')return;const end=new Date(),start=new Date(end);if(value==='week')start.setDate(start.getDate()-6);if(value==='month')start.setDate(1);if(value==='year')start.setMonth(0,1);const iso=d=>d.toLocaleDateString('en-CA',{timeZone:'Africa/Cairo'});$('#from').value=iso(start);$('#to').value=iso(end);};}
export function filterArgs(){if(!$('#from').value||!$('#to').value||$('#from').value>$('#to').value)throw new Error('راجع الفترة الزمنية.');return {p_from:$('#from').value,p_to:$('#to').value,p_branch:$('#branch').value||null};}
export function table(headers,rows){return `<div class="os-table-wrap"><table class="os-table"><thead><tr>${headers.map(h=>`<th>${escapeHTML(h)}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(row=>`<tr>${row.map(value=>`<td>${escapeHTML(value)}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${headers.length}" class="os-empty">لا توجد بيانات لهذه الفترة.</td></tr>`}</tbody></table></div>`;}
export function chart(rows,key='value'){if(!rows.length)return '<p class="os-empty">لا توجد بيانات بعد.</p>';const max=Math.max(...rows.map(r=>Number(r[key])||0),1);return `<div class="os-chart" role="img" aria-label="توزيع القيم">${rows.map(r=>`<div class="os-chart-col"><span>${escapeHTML(r[key])}</span><div class="os-chart-bar" style="height:${Math.max(1,Number(r[key])/max*150)}px"></div><span>${escapeHTML(r.label)}</span></div>`).join('')}</div>`;}
export function exportCSV(name,headers,rows){const cell=value=>'"'+String(value??'').replace(/^[=+@\-]/,"'$&").replaceAll('"','""')+'"';const blob=new Blob(['\ufeff'+[headers,...rows].map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name+'.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
