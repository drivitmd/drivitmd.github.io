function setLang(l){document.documentElement.lang=l;var ru=document.getElementById('lng-ru'),ro=document.getElementById('lng-ro');if(ru)ru.setAttribute('aria-pressed',l==='ru');if(ro)ro.setAttribute('aria-pressed',l==='ro');try{localStorage.setItem('drivit_lang',l)}catch(e){}try{if(typeof tick==='function')tick()}catch(e){}}
(function(){try{var s=localStorage.getItem('drivit_lang');if(s)setLang(s)}catch(e){}})();
/* Тема полностью автоматическая: следует настройке устройства через @media (prefers-color-scheme). Ручного переключателя нет. */
function setPal(p){document.documentElement.setAttribute('data-palette',p);document.querySelectorAll('.palswitch button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.pal===p)});try{localStorage.setItem('drivit_pal',p)}catch(e){}}
(function(){var p='sage';try{var s=localStorage.getItem('drivit_pal');if(s)p=s}catch(e){}setPal(p)})();
function toggleMenu(){var m=document.getElementById('mmenu');var o=m.classList.toggle('open');document.body.style.overflow=o?'hidden':'';var b=document.querySelector('.burger');if(b)b.setAttribute('aria-expanded',o)}
function closeMenu(){var m=document.getElementById('mmenu');if(m)m.classList.remove('open');document.body.style.overflow='';var b=document.querySelector('.burger');if(b)b.setAttribute('aria-expanded','false')}
var EARLY=new Date('2026-07-27T23:59:59+03:00'),MID=new Date('2026-08-06T23:59:59+03:00');
(function(){var ORD={early:0,mid:1,late:2};var st=(new Date()<=EARLY)?'early':(new Date()<=MID)?'mid':'late';document.querySelectorAll('.tier').forEach(function(t){var d=t.dataset.tier;t.classList.toggle('active',d===st);t.classList.toggle('done',ORD[d]<ORD[st])});var price=st==='early'?250:st==='mid'?300:350;var sp=document.getElementById('stickyPrice');if(sp)sp.textContent=price+' €';var pn=Math.round(price/3);document.querySelectorAll('.pd-num').forEach(function(x){x.textContent=pn})})();
function tick(){var el=document.getElementById('count');if(!el)return;var now=new Date(),ro=document.documentElement.lang==='ro',price,t,lead;if(now<=EARLY){price='250 €';t=EARLY;lead=ro?'Preț redus':'Ранняя цена';}else if(now<=MID){price='300 €';t=MID;lead=ro?'Preț acum':'Цена сейчас';}else{el.hidden=true;return;}el.hidden=false;var d=Math.max(0,t-now),D=Math.floor(d/864e5),H=Math.floor(d%864e5/36e5),M=Math.floor(d%36e5/6e4);var cd=ro?(D+' zile '+H+' h '+M+' min'):(D+' дн '+H+' ч '+M+' мин');el.textContent=lead+' '+price+(ro?' · până la creștere ':' · до повышения ')+cd;}tick();setInterval(tick,30000);
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