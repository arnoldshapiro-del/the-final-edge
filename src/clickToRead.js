(function initClickToRead(){
  if (window.__ctrInstalled) return; window.__ctrInstalled = true;
  try{ localStorage.removeItem('ctrVoiceURI'); }catch(e){}
  var EXCLUDE='button,a,input,textarea,select,label,svg,canvas,[role="button"],.ctr-ui,.no-read,[data-no-read]';
  var SKIP='.ctr-ui,nav,aside,header,footer,.sidebar,[data-no-read]';
  var BLOCK='h1,h2,h3,h4,h5,h6,p,li,blockquote,td,th,dd,dt,figcaption,summary,pre,div,section,article,[data-read]';
  var LS_VOICE='ctrVoiceName', LS_RATE='ctrRate';
  var enabled=false, queue=[], idx=0, current=null, voices=[], voice=null;
  var rate=parseFloat(localStorage.getItem(LS_RATE))||1.0;
  var css=document.createElement('style');
  css.textContent=
    ".ctr-reading{outline:2px solid #5ad1c8;outline-offset:3px;background:rgba(90,209,200,.14);border-radius:6px}"+
    ".ctr-ui{position:fixed;right:16px;bottom:16px;z-index:99999;display:flex;gap:8px;align-items:center;flex-wrap:wrap;max-width:360px;font-family:'Oxanium',system-ui,sans-serif;background:#0b1220;border:1px solid #1e2b45;border-radius:12px;padding:8px 10px;box-shadow:0 6px 24px rgba(0,0,0,.45)}"+
    ".ctr-ui button,.ctr-ui select{font-family:'Space Mono',monospace;font-size:12px;cursor:pointer;border-radius:8px;border:1px solid #2a3b5e;background:#111c30;color:#cfe3ff;padding:6px 8px}"+
    ".ctr-ui select{max-width:150px}"+
    ".ctr-ui button.ctr-on{background:#5ad1c8;color:#04121a;border-color:#5ad1c8;font-weight:700}"+
    ".ctr-ui .ctr-hint{flex-basis:100%;font-family:'Space Mono',monospace;font-size:10px;color:#7e93b8;line-height:1.25}"+
    "body.ctr-active{cursor:pointer}";
  document.head.appendChild(css);
  var ui=document.createElement('div'); ui.className='ctr-ui';
  var toggle=document.createElement('button'), picker=document.createElement('select'),
      speed=document.createElement('button'), stop=document.createElement('button'), hint=document.createElement('span');
  hint.className='ctr-hint'; stop.textContent='Stop'; speed.textContent=rate.toFixed(1)+'x'; picker.title='Voice';
  function usable(v){ return v.localService===true || /google/i.test(v.name); }
  function rankVoice(v){ var n=(v.name+' '+v.lang).toLowerCase(); var s=0;
    if(/google us english/.test(n)) s+=10; if(/zira/.test(n)) s+=8; if(/google/.test(n)) s+=6;
    if(/en[-_]us/.test(n)) s+=3; else if(/^en/.test(v.lang)) s+=2; if(/mark/.test(n)) s+=1; return s; }
  function applySaved(){ var sName=localStorage.getItem(LS_VOICE);
    var v=sName?voices.filter(function(x){return x.name===sName;})[0]:null; return v||voices[0]||null; }
  function buildVoices(){ var all=speechSynthesis.getVoices(); if(!all.length) return;
    voices=all.filter(usable); if(!voices.length) voices=all.slice();
    voices.sort(function(a,b){ return (rankVoice(b)-rankVoice(a))||a.name.localeCompare(b.name); });
    picker.innerHTML='';
    voices.forEach(function(v){var o=document.createElement('option');o.value=v.name;
      o.textContent=v.name.replace(/^Microsoft |^Google /,'')+' — '+v.lang;picker.appendChild(o);});
    if(!voice) voice=applySaved(); if(voice) picker.value=voice.name; }
  picker.onchange=function(){ var v=voices.filter(function(x){return x.name===picker.value;})[0];
    if(v){voice=v;try{localStorage.setItem(LS_VOICE,v.name);}catch(e){}} cancel(); paint(); };
  function paint(){ toggle.textContent=enabled?'🔊 Read: ON':'🔇 Read: OFF';
    toggle.className=enabled?'ctr-on':''; document.body.classList.toggle('ctr-active',enabled);
    hint.textContent=enabled?'Click any text to read from there. Esc stops.':''; stop.style.display=speechSynthesis.speaking?'':'none'; }
  toggle.onclick=function(){ enabled=!enabled; if(!enabled) cancel(); paint(); };
  speed.onclick=function(){ rate=rate>=1.4?0.8:Math.round((rate+0.2)*10)/10; try{localStorage.setItem(LS_RATE,rate);}catch(e){} speed.textContent=rate.toFixed(1)+'x'; };
  stop.onclick=function(){ cancel(); paint(); };
  ui.appendChild(toggle); ui.appendChild(picker); ui.appendChild(speed); ui.appendChild(stop); ui.appendChild(hint);
  function mount(){ if(document.body&&!document.body.contains(ui)) document.body.appendChild(ui); }
  if(document.body) mount(); else document.addEventListener('DOMContentLoaded',mount);
  buildVoices(); speechSynthesis.onvoiceschanged=buildVoices; setTimeout(buildVoices,300); setTimeout(buildVoices,1200);
  function cancel(){ try{speechSynthesis.cancel();}catch(e){} if(current){current.classList.remove('ctr-reading');current=null;} queue=[];idx=0; }
  function highlight(el){ if(current)current.classList.remove('ctr-reading'); current=el;
    if(el){el.classList.add('ctr-reading'); try{el.scrollIntoView({block:'center',behavior:'smooth'});}catch(e){}} }
  function vis(el){ return !!(el.offsetParent || el.getClientRects().length); }
  function blockTextOf(el){ if(!el||el.nodeType!==1) return ''; if(el.closest(SKIP)||el.closest(EXCLUDE)) return ''; if(!vis(el)) return ''; return (el.innerText||'').replace(/\s+/g,' ').trim(); }
  function collectBlocks(){ var c=Array.prototype.slice.call(document.querySelectorAll(BLOCK)).filter(function(el){ return blockTextOf(el).length>1; });
    return c.filter(function(el){ return !c.some(function(o){ return o!==el && el.contains(o); }); }); }
  function speakNext(){ if(idx>=queue.length){highlight(null);paint();return;} if(!voice) buildVoices();
    var el=queue[idx++]; var text=blockTextOf(el)||(el.innerText||el.textContent||'').trim();
    if(!text){speakNext();return;} highlight(el);
    try{ var u=new SpeechSynthesisUtterance(text); if(voice){u.voice=voice;u.lang=voice.lang;} else {u.lang='en-US';}
      u.rate=rate; u.onend=speakNext; u.onerror=function(){ speakNext(); }; speechSynthesis.speak(u);
    }catch(e){ speakNext(); } paint(); }
  document.addEventListener('click',function(e){ if(!enabled) return; if(e.target.closest(EXCLUDE)) return;
    var blocks=collectBlocks(); var start=null,i;
    for(i=0;i<blocks.length;i++){ if(blocks[i]===e.target||blocks[i].contains(e.target)){ start=blocks[i]; break; } }
    if(!start){ var p=e.target; while(p&&p!==document.body){ if(blockTextOf(p)){start=p;break;} p=p.parentElement; } if(start&&blocks.indexOf(start)<0) blocks=[start].concat(blocks); }
    if(!start) return; e.preventDefault();
    var at=blocks.indexOf(start); if(at<0) at=0; cancel(); queue=blocks.slice(at); idx=0; speakNext();
  },true);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){cancel();paint();} });
  paint();
})();
