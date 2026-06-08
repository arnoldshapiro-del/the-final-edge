(function initClickToRead(){
  if (window.__ctrInstalled) return; window.__ctrInstalled = true;
  try{ localStorage.removeItem('ctrVoiceURI'); }catch(e){}
  var READABLE='h1,h2,h3,h4,h5,h6,p,li,blockquote,td,th,dd,dt,figcaption,summary,[data-read]';
  var EXCLUDE='button,a,input,textarea,select,label,svg,canvas,[role="button"],.ctr-ui,.no-read,[data-no-read]';
  var SKIP='.ctr-ui,nav,aside,header,footer,.sidebar,[data-no-read]';
  var LS_VOICE='ctrVoiceName', LS_RATE='ctrRate';
  var enabled=false, queue=[], idx=0, current=null, voices=[], voice=null, built=false, triedFallback=false;
  var rate=parseFloat(localStorage.getItem(LS_RATE))||1.0;
  var css=document.createElement('style');
  css.textContent=
    ".ctr-reading{outline:2px solid #5ad1c8;outline-offset:3px;background:rgba(90,209,200,.12);border-radius:6px}"+
    ".ctr-ui{position:fixed;right:16px;bottom:16px;z-index:99999;display:flex;gap:8px;align-items:center;flex-wrap:wrap;max-width:380px;font-family:'Oxanium',system-ui,sans-serif;background:#0b1220;border:1px solid #1e2b45;border-radius:12px;padding:8px 10px;box-shadow:0 6px 24px rgba(0,0,0,.45)}"+
    ".ctr-ui button,.ctr-ui select{font-family:'Space Mono',monospace;font-size:12px;cursor:pointer;border-radius:8px;border:1px solid #2a3b5e;background:#111c30;color:#cfe3ff;padding:6px 8px}"+
    ".ctr-ui select{max-width:170px}"+
    ".ctr-ui button.ctr-on{background:#5ad1c8;color:#04121a;border-color:#5ad1c8;font-weight:700}"+
    ".ctr-ui .ctr-hint{flex-basis:100%;font-family:'Space Mono',monospace;font-size:10px;color:#7e93b8;line-height:1.25}"+
    "body.ctr-active "+READABLE+"{cursor:pointer}";
  document.head.appendChild(css);
  var ui=document.createElement('div'); ui.className='ctr-ui';
  var toggle=document.createElement('button'), picker=document.createElement('select'),
      speed=document.createElement('button'), stop=document.createElement('button'), hint=document.createElement('span');
  hint.className='ctr-hint'; stop.textContent='Stop'; speed.textContent=rate.toFixed(1)+'x'; picker.title='Voice';
  function sortKey(v){ var n=(v.name+' '+v.lang).toLowerCase();
    if(/eva/.test(n)) return 0; if(/en[-_]us/.test(n)) return 1; if(/^en/i.test(v.lang)) return 2; return 3; }
  function chooseDefault(){
    var eva=voices.filter(function(v){return /eva/i.test(v.name);})[0]; if(eva) return eva;
    var fem=voices.filter(function(v){return /samantha|zira|aria|jenny|ava|emma|libby|sonia|female|woman|google us english/i.test(v.name);})[0]; if(fem) return fem;
    var en=voices.filter(function(v){return /^en/i.test(v.lang);})[0]; return en||voices[0]||null; }
  function applySaved(){ var s=localStorage.getItem(LS_VOICE);
    var v=s?voices.filter(function(x){return x.name===s;})[0]:null; return v||chooseDefault(); }
  function buildVoices(){
    var all=speechSynthesis.getVoices(); if(!all.length) return;
    voices=all.slice().sort(function(a,b){var d=sortKey(a)-sortKey(b);return d!==0?d:a.name.localeCompare(b.name);});
    picker.innerHTML='';
    voices.forEach(function(v){var o=document.createElement('option');o.value=v.name;
      o.textContent=v.name.replace(/^Microsoft |^Google /,'')+' — '+v.lang;picker.appendChild(o);});
    if(!voice) voice=applySaved();
    if(voice) picker.value=voice.name;
    built=true; }
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
    if(el){el.classList.add('ctr-reading'); el.scrollIntoView({block:'center',behavior:'smooth'});} }
  function fallbackVoice(){ return voices.filter(function(v){return /^en/i.test(v.lang)&&!/online|natural/i.test(v.name);})[0]
      || voices.filter(function(v){return /^en/i.test(v.lang);})[0] || voices[0] || null; }
  function speakNext(){ if(idx>=queue.length){highlight(null);paint();return;}
    if(!voice) buildVoices();
    var el=queue[idx++]; var text=(el.innerText||el.textContent||'').trim();
    if(!text){speakNext();return;} highlight(el);
    try{ var u=new SpeechSynthesisUtterance(text);
      if(voice){u.voice=voice;u.lang=voice.lang;} else {u.lang='en-US';}
      u.rate=rate; u.onend=speakNext;
      u.onerror=function(){ if(!triedFallback){ triedFallback=true; var fb=fallbackVoice();
        if(fb&&fb!==voice){ voice=fb; if(built)picker.value=fb.name; idx=Math.max(0,idx-1); speakNext(); return; } } speakNext(); };
      speechSynthesis.speak(u);
    }catch(e){ speakNext(); } paint(); }
  document.addEventListener('click',function(e){
    if(!enabled) return; if(e.target.closest(EXCLUDE)) return;
    var start=e.target.closest(READABLE); if(!start||start.closest(SKIP)) return; e.preventDefault();
    var all=Array.prototype.slice.call(document.querySelectorAll(READABLE)).filter(function(el){
      return !el.closest(SKIP) && (el.innerText||'').trim(); });
    var at=all.indexOf(start); cancel(); triedFallback=false; queue=at>=0?all.slice(at):[start]; idx=0; speakNext();
  },true);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){cancel();paint();} });
  paint();
})();
