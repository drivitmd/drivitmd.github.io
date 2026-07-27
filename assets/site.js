function setLang(l){document.documentElement.lang=l;var ru=document.getElementById('lng-ru'),ro=document.getElementById('lng-ro');if(ru)ru.setAttribute('aria-pressed',l==='ru');if(ro)ro.setAttribute('aria-pressed',l==='ro');try{localStorage.setItem('drivit_lang',l)}catch(e){}try{if(typeof tick==='function')tick()}catch(e){}}
(function(){try{var s=localStorage.getItem('drivit_lang');if(s)setLang(s)}catch(e){}})();
/* Тема полностью автоматическая: следует настройке устройства через @media (prefers-color-scheme). Ручного переключателя нет. */
function setPal(p){document.documentElement.setAttribute('data-palette',p);document.querySelectorAll('.palswitch button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.pal===p)});try{localStorage.setItem('drivit_pal',p)}catch(e){}}
(function(){var p='sage';try{var s=localStorage.getItem('drivit_pal');if(s)p=s}catch(e){}setPal(p)})();
function toggleMenu(){var m=document.getElementById('mmenu');var o=m.classList.toggle('open');document.body.style.overflow=o?'hidden':'';var b=document.querySelector('.burger');if(b)b.setAttribute('aria-expanded',o)}
function closeMenu(){var m=document.getElementById('mmenu');if(m)m.classList.remove('open');document.body.style.overflow='';var b=document.querySelector('.burger');if(b)b.setAttribute('aria-expanded','false')}
var EARLY=new Date('2026-07-27T23:59:59+03:00'),MID=new Date('2026-08-06T23:59:59+03:00');
(function(){var st=(new Date()<=EARLY)?'early':(new Date()<=MID)?'mid':'late';document.querySelectorAll('.tier').forEach(function(t){t.classList.toggle('active',t.dataset.tier===st)});var sp=document.getElementById('stickyPrice');if(sp)sp.textContent=st==='early'?'250 €':st==='mid'?'300 €':'—'})();
function tick(){var el=document.getElementById('cd');if(!el)return;var now=new Date(),t=now<=EARLY?EARLY:(now<=MID?MID:null);if(!t){el.textContent='';return}var d=Math.max(0,t-now),D=Math.floor(d/864e5),H=Math.floor(d%864e5/36e5),M=Math.floor(d%36e5/6e4);var ro=document.documentElement.lang==='ro';el.textContent=ro?(D+' zile '+H+' h '+M+' min'):(D+' дн '+H+' ч '+M+' мин')}tick();setInterval(tick,30000);
(function(){var els=document.querySelectorAll('.reveal');if(!('IntersectionObserver'in window)){els.forEach(function(e){e.classList.add('in')});return}var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.1});els.forEach(function(e){io.observe(e)})})();
(function(){var c=document.getElementById('sticky'),h=document.querySelector('.hero');if(!c||!h)return;new IntersectionObserver(function(en){c.classList.toggle('show',!en[0].isIntersecting)}).observe(h)})();
document.addEventListener('click',function(e){var t=e.target.closest?e.target.closest('a.btn-primary, #sticky a.btn'):null;if(t&&window.gtag){window.gtag('event','click_zayavka',{cta_location:t.closest('#sticky')?'sticky':t.closest('.hero')?'hero':t.closest('.hdr')?'header':t.closest('.final')?'final':t.closest('#uchastie')?'price':'page'})}},true);

/* promo pop-up: urgency, index only, once per session */
(function(){
  var p=document.getElementById('promo'); if(!p) return;
  var KEY='drivitPromoSeen';
  function esc(e){ if(e.key==='Escape') window.closePromo(); }
  function cleanup(){ clearTimeout(t); window.removeEventListener('scroll',onScroll); document.removeEventListener('mouseout',onLeave); }
  function open(){ if(!p.hidden) return; try{if(sessionStorage.getItem(KEY))return; sessionStorage.setItem(KEY,'1')}catch(e){} p.hidden=false; p.setAttribute('aria-hidden','false'); document.addEventListener('keydown',esc); cleanup(); }
  window.closePromo=function(){ p.hidden=true; p.setAttribute('aria-hidden','true'); document.removeEventListener('keydown',esc); };
  function onScroll(){ if((window.scrollY+window.innerHeight)/document.documentElement.scrollHeight>0.4) open(); }
  function onLeave(e){ if(e.clientY<=0) open(); }
  try{ if(sessionStorage.getItem(KEY)) return; }catch(e){}
  var t=setTimeout(open,30000);
  window.addEventListener('scroll',onScroll,{passive:true});
  document.addEventListener('mouseout',onLeave);
})();
/* quick lead form (homepage): name+phone -> Google Form, inline success */
(function(){
  var f=document.getElementById('quickForm'); if(!f) return;
  var GF='https://docs.google.com/forms/d/e/1FAIpQLSek7jqCBRCsMAqpbUJ21CKll-flR4AmJPreAKw9EFRfr8LQxw/formResponse';
  var M={name:'entry.1061849023',phone:'entry.1940441060',expect:'entry.1380939569'};
  f.addEventListener('submit',function(ev){
    ev.preventDefault(); if(!f.reportValidity())return;
    var fd=new FormData(f),d={}; fd.forEach(function(v,k){d[k]=v});
    try{var gf=document.createElement('form');gf.action=GF;gf.method='POST';gf.target='gfsink2';gf.style.display='none';
      function a(n,v){var i=document.createElement('input');i.name=n;i.value=v||'';gf.appendChild(i)}
      a(M.name,d.name);a(M.phone,d.phone);a(M.expect,'(быстрая заявка с главной / cerere rapidă)');
      document.body.appendChild(gf);gf.submit();
    }catch(e){}
    f.hidden=true; var ok=document.getElementById('quickOk'); if(ok)ok.hidden=false;
    if(window.gtag)gtag('event','application_submitted',{form:'quick'});
    if(window.fbq)fbq('track','Lead');
  });
})();