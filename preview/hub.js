function mopen(){var m=document.getElementById('mm');if(m){m.classList.add('open');document.body.style.overflow='hidden'}}
function mclose(){var m=document.getElementById('mm');if(m){m.classList.remove('open');document.body.style.overflow=''}}
(function(){var p=(location.pathname.split('/').pop()||'index.html');document.querySelectorAll('.nav a').forEach(function(a){if(a.getAttribute('href')===p)a.classList.add('on')});})();
(function(){
  if(!('IntersectionObserver' in window))return;
  var sel='.shead,.dir,.host,.ccard,.day,.gal,.sched,.pricebox,.form,.jcard,.split,.partners,.adslot,.sub,.contact-grid,.flist,.prose,.media,.plogo';
  [].slice.call(document.querySelectorAll(sel)).forEach(function(e){if(!e.closest('.hero'))e.classList.add('reveal')});
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.reveal').forEach(function(e){io.observe(e)});
})();
