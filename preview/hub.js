function mopen(){var m=document.getElementById('mm');if(m){m.classList.add('open');document.body.style.overflow='hidden'}}
function mclose(){var m=document.getElementById('mm');if(m){m.classList.remove('open');document.body.style.overflow=''}}
(function(){var p=(location.pathname.split('/').pop()||'index.html');document.querySelectorAll('.nav a').forEach(function(a){if(a.getAttribute('href')===p)a.classList.add('on')});})();
