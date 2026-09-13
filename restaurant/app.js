import {boot,status,$} from './shared.js?v=20260913-1';
const page=new URLSearchParams(location.search).get('page')||'prep';
try{
 const session=await boot(page);
 if(session){
  if(page.startsWith('accounts')){const {mountFinance}=await import('./finance.js?v=20260913-1');await mountFinance(page);}
  else if(['prep','kitchen','delivery'].includes(page)){const {mountOperations}=await import('./operations.js?v=20260913-1');await mountOperations(page);}
  else if(page==='settings'){const {mountSettings}=await import('./settings.js?v=20260913-1');await mountSettings();}
  else if(page.startsWith('analytics')){const {mountAnalytics}=await import('./analytics.js?v=20260913-1');await mountAnalytics(page);}
  else if(['takeaway','dinein'].includes(page)){const {mountPOS}=await import('./pos.js?v=20260913-1');await mountPOS(page);}
  else throw new Error('الصفحة غير موجودة.');
 }
}catch(error){status(error.message||'تعذر تحميل الصفحة.',true);}
