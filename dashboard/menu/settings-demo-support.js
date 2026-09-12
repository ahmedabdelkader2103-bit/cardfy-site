(function(){
let installed=false;
function inject(){
  if(typeof ops==='undefined'||!ops)return;
  const cards=[...document.querySelectorAll('#staffList .order-card')];
  (ops.staff||[]).forEach((s,i)=>{
    if(s.phone&&cards[i]&&!cards[i].querySelector('.demo-phone')){
      const d=document.createElement('div');d.className='order-meta demo-phone';d.textContent='الهاتف: '+s.phone;
      cards[i].querySelector('.order-head > div')?.appendChild(d);
    }
  });
}
function install(){
  if(installed)return;
  if(typeof ops==='undefined'){setTimeout(install,80);return}
  installed=true;setInterval(inject,700);
}
install();
})();
