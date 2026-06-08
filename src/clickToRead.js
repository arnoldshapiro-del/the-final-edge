(function initClickToRead(){
  if (window.__ctrInstalled) return; window.__ctrInstalled = true;
  if (!('speechSynthesis' in window)) { console.warn('ClickToRead: speechSynthesis not supported'); return; }
  var READABLE='h1,h2,h3,h4,h5,h6,p,li,blockquote,td,th,dd,dt,figcaption,summary,[data-read]';
  var EXCLUDE='button,a,input,textarea,select,label,svg,canvas,[role="button"],.ctr-ui,.no-read,[data-no-read]';
  var SKIP='.ctr-ui,nav,aside,header,footer,.sidebar,[data-no-read]';
  var LS_VOICE='ctrVoiceURI', LS_RATE='ctrRate', AUTO='__auto__';
  var enabled=false, queue=[], idx=0, current=null, voices=[], voice=null;
  var rate=parseFloat(localStorage.getItem(LS_RATE))||1.0;
  var savedVoiceURI=localStorage.getItem(LS_VOICE)||AUTO;
  var css=document.createElement('style');
  css.textContent=
    ".ctr-reading{outline:2px solid #5ad1c8;outline-offset:3px;background:rgba(90,209,200,.12);border-radius:6px}"+
    ".ctr-ui{position:fixed;right:16px;bottom:16px;z-index:99999;display:flex;gap:8px;align-items:center;flex-wrap:wrap;max-width:380px;font-family:'Oxanium',system-ui,sans-serif;background:#0b1220;border:1px solid #1e2b45;border-radius:12px;padding:8px 10px;box-shadow:0 6px 24px rgba(0,0,0,.45)}"+
    ".ctr-ui button,.ctr-ui select{font-family:'Space Mono',monospace;font-size:12px;cursor:pointer;border-radius:8px;border:1px solid #2a3b5e;background:#111c30;color:#cfe3ff;padding:6px 8px}"+
    ".ctr-ui select{max-width:160px}"+
    ".ctr-ui button.ctr-on{background:#5ad1c8;color:#04121a;border-color:#5ad1c8;font-weight:700}"+
    ".ctr-ui .ctr-hint{flex-basis:100%;font-family:'Space Mono',monospace;font-size:10px;color:#7e93b8;line-height:1.3}"+
    ".ctr-ui .ctr-err{color:#ff9a9a}"+
    "body.ctr-active "+READABLE+"{cursor:pointer}";
  document.head.appendChild(css);
  var ui=document.createElement('div'); ui.className='ctr-ui';
  var toggle=document.createElement('button'), picker=document.createElement('select'),
      speed=document.createElement('button'), test=document.createElement('button'),
      stop=document.createElement('button'), hint=document.createElement('span');
  hint.className='ctr-hint'; test.textContent='Test'; test.title='Play a test phrase';
  stop.textContent='Stop'; speed.textContent=rate.toFixed(1)+'x'; picker.title='Voice';
  function rank(v){ var n=(v.name+' '+v.lang).toLowerCase(); var s=0;
    if(/en[-_]us/.test(n))s+=5; else if(/^en/.test(n)||/ en/.test(n))s+=3;
    if(/google/.test(n))s+=4;
    if(/samantha|aria|jenny|emma|ava|libby|sonia|guy/.test(n))s+=3;
    if(/zira|david|mark|hazel/.test(n))s+=2;
    if(/natural|neural|online/.test(n))s+=1;
    if(/compact|espeak|festival/.test(n))s-=4;
    return s; }
  function buildVoices(){
    var all=speechSynthesis.getVoices();
    voices=all.filter(function(v){return /^en/i.test(v.lang)||/english/i.test(v.name);});
    if(!voices.length) voices=all.slice();
    voices=voices.slice().sort(function(a,b){return rank(b)-rank(a);});
    picker.innerHTML='';
    var autoOpt=document.createElement('option');
    autoOpt.value=AUTO; autoOpt.textContent='Auto (system default — most reliable)';
    picker.appendChild(autoOpt);
    voices.forEach(function(v){ var o=document.createElement('option'); o.value=v.voiceURI;
      o.textContent=v.name.replace(/Microsoft |Google /,'')+' ('+v.lang+')'; picker.appendChild(o); });
    if (savedVoiceURI===AUTO) { voice=null; picker.value=AUTO; }
    else {
      var chosen=voices.filter(function(v){return v.voiceURI===savedVoiceURI;})[0];
      if (chosen) { voice=chosen; picker.value=chosen.voiceURI; }
      else { voice=null; picker.value=AUTO; }
    }
  }
  function setHint(msg, isErr){ hint.textContent=msg||''; hint.className='ctr-hint'+(isErr?' ctr-err':''); }
  function defaultHint(){ setHint(enabled?'Click any text to read from there. Esc stops.':'', false); }
  function safeSpeak(text, onDone){
    speechSynthesis.cancel();
    setTimeout(function(){
      var u=new SpeechSynthesisUtterance(text);
      if (voice) u.voice=voice;
      u.rate=rate; u.lang=(voice&&voice.lang)||'en-US';
      u.onend=function(){ if(onDone) onDone(null); };
      u.onerror=function(e){
        var err=(e&&e.error)||'error';
        if (voice && err!=='interrupted' && err!=='canceled') {
          setHint('Voice "'+voice.name+'" failed — switched to Auto', true);
          voice=null; savedVoiceURI=AUTO; localStorage.setItem(LS_VOICE,AUTO); picker.value=AUTO;
          var u2=new SpeechSynthesisUtterance(text); u2.rate=rate;
          u2.onend=function(){ if(onDone) onDone(null); };
          u2.onerror=function(e2){ if(onDone) onDone((e2&&e2.error)||'error'); };
          speechSynthesis.speak(u2);
        } else if (onDone) onDone(err);
      };
      speechSynthesis.speak(u);
    }, 80);
  }
  picker.onchange=function(){
    savedVoiceURI=picker.value;
    voice = (picker.value===AUTO) ? null : (voices.filter(function(v){return v.voiceURI===picker.value;})[0]||null);
    localStorage.setItem(LS_VOICE, savedVoiceURI);
    safeSpeak('Voice set.', function(){ defaultHint(); });
  };
  test.onclick=function(){
    setHint('Playing test…', false);
    safeSpeak('Hello, this is a test of the click to read voice.', function(err){
      if (err) setHint('Test failed: '+err+'. Try a different voice.', true);
      else defaultHint();
    });
  };
  function paint(){ toggle.textContent=enabled?'🔊 Read: ON':'🔇 Read: OFF';
    toggle.className=enabled?'ctr-on':''; document.body.classList.toggle('ctr-active',enabled);
    defaultHint(); stop.style.display=speechSynthesis.speaking?'':'none'; }
  toggle.onclick=function(){ enabled=!enabled; if(!enabled) cancel(); paint(); };
  speed.onclick=function(){ rate=rate>=1.4?0.8:Math.round((rate+0.2)*10)/10; localStorage.setItem(LS_RATE,rate); speed.textContent=rate.toFixed(1)+'x'; };
  stop.onclick=function(){ cancel(); paint(); };
  ui.appendChild(toggle); ui.appendChild(picker); ui.appendChild(speed); ui.appendChild(test); ui.appendChild(stop); ui.appendChild(hint);
  function mount(){ if(document.body&&!document.body.contains(ui)) document.body.appendChild(ui); }
  if(document.body) mount(); else document.addEventListener('DOMContentLoaded',mount);
  buildVoices(); speechSynthesis.onvoiceschanged=buildVoices;
  setInterval(function(){ if(speechSynthesis.speaking && !speechSynthesis.paused){ speechSynthesis.pause(); speechSynthesis.resume(); } }, 10000);
  function cancel(){ speechSynthesis.cancel(); if(current){current.classList.remove('ctr-reading');current=null;} queue=[];idx=0; }
  function highlight(el){ if(current)current.classList.remove('ctr-reading'); current=el;
    if(el){el.classList.add('ctr-reading'); el.scrollIntoView({block:'center',behavior:'smooth'});} }
  function speakNext(){ if(idx>=queue.length){highlight(null);paint();return;}
    var el=queue[idx++]; var text=(el.innerText||el.textContent||'').trim();
    if(!text){speakNext();return;} highlight(el);
    var u=new SpeechSynthesisUtterance(text); if(voice)u.voice=voice; u.rate=rate; u.lang=(voice&&voice.lang)||'en-US';
    u.onend=function(){ speakNext(); };
    u.onerror=function(e){
      var err=(e&&e.error)||'error';
      if (voice && err!=='interrupted' && err!=='canceled') {
        setHint('Voice "'+voice.name+'" failed — switched to Auto, retrying.', true);
        voice=null; savedVoiceURI=AUTO; localStorage.setItem(LS_VOICE,AUTO); picker.value=AUTO;
        var retry=new SpeechSynthesisUtterance(text); retry.rate=rate;
        retry.onend=function(){ speakNext(); };
        retry.onerror=function(){ speakNext(); };
        speechSynthesis.speak(retry);
      } else speakNext();
    };
    speechSynthesis.speak(u); paint(); }
  document.addEventListener('click',function(e){
    if(!enabled) return; if(e.target.closest(EXCLUDE)) return;
    var start=e.target.closest(READABLE); if(!start||start.closest(SKIP)) return;
    e.preventDefault();
    var all=Array.prototype.slice.call(document.querySelectorAll(READABLE)).filter(function(el){
      return !el.closest(SKIP) && (el.innerText||'').trim(); });
    var at=all.indexOf(start); cancel();
    setTimeout(function(){ queue=at>=0?all.slice(at):[start]; idx=0; speakNext(); }, 80);
  },true);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){cancel();paint();} });
  paint();
})();
