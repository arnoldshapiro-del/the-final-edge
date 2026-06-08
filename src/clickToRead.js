(function initClickToRead(){
  if (window.__ctrInstalled) return; window.__ctrInstalled = true;
  var TTS='/.netlify/functions/tts';
  var EXCLUDE='button,a,input,textarea,select,label,svg,canvas,[role="button"],.ctr-ui,.no-read,[data-no-read]';
  var SKIP='.ctr-ui,nav,aside,header,footer,.sidebar,[data-no-read]';
  var BLOCK='h1,h2,h3,h4,h5,h6,p,li,blockquote,td,th,dd,dt,figcaption,summary,pre,div,section,article,[data-read]';
  var VOICES=[['Ava (female)','en-US-AvaNeural'],['Emma (female)','en-US-EmmaNeural'],['Jenny (female)','en-US-JennyNeural'],['Aria (female)','en-US-AriaNeural'],['Michelle (female)','en-US-MichelleNeural'],['Andrew (male)','en-US-AndrewNeural'],['Brian (male)','en-US-BrianNeural'],['Guy (male)','en-US-GuyNeural'],['Christopher (male)','en-US-ChristopherNeural']];
  var LS_VOICE='ctrCloudVoice', LS_RATE='ctrRate';
  var enabled=false, queue=[], idx=0, current=null, curAudio=null;
  var voice=localStorage.getItem(LS_VOICE)||'en-US-AvaNeural';
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
  VOICES.forEach(function(v){var o=document.createElement('option');o.value=v[1];o.textContent=v[0];picker.appendChild(o);});
  picker.value=voice;
  picker.onchange=function(){ voice=picker.value; try{localStorage.setItem(LS_VOICE,voice);}catch(e){} cancel(); paint(); };
  function paint(){ toggle.textContent=enabled?'🔊 Read: ON':'🔇 Read: OFF';
    toggle.className=enabled?'ctr-on':''; document.body.classList.toggle('ctr-active',enabled);
    hint.textContent=enabled?'Click any text to read from there. Esc stops.':''; stop.style.display=(curAudio||(window.speechSynthesis&&speechSynthesis.speaking))?'':'none'; }
  toggle.onclick=function(){ enabled=!enabled; if(!enabled) cancel(); paint(); };
  speed.onclick=function(){ rate=rate>=1.4?0.8:Math.round((rate+0.2)*10)/10; try{localStorage.setItem(LS_RATE,rate);}catch(e){} speed.textContent=rate.toFixed(1)+'x'; if(curAudio)curAudio.playbackRate=rate; };
  stop.onclick=function(){ cancel(); paint(); };
  ui.appendChild(toggle); ui.appendChild(picker); ui.appendChild(speed); ui.appendChild(stop); ui.appendChild(hint);
  function mount(){ if(document.body&&!document.body.contains(ui)) document.body.appendChild(ui); }
  if(document.body) mount(); else document.addEventListener('DOMContentLoaded',mount);
  function cancel(){ try{if(window.speechSynthesis)speechSynthesis.cancel();}catch(e){} if(curAudio){try{curAudio.pause();}catch(e){} curAudio=null;} if(current){current.classList.remove('ctr-reading');current=null;} queue=[];idx=0; }
  function highlight(el){ if(current)current.classList.remove('ctr-reading'); current=el; if(el){el.classList.add('ctr-reading'); try{el.scrollIntoView({block:'center',behavior:'smooth'});}catch(e){}} }
  function vis(el){ return !!(el.offsetParent||el.getClientRects().length); }
  function blockTextOf(el){ if(!el||el.nodeType!==1) return ''; if(el.closest(SKIP)||el.closest(EXCLUDE)) return ''; if(!vis(el)) return ''; return (el.innerText||'').replace(/\s+/g,' ').trim(); }
  function collectBlocks(){ var c=Array.prototype.slice.call(document.querySelectorAll(BLOCK)).filter(function(el){ return blockTextOf(el).length>1; });
    return c.filter(function(el){ return !c.some(function(o){ return o!==el && el.contains(o); }); }); }
  function fallbackSpeak(text){ try{ var u=new SpeechSynthesisUtterance(text);
      var zira=speechSynthesis.getVoices().filter(function(v){return /zira/i.test(v.name)||v.localService;})[0]; if(zira)u.voice=zira;
      u.rate=rate; u.onend=function(){speakNext();}; u.onerror=function(){speakNext();}; speechSynthesis.speak(u);
    }catch(e){ speakNext(); } }
  function speakNext(){ if(idx>=queue.length){highlight(null);paint();return;}
    var el=queue[idx++]; var text=blockTextOf(el)||(el.innerText||el.textContent||'').trim();
    if(!text){speakNext();return;} highlight(el); var myidx=idx;
    fetch(TTS+'?voice='+encodeURIComponent(voice)+'&text='+encodeURIComponent(text.slice(0,2000)))
      .then(function(r){ if(!r.ok) throw 0; return r.blob(); })
      .then(function(b){ if(b.size<512) throw 0; if(myidx!==idx) return;
        var a=new Audio(URL.createObjectURL(b)); curAudio=a; a.playbackRate=rate;
        a.onended=function(){ if(curAudio===a){curAudio=null; speakNext();} };
        a.onerror=function(){ if(curAudio===a){curAudio=null; fallbackSpeak(text);} };
        a.play().catch(function(){ curAudio=null; fallbackSpeak(text); }); paint();
      })
      .catch(function(){ if(myidx===idx) fallbackSpeak(text); });
    paint(); }
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
