/* Escenas 50, 52, 55, 57 y 60 · la receta (panellets → perro), la familia de perros, cómo descubrir su perro, separador «¡A trabajar!» y el laboratorio */
(function(){
/* URL pública del laboratorio para casa (QR en el laboratorio). Cambiar SOLO aquí. */
const LAB_URL="https://dia-de-la-ciencia.vercel.app/lab.html";
const QR_SRC="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";

const S=(window.SCENES=window.SCENES||[]);
const LS="dc-perros-clase";

function css(APP,text){ return APP.el("style",{text}); }
function gray(shapes){ return shapes.map(s=>Object.assign({},s,{c:s.t==="ln"?"#C9C1B0":"#DCD4C4"})); }
function part(APP,which,k,opts={}){
  const {dog,paperSVG}=APP, P=dog.parts;
  let shapes = which==="coat"?P.coat(k):which==="ears"?P.ears[k]:P.tail[k];
  if(opts.gray) shapes=gray(shapes);
  return paperSVG(shapes,{vb:opts.vb||P.vb,eyes:(which==="coat"&&!opts.gray)?P.eyes:[],label:opts.label||""});
}
const LABEL={ears:"Orejas",coat:"Cuerpo",tail:"Cola"};
const ORDER=["ears","coat","tail"];
const VB={coat:"8 50 166 134",ears:"58 22 56 84",tail:"154 54 50 64"};
function gomet(APP,k,size){ return APP.el("i",{class:"pz-gomet",style:{width:size+"px",height:size+"px",background:APP.GOMET[k]}}); }
/* perros guardados de la clase (compartidos con cierre.js vía APP.store.perros y localStorage) */
function loadSaved(APP){
  if(APP.store.perros) return APP.store.perros;
  let saved=[]; try{ saved=JSON.parse(localStorage.getItem(LS)||"[]"); }catch(e){ saved=[]; }
  if(!Array.isArray(saved)) saved=[];
  APP.store.perros=saved; return saved;
}
const BASE_CSS=`
.pz-gomet{display:inline-block;border-radius:50%;box-shadow:inset 0 -6px 0 rgba(0,0,0,.15),0 4px 10px rgba(0,0,0,.18)}
.pz-title{position:absolute;left:100px;top:70px;margin:0;font-family:var(--display);font-weight:700;font-size:96px;line-height:1.05;color:var(--ink)}
.pz-title span{color:var(--orange)}
.pz-sub{position:absolute;left:104px;top:190px;margin:0;font-family:var(--display);font-weight:500;font-size:52px;color:var(--inkSoft)}
.pz-in{animation:pzIn .5s cubic-bezier(.2,1.4,.4,1) both}
@keyframes pzIn{from{opacity:0;transform:scale(.6) translateY(30px)}to{opacity:1;transform:none}}
.pz-fade{animation:pzFade .5s ease both}
@keyframes pzFade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.pz-in,.pz-fade{animation:none}}
`;

/* Panellets: bolitas de mazapán cubiertas de piñones, en papel recortado */
function panelletsSVG(APP){
  const {C,E,R}=APP; const sh=[E(200,190,170,34,"#FFFFFF"),E(200,186,150,24,"#F1ECE2")];
  const balls=[[120,150],[200,160],[280,150],[160,104],[240,104]];
  balls.forEach(([x,y],bi)=>{
    sh.push(C(x,y,40,"#E8C98C"));
    for(let i=0;i<14;i++){ const a=i*2.39+bi, r=8+((i*13)%27); const px=x+Math.cos(a)*r, py=y+Math.sin(a)*r*0.9;
      sh.push(E(+px.toFixed(1),+py.toFixed(1),7,4,i%3?"#F6E3B4":"#D9A55A",Math.round(a*57)%180)); }
  });
  return APP.paperSVG(sh,{vb:"20 50 360 180",label:"Un plato de panellets"});
}
function ingredientSVG(APP,kind){
  const {C,E,R,P}=APP;
  const m={
    almendra:[E(50,52,22,32,"#B07A4B",20),E(46,46,8,14,"#C89466",20)],
    azucar:[R(18,40,28,28,6,"#ECE6DA"),R(52,40,28,28,6,"#ECE6DA"),R(35,12,28,28,6,"#F6F2EA")],
    huevo:[E(50,50,26,34,"#FBEFD9")],
    pinones:[E(30,40,9,5,"#F6E3B4",30),E(58,34,9,5,"#F6E3B4",-20),E(44,60,9,5,"#D9A55A",70),E(70,58,9,5,"#F6E3B4",10),E(24,66,9,5,"#F6E3B4",-40)]
  }[kind];
  return APP.paperSVG(m,{vb:"0 6 100 90"});
}

/* Cara de niño/a en papel recortado. hi = parte destacada ("pelo"|"orejas"|"ojos"); el resto en gris suave. */
function faceSVG(APP,hi){
  const {C,E,P,LN}=APP;
  const on=k=>!hi||hi===k;
  const skin=hi?"#EEE6D6":"#F2C9A0", ear=on("orejas")?"#F2C9A0":"#E4DBC9";
  const hair=on("pelo")?"#7A4A2A":"#D3CABA";
  const iris=on("ojos")?"#3E8F5A":"#BDB4A2";
  const sh=[
    E(40,112,16,22,ear),E(160,112,16,22,ear),
    C(100,110,58,skin),
    P("M42 104 Q38 40 100 36 Q162 40 158 104 Q150 74 124 68 Q100 84 64 76 Q50 86 42 104 Z",hair),
    E(78,114,12,13,"#FFFFFF"),E(122,114,12,13,"#FFFFFF"),
    C(78,116,9,iris),C(122,116,9,iris),C(78,116,3.5,"#1F2A44"),C(122,116,3.5,"#1F2A44"),
    LN("M86 144 Q100 156 114 144",hi?"#BDB4A2":"#B5523B",4)
  ];
  if(on("orejas")&&hi) sh.push(LN("M36 104 Q44 112 38 122","#D49A72",3),LN("M164 104 Q156 112 162 122","#D49A72",3));
  return APP.paperSVG(sh,{vb:"14 26 172 150",label:hi?`Cara: ${hi}`:"Cara"});
}
function arrowSVG(color){
  return `<svg viewBox="0 0 60 100" width="60" height="100" aria-hidden="true"><path d="M30 4 V74" stroke="${color}" stroke-width="10" stroke-linecap="round"/><path d="M8 62 L30 94 L52 62 Z" fill="${color}" stroke="${color}" stroke-width="6" stroke-linejoin="round"/></svg>`;
}

/* ---------------- 50 · receta ---------------- */
S.push({id:"receta",title:"El ADN es una receta",order:50,mount(box,APP){
  const {el,KEYS,T}=APP;
  box.append(css(APP,BASE_CSS+`
    .rc{position:absolute;inset:0;background:linear-gradient(160deg,#FFF8EA,#F3EBDB)}
    .rc-stage{position:absolute;left:0;right:0;top:290px;bottom:40px}
    .rc-card{position:absolute;background:#fff;border-radius:36px;box-shadow:0 8px 0 rgba(90,74,48,.10),0 18px 40px rgba(90,74,48,.14)}
    .rc-big{font-family:var(--display);font-weight:600;font-size:64px;color:var(--ink);margin:0}
    .rc-pan svg{width:100%;height:auto;display:block;margin:10px 0 6px}
    .rc-ing{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
    .rc-ing div{display:flex;flex-direction:column;align-items:center;gap:2px;font-family:var(--display);font-weight:500;font-size:40px;color:var(--ink)}
    .rc-ing svg{width:90px;height:80px}
    .rc-dna{display:grid;grid-template-columns:repeat(6,92px);gap:14px;margin-top:40px}
    .rc-dna i,.rc-chunk i{width:92px;height:92px;border-radius:14px;display:flex;align-items:center;justify-content:center;font:700 56px var(--display);font-style:normal;color:#fff;box-shadow:2px 4px 0 rgba(90,74,48,.18)}
    .rc-arrow{position:absolute;left:868px;top:250px;font:700 120px var(--display);color:var(--orange)}
    .rc-back{position:absolute;left:90px;right:90px;top:52px;height:12px;border-radius:6px;background:#D8CFBD}
    .rc-col{position:absolute;top:0;width:420px;margin-left:-210px;display:flex;flex-direction:column;align-items:center}
    .rc-chunk{display:flex;gap:8px;padding:12px;background:#fff;border-radius:24px;border-bottom:16px solid var(--c);box-shadow:0 6px 0 rgba(90,74,48,.08)}
    .rc-chunk i{width:66px;height:66px;font-size:42px;border-radius:12px}
    .rc-chunk.more i{opacity:.4}
    .rc-col .ar{margin:6px 0 2px}
    .rc-t{width:300px;height:280px;background:#fff;border-radius:36px;border:8px solid var(--c);box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:12px;box-shadow:0 8px 0 rgba(90,74,48,.10),0 18px 40px rgba(90,74,48,.12)}
    .rc-t svg{width:240px;height:auto}
    .rc-t.dogp{position:relative}
    .rc-t.dogp svg{width:250px;height:auto}
    .rc-t.dogp .pz-gomet{position:absolute;right:-30px;top:-30px}
    .rc-t .dots{font:700 120px var(--display);color:#BDB29C;line-height:1}
    .rc-l{margin:16px 0 0;text-align:center;font-family:var(--display);font-weight:600;font-size:50px;line-height:1.05;color:var(--ink)}
    .rc-l small{display:block;font-size:40px;font-weight:500;color:var(--inkSoft)}
    .rc-grid{display:grid;grid-template-columns:220px repeat(3,300px);gap:14px 30px;align-items:center}
    .rc-grid .lab{font-family:var(--display);font-weight:600;font-size:52px;color:var(--ink)}
    .rc-grid .hd{display:flex;justify-content:center}
    .rc-grid .pc{display:flex;justify-content:center;align-items:center;height:150px;background:#fff;border-radius:26px;box-shadow:0 4px 0 rgba(90,74,48,.08)}
    .rc-grid .pc svg{height:120px;width:auto;max-width:260px}
  `));
  const root=el("div",{class:"rc"});
  const title=el("h2",{class:"pz-title"}), sub=el("p",{class:"pz-sub"}), stage=el("div",{class:"rc-stage"});
  root.append(title,sub,stage); box.append(root);
  let step=0, timers=[];
  const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
  const BASES={A:"#2F6BD8",T:"#E0245E",G:"#1E9A57",C:"#F28A1E"};
  const chunk=(seq,more)=>el("div",{class:"rc-chunk"+(more?" more":"")},...seq.split("").map(b=>el("i",{text:b,style:{background:BASES[b]}})));
  /* Una tira de ADN partida en trozos; cada trozo → flecha → lo que decide. cols: [{x,seq,color,card,label,more}] */
  function trozos(cols){
    stage.append(el("div",{class:"rc-back"}));
    cols.forEach((c,i)=>{
      const col=el("div",{class:"rc-col",style:{left:c.x+"px"}},
        chunk(c.seq,c.more),el("div",{class:"ar",html:arrowSVG(c.more?"#BDB29C":c.color)}),c.card,el("p",{class:"rc-l",html:c.label}));
      col.style.setProperty("--c",c.color);
      col.querySelector(".rc-t").style.setProperty("--c",c.color);
      stage.append(col);
      col.style.visibility="hidden"; items.push(col);   // se revelan con cada clic
    });
  }
  let items=[], rsub=0;   // elementos que se revelan uno a uno con cada clic
  function reveal(n){ rsub=n; items.forEach((it,i)=>{ const on=i<n; it.style.visibility=on?"visible":"hidden"; it.classList.toggle("pz-in",on&&!APP.reduced()); }); }
  function render(full){
    timers.forEach(clearTimeout); timers=[]; stage.replaceChildren(); items=[];
    if(step===0){
      title.innerHTML="Su ADN es <i>como</i> una <span>receta</span>"; sub.textContent="Una receta dice cómo hacer algo. Su ADN dice cómo son ustedes.";
      const card=el("div",{class:"rc-card rc-pan pz-in",style:{left:"110px",top:"0px",width:"740px",padding:"40px 50px"}},
        el("p",{class:"rc-big",text:"Receta de panellets"}),
        el("div",{html:panelletsSVG(APP)}),
        el("div",{class:"rc-ing"},...[["almendra","Almendra"],["azucar","Azúcar"],["huevo","Huevo"],["pinones","Piñones"]].map(([k,t])=>el("div",{},el("div",{html:ingredientSVG(APP,k)}),el("span",{text:t})))));
      const seq="ATGCCATAGGCTTACGATCAGTCA".split("");
      const card2=el("div",{class:"rc-card pz-in",style:{left:"990px",top:"0px",width:"700px",padding:"40px 50px",animationDelay:APP.reduced()?"0s":".35s"}},
        el("p",{class:"rc-big",text:"Receta de una persona"}),
        el("div",{class:"rc-dna"},...seq.map(b=>el("i",{text:b,style:{background:BASES[b]}}))));
      card2.style.animationDelay="0s";
      const arr=el("div",{class:"rc-arrow",text:"→"});
      stage.append(card,arr,card2); items.push(arr,card2);
    } else if(step===1){
      title.innerHTML="Cada <span>trozo</span> del ADN decide una cosa"; sub.textContent="Un trozo decide el pelo, otro las orejas, otro los ojos…";
      const face=hi=>el("div",{class:"rc-t",html:faceSVG(APP,hi)});
      trozos([
        {x:300,seq:"ATGC",color:T.blue,card:face("pelo"),label:"el color<small>del pelo</small>"},
        {x:740,seq:"GGTA",color:T.orange,card:face("orejas"),label:"la forma<small>de las orejas</small>"},
        {x:1180,seq:"CATG",color:T.green,card:face("ojos"),label:"el color<small>de los ojos</small>"},
        {x:1620,seq:"TACG",color:"#BDB29C",more:true,card:el("div",{class:"rc-t"},el("span",{class:"dots",text:"…"})),label:"¡y muchas<small>cosas más!</small>"}
      ]);
    } else if(step===2){
      title.innerHTML="La receta de un <span>perro</span>"; sub.textContent="El ADN de nuestros perros tiene solo 3 trozos";
      /* perro gris con UNA parte en color (como las caras del paso anterior) */
      const EXK={ears:"rojo",coat:"azul",tail:"amarillo"}, Pp=APP.dog.parts;
      const sh=(q)=>q==="coat"?Pp.coat(EXK.coat):Pp[q][EXK[q]];
      const dp=(p,k)=>el("div",{class:"rc-t dogp"},el("div",{html:APP.paperSVG([...["coat","ears","tail"].flatMap(q=>q===p?sh(q):gray(sh(q)))],{vb:Pp.vb,eyes:Pp.eyes,label:LABEL[p]})}),gomet(APP,k,96));
      trozos([
        {x:420,seq:"ATGC",color:T.blue,card:dp("ears","rojo"),label:"orejas"},
        {x:960,seq:"GGTA",color:T.orange,card:dp("coat","azul"),label:"cuerpo<small>(el pelo)</small>"},
        {x:1500,seq:"CATG",color:T.green,card:dp("tail","amarillo"),label:"cola"}
      ]);
    } else if(step===3){
      title.innerHTML="Cada color, <span>una pieza</span>"; sub.textContent="Rojo, azul o amarillo";
      const g=el("div",{class:"rc-grid",style:{position:"absolute",left:"250px",top:"0"}});
      g.append(el("span"),...KEYS.map(k=>el("span",{class:"hd"},gomet(APP,k,80))));
      ORDER.forEach((p,r)=>{
        g.append(el("span",{class:"lab",text:LABEL[p]}));
        KEYS.forEach((k,cI)=>{const cell=el("div",{class:"pc",html:part(APP,p,k,{vb:VB[p]})});g.append(cell);
          if(APP.reduced()) return; cell.style.opacity=0;
          later(()=>{cell.style.opacity=1;cell.classList.add("pz-in");},250+(r*3+cI)*160);});
      });
      stage.append(g);
    }
    // paso 0: el panellet sale solo y la persona (flecha + tarjeta) con el siguiente clic, a la vez
    if(step===0){ items=[[items[0],items[1]]].map(([x,y])=>({style:{set visibility(v){x.style.visibility=v;y.style.visibility=v;}},classList:{toggle(c,on){x.classList.toggle(c,on);y.classList.toggle(c,on);}}})); }
    reveal(full?items.length:0);
  }
  render(false);
  return {
    next(){ if(rsub<items.length){ reveal(rsub+1); return true; } if(step<3){ step++; render(false); return true; } return false; },
    prev(){ if(rsub>0){ reveal(rsub-1); return true; } if(step>0){ step--; render(true); return true; } return false; },
    destroy(){timers.forEach(clearTimeout);}
  };
}});

/* ---------------- 52 · familia de perros ---------------- */
/* Retrato de familia: los padres arriba, los cachorros (más pequeños) abajo, unidos por líneas.
   Cada parte del cachorro llega de mamá o de papá CON UN CLIC (orejas → cuerpo → cola → ¡guau!). */
S.push({id:"familia-perro",title:"Mamá, papá y los cachorros",order:52,mount(box,APP){
  const {el,GOMET,dog,audio,T}=APP;
  const PAR={
    mama:{name:"Mamá Canela",who:"mamá",ears:"rojo",coat:"amarillo",tail:"rojo",col:T.orange,left:110},
    papa:{name:"Papá Bruno",who:"papá",ears:"azul",coat:"azul",tail:"amarillo",col:T.blue,left:1340}
  };
  const PUPS=[{name:"Chispa",from:{ears:"papa",coat:"mama",tail:"papa"},left:400},
              {name:"Pipa",from:{ears:"mama",coat:"papa",tail:"mama"},left:1000}];
  const PUP_W=520, PUP_T=772, PUP_X=p=>p.left+PUP_W/2;
  const PART_TXT={ears:"Las orejas…",coat:"El cuerpo…",tail:"Y la cola…"};
  box.append(css(APP,BASE_CSS+`
    .fp{position:absolute;inset:0;background:linear-gradient(165deg,#FFF6E8,#F6F1E6 60%,#EFE5D2);overflow:hidden}
    .fp .pz-title .pb{color:var(--blue)}
    .fp-lines{position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none}
    .fp-lines path{fill:none;stroke:#CDBFA5;stroke-width:12;stroke-linecap:round;stroke-linejoin:round;transition:opacity .4s}
    .fp-card{position:absolute;background:#fff;border-radius:40px;box-shadow:0 8px 0 rgba(90,74,48,.10),0 18px 40px rgba(90,74,48,.12);box-sizing:border-box}
    .fp-card h3{margin:0;font-family:var(--display);font-weight:600;font-size:56px;line-height:1.1;color:var(--ink)}
    .fp-par{top:262px;width:470px;height:480px;border-top:18px solid var(--c);padding-top:12px;display:flex;flex-direction:column;align-items:center}
    .fp-par .dg svg{width:300px;height:auto;display:block}
    .fp-rec{display:grid;grid-template-columns:repeat(3,140px);gap:4px 6px;justify-items:center}
    .fp-rec span{font-family:var(--display);font-weight:500;font-size:40px;color:var(--inkSoft)}
    .fp-rec .pz-gomet{width:72px;height:72px;transition:transform .3s,box-shadow .3s}
    .fp-rec .pz-gomet.give{transform:scale(1.3);box-shadow:0 0 0 10px rgba(31,42,68,.22),inset 0 -6px 0 rgba(0,0,0,.15)}
    .fp-pup{top:${PUP_T}px;width:${PUP_W}px;height:286px;padding:12px 18px;border-top:12px solid #CDBFA5;display:grid;grid-template-columns:240px 1fr;grid-template-rows:auto 1fr;column-gap:12px;opacity:0;transform:translateY(40px) scale(.85);transition:opacity .45s,transform .5s cubic-bezier(.2,1.4,.4,1)}
    .fp-pup.on{opacity:1;transform:none}
    .fp-pup h3{grid-column:1/3;font-size:50px}
    .fp-pup h3 small{font-size:40px;font-weight:500;color:var(--inkSoft)}
    .fp-pup .dg{position:relative;width:240px;height:198px}
    .fp-pup .dg>div{position:absolute;inset:0;transition:opacity .3s}
    .fp-pup .dg>div.pop{animation:fpPop .6s cubic-bezier(.2,1.5,.4,1)}
    @keyframes fpPop{from{transform:translateY(-40px) scale(1.15)}to{transform:none}}
    .fp-pup .dg svg{width:100%;height:100%;display:block}
    .fp-slots{display:flex;flex-direction:column;justify-content:center;gap:6px}
    .fp-srow{display:flex;align-items:center;gap:12px;height:60px}
    .fp-slot{flex:none;width:58px;height:58px;border-radius:50%;border:5px dashed #CFC6B4;box-sizing:border-box}
    .fp-slot.full{border:none;box-shadow:inset 0 -5px 0 rgba(0,0,0,.15),0 4px 10px rgba(0,0,0,.18)}
    .fp-from{font-family:var(--display);font-weight:600;font-size:40px;line-height:1;color:#B9AF9A;white-space:nowrap}
    .fp-heart{position:absolute;left:860px;top:330px;width:200px;transition:opacity .4s}
    .fp-fly{position:absolute;width:72px;height:72px;border-radius:50%;z-index:5;box-shadow:inset 0 -6px 0 rgba(0,0,0,.15),0 10px 20px rgba(0,0,0,.25);pointer-events:none}
    .fp-ban{position:absolute;left:615px;width:690px;top:300px;box-sizing:border-box;background:var(--ink);color:#fff;border-radius:34px;padding:22px 30px;text-align:center;font-family:var(--display);font-weight:600;font-size:48px;line-height:1.2;opacity:0;transform:translateY(30px);transition:opacity .4s,transform .5s cubic-bezier(.2,1.4,.4,1);z-index:3}
    .fp-ban b{color:var(--yellow);font-weight:700;white-space:nowrap}
    .fp-ban.on{opacity:1;transform:none}
    .fp-end{position:absolute;inset:0;background:linear-gradient(160deg,#EEF8FD,#F6F1E6);opacity:0;pointer-events:none;transition:opacity .5s;z-index:8}
    .fp-end.on{opacity:1;pointer-events:auto}
    .fp-sec{position:absolute;left:120px;top:260px;width:700px;background:#fff;border:8px solid var(--ink);border-radius:40px;padding:30px 30px 40px;box-sizing:border-box;transform:rotate(-3deg);box-shadow:0 18px 40px rgba(90,74,48,.18)}
    .fp-sec h4{margin:0 0 20px;text-align:center;font-family:var(--display);font-weight:700;font-size:72px;color:var(--ink)}
    .fp-sec .row{display:grid;grid-template-columns:repeat(3,1fr);justify-items:center;gap:10px}
    .fp-sec .row>div{display:flex;flex-direction:column;align-items:center;gap:14px}
    .fp-sec .row svg{height:110px;width:auto}
    .fp-sec .q{width:120px;height:120px;border-radius:50%;background:#CFC6B4;color:#fff;display:flex;align-items:center;justify-content:center;font:700 76px var(--display);box-shadow:inset 0 -8px 0 rgba(0,0,0,.12)}
    .fp-end h2{position:absolute;left:120px;right:90px;top:70px;margin:0;font-family:var(--display);font-weight:700;font-size:100px;color:var(--ink)}
    .fp-end h2 span{color:var(--orange)}
    .fp-end p{position:absolute;left:920px;right:80px;margin:0;font-family:var(--display);font-weight:700;line-height:1.1;color:var(--ink)}
    .fp-end .l1{top:270px;font-size:72px}
    .fp-end .l2{top:520px;font-size:80px;color:var(--orange)}
    .fp-end .l3{top:790px;font-size:52px;font-weight:600;color:var(--inkSoft)}
    .fp-end .l3 b{color:var(--blue)}
    @media (prefers-reduced-motion:reduce){.fp-pup,.fp-ban,.fp-end{transition:none}.fp-pup .dg>div.pop{animation:none}}
  `));
  const root=el("div",{class:"fp"});
  const title=el("h2",{class:"pz-title"}), sub=el("p",{class:"pz-sub"});
  // líneas del retrato de familia (padres — corazón — cachorros)
  const lines=APP.svg(`<svg class="fp-lines" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M580 430 H880 M1040 430 H1340"/><path class="trunk" d="M960 520 V700"/>
    ${PUPS.map((p,i)=>`<path class="br${i}" d="M960 700 H${PUP_X(p)} V${PUP_T}"/>`).join("")}</svg>`);
  root.append(lines,title,sub);
  // padres
  const parG={};
  Object.entries(PAR).forEach(([id,p])=>{
    parG[id]={};
    const rec=el("div",{class:"fp-rec"});
    ORDER.forEach(k=>{ const g=gomet(APP,p[k],72); parG[id][k]=g; rec.append(g); });
    ORDER.forEach(k=>rec.append(el("span",{text:LABEL[k]})));
    const pc=el("div",{class:"fp-card fp-par",style:{left:p.left+"px"}},
      el("h3",{text:p.name}),el("div",{class:"dg",html:dog.svg(p.ears,p.coat,p.tail)}),rec);
    pc.style.setProperty("--c",p.col); root.append(pc);
  });
  // corazón entre los padres
  const heart=el("div",{class:"fp-heart",html:APP.paperSVG([APP.P("M100 170 C40 130 10 96 10 62 C10 34 32 14 58 14 C78 14 92 26 100 42 C108 26 122 14 142 14 C168 14 190 34 190 62 C190 96 160 130 100 170 Z",APP.T.red)],{vb:"0 0 200 190",label:"corazón"})});
  root.append(heart);
  // cachorros (más pequeños, abajo)
  const pups=PUPS.map(pp=>{
    const layers={coat:el("div"),ears:el("div"),tail:el("div")};
    const dg=el("div",{class:"dg"},layers.coat,layers.ears,layers.tail);   // cuerpo debajo
    const slots={}, froms={}; const sl=el("div",{class:"fp-slots"});
    ORDER.forEach(k=>{ slots[k]=el("i",{class:"fp-slot"}); froms[k]=el("span",{class:"fp-from"}); sl.append(el("div",{class:"fp-srow"},slots[k],froms[k])); });
    const card=el("div",{class:"fp-card fp-pup",style:{left:pp.left+"px"}},el("h3",{html:`${pp.name} <small>(cachorro)</small>`}),dg,sl);
    root.append(card);
    return {pp,card,layers,slots,froms};
  });
  const ban=el("div",{class:"fp-ban",html:"Ustedes también: su receta es <b>mitad de mamá</b> y <b>mitad de papá</b>.<br>Por eso se parecen a ellos."});
  root.append(ban);
  // final: la muestra de ADN secreta y la misión
  const end=el("div",{class:"fp-end"},
    el("h2",{html:"Su <span>misión</span> de hoy"}),
    el("div",{class:"fp-sec"},el("h4",{text:"Muestra de ADN"}),
      el("div",{class:"row"},...ORDER.map(k=>el("div",{},el("div",{html:part(APP,k,"rojo",{gray:true,vb:VB[k]})}),el("span",{class:"q",text:"?"}))))),
    el("p",{class:"l1",text:"Cada uno tiene una muestra de ADN secreta."}),
    el("p",{class:"l2",text:"¡Tienen que descubrir qué perro es!"}),
    el("p",{class:"l3",html:"Al final, en el <b>Laboratorio de perros</b>, sabrán cómo se llama."}));
  root.append(end);
  box.append(root);

  /* pasos: 0 padres · 1 Chispa gris · 2-4 orejas/cuerpo/cola · 5 Pipa gris · 6-8 sus partes · 9 mitad y mitad · 10 la misión */
  const LAST=10;
  let step=0, flyers=[], gen=0, timers=[];
  const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
  const pupStart=i=>1+4*i;
  const nParts=(i,s)=>Math.max(0,Math.min(3,s-pupStart(i)));
  function clearAnims(){ timers.forEach(clearTimeout); timers=[]; flyers.forEach(f=>{try{f.a.cancel();}catch(e){} f.n.remove();}); flyers=[]; gen++;
    Object.values(parG).forEach(o=>Object.values(o).forEach(g=>g.classList.remove("give"))); }
  function setPart(pup,k,on){
    const par=PAR[pup.pp.from[k]], col=par[k];
    pup.layers[k].classList.remove("pop");
    pup.layers[k].innerHTML=on?part(APP,k,col):part(APP,k,"rojo",{gray:true});
    pup.layers[k].style.opacity=on?1:0.6;
    pup.slots[k].classList.toggle("full",on); pup.slots[k].style.background=on?GOMET[col]:"";
    pup.froms[k].textContent=on?`de ${par.who}`:LABEL[k];
    pup.froms[k].style.color=on?par.col:"";
  }
  function fly(from,to,color,done){
    const my=gen;
    const r=root.getBoundingClientRect(), a=from.getBoundingClientRect(), b=to.getBoundingClientRect();
    let x1,y1,x2,y2;
    if(APP.rotated&&APP.rotated()){ // móvil en vertical: la escena está girada 90°, deshacer el giro
      const s=r.height/1920||1, loc=q=>[(q.top+q.height/2-r.top)/s,(r.right-(q.left+q.width/2))/s];
      [x1,y1]=loc(a); [x2,y2]=loc(b);
    } else {
      const s=r.width/1920||1;
      x1=(a.left+a.width/2-r.left)/s; y1=(a.top+a.height/2-r.top)/s;
      x2=(b.left+b.width/2-r.left)/s; y2=(b.top+b.height/2-r.top)/s;
    }
    const n=el("i",{class:"fp-fly",style:{left:(x1-36)+"px",top:(y1-36)+"px",background:color}});
    root.append(n);
    const dx=x2-x1, dy=y2-y1;
    const an=n.animate([{transform:"translate(0,0) scale(1)"},{transform:`translate(${dx/2}px,${dy/2-200}px) scale(1.5)`},{transform:`translate(${dx}px,${dy}px) scale(.8)`}],{duration:1300,easing:"ease-in-out",fill:"forwards"});
    const f={a:an,n}; flyers.push(f);
    an.onfinish=()=>{ n.remove(); flyers=flyers.filter(x=>x!==f); if(my===gen) done(); };
  }
  function texts(s){
    if(s===0) return ["Mamá <span>Canela</span> y papá <span class=\"pb\">Bruno</span>","Cada uno tiene su receta: 3 trozos de ADN"];
    if(s>=9) return ["Mitad de <span>mamá</span>, mitad de <span class=\"pb\">papá</span>","Por eso los cachorros se parecen a sus padres"];
    const i=s>=pupStart(1)?1:0, n=nParts(i,s), pp=PUPS[i];
    const t=i===0?`¡Un <span>cachorro</span>: ${pp.name}!`:`¡Otro <span>cachorro</span>: ${pp.name}!`;
    if(n===0) return [t,i===0?"¿De quién saca cada parte?":"¿Será igual que su hermana?"];
    const k=ORDER[n-1]; return [t,`${PART_TXT[k]} ¡de ${PAR[pp.from[k]].who}!`];
  }
  function render(animate){
    clearAnims();
    const [tt,ss]=texts(step); title.innerHTML=tt; sub.textContent=ss;
    heart.style.opacity=step>=9?0:1;
    lines.querySelector(".trunk").style.opacity=step>=1?1:0;
    pups.forEach((p,i)=>{
      const vis=step>=pupStart(i), n=nParts(i,step);
      p.card.classList.toggle("on",vis);
      lines.querySelector(".br"+i).style.opacity=vis?1:0;
      ORDER.forEach((k,j)=>setPart(p,k,j<n));
      // la parte nueva viaja desde mamá o papá (un clic = una parte)
      if(animate&&vis&&n>0&&step===pupStart(i)+n){
        const k=ORDER[n-1], pid=p.pp.from[k], g=parG[pid][k];
        const arrive=()=>{ g.classList.remove("give"); setPart(p,k,true);
          if(!APP.reduced()){ void p.layers[k].offsetWidth; p.layers[k].classList.add("pop"); }
          if(n===3) later(()=>audio.bark(i?1.25:1.1),250); };
        if(APP.reduced()){ arrive(); return; }
        setPart(p,k,false); g.classList.add("give");
        later(()=>fly(g,p.slots[k],GOMET[PAR[pid][k]],arrive),250);
      }
    });
    ban.classList.toggle("on",step===9);
    end.classList.toggle("on",step===LAST);
    if(step===LAST&&animate) audio.win();
  }
  render(false);
  return {next(){ if(step<LAST){step++;render(true);return true;} return false; },
          prev(){ if(step>0){step--;render(false);return true;} return false; },
          destroy(){ clearAnims(); }};
}});

/* ---------------- 55 · cómo descubrir su perro (instrucciones de la actividad 1) ---------------- */
S.push({id:"como-buscar",title:"Cómo descubrir su perro",order:55,mount(box,APP){
  const {el,KEYS,dog,audio}=APP;
  const EX=["rojo","azul","amarillo"]; // orejas caídas, dálmata, cola larga
  box.append(css(APP,BASE_CSS+`
    .cb{position:absolute;inset:0;background:linear-gradient(160deg,#EEF8FD,#F6F1E6)}
    .cb-row{position:absolute;left:70px;right:70px;top:262px;bottom:44px;display:grid;grid-template-columns:repeat(4,1fr);gap:28px}
    .cb-p{background:#fff;border-radius:34px;padding:22px 20px;display:flex;flex-direction:column;align-items:center;gap:14px;box-shadow:0 6px 0 rgba(90,74,48,.08);opacity:.28;transition:opacity .35s,transform .35s;position:relative}
    .cb-p.on{opacity:1;transform:translateY(-8px);box-shadow:0 10px 0 rgba(90,74,48,.10),0 20px 40px rgba(41,171,226,.18)}
    .cb-p.done{opacity:.85}
    .cb-n{flex:none;width:84px;height:84px;border-radius:50%;background:var(--blue);color:#fff;font-family:var(--display);font-weight:700;font-size:52px;display:flex;align-items:center;justify-content:center}
    .cb-p h3{margin:0;font-family:var(--display);font-weight:600;font-size:46px;line-height:1.1;text-align:center;color:var(--ink)}
    .cb-sheet{width:340px;background:#FFFEFA;border:3px solid #D8CFBD;border-radius:10px;padding:14px;box-sizing:border-box;display:flex;flex-direction:column;gap:12px;box-shadow:0 10px 22px rgba(90,74,48,.16);transform:rotate(-2deg)}
    .cb-card{border:5px solid var(--ink);border-radius:20px;padding:6px 10px 12px;background:#fff;display:flex;flex-direction:column;align-items:center;gap:6px}
    .cb-card b{font-family:var(--display);font-weight:700;font-size:38px;color:var(--ink)}
    .cb-card .r{display:flex;gap:16px}
    .cb-card .r>div{display:flex;flex-direction:column;align-items:center;gap:6px}
    .cb-card svg{height:44px;width:auto}
    .cb-glue{height:210px;border:4px dashed #BDB29C;border-radius:16px;display:flex;align-items:center;justify-content:center;text-align:center;font-family:var(--display);font-weight:600;font-size:40px;line-height:1.1;color:#A39883;padding:0 20px}
    /* bandejas con compartimentos marcados con un gomet */
    .cb-trays{display:flex;flex-direction:column;gap:16px;width:100%;align-items:center}
    .cb-tray{position:relative;display:grid;grid-template-columns:repeat(3,96px);gap:8px;background:#C9A877;border-radius:22px;padding:9px;box-shadow:inset 0 -6px 0 rgba(0,0,0,.14),0 6px 12px rgba(90,74,48,.18)}
    .cb-tray:before,.cb-tray:after{content:"";position:absolute;top:50%;width:22px;height:46px;margin-top:-23px;background:#B8935E;border-radius:10px}
    .cb-tray:before{left:-16px}.cb-tray:after{right:-16px}
    .cb-tray>div{position:relative;background:#FBF6EA;border-radius:14px;height:96px;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 4px 6px rgba(90,74,48,.18);transition:all .3s}
    .cb-tray>div svg{height:60px;width:auto;max-width:84px}
    .cb-tray .pz-gomet{position:absolute;left:5px;top:5px;width:24px;height:24px}
    .cb-tray>div.pick{box-shadow:0 0 0 6px var(--green);transform:translateY(-8px);background:#fff}
    .cb-tray>div.dim{opacity:.35}
    .cb-build{position:relative;width:360px;height:330px;border:4px dashed #BDB29C;border-radius:20px;box-sizing:border-box}
    .cb-build .bg{position:absolute;left:0;right:0;bottom:12px;text-align:center;font-family:var(--display);font-weight:600;font-size:34px;color:#B9AF9A}
    .cb-build>div{position:absolute;left:10px;top:10px;width:332px;height:274px;transition:transform .5s cubic-bezier(.2,1.4,.4,1),opacity .4s}
    .cb-build svg{width:100%;height:100%}
    .cb-phone{position:relative;width:230px;height:300px;flex:none;background:var(--ink);border-radius:40px;padding:14px 10px 18px;box-sizing:border-box;box-shadow:0 14px 30px rgba(31,42,68,.25);transform:rotate(3deg)}
    .cb-phone:before{content:"";position:absolute;left:50%;top:6px;width:54px;height:6px;margin-left:-27px;border-radius:3px;background:#3A4560}
    .cb-scr{width:100%;height:100%;background:linear-gradient(180deg,#FFFFFF,#F6F1E6);border-radius:26px;display:flex;flex-direction:column;align-items:center;padding:12px 8px;box-sizing:border-box;gap:4px;overflow:hidden}
    .cb-scr .t{font-family:var(--display);font-weight:700;font-size:17px;color:var(--ink);white-space:nowrap}
    .cb-scr .t span{color:var(--orange)}
    .cb-scr .dg svg{width:160px;height:auto;display:block}
    .cb-scr .q{font-family:var(--display);font-weight:600;font-size:22px;color:var(--inkSoft);margin-top:2px}
    .cb-scr .nm{font-family:var(--display);font-weight:700;font-size:30px;line-height:1.05;color:var(--orange);text-align:center}
    .cb-home{margin:0;font-family:var(--display);font-weight:600;font-size:40px;line-height:1.1;color:var(--orange);text-align:center}
  `));
  const root=el("div",{class:"cb"});
  root.append(el("h2",{class:"pz-title",html:"Cómo descubrir <span>su perro</span>"}),el("p",{class:"pz-sub",text:"Cada uno tiene una muestra de ADN secreta: ¿qué perro es?"}));
  const row=el("div",{class:"cb-row"}); root.append(row); box.append(root);
  // Panel 1: la hoja (tarjeta arriba + zona para pegar abajo; igual que la hoja impresa)
  const sheet=el("div",{class:"cb-sheet"},
    el("div",{class:"cb-card"},el("b",{text:"ADN secreto"}),
      el("div",{class:"r"},...ORDER.map((p,i)=>el("div",{},el("div",{html:part(APP,p,"rojo",{gray:true,vb:VB[p]})}),gomet(APP,EX[i],62))))),
    el("div",{class:"cb-glue",text:"Pega aquí tu perro"}));
  const p1=el("div",{class:"cb-p"},el("span",{class:"cb-n",text:"1"}),el("h3",{text:"Miren su muestra de ADN secreta"}),sheet);
  // Panel 2: bandejas (una por parte; cada compartimento marcado con su gomet)
  const trays=el("div",{class:"cb-trays"});
  const trayCells=ORDER.map((p,i)=>{const cells=KEYS.map(k=>el("div",{"data-k":k},gomet(APP,k,24),el("div",{html:part(APP,p,k,{vb:VB[p]})})));trays.append(el("div",{class:"cb-tray","aria-label":`Bandeja de ${LABEL[p].toLowerCase()}`},...cells));return cells;});
  const p2=el("div",{class:"cb-p"},el("span",{class:"cb-n",text:"2"}),el("h3",{text:"Tomen de la bandeja la pieza de su color"}),trays);
  // Panel 3: pegar en la hoja
  const build=el("div",{class:"cb-build"},el("span",{class:"bg",text:"Pega aquí tu perro"}));
  const lay={coat:el("div",{html:dog.svg(EX[0],EX[1],EX[2],{only:"coat"})}),ears:el("div",{html:dog.svg(EX[0],EX[1],EX[2],{only:"ears"})}),tail:el("div",{html:dog.svg(EX[0],EX[1],EX[2],{only:"tail"})})};
  Object.values(lay).forEach(d=>{d.style.opacity=0;d.style.transform="translateY(-120px)";build.append(d);});
  const p3=el("div",{class:"cb-p"},el("span",{class:"cb-n",text:"3"}),el("h3",{text:"Peguen abajo: cuerpo, orejas y cola"}),build);
  // Panel 4: el nombre secreto se descubre al final en el Laboratorio de perros
  const phone=el("div",{class:"cb-phone","aria-label":"El Laboratorio de perros"},
    el("div",{class:"cb-scr"},el("span",{class:"t",html:"Laboratorio de <span>perros</span>"}),el("div",{class:"dg",html:dog.svg(...EX)}),
      el("span",{class:"q",text:"Se llama:"}),el("span",{class:"nm",text:dog.name(...EX)})));
  const p4=el("div",{class:"cb-p"},el("span",{class:"cb-n",text:"4"}),el("h3",{text:"¿Cómo se llama su perro?"}),phone,el("p",{class:"cb-home",text:"Al final lo descubrirán en el Laboratorio de perros"}));
  const panels=[p1,p2,p3,p4]; row.append(...panels);
  let step=-1, timers=[]; const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
  function go(s,fwd){
    timers.forEach(clearTimeout); timers=[]; const anim=fwd&&!APP.reduced(); step=s;
    panels.forEach((p,i)=>{p.classList.toggle("on",i===s);p.classList.toggle("done",i<s);});
    trayCells.flat().forEach(c=>c.classList.remove("pick","dim"));
    Object.values(lay).forEach(d=>{d.style.opacity=0;d.style.transform="translateY(-120px)";});
    if(s>=1){ trayCells.forEach((cells,i)=>later(()=>{cells.forEach(c=>c.classList.add(c.dataset.k===EX[i]?"pick":"dim"));}, s===1&&anim?500+i*900:0)); }
    if(s>=2){ ["coat","ears","tail"].forEach((k,i)=>later(()=>{lay[k].style.opacity=1;lay[k].style.transform="none";}, s===2&&anim?500+i*900:0)); }
    if(s===2&&fwd) later(()=>audio.bark(1), anim?500+3*900:200);   // el perro está completo
  }
  go(0);
  return {next(){ if(step<3){go(step+1,true);return true;} return false; },prev(){ if(step>0){go(step-1,false);return true;} return false; },destroy(){timers.forEach(clearTimeout);}};
}});

/* ---------------- 57 · separador: ¡A trabajar! Actividad 1 ---------------- */
S.push({id:"actividad-1",title:"¡A trabajar! Actividad 1",order:57,mount(box,APP){
  const {el,dog,paperSVG,R,C,E,P,L,LN}=APP;
  const B={A:"#2F6BD8",T:"#E0245E",G:"#1E9A57",C:"#F28A1E"};
  box.append(css(APP,BASE_CSS+`
    .a1{position:absolute;inset:0;background:linear-gradient(150deg,#F7931E,#F9B046 55%,#FBC86A);overflow:hidden}
    .a1-float{position:absolute;border-radius:22%;opacity:.22;animation:a1Float linear infinite}
    .a1-float.g{border-radius:50%}
    @keyframes a1Float{from{transform:translateY(0) rotate(0)}to{transform:translateY(-1300px) rotate(240deg)}}
    .a1-pill{position:absolute;left:120px;top:110px;background:#fff;color:var(--orange);font:700 64px/1 var(--display);padding:22px 46px;border-radius:999px;box-shadow:0 8px 0 rgba(120,60,0,.18)}
    .a1-h{position:absolute;left:110px;top:230px;margin:0;font:700 190px/1 var(--display);color:#fff;text-shadow:0 8px 0 rgba(120,60,0,.18)}
    .a1-s{position:absolute;left:120px;top:460px;margin:0;font:700 100px/1.05 var(--display);color:var(--ink)}
    .a1-art{position:absolute;left:110px;right:110px;top:640px;height:380px;display:flex;align-items:center;justify-content:center;gap:50px}
    .a1-art>div{background:#FFFDF7;border-radius:40px;height:340px;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 0 rgba(120,60,0,.16),0 20px 40px rgba(120,60,0,.18)}
    .a1-card{width:440px;flex-direction:column;gap:18px;transform:rotate(-3deg)}
    .a1-card b{font:700 54px var(--display);color:var(--ink)}
    .a1-card .r{display:flex;gap:26px}
    .a1-plus{font:700 120px var(--display);color:#fff;background:none!important;box-shadow:none!important;width:auto!important}
    .a1-pieces{width:520px;position:relative}
    .a1-pieces>div{position:absolute}
    .a1-pieces svg{width:100%;height:100%;display:block}
    .a1-glue{width:300px;transform:rotate(8deg)}
    .a1-glue svg{height:300px;width:auto}
    .a1-art .bob{animation:a1Bob 3.2s ease-in-out infinite}
    @keyframes a1Bob{50%{translate:0 -14px}}
    @media (prefers-reduced-motion:reduce){.a1-float,.a1-art .bob{animation:none}}
  `));
  const root=el("div",{class:"a1"});
  // fondo: casillas de ADN y gomets que suben despacio
  const cols=[B.A,B.T,B.G,B.C,APP.GOMET.rojo,APP.GOMET.azul,"#FFFFFF"];
  for(let i=0;i<22;i++){
    const s=50+((i*37)%70), x=((i*173)%1900), d=18+((i*7)%14);
    const f=el("i",{class:"a1-float"+(i%3===0?" g":""),style:{left:x+"px",top:(1100+((i*91)%300))+"px",width:s+"px",height:s+"px",background:cols[i%cols.length],animationDuration:d+"s",animationDelay:(-(i*1.7)%d)+"s"}});
    if(APP.reduced()) f.style.top=((i*131)%1000)+"px";
    root.append(f);
  }
  root.append(el("div",{class:"a1-pill",text:"Actividad 1"}),
    el("h2",{class:"a1-h",text:"¡A trabajar!"}),
    el("p",{class:"a1-s",text:"Descubran su perro"}));
  // ilustración: tarjeta + piezas + barra de pegamento (sin tijeras)
  const card=el("div",{class:"a1-card bob"},el("b",{text:"ADN secreto"}),
    el("div",{class:"r"},...["rojo","azul","amarillo"].map(k=>gomet(APP,k,96))));
  const pieces=el("div",{class:"a1-pieces bob",style:{animationDelay:"-1s"}});
  const pc=(html,st)=>{ const d=el("div",{html}); Object.assign(d.style,st); return d; };
  pieces.append(
    pc(dog.svg("rojo","azul","amarillo",{only:"coat"}),{left:"20px",top:"40px",width:"300px",height:"250px"}),
    pc(part(APP,"ears","rojo",{vb:VB.ears}),{left:"330px",top:"20px",width:"120px",height:"180px",transform:"rotate(-12deg)"}),
    pc(part(APP,"tail","amarillo",{vb:VB.tail}),{left:"380px",top:"160px",width:"130px",height:"166px",transform:"rotate(14deg)"}));
  const glueSVG=paperSVG([R(40,40,60,40,10,"#F4F1EA"),R(34,74,72,190,18,APP.T.blue),R(34,120,72,70,0,"#FFFFFF"),R(46,134,48,8,4,APP.T.orange),R(46,152,34,8,4,APP.T.orange),R(30,250,80,30,10,"#1E6E9A")],{vb:"10 30 120 260",label:"Barra de pegamento"});
  const glue=el("div",{class:"a1-glue bob",style:{animationDelay:"-2s"},html:glueSVG});
  root.append(el("div",{class:"a1-art"},card,el("div",{class:"a1-plus",text:"+"}),pieces,el("div",{class:"a1-plus",text:"+"}),glue));
  box.append(root);
  return {next:()=>false,prev:()=>false,destroy(){}};
}});

/* ---------------- 60 · laboratorio de perros ---------------- */
S.push({id:"laboratorio",title:"Laboratorio de perros",order:60,mount(box,APP){
  const {el,GOMET,KEYS,dog,audio,T}=APP;
  box.append(css(APP,BASE_CSS+`
    .lb{position:absolute;inset:0;background:radial-gradient(circle at 58% 42%,#FFFFFF 0,#F6F1E6 60%,#EFE5D2 100%)}
    .lb-h{position:absolute;left:70px;top:44px;margin:0;font-family:var(--display);font-weight:700;font-size:76px;color:var(--ink)}
    .lb-h span{color:var(--orange)}
    .lb-pick{position:absolute;left:70px;top:170px;width:640px;display:flex;flex-direction:column;gap:22px}
    .lb-row{background:#fff;border-radius:30px;padding:18px 24px;display:grid;grid-template-columns:150px 1fr;align-items:center;box-shadow:0 5px 0 rgba(90,74,48,.08)}
    .lb-row .lab{display:flex;flex-direction:column;align-items:center;gap:2px;font-family:var(--display);font-weight:600;font-size:40px;color:var(--ink)}
    .lb-row .lab svg{height:54px;width:auto}
    .lb-btns{display:flex;gap:26px;justify-content:center}
    .lb-g{width:118px;height:118px;border-radius:50%;border:none;cursor:pointer;box-shadow:inset 0 -9px 0 rgba(0,0,0,.16),0 6px 14px rgba(0,0,0,.18);transition:transform .15s}
    .lb-g:hover{transform:scale(1.06)}
    .lb-g.sel{outline:10px solid var(--ink);outline-offset:6px;transform:scale(1.08)}
    .lb-g:focus-visible{outline:8px solid var(--blue);outline-offset:6px}
    .lb-strip{position:absolute;left:1000px;top:60px;display:flex;gap:16px;background:#fff;border-radius:999px;padding:14px 24px;box-shadow:0 5px 0 rgba(90,74,48,.08)}
    .lb-strip i{width:64px;height:64px;border-radius:50%;background:#E7E0D0;box-shadow:inset 0 -5px 0 rgba(0,0,0,.12)}
    .lb-dog{position:absolute;left:760px;top:170px;width:800px;height:500px}
    .lb-dog>div{position:absolute;inset:0;transition:transform .45s cubic-bezier(.2,1.5,.4,1),opacity .3s}
    .lb-dog svg{width:100%;height:100%}
    .lb-dog.wig{animation:lbWig .5s ease 2}
    @keyframes lbWig{0%,100%{transform:rotate(0)}25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}
    .lb-name{position:absolute;left:760px;top:680px;width:800px;box-sizing:border-box;text-align:center;margin:0;font-family:var(--display);font-weight:700;font-size:84px;line-height:1;color:var(--orange);background:#fff;border-radius:36px;padding:14px 20px 18px;box-shadow:0 6px 0 rgba(90,74,48,.10),0 16px 34px rgba(90,74,48,.12)}
    .lb-name small{display:block;font-size:44px;font-weight:600;color:var(--ink);margin-bottom:4px}
    .lb-name:empty{display:none}
    .lb-desc{position:absolute;left:740px;top:850px;width:840px;text-align:center;margin:0;font-size:40px;color:var(--inkSoft)}
    .lb-act{position:absolute;right:50px;top:170px;display:flex;flex-direction:column;gap:18px;width:270px}
    .lb-act button{font-family:var(--display);font-weight:600;font-size:40px;line-height:1.05;border:none;border-radius:26px;padding:20px 14px;color:#fff;cursor:pointer;box-shadow:inset 0 -6px 0 rgba(0,0,0,.15)}
    .lb-act .add{font-size:44px;padding:26px 14px}
    .lb-act button:disabled{opacity:.35;cursor:default}
    .lb-act button:focus-visible{outline:6px solid var(--ink);outline-offset:4px}
    .lb-act .hint{margin:-6px 0 0;text-align:center;font-family:var(--display);font-weight:500;font-size:26px;line-height:1.15;color:var(--inkSoft)}
    .lb-qr{position:absolute;right:50px;top:648px;width:270px;box-sizing:border-box;background:#fff;border-radius:24px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:8px;box-shadow:0 5px 0 rgba(90,74,48,.08)}
    .lb-qr p{margin:0;text-align:center;font-family:var(--display);font-weight:600;font-size:24px;line-height:1.15;color:var(--ink)}
    .lb-qr .code{width:150px;height:150px;display:none}
    .lb-qr .code.on{display:block}
    .lb-qr .code svg{width:100%;height:100%;display:block}
    .lb-qr .u{font-size:18px;color:var(--inkSoft);text-align:center;line-height:1.2}
    .lb-gal{position:absolute;left:70px;right:50px;bottom:26px;height:150px;display:flex;gap:12px;align-items:center;overflow:hidden}
    .lb-gal .t{flex:none;width:150px;height:130px;background:#fff;border-radius:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 0 rgba(90,74,48,.08);position:relative}
    .lb-gal .t svg{width:130px;height:auto}
    .lb-gal .t.tw{box-shadow:0 0 0 6px var(--orange)}
    .lb-gal .cnt{flex:none;font-family:var(--display);font-weight:600;font-size:40px;color:var(--inkSoft);margin-right:8px;white-space:nowrap}
    .lb-gal .clr{flex:none;margin-left:auto;font:inherit;font-size:20px;color:var(--grey);background:transparent;border:2px solid #D8CFBD;border-radius:999px;padding:6px 14px;cursor:pointer}
    .lb-banner{position:absolute;left:50%;top:400px;transform:translate(-50%,0) scale(.4);opacity:0;pointer-events:none;font-family:var(--display);font-weight:700;font-size:150px;color:#fff;padding:20px 60px;border-radius:40px;transition:all .35s cubic-bezier(.2,1.5,.4,1);white-space:nowrap;z-index:5}
    .lb-banner.on{opacity:1;transform:translate(-50%,0) scale(1)}
  `));
  const P=dog.parts;
  const st={ears:null,coat:null,tail:null};
  const root=el("div",{class:"lb"});
  root.append(el("h2",{class:"lb-h",html:"Laboratorio de <span>perros</span>"}));
  // selector
  const pick=el("div",{class:"lb-pick"}); const btns={};
  ORDER.forEach(p=>{
    btns[p]={};
    const b=el("div",{class:"lb-btns"},...KEYS.map(k=>{const x=el("button",{class:"lb-g",style:{background:GOMET[k]},"aria-label":`${LABEL[p]} ${k}`,onclick:()=>{set(p,k);}});btns[p][k]=x;return x;}));
    pick.append(el("div",{class:"lb-row"},el("div",{class:"lab"},el("div",{html:part(APP,p,"rojo",{gray:true,vb:VB[p]})}),el("span",{text:LABEL[p]})),b));
  });
  // tira y perro
  const stripDots=ORDER.map(()=>el("i")); const strip=el("div",{class:"lb-strip","aria-label":"ADN del perro"},...stripDots);
  const dogBox=el("div",{class:"lb-dog"});
  const layer={coat:el("div"),ears:el("div"),tail:el("div")};
  dogBox.append(layer.coat,layer.ears,layer.tail);
  const name=el("p",{class:"lb-name"}), desc=el("p",{class:"lb-desc"});
  // acciones
  const timers=[]; const later=(fn,ms)=>timers.push(setTimeout(fn,ms));
  const bRand=el("button",{style:{background:T.blue},text:"¡Al azar!",onclick:()=>{ORDER.forEach(p=>st[p]=null);ORDER.forEach((p,i)=>later(()=>set(p,KEYS[Math.floor(Math.random()*3)]),i*220));}});
  const bClear=el("button",{style:{background:T.grey},text:"Borrar",onclick:reset});
  const bSave=el("button",{class:"add",style:{background:T.green},text:"Añadir a la clase",onclick:save});
  const act=el("div",{class:"lb-act"},bRand,bClear,bSave,el("p",{class:"hint",text:"Saldrá en el desfile final"}));
  // QR para casa
  const qrCode=el("div",{class:"code"});
  const qr=el("div",{class:"lb-qr"},el("p",{text:"¿Quieren hacer su perro en casa?"}),qrCode,el("span",{class:"u",text:LAB_URL.replace(/^https?:\/\//,"").replace(/\//g,"\u200b/")}));
  // galería
  const gal=el("div",{class:"lb-gal"});
  const banner=el("div",{class:"lb-banner"});
  root.append(pick,strip,dogBox,name,desc,act,qr,gal,banner); box.append(root);

  let alive=true;
  function drawQR(){ try{ const q=window.qrcode(0,"M"); q.addData(LAB_URL); q.make(); qrCode.innerHTML=q.createSvgTag(4,0); qrCode.classList.add("on"); }catch(e){} }
  if(window.qrcode) drawQR();
  else {
    let sc=document.querySelector("script[data-qr]");
    if(!sc){ sc=document.createElement("script"); sc.src=QR_SRC; sc.async=true; sc.setAttribute("data-qr","1"); sc.setAttribute("crossorigin","anonymous"); document.head.append(sc); }
    sc.addEventListener("load",()=>{ if(alive&&window.qrcode) drawQR(); });
  }

  const saved=loadSaved(APP);
  let added=false;
  const complete=()=>ORDER.every(p=>st[p]);
  function draw(changed){
    ORDER.forEach((p,i)=>{
      const k=st[p];
      layer[p].innerHTML = k? part(APP,p,k) : part(APP,p,"rojo",{gray:true});
      layer[p].style.opacity = k?1:0.6;
      stripDots[i].style.background = k?GOMET[k]:"#E7E0D0";
      KEYS.forEach(c=>btns[p][c].classList.toggle("sel",c===k));
    });
    if(changed&&!APP.reduced()){ const L=layer[changed]; L.style.transform="translateY(-90px) scale(1.05)"; requestAnimationFrame(()=>requestAnimationFrame(()=>{L.style.transform="none";})); }
    if(complete()){ name.replaceChildren(el("small",{text:"Se llama:"}),dog.name(st.ears,st.coat,st.tail)); desc.textContent=added?"¡Añadido! Saldrá en el desfile final":`Orejas ${P.names.ears[st.ears]} · pelaje ${P.names.coat[st.coat]} · cola ${P.names.tail[st.tail]}`; }
    else { name.replaceChildren(); desc.textContent="Elige un color para cada parte"; }
    bSave.disabled=!complete()||added;
    bSave.textContent=added?"¡Añadido!":"Añadir a la clase";
  }
  function set(p,k){
    const was=complete(); st[p]=k; added=false; draw(p);
    if(complete()&&!was) later(()=>{audio.bark(0.9+Math.random()*0.3);dogBox.classList.add("wig");later(()=>dogBox.classList.remove("wig"),1000);},350);
  }
  function reset(){ timers.forEach(clearTimeout); timers.length=0; ORDER.forEach(p=>st[p]=null); added=false; draw(); }
  function flash(text,color,ms=1500){ banner.textContent=text; banner.style.background=color; banner.classList.add("on"); later(()=>banner.classList.remove("on"),ms); }
  function save(){
    if(!complete()||added) return;
    const key=`${st.ears}-${st.coat}-${st.tail}`; const twin=saved.includes(key);
    saved.push(key); try{localStorage.setItem(LS,JSON.stringify(saved));}catch(e){}
    added=true; draw(); renderGal();
    if(twin){ audio.win(); flash("¡GEMELOS!",T.blue,1800); }
  }
  let armed=false;
  function renderGal(){
    const count={}; saved.forEach(s=>count[s]=(count[s]||0)+1);
    gal.replaceChildren(el("span",{class:"cnt",text:saved.length?"Perros de la clase:":"Aún no hay perros de la clase"}));
    saved.slice(-7).forEach(s=>{const [e,c,t]=s.split("-"); gal.append(el("div",{class:"t"+(count[s]>1?" tw":""),title:count[s]>1?"¡Gemelos!":"",html:dog.svg(e,c,t)}));});
    if(saved.length){
      armed=false;
      const clr=el("button",{class:"clr",text:"Vaciar galería",onclick:()=>{
        if(!armed){ armed=true; clr.textContent="¿Seguro? Pulsa otra vez"; return; }
        saved.length=0; try{localStorage.removeItem(LS);}catch(e){} renderGal(); }});
      gal.append(clr);
    }
  }
  draw(); renderGal();
  return {next:()=>false,prev:()=>false,destroy(){ alive=false; timers.forEach(clearTimeout); }};
}});
})();
