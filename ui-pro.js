(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn();
  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function toast(message, type='info', ms=2600){
    let stack = $('.coyo-toast-stack');
    if(!stack){ stack=document.createElement('div'); stack.className='coyo-toast-stack'; document.body.appendChild(stack); }
    const el=document.createElement('div'); el.className='coyo-toast toast-'+type;
    const icon = type==='success'?'✅':type==='error'?'⚠️':type==='warn'?'⚡':'🐺';
    el.innerHTML=`<strong>${icon}</strong><span>${esc(message)}</span>`;
    stack.appendChild(el); setTimeout(()=>{el.style.opacity='0';el.style.transform='translateY(8px)';setTimeout(()=>el.remove(),220)},ms);
  }
  function enhanceForms(){
    $$('input, textarea, select').forEach(el=>{
      if(el.dataset.proReady) return; el.dataset.proReady='1';
      const group=el.closest('.input-group')||el.parentElement; if(group) group.classList.add('pro-field');
      el.addEventListener('focus',()=>group&&group.classList.add('is-focused'));
      el.addEventListener('blur',()=>group&&group.classList.remove('is-focused'));
      el.addEventListener('input',()=>{ if(el.tagName==='TEXTAREA'){ el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,260)+'px'; }});
    });
    $$('input[type="password"]').forEach(input=>{
      const wrap=input.parentElement;
      if(input.dataset.toggleReady === '1' || (wrap && (wrap.querySelector('.password-toggle') || wrap.querySelector('.password-eye-btn')))) return;
      input.dataset.toggleReady='1';
      if(!wrap) return; wrap.style.position=wrap.style.position||'relative';
      const btn=document.createElement('button'); btn.type='button'; btn.className='password-eye-btn'; btn.textContent='👁️';
      btn.addEventListener('click',()=>{ const show=input.type==='password'; input.type=show?'text':'password'; btn.textContent=show?'🙈':'👁️'; });
      wrap.appendChild(btn); input.style.paddingRight='3.25rem';
    });
  }
  function enhanceButtons(){
    $$('button, .btn-primary, .btn-secondary, .btn-outline, .btn-success, .btn-danger, .btn-warning').forEach(btn=>{
      if(btn.dataset.rippleReady) return; btn.dataset.rippleReady='1';
      btn.addEventListener('click',e=>{
        if(btn.disabled) return; const r=btn.getBoundingClientRect(); const s=Math.max(r.width,r.height);
        const wave=document.createElement('span'); wave.className='coyo-ripple';
        wave.style.width=wave.style.height=s+'px'; wave.style.left=(e.clientX-r.left-s/2)+'px'; wave.style.top=(e.clientY-r.top-s/2)+'px';
        btn.appendChild(wave); setTimeout(()=>wave.remove(),560);
      });
    });
  }
  function fixAvatars(){
    $$('img[src*="Avatares/"], img.avatar-img, img.ranking-avatar, img.podium-avatar, img.player-avatar, .avatar-option img, .avatar-card img').forEach(img=>{
      if(img.dataset.avatarSafe) return; img.dataset.avatarSafe='1'; img.decoding='async'; img.loading=img.loading||'lazy';
      img.addEventListener('error',()=>{ if(!img.dataset.fallbackTried){ img.dataset.fallbackTried='1'; img.src='Avatares/Avatar1.svg?v='+Date.now(); }});
    });
  }
  function adminHomePolish(){
    if(document.body.dataset.adminRoute !== 'home') return;
    const user = (()=>{try{return JSON.parse(sessionStorage.getItem('coyohoot_admin_session')||'null')}catch{return null}})();
    const label = $('#currentUserLabel'); if(label && user && user.username) label.textContent = `Bienvenido, ${user.username}`;
  }
  function statusWatch(){
    window.addEventListener('offline',()=>toast('Se perdió conexión. Revisa internet antes de guardar.', 'warn', 4200));
    window.addEventListener('online',()=>toast('Conexión recuperada.', 'success', 2200));
  }
  ready(()=>{
    document.body.classList.add('coyo-pro-stable');
    enhanceForms(); enhanceButtons(); fixAvatars(); adminHomePolish(); statusWatch();
    const mo=new MutationObserver(()=>{enhanceForms(); enhanceButtons(); fixAvatars(); adminHomePolish();});
    mo.observe(document.body,{childList:true,subtree:true});
  });
})();
