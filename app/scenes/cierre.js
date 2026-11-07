/* Escena 90 · cierre */
(window.SCENES=window.SCENES||[]).push({
  id:"cierre", title:"¡Hoy habéis sido científicos!", order:90,
  mount(box,APP){
    const {el,T,GOMET,dog,audio}=APP;
    box.append(el("style",{text:`
      .ci{position:absolute;inset:0;background:linear-gradient(170deg,#FFF6E4,#F6F1E6 60%,#EFE5D2);overflow:hidden}
      .ci-h{position:absolute;left:0;right:0;top:70px;text-align:center;margin:0;font-family:var(--display);font-weight:700;font-size:118px;line-height:1.05;color:var(--ink)}
      .ci-h span{color:var(--orange)}
      .ci-ideas{position:absolute;left:110px;right:110px;top:260px;display:grid;grid-template-columns:repeat(3,1fr);gap:40px}
      .ci-i{background:#fff;border-radius:40px;padding:34px 30px;display:flex;flex-direction:column;align-items:center;gap:18px;box-shadow:0 8px 0 rgba(90,74,48,.10);opacity:0;transform:translateY(30px);transition:all .5s cubic-bezier(.2,1.4,.4,1)}
      .ci-i.on{opacity:1;transform:none}
      .ci-i .ic{width:200px;height:170px;display:flex;align-items:center;justify-content:center}
      .ci-i .ic svg{max-width:100%;max-height:100%}
      .ci-i p{margin:0;text-align:center;font-family:var(--display);font-weight:600;font-size:52px;line-height:1.12;color:var(--ink)}
      .ci-dogs{position:absolute;left:0;right:0;bottom:140px;height:250px;overflow:hidden}
      .ci-track{position:absolute;bottom:10px;display:flex;align-items:flex-end;gap:26px;animation:ciRun 40s linear infinite}
      .ci-track>div{flex:none;display:flex;flex-direction:column;align-items:center}
      .ci-track svg{width:200px;height:auto}
      .ci-tw{display:flex;gap:6px;background:#FFF1DC;border-radius:30px;padding:0 14px;box-shadow:0 0 0 6px var(--orange)}
      .ci-tw svg{width:170px}
      .ci-tw-l{font-family:var(--display);font-weight:700;font-size:40px;line-height:1;color:var(--orange);margin-bottom:12px}
      @keyframes ciRun{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      .ci-logo{position:absolute;left:50%;bottom:28px;transform:translateX(-50%);height:100px;background:#fff;padding:12px 22px;border-radius:22px}
      .ci-bye{position:absolute;right:90px;bottom:40px;margin:0;font-family:var(--display);font-weight:700;font-size:70px;color:var(--green)}
      .ci-conf{position:absolute;top:-40px;border-radius:6px;animation:ciFall linear forwards}
      @keyframes ciFall{to{transform:translateY(1200px) rotate(720deg)}}
      @media (prefers-reduced-motion:reduce){.ci-track,.ci-conf{animation:none}}
    `}));
    const root=el("div",{class:"ci"});
    root.append(el("h1",{class:"ci-h",html:"¡Hoy habéis sido <span>científicos</span>!"}));
    const icon1=APP.paperSVG([APP.C(100,96,58,T.blue),APP.R(84,150,32,30,8,"#B7BCC9"),APP.P("M100 62 Q122 62 122 84 Q122 100 104 106 L104 120 L96 120 L96 100 Q112 96 112 84 Q112 72 100 72 Q88 72 88 84 L78 84 Q78 62 100 62 Z","#FFFFFF"),APP.C(100,134,7,"#FFFFFF")],{vb:"20 20 160 170"});
    const icon2=APP.paperSVG([APP.R(36,40,128,124,22,"#FFFFFF"),APP.R(56,64,88,14,7,T.orange),APP.C(64,110,14,GOMET.rojo),APP.C(100,110,14,GOMET.azul),APP.C(136,110,14,GOMET.amarillo),APP.R(56,138,60,10,5,"#E7E0D0")],{vb:"20 20 160 160"});
    const icon3=APP.paperSVG([APP.L("M100 170 L100 110 M100 110 L56 64 M100 110 L144 64 M56 64 L36 36 M56 64 L76 36 M144 64 L124 36 M144 64 L164 36","#8C6A4A",10),APP.C(36,36,13,T.green),APP.C(76,36,13,T.green),APP.C(124,36,13,T.orange),APP.C(164,36,13,T.orange)],{vb:"10 10 180 175"});
    const ideas=[[icon1,"Hacemos preguntas"],[icon2,"El ADN es una receta"],[icon3,"ADN parecido, familia cercana"]];
    const cards=ideas.map(([ic,t])=>el("div",{class:"ci-i"},el("div",{class:"ic",html:ic}),el("p",{text:t})));
    root.append(el("div",{class:"ci-ideas"},...cards));
    // desfile de perros: los que la clase añadió en el laboratorio (si no hay, unos de ejemplo). Los repetidos salen juntos: ¡GEMELOS!
    let saved=APP.store.perros;
    if(!saved){ try{ saved=JSON.parse(localStorage.getItem("dc-perros-clase")||"[]"); }catch(e){ saved=[]; } if(!Array.isArray(saved)) saved=[]; }
    const list=saved.length?saved:["rojo-rojo-rojo","azul-azul-azul","amarillo-amarillo-amarillo","azul-amarillo-rojo","rojo-azul-amarillo","amarillo-rojo-azul","azul-rojo-azul","rojo-amarillo-amarillo"];
    const groups=[]; const seen={};
    list.forEach(k=>{ if(seen[k]) seen[k].n++; else { seen[k]={k,n:1}; groups.push(seen[k]); } });
    const item=g=>{ const [e,c,t]=g.k.split("-");
      if(g.n<2) return el("div",{html:dog.svg(e,c,t)});
      return el("div",{},el("span",{class:"ci-tw-l",text:"¡GEMELOS!"}),el("div",{class:"ci-tw",html:dog.svg(e,c,t)+dog.svg(e,c,t)})); };
    const track=el("div",{class:"ci-track"});
    let reps=Math.max(2,Math.ceil(2200/(groups.length*226)))*1; if(reps%2) reps++;
    for(let r=0;r<reps;r++) groups.forEach(g=>track.append(item(g)));
    track.style.animationDuration=Math.max(30,groups.length*5)+"s";
    root.append(el("div",{class:"ci-dogs"},track));
    root.append(el("img",{class:"ci-logo",src:"img/elm.png",alt:"Institut-Escola Lluís Millet"}),el("p",{class:"ci-bye",text:"¡Gracias!"}),el("a",{href:"profes.html",target:"_blank",text:"Para los profes →",style:{position:"absolute",left:"40px",bottom:"30px",fontFamily:"var(--body)",fontSize:"28px",color:"var(--grey)",textDecoration:"none"}}));
    box.append(root);
    let step=0, timers=[];
    function reveal(){ cards.forEach((c,i)=>c.classList.toggle("on",i<step)); if(step===3) confetti(); }
    function confetti(){
      if(APP.reduced()) return; audio.win();
      const cols=[T.blue,T.orange,T.green,GOMET.rojo,GOMET.azul,GOMET.amarillo];
      for(let i=0;i<70;i++){ const s=14+Math.random()*22; const d=el("i",{class:"ci-conf",style:{left:Math.random()*1920+"px",width:s+"px",height:s*0.6+"px",background:cols[i%6],animationDuration:(2.5+Math.random()*2.5)+"s",animationDelay:(Math.random()*0.8)+"s"}}); root.append(d); timers.push(setTimeout(()=>d.remove(),6000)); }
    }
    timers.push(setTimeout(()=>{step=1;reveal();},600));
    return {next(){ if(step<3){step++;reveal();return true;} return false; },prev(){ if(step>0){step--;reveal();return true;} return false; },destroy(){timers.forEach(clearTimeout);}};
  }
});
