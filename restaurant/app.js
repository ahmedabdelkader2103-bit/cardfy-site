import {boot,status,$} from './shared.js?v=20260919-owner';
const page=new URLSearchParams(location.search).get('page')||'prep';
try{
 const session=await boot(page);
 if(session){
  if(page.startsWith('owner')){const {mountOwner}=await import('./owner.js?v=20260919-owner');await mountOwner(page);}
  else if(page.startsWith('accounts')){const {mountFinance}=await import('./finance.js?v=20260919-owner');await mountFinance(page);}
  else if(page==='delivery'&&session.role==='delivery'){const {mountDelivery}=await import('./delivery.js?v=20260919-owner');await mountDelivery();}
  else if(['prep','kitchen','delivery'].includes(page)){const {mountOperations}=await import('./operations.js?v=20260919-owner');await mountOperations(page);}
  else if(page==='settings'){const {mountSettings}=await import('./settings.js?v=20260919-owner');await mountSettings();}
  else if(page.startsWith('analytics')){const {mountAnalytics}=await import('./analytics.js?v=20260919-owner');await mountAnalytics(page);}
  else if(['takeaway','dinein'].includes(page)){const {mountPOS}=await import('./pos.js?v=20260919-owner');await mountPOS(page);}
  else throw new Error('الصفحة غير موجودة.');
 }
}catch(error){status(error.message||'تعذر تحميل الصفحة.',true);}
