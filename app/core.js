/* Día de la Ciencia · núcleo de la app (escenario 1920x1080, navegación, sonido, dibujo en papel recortado, perro geométrico).
   Las escenas viven en scenes/*.js y se registran con window.SCENES.push({...}). Ver CONTRACT.md. */
(function(){
"use strict";
const W=1920, H=1080;

// ---------- Paleta (colores del logo del Institut-Escola Lluís Millet + gomets) ----------
const T={
  blue:"#29ABE2", orange:"#F7931E", green:"#7AC143", grey:"#6D6E71",
  ink:"#1F2A44", inkSoft:"#4A5265", paper:"#FFFDF7", cream:"#F6F1E6", sand:"#EFE5D2",
  red:"#E04B3A", gblue:"#2453C7", yellow:"#F2C230", pink:"#E59AAE"
};
const GOMET={rojo:"#E04B3A",azul:"#2453C7",amarillo:"#F2C230"};
const KEYS=["rojo","azul","amarillo"];

// ---------- DOM ----------
function el(tag,attrs={},...kids){
  const e=document.createElement(tag);
  for(const [k,v] of Object.entries(attrs||{})){
    if(v==null||v===false) continue;
    if(k==="style"&&typeof v==="object") Object.assign(e.style,v);
    else if(k==="class") e.className=v;
    else if(k==="html") e.innerHTML=v;
    else if(k==="text") e.textContent=v;
    else if(k.startsWith("on")&&typeof v==="function") e.addEventListener(k.slice(2),v);
    else e.setAttribute(k,v===true?"":v);
  }
  for(const k of kids.flat()) if(k!=null&&k!==false) e.append(k.nodeType?k:document.createTextNode(String(k)));
  return e;
}
function svg(markup){ const t=document.createElement("template"); t.innerHTML=markup.trim(); return t.content.firstElementChild; }
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const reduced=()=>window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Sonido (Web Audio; solo suena tras un clic) ----------
const audio={
  ctx:null, muted:false,
  ensure(){ if(!this.ctx){ try{ this.ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; } } if(this.ctx.state==="suspended") this.ctx.resume(); return this.ctx; },
  tone(f=660,d=0.12,type="sine",vol=0.15,when=0,slide=0){
    if(this.muted) return; const c=this.ensure(); if(!c) return;
    const t=c.currentTime+when, o=c.createOscillator(), g=c.createGain();
    o.type=type; o.frequency.setValueAtTime(f,t); if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(40,f+slide),t+d);
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+0.01); g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t+d+0.02);
  },
  pop(){ this.tone(520,0.09,"triangle",0.15,0,380); },
  click(){ this.tone(900,0.05,"square",0.035); },
  ok(){ this.tone(660,0.1,"sine",0.14); this.tone(990,0.14,"sine",0.14,0.09); },
  win(){ [523,659,784,1047].forEach((f,i)=>this.tone(f,0.16,"triangle",0.15,i*0.1)); },
  whoosh(){ this.tone(200,0.35,"sawtooth",0.04,0,900); },
  boing(){ this.tone(180,0.4,"sine",0.2,0,420); },
  bark(pitch=1){ // ladrido sintético corto
    const c=this.ensure(); if(!c||this.muted) return;
    [0,0.16].forEach(w=>{ this.tone(380*pitch,0.11,"sawtooth",0.14,w,-220*pitch); this.tone(760*pitch,0.07,"square",0.04,w,-400*pitch); });
  }
};

// ---------- Dibujo estilo «papel recortado» ----------
// Formas (unidades del viewBox). c = color de relleno.
const R=(x,y,w,h,rx,c)=>({t:"r",x,y,w,h,rx,c});
const C=(cx,cy,r,c)=>({t:"c",cx,cy,r,c});
const E=(cx,cy,rx,ry,c,rot)=>({t:"e",cx,cy,rx,ry,c,rot});
const P=(d,c)=>({t:"p",d,c});            // polígono/trayecto relleno
const L=(d,c,w)=>({t:"l",d,c,w});        // trazo grueso de color (cola, patas finas)
const LN=(d,c,w)=>({t:"ln",d,c:c||"#5A3E2B",w:w||3}); // línea fina sin sombra (boca, detalles)
let uid=0;
function shapeSVG(s,k){
  const f=` filter="url(#pp${k})"`;
  switch(s.t){
    case "r": return `<rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.rx||0}" fill="${s.c}"${f}/>`;
    case "c": return `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${s.c}"${f}/>`;
    case "e": return `<ellipse cx="${s.cx}" cy="${s.cy}" rx="${s.rx}" ry="${s.ry}" fill="${s.c}"${s.rot?` transform="rotate(${s.rot} ${s.cx} ${s.cy})"`:""}${f}/>`;
    case "p": return `<path d="${s.d}" fill="${s.c}" stroke="${s.c}" stroke-width="2" stroke-linejoin="round"${f}/>`;
    case "l": return `<path d="${s.d}" fill="none" stroke="${s.c}" stroke-width="${s.w}" stroke-linecap="round" stroke-linejoin="round"${f}/>`;
    case "ln": return `<path d="${s.d}" fill="none" stroke="${s.c}" stroke-width="${s.w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return "";
}
function paperEye(x,y,r=8.5){ return `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFDF6"/><circle cx="${x-r*0.18}" cy="${y+r*0.12}" r="${r*0.54}" fill="#2A2A30"/>`; }
/** Devuelve un <svg> en texto. opts: {vb:"x y w h", eyes:[[x,y],...], eyeR, label, cls, extra (svg extra al final)} */
function paperSVG(shapes,opts={}){
  const k=++uid;
  const eyes=(opts.eyes||[]).map(([x,y])=>paperEye(x,y,opts.eyeR||8.5)).join("");
  return `<svg viewBox="${opts.vb||"0 0 200 200"}" role="img" aria-label="${opts.label||""}" class="${opts.cls||""}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="pp${k}" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="1.5" dy="2.5" stdDeviation="1.2" flood-color="#5a4a30" flood-opacity="0.45"/></filter></defs>${shapes.map(s=>shapeSVG(s,k)).join("")}${eyes}${opts.extra||""}</svg>`;
}

// ---------- Perro geométrico (idéntico a las piezas impresas) ----------
const COAT={rojo:{m:"#B98A62",b:"#EAD9C2",n:"marrón"},azul:{m:"#F4F1EA",b:"#E3DED3",n:"dálmata"},amarillo:{m:"#E2B65C",b:"#F3DFB0",n:"dorado"}};
const EARC={rojo:"#7A5236",azul:"#4A4E5C",amarillo:"#BF7A34"}, EARFOLD="#8F5A24";
const TAILC={rojo:"#D9C3A0",azul:"#E59AAE",amarillo:"#8C6A4A"};
const dogParts={
  coat:k=>[R(80,138,14,38,5,COAT[k].m),R(100,138,14,38,5,COAT[k].m),R(134,138,14,38,5,COAT[k].m),R(152,138,14,38,5,COAT[k].m),
    R(72,94,96,50,12,COAT[k].m),R(86,130,66,9,4,COAT[k].b),R(36,58,54,50,12,COAT[k].m),R(16,84,32,24,8,COAT[k].b),C(20,88,6,"#3B2A20"),
    ...(k==="azul"?[R(110,104,12,10,3,"#3A3A40"),R(140,116,10,9,3,"#3A3A40"),R(60,64,9,8,3,"#3A3A40")]:[]),
    LN("M26 100 L40 100")],
  // rojo: caída (tira larga) · azul: redonda (lóbulo circular que cuelga detrás del ojo) · amarillo: doblada (triángulo de pie con la punta caída hacia delante)
  ears:{rojo:[R(70,58,16,40,7,EARC.rojo)],
        azul:[P("M72 54 H96 L98 60 A16 16 0 1 1 72 76 Z",EARC.azul)],
        amarillo:[P("M70 66 L72 40 L62 50 Q60 44 66 36 Q74 26 86 26 Q92 28 92 38 L96 66 Z",EARC.amarillo),P("M72 40 L62 50 Q60 44 66 36 Q74 26 86 26 L88 38 Z",EARFOLD)]},
  tail:{rojo:[L("M164 104 L180 80",TAILC.rojo,7),C(183,72,11,TAILC.rojo)],
        azul:[C(176,96,15,TAILC.azul),LN("M176 96 q5 -1 4 5 q-2 6 -9 4 q-8 -3 -6 -11 q3 -10 14 -8","#B4566F",3)],
        amarillo:[L("M164 104 L196 70",TAILC.amarillo,8)]},
  names:{ears:{rojo:"caídas",azul:"redondas",amarillo:"dobladas"},coat:{rojo:"marrón",azul:"dálmata",amarillo:"dorado"},tail:{rojo:"pompón",azul:"rizada",amarillo:"larga"}},
  eyes:[[60,76]], vb:"4 20 200 165"
};
const DOG_NAMES=["Croqueta","Pulga","Churro","Galleta","Turrón","Rayo","Bombón","Pipa","Canela","Fideo","Trufa","Mochi","Chispa","Bigotes","Coco","Nube","Patata","Lenteja","Garbanzo","Pimienta","Merengue","Rosquilla","Tofu","Calcetín","Peluche","Tornado","Magdalena"];
const DOG_TITLES=["Sir","Doña","Capitán","Lady","Don","Profe","Agente","Súper","Gran"];
const dog={
  parts:dogParts,
  /** Perro completo. e,c,t ∈ {rojo,azul,amarillo}. opts: {only:"coat"|"ears"|"tail"} para una pieza. */
  svg(e,c,t,opts={}){
    let shapes;
    if(opts.only==="coat") shapes=dogParts.coat(c);
    else if(opts.only==="ears") shapes=dogParts.ears[e];
    else if(opts.only==="tail") shapes=dogParts.tail[t];
    else shapes=[...dogParts.coat(c),...dogParts.ears[e],...dogParts.tail[t]];
    return paperSVG(shapes,{vb:opts.vb||dogParts.vb,eyes:(!opts.only||opts.only==="coat")?dogParts.eyes:[],label:opts.label||dog.describe(e,c,t),cls:opts.cls});
  },
  index(e,c,t){ return KEYS.indexOf(e)*9+KEYS.indexOf(c)*3+KEYS.indexOf(t); },
  name(e,c,t){ const i=dog.index(e,c,t); return `${DOG_TITLES[i%DOG_TITLES.length]} ${DOG_NAMES[i]}`; },
  describe(e,c,t){ return `Perro con orejas ${dogParts.names.ears[e]}, pelaje ${dogParts.names.coat[c]} y cola ${dogParts.names.tail[t]}`; }
};

// ---------- Escenario, navegación y notas ----------
const SCENES=window.SCENES=window.SCENES||[];
const api={W,H,T,GOMET,KEYS,el,svg,sleep,reduced,audio,R,C,E,P,L,LN,paperSVG,paperEye,dog,
  goto:id=>show(SCENES.findIndex(s=>s.id===id)),
  store:{} // estado compartido entre escenas (p. ej. perros de la clase)
};
window.APP=api;

let stage, current=-1, inst=null, notesOpen=false;
function fit(){
  const vp=document.getElementById("viewport");
  const s=Math.min(vp.clientWidth/W, vp.clientHeight/H);
  stage.style.transform=`translate(${(vp.clientWidth-W*s)/2}px,${(vp.clientHeight-H*s)/2}px) scale(${s})`;
}
function renderDots(){
  const nav=document.getElementById("dots"); nav.replaceChildren();
  SCENES.forEach((s,i)=>nav.append(el("button",{class:"dot"+(i===current?" on":""),title:s.title,"aria-label":`Ir a: ${s.title}`,onclick:()=>{audio.click();show(i);}})));
  const n=SCENES[current]; document.getElementById("where").textContent=n?`${current+1}/${SCENES.length} · ${n.title}`:"";
}
function renderNotes(){
  const box=document.getElementById("notes"); box.hidden=!notesOpen;
  if(!notesOpen) return;
  const s=SCENES[current]; const txt=(window.NOTES&&window.NOTES[s.id])||s.notes||"(Sin guion para esta pantalla)";
  box.replaceChildren(el("h3",{text:`Guion · ${s.title}`}),...String(txt).split(/\n\n+/).map(p=>el("p",{text:p})));
}
async function show(i){
  if(i<0||i>=SCENES.length) return;
  const old=stage.querySelector(".scene");
  if(inst&&inst.destroy) try{inst.destroy();}catch(e){console.error(e);}
  if(old){ old.classList.add("leaving"); setTimeout(()=>old.remove(),reduced()?0:350); }
  current=i; const s=SCENES[i];
  const box=el("div",{class:"scene","data-id":s.id});
  stage.append(box);
  try{ inst=s.mount(box,api)||{}; }catch(e){ console.error(e); box.append(el("p",{class:"err",text:"Esta pantalla tuvo un error: "+e.message})); inst={}; }
  try{ history.replaceState(null,"","#"+s.id); }catch(e){}
  renderDots(); renderNotes();
}
function next(){ if(inst&&inst.next&&inst.next()) return; show(current+1); }
function prev(){ if(inst&&inst.prev&&inst.prev()) return; show(current-1); }
api.next=next; api.prev=prev;

function boot(){
  SCENES.sort((a,b)=>(a.order||0)-(b.order||0));
  stage=document.getElementById("stage");
  fit(); window.addEventListener("resize",fit);
  document.addEventListener("keydown",e=>{
    if(e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if(["ArrowRight","PageDown"," "].includes(e.key)){ e.preventDefault(); next(); }
    else if(["ArrowLeft","PageUp"].includes(e.key)){ e.preventDefault(); prev(); }
    else if(e.key==="n"||e.key==="N"){ notesOpen=!notesOpen; renderNotes(); }
    else if(e.key==="f"||e.key==="F"){ toggleFull(); }
    else if(e.key==="m"||e.key==="M"){ setMute(!audio.muted); }
  });
  // El sonido está ACTIVADO por defecto. Los navegadores solo dejan sonar tras el primer gesto: lo desbloqueamos con el primer clic o tecla.
  const unlock=()=>audio.ensure();
  document.addEventListener("pointerdown",unlock,{once:true}); document.addEventListener("keydown",unlock,{once:true,capture:true});
  function setMute(m){ audio.muted=m; const b=document.getElementById("mute"); b.setAttribute("aria-pressed",String(m)); b.textContent=m?"Sonido: NO (M)":"Sonido: SÍ (M)"; }
  setMute(false);
  document.getElementById("prev").onclick=()=>{audio.click();prev();};
  document.getElementById("next").onclick=()=>{audio.click();next();};
  document.getElementById("notesBtn").onclick=()=>{notesOpen=!notesOpen;renderNotes();};
  document.getElementById("fullBtn").onclick=toggleFull;
  document.getElementById("mute").onclick=()=>setMute(!audio.muted);
  const start=Math.max(0,SCENES.findIndex(s=>"#"+s.id===location.hash));
  show(start);
  window.addEventListener("hashchange",()=>{ const i=SCENES.findIndex(s=>"#"+s.id===location.hash); if(i>=0&&i!==current) show(i); });
}
function toggleFull(){
  try{ if(document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(()=>{}); }catch(e){}
}
window.addEventListener("DOMContentLoaded",boot);
})();
