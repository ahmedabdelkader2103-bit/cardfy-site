import {$,context,rpc} from './shared.js?v=20260920-owner-ui';
const statusClear=()=>{$('#osStatus').textContent='';};
export async function mountDelivery(){
 if(context.shift_state==='offline')await rpc('cfy_menu_staff_shift',{p_token:context.token,p_state:'available'});
 const css=document.createElement('link');css.rel='stylesheet';css.href='/restaurant/delivery-ui/main.css?v=20260914-1';document.head.append(css);
 const font=document.createElement('link');font.rel='stylesheet';font.href='https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap';document.head.append(font);
 document.body.classList.add('delivery-approved','os-collapsed');
 const logout=document.createElement('button');logout.className='os-button';logout.textContent='تسجيل الخروج';logout.onclick=()=>$('#osLogout').click();$('#osNav').append(logout);
 statusClear();
 const {mountDelivery:mount}=await import('./delivery-ui/entry.js?v=20260914-1');
 mount($('#osContent'),{context,rpc});
}