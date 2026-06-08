(function initClickToRead(){
  if (window.__ctrInstalled) return; window.__ctrInstalled = true;
  var TTS='/.netlify/functions/tts';
  var EXCLUDE='button,a,input,textarea,select,label,svg,canvas,[role="button"],.ctr-ui,.no-read,[data-no-read]';
  var SKIP='.ctr-ui,nav,aside,header,footer,.sidebar,[data-no-read]';
  var BLOCK='h1,h2,h3,h4,h5,h6,p,li,blockquote,td,th,dd,dt,figcaption,summary,pre,div,section,article,[data-read]';
  var VOICES=[['Ava (female)','en-US-AvaNeural'],['Emma (female)','en-US-EmmaNeural'],['Jenny (female)','en-US-JennyNeural'],['Aria (female)','en-US-AriaNeural'],['Michelle (female)','en-US-MichelleNeural'],['Andrew (male)','en-US-AndrewNeural'],['Brian (male)','en-US-BrianNeural'],['Guy (male)','en-US-GuyNeural'],['Christopher (male)','en-US-ChristopherNeural']];
  var LS_VOICE='ctrCloudVoice', LS_RATE='ctrRate';
  var enabled=true;
  var gen=0, queue=[], idx=0, current=null, ac=null, curUrl=null, busy=false;
  var player=new Audio();
  var voice=localStorage.getItem(LS_VOICE)||'en-US-AvaNeural';
  var rate=parseFloat(localStorage.getItem(LS_RATE))||1.0;
  var css=document.createElement('style');
  css.textContent=
    ".ctr-reading{outline:2px solid #5ad1c8;outline-offset:3px;background:rgba(90,209,200,.16);border-radius:6px}"+
    ".ctr-ui{position:fixed;left:16px;bottom:16px;z-index:2147483647;display:flex;gap:8px;align-items:center;flex-wrap:wrap;max-width:340px;font-family:'Oxanium',system-ui,sans-serif;background:#0b1220;border:1px solid #1e2b45;border-radius:12px;padding:8px 10px;box-shadow:0 8px 28px rgba(0,0,0,.55)}"+
    ".ctr-ui button,.ctr-ui select{font-family:'Space Mono',monospace;font-size:12px;cursor:pointer;border-radius:8px;border:1px solid #2a3b5e;background:#111c30;color:#cfe3ff;padding:6px 9px}"+
    ".ctr-ui select{max-width:140px}"+
    ".ctr-ui .ctr-on{background:#5ad1c8;color:#04121a;border-color:#5ad1c8;font-weight:700}"+
    ".ctr-ui .ctr-stop.live{background:#e5484d;border-color:#e5484d;color:#1a0307;font-weight:700}"+
    ".ctr-ui .ctr-hint{flex-basis:100%;font-family:'Space Mono',monospace;font-size:10px;color:#7e93b8;line-height:1.25}"+
    "body.ctr-active{cursor:pointer}";
  document.head.appendChild(css);
  var ui=document.createElement('div'); ui.className='ctr-ui';
  var toggle=document.createElement('button'), picker=document.createElement('select'),
      speed=document.createElement('button'), stop=document.createElement('button'), hint=document.createElement('span');
  hint.className='ctr-hint'; speed.textContent=rate.toFixed(1)+'x'; picker.title='Voice'; stop.textContent='■ Stop'; stop.className='ctr-stop';
  VOICES.forEach(function(v){var o=document.createElement('option');o.value=v[1];o.textContent=v[0];picker.appendChild(o);});
  picker.value=voice;
  function paint(){ toggle.textContent=enabled?'🔊 Read: ON':'🔇 Read: OFF'; toggle.className=enabled?'ctr-on':'';
    document.body.classList.toggle('ctr-active',enabled);
    stop.className='ctr-stop'+((busy||!player.paused)?' live':'');
    hint.textContent=enabled?'Click any text to read from there. ■ Stop or Esc to stop.':'Reading OFF — click 🔇 to turn on.'; }
  picker.onchange=function(ev){ ev.stopPropagation(); voice=picker.value; try{localStorage.setItem(LS_VOICE,voice);}catch(e){} stopAll(); };
  toggle.onclick=function(ev){ ev.stopPropagation(); enabled=!enabled; if(!enabled) stopAll(); else paint(); };
  speed.onclick=function(ev){ ev.stopPropagation(); rate=rate>=1.4?0.8:Math.round((rate+0.2)*10)/10; try{localStorage.setItem(LS_RATE,rate);}catch(e){} speed.textContent=rate.toFixed(1)+'x'; player.playbackRate=rate; };
  stop.onclick=function(ev){ ev.stopPropagation(); stopAll(); };
  ui.appendChild(toggle); ui.appendChild(picker); ui.appendChild(speed); ui.appendChild(stop); ui.appendChild(hint);
  function mount(){ if(document.body&&!document.body.contains(ui)) document.body.appendChild(ui); }
  if(document.body) mount(); else document.addEventListener('DOMContentLoaded',mount);
  function clearHL(){ if(current){current.classList.remove('ctr-reading');current=null;} }
  function stopAll(){ gen++; busy=false;
    if(ac){ try{ac.abort();}catch(e){} ac=null; }
    player.onended=null; player.onerror=null;
    try{ player.pause(); }catch(e){}
    try{ player.removeAttribute('src'); player.load(); }catch(e){}
    if(curUrl){ try{URL.revokeObjectURL(curUrl);}catch(e){} curUrl=null; }
    try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
    clearHL(); queue=[]; idx=0; paint(); }
  function highlight(el){ clearHL(); current=el; if(el){el.classList.add('ctr-reading'); try{el.scrollIntoView({block:'center',behavior:'smooth'});}catch(e){}} }
  function vis(el){ return !!(el.offsetParent||el.getClientRects().length); }
  function blockTextOf(el){ if(!el||el.nodeType!==1) return ''; if(el.closest(SKIP)||el.closest(EXCLUDE)) return ''; if(!vis(el)) return ''; return (el.innerText||'').replace(/\s+/g,' ').trim(); }
  function collectBlocks(){ var c=Array.prototype.slice.call(document.querySelectorAll(BLOCK)).filter(function(el){ return blockTextOf(el).length>1; });
    return c.filter(function(el){ return !c.some(function(o){ return o!==el && el.contains(o); }); }); }
  function fallbackSpeak(text,g){ if(g!==gen) return; try{ var u=new SpeechSynthesisUtterance(text);
      var z=speechSynthesis.getVoices().filter(function(v){return /zira/i.test(v.name)||v.localService;})[0]; if(z)u.voice=z;
      u.rate=rate; u.onend=function(){ step(g); }; u.onerror=function(){ step(g); }; speechSynthesis.speak(u); paint();
    }catch(e){ step(g); } }
  function step(g){ if(g!==gen) return;
    if(idx>=queue.length){ busy=false; clearHL(); paint(); return; }
    busy=true; var el=queue[idx++]; var text=blockTextOf(el)||(el.innerText||el.textContent||'').trim();
    if(!text){ step(g); return; }
    highlight(el); paint();
    ac=(window.AbortController)?new AbortController():null;
    fetch(TTS+'?voice='+encodeURIComponent(voice)+'&text='+encodeURIComponent(text.slice(0,2000)), ac?{signal:ac.signal}:{})
      .then(function(r){ if(!r.ok) throw 0; return r.blob(); })
      .then(function(b){ if(g!==gen) return; if(b.size<512) throw 0;
        if(curUrl){ try{URL.revokeObjectURL(curUrl);}catch(e){} } curUrl=URL.createObjectURL(b);
        player.onended=function(){ if(g===gen) step(g); };
        player.onerror=function(){ if(g===gen) fallbackSpeak(text,g); };
        player.src=curUrl; player.playbackRate=rate;
        var p=player.play(); if(p&&p.catch) p.catch(function(){ if(g===gen) fallbackSpeak(text,g); });
        paint(); })
      .catch(function(err){ if(err&&err.name==='AbortError') return; if(g===gen) fallbackSpeak(text,g); });
  }
  function startFrom(target){
    var blocks=collectBlocks(); var start=null,i;
    for(i=0;i<blocks.length;i++){ if(blocks[i]===target||blocks[i].contains(target)){ start=blocks[i]; break; } }
    if(!start){ var p=target; while(p&&p!==document.body){ if(blockTextOf(p)){start=p;break;} p=p.parentElement; } if(start&&blocks.indexOf(start)<0) blocks=[start].concat(blocks); }
    if(!start) return false;
    var at=blocks.indexOf(start); if(at<0) at=0;
    stopAll(); var g=gen; queue=blocks.slice(at); idx=0; step(g); return true; }
  document.addEventListener('click',function(e){
    if(e.target.closest('.ctr-ui')) return;
    if(!enabled) return;
    if(e.target.closest(EXCLUDE)) return;
    if(startFrom(e.target)) e.preventDefault();
  },true);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') stopAll(); });
  paint();
})();
