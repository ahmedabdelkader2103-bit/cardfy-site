import {$,context,rpc,status} from './shared.js?v=20260926-lovable-pos';
import {customerHandoff} from './customer-handoff.mjs?v=20260926-lovable-pos';

const branchKey=()=>`cardfy_os_branch:${context.client_id}:${context.id||'owner'}:takeaway`;
const validBranch=(branches,id)=>branches.some(branch=>branch.id===id)?id:'';
function chooseBranch(branches,actor){
 const fromSession=validBranch(branches,sessionStorage.getItem(branchKey())||''),defaultId=validBranch(branches,context.default_branch_id||actor?.default_branch_id||'');
 if(fromSession)return Promise.resolve(fromSession);
 if(defaultId){sessionStorage.setItem(branchKey(),defaultId);return Promise.resolve(defaultId);}
 if(branches.length===1){sessionStorage.setItem(branchKey(),branches[0].id);return Promise.resolve(branches[0].id);}
 return new Promise(resolve=>{const dialog=document.createElement('dialog');dialog.className='os-dialog pos-branch-dialog';dialog.innerHTML=`<form method="dialog"><h2>اختر الفرع</h2><p>حدد الفرع قبل فتح شاشة الكاشير.</p><label class="os-field">الفرع<select required><option value="">اختر الفرع</option>${branches.map(branch=>`<option value="${branch.id}">${String(branch.name||'فرع').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</option>`).join('')}</select></label><button class="os-button primary" type="submit">فتح الكاشير</button></form>`;dialog.addEventListener('cancel',event=>event.preventDefault());dialog.querySelector('form').onsubmit=event=>{event.preventDefault();const id=dialog.querySelector('select').value;if(!validBranch(branches,id))return;sessionStorage.setItem(branchKey(),id);dialog.close();dialog.remove();resolve(id)};document.body.append(dialog);dialog.showModal();});
}
function installStylesheet(){if(document.querySelector('link[data-lovable-pos]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href='/restaurant/pos-ui/main.css?v=20260926';link.dataset.lovablePos='true';document.head.append(link);}
export async function mountPOS(page){
 const snapshot=await rpc('cfy_os_operational_snapshot',{p_token:context.token,p_page:page});if(!snapshot.branches?.length)throw new Error('لا يوجد فرع متاح لهذه الجلسة.');
 const branchId=await chooseBranch(snapshot.branches,snapshot.actor);installStylesheet();document.body.classList.add('lovable-pos-active','os-collapsed');const host=$('#osContent');host.innerHTML='<div id="lovablePosRoot"></div>';
 const island=await import('./pos-ui/entry.js?v=20260926');island.mount($('#lovablePosRoot'),{context,snapshot,branchId,rpc,status,customerHandoff,onMenu:()=>document.body.classList.toggle('lovable-nav-open'),onBell:()=>{location.href=`/restaurant/?page=prep${context.role==='owner'?'':'&as=staff'}`;}});status('');
}
