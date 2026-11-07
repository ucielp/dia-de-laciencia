/* Escenas 70, 75 y 80 · Actividad 2 «Busca a tu familia por el ADN» (v2)
   parientes: el ADN tiene muchas partes; la parte «soy un perro» es igual en todos los perros; perro-lobo 1, perro-gallina muchas
   busca-familia: instrucciones (buscar el grupo con SOLO 1 diferencia → pareja) + mini demostración
   arbol: se juntan las parejas y luego el adulto saca murciélago, T-rex, cocodrilo, rana y tiburón
   Usa window.SPECIES (art/species.js) y window.TREE (data/tree.js). */
(function(){
"use strict";
const SC=(window.SCENES=window.SCENES||[]);

// ---------------- utilidades compartidas ----------------
const COMMON=`
.scene [hidden]{display:none!important}
.fam-sq{position:relative;flex:none;color:#fff;text-align:center;font-family:var(--display);font-weight:700;box-shadow:2px 3px 3px rgba(90,74,48,.38)}
.fam-ring{position:absolute;inset:-12px;border:7px solid #1F2A44;border-radius:24px;pointer-events:none}
.fam-num{position:absolute;right:-28px;top:-34px;width:60px;height:60px;border-radius:50%;background:#1F2A44;color:#fff;font:600 40px/60px var(--display);text-align:center;box-shadow:1px 2px 4px rgba(0,0,0,.3);pointer-events:none}
.fam-scan{position:absolute;border:7px solid var(--ink);border-radius:26px;background:rgba(31,42,68,.06);opacity:0;transition:opacity .3s,transform .28s ease-in-out;pointer-events:none}
.fam-pic svg{width:100%;height:100%;display:block}
.fam-paper{background:#FFFDF7;border-radius:28px;box-shadow:3px 5px 0 rgba(90,74,48,.12),0 8px 24px rgba(90,74,48,.16)}
.fam-h1{position:absolute;left:90px;right:90px;top:44px;margin:0;font-family:var(--display);font-weight:700;font-size:92px;line-height:1.05;color:var(--ink)}
.fam-h1 span{color:var(--orange)}
.fam-msg{position:absolute;left:90px;right:90px;font-family:var(--display);font-weight:600;font-size:62px;line-height:1.15;color:var(--ink);text-align:center}
.fam-msg b{color:var(--orange);font-weight:700}
`;
function need(box,APP){
  if(window.SPECIES&&window.TREE) return true;
  box.append(APP.el("p",{class:"err",text:"Faltan los archivos art/species.js o data/tree.js"})); return false;
}
function css(APP,t){ return APP.el("style",{text:COMMON+t}); }
function pic(APP,id,w,h,svgText){
  const d=APP.el("div",{class:"fam-pic",style:{width:w+"px",height:h+"px"}});
  d.append(APP.svg(svgText||window.SPECIES.byId[id].svg())); return d;
}
/** Tira de ADN: casillas del color de la base con su letra en blanco. vertical=true la pone en columna. */
function strip(APP,code,sq,gap,vertical){
  const T=window.TREE, s=APP.el("div",{class:"fam-strip",style:{display:"flex",flexDirection:vertical?"column":"row",gap:gap+"px"}});
  for(const ch of code) s.append(APP.el("div",{class:"fam-sq","data-c":ch,text:ch,
    style:{width:sq+"px",height:sq+"px",background:T.colors[ch],borderRadius:Math.round(sq*0.18)+"px",fontSize:Math.round(sq*0.62)+"px",lineHeight:sq+"px"}}));
  return s;
}
function pop(APP,el,delay=0){ if(APP.reduced()||!el.animate) return; el.animate([{transform:"scale(.6)",opacity:0},{transform:"scale(1.06)",opacity:1,offset:.7},{transform:"scale(1)",opacity:1}],{duration:480,delay,easing:"ease-out",fill:"backwards"}); }
function fadeIn(APP,el,delay=0,dy=24){ if(APP.reduced()||!el.animate) return; el.animate([{opacity:0,transform:`translateY(${dy}px)`},{opacity:1,transform:"none"}],{duration:500,delay,easing:"ease-out",fill:"backwards"}); }
function bump(APP,el){ if(!APP.reduced()&&el.animate) el.animate([{transform:"scale(1)"},{transform:"scale(1.25)"},{transform:"scale(1)"}],{duration:320,easing:"ease-out"}); }
const listY=a=>a.length<2?a.join(""):a.slice(0,-1).join(", ")+(/^h?[iíIÍ]/.test(a[a.length-1])?" e ":" y ")+a[a.length-1];
const cap=s=>s[0].toUpperCase()+s.slice(1);

/** Dos filas (animal + tira) alineadas para comparar casilla a casilla. Sin sonidos. */
function makeCompare(APP,o){
  const T=window.TREE;
  const stripX=o.picW+44, rowH=Math.max(o.picH,o.sq), H=rowH*2+o.rowGap, W=stripX+6*o.sq+5*o.gap;
  const el=APP.el("div",{class:"fam-cmp",style:{position:"absolute",width:W+"px",height:H+"px"}});
  const scan=APP.el("div",{class:"fam-scan",style:{left:(stripX-16)+"px",top:"-18px",width:(o.sq+32)+"px",height:(H+36)+"px"}});
  function row(id,code,y,svgText){
    const r=APP.el("div",{style:{position:"absolute",left:0,top:y+"px",width:W+"px",height:rowH+"px"}});
    const p=pic(APP,id,o.picW,o.picH,svgText); Object.assign(p.style,{position:"absolute",left:0,top:(rowH-o.picH)/2+"px"});
    const s=strip(APP,code,o.sq,o.gap); Object.assign(s.style,{position:"absolute",left:stripX+"px",top:(rowH-o.sq)/2+"px"});
    r.append(p,s); return {r,code,sqs:[...s.children]};
  }
  const A=row(o.a,T.dna[o.a],0,o.svgA);
  let B=row(o.b,T.dna[o.b],rowH+o.rowGap,o.svgB);
  el.append(scan,A.r,B.r);
  function clear(){ el.querySelectorAll(".fam-ring,.fam-num").forEach(x=>x.remove()); scan.style.opacity=0; }
  return {el,W,H,
    setB(id,anim,svgText){
      const old=B.r; B=row(id,T.dna[id],rowH+o.rowGap,svgText); el.append(B.r); clear();
      if(anim&&!APP.reduced()){
        old.animate([{opacity:1},{opacity:0,transform:"translateX(120px)"}],{duration:300,fill:"forwards"}).finished.then(()=>old.remove(),()=>old.remove());
        B.r.animate([{opacity:0,transform:"translateX(-120px)"},{opacity:1,transform:"none"}],{duration:450,delay:200,easing:"ease-out",fill:"backwards"});
      } else old.remove();
    },
    clear,
    /** Recorre las 6 columnas marcando diferencias. alive() falso = cancelar. Devuelve el nº de diferencias. */
    async run(alive,onCount,instant){
      clear(); let n=0; const fast=instant||APP.reduced(), step=o.sq+o.gap;
      if(!fast){ scan.style.transition="none"; scan.style.transform="translateX(0px)"; void scan.offsetWidth; scan.style.transition=""; scan.style.opacity=1; await APP.sleep(350); }
      for(let i=0;i<6;i++){
        if(!alive()) return n;
        if(!fast){ scan.style.transform=`translateX(${i*step}px)`; await APP.sleep(i?320:80); if(!alive()) return n; }
        if(A.code[i]!==B.code[i]){
          n++;
          for(const s of [A.sqs[i],B.sqs[i]]){ const ring=APP.el("div",{class:"fam-ring"}); s.append(ring); if(!fast) ring.animate([{transform:"scale(1.7)",opacity:0},{transform:"scale(1)",opacity:1}],{duration:300,easing:"cubic-bezier(.3,1.5,.6,1)"}); }
          const num=APP.el("div",{class:"fam-num",text:String(n)}); B.sqs[i].append(num);
          if(!fast) pop(APP,num);
        }
        if(onCount) onCount(n,!fast);
        if(!fast) await APP.sleep(A.code[i]!==B.code[i]?560:300);
      }
      if(!fast){ scan.style.opacity=0; }
      return n;
    }
  };
}
function gomet(APP,k,size){ return APP.el("div",{style:{width:size+"px",height:size+"px",borderRadius:"50%",background:APP.GOMET[k],boxShadow:"2px 3px 3px rgba(90,74,48,.38)"}}); }

// =====================================================================
// 70 · parientes
// =====================================================================
SC.push({
  id:"parientes", title:"¿Quién es pariente de quién?", order:70,
  mount(box,APP){
    if(!need(box,APP)) return {};
    const T=window.TREE, el=APP.el;
    box.append(css(APP,`
      .par-bg{position:absolute;inset:0;background:linear-gradient(160deg,#FFF8EA,#F3EBDB)}
      .par-two{position:absolute;inset:0}
      .par-col{position:absolute;top:200px;width:880px;display:flex;flex-direction:column;align-items:center}
      .par-rib{display:flex;gap:18px;align-items:stretch;margin-top:6px}
      .par-seg{display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 20px 14px;border-radius:24px;background:#FFFDF7;border:6px solid #E2D6BE;transition:border-color .4s,box-shadow .4s}
      .par-seg .row{display:flex;gap:20px;align-items:center;height:76px}
      .par-seg small{font:600 40px/1 var(--display);color:var(--inkSoft)}
      .par-g{display:flex;flex-direction:column;align-items:center;gap:6px;width:112px}
      .par-g span{font:600 30px/1 var(--display);color:var(--inkSoft)}
      .par-seg.same{border-color:#7AC143;box-shadow:0 0 0 6px rgba(122,193,67,.35)}
      .par-eq{position:absolute;left:910px;top:735px;width:100px;text-align:center;font:700 120px/1 var(--display);color:#4E8F2A}
      .par-count{position:absolute;left:1420px;top:250px;width:400px;height:430px;display:flex;flex-direction:column;align-items:center;justify-content:center}
      .par-count small{font:600 48px var(--display);color:var(--inkSoft)}
      .par-count b{font:700 230px/1 var(--display);color:var(--ink)}
      .par-sum{position:absolute;inset:0}
      .par-line{position:absolute;left:170px;width:1580px;top:640px;height:14px;border-radius:7px;background:linear-gradient(90deg,#7AC143,#F2C230 50%,#C9C1B0)}
      .par-tick{position:absolute;top:676px;width:80px;margin-left:-40px;text-align:center;font:700 56px var(--display);color:var(--ink)}
      .par-end{position:absolute;top:760px;font:700 54px var(--display)}
      .par-card{position:absolute;top:300px;width:240px;height:300px;margin-left:-120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
      .par-card:after{content:"";position:absolute;bottom:-40px;left:50%;margin-left:-14px;border:14px solid transparent;border-top:26px solid #FFFDF7}
    `));
    const bg=el("div",{class:"par-bg"});
    const title=el("h1",{class:"fam-h1"});
    // --- vista 1: dos perros distintos con sus partes del ADN ---
    const dogs=[["rojo","rojo","rojo"],["azul","azul","amarillo"]];
    const segLook=[], segDog=[];
    const two=el("div",{class:"par-two"});
    dogs.forEach(([e,c,t],i)=>{
      const look=el("div",{class:"par-seg"},
        el("div",{class:"row"},...[["orejas",e],["pelo",c],["cola",t]].map(([n,k])=>el("div",{class:"par-g"},gomet(APP,k,62),el("span",{text:n})))),
        el("small",{text:"cómo soy"}));
      const sp=el("div",{class:"par-seg"},el("div",{class:"row"},strip(APP,T.dna.perro,62,8)),el("small",{html:"«soy un perro»"}));
      segLook.push(look); segDog.push(sp);
      two.append(el("div",{class:"par-col",style:{left:(i?1000:40)+"px"}},
        pic(APP,"perro",440,363,APP.dog.svg(e,c,t)),el("div",{class:"par-rib"},look,sp)));
    });
    const eq=el("div",{class:"par-eq",text:"="});
    two.append(eq);
    // --- vista 2: comparar ---
    const cmp=makeCompare(APP,{a:"perro",b:"lobo",picW:300,picH:248,sq:116,gap:24,rowGap:50});
    Object.assign(cmp.el.style,{left:"90px",top:"230px"});
    const num=el("b",{text:"?"});
    const count=el("div",{class:"par-count fam-paper"},el("small",{text:"diferencias"}),num);
    const msg=el("div",{class:"fam-msg",style:{top:"880px"}});
    const sum=el("div",{class:"par-sum"});
    box.append(bg,title,two,cmp.el,count,msg,sum);

    let step=0, token=0;
    const say=h=>{ msg.innerHTML=h; fadeIn(APP,msg,0,16); };
    function buildSummary(anim){
      sum.replaceChildren();
      const X=d=>210+d*250;
      const items=[["perro","perro",0,APP.dog.svg(...dogs[0]),APP.dog.svg(...dogs[1])],["perro","lobo",1],["perro","gallina",T.diff("perro","gallina")]];
      sum.append(el("div",{class:"par-line"}));
      items.forEach(([a,b,d,sa,sb],i)=>{
        const c=el("div",{class:"par-card fam-paper",style:{left:X(d)+"px"}},pic(APP,a,200,140,sa),pic(APP,b,200,140,sb));
        sum.append(c); if(anim) pop(APP,c,200+i*250);
      });
      for(let d=0;d<=6;d++) sum.append(el("div",{class:"par-tick",style:{left:X(d)+"px"},text:String(d)}));
      sum.append(el("div",{class:"par-end",style:{left:"170px",color:"#4E8F2A"},text:"familia cercana"}),
                 el("div",{class:"par-end",style:{right:"170px",color:"#8A8172"},text:"familia lejana"}));
    }
    async function compare(anim,after){
      const t=token; num.textContent="0";
      const n=await cmp.run(()=>t===token,(k,a)=>{ num.textContent=k; if(a) bump(APP,num); },!anim);
      if(t===token) after(n);
    }
    function show(s,anim){
      token++; step=s; const t=token;
      two.hidden=s>1; cmp.el.hidden=count.hidden=!(s===2||s===3); sum.hidden=s!==4;
      msg.style.top=s<=1?"905px":"880px";
      if(s<=1){
        title.innerHTML=s===0?"Nuestro ADN tiene <span>muchas partes</span>":"Una parte dice: <span>«soy un perro»</span>";
        segDog.forEach(x=>{ x.style.visibility=s>=1?"visible":"hidden"; x.classList.toggle("same",s>=1); });
        eq.hidden=s<1;
        if(s===0) say("Unas partes dicen cómo son las <b>orejas</b>, el <b>pelo</b> y la <b>cola</b>. ¡Por eso son distintos!");
        else { say("Esa parte es <b>igual</b> en todos los perros."); if(anim){ segDog.forEach((x,i)=>pop(APP,x,i*200)); pop(APP,eq,600); } }
        return;
      }
      if(s===2||s===3){
        const b=s===2?"lobo":"gallina";
        title.innerHTML=s===2?"Perro y <span>lobo</span>":"Perro y <span>gallina</span>";
        cmp.setB(b,anim&&s===3); num.textContent="?";
        say(s===2?"¿Cuántas casillas son distintas?":"¿Y ahora?");
        (async()=>{ if(anim&&!APP.reduced()) await APP.sleep(900); if(t!==token) return;
          compare(anim,n=>{
            if(s===2){ say(`¡Solo <b>1 diferencia</b>! Parientes muy cercanos… pero <b>especies distintas</b>.`); if(anim) APP.audio.ok(); }
            else say(`¡<b>${n} diferencias</b>! Familia lejana.`);
          }); })();
        return;
      }
      title.innerHTML="ADN parecido = <span>familia cercana</span>";
      buildSummary(anim);
      say("<b>Menos diferencias</b> = más familia.");
    }
    show(0,true);
    return {
      next(){ if(step>=4) return false; show(step+1,true); return true; },
      prev(){ if(step<=0) return false; show(step-1,false); return true; },
      destroy(){ token++; }
    };
  }
});

// =====================================================================
// 75 · busca-familia (instrucciones)
// =====================================================================
function kidsSVG(APP,n,joined){
  const skins=["#E9B892","#C68E62","#F1CBA6","#8D5B3E","#DDAA7E"], shirts=["#29ABE2","#F7931E","#7AC143","#E04B3A","#9A7BC2"], hairs=["#5A3E2B","#2B2220","#A0662E","#3A2A20","#7A4B35"];
  const sh=[]; const eyes=[]; const W=n*100;
  for(let i=0;i<n;i++){
    const x=50+i*100;
    if(!joined) sh.push(APP.L(`M${x-22} 116 L${x-34} 52`,skins[i%5],11),APP.L(`M${x+22} 116 L${x+34} 52`,skins[i%5],11));
    sh.push(APP.R(x-16,176,13,40,6,"#3E4A6B"),APP.R(x+3,176,13,40,6,"#3E4A6B"));
    sh.push(APP.R(x-28,104,56,82,22,shirts[i%5]));
    sh.push(APP.C(x,78,27,skins[i%5]),APP.P(`M${x-27} 76 Q${x-26} 50 ${x} 50 Q${x+26} 50 ${x+27} 76 Q${x+14} 62 ${x} 64 Q${x-14} 62 ${x-27} 76 Z`,hairs[i%5]));
    sh.push(APP.LN(`M${x-7} 90 Q${x} 96 ${x+7} 90`,"#7A4B35",3));
    eyes.push([x-9,80],[x+9,80]);
  }
  if(joined){ for(let i=0;i<n;i++){ const x=50+i*100; sh.push(APP.L(`M${x-24} 120 L${x-50} 150`,skins[i%5],11),APP.L(`M${x+24} 120 L${x+50} 150`,skins[i%5],11)); } }
  return APP.paperSVG(sh,{vb:`0 40 ${W} 180`,eyes,eyeR:4.5,label:joined?"Niños dados de la mano":"Niños sosteniendo un cartel"});
}
function sign(APP,id,sq,picH){
  const T=window.TREE;
  return APP.el("div",{class:"bf-sign fam-paper"},pic(APP,id,picH*1.2,picH),strip(APP,T.dna[id],sq,Math.round(sq*0.18)));
}
SC.push({
  id:"busca-familia", title:"¡Busca a tu pareja!", order:75,
  mount(box,APP){
    if(!need(box,APP)) return {};
    const T=window.TREE, el=APP.el;
    box.append(css(APP,`
      .bf-bg{position:absolute;inset:0;background:linear-gradient(160deg,#EEF8FD,#F6F1E6)}
      .bf-cards{position:absolute;left:60px;right:60px;top:200px;bottom:44px;display:flex;gap:40px}
      .bf-card{flex:1;position:relative;display:flex;flex-direction:column;align-items:center;padding:34px 26px 30px}
      .bf-n{position:absolute;left:-14px;top:-26px;width:104px;height:104px;border-radius:50%;background:var(--orange);color:#fff;font:700 66px/104px var(--display);text-align:center;box-shadow:2px 4px 0 rgba(90,74,48,.2)}
      .bf-art{flex:1;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px}
      .bf-txt{font:600 50px/1.15 var(--display);color:var(--ink);text-align:center;min-height:180px;display:flex;align-items:center}
      .bf-txt b{color:var(--orange)}
      .bf-sign{display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 18px;border-radius:18px;border:5px solid #E2D6BE}
      .bf-vs{display:flex;align-items:center;gap:14px;font:700 60px var(--display);color:var(--inkSoft)}
      .bf-demo{position:absolute;inset:0}
      .bf-sub{position:absolute;left:90px;top:170px;font:600 52px var(--display);color:var(--inkSoft)}
      .bf-lab{position:absolute;left:60px;font:700 44px var(--display);color:var(--inkSoft)}
      .bf-board{position:absolute;left:1300px;top:300px;width:580px;display:flex;flex-direction:column;gap:30px}
      .bf-score{display:flex;align-items:center;gap:20px;padding:16px 26px;transition:opacity .4s,box-shadow .4s}
      .bf-score b{font:700 110px/1 var(--display);color:var(--ink);min-width:80px;text-align:center}
      .bf-score span{font:600 44px var(--display);color:var(--inkSoft)}
      .bf-score.win{box-shadow:0 0 0 10px #7AC143,0 10px 30px rgba(0,0,0,.15)}
      .bf-score.lose{opacity:.45}
    `));
    const bg=el("div",{class:"bf-bg"});
    const title=el("h1",{class:"fam-h1"});
    const c1=el("div",{class:"bf-card fam-paper"},el("div",{class:"bf-n",text:"1"}),
      el("div",{class:"bf-art"},sign(APP,"gato",48,170),el("div",{class:"fam-pic",style:{width:"400px",height:"180px"},html:kidsSVG(APP,4,false)})),
      el("div",{class:"bf-txt"},el("span",{html:"Cada grupo tiene <b>un cartel</b>: un animal y su ADN"})));
    const c2=el("div",{class:"bf-card fam-paper"},el("div",{class:"bf-n",text:"2"}),
      el("div",{class:"bf-art"},sign(APP,"gato",40,130),el("div",{class:"bf-vs",text:"?"}),sign(APP,"perro",40,130)),
      el("div",{class:"bf-txt"},el("span",{html:"Comparad vuestra tira con la de <b>otros grupos</b>"})));
    const c3=el("div",{class:"bf-card fam-paper"},el("div",{class:"bf-n",text:"3"}),
      el("div",{class:"bf-art"},el("div",{style:{display:"flex",gap:"16px"}},sign(APP,"gato",30,110),sign(APP,"leon",30,110)),
        el("div",{class:"fam-pic",style:{width:"400px",height:"180px"},html:kidsSVG(APP,4,true)})),
      el("div",{class:"bf-txt"},el("span",{html:"¿Solo <b>1 diferencia</b>? ¡Sois pareja! Juntaos"})));
    const cards=el("div",{class:"bf-cards"},c1,c2,c3);
    // demo
    const demo=el("div",{class:"bf-demo",hidden:true});
    const cmp=makeCompare(APP,{a:"gato",b:"perro",picW:230,picH:190,sq:92,gap:16,rowGap:60});
    Object.assign(cmp.el.style,{left:"270px",top:"330px"});
    const labA=el("div",{class:"bf-lab",style:{top:"390px"},text:"Nosotros"});
    const labB=el("div",{class:"bf-lab",style:{top:"640px"},text:"¿Ellos?"});
    const scoreEl=id=>{ const b=el("b",{text:"?"}), l=el("span",{text:"diferencias"}); const r=el("div",{class:"bf-score fam-paper"},pic(APP,id,190,157),b,l); r.num=b; r.lab=l; return r; };
    const sPerro=scoreEl("perro"), sLeon=scoreEl("leon");
    const board=el("div",{class:"bf-board"},sPerro,sLeon);
    const msg=el("div",{class:"fam-msg",style:{top:"905px",fontSize:"56px"}});
    demo.append(el("div",{class:"bf-sub",text:"Ejemplo: somos el gato. ¿Quién es nuestra pareja?"}),labA,labB,cmp.el,board,msg);
    box.append(bg,title,cards,demo);

    let step=0, token=0;
    const say=h=>{ msg.innerHTML=h; fadeIn(APP,msg,0,16); };
    async function runAgainst(score,anim){
      const t=token; score.num.textContent="0";
      const n=await cmp.run(()=>t===token,(k,a)=>{ score.num.textContent=k; score.lab.textContent=k===1?"diferencia":"diferencias"; if(a) bump(APP,score.num); },!anim);
      return t===token?n:-1;
    }
    function show(s,anim){
      token++; step=s; const t=token;
      const demoMode=s>=3;
      cards.hidden=demoMode; demo.hidden=!demoMode;
      title.innerHTML=demoMode?"¿Quién tiene <span>solo 1 diferencia</span>?":"¡Busca a tu <span>pareja</span>!";
      if(!demoMode){
        [c1,c2,c3].forEach((c,i)=>{ c.style.visibility=i<=s?"visible":"hidden"; });
        if(anim) pop(APP,[c1,c2,c3][s]);
        return;
      }
      if(anim&&s===3) fadeIn(APP,demo,0,30);
      sPerro.className=sLeon.className="bf-score fam-paper"; msg.textContent="";
      if(s===3){ cmp.setB("perro",false); sPerro.num.textContent="?"; sLeon.num.textContent="?";
        (async()=>{ if(anim&&!APP.reduced()) await APP.sleep(700); if(t!==token) return;
          const n=await runAgainst(sPerro,anim); if(n>=0) { say(`Gato y perro: <b>${n} diferencias</b>. ¡No! Seguimos buscando…`); sPerro.classList.add("lose"); } })(); }
      if(s===4){ sPerro.num.textContent=String(T.diff("gato","perro")); sPerro.classList.add("lose"); cmp.setB("leon",anim); sLeon.num.textContent="?";
        (async()=>{ if(anim&&!APP.reduced()) await APP.sleep(800); if(t!==token) return;
          const n=await runAgainst(sLeon,anim); if(n<0) return;
          sLeon.classList.add("win"); say("Gato y león: ¡solo <b>1 diferencia</b>! ¡Somos pareja!");
          if(anim){ APP.audio.ok(); bump(APP,sLeon); } })(); }
    }
    show(0,true);
    return {
      next(){ if(step>=4) return false; show(step+1,true); return true; },
      prev(){ if(step<=0) return false; show(step-1,false); return true; },
      destroy(){ token++; }
    };
  }
});

// =====================================================================
// 80 · arbol: parejas + los 5 animales que saca el adulto
// =====================================================================
// Hojas abajo (15 columnas), el árbol crece hacia arriba.
const COLW=124, X0=(1920-15*COLW)/2, CW=118, PIC_W=114, PIC_H=94, SQ=40, SQG=5;
const CARD_H=8+PIC_H+8+6*SQ+5*SQG+10, CARD_T=1080-14-CARD_H;
const LVL=78, levelY=h=>CARD_T-26-h*LVL;
const BRANCH={prim:"#E08A2E",perros:"#E08A2E",gatos:"#E08A2E",cet:"#E08A2E",mam:"#E08A2E",aves:"#5FA040",dino:"#5FA040",arco:"#7D9A5A",amn:"#7B7E86",tetra:"#7B7E86",vert:"#7B7E86"};
SC.push({
  id:"arbol", title:"El árbol de la vida", order:80,
  mount(box,APP){
    if(!need(box,APP)) return {};
    const T=window.TREE, el=APP.el, NS="http://www.w3.org/2000/svg";
    const NREV=T.reveals.length, LAST=2+2*NREV;   // 0 inicio, 1 parejas, 2..11 pregunta/respuesta de cada animal, 12 árbol final
    box.append(css(APP,`
      .ar-bg{position:absolute;inset:0;background:linear-gradient(170deg,#FBF7EE,#F1E9D8)}
      .ar-head{position:absolute;left:40px;right:40px;top:16px;text-align:center;pointer-events:none}
      .ar-title{font:700 64px/1.1 var(--display);color:var(--ink)}
      .ar-title b,.ar-title span{color:var(--orange);font-weight:700}
      .ar-msg{margin-top:8px;font:600 46px/1.15 var(--display);color:var(--inkSoft)}
      .ar-msg b{color:var(--orange)}
      .ar-svg{position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;overflow:visible}
      .ar-card{position:absolute;top:${CARD_T}px;width:${CW}px;height:${CARD_H}px;display:flex;flex-direction:column;align-items:center;gap:8px;padding-top:8px;box-sizing:border-box;border-radius:18px;background:#FFFDF7;box-shadow:2px 3px 0 rgba(90,74,48,.12),0 4px 12px rgba(90,74,48,.14);cursor:pointer;transition:opacity .3s,box-shadow .3s}
      .ar-card.ghost{background:rgba(255,253,247,.5);box-shadow:none;border:5px dashed #C9BFA8;cursor:default}
      .ar-card.ghost>*{visibility:hidden}
      .ar-card.ghost:after{content:"?";position:absolute;left:0;right:0;top:120px;text-align:center;font:700 110px var(--display);color:#C9BFA8}
      .ar-card.hit{box-shadow:0 0 0 8px #7AC143,0 6px 18px rgba(0,0,0,.2)}
      .ar-card.hit.pulse{animation:arPulse 1s ease-in-out 3}
      @keyframes arPulse{50%{transform:translateY(-14px)}}
      .ar-card.sel{box-shadow:0 0 0 8px var(--orange),0 6px 18px rgba(0,0,0,.2)}
      .ar-card.dim{opacity:.45}
      .ar-badge{position:absolute;right:-16px;top:-26px;width:62px;height:62px;border-radius:50%;background:#1F2A44;color:#fff;font:700 42px/62px var(--display);text-align:center;box-shadow:1px 2px 4px rgba(0,0,0,.3)}
      .ar-card.hit .ar-badge{background:#4E8F2A}
      .ar-big{position:absolute;left:300px;top:168px;width:1320px;height:390px;display:flex;align-items:center;gap:40px;padding:0 50px;box-sizing:border-box;cursor:pointer;transform-origin:0 0}
      .ar-big .nm{font:700 96px/1 var(--display);color:var(--ink);margin-bottom:26px}
      .ar-big .tag{display:inline-block;margin-left:24px;vertical-align:middle;font:600 36px/1 var(--display);color:#fff;background:#8A6FB3;border-radius:999px;padding:10px 22px}
      .ar-lab{position:absolute;transform:translate(-50%,-50%);white-space:nowrap;font:700 44px/1 var(--display);color:#fff;padding:10px 24px;border-radius:999px;box-shadow:2px 4px 0 rgba(90,74,48,.2);pointer-events:none}
      @media (prefers-reduced-motion:reduce){.ar-card.hit.pulse{animation:none}}
    `));
    const bg=el("div",{class:"ar-bg"});
    const title=el("div",{class:"ar-title"}), msg=el("div",{class:"ar-msg"});
    const head=el("div",{class:"ar-head"},title,msg);
    const svgFront=APP.svg(`<svg class="ar-svg" viewBox="0 0 1920 1080" xmlns="${NS}"><defs><filter id="arShadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="1.5" dy="2.5" stdDeviation="1.2" flood-color="#5a4a30" flood-opacity="0.4"/></filter></defs><g class="ar-branches" filter="url(#arShadow)"></g></svg>`);
    const gBr=svgFront.querySelector(".ar-branches");
    const layer=el("div",{style:{position:"absolute",inset:0}});
    const labels=el("div",{style:{position:"absolute",inset:0,pointerEvents:"none"}});
    const big=el("div",{class:"ar-big fam-paper",hidden:true,onclick:e=>{e.stopPropagation(); if(isQ(step)) advance();}});
    box.append(bg,svgFront,layer,labels,head,big);

    // ---- geometría ----
    const isNode=id=>!!T.nodes[id];
    const colX=id=>X0+T.leaves.indexOf(id)*COLW+COLW/2;
    const nodeX=id=>{ if(!isNode(id)) return colX(id); const xs=T.nodes[id].children.map(nodeX); return (Math.min(...xs)+Math.max(...xs))/2; };
    const topY=id=>isNode(id)?levelY(T.nodes[id].level):CARD_T;

    // ---- tarjetas (icono grande + tira vertical) ----
    const cards={};
    for(const id of T.leaves){
      const badge=el("div",{class:"ar-badge",hidden:true});
      const c=el("div",{class:"ar-card","data-id":id,title:T.names[id],style:{left:(colX(id)-CW/2)+"px"},
        onclick:e=>{ e.stopPropagation(); if(!c.classList.contains("ghost")) select(id); }},
        pic(APP,id,PIC_W,PIC_H),strip(APP,T.dna[id],SQ,SQG,true),badge);
      c.badge=badge; cards[id]=c; layer.append(c);
    }
    box.addEventListener("click",()=>{ if(selected) select(null); });

    // ---- ramas (hacia arriba) ----
    function svgEl(tag,attrs){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); return e; }
    function drawNode(id,anim,delay=0){
      const n=T.nodes[id], y=levelY(n.level), col=BRANCH[id]||"#7B7E86", x=nodeX(id);
      const xs=n.children.map(nodeX), g=svgEl("g",{"data-node":id});
      const ups=n.children.map(c=>svgEl("path",{d:`M${nodeX(c)} ${topY(c)} V${y}`,stroke:col,"stroke-width":10,"stroke-linecap":"round",fill:"none",pathLength:1}));
      const bar=svgEl("path",{d:`M${Math.min(...xs)} ${y} H${Math.max(...xs)}`+(id===T.root?` M${x} ${y} V${y-36}`:""),stroke:col,"stroke-width":10,"stroke-linecap":"round",fill:"none",pathLength:1});
      const dot=svgEl("circle",{cx:x,cy:y,r:13,fill:col});
      g.append(...ups,bar,dot); gBr.append(g);
      if(anim&&!APP.reduced()){
        for(const p of ups){ p.style.strokeDasharray="1 1"; p.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:450,delay,easing:"ease-out",fill:"both"}); }
        bar.style.strokeDasharray="1 1"; bar.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:420,delay:delay+400,easing:"ease-out",fill:"both"});
        dot.style.transformOrigin=`${x}px ${y}px`;
        dot.animate([{transform:"scale(0)"},{transform:"scale(1.4)"},{transform:"scale(1)"}],{duration:380,delay:delay+750,fill:"both",easing:"ease-out"});
      }
    }
    function drawLabels(anim){
      labels.replaceChildren();
      T.clades.forEach((cl,i)=>{
        let x,y;
        if(cl.node){ x=nodeX(cl.node)+(cl.node==="dino"?-200:0); y=levelY(T.nodes[cl.node].level)-50; }
        else { const k=T.leaves.indexOf(cl.members[0])-12; x=colX(cl.members[0]); y=levelY(1)+40-k*92; }
        const l=el("div",{class:"ar-lab",style:{left:x+"px",top:y+"px",background:cl.color},text:cl.label});
        labels.append(l); if(anim) pop(APP,l,i*250);
      });
    }

    // ---- estado de cada paso ----
    const isQ=s=>s>=2&&s<LAST&&s%2===0;           // pregunta: el animal grande en el centro
    const revOf=s=>Math.floor((s-2)/2);             // índice del animal del adulto
    const revealedBy=s=>s<2?0:Math.min(NREV,Math.floor((s-1)/2)); // nº de animales del adulto ya colocados
    function nodesBy(s){ const out=[]; for(const [id,n] of Object.entries(T.nodes)){ if(n.reveal===0?s>=1:n.reveal<=revealedBy(s)) out.push(id); } return out; }
    function inPlay(s){ return T.kids.concat(T.adults.slice(0,revealedBy(s))); }
    function clearMarks(){ for(const id of T.leaves){ const c=cards[id]; c.classList.remove("hit","pulse","sel","dim"); c.badge.hidden=true; } }
    function marks(s,anim){
      clearMarks();
      if(s===1){ for(const id of T.kids){ cards[id].badge.textContent="1"; cards[id].badge.hidden=false; cards[id].classList.add("hit"); } return; }
      if(s<3||isQ(s)||s>=LAST) return;
      const i=revOf(s), r=T.reveals[i], hits=T.answerers(i);
      for(const id of inPlay(s)){ if(id===r.id) continue; const c=cards[id];
        if(!hits.includes(id)) continue;
        c.badge.textContent=T.diff(r.id,id); c.badge.hidden=false;
        if(!r.min){ c.classList.add("hit"); if(anim&&!APP.reduced()) c.classList.add("pulse"); }
      }
    }
    function fillBig(i){
      const r=T.reveals[i];
      big.replaceChildren(pic(APP,r.id,400,330),
        el("div",{},el("div",{class:"nm"},cap(T.names[r.id])),strip(APP,T.dna[r.id],104,14)));
    }
    function setText(s){
      if(s===0){ title.innerHTML="¿Quién tiene <b>solo 1 diferencia</b>?"; msg.innerHTML="Cada grupo busca a su pareja."; }
      else if(s===1){ title.innerHTML="¡Las <b>parejas</b>! Solo 1 diferencia"; msg.innerHTML="Ahora llegan <b>otros animales</b>…"; }
      else if(s>=LAST){ title.innerHTML="¡El <span>árbol de la vida</span>!"; msg.innerHTML="<b>Menos diferencias</b> = familia más cercana."; }
      else { const r=T.reveals[revOf(s)];
        if(isQ(s)){ title.innerHTML=r.q; msg.innerHTML="Mirad vuestra tira y contad las diferencias."; }
        else { title.innerHTML=r.a; msg.innerHTML=r.msg; } }
    }
    function applyState(s){
      token++; step=s; selected=null;
      const placed=inPlay(s);
      for(const id of T.leaves){ const c=cards[id]; c.getAnimations().forEach(a=>a.cancel()); c.classList.toggle("ghost",!placed.includes(id)); c.style.opacity=""; }
      big.getAnimations().forEach(a=>a.cancel());
      big.hidden=!isQ(s); if(isQ(s)) fillBig(revOf(s));
      gBr.replaceChildren(); for(const id of nodesBy(s)) drawNode(id,false);
      if(s>=LAST) drawLabels(false); else labels.replaceChildren();
      marks(s,false); setText(s);
    }

    // ---- selección: clic en un animal → diferencias con todos los que están en juego ----
    let selected=null;
    function select(id){
      if(id===null||id===selected){ applyState(step); return; }
      if(isQ(step)) return;
      applyState(step); selected=id;
      clearMarks();
      const others=inPlay(step).filter(k=>k!==id); if(!others.length) return;
      const min=Math.min(...others.map(k=>T.diff(id,k))), near=others.filter(k=>T.diff(id,k)===min);
      cards[id].classList.add("sel");
      for(const k of others){ const c=cards[k]; c.badge.textContent=T.diff(id,k); c.badge.hidden=false; c.classList.add(near.includes(k)?"hit":"dim"); }
      title.innerHTML=`${cap(T.names[id])} → <span>${listY(near.map(k=>T.names[k]))}</span>`;
      msg.innerHTML=`${min===1?"Solo 1 diferencia":min+" diferencias"}: su familia más cercana.`;
    }

    // ---- avanzar con animación ----
    let step=0, token=0;
    function advance(){
      if(step>=LAST) return false;
      const s=step+1; applyState(s);           // estado final, luego se anima lo nuevo
      if(APP.reduced()){ if(s===1||(!isQ(s)&&s<LAST)) APP.audio.ok(); return true; }
      const t=token, alive=()=>t===token;
      if(s===1){
        clearMarks(); gBr.replaceChildren();
        T.pairs.forEach((p,k)=>drawNode(T.parentOf(p[0]),true,k*180));
        (async()=>{ await APP.sleep(1300); if(!alive()) return; marks(1,true); for(const id of T.kids) pop(APP,cards[id].badge); APP.audio.ok(); })();
      } else if(isQ(s)){
        big.style.transformOrigin="50% 50%";
        big.animate([{opacity:0,transform:"scale(.7)"},{opacity:1,transform:"scale(1.03)",offset:.7},{opacity:1,transform:"none"}],{duration:550,easing:"ease-out"});
      } else if(s<LAST){
        const i=revOf(s), r=T.reveals[i], c=cards[r.id];
        // 1) se encienden los que tienen N diferencias (el animal grande sigue en el centro)
        fillBig(i); big.hidden=false; big.style.transformOrigin="0 0";
        c.classList.add("ghost"); clearMarks(); gBr.replaceChildren();
        for(const id of nodesBy(s-1)) drawNode(id,false);
        title.innerHTML=r.q; msg.innerHTML="";
        (async()=>{
          await APP.sleep(250); if(!alive()) return;
          marks(s,true); for(const id of T.answerers(i)) pop(APP,cards[id].badge);
          title.innerHTML=r.a;
          await APP.sleep(1700); if(!alive()) return;
          // 2) el animal grande baja a su sitio
          const bx=300, by=168, sc=CW/1320, tx=colX(r.id)-CW/2, ty=CARD_T;
          const a=big.animate([{transform:"none",opacity:1},{transform:`translate(${tx-bx}px,${ty-by}px) scale(${sc})`,opacity:.3}],{duration:700,easing:"cubic-bezier(.5,0,.3,1)",fill:"forwards"});
          await a.finished.catch(()=>{}); if(!alive()) return;
          big.hidden=true; a.cancel(); c.classList.remove("ghost"); pop(APP,c);
          // 3) se dibuja la rama
          T.reveals[i].nodes.forEach((id,k)=>drawNode(id,true,k*900));
          await APP.sleep(900*T.reveals[i].nodes.length); if(!alive()) return;
          APP.audio.ok(); msg.innerHTML=r.msg; fadeIn(APP,msg,0,16);
        })();
      } else drawLabels(true);
      return true;
    }
    applyState(0);
    return {
      next(){ if(step>=LAST) return false; advance(); return true; },
      prev(){ if(step<=0) return false; applyState(step-1); return true; },
      destroy(){ token++; }
    };
  }
});
})();
