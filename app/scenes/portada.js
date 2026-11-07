/* Escena 35 · portada: va DESPUÉS de «¿Qué hace la ciencia?». Paso 0: «¿Y yo?» · paso 1: «Soy Uciel y soy científico» + perro (un ladrido). */
(window.SCENES=window.SCENES||[]).push({
  id:"portada", title:"¿Y yo? Soy Uciel", order:35,
  mount(box,APP){
    const {el,T,GOMET,dog,audio}=APP;
    box.append(el("style",{text:`
      .po{position:absolute;inset:0;background:radial-gradient(circle at 70% 40%,#FFF6E4 0,#F6F1E6 55%,#EFE5D2 100%);overflow:hidden}
      .po-logo{position:absolute;left:90px;top:70px;width:420px;height:auto;background:#fff;padding:22px 28px;border-radius:28px;box-shadow:0 6px 0 rgba(90,74,48,.12),0 14px 30px rgba(90,74,48,.12)}
      .po-dot{position:absolute;border-radius:50%;box-shadow:0 4px 0 rgba(0,0,0,.08),0 8px 16px rgba(90,74,48,.18);animation:poFloat 6s ease-in-out infinite}
      @keyframes poFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}
      .po-q{position:absolute;left:90px;top:330px;font-family:var(--display);font-weight:700;font-size:230px;line-height:1;color:var(--orange);margin:0;transition:all .6s cubic-bezier(.4,0,.2,1)}
      .po.on .po-q{top:322px;font-size:96px;color:var(--grey)}
      .po-r{opacity:0;transform:translateY(30px);transition:opacity .5s,transform .6s cubic-bezier(.3,1.5,.6,1)}
      .po.on .po-r{opacity:1;transform:none}
      .po.on .po-hi{transition-delay:.25s}.po.on .po-sub{transition-delay:.55s}.po.on .po-tag{transition-delay:.8s}.po.on .po-dog{transition-delay:.4s}
      .po-hi{position:absolute;left:90px;top:440px;font-family:var(--display);font-weight:700;font-size:150px;line-height:1;color:var(--ink);margin:0}
      .po-hi span{color:var(--orange)}
      .po-sub{position:absolute;left:96px;top:605px;font-family:var(--display);font-weight:500;font-size:84px;line-height:1.05;color:var(--ink);margin:0}
      .po-sub b{color:var(--blue);font-weight:700}
      .po-tag{position:absolute;left:96px;top:760px;display:flex;gap:18px}
      .po-tag p{margin:0;font-family:var(--display);font-weight:600;font-size:40px;padding:12px 30px;border-radius:999px;color:#fff}
      .po-dog{position:absolute;right:120px;bottom:90px;width:720px;cursor:pointer;transform-origin:50% 90%;animation:poWag 2.6s ease-in-out infinite}
      .po-dog svg{width:100%;height:auto;display:block}
      @keyframes poWag{0%,100%{transform:rotate(0)}50%{transform:rotate(-2deg)}}
      .po-bubble{position:absolute;right:560px;bottom:610px;background:#fff;border-radius:40px;padding:22px 34px;font-family:var(--display);font-weight:600;font-size:54px;color:var(--ink);box-shadow:0 6px 0 rgba(90,74,48,.12);opacity:0;transform:scale(.6);transition:all .25s}
      .po-bubble.on{opacity:1;transform:scale(1)}
      .po-bubble::after{content:"";position:absolute;right:60px;bottom:-26px;border:18px solid transparent;border-top:26px solid #fff}
      .po-hint{position:absolute;right:120px;bottom:36px;font-size:30px;color:var(--grey);font-family:var(--body)}
      @media (prefers-reduced-motion:reduce){.po-dot,.po-dog{animation:none}.po *{transition:none!important}}
    `}));
    const root=el("div",{class:"po"});
    const dots=[[1520,120,90,GOMET.rojo],[1700,300,60,GOMET.azul],[1340,250,46,GOMET.amarillo],[880,120,70,T.green],[1080,330,40,T.blue],[760,880,56,GOMET.amarillo],[640,980,34,T.orange],[1820,700,40,T.green]];
    dots.forEach(([x,y,s,c],i)=>root.append(el("i",{class:"po-dot",style:{left:x+"px",top:y+"px",width:s+"px",height:s+"px",background:c,animationDelay:(i*0.6)+"s"}})));
    const bubble=el("div",{class:"po-bubble",text:"¡Guau! ¡Hola!"});
    const d=el("div",{class:"po-r",style:{position:"absolute",inset:0,pointerEvents:"none"}},el("div",{class:"po-dog",html:dog.svg("azul","amarillo","azul"),style:{pointerEvents:"auto"}}));
    let hideT=0, barked=false, on=false;
    const say=()=>{ bubble.classList.add("on"); clearTimeout(hideT); hideT=setTimeout(()=>bubble.classList.remove("on"),1600); };
    d.firstChild.onclick=ev=>{ ev.stopPropagation(); say(); };
    root.append(
      el("img",{class:"po-logo",src:"img/elm.png",alt:"Institut-Escola Lluís Millet, El Masnou"}),
      el("h1",{class:"po-q",text:"¿Y yo?"}),
      el("p",{class:"po-hi po-r",html:"Soy <span>Uciel</span>"}),
      el("p",{class:"po-sub po-r",html:"y soy <b>científico</b>"}),
      el("div",{class:"po-tag po-r"},el("p",{text:"Día de la Ciencia",style:{background:T.green}}),el("p",{text:"1º y 2º",style:{background:T.orange}})),
      d,bubble
    );
    box.append(root);
    root.addEventListener("click",()=>APP.next());
    const show=v=>{ on=v; root.classList.toggle("on",v); if(v&&!barked){ barked=true; hideT=setTimeout(()=>{ audio.bark(1); say(); },700); } };
    return {
      next(){ if(!on){ show(true); return true; } return false; },
      prev(){ if(on){ show(false); bubble.classList.remove("on"); return true; } return false; },
      destroy(){ clearTimeout(hideT); }
    };
  }
});
