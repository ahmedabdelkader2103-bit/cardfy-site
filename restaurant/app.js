import {boot,status,$} from './shared.js?v=20260926-lovable-pos';
const page=new URLSearchParams(location.search).get('page')||'prep';
try{
 const session=await boot(page);
 if(session){
  if(page.startsWith('owner')){const {mountOwner}=await import('./owner.js?v=20260926-lovable-pos');await mountOwner(page,session);}
  else if(page.startsWith('accounts')){const {mountFinance}=await import('./finance.js?v=20260926-lovable-pos');await mountFinance(page);}
  else if(page==='delivery'&&session.role==='delivery'){const {mountDelivery}=await import('./delivery.js?v=20260926-lovable-pos');await mountDelivery();}
  else if(page==='kitchen'){const {mountKitchen}=await import('./kitchen.js?v=20260926-lovable-pos');await mountKitchen();}
  else if(['prep','delivery'].includes(page)){const {mountOperations}=await import('./operations.js?v=20260926-lovable-pos');await mountOperations(page);}
  else if(page==='settings'){const {mountSettings}=await import('./settings.js?v=20260926-lovable-pos');await mountSettings();}
  else if(page.startsWith('analytics')){const {mountAnalytics}=await import('./analytics.js?v=20260926-lovable-pos');await mountAnalytics(page);}
  else if(page==='takeaway'){const {mountPOS}=await import('./pos.js?v=20260926-lovable-pos');await mountPOS(page);}
  else if(page==='dinein'){const {mountPOS}=await import('./pos-dinein.js?v=20260926-lovable-pos');await mountPOS(page);}
  else throw new Error('الصفحة غير موجودة.');
 }
}catch(error){status(error.message||'تعذر تحميل الصفحة.',true);}
