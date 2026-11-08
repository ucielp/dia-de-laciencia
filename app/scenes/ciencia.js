/* Escenas de ciencia (agente «ciencia»): misterio (5), experimento (8), metodo (9), no-solo (25), ambitos (30), mi-trabajo (40).
   Todo dibujado con SVG/CSS/canvas en estilo papel recortado. Ver CONTRACT.md. */
(function(){
"use strict";
const SC=window.SCENES=window.SCENES||[];
/* VÍDEO de las familias preparando el experimento en casa: paso OPCIONAL al final de la escena «experimento».
   Cómo añadirlo: guarda el vídeo como  app/video/experimento.mp4  (MP4 H.264 + AAC; mejor < 50 MB para Vercel).
   Si el archivo no existe o no se puede cargar, ese paso se SALTA solo (no aparece nada en pantalla).
   Para usar otro nombre, cambia solo esta ruta (relativa a index.html). */
const EXPERIMENT_VIDEO="video/experimento.mp4";
let UID=0;
/* Colores del modelo físico de ADN (letra siempre en blanco) */
const BASE={A:"#2F6BD8",T:"#E0245E",G:"#1E9A57",C:"#F28A1E"};
const PAIR={A:"T",T:"A",C:"G",G:"C"};
const rnd=(a,b)=>a+Math.random()*(b-a);
const pick=a=>a[Math.floor(Math.random()*a.length)];

/* SVG en papel recortado: %F% se sustituye por el filtro de sombra (único por dibujo). s = escala de la sombra. */
function paper(vb,inner,attrs="",s=1){
  const id="cfp"+(++UID);
  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" ${attrs}><defs><filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="${2*s}" dy="${3.5*s}" stdDeviation="${2*s}" flood-color="#5a4a30" flood-opacity="0.38"/></filter></defs>${inner.split("%F%").join(`filter="url(#${id})"`)}</svg>`;
}
function timers(){
  const ts=new Set();
  return {
    set(fn,ms){ const t=setTimeout(()=>{ts.delete(t);fn();},ms); ts.add(t); return t; },
    wait(ms){ return new Promise(r=>this.set(r,ms)); },
    clear(){ ts.forEach(clearTimeout); ts.clear(); }
  };
}
function styleEl(APP,text){ return APP.el("style",{text}); }

/* ---------- Iconos pequeños (viewBox 0 0 100 100) de los 6 ámbitos ---------- */
const ICON={
  med:`<path d="M50 86 C10 60 6 30 27 21 C40 16 48 24 50 31 C52 24 60 16 73 21 C94 30 90 60 50 86Z" fill="#E04B3A" %F%/><rect x="45" y="34" width="10" height="30" rx="3" fill="#fff"/><rect x="35" y="44" width="30" height="10" rx="3" fill="#fff"/>`,
  ia:`<g stroke="#6D6E71" stroke-width="5" stroke-linecap="round" fill="none"><path d="M36 14v10M50 14v10M64 14v10M36 76v10M50 76v10M64 76v10M14 36h10M14 50h10M14 64h10M76 36h10M76 50h10M76 64h10"/></g><rect x="22" y="22" width="56" height="56" rx="12" fill="#29ABE2" %F%/><g stroke="#FFFDF7" stroke-width="3" fill="none"><path d="M37 38 L63 50 L37 62 M37 38 V62 M63 50 L50 36 M63 50 L50 64"/></g><circle cx="37" cy="38" r="6" fill="#F2C230"/><circle cx="37" cy="62" r="6" fill="#F2C230"/><circle cx="63" cy="50" r="7" fill="#FFFDF7"/><circle cx="50" cy="36" r="4" fill="#FFFDF7"/><circle cx="50" cy="64" r="4" fill="#FFFDF7"/>`,
  space:`<g transform="rotate(35 50 50)"><path d="M42 74 Q50 98 58 74Z" fill="#F7931E"/><path d="M36 74 V40 Q50 4 64 40 V74Z" fill="#FFFDF7" %F%/><circle cx="50" cy="44" r="8" fill="#29ABE2"/><path d="M36 56 L24 80 L36 74Z" fill="#E04B3A"/><path d="M64 56 L76 80 L64 74Z" fill="#E04B3A"/></g>`,
  nature:`<path d="M18 82 C18 42 48 14 86 14 C86 52 60 82 18 82Z" fill="#7AC143" %F%/><path d="M22 78 L70 30 M44 56 L44 40 M56 44 L68 44" stroke="#4E8F2A" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  chem:`<path d="M38 12 H62 V36 L84 78 Q88 88 78 88 H22 Q12 88 16 78 L38 36Z" fill="#E3F4FB" %F%/><path d="M27 60 H73 L82 78 Q85 84 78 84 H22 Q15 84 18 78Z" fill="#9B6BD3"/><circle cx="44" cy="72" r="4" fill="#fff" opacity=".8"/><circle cx="58" cy="66" r="3" fill="#fff" opacity=".8"/><rect x="34" y="8" width="32" height="8" rx="4" fill="#CDE9F5"/>`,
  hist:`<rect x="38" y="8" width="24" height="9" rx="4" fill="#B85E26"/><path d="M42 14 H58 V24 Q76 34 74 58 Q72 80 50 90 Q28 80 26 58 Q24 34 42 24Z" fill="#D9783A" %F%/><path d="M42 27 Q28 27 30 44 M58 27 Q72 27 70 44" stroke="#B85E26" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M29 56 H71" stroke="#F2C230" stroke-width="6"/><path d="M33 66 H67" stroke="#B85E26" stroke-width="3"/>`
};

/* =====================================================================================
   5 · MISTERIO: «?» gigante + sonido de suspense (el presentador hace la espuma en silencio)
   Paso 1: empieza el suspense (latido + trémolo que sube). Paso 2: «¿Qué ha pasado?» + ta-da.
   ===================================================================================== */
SC.push({id:"misterio",title:"¿Qué pasará?",order:5,mount(box,APP){
  const {el}=APP, red=APP.reduced(), tm=timers();
  box.append(styleEl(APP,`
  .mi{position:absolute;inset:0;background:radial-gradient(circle at 50% 46%,#2E3757 0,#1C2238 58%,#121628 100%);overflow:hidden;cursor:pointer}
  .mi-dot{position:absolute;border-radius:50%;opacity:.16;animation:miFloat 9s ease-in-out infinite}
  .mi.sus .mi-dot{opacity:.28}
  @keyframes miFloat{50%{transform:translateY(-46px)}}
  .mi-qw{position:absolute;left:960px;top:540px;width:0;height:0;transition:transform 1s cubic-bezier(.5,0,.2,1)}
  .mi.rev .mi-qw{transform:translate(0,-300px) scale(.36)}
  .mi-q{position:absolute;left:0;top:0;transform:translate(-50%,-50%);font-family:var(--display);font-weight:700;font-size:840px;line-height:1;color:#F7931E;text-shadow:0 0 90px rgba(247,147,30,.35),0 22px 0 rgba(0,0,0,.3);animation:miSway 3.6s ease-in-out infinite;user-select:none;transition:text-shadow .6s}
  .mi.sus .mi-q{text-shadow:0 0 140px rgba(247,147,30,.6),0 22px 0 rgba(0,0,0,.3)}
  @keyframes miSway{0%,100%{rotate:-6deg}50%{rotate:6deg}}
  .mi-t{position:absolute;left:0;right:0;top:560px;text-align:center;font-family:var(--display);font-weight:700;font-size:190px;line-height:1;color:#FFFDF7;margin:0;opacity:0;transform:scale(.4);transition:opacity .4s,transform .7s cubic-bezier(.3,1.6,.5,1);text-shadow:0 10px 0 rgba(0,0,0,.25)}
  .mi.rev .mi-t{opacity:1;transform:none;transition-delay:.35s}
  @media (prefers-reduced-motion:reduce){.mi *{animation:none!important;transition:none!important}}
  `));
  const root=el("div",{class:"mi"}); box.append(root);
  [[180,170,70,"#29ABE2"],[1690,210,90,"#7AC143"],[1540,860,60,"#F7931E"],[300,840,110,"#E59AAE"],[820,120,40,"#F2C230"],[1240,960,46,"#29ABE2"],[1800,560,36,"#F2C230"],[120,520,44,"#7AC143"]]
    .forEach(([x,y,s,c],i)=>root.append(el("i",{class:"mi-dot",style:{left:x+"px",top:y+"px",width:s+"px",height:s+"px",background:c,animationDelay:(-i*1.3)+"s"}})));
  const pulseEl=el("div");
  const qw=el("div",{class:"mi-qw"},pulseEl);
  pulseEl.append(el("div",{class:"mi-q",text:"?"}));
  root.append(qw,el("h1",{class:"mi-t",text:"¿Qué ha pasado?"}));

  /* ---- Sonido de suspense (Web Audio propio, se para en destroy) ---- */
  let S=null, sid=0;
  function thump(c,out,when,v){
    const o=c.createOscillator(), g=c.createGain();
    o.type="triangle"; o.frequency.setValueAtTime(95,when); o.frequency.exponentialRampToValueAtTime(42,when+0.2);
    g.gain.setValueAtTime(0.0001,when); g.gain.exponentialRampToValueAtTime(v,when+0.015); g.gain.exponentialRampToValueAtTime(0.0001,when+0.24);
    o.connect(g).connect(out); o.start(when); o.stop(when+0.27);
  }
  function pulse(){ if(!red) pulseEl.animate([{transform:"scale(1)"},{transform:"scale(1.07)",offset:.18},{transform:"scale(1)",offset:.4},{transform:"scale(1.04)",offset:.55},{transform:"scale(1)"}],{duration:620,easing:"ease-out"}); }
  function startSuspense(){
    if(S) return; const c=APP.audio.ensure(); if(!c) return;
    const t=c.currentTime, out=c.createGain();
    out.gain.setValueAtTime(0,t); out.gain.linearRampToValueAtTime(APP.audio.muted?0:1,t+1.5); out.connect(c.destination);
    const dg=c.createGain(); dg.gain.value=0.03; dg.connect(out);
    const oscs=[];
    [[98,147,"triangle"],[147,220,"sine"]].forEach(([f0,f1,ty])=>{ const o=c.createOscillator(); o.type=ty; o.frequency.setValueAtTime(f0,t); o.frequency.linearRampToValueAtTime(f1,t+50); o.connect(dg); o.start(t); oscs.push(o); });
    const lfo=c.createOscillator(), lg=c.createGain(); lfo.frequency.setValueAtTime(3,t); lfo.frequency.linearRampToValueAtTime(8,t+50); lg.gain.value=0.022; lfo.connect(lg).connect(dg.gain); lfo.start(t); oscs.push(lfo);
    const id=++sid; S={c,out,oscs,id,period:1150};
    const beat=()=>{
      if(!S||S.id!==id) return;
      const now=c.currentTime;
      S.out.gain.setTargetAtTime(APP.audio.muted?0:1,now,0.05);
      thump(c,out,now+0.02,0.5); thump(c,out,now+0.26,0.32); pulse();
      S.period=Math.max(640,S.period*0.975); tm.set(beat,S.period);
    };
    tm.set(beat,400);
  }
  function stopSuspense(fade){
    if(!S) return; const {c,out,oscs}=S; S=null;
    const t=c.currentTime;
    try{ out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(out.gain.value,t); out.gain.linearRampToValueAtTime(0,t+fade); }catch(e){}
    oscs.forEach(o=>{ try{o.stop(t+fade+0.05);}catch(e){} });
    if(fade<0.1) try{out.disconnect();}catch(e){}
  }
  function taDa(){ const a=APP.audio; a.tone(523,0.14,"triangle",0.12); a.tone(659,0.14,"triangle",0.12,0.13); a.tone(784,0.6,"triangle",0.13,0.26); a.tone(1047,0.7,"sine",0.05,0.26); }

  let st=0;
  function set(n){
    st=n; root.classList.toggle("sus",n===1); root.classList.toggle("rev",n===2);
  }
  root.addEventListener("click",()=>APP.next());
  return {
    next(){
      if(st===0){ set(1); startSuspense(); return true; }
      if(st===1){ set(2); stopSuspense(0.5); taDa(); return true; }
      return false;
    },
    prev(){
      if(st===2){ set(1); startSuspense(); return true; }
      if(st===1){ set(0); stopSuspense(0.4); return true; }
      return false;
    },
    destroy(){ stopSuspense(0.05); tm.clear(); }
  };
}});

/* =====================================================================================
   8 · EXPERIMENTO: ¿por qué sale espuma? dos ingredientes → gas → el jabón lo atrapa → ¡espuma!
   Tecla I (o el botón pequeño abajo a la izquierda): cambia los nombres de los ingredientes.
   ===================================================================================== */
SC.push({id:"experimento",title:"¿Por qué sale espuma?",order:8,mount(box,APP){
  const {el}=APP, red=APP.reduced(), tm=timers(), pourTm=timers();
  const VARS=[{a:"Un ingrediente",b:"Otro ingrediente"},{a:"Vinagre",b:"Bicarbonato"},{a:"Agua oxigenada",b:"Levadura"}];
  let vi=0;
  box.append(styleEl(APP,`
  .fx{position:absolute;inset:0;background:radial-gradient(circle at 72% 55%,#FFF8EA 0,#F4E6CC 60%,#E9D4AE 100%);overflow:hidden;cursor:pointer}
  .fx-cv{position:absolute;left:0;top:0;width:1920px;height:1080px}
  .fx-left{position:absolute;left:90px;top:80px;width:880px;bottom:60px}
  .fx-title{font-family:var(--display);font-weight:700;font-size:104px;line-height:1.02;margin:0 0 36px;color:var(--ink)}
  .fx-title b{color:var(--orange);font-weight:700}
  .fx-say{font-family:var(--display);font-weight:500;font-size:62px;line-height:1.12;margin:0 0 18px;color:var(--ink)}
  .fx-say b{color:#1E8BC3;font-weight:700}
  .fx-row{display:flex;align-items:center;gap:30px;height:140px;padding:0 34px;border-radius:32px;background:#FFFDF7;box-shadow:0 6px 0 rgba(90,74,48,.12),0 12px 26px rgba(90,74,48,.16);font-family:var(--display);font-size:62px;font-weight:600;color:var(--ink)}
  .fx-badge{width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:62px;font-weight:700;flex:none;box-shadow:0 5px 0 rgba(0,0,0,.12)}
  .fx-plus{font-family:var(--display);font-weight:700;font-size:96px;color:var(--orange);line-height:1;margin:6px 0 6px 50px}
  .fx-in{animation:fxIn .55s cubic-bezier(.3,1.5,.6,1) both}
  @keyframes fxIn{from{opacity:0;transform:translateX(-60px) scale(.92)}}
  .fx-dia{width:660px;height:380px;display:block;margin-top:14px;overflow:visible}
  .fx-up{transform-box:fill-box;animation:fxUp 2.2s ease-in infinite}
  @keyframes fxUp{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-210px);opacity:0}}
  .fx-jig{transform-box:fill-box;animation:fxJig 1.1s ease-in-out infinite alternate}
  @keyframes fxJig{to{transform:translate(10px,-8px)}}
  .fx-wob{transform-box:fill-box;transform-origin:center;animation:fxWob 2.6s ease-in-out infinite}
  @keyframes fxWob{50%{transform:scale(1.04,.96)}}
  .fx-obj{position:absolute;pointer-events:none}
  .fx-obj svg{width:100%;height:100%;display:block;overflow:visible}
  .fx-swap{position:absolute;left:22px;bottom:20px;width:62px;height:62px;border-radius:50%;border:none;background:rgba(31,42,68,.07);cursor:pointer;opacity:.45;padding:9px}
  .fx-swap:hover,.fx-swap:focus-visible{opacity:1}
  .fx-swap svg{width:100%;height:100%;display:block}
  .fx-vid{position:absolute;inset:0;z-index:30;background:radial-gradient(circle at 50% 55%,#FFF8EA 0,#F4E6CC 70%,#E9D4AE 100%);display:none}
  .fx-vid.on{display:block;animation:fxVidIn .5s cubic-bezier(.3,1.3,.5,1) both}
  @keyframes fxVidIn{from{opacity:0;transform:scale(.94)}}
  .fx-vid h1{position:absolute;left:0;right:0;top:44px;margin:0;text-align:center;font-family:var(--display);font-weight:700;font-size:96px;line-height:1;color:var(--ink)}
  .fx-vid h1 b{color:var(--orange);font-weight:700}
  .fx-vframe{position:absolute;left:50%;top:180px;width:1440px;height:852px;margin-left:-720px;box-sizing:border-box;padding:24px;background:#FFFDF7;border-radius:22px;transform:rotate(-1deg);box-shadow:0 10px 0 rgba(90,74,48,.14),0 24px 50px rgba(90,74,48,.28)}
  .fx-vframe::before,.fx-vframe::after{content:"";position:absolute;top:-24px;width:200px;height:52px;background:rgba(242,194,48,.78);border-radius:4px;z-index:2}
  .fx-vframe::before{left:80px;transform:rotate(-6deg)}.fx-vframe::after{right:80px;transform:rotate(5deg)}
  .fx-vframe video{display:block;width:1392px;height:804px;object-fit:contain;background:#1F2A44;border-radius:12px;cursor:pointer}
  @media (prefers-reduced-motion:reduce){.fx *{animation:none!important}}
  `));
  const root=el("div",{class:"fx"}); box.append(root);
  const cv=el("canvas",{class:"fx-cv",width:1920,height:1080,role:"img","aria-label":"Un bote transparente donde se forma espuma"});
  const ctx=cv.getContext("2d");
  const left=el("div",{class:"fx-left"});
  const BLUE="#29ABE2", ORANGE="#F7931E";
  const cup1=el("div",{class:"fx-obj",style:{left:"930px",top:"130px",width:"220px",height:"240px",transformOrigin:"91% 6%"},html:paper("0 0 220 240",`
    <path d="M24 18 H196 L180 222 Q178 234 166 234 H54 Q42 234 40 222 Z" fill="#EAF6FB" %F%/>
    <path d="M36 92 H184 L180 220 Q178 228 166 228 H54 Q42 228 40 220Z" fill="#9FD5EE"/>
    <path d="M196 18 L214 10 L204 34Z" fill="#EAF6FB"/>
    <path d="M58 40 L66 200" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".85"/>
    <circle cx="112" cy="156" r="40" fill="${BLUE}"/><text x="112" y="174" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="54" fill="#fff">1</text>`)});
  const cup2=el("div",{class:"fx-obj",style:{left:"1640px",top:"130px",width:"220px",height:"230px",transformOrigin:"4% 45%"},html:paper("0 0 220 230",`
    <path d="M30 104 Q110 30 190 104Z" fill="#FFFDF7" %F%/>
    ${[[70,92],[96,80],[124,86],[150,96],[110,64],[84,100],[136,74]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.5" fill="#C9BBA4"/>`).join("")}
    <path d="M6 104 H214 Q208 220 110 226 Q12 220 6 104Z" fill="#E9DDC8" %F%/>
    <path d="M6 104 H214 Q213 120 210 132 H10 Q7 120 6 104Z" fill="#D9C8AA"/>
    <circle cx="110" cy="170" r="40" fill="${ORANGE}"/><text x="110" y="188" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="54" fill="#fff">2</text>`)});
  const soapB=el("div",{class:"fx-obj",style:{left:"1310px",top:"40px",width:"160px",height:"300px",opacity:0},html:paper("0 0 160 300",`
    <rect x="20" y="0" width="120" height="214" rx="36" fill="#7AC143" %F%/>
    <rect x="34" y="70" width="92" height="76" rx="18" fill="#FFFDF7"/>
    <text x="80" y="122" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="600" font-size="40" fill="#4E8F2A">jabón</text>
    <circle cx="48" cy="40" r="10" fill="#E3F4FB" opacity=".8"/><circle cx="66" cy="28" r="6" fill="#E3F4FB" opacity=".8"/>
    <path d="M56 212 H104 L90 268 H70 Z" fill="#4E8F2A" %F%/><rect x="72" y="264" width="16" height="22" rx="5" fill="#3E7520"/>`)});
  const swap=el("button",{class:"fx-swap",title:"Cambiar nombres de ingredientes (tecla I)","aria-label":"Cambiar nombres de ingredientes",
    html:`<svg viewBox="0 0 48 48"><path d="M10 18 A15 15 0 0 1 38 14" fill="none" stroke="#1F2A44" stroke-width="4" stroke-linecap="round"/><path d="M38 6 V15 H29" fill="none" stroke="#1F2A44" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 30 A15 15 0 0 1 10 34" fill="none" stroke="#1F2A44" stroke-width="4" stroke-linecap="round"/><path d="M10 42 V33 H19" fill="none" stroke="#1F2A44" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`});
  root.append(cv,left,cup1,cup2,soapB,swap);
  /* Paso opcional: vídeo de las familias (EXPERIMENT_VIDEO). Solo existe si el archivo carga; si no, se salta. */
  let vidOK=false;
  const video=el("video",{preload:"auto",playsinline:true,"aria-label":"Vídeo: así preparasteis el experimento en casa"});
  video.addEventListener("loadeddata",()=>{ vidOK=true; });
  video.addEventListener("error",()=>{ vidOK=false; });
  video.addEventListener("click",ev=>{ ev.stopPropagation(); if(video.paused){ const p=video.play(); if(p&&p.catch) p.catch(()=>{}); } else video.pause(); });
  const vidBox=el("div",{class:"fx-vid"},el("h1",{html:"¡Así lo hicisteis <b>en casa</b>!"}),el("div",{class:"fx-vframe"},video));
  root.append(vidBox);
  try{ video.src=EXPERIMENT_VIDEO; }catch(e){ vidOK=false; }
  function showVid(){ vidBox.classList.add("on"); fizz(0); try{ video.currentTime=0; }catch(e){} const p=video.play(); if(p&&p.catch) p.catch(()=>{}); }
  function hideVid(){ vidBox.classList.remove("on"); try{ video.pause(); }catch(e){} fizz(0.045); }

  /* ---- Mundo: bote, líquido, burbujas, espuma ---- */
  const JX0=1170,JX1=1610,JXC=1390,JTOP=390,JBOT=910,WALL=14,LIQ=170,TLMAX=JBOT+16-JTOP;
  const COLS=["#29ABE2","#F7931E","#7AC143","#E59AAE"];
  const W={liq:0,liqT:0,gas:0,soap:false,foam:0,foamT:0,col:0,colT:0,pour1:false,pour2:false};
  let bubbles=[], puffs=[], drops=[], powder=[];
  const tex=Array.from({length:90},()=>({x:rnd(JX0-120,JX1+120),y0:rnd(0,1100),r:rnd(6,18)}));
  const inner=new Path2D(); inner.roundRect(JX0+WALL,JTOP-40,JX1-JX0-2*WALL,JBOT-JTOP+40,[0,0,48,48]);
  const glass=new Path2D(); glass.roundRect(JX0,JTOP,JX1-JX0,JBOT+16-JTOP,[0,0,62,62]);
  const surfY=()=>JBOT-W.liq;
  const avail=()=>surfY()-JTOP;
  const MAXF=()=>avail()+80+TLMAX+200;

  function foamPaths(t){
    const pin=new Path2D(), pout=new Path2D(), s=surfY(), av=avail(), f=W.foam;
    const fin=Math.min(f,av), top=s-fin;
    const circ=(p,x,y,r)=>{ p.moveTo(x+r,y); p.arc(x,y,r,0,Math.PI*2); };
    pin.rect(JX0+WALL,top,JX1-JX0-2*WALL,s-top+6);
    if(f<av){ for(let x=JX0+WALL+18,i=0;x<JX1-WALL;x+=34,i++) circ(pin,x,top+3*Math.sin(i*1.7+t*2),Math.min(22,f*0.5+4)); return {pin,pout:null}; }
    const o=f-av;
    const rx=(JX1-JX0)/2+24+Math.min(40,o*0.25), ry=Math.max(4,Math.min(150,o*0.8)+6*Math.sin(t*1.6)*Math.min(1,o/40));
    pout.moveTo(JXC+rx,JTOP+8); pout.ellipse(JXC,JTOP+8,rx,ry,0,0,Math.PI*2);
    for(let a=Math.PI*1.04,i=0;a<Math.PI*1.97;a+=0.11,i++) circ(pout,JXC+rx*Math.cos(a),JTOP+8+ry*Math.sin(a),24+6*Math.sin(i*2.3+t*2));
    const tl=Math.max(0,Math.min(TLMAX,(o-80)));
    if(tl>0){
      for(const side of [-1,1]){
        const cx=side<0?JX0-26:JX1+26;
        pout.moveTo(cx-34,JTOP); pout.roundRect(cx-34,JTOP,68,tl,34);
        for(let y=JTOP+50,k=0;y<JTOP+tl-20;y+=70,k++) circ(pout,cx+side*(6+8*Math.sin(k*1.9+t*1.4)),y,30+6*Math.sin(k*2.7));
        circ(pout,cx+side*4,JTOP+tl,40);
        if(tl>=TLMAX){
          const pud=Math.max(0,Math.min(110,(o-80-TLMAX)*0.6)), px=cx+side*(pud*0.55);
          pout.moveTo(px+50+pud,JBOT+30); pout.ellipse(px,JBOT+30,50+pud,24+pud*0.1,0,0,Math.PI*2);
        }
      }
    }
    return {pin,pout};
  }
  function drawJarBack(){
    ctx.save(); ctx.fillStyle="rgba(90,74,48,.18)"; ctx.beginPath(); ctx.ellipse(JXC,JBOT+40,470,44,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#FFFDF7"; ctx.beginPath(); ctx.ellipse(JXC,JBOT+28,460,40,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="#EFE6D6"; ctx.beginPath(); ctx.ellipse(JXC,JBOT+26,410,28,0,0,Math.PI*2); ctx.fill(); ctx.restore();
    ctx.fillStyle="rgba(214,238,248,.55)"; ctx.fill(glass);
  }
  function drawLiquid(now){
    if(W.liq<=0.5) return;
    ctx.save(); ctx.clip(inner);
    const s=surfY(), g=ctx.createLinearGradient(0,s,0,JBOT);
    g.addColorStop(0,"rgba(150,205,238,.92)"); g.addColorStop(1,"rgba(98,170,220,.95)");
    ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(JX0,s);
    for(let x=JX0;x<=JX1;x+=20) ctx.lineTo(x,s+(W.gas?3*Math.sin(x/30+now/180):0));
    ctx.lineTo(JX1,JBOT+20); ctx.lineTo(JX0,JBOT+20); ctx.fill();
    ctx.fillStyle="rgba(255,255,255,.85)";
    for(const b of bubbles){ ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill(); }
    ctx.restore();
  }
  function drawJarFront(){
    ctx.save(); ctx.strokeStyle="rgba(120,180,210,.75)"; ctx.lineWidth=10; ctx.stroke(glass);
    ctx.strokeStyle="rgba(255,255,255,.8)"; ctx.lineWidth=14; ctx.lineCap="round";
    ctx.beginPath(); ctx.moveTo(JX0+42,JTOP+50); ctx.lineTo(JX0+42,JBOT-60); ctx.stroke();
    ctx.lineWidth=8; ctx.beginPath(); ctx.moveTo(JX1-40,JTOP+80); ctx.lineTo(JX1-40,JTOP+200); ctx.stroke();
    ctx.shadowColor="rgba(90,74,48,.3)"; ctx.shadowBlur=8; ctx.shadowOffsetY=4;
    ctx.fillStyle="#CDE9F5"; ctx.beginPath(); ctx.roundRect(JX0-18,JTOP-16,JX1-JX0+36,30,15); ctx.fill();
    ctx.restore();
  }
  function drawFoam(p,t){
    ctx.save(); ctx.shadowColor="rgba(90,74,48,.28)"; ctx.shadowBlur=16; ctx.shadowOffsetY=6; ctx.fillStyle="#FFFFFF"; ctx.fill(p); ctx.restore();
    ctx.save(); ctx.clip(p);
    if(W.col>0.01){
      ctx.globalAlpha=0.5*W.col; ctx.lineWidth=30; ctx.lineCap="round";
      const xs=[[JX0+62,0],[JX0+160,1],[JX0+262,2],[JX0+362,3],[JX0-26,0],[JX1+26,1],[JXC-150,3],[JXC+150,2]];
      xs.forEach(([x0,k],i)=>{ ctx.strokeStyle=COLS[k]; ctx.beginPath();
        for(let y=1040;y>=180;y-=20) ctx.lineTo(x0+12*Math.sin(y/80+t*1.5+i),y); ctx.stroke(); });
      ctx.globalAlpha=1;
    }
    ctx.strokeStyle="rgba(150,170,195,.4)"; ctx.lineWidth=3;
    for(const b of tex){ const y=((b.y0-t*38)%1100+1100)%1100; ctx.beginPath(); ctx.arc(b.x,y,b.r,0,Math.PI*2); ctx.stroke(); }
    ctx.restore();
  }
  function drawFlying(now){
    ctx.save();
    if(W.pour1){
      ctx.strokeStyle="rgba(130,195,232,.95)"; ctx.lineCap="round"; ctx.lineWidth=20+3*Math.sin(now/60);
      ctx.beginPath(); ctx.moveTo(1134,154); ctx.quadraticCurveTo(1200,160,1250,surfY()); ctx.stroke();
    }
    ctx.fillStyle="#FFFDF7";
    for(const q of powder){ ctx.beginPath(); ctx.arc(q.x,q.y,q.r,0,Math.PI*2); ctx.fill(); }
    for(const d of drops){ ctx.fillStyle=d.c; ctx.beginPath(); ctx.ellipse(d.x,d.y,d.r*0.8,d.r,0,0,Math.PI*2); ctx.fill(); }
    ctx.strokeStyle="rgba(120,145,175,.55)"; ctx.lineWidth=3;
    for(const g of puffs){ ctx.globalAlpha=Math.max(0,g.life); ctx.beginPath(); ctx.arc(g.x,g.y,g.r,0,Math.PI*2); ctx.stroke(); }
    ctx.restore();
  }
  function update(dt,now){
    const ease=(v,t,r)=>v+Math.sign(t-v)*Math.min(Math.abs(t-v),r*dt);
    W.liq=ease(W.liq,W.liqT,W.pour1?75:W.pour2?20:300);
    W.col=ease(W.col,W.colT,0.6);
    W.foam=ease(W.foam,W.foamT,W.foamT>W.foam?(step>=3?120:60):320);
    const s=surfY();
    let n=W.gas*dt; while(n>0){ if(Math.random()<n&&W.liq>20) bubbles.push({x:rnd(JX0+WALL+10,JX1-WALL-10),y:rnd(JBOT-30,JBOT),r:rnd(2.5,7),vy:rnd(70,150),ph:rnd(0,6)}); n-=1; }
    bubbles=bubbles.filter(b=>{ b.y-=b.vy*dt; b.x+=Math.sin(now/200+b.ph)*0.6; if(b.y<s){ if(!W.soap&&Math.random()<0.6) puffs.push({x:b.x,y:s-6,r:b.r+2,vy:rnd(60,110),life:1}); return false; } return true; });
    puffs=puffs.filter(g=>{ g.y-=g.vy*dt; g.x+=Math.sin(now/300+g.r)*0.8; g.life-=dt*0.55; return g.life>0; });
    powder=powder.filter(q=>{ q.vy+=900*dt; q.x+=q.vx*dt; q.y+=q.vy*dt; return q.y<s; });
    drops=drops.filter(d=>{ d.vy+=1100*dt; d.y+=d.vy*dt; return d.y<s-Math.min(W.foam,avail()); });
    if(W.pour2) for(let i=0;i<3;i++) powder.push({x:1640+rnd(-6,6),y:226+rnd(-4,4),vx:rnd(-170,-110),vy:rnd(-20,40),r:rnd(2.5,5)});
  }
  let raf=0,last=performance.now(),t0=last;
  const loop=now=>{
    const dt=Math.min(0.05,(now-last)/1000); last=now;
    update(dt,now);
    const t=red?0:(now-t0)/1000;
    ctx.clearRect(0,0,1920,1080);
    drawJarBack(); drawLiquid(now);
    const F=W.foam>0.5?foamPaths(t):null;
    if(F) drawFoam(F.pin,t);
    drawJarFront();
    if(F&&F.pout) drawFoam(F.pout,t);
    drawFlying(now);
    raf=requestAnimationFrame(loop);
  };
  raf=requestAnimationFrame(loop);

  /* ---- Sonido: burbujeo (ruido filtrado + gotitas), solo desde el paso 1 ---- */
  let FZ=null;
  function fizz(level){
    if(!level&&!FZ) return;
    const c=APP.audio.ensure(); if(!c) return;
    if(!FZ){
      const len=c.sampleRate*2, buf=c.createBuffer(1,len,c.sampleRate), d=buf.getChannelData(0);
      for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*(Math.random()<0.25?1:0.2);
      const src=c.createBufferSource(); src.buffer=buf; src.loop=true;
      const hp=c.createBiquadFilter(); hp.type="highpass"; hp.frequency.value=2600;
      const g=c.createGain(); g.gain.value=0;
      src.connect(hp).connect(g).connect(c.destination); src.start();
      FZ={c,src,g,level:0};
    }
    FZ.level=level; FZ.g.gain.setTargetAtTime(APP.audio.muted?0:level,c.currentTime,0.35);
  }
  function fizzStop(){ if(!FZ) return; try{FZ.src.stop();}catch(e){} try{FZ.g.disconnect();}catch(e){} FZ=null; }
  const blip=()=>{
    if(FZ&&FZ.level>0){
      FZ.g.gain.setTargetAtTime(APP.audio.muted?0:FZ.level,FZ.c.currentTime,0.1);
      if(!APP.audio.muted&&Math.random()<(step>=3?0.9:0.45)) APP.audio.tone(rnd(260,620),0.07,"sine",step>=3?0.07:0.04,0,rnd(150,450));
    }
    tm.set(blip,rnd(70,190));
  };
  tm.set(blip,300);

  /* ---- Pasos ---- */
  const badge=(n,c)=>el("div",{class:"fx-badge",text:n,style:{background:c}});
  const DIA={
    gas:`<svg class="fx-dia" viewBox="0 0 660 380"><rect x="20" y="250" width="620" height="120" rx="30" fill="#9FD5EE"/><path d="M20 268 Q180 244 330 268 T640 268 V280 H20Z" fill="#BFE6F7"/>
      ${[[90,330,10,0],[170,300,7,.5],[250,340,12,1.1],[330,310,8,.3],[410,335,11,1.6],[490,305,7,.8],[570,330,10,1.3],[130,350,6,1.8],[450,350,6,.2]].map(([x,y,r,d])=>`<circle class="fx-up" style="animation-delay:${d}s" cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#7FA0C0" stroke-width="4"/>`).join("")}</svg>`,
    soap:`<svg class="fx-dia" viewBox="0 0 660 380"><g class="fx-wob"><circle cx="250" cy="190" r="160" fill="rgba(227,244,251,.8)" stroke="#7AC143" stroke-width="18"/><path d="M150 120 A120 120 0 0 1 230 70" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round"/></g>
      ${[[200,170],[260,140],[300,210],[220,240],[180,210],[280,260],[320,160]].map(([x,y],i)=>`<circle class="fx-jig" style="animation-delay:-${i*0.3}s" cx="${x}" cy="${y}" r="11" fill="#8FA7BF"/>`).join("")}
      <rect x="196" y="282" width="110" height="58" rx="29" fill="#1F2A44"/><text x="251" y="324" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="600" font-size="44" fill="#fff">gas</text>
      <path d="M405 110 L470 80" stroke="#4E8F2A" stroke-width="6" stroke-linecap="round"/><rect x="460" y="40" width="170" height="70" rx="35" fill="#7AC143"/><text x="545" y="90" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="600" font-size="46" fill="#fff">jabón</text></svg>`,
    foam:`<svg class="fx-dia" viewBox="0 0 660 380">${[[120,300,70],[230,290,60],[330,300,72],[440,295,64],[540,305,58],[170,200,58],[280,195,66],[390,200,60],[490,210,54],[230,110,52],[340,105,58],[440,120,46],[330,20,30]].map(([x,y,r],i)=>`<g class="fx-wob" style="animation-delay:-${i*0.27}s"><circle cx="${x}" cy="${y+40}" r="${r}" fill="#FFFFFF" stroke="#BFD6E6" stroke-width="5"/><circle cx="${x-r*0.35}" cy="${y+40-r*0.35}" r="${r*0.16}" fill="#E3F4FB"/></g>`).join("")}</svg>`
  };
  let step=0;
  function render(){
    left.replaceChildren();
    const v=VARS[vi];
    if(step===0){
      left.append(el("h1",{class:"fx-title fx-in",html:"Mezclamos<br><b>dos ingredientes</b>"}),
        el("div",{class:"fx-row fx-in",style:{animationDelay:".15s"}},badge("1",BLUE),el("span",{text:v.a})),
        el("div",{class:"fx-plus fx-in",style:{animationDelay:".3s"},text:"+"}),
        el("div",{class:"fx-row fx-in",style:{animationDelay:".45s"}},badge("2",ORANGE),el("span",{text:v.b})));
    }else if(step===1){
      left.append(el("h1",{class:"fx-title fx-in",html:"¡Se forma<br>un <b>gas</b>!"}),
        el("p",{class:"fx-say fx-in",style:{animationDelay:".2s"},html:"Un gas es como el <b>aire</b>:"}),
        el("p",{class:"fx-say fx-in",style:{animationDelay:".4s"},text:"no se ve… ¡pero hace burbujitas!"}),
        el("div",{class:"fx-in",style:{animationDelay:".6s"},html:DIA.gas}));
    }else if(step===2){
      left.append(el("h1",{class:"fx-title fx-in",html:"El <b>jabón</b><br>atrapa el gas"}),
        el("p",{class:"fx-say fx-in",style:{animationDelay:".2s"},html:"¡Como una <b>pompa</b>!"}),
        el("div",{class:"fx-in",style:{animationDelay:".4s"},html:DIA.soap}));
    }else{
      left.append(el("h1",{class:"fx-title fx-in",html:"¡<b>Espuma</b>!"}),
        el("p",{class:"fx-say fx-in",style:{animationDelay:".2s"},text:"Muchísimas burbujas juntas…"}),
        el("p",{class:"fx-say fx-in",style:{animationDelay:".5s"},html:"¡y ya <b>no caben</b> en el bote!"}),
        el("div",{class:"fx-in",style:{animationDelay:".8s"},html:DIA.foam}));
    }
  }
  const hideCups=()=>{ [cup1,cup2].forEach(c=>{ c.getAnimations().forEach(a=>a.cancel()); c.style.opacity=0; }); };
  function finishPour(){ pourTm.clear(); W.pour1=W.pour2=false; powder=[]; W.liqT=LIQ; W.liq=LIQ; hideCups(); }
  function startPour(){
    if(red){ finishPour(); return; }
    W.liq=0; W.liqT=0; cup1.style.opacity=1; cup2.style.opacity=1;
    const tilt=(c,deg,at,hold)=>pourTm.set(()=>{ c.animate([{transform:"rotate(0)"},{transform:`rotate(${deg}deg)`,offset:.2},{transform:`rotate(${deg}deg)`,offset:.85},{transform:"rotate(0)"}],{duration:hold,easing:"ease-in-out"}); },at);
    tilt(cup1,72,700,2900);
    pourTm.set(()=>{ W.pour1=true; W.liqT=LIQ-20; },1300);
    pourTm.set(()=>{ W.pour1=false; },3100);
    pourTm.set(()=>{ cup1.animate([{opacity:1},{opacity:0}],{duration:400,fill:"forwards"}); },3700);
    tilt(cup2,-62,3700,2600);
    pourTm.set(()=>{ W.pour2=true; W.liqT=LIQ; },4200);
    pourTm.set(()=>{ W.pour2=false; },5700);
    pourTm.set(()=>{ cup2.animate([{opacity:1},{opacity:0}],{duration:400,fill:"forwards"}); },6400);
  }
  function soapIn(){
    if(red){ W.soap=true; W.foamT=70; W.foam=70; W.colT=1; W.col=1; return; }
    soapB.getAnimations().forEach(a=>a.cancel());
    soapB.animate([{opacity:0,transform:"translateY(-260px)"},{opacity:1,transform:"translateY(0)",offset:.2},{opacity:1,transform:"translateY(0)",offset:.85},{opacity:0,transform:"translateY(-260px)"}],{duration:3400,easing:"ease-in-out"});
    for(let i=0;i<10;i++) pourTm.set(()=>{
      drops.push({x:JXC+rnd(-4,4),y:330,vy:0,r:i%3?11:9,c:i<4?"#7AC143":COLS[i%4]});
      soapB.animate([{transform:"scaleX(1)"},{transform:"scaleX(.86)"},{transform:"scaleX(1)"}],{duration:200,composite:"add"});
    },900+i*170);
    pourTm.set(()=>{ W.soap=true; W.foamT=70; W.colT=1; },1200);
  }
  function enter(dir){
    render();
    if(step===0){ W.gas=0; W.soap=false; W.foamT=0; W.colT=0; fizz(0); if(dir>0) startPour(); else finishPour(); }
    if(step>=1){ if(W.liq<LIQ-1||W.pour1||W.pour2) finishPour(); hideCups(); }
    if(step===1){ W.gas=50; W.soap=false; W.foamT=0; W.colT=0; drops=[]; fizz(0.02); }
    if(step===2){ W.gas=60; fizz(0.025); if(dir>0) soapIn(); else { W.soap=true; W.foamT=70; W.colT=1; } }
    if(step===3){ W.gas=150; W.soap=true; W.colT=1; W.col=Math.max(W.col,0.6); W.foamT=MAXF(); fizz(0.045); if(red){ W.foam=W.foamT; } }
  }
  const onKey=e=>{ if(e.key==="i"||e.key==="I"){ vi=(vi+1)%VARS.length; render(); } };
  window.addEventListener("keydown",onKey);
  swap.addEventListener("click",ev=>{ ev.stopPropagation(); vi=(vi+1)%VARS.length; render(); });
  root.addEventListener("click",()=>APP.next());
  enter(1);
  return {
    next(){ if(step<3){ pourTm.clear(); step++; enter(1); return true; }
      if(step===3&&vidOK){ step=4; showVid(); return true; } return false; },
    prev(){ if(step===4){ step=3; hideVid(); return true; }
      if(step>0){ pourTm.clear(); step--; enter(-1); return true; } return false; },
    destroy(){ cancelAnimationFrame(raf); tm.clear(); pourTm.clear(); fizzStop(); window.removeEventListener("keydown",onKey);
      try{ video.pause(); video.removeAttribute("src"); video.load(); }catch(e){} }
  };
}});

/* =====================================================================================
   9 · MÉTODO CIENTÍFICO: ciclo de 5 pasos (observar → preguntar → imaginar → probar → ¿qué ha pasado?)
   unido a la espuma que acabamos de hacer. Cada pulsación revela un paso; la última cierra el círculo.
   ===================================================================================== */
const MC_ICON={
  obs:`<path d="M8 50 Q50 12 92 50 Q50 88 8 50Z" fill="#FFFDF7" %F%/><circle cx="50" cy="50" r="21" fill="#2453C7"/><circle cx="50" cy="50" r="10" fill="#1F2A44"/><circle cx="43" cy="43" r="5" fill="#fff"/>`,
  ask:`<path d="M12 24 Q12 12 24 12 H76 Q88 12 88 24 V58 Q88 70 76 70 H46 L28 88 L31 70 H24 Q12 70 12 58Z" fill="#FFFDF7" %F%/><text x="50" y="61" text-anchor="middle" font-family="Fredoka,sans-serif" font-weight="700" font-size="54" fill="#F7931E">?</text>`,
  idea:`<path d="M50 6 V14 M18 20 L24 26 M82 20 L76 26 M8 50 H16 M92 50 H84" stroke="#FFFDF7" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="44" r="25" fill="#FFFDF7" %F%/><path d="M40 70 Q38 60 31 54 L69 54 Q62 60 60 70Z" fill="#FFFDF7"/><rect x="38" y="68" width="24" height="9" rx="3" fill="#6D6E71" %F%/><rect x="40" y="79" width="20" height="9" rx="3" fill="#6D6E71" %F%/><path d="M44 54 V46 M56 54 V46 M44 46 Q50 36 56 46" stroke="#F7931E" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  test:`<path d="M40 30 V46 L20 82 Q16 90 26 90 H74 Q84 90 80 82 L60 46 V30Z" fill="#E3F4FB" %F%/><path d="M30 66 H70 L80 82 Q84 90 74 90 H26 Q16 90 20 82Z" fill="#29ABE2"/>
    <circle cx="42" cy="22" r="11" fill="#FFFDF7" %F%/><circle cx="56" cy="18" r="13" fill="#FFFDF7" %F%/><circle cx="50" cy="8" r="8" fill="#FFFDF7" %F%/><circle cx="64" cy="30" r="8" fill="#FFFDF7" %F%/><circle cx="36" cy="34" r="7" fill="#FFFDF7" %F%/>
    <circle cx="40" cy="78" r="3.5" fill="#FFFDF7"/><circle cx="56" cy="74" r="2.5" fill="#FFFDF7"/><circle cx="62" cy="82" r="3" fill="#FFFDF7"/>`,
  done:`<rect x="20" y="16" width="60" height="76" rx="8" fill="#FFFDF7" %F%/><rect x="36" y="9" width="28" height="15" rx="5" fill="#6D6E71" %F%/><path d="M32 54 L45 67 L69 38" stroke="#1E9A57" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 80 H68" stroke="#E2D6BE" stroke-width="5" stroke-linecap="round"/>`
};
SC.push({id:"metodo",title:"El método científico",order:9,mount(box,APP){
  const {el}=APP, red=APP.reduced(), tm=timers();
  const CX=620, CY=610, R=360, ND=190;
  const STEPS=[
    {k:"obs", c:"#29ABE2", label:"Observar", name:"Observar", say:"Miramos con <b>mucha atención</b>.", say2:"Un bote, dos ingredientes…"},
    {k:"ask", c:"#F7931E", label:"Preguntar", name:"Preguntar", say:"¿Qué pasará <b>si los mezclamos</b>?"},
    {k:"idea",c:"#E0A800", label:"Imaginar", name:"Imaginar", word:"hipótesis", say:"Yo creo que…<br>¡saldrán <b>burbujas</b>!"},
    {k:"test",c:"#7AC143", label:"Probar", name:"Probar", word:"experimento", say:"¡Lo mezclamos<br>y <b>miramos</b>!"},
    {k:"done",c:"#E04B3A", label:"¿Qué ha pasado?", name:"¿Qué ha pasado?", word:"conclusión", say:"¡Espuma! El jabón<br><b>atrapó el gas</b>."}
  ];
  const ang=i=>(-90+72*i)*Math.PI/180;
  const pos=i=>[CX+R*Math.cos(ang(i)),CY+R*Math.sin(ang(i))];
  box.append(styleEl(APP,`
  .mc{position:absolute;inset:0;background:radial-gradient(circle at 32% 56%,#FFF8EA 0,#F6EBD6 55%,#EDDDBF 100%);overflow:hidden;cursor:pointer}
  .mc-title{position:absolute;left:80px;top:34px;margin:0;font-family:var(--display);font-weight:700;font-size:84px;line-height:1;color:var(--ink)}
  .mc-title b{color:var(--orange);font-weight:700}
  .mc-svg{position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;overflow:visible}
  .mc-arc{fill:none;stroke:#4A5265;stroke-width:14;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .6s ease-out}
  .mc-head{opacity:0;transition:opacity .2s .5s}
  .mc-a.on .mc-arc{stroke-dashoffset:0}.mc-a.on .mc-head{opacity:1}
  .mc-n{position:absolute;width:${ND}px;height:${ND}px;margin:-${ND/2}px 0 0 -${ND/2}px;transform:scale(0);opacity:0;transition:transform .55s cubic-bezier(.3,1.6,.5,1),opacity .3s}
  .mc-n.on{transform:scale(1);opacity:1}
  .mc-n.cur{transform:scale(1.14)}
  .mc-disc{position:absolute;inset:0;border-radius:50%;background:var(--c);box-shadow:0 7px 0 rgba(90,74,48,.16),0 14px 26px rgba(90,74,48,.24)}
  .mc-n.cur .mc-disc{box-shadow:0 0 0 12px #FFFDF7,0 0 0 20px var(--c),0 14px 30px rgba(90,74,48,.3)}
  .mc-n svg{position:absolute;left:20px;top:16px;width:150px;height:150px}
  .mc-num{position:absolute;left:-8px;top:-8px;width:58px;height:58px;border-radius:50%;background:#FFFDF7;color:var(--ink);font-family:var(--display);font-weight:700;font-size:40px;line-height:58px;text-align:center;box-shadow:0 4px 0 rgba(90,74,48,.15)}
  .mc-lab{position:absolute;left:50%;top:${ND-30}px;transform:translateX(-50%);white-space:nowrap;background:#FFFDF7;color:var(--ink);font-family:var(--display);font-weight:600;font-size:40px;line-height:1;padding:9px 22px 11px;border-radius:999px;box-shadow:0 4px 0 rgba(90,74,48,.14)}
  .mc-n.pulse .mc-disc{animation:mcPulse .7s ease-out}
  @keyframes mcPulse{40%{transform:scale(1.16)}}
  .mc-jar{position:absolute;left:${CX-150}px;top:${CY-150}px;width:300px;height:300px}
  .mc-jar svg{width:100%;height:100%;overflow:visible;display:block}
  .mc-foam{transform-box:fill-box;transform-origin:50% 100%;transform:scale(0);transition:transform .9s cubic-bezier(.3,1.5,.5,1)}
  .mc.foam .mc-foam{transform:none}
  .mc-ring{fill:none;stroke:#D8C7A6;stroke-width:6;stroke-dasharray:4 22;stroke-linecap:round}
  .mc-p{position:absolute;left:1140px;top:250px;width:720px}
  .mc-p h2{margin:0 0 26px;font-family:var(--display);font-weight:700;font-size:100px;line-height:1.02;color:var(--c,var(--ink))}
  .mc-p h2 b{color:var(--orange);font-weight:700}
  .mc-word{display:inline-flex;align-items:center;gap:14px;margin:0 0 30px;padding:12px 30px 14px;border-radius:999px;background:var(--c);color:#fff;font-family:var(--display);font-weight:600;font-size:48px;line-height:1;box-shadow:0 5px 0 rgba(90,74,48,.15)}
  .mc-word small{font-size:40px;font-weight:500;opacity:.9}
  .mc-say{margin:0 0 18px;font-family:var(--display);font-weight:500;font-size:64px;line-height:1.12;color:var(--ink)}
  .mc-say b{color:var(--c,var(--orange));font-weight:700}
  .mc-in{animation:mcIn .5s cubic-bezier(.3,1.5,.6,1) both}
  @keyframes mcIn{from{opacity:0;transform:translateX(50px) scale(.94)}}
  @media (prefers-reduced-motion:reduce){.mc *{animation:none!important;transition:none!important}}
  `));
  const root=el("div",{class:"mc"}); box.append(root);
  // anillo punteado de fondo + flechas (arcos) entre pasos
  const M=26*Math.PI/180; // margen angular para no tocar los círculos
  let arcs="";
  for(let i=0;i<5;i++){
    const a0=ang(i)+M, a1=ang(i+1)-M-0.06;
    const x0=CX+R*Math.cos(a0), y0=CY+R*Math.sin(a0), x1=CX+R*Math.cos(a1), y1=CY+R*Math.sin(a1);
    const tx=-Math.sin(a1), ty=Math.cos(a1), nx=Math.cos(a1), ny=Math.sin(a1); // tangente (sentido horario) y normal
    const hx=x1+tx*30, hy=y1+ty*30;
    const head=`${(hx).toFixed(1)},${(hy).toFixed(1)} ${(x1+nx*20-tx*4).toFixed(1)},${(y1+ny*20-ty*4).toFixed(1)} ${(x1-nx*20-tx*4).toFixed(1)},${(y1-ny*20-ty*4).toFixed(1)}`;
    arcs+=`<g class="mc-a" data-i="${i}"><path class="mc-arc" pathLength="1" d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}"/><polygon class="mc-head" points="${head}" fill="#4A5265" stroke="#4A5265" stroke-width="6" stroke-linejoin="round"/></g>`;
  }
  const svgEl=APP.svg(`<svg class="mc-svg" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg"><circle class="mc-ring" cx="${CX}" cy="${CY}" r="${R}"/>${arcs}</svg>`);
  const arcEls=[...svgEl.querySelectorAll(".mc-a")];
  // bote de la espuma en el centro (la espuma aparece en «Probar»)
  const jar=el("div",{class:"mc-jar",html:paper("0 0 300 300",`
    <ellipse cx="150" cy="282" rx="120" ry="14" fill="rgba(90,74,48,.18)"/>
    <g class="mc-foam">${[[80,84,40],[124,62,46],[176,64,44],[218,88,38],[150,30,34],[100,40,26],[200,36,24],[60,120,26],[240,124,24]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" stroke="#D5E4EE" stroke-width="4" %F%/>`).join("")}
      <path d="M56 100 Q50 170 48 200" stroke="#FFFFFF" stroke-width="30" stroke-linecap="round" fill="none"/><path d="M244 104 Q252 160 254 210" stroke="#FFFFFF" stroke-width="30" stroke-linecap="round" fill="none"/></g>
    <rect x="70" y="96" width="160" height="182" rx="34" fill="rgba(214,238,248,.85)" %F%/>
    <path d="M78 176 H222 V244 Q222 270 196 270 H104 Q78 270 78 244Z" fill="#9FD5EE"/>
    <path d="M96 116 V240" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".85"/>
    <rect x="62" y="88" width="176" height="22" rx="11" fill="#CDE9F5" %F%/>
    <circle cx="130" cy="222" r="7" fill="#fff"/><circle cx="168" cy="236" r="5" fill="#fff"/><circle cx="186" cy="204" r="6" fill="#fff"/>`,"",2)});
  root.append(el("h1",{class:"mc-title",html:"¿Cómo trabaja un <b>científico</b>?"}),svgEl,jar);
  const nodes=STEPS.map((S,i)=>{
    const [x,y]=pos(i);
    const n=el("div",{class:"mc-n",style:{left:x.toFixed(0)+"px",top:y.toFixed(0)+"px"}},
      el("div",{class:"mc-disc"}),APP.svg(paper("0 0 100 100",MC_ICON[S.k],"",1)),el("div",{class:"mc-num",text:String(i+1)}),el("div",{class:"mc-lab",text:S.label}));
    n.style.setProperty("--c",S.c); root.append(n); return n;
  });
  const panel=el("div",{class:"mc-p"}); root.append(panel);
  function renderPanel(s){
    panel.replaceChildren(); panel.style.removeProperty("--c");
    const d=k=>({style:{animationDelay:(k*0.15)+"s"}});
    if(s===0){
      panel.append(el("h2",Object.assign({class:"mc-in",html:"Sigue unos <b>pasos</b>…"},d(0))),
        el("p",Object.assign({class:"mc-say mc-in",html:"¡como con la <b>espuma</b>!"},d(1))));
    }else if(s<=5){
      const S=STEPS[s-1]; panel.style.setProperty("--c",S.c);
      panel.append(el("h2",Object.assign({class:"mc-in",text:S.name},d(0))));
      if(S.word) panel.append(el("div",Object.assign({class:"mc-word mc-in"},d(1)),el("small",{text:"Se llama"}),el("span",{text:S.word})));
      panel.append(el("p",Object.assign({class:"mc-say mc-in",html:S.say},d(2))));
      if(S.say2) panel.append(el("p",Object.assign({class:"mc-say mc-in",text:S.say2},d(3))));
    }else{
      panel.append(el("h2",Object.assign({class:"mc-in",html:"¡Es el <b>método científico</b>!"},d(0))),
        el("p",Object.assign({class:"mc-say mc-in",html:"Y al final…<br>¡una <b>pregunta nueva</b>!"},d(1))));
    }
  }
  let step=0;
  function chase(){ // al cerrar el círculo, los pasos «laten» uno tras otro, en bucle
    if(red) return;
    nodes.forEach((n,i)=>tm.set(()=>{ n.classList.remove("pulse"); void n.offsetWidth; n.classList.add("pulse"); },i*380));
    tm.set(chase,5*380+900);
  }
  function apply(s,dir){
    step=s; tm.clear();
    nodes.forEach((n,i)=>{ n.classList.toggle("on",i<s||s===6); n.classList.toggle("cur",s<=5&&i===s-1); n.classList.remove("pulse"); });
    arcEls.forEach((a,i)=>a.classList.toggle("on",(i<s-1)||s===6));
    root.classList.toggle("foam",s>=4);
    renderPanel(s);
    if(s===6){ if(dir>0&&!red) APP.audio.win(); tm.set(chase,red?0:900); }
  }
  apply(0,1);
  root.addEventListener("click",()=>APP.next());
  return {
    next(){ if(step<6){ apply(step+1,1); return true; } return false; },
    prev(){ if(step>0){ apply(step-1,-1); return true; } return false; },
    destroy(){ tm.clear(); }
  };
}});

/* =====================================================================================
   25 · NO-SOLO: frasco que se abre y del que salen los ámbitos
   ===================================================================================== */
SC.push({id:"no-solo",title:"La ciencia es mucho más",order:25,mount(box,APP){
  const {el}=APP, red=APP.reduced(), tm=timers();
  box.append(styleEl(APP,`
  .ns{position:absolute;inset:0;background:radial-gradient(circle at 50% 62%,#FFF7E8 0,#F8E8CC 60%,#EED7B0 100%);overflow:hidden;cursor:pointer}
  .ns-rays{position:absolute;left:-240px;top:-560px;width:2400px;height:2400px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(247,147,30,.13) 0 9deg,transparent 9deg 18deg);opacity:0;transition:opacity 1s;animation:nsSpin 80s linear infinite}
  .ns.open .ns-rays{opacity:1}
  @keyframes nsSpin{to{transform:rotate(360deg)}}
  .ns-l1{position:absolute;left:0;right:0;top:60px;text-align:center;font-family:var(--display);font-weight:600;font-size:96px;color:var(--ink);margin:0}
  .ns-l2{position:absolute;left:0;right:0;top:180px;text-align:center;font-family:var(--display);font-weight:700;font-size:118px;color:var(--orange);margin:0;opacity:0;transform:scale(.5);transition:opacity .5s,transform .6s cubic-bezier(.3,1.7,.5,1);text-shadow:0 5px 0 rgba(90,74,48,.12)}
  .ns.open .ns-l2{opacity:1;transform:none;transition-delay:.9s}
  .ns-flask{position:absolute;left:730px;top:560px;width:460px;height:500px;transform-origin:50% 100%}
  .ns-flask svg{width:100%;height:100%;overflow:visible;display:block}
  .ns-flask .ns-cork{transform-box:fill-box;transform-origin:50% 100%;animation:nsWiggle 1.4s ease-in-out infinite}
  .ns.open .ns-cork{animation:none;opacity:0}
  @keyframes nsWiggle{0%,60%,100%{transform:none}70%{transform:rotate(-7deg) translateY(-4px)}85%{transform:rotate(6deg) translateY(-3px)}}
  .ns-bub{animation:nsRise 2.4s ease-in infinite;transform-box:fill-box}
  @keyframes nsRise{0%{transform:translateY(0);opacity:0}15%{opacity:.9}100%{transform:translateY(-150px);opacity:0}}
  .ns-ic{position:absolute;width:210px;margin-left:-105px;margin-top:-90px;text-align:center;opacity:0;pointer-events:none}
  .ns-ic svg{width:180px;height:180px;display:block;margin:0 auto}
  .ns-ic span{display:inline-block;font-family:var(--display);font-weight:600;font-size:44px;color:var(--ink);background:#FFFDF7;border-radius:999px;padding:4px 22px;box-shadow:0 5px 0 rgba(90,74,48,.12)}
  .ns-ic.on{opacity:1}
  .ns-ic.float svg{animation:nsFloat 3s ease-in-out infinite}
  @keyframes nsFloat{50%{transform:translateY(-16px) rotate(4deg)}}
  .ns-flyc{position:absolute;left:880px;top:520px;width:160px;height:110px;opacity:0}
  @media (prefers-reduced-motion:reduce){.ns *{animation:none!important}}
  `));
  const root=el("div",{class:"ns"}); box.append(root);
  const bubbles=[[150,420,10,0],[200,440,14,.6],[260,430,9,1.1],[300,445,12,1.7],[230,455,8,.3],[180,400,7,1.4]]
    .map(([x,y,r,d])=>`<circle class="ns-bub" cx="${x}" cy="${y}" r="${r}" fill="#FFFDF7" style="animation-delay:${d}s"/>`).join("");
  const flask=el("div",{class:"ns-flask",html:paper("0 0 460 500",`
    <path d="M180 60 L180 175 L60 440 Q48 482 98 482 L362 482 Q412 482 400 440 L280 175 L280 60 Z" fill="#E3F4FB" %F%/>
    <path d="M122 310 Q176 292 230 310 T338 310 L392 438 Q400 470 360 470 L100 470 Q60 470 68 438 Z" fill="#7AC143"/>
    <path d="M122 310 Q176 292 230 310 T338 310 L346 330 Q290 318 230 330 Q170 342 114 330Z" fill="#A6D97A"/>
    ${bubbles}
    <path d="M205 90 L205 180 L110 400" stroke="#FFFFFF" stroke-width="14" fill="none" stroke-linecap="round" opacity=".8"/>
    <rect x="166" y="46" width="128" height="24" rx="10" fill="#CDE9F5" %F%/>
    <g class="ns-cork"><path d="M172 4 L288 4 L280 56 L180 56 Z" fill="#B98A62" %F%/><circle cx="208" cy="24" r="5" fill="#8C6A4A"/><circle cx="250" cy="34" r="4" fill="#8C6A4A"/></g>`,"",2)});
  const fly=el("div",{class:"ns-flyc",html:paper("0 0 160 110",`<path d="M28 4 L132 4 L124 56 L36 56 Z" fill="#B98A62" %F%/>`)});
  root.append(el("div",{class:"ns-rays"}),el("h1",{class:"ns-l1",text:"Esto es un experimento…"}),el("h2",{class:"ns-l2",text:"¡pero la ciencia es mucho más!"}),flask,fly);
  const items=[["nature","Naturaleza",300,740],["space","Espacio",480,470],["chem","Química",760,400],["hist","Historia",1160,400],["med","Medicina",1440,470],["ia","Ordenadores",1620,740]];
  const icons=items.map(([k,t,x,y])=>{ const n=el("div",{class:"ns-ic",style:{left:x+"px",top:y+"px"},html:paper("0 0 100 100",ICON[k],"",1.3)}); n.append(el("span",{text:t})); root.append(n); return n; });
  let open=false;
  function close(){ open=false; tm.clear(); root.classList.remove("open"); icons.forEach(n=>{ n.getAnimations().forEach(a=>a.cancel()); n.classList.remove("on","float"); }); fly.getAnimations().forEach(a=>a.cancel()); }
  function doOpen(){
    open=true; root.classList.add("open");
    if(red){ icons.forEach(n=>n.classList.add("on","float")); return; }
    APP.audio.boing();
    flask.animate([{transform:"none"},{transform:"scale(1.06,.94)"},{transform:"scale(.96,1.05)"},{transform:"none"}],{duration:500});
    fly.animate([{opacity:1,transform:"none"},{opacity:1,transform:"translate(260px,-480px) rotate(540deg)"},{opacity:0,transform:"translate(420px,-300px) rotate(720deg)"}],{duration:1200,easing:"cubic-bezier(.2,.8,.4,1)",fill:"forwards"});
    icons.forEach((n,i)=>tm.set(()=>{
      const [, , x,y]=items[i], dx=960-x, dy=600-y;
      n.classList.add("on");
      n.animate([{transform:`translate(${dx}px,${dy}px) scale(.15)`,opacity:0},{transform:`translate(${dx*0.45}px,${dy*0.45-200}px) scale(1.15)`,opacity:1,offset:.55},{transform:"none",opacity:1}],{duration:900,easing:"cubic-bezier(.25,.8,.35,1)"});
      tm.set(()=>n.classList.add("float"),900);
    },250+i*160));
  }
  root.addEventListener("click",()=>APP.next());
  return {
    next(){ if(!open){ doOpen(); return true; } return false; },
    prev(){ if(open){ close(); return true; } return false; },
    destroy(){ tm.clear(); }
  };
}});

/* =====================================================================================
   30 · ÁMBITOS: 6 tarjetas en papel recortado (las dos últimas: medicina y ordenadores/IA)
   ===================================================================================== */
function iaNet(){
  const L=[[100,[62,92,122]],[150,[55,80,105,130]],[200,[75,110]]];
  let lines="",nodes="",k=0;
  for(let a=0;a<2;a++) for(const y1 of L[a][1]) for(const y2 of L[a+1][1]) lines+=`M${L[a][0]} ${y1} L${L[a+1][0]} ${y2} `;
  L.forEach(([x,ys])=>ys.forEach(y=>{ nodes+=`<circle class="am-blink" style="animation-delay:${(k++)*0.23}s" cx="${x}" cy="${y}" r="9" fill="${["#F2C230","#7AC143","#F7931E","#29ABE2"][k%4]}"/>`; }));
  return `<path d="${lines}" fill="none" stroke="#5EC0EA" stroke-width="2.5" opacity=".6"/>${nodes}`;
}
const AMB=[
  {k:"nature",short:"Naturaleza",name:"La naturaleza",phr:"Animales y plantas",ex:"Cada año descubren animales nuevos",col:"#5BA332",bg:"#E9F5DC",
   ill:`<circle class="am-pulse" cx="252" cy="44" r="24" fill="#F2C230" %F%/>
        <path d="M0 162 Q70 112 150 152 T300 140 V200 H0Z" fill="#7AC143" %F%/>
        <rect x="70" y="92" width="16" height="66" rx="5" fill="#8C6A4A" %F%/><circle cx="78" cy="78" r="34" fill="#5BA332" %F%/><circle cx="54" cy="98" r="22" fill="#6CB33A" %F%/><circle cx="104" cy="98" r="24" fill="#6CB33A" %F%/>
        <path d="M210 168 V128" stroke="#4E8F2A" stroke-width="5" stroke-linecap="round"/>${[0,72,144,216,288].map(a=>`<circle cx="${210+12*Math.cos(a*Math.PI/180)}" cy="${120+12*Math.sin(a*Math.PI/180)}" r="10" fill="#E59AAE"/>`).join("")}<circle cx="210" cy="120" r="7" fill="#F2C230"/>
        <g class="am-bob"><g transform="translate(165 66)"><g class="am-wing"><ellipse cx="-12" cy="-6" rx="14" ry="11" fill="#29ABE2" %F%/><ellipse cx="12" cy="-6" rx="14" ry="11" fill="#29ABE2" %F%/><ellipse cx="-9" cy="9" rx="9" ry="8" fill="#F7931E"/><ellipse cx="9" cy="9" rx="9" ry="8" fill="#F7931E"/></g><rect x="-3" y="-14" width="6" height="30" rx="3" fill="#1F2A44"/></g></g>`},
  {k:"space",short:"Espacio",name:"El espacio",phr:"Planetas y cohetes",ex:"Un robot fue a Marte",col:"#2453C7",bg:"#1F2A6E",
   ill:`${[[30,30],[70,170],[150,25],[270,160],[190,180],[120,60],[285,30],[40,110]].map(([x,y],i)=>`<circle class="am-tw" style="animation-delay:${i*0.3}s" cx="${x}" cy="${y}" r="${i%3?3:4.5}" fill="#FFFDF7"/>`).join("")}
        <circle cx="222" cy="78" r="40" fill="#F7931E" %F%/><circle cx="208" cy="66" r="8" fill="#E07E10"/><circle cx="234" cy="94" r="6" fill="#E07E10"/>
        <ellipse cx="222" cy="78" rx="66" ry="14" fill="none" stroke="#F2C230" stroke-width="8" transform="rotate(-18 222 78)"/>
        <g class="am-fly"><g transform="translate(92 120) rotate(40)"><path class="am-flame" d="M-13 40 Q0 84 13 40 Z" fill="#F7931E"/><path d="M-20 40 L-20 -8 Q0 -60 20 -8 L20 40 Z" fill="#FFFDF7" %F%/><circle cx="0" cy="-4" r="9" fill="#29ABE2"/><path d="M-20 14 L-36 46 L-20 40Z" fill="#E04B3A"/><path d="M20 14 L36 46 L20 40Z" fill="#E04B3A"/></g></g>`},
  {k:"chem",short:"Química",name:"La química",phr:"Mezclas y colores",ex:"Inventaron los colores de tus rotuladores",col:"#9B6BD3",bg:"#F3E8FB",
   ill:`<path d="M110 26 H152 V74 L194 160 Q200 178 182 178 H80 Q62 178 68 160 L110 74 Z" fill="#E3F4FB" %F%/>
        <path class="am-hue" d="M90 118 H172 L190 160 Q194 172 182 172 H80 Q68 172 72 160 Z" fill="#9B6BD3"/>
        ${[[118,150,6,0],[136,160,8,.7],[154,148,5,1.3],[130,140,4,1.9]].map(([x,y,r,d])=>`<circle class="am-rise" style="animation-delay:${d}s" cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join("")}
        <rect x="104" y="20" width="54" height="12" rx="6" fill="#CDE9F5"/>
        <g transform="rotate(14 240 110)"><rect x="222" y="40" width="34" height="124" rx="17" fill="#E3F4FB" %F%/><rect class="am-hue2" x="225" y="96" width="28" height="64" rx="14" fill="#7AC143"/></g>
        <g transform="rotate(-12 44 120)"><rect x="28" y="60" width="32" height="110" rx="16" fill="#E3F4FB" %F%/><rect class="am-hue3" x="31" y="110" width="26" height="56" rx="13" fill="#F7931E"/></g>`},
  {k:"hist",short:"Historia",name:"Historia y sociedad",phr:"Cómo vivía la gente",ex:"Arqueólogos descubren cómo vivía la gente hace mucho tiempo",col:"#B0602A",bg:"#FBEFD9",
   ill:`<path d="M176 122 L232 50 L288 122Z" fill="#E8C27A" %F%/><path d="M232 50 L288 122 L232 122Z" fill="#D3A55A"/>
        <circle class="am-pulse" cx="60" cy="40" r="22" fill="#F2C230" %F%/>
        <path d="M0 120 H300 V200 H0Z" fill="#D2AE7E" %F%/><path d="M0 150 Q80 142 150 152 T300 148 V200 H0Z" fill="#B88D5A"/><path d="M0 178 Q90 170 170 180 T300 176 V200 H0Z" fill="#9C7446"/>
        <g transform="rotate(-18 112 148)"><rect x="101" y="92" width="22" height="10" rx="4" fill="#9E4E1E"/><path d="M104 100 H120 V110 Q144 122 142 148 Q140 176 112 186 Q84 176 82 148 Q80 122 104 110Z" fill="#D9783A" %F%/><path d="M104 112 Q86 112 88 132 M120 112 Q138 112 136 132" stroke="#9E4E1E" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M85 146 H139" stroke="#F2C230" stroke-width="6"/><path d="M88 158 H136" stroke="#9E4E1E" stroke-width="3"/></g>
        <g transform="translate(222 168) rotate(12)"><rect x="-26" y="-5" width="52" height="10" rx="5" fill="#FFFDF7" %F%/><circle cx="-27" cy="-6" r="7" fill="#FFFDF7"/><circle cx="-27" cy="6" r="7" fill="#FFFDF7"/><circle cx="27" cy="-6" r="7" fill="#FFFDF7"/><circle cx="27" cy="6" r="7" fill="#FFFDF7"/></g>
        <g class="am-brush"><g transform="rotate(35 170 96)"><rect x="164" y="40" width="12" height="62" rx="6" fill="#8C6A4A" %F%/><rect x="160" y="98" width="20" height="12" rx="3" fill="#6D6E71"/><path d="M160 108 H180 L184 128 H156Z" fill="#F2C230"/></g></g>
        ${[[150,120,4,0],[160,112,3,.5],[142,116,3,1]].map(([x,y,r,d])=>`<circle class="am-rise" style="animation-delay:${d}s" cx="${x}" cy="${y}" r="${r}" fill="#E8D3B0"/>`).join("")}`},
  {k:"med",short:"Medicina",name:"Medicina y biomedicina",phr:"Curar a las personas",ex:"Hicieron vacunas para que no enfermemos",col:"#E04B3A",bg:"#FDE6EA",
   ill:`<g class="am-pulse"><circle cx="95" cy="112" r="64" fill="#F6B8C4" %F%/><circle cx="104" cy="104" r="25" fill="#B5487A"/><circle cx="68" cy="140" r="7" fill="#E88AA0"/><circle cx="124" cy="144" r="5" fill="#E88AA0"/><circle cx="60" cy="96" r="5" fill="#E88AA0"/></g>
        <g class="am-bob"><g transform="rotate(-35 215 125)"><rect x="170" y="103" width="90" height="44" rx="22" fill="#FFFDF7" %F%/><path d="M215 103 H192 A22 22 0 0 0 192 147 H215 Z" fill="#F7931E"/></g></g>
        <g class="am-bob2"><circle cx="248" cy="46" r="28" fill="#E04B3A" %F%/><rect x="242" y="30" width="12" height="32" rx="3" fill="#fff"/><rect x="232" y="40" width="32" height="12" rx="3" fill="#fff"/></g>`},
  {k:"ia",short:"Ordenadores e IA",name:"Ordenadores e inteligencia artificial",phr:"Máquinas que aprenden",ex:"Un ordenador aprende a reconocer gatos",col:"#29ABE2",bg:"#E3F3FB",
   ill:`<rect x="52" y="24" width="196" height="134" rx="16" fill="#2A3550" %F%/><rect x="66" y="38" width="168" height="106" rx="8" fill="#16203A"/>${iaNet()}
        <rect x="135" y="158" width="30" height="16" fill="#6D6E71"/><rect x="98" y="172" width="104" height="14" rx="7" fill="#6D6E71" %F%/>`}
];
window.CIENCIA_ART={paper,AMB}; // lo usa portada.js («Mi ciencia mezcla…»)

SC.push({id:"ambitos",title:"¿Qué hace la ciencia?",order:30,mount(box,APP){
  const {el}=APP, red=APP.reduced(), tm=timers();
  box.append(styleEl(APP,`
  .am{position:absolute;inset:0;background:radial-gradient(circle at 50% 40%,#FFF8EA 0,#F6EAD3 65%,#EEDDBF 100%);overflow:hidden}
  .am-title{position:absolute;left:0;right:0;top:34px;text-align:center;font-family:var(--display);font-weight:600;font-size:104px;line-height:1.1;color:var(--ink);margin:0;transition:color .4s}
  .am-title b{color:var(--orange);font-weight:700}
  .am-dim{position:absolute;inset:0;background:rgba(40,30,20,.45);opacity:0;pointer-events:none;transition:opacity .5s;z-index:5}
  .am-dim.on{opacity:1;pointer-events:auto;cursor:pointer}
  .am-card{position:absolute;width:580px;height:420px;border-radius:36px;cursor:pointer;z-index:2;
    transition:left .65s cubic-bezier(.5,0,.2,1),top .65s cubic-bezier(.5,0,.2,1),width .65s cubic-bezier(.5,0,.2,1),height .65s cubic-bezier(.5,0,.2,1),box-shadow .3s;
    box-shadow:0 7px 0 rgba(90,74,48,.14),0 16px 30px rgba(90,74,48,.2)}
  .am-card.focus{z-index:6;cursor:zoom-out;box-shadow:0 12px 0 rgba(90,74,48,.18),0 30px 60px rgba(0,0,0,.35)}
  .am-card.wig{animation:amWig .6s ease}
  @keyframes amWig{30%{transform:rotate(-2.5deg) scale(1.03)}65%{transform:rotate(2deg)}}
  .am-back{position:absolute;inset:0;border-radius:36px;display:flex;align-items:center;justify-content:center;overflow:hidden}
  .am-back::before{content:"";position:absolute;inset:18px;border-radius:26px;border:6px dashed rgba(255,255,255,.55)}
  .am-back b{font-family:var(--display);font-weight:700;font-size:230px;color:#FFFDF7;text-shadow:0 8px 0 rgba(0,0,0,.12);animation:amQ 2.4s ease-in-out infinite}
  @keyframes amQ{50%{transform:rotate(-8deg) scale(1.06)}}
  .am-front{position:absolute;inset:0;border-radius:36px;background:#FFFDF7;display:none;flex-direction:column;align-items:center;padding:20px 22px 18px;overflow:hidden}
  .am-card.rev .am-back{display:none}
  .am-card.rev .am-front{display:flex}
  .am-ill{width:100%;height:240px;border-radius:24px;flex:none;display:flex;align-items:center;justify-content:center}
  .am-ill svg{height:100%;width:auto;max-width:100%;overflow:visible}
  .am-name{font-family:var(--display);font-weight:700;font-size:54px;line-height:1.08;margin:14px 0 2px;text-align:center}
  .am-name .l{display:none}
  .am-phr{font-family:var(--body);font-weight:800;font-size:40px;color:var(--inkSoft);text-align:center;line-height:1.15}
  .am-ex{display:none}
  .am-card.focus .am-front{flex-direction:row;align-items:center;padding:44px;gap:50px}
  .am-card.focus .am-ill{width:760px;height:100%;flex:none}
  .am-card.focus .am-txt{flex:1;display:flex;flex-direction:column;align-items:flex-start;gap:26px}
  .am-card.focus .am-name{font-size:88px;text-align:left;margin:0}
  .am-card.focus .am-name .s{display:none}
  .am-card.focus .am-name .l{display:inline}
  .am-card.focus .am-phr{font-size:58px;text-align:left}
  .am-card.focus .am-ex{display:block;position:relative;font-family:var(--display);font-weight:500;font-size:56px;line-height:1.15;color:var(--ink);background:#FFF1DC;border-radius:34px;padding:26px 34px}
  .am-txt{display:flex;flex-direction:column;align-items:center}
  .am-pulse{transform-box:fill-box;transform-origin:center;animation:amPulse 2.2s ease-in-out infinite}
  @keyframes amPulse{50%{transform:scale(1.07)}}
  .am-bob{animation:amBob 2.6s ease-in-out infinite}
  .am-bob2{animation:amBob 3.2s ease-in-out infinite reverse}
  @keyframes amBob{50%{transform:translateY(-10px)}}
  .am-blink{animation:amBlink 1.6s ease-in-out infinite}
  @keyframes amBlink{50%{opacity:.25}}
  .am-tw{transform-box:fill-box;transform-origin:center;animation:amTw 1.8s ease-in-out infinite}
  @keyframes amTw{50%{transform:scale(.3);opacity:.4}}
  .am-fly{animation:amFly 3s ease-in-out infinite}
  @keyframes amFly{50%{transform:translate(10px,-14px)}}
  .am-flame{transform-box:fill-box;transform-origin:50% 0;animation:amFlame .25s ease-in-out infinite alternate}
  @keyframes amFlame{to{transform:scaleY(.6)}}
  .am-wing{transform-box:fill-box;transform-origin:center;animation:amWing .35s ease-in-out infinite alternate}
  @keyframes amWing{to{transform:scaleX(.3)}}
  .am-hue{animation:amHue 5s linear infinite}.am-hue2{animation:amHue 5s linear infinite -1.7s}.am-hue3{animation:amHue 5s linear infinite -3.3s}
  @keyframes amHue{0%,100%{fill:#9B6BD3}33%{fill:#29ABE2}66%{fill:#E04B3A}}
  .am-rise{transform-box:fill-box;animation:amRise 2.4s ease-in infinite}
  @keyframes amRise{0%{transform:translateY(0);opacity:0}20%{opacity:.9}100%{transform:translateY(-140px);opacity:0}}
  .am-spin{transform-box:fill-box;transform-origin:center;animation:amSpin 6s linear infinite}
  .am-spin-r{transform-box:fill-box;transform-origin:center;animation:amSpin 4s linear infinite reverse}
  @keyframes amSpin{to{transform:rotate(360deg)}}
  .am-brush{transform-box:fill-box;transform-origin:50% 0%;animation:amBrush .5s ease-in-out infinite alternate}
  @keyframes amBrush{from{transform:translateX(-6px) rotate(-6deg)}to{transform:translateX(8px) rotate(8deg)}}
  @media (prefers-reduced-motion:reduce){.am *{animation:none!important;transition:none!important}}
  `));
  const root=el("div",{class:"am"}); box.append(root);
  const title=el("h1",{class:"am-title",html:"¿Qué hace <b>la ciencia</b>?"});
  const dim=el("div",{class:"am-dim"});
  root.append(title,dim);
  const W=580,H=420,GX=40,X0=50,Y0=192,GY=26;
  const slot=i=>({left:X0+(i%3)*(W+GX),top:Y0+Math.floor(i/3)*(H+GY),width:W,height:H});
  const FOC={left:150,top:150,width:1620,height:860};
  const cards=AMB.map((a,i)=>{
    const front=el("div",{class:"am-front"},
      el("div",{class:"am-ill",style:{background:a.bg},html:paper("0 0 300 200",a.ill,'preserveAspectRatio="xMidYMid meet"')}),
      el("div",{class:"am-txt"},
        el("div",{class:"am-name",style:{color:a.col}},el("span",{class:"s",text:a.short}),el("span",{class:"l",text:a.name})),
        el("div",{class:"am-phr",text:a.phr}),
        el("div",{class:"am-ex",text:a.ex})));
    const back=el("div",{class:"am-back",style:{background:a.k==="space"?"#2453C7":a.col}},el("b",{text:"?"}));
    const c=el("div",{class:"am-card",role:"button","aria-label":a.name},back,front);
    c.addEventListener("click",ev=>{ ev.stopPropagation(); onCard(i); });
    root.append(c); return c;
  });
  // estado: rev[i], focus (índice o -1), fin
  let st={rev:AMB.map(()=>0),focus:-1,fin:false};
  const hist=[];
  function place(i,s,instant){
    const c=cards[i], r=(s.focus===i)?FOC:slot(i);
    if(instant){ c.style.transition="none"; }
    Object.assign(c.style,{left:r.left+"px",top:r.top+"px",width:r.width+"px",height:r.height+"px"});
    if(instant){ void c.offsetWidth; c.style.transition=""; }
  }
  function apply(s,animate){
    const old=st; st=s;
    cards.forEach((c,i)=>{
      const wasRev=!!old.rev[i], isRev=!!s.rev[i];
      const focChange=(old.focus===i)!==(s.focus===i);
      if(isRev&&!wasRev&&animate&&!red){
        c.animate([{transform:"rotateY(0)"},{transform:"rotateY(90deg)"}],{duration:180,easing:"ease-in"});
        tm.set(()=>{ c.classList.add("rev"); c.animate([{transform:"rotateY(-90deg)"},{transform:"rotateY(0)"}],{duration:260,easing:"ease-out"}); },180);
      }else c.classList.toggle("rev",isRev);
      c.classList.toggle("focus",s.focus===i);
      if(focChange&&animate&&!red){
        const fr=c.querySelector(".am-front");
        fr.animate([{opacity:0},{opacity:0,offset:.35},{opacity:1}],{duration:700});
      }
      place(i,s,!animate||red);
    });
    dim.classList.toggle("on",s.focus>=0);
    title.innerHTML=s.fin?"¡La ciencia está <b>en todas partes</b>!":"¿Qué hace <b>la ciencia</b>?";
    if(s.fin&&!old.fin&&animate){ APP.audio.win(); cards.forEach((c,i)=>tm.set(()=>{ c.classList.remove("wig"); void c.offsetWidth; c.classList.add("wig"); },i*120)); }
  }
  function change(s){ hist.push(st); apply(s,true); }
  const clone=s=>({rev:s.rev.slice(),focus:s.focus,fin:s.fin});
  function onCard(i){
    const s=clone(st);
    if(s.focus===i){ s.focus=-1; if(s.rev.every(Boolean)) s.fin=true; change(s); return; }
    if(!s.rev[i]) s.rev[i]=1;
    s.focus=i; change(s);
  }
  dim.addEventListener("click",()=>{ if(st.focus>=0){ const s=clone(st); s.focus=-1; if(s.rev.every(Boolean)) s.fin=true; change(s); } });
  apply(st,false);
  return {
    next(){
      const s=clone(st);
      const nxt=s.rev.indexOf(0);
      if(nxt>=0){ s.rev[nxt]=1; s.focus=nxt; change(s); return true; }
      if(s.focus>=0||!s.fin){ s.focus=-1; s.fin=true; change(s); return true; }
      return false;
    },
    prev(){ if(hist.length){ apply(hist.pop(),true); return true; } return false; },
    destroy(){ tm.clear(); }
  };
}});

/* =====================================================================================
   40 · MI TRABAJO: niño → piel → célula → ADN (como el modelo) → 4 letras → «yo estudio estas letras» → + IA
   ===================================================================================== */
SC.push({id:"mi-trabajo",title:"Lo que yo hago",order:40,mount(box,APP){
  const {el}=APP, red=APP.reduced(), tm=timers(), lvTm=timers();
  box.append(styleEl(APP,`
  .mt{position:absolute;inset:0;background:#FFF3E0;overflow:hidden;cursor:pointer}
  .mt-L{position:absolute;inset:0;display:none;overflow:hidden}
  .mt-L>svg{position:absolute;inset:0;width:1920px;height:1080px;display:block}
  .mt-ban{position:absolute;left:50%;top:34px;transform:translateX(-50%);z-index:20;background:#FFFDF7;border-radius:44px;padding:18px 54px;box-shadow:0 7px 0 rgba(90,74,48,.14),0 16px 30px rgba(90,74,48,.2);font-family:var(--display);font-weight:600;font-size:84px;line-height:1.08;color:var(--ink);white-space:nowrap;text-align:center;display:flex;align-items:center;gap:26px}
  .mt-ban b{color:var(--orange);font-weight:700}
  .mt-ban.two{font-size:66px;white-space:normal;width:1500px;justify-content:center}
  .mt-ban svg{width:110px;height:110px;flex:none}
  .mt-zoom{position:absolute;right:40px;bottom:36px;z-index:20;display:flex;align-items:center;gap:14px;background:#1F2A44;color:#FFFDF7;border-radius:999px;padding:10px 30px 10px 14px;font-family:var(--display);font-weight:600;font-size:48px;box-shadow:0 6px 0 rgba(0,0,0,.15);transition:opacity .4s}
  .mt-zoom svg{width:64px;height:64px}
  .mt-flash{position:absolute;inset:0;z-index:15;pointer-events:none;opacity:0;background:radial-gradient(circle at var(--fx) var(--fy),rgba(255,255,255,.95) 0,rgba(255,255,255,.4) 25%,transparent 60%)}
  .mt-wave{transform-box:view-box;transform-origin:1055px 575px;animation:mtWave 1.1s ease-in-out infinite alternate}
  @keyframes mtWave{from{transform:rotate(-8deg)}to{transform:rotate(14deg)}}
  .mt-lens{transform-box:fill-box;transform-origin:30% 30%;animation:mtLens 1.6s ease-in-out infinite}
  @keyframes mtLens{50%{transform:scale(1.1) rotate(-6deg)}}
  .mt-blink{transform-box:fill-box;transform-origin:center;animation:mtBlink 4s infinite}
  @keyframes mtBlink{0%,92%,100%{transform:none}95%{transform:scaleY(.1)}}
  .mt-cell{transform-box:fill-box;transform-origin:center;animation:mtCell 3s ease-in-out infinite}
  @keyframes mtCell{50%{transform:scale(.95)}}
  .mt-ring{transform-box:fill-box;transform-origin:center;animation:mtSpin 10s linear infinite}
  @keyframes mtSpin{to{transform:rotate(360deg)}}
  .mt-breathe{transform-box:fill-box;transform-origin:center;animation:mtBreathe 4s ease-in-out infinite}
  @keyframes mtBreathe{50%{transform:scale(1.025,.985)}}
  .mt-drift{transform-box:fill-box;transform-origin:center;animation:mtDrift 5s ease-in-out infinite}
  @keyframes mtDrift{33%{transform:translate(14px,-10px) rotate(8deg)}66%{transform:translate(-10px,8px) rotate(-6deg)}}
  .mt-tile{position:absolute;width:104px;height:104px;border-radius:22px;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:700;font-size:72px;color:#fff;box-shadow:0 5px 0 rgba(0,0,0,.14),0 9px 18px rgba(90,74,48,.25);text-shadow:0 3px 0 rgba(0,0,0,.15)}
  .mt-bond{position:absolute;width:12px;height:30px;border-radius:6px;background:#B9A6D6}
  .mt-leg{position:absolute;top:840px;display:flex;gap:34px;left:50%;transform:translateX(-50%)}
  .mt-leg .mt-tile{position:relative;width:150px;height:150px;font-size:110px;border-radius:30px}
  .mt-strip{position:absolute;left:0;top:470px;width:4720px;height:250px;animation:mtScroll 22s linear infinite}
  @keyframes mtScroll{to{transform:translateX(-2360px)}}
  .mt-strip .mt-bond{background:#C9BCD9}
  .mt-mag{position:absolute;left:700px;top:335px;width:520px;height:520px;border-radius:50%;overflow:hidden;z-index:3;background:#FBF8FF;box-shadow:0 0 0 26px #1F2A44,0 18px 0 22px rgba(0,0,0,.12),0 30px 60px rgba(31,42,68,.35)}
  .mt-mag>div{position:absolute;left:-700px;top:-335px;width:1920px;height:1080px;transform-origin:960px 595px;transform:scale(1.5)}
  .mt-mag::after{content:"";position:absolute;left:70px;top:60px;width:150px;height:80px;border-radius:50%;background:rgba(255,255,255,.55);transform:rotate(-30deg)}
  .mt-handle{position:absolute;left:1120px;top:790px;width:90px;height:300px;border-radius:45px;background:#8C6A4A;transform:rotate(-40deg);transform-origin:50% 0;z-index:2;box-shadow:0 8px 0 rgba(0,0,0,.12)}
  .mt-screen{position:absolute;left:175px;top:315px;width:890px;height:540px;border-radius:14px}
  .mt-nn circle{transition:fill .2s}
  .mt-nn.hot circle{fill:#F2C230}
  .mt-eyes{animation:mtEyes 3s ease-in-out infinite}
  @keyframes mtEyes{0%,100%{transform:translateX(-10px)}50%{transform:translateX(6px)}}
  .mt-bulb{animation:mtBulb 1s steps(2) infinite}
  @keyframes mtBulb{50%{fill:#E04B3A}}
  .mt-count{position:absolute;left:50%;top:196px;transform:translateX(-50%);display:flex;align-items:center;gap:22px;white-space:nowrap}
  .mt-count .mt-tile{position:relative;width:76px;height:76px;font-size:52px;border-radius:18px}
  .mt-num{font-family:var(--display);font-weight:700;font-size:132px;line-height:1;color:var(--ink);font-variant-numeric:tabular-nums;margin-left:14px;min-width:880px;text-align:right}
  .mt-unit{font-family:var(--display);font-weight:600;font-size:64px;color:#6B4BA0}
  .mt-case{position:absolute;top:378px;width:500px;height:540px;box-sizing:border-box;border-radius:18px;background:#A9774E;padding:18px 18px 0;box-shadow:0 8px 0 rgba(90,74,48,.18),0 18px 34px rgba(90,74,48,.25)}
  .mt-shelf{position:relative;height:113px;margin-bottom:16px;background:#7A5236;border-radius:8px;display:flex;align-items:flex-end;gap:3px;padding:0 6px;overflow:hidden;box-shadow:inset 0 -12px 0 #C8956A}
  .mt-shelf:last-child{margin-bottom:0}
  .mt-bk{flex:none;border-radius:5px 5px 2px 2px;margin-bottom:12px;box-shadow:inset -5px 0 0 rgba(0,0,0,.14);position:relative}
  .mt-bk::before{content:"";position:absolute;left:3px;right:6px;top:14px;height:7px;border-radius:3px;background:rgba(255,255,255,.75)}
  .mt-bk::after{content:"";position:absolute;left:3px;right:6px;bottom:14px;height:5px;border-radius:3px;background:rgba(255,255,255,.45)}
  .mt-pill{position:absolute;left:50%;top:944px;transform:translateX(-50%);display:flex;align-items:center;gap:26px;white-space:nowrap;background:#FFFDF7;border-radius:999px;padding:14px 22px 14px 44px;box-shadow:0 7px 0 rgba(90,74,48,.14),0 16px 30px rgba(90,74,48,.2);font-family:var(--display);font-weight:600;font-size:64px;line-height:1;color:var(--ink);opacity:0}
  .mt-pill b{color:var(--orange);font-weight:700}
  .mt-pill .mt-tag{font-size:46px;font-weight:600;color:#fff;background:#6B4BA0;border-radius:999px;padding:12px 28px}
  @media (prefers-reduced-motion:reduce){.mt *{animation:none!important}}
  `));
  const root=el("div",{class:"mt"}); box.append(root);
  const ban=el("div",{class:"mt-ban"});
  const zoomChip=el("div",{class:"mt-zoom"});
  const flash=el("div",{class:"mt-flash"});
  const lensIcon=paper("0 0 64 64",`<circle cx="26" cy="26" r="17" fill="none" stroke="#FFFDF7" stroke-width="7"/><path d="M39 39 L56 56" stroke="#F7931E" stroke-width="9" stroke-linecap="round"/>`);
  const SKIN="#F2C29E";
  const tile=(ch,x,y,extra)=>el("div",Object.assign({class:"mt-tile",text:ch,style:Object.assign({background:BASE[ch]},x!=null?{left:x+"px",top:y+"px"}:{})},extra||{}));

  /* ---------- L0: niño ---------- */
  const L0=paper("0 0 1920 1080",`
    <rect width="1920" height="1080" fill="#FFF3E0"/>
    <circle cx="960" cy="640" r="430" fill="#FCE3BE"/>
    <circle cx="300" cy="300" r="60" fill="#F2C230" opacity=".5"/><circle cx="1650" cy="820" r="80" fill="#7AC143" opacity=".35"/><circle cx="1600" cy="260" r="40" fill="#29ABE2" opacity=".4"/>
    <ellipse cx="960" cy="1000" rx="260" ry="28" fill="#E6CDA6"/>
    <rect x="893" y="780" width="64" height="200" rx="24" fill="#2453C7" %F%/><rect x="963" y="780" width="64" height="200" rx="24" fill="#2453C7" %F%/>
    <ellipse cx="915" cy="985" rx="56" ry="26" fill="#E04B3A" %F%/><ellipse cx="1005" cy="985" rx="56" ry="26" fill="#E04B3A" %F%/>
    <path d="M865 575 L790 720" stroke="${SKIN}" stroke-width="58" stroke-linecap="round" %F%/><circle cx="784" cy="736" r="38" fill="${SKIN}" %F%/>
    <g class="mt-wave"><path d="M1055 575 L1150 440" stroke="${SKIN}" stroke-width="58" stroke-linecap="round" %F%/><circle cx="1158" cy="424" r="38" fill="${SKIN}" %F%/></g>
    <rect x="845" y="540" width="230" height="290" rx="64" fill="#29ABE2" %F%/>
    <path d="M960 610 l14 28 31 4 -23 22 6 31 -28 -15 -28 15 6 -31 -23 -22 31 -4z" fill="#F2C230" %F%/>
    <rect x="934" y="500" width="52" height="56" rx="12" fill="#E8B48E"/>
    <circle cx="822" cy="410" r="32" fill="${SKIN}" %F%/><circle cx="1098" cy="410" r="32" fill="${SKIN}" %F%/>
    <circle cx="960" cy="400" r="142" fill="${SKIN}" %F%/>
    <path d="M818 392 Q822 250 960 244 Q1098 250 1102 392 Q1070 318 1000 326 Q960 296 900 330 Q850 340 818 392Z" fill="#5A3E2B" %F%/>
    <g class="mt-blink"><circle cx="908" cy="412" r="16" fill="#2A2A30"/><circle cx="1012" cy="412" r="16" fill="#2A2A30"/><circle cx="903" cy="406" r="5" fill="#fff"/><circle cx="1007" cy="406" r="5" fill="#fff"/></g>
    <circle cx="875" cy="458" r="22" fill="#F09AA0" opacity=".7"/><circle cx="1045" cy="458" r="22" fill="#F09AA0" opacity=".7"/>
    <path d="M915 470 Q960 512 1005 470" stroke="#7A3B2E" stroke-width="9" fill="none" stroke-linecap="round"/>
    <g class="mt-lens"><circle cx="760" cy="690" r="100" fill="rgba(255,255,255,.3)" stroke="#1F2A44" stroke-width="18" %F%/><path d="M690 760 L620 830" stroke="#8C6A4A" stroke-width="30" stroke-linecap="round" %F%/></g>`,"",3);

  /* ---------- L1: piel y células ---------- */
  let hex="";
  { const r=88,w=Math.sqrt(3)*r,h=1.5*r,cols=["#F7C3AA","#F4B59B","#F9CDB6","#F2AC92"];
    for(let row=-1;row<10;row++) for(let col=-1;col<15;col++){
      const cx=col*w+(row%2?w/2:0)+20, cy=row*h+60;
      const pts=[]; for(let k=0;k<6;k++){ const a=(-90+60*k)*Math.PI/180; pts.push((cx+(r-8)*Math.cos(a)).toFixed(1)+","+(cy+(r-8)*Math.sin(a)).toFixed(1)); }
      hex+=`<polygon points="${pts.join(" ")}" fill="${cols[(row*3+col*5+100)%4]}" stroke="${cols[(row*3+col*5+100)%4]}" stroke-width="16" stroke-linejoin="round"/><circle cx="${cx+8}" cy="${cy-4}" r="${r*0.3}" fill="#B4506A"/>`;
    } }
  const L1=paper("0 0 1920 1080",`<rect width="1920" height="1080" fill="#DE8E78"/><g %F%>${hex}</g>
    <circle class="mt-ring" cx="${7*Math.sqrt(3)*88+20+Math.sqrt(3)*44}" cy="${3*132+60}" r="96" fill="none" stroke="#FFFDF7" stroke-width="12" stroke-dasharray="30 18"/>`,"",3);
  const L1focal=[7*Math.sqrt(3)*88+20+Math.sqrt(3)*44,3*132+60];

  /* ---------- L2: una célula y su núcleo ---------- */
  let blob=""; for(let i=0;i<=72;i++){ const a=i/72*Math.PI*2, r=385+16*Math.sin(3*a)+10*Math.sin(5*a+1); blob+=(i?"L":"M")+(960+r*Math.cos(a)).toFixed(1)+" "+(615+r*0.92*Math.sin(a)).toFixed(1)+" "; }
  const mito=(x,y,rot,d)=>`<g class="mt-drift" style="animation-delay:-${d}s"><g transform="rotate(${rot} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="62" ry="28" fill="#F7931E" %F%/><path d="M${x-44} ${y} q11 -16 22 0 t22 0 t22 0 t22 0" stroke="#FFF0DB" stroke-width="6" fill="none" stroke-linecap="round"/></g></g>`;
  const L2=paper("0 0 1920 1080",`<rect width="1920" height="1080" fill="#FDEBDD"/>
    ${[[160,200],[1780,240],[220,900],[1700,880],[1500,140],[380,140]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="70" fill="#F9DCC6"/>`).join("")}
    <g class="mt-breathe"><path d="${blob}Z" fill="#FAD0BA" stroke="#F2A584" stroke-width="24" stroke-linejoin="round" %F%/>
    ${mito(720,420,-20,0)}${mito(1250,850,15,2)}${mito(700,830,30,3.5)}${mito(1290,380,-35,1.2)}
    ${[[620,620],[1340,620],[860,900],[1060,290],[800,300],[1180,940]].map(([x,y],i)=>`<circle class="mt-drift" style="animation-delay:-${i}s" cx="${x}" cy="${y}" r="${18+i%3*6}" fill="#7AC143" %F%/>`).join("")}
    ${Array.from({length:40},(_,i)=>{ const a=i*2.4, rr=230+((i*53)%140); return `<circle cx="${(1000+rr*Math.cos(a)).toFixed(0)}" cy="${(600+rr*0.85*Math.sin(a)).toFixed(0)}" r="6" fill="#B5487A" opacity=".55"/>`; }).join("")}
    <path d="M820 470 Q780 600 830 730" stroke="#E59AAE" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M1180 470 Q1225 600 1175 730" stroke="#E59AAE" stroke-width="16" fill="none" stroke-linecap="round"/>
    </g>
    <circle class="mt-ring" cx="1000" cy="600" r="198" fill="none" stroke="#F2C230" stroke-width="12" stroke-dasharray="34 20"/>
    <circle cx="1000" cy="600" r="168" fill="#8E6CC4" %F%/><circle cx="1000" cy="600" r="144" fill="#A98AD8"/>
    <path d="M920 560 q20 -30 40 0 t40 0 t40 0 M900 640 q25 -25 50 0 t50 0 t50 0 M950 700 q20 -20 40 0 t40 0" stroke="#7656B0" stroke-width="9" fill="none" stroke-linecap="round"/>
    <circle cx="1048" cy="540" r="34" fill="#6B4BA0"/>
    <path d="M1200 520 L1440 400" stroke="#1F2A44" stroke-width="8" stroke-linecap="round"/>
    <rect x="1420" y="330" width="290" height="96" rx="48" fill="#FFFDF7" %F%/><text x="1565" y="396" text-anchor="middle" style="font-family:var(--display);font-weight:600;font-size:60px" fill="#6B4BA0">núcleo</text>`,"",3);

  /* ---------- L3: ADN girando (canvas) ---------- */
  const L3bg=paper("0 0 1920 1080",`<rect width="1920" height="1080" fill="#EFE6FA"/>${[[200,300,160],[1700,250,200],[1500,900,170],[350,880,140]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#E4D6F6"/>`).join("")}`);
  const helixCv=el("canvas",{width:1920,height:1080,style:{position:"absolute",left:0,top:0}});
  const hctx=helixCv.getContext("2d");
  const HX0=110,HX1=1810,HCY=630,HA=200,HL=560,RSTEP=40;
  const rungs=[]; for(let x=HX0+10;x<HX1;x+=RSTEP){ const b=pick(["A","C","G","T"]); rungs.push({x,b,p:PAIR[b]}); }
  function drawHelix(t){
    const c=hctx; c.clearRect(0,0,1920,1080); c.lineCap="round";
    const ph=x=>x/HL*Math.PI*2+t;
    const seg=(front)=>{
      for(const s of [0,1]){
        for(let x=HX0;x<HX1;x+=6){
          const a=ph(x)+s*Math.PI, a2=ph(x+6)+s*Math.PI, z=Math.cos(a);
          if((z>=0)!==front) continue;
          const y1=HCY+HA*Math.sin(a), y2=HCY+HA*Math.sin(a2);
          c.globalAlpha=front?1:0.45;
          c.strokeStyle="rgba(90,74,48,.22)"; c.lineWidth=26; c.beginPath(); c.moveTo(x+4,y1+7); c.lineTo(x+10,y2+7); c.stroke();
          c.strokeStyle=s?"#E04B3A":"#2453C7"; c.lineWidth=26; c.beginPath(); c.moveTo(x,y1); c.lineTo(x+6,y2); c.stroke();
        }
      }
      c.globalAlpha=1;
    };
    seg(false);
    for(const r of rungs){
      const a=ph(r.x), y1=HCY+HA*Math.sin(a), y2=HCY-HA*Math.sin(a), ym=(y1+y2)/2;
      const al=0.55+0.45*Math.abs(Math.cos(a));
      c.globalAlpha=al; c.lineWidth=20; c.lineCap="butt";
      const gp=Math.sign(y2-y1)*Math.min(3,Math.abs(y2-y1)/2);
      c.strokeStyle=BASE[r.b]; c.beginPath(); c.moveTo(r.x,y1); c.lineTo(r.x,ym-gp); c.stroke();
      c.strokeStyle=BASE[r.p]; c.beginPath(); c.moveTo(r.x,ym+gp); c.lineTo(r.x,y2); c.stroke();
      c.lineCap="round";
    }
    c.globalAlpha=1;
    seg(true);
  }
  const book=paper("0 0 110 110",`<path d="M55 28 Q34 14 8 18 V88 Q34 84 55 98Z" fill="#29ABE2" %F%/><path d="M55 28 Q76 14 102 18 V88 Q76 84 55 98Z" fill="#7AC143" %F%/><path d="M18 34 H44 M18 48 H44 M18 62 H40 M66 34 H92 M66 48 H92 M66 62 H88" stroke="#FFFDF7" stroke-width="5" stroke-linecap="round"/>`);

  /* ---------- L4: letras ---------- */
  const SEQ="ATGCGTACCTAGGC".split("");
  const TX0=(1920-(14*104+13*14))/2, TY=380;
  const L4bg=paper("0 0 1920 1080",`<rect width="1920" height="1080" fill="#F5EEFB"/>`);
  const topT=SEQ.map((b,i)=>tile(b,TX0+i*118,TY));
  const botT=SEQ.map((b,i)=>tile(PAIR[b],TX0+i*118,TY+146));
  const bonds=SEQ.map((b,i)=>el("div",{class:"mt-bond",style:{left:(TX0+i*118+46)+"px",top:(TY+110)+"px"}}));
  const legend=el("div",{class:"mt-leg"},...["A","C","G","T"].map(b=>tile(b)));

  /* ---------- L4b: biblioteca — 3.000 millones de letras ≈ 1.000 libros gordos = una biblioteca entera ---------- */
  const LIBbg=paper("0 0 1920 1080",`<rect width="1920" height="1080" fill="#FBF1E2"/>${[[120,190,110],[1800,170,130],[60,700,70],[1870,640,60]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#F5E4CB"/>`).join("")}<rect x="0" y="905" width="1920" height="175" fill="#EAD7B8"/>`);
  const libNum=el("span",{class:"mt-num",text:"0"});
  const libCount=el("div",{class:"mt-count"},...["A","C","G","T"].map(b=>tile(b)),libNum,el("span",{class:"mt-unit",text:"letras"}));
  const libBooks=[], BKC=[BASE.A,BASE.T,BASE.G,BASE.C];
  const cases=[0,1,2].map(ci=>{
    const cs=el("div",{class:"mt-case",style:{left:(150+ci*560)+"px"}});
    for(let r=0;r<4;r++){
      const sh=el("div",{class:"mt-shelf"}); let w=6, k=0;
      while(true){ const bw=22+((ci*7+r*5+k*11)%4)*4, bh=78+((ci*3+r*7+k*13)%5)*6; if(w+bw+3>458) break;
        const b=el("div",{class:"mt-bk",style:{width:bw+"px",height:bh+"px",background:BKC[(ci+r*3+k*5+(k>>1))%4]}}); sh.append(b); libBooks.push(b); w+=bw+3; k++; }
      cs.append(sh);
    }
    return cs;
  });
  const libPill=el("div",{class:"mt-pill"},el("div",{html:"En libros… ¡una <b>biblioteca entera</b>!"}),el("span",{class:"mt-tag",text:"≈ 1.000 libros gordos"}));
  const LIB_N=3000000000, LIB_FILL=3400, LIB_START=700;
  let libT0=-1e9, libShown=-1;
  const fmt=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,".");
  function drawLib(now){
    const p=Math.max(0,Math.min(1,(now-libT0-LIB_START)/LIB_FILL)), v=p>=1?LIB_N:Math.round(LIB_N*Math.pow(p,2.2)/1000)*1000;
    if(v!==libShown){ libShown=v; libNum.textContent=fmt(v); }
  }

  /* ---------- L5: yo estudio estas letras (doble hilera que pasa bajo una lupa) ---------- */
  const L5bg=paper("0 0 1920 1080",`<rect width="1920" height="1080" fill="#F5EEFB"/>${[[200,250,150],[1720,230,180],[1600,940,160],[260,930,130]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#EADFF7"/>`).join("")}`);
  const SEQ2="ATGCGTACCTAGGCATTGCA".split("");
  const mkStrip=()=>{ const st=el("div",{class:"mt-strip"});
    for(let k=0;k<2*SEQ2.length;k++){ const b=SEQ2[k%SEQ2.length], x=k*118;
      st.append(el("div",{class:"mt-bond",style:{left:(x+46)+"px",top:"110px"}}),tile(b,x,0),tile(PAIR[b],x,146)); }
    return st; };
  const strip=mkStrip(), mag=el("div",{class:"mt-mag"},el("div",{},mkStrip()));
  const handle=el("div",{class:"mt-handle"});

  /* ---------- L7: ordenador + IA ---------- */
  const L7bg=paper("0 0 1920 1080",`<rect width="1920" height="1080" fill="#E6F3FA"/>
    <circle cx="1500" cy="640" r="330" fill="#D3EBF7"/>
    <rect x="560" y="880" width="120" height="80" fill="#6D6E71" %F%/><rect x="440" y="950" width="360" height="40" rx="20" fill="#6D6E71" %F%/>
    <rect x="140" y="280" width="960" height="610" rx="34" fill="#2A3550" %F%/>
    <rect x="171" y="311" width="898" height="548" rx="16" fill="#16203A"/>
    <path d="M1520 312 V250" stroke="#6D6E71" stroke-width="12" stroke-linecap="round"/><circle class="mt-bulb" cx="1520" cy="238" r="26" fill="#F2C230" %F%/>
    <rect x="1380" y="310" width="280" height="220" rx="60" fill="#5EC0EA" %F%/>
    <rect x="1412" y="350" width="216" height="130" rx="40" fill="#FFFDF7"/>
    <g class="mt-eyes"><circle cx="1470" cy="415" r="26" fill="#1F2A44"/><circle cx="1570" cy="415" r="26" fill="#1F2A44"/><circle cx="1462" cy="406" r="8" fill="#fff"/><circle cx="1562" cy="406" r="8" fill="#fff"/></g>
    <rect x="1485" y="492" width="70" height="16" rx="8" fill="#F7931E"/>
    <path d="M1370 640 L1190 560" stroke="#5EC0EA" stroke-width="46" stroke-linecap="round" %F%/><circle cx="1180" cy="556" r="30" fill="#6D6E71" %F%/>
    <path d="M1670 640 L1740 780" stroke="#5EC0EA" stroke-width="46" stroke-linecap="round" %F%/><circle cx="1744" cy="790" r="30" fill="#6D6E71" %F%/>
    <rect x="1420" y="880" width="72" height="110" rx="22" fill="#6D6E71" %F%/><rect x="1548" y="880" width="72" height="110" rx="22" fill="#6D6E71" %F%/>
    <rect x="1350" y="550" width="340" height="350" rx="56" fill="#29ABE2" %F%/>
    <rect x="1395" y="595" width="250" height="250" rx="34" fill="#1F2A44"/>`,"",3);
  // red neuronal en el pecho del robot (se ilumina al encontrar un patrón)
  let nnL="",nnC=""; const NN=[[1440,[640,720,800]],[1520,[620,690,760,830]],[1600,[680,760]]];
  for(let a=0;a<2;a++) for(const y1 of NN[a][1]) for(const y2 of NN[a+1][1]) nnL+=`M${NN[a][0]} ${y1} L${NN[a+1][0]} ${y2} `;
  NN.forEach(([x,ys])=>ys.forEach(y=>nnC+=`<circle cx="${x}" cy="${y}" r="15" fill="#7FCFF0"/>`));
  const nn=APP.svg(`<svg viewBox="0 0 1920 1080" class="mt-nn" style="position:absolute;inset:0;width:1920px;height:1080px;pointer-events:none"><path d="${nnL}" fill="none" stroke="#7FCFF0" stroke-width="4" opacity=".55"/>${nnC}</svg>`);
  const rainCv=el("canvas",{class:"mt-screen",width:890,height:540});
  const rctx=rainCv.getContext("2d");
  const RC=19,RR=12,CW=890/RC,RH=45;
  const grid=Array.from({length:RC},()=>Array.from({length:RR},()=>({ch:pick("ACGT".split("")),life:Math.random()*0.6})));
  const heads=Array.from({length:RC},()=>({y:Math.floor(rnd(-12,12)),sp:Math.floor(rnd(1,3))}));
  let lastTick=0, pat=null, lastPat=0;
  function drawRain(now){
    if(now-lastTick>85){
      lastTick=now;
      heads.forEach((h,c)=>{ if((now/85|0)%h.sp) return; h.y++; if(h.y>=RR+6){ h.y=-Math.floor(rnd(0,8)); h.sp=Math.floor(rnd(1,3)); } if(h.y>=0&&h.y<RR) grid[c][h.y]={ch:pick("ACGT".split("")),life:1}; });
      grid.forEach(col=>col.forEach(cell=>cell.life=Math.max(0.12,cell.life-0.07)));
      if(!pat&&now-lastPat>2200){ const c=Math.floor(rnd(1,RC-5)), r=Math.floor(rnd(1,RR-2)); pat={c,r,t:now,w:4}; "GATA".split("").forEach((ch,i)=>grid[c+i][r]={ch,life:1}); nn.classList.add("hot"); }
      if(pat&&now-pat.t>1500){ pat=null; lastPat=now; nn.classList.remove("hot"); }
    }
    const c=rctx; c.fillStyle="#16203A"; c.fillRect(0,0,890,540);
    c.font="600 30px Fredoka, sans-serif"; c.textAlign="center"; c.textBaseline="middle";
    for(let i=0;i<RC;i++) for(let j=0;j<RR;j++){
      const cell=grid[i][j]; const inPat=pat&&j===pat.r&&i>=pat.c&&i<pat.c+pat.w, head=heads[i].y===j;
      c.globalAlpha=inPat||head?1:cell.life; c.fillStyle=BASE[cell.ch];
      c.beginPath(); c.roundRect?c.roundRect(i*CW+3,j*RH+3,CW-6,RH-6,8):c.rect(i*CW+3,j*RH+3,CW-6,RH-6); c.fill();
      if(head){ c.strokeStyle="#FFFDF7"; c.lineWidth=3; c.stroke(); }
      c.fillStyle="#FFFFFF"; c.fillText(cell.ch,i*CW+CW/2,j*RH+RH/2+2);
    }
    c.globalAlpha=1;
    if(pat){
      const x=pat.c*CW+2,y=pat.r*RH, w=pat.w*CW-4, k=Math.min(1,(now-pat.t)/200);
      c.strokeStyle="#F2C230"; c.lineWidth=6; c.beginPath(); c.roundRect?c.roundRect(x-6,y-3,w+12,RH+6,14):c.rect(x-6,y-3,w+12,RH+6); c.stroke();
      c.globalAlpha=k; const lx=Math.min(890-150,x+w/2), ly=y>90?y-40:y+RH+40;
      c.fillStyle="#F2C230"; c.beginPath(); c.roundRect?c.roundRect(lx-140,ly-32,280,64,32):c.rect(lx-140,ly-32,280,64); c.fill();
      c.fillStyle="#1F2A44"; c.fillText("¡Patrón!",lx,ly+2); c.globalAlpha=1;
    }
  }

  /* ---------- niveles ---------- */
  const mk=(...kids)=>{ const d=el("div",{class:"mt-L"}); kids.forEach(k=>d.append(typeof k==="string"?APP.svg(k):k)); root.append(d); return d; };
  const LV=[
    {el:mk(L0),focal:[770,700],ban:"Tú estás hecho de…",zoom:"×1"},
    {el:mk(L1),focal:L1focal,ban:"¡Millones de <b>células</b>!",zoom:"×100",trans:"zoom"},
    {el:mk(L2),focal:[1000,600],ban:"Una célula… ¡y su <b>núcleo</b>!",zoom:"×1.000",trans:"zoom"},
    {el:mk(L3bg,helixCv),focal:[960,630],ban:()=>{ const f=document.createDocumentFragment(); f.append(APP.svg(book),el("span",{html:"El ADN: un <b>libro de instrucciones</b>"})); return f; },zoom:"×100.000",trans:"zoom"},
    {el:mk(L4bg,...bonds,...topT,...botT,legend),focal:[960,600],ban:"Escrito con <b>solo 4 letras</b>",zoom:"×1.000.000",trans:"zoom",letters:true},
    {el:mk(LIBbg,libCount,...cases,libPill),ban:"Tu ADN tiene <b>muchísimas</b> letras…",trans:"slide",lib:true},
    {el:mk(L5bg,strip,handle,mag),ban:"Yo estudio <b>estas letras</b>",trans:"slide"},
    {el:mk(L7bg,rainCv,nn),ban:"…y lo combino con la <b>inteligencia artificial</b>",two:true,trans:"slide"}
  ];
  root.append(ban,zoomChip,flash);

  let cur=0, lvAnims=[], trans=[];
  const keep=a=>{ if(a) lvAnims.push(a); return a; };
  function setBanner(i){
    const L=LV[i]; ban.classList.toggle("two",!!L.two); ban.replaceChildren();
    if(typeof L.ban==="function") ban.append(L.ban()); else ban.append(el("span",{html:L.ban}));
    if(L.zoom){ zoomChip.style.opacity=1; zoomChip.replaceChildren(APP.svg(lensIcon),el("span",{text:"Zoom "+L.zoom})); } else zoomChip.style.opacity=0;
  }
  function enter(i,dir){
    const fast=red||dir<0;
    if(LV[i].lib){
      if(fast){ libT0=-1e9; libPill.style.opacity=1; return; }
      libT0=performance.now(); libShown=-1; libPill.style.opacity=0;
      const N=libBooks.length;
      libBooks.forEach((b,k)=>keep(b.animate([{opacity:0,transform:"translateY(-70px) rotate(-8deg)"},{opacity:1,transform:"none"}],{duration:380,delay:LIB_START+k/N*LIB_FILL,easing:"cubic-bezier(.3,1.4,.6,1)",fill:"backwards"})));
      keep(libPill.animate([{opacity:0,transform:"translateX(-50%) scale(.6)"},{opacity:1,transform:"translateX(-50%)"}],{duration:550,delay:LIB_START+LIB_FILL+300,easing:"cubic-bezier(.3,1.6,.5,1)",fill:"backwards"}));
      lvTm.set(()=>{ libPill.style.opacity=1; },LIB_START+LIB_FILL+300);
      lvTm.set(()=>APP.audio.ok(),LIB_START+LIB_FILL+300);
    }
    if(LV[i].letters){
      const d0=fast?0:900;
      topT.forEach((t,k)=>keep(t.animate([{transform:"none"},{transform:`translateY(-120px) rotate(${k%2?4:-4}deg)`}],{duration:fast?1:600,delay:fast?0:d0+k*70,easing:"cubic-bezier(.3,1.5,.6,1)",fill:"forwards"})));
      botT.forEach((t,k)=>keep(t.animate([{transform:"none"},{transform:`translateY(120px) rotate(${k%2?-4:4}deg)`}],{duration:fast?1:600,delay:fast?0:d0+k*70,easing:"cubic-bezier(.3,1.5,.6,1)",fill:"forwards"})));
      bonds.forEach((b,k)=>keep(b.animate([{opacity:1},{opacity:0}],{duration:fast?1:300,delay:fast?0:d0+k*70,fill:"forwards"})));
      [...legend.children].forEach((t,k)=>{
        keep(t.animate([{opacity:0,transform:"scale(.2) rotate(-20deg)"},{opacity:1,transform:"none"}],{duration:fast?1:500,delay:fast?0:d0+1300+k*220,easing:"cubic-bezier(.3,1.8,.5,1)",fill:"both"}));
      });
      if(!fast) lvTm.set(()=>APP.audio.ok(),d0+1300+3*220);
    }
  }
  function go(n,dir){
    trans.forEach(a=>{ try{a.finish();}catch(e){} }); trans=[];
    lvTm.clear(); lvAnims.forEach(a=>a.cancel()); lvAnims=[];
    const fromI=cur, from=LV[fromI], to=LV[n]; cur=n;
    LV.forEach((L,i)=>{ if(i!==fromI&&i!==n){ L.el.style.display="none"; } });
    to.el.style.display="block";
    const type=dir>0?to.trans:from.trans, D=red?1:900;
    LV.forEach(L=>L.el.style.zIndex="");
    const hide=()=>{ from.el.style.zIndex=""; if(cur!==fromI) from.el.style.display="none"; };
    let a1,a2;
    if(type==="zoom"){
      const f=dir>0?from.focal:to.focal;
      flash.style.setProperty("--fx",f[0]+"px"); flash.style.setProperty("--fy",f[1]+"px");
      if(!red) trans.push(flash.animate([{opacity:0},{opacity:.9,offset:.45},{opacity:0}],{duration:D}));
      if(dir>0){
        from.el.style.transformOrigin=`${f[0]}px ${f[1]}px`; to.el.style.transformOrigin="50% 55%";
        a1=from.el.animate([{transform:"scale(1)",opacity:1},{transform:"scale(8)",opacity:0}],{duration:D,easing:"cubic-bezier(.6,0,.9,.5)"});
        a2=to.el.animate([{clipPath:"circle(0px at 50% 55%)",transform:"scale(1.5)",opacity:1},{clipPath:"circle(1250px at 50% 55%)",transform:"scale(1)",opacity:1}],{duration:D*1.1,delay:D*0.3,easing:"cubic-bezier(.3,0,.2,1)",fill:"backwards"});
      }else{
        from.el.style.transformOrigin="50% 55%"; to.el.style.transformOrigin=`${f[0]}px ${f[1]}px`;
        from.el.style.zIndex=2;
        a1=from.el.animate([{clipPath:"circle(1250px at 50% 55%)",transform:"scale(1)"},{clipPath:"circle(0px at 50% 55%)",transform:"scale(1.5)"}],{duration:D,easing:"cubic-bezier(.6,0,.8,.4)"});
        a2=to.el.animate([{transform:"scale(4)",opacity:.6},{transform:"scale(1)",opacity:1}],{duration:D,easing:"cubic-bezier(.3,0,.2,1)"});
      }
    }else{
      const s=dir>0?1:-1;
      from.el.style.transformOrigin=to.el.style.transformOrigin="50% 50%";
      a1=from.el.animate([{transform:"none",opacity:1},{transform:`translateX(${-700*s}px) rotate(${-4*s}deg)`,opacity:0}],{duration:D*0.8,easing:"ease-in"});
      a2=to.el.animate([{transform:`translateX(${900*s}px) rotate(${5*s}deg)`,opacity:0},{transform:"none",opacity:1}],{duration:D,delay:D*0.15,easing:"cubic-bezier(.2,.9,.3,1.1)",fill:"backwards"});
    }
    a1.onfinish=hide; trans.push(a1,a2);
    ban.getAnimations().forEach(a=>a.cancel());
    if(red) setBanner(n);
    else{ trans.push(ban.animate([{opacity:1,transform:"translateX(-50%)"},{opacity:0,transform:"translateX(-50%) translateY(-30px)"}],{duration:250,fill:"forwards"}));
      lvTm.set(()=>{ ban.getAnimations().forEach(a=>a.cancel()); setBanner(n); ban.animate([{opacity:0,transform:"translateX(-50%) scale(.7)"},{opacity:1,transform:"translateX(-50%)"}],{duration:450,easing:"cubic-bezier(.3,1.6,.5,1)"}); },260); }
    enter(n,dir);
  }

  const LIBL=LV.find(L=>L.lib), RAINL=LV[LV.length-1];
  let raf=0, t0=performance.now();
  const loop=now=>{
    if(LV[3].el.style.display!=="none") drawHelix(red?0.6:(now-t0)/1000*1.3);
    if(LIBL.el.style.display!=="none") drawLib(now);
    if(RAINL.el.style.display!=="none") drawRain(now);
    raf=requestAnimationFrame(loop);
  };
  raf=requestAnimationFrame(loop);
  LV[0].el.style.display="block"; setBanner(0);
  root.addEventListener("click",()=>APP.next());
  return {
    next(){ if(cur<LV.length-1){ go(cur+1,1); return true; } return false; },
    prev(){ if(cur>0){ go(cur-1,-1); return true; } return false; },
    destroy(){ cancelAnimationFrame(raf); tm.clear(); lvTm.clear(); }
  };
}});
})();
