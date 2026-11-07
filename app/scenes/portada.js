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

/* Escena 37 · equipo: «Tengo un equipo en la UIC». Fotos reales (archivos locales img/equipo/*.jpg) en marcos redondos de cartulina.
   Al entrar: Uciel solo, en grande. Paso 1: aparece el resto del equipo, uno a uno. Paso 2: foto del grupo presentando pósteres + «¡La ciencia se hace en equipo!». */
(window.SCENES=window.SCENES||[]).push({
  id:"equipo", title:"Mi equipo", order:37,
  mount(box,APP){
    const {el,T,GOMET,audio}=APP, red=APP.reduced();
    const PEOPLE=[ // nombre, archivo, color del marco de cartulina
      ["Nicolás","nicolas",T.blue],["Jorge","jorge",T.green],["Clara","clara",GOMET.amarillo],
      ["Uciel","uciel",T.orange],
      ["Santiago","santiago",GOMET.rojo],["Fernando","fernando",GOMET.azul],["Júlia","julia",T.pink]
    ];
    const UI=3; // índice de Uciel (en el centro)
    box.append(el("style",{text:`
      .eq{position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,#FFF6E4 0,#F6F1E6 60%,#EFE5D2 100%);overflow:hidden;cursor:pointer}
      .eq-dot{position:absolute;border-radius:50%;opacity:.55;box-shadow:0 4px 0 rgba(0,0,0,.06)}
      .eq-title{position:absolute;left:0;right:0;top:46px;margin:0;text-align:center;font-family:var(--display);font-weight:700;font-size:104px;line-height:1;color:var(--ink)}
      .eq-title b{color:var(--orange);font-weight:700}
      .eq-p{position:absolute;left:0;top:0;transform:translate(-50%,-50%) rotate(var(--rot)) scale(var(--sc,1));transition:left .8s cubic-bezier(.5,0,.2,1),top .8s cubic-bezier(.5,0,.2,1),width .8s cubic-bezier(.5,0,.2,1),height .8s cubic-bezier(.5,0,.2,1),transform .55s cubic-bezier(.3,1.6,.5,1),opacity .3s}
      .eq-p.hid{--sc:0;opacity:0}
      .eq-ring{position:absolute;inset:0;border-radius:50%;background:var(--c);box-shadow:0 7px 0 rgba(90,74,48,.16),0 16px 30px rgba(90,74,48,.22)}
      .eq-ph{position:absolute;inset:7%;border-radius:50%;background:#FFFDF7;padding:4.5%;box-sizing:border-box}
      .eq-ph i{position:absolute;inset:4.5%;border-radius:50%;background:var(--c);opacity:.35}
      .eq-ph img{position:relative;display:block;width:100%;height:100%;border-radius:50%;object-fit:cover}
      .eq-name{position:absolute;left:50%;top:100%;transform:translate(-50%,10px) rotate(calc(var(--rot) * -1));white-space:nowrap;background:#FFFDF7;color:var(--ink);font-family:var(--display);font-weight:600;font-size:46px;line-height:1;padding:10px 26px 12px;border-radius:999px;box-shadow:0 4px 0 rgba(90,74,48,.14);transition:font-size .8s,padding .8s}
      .eq-name::before{content:"";display:inline-block;width:20px;height:20px;border-radius:50%;background:var(--c);margin-right:12px;vertical-align:2px}
      .eq.s2 .eq-name{font-size:40px;padding:6px 18px 8px}
      .eq-uic{position:absolute;left:0;right:0;bottom:56px;text-align:center;font-family:var(--display);font-weight:500;font-size:42px;color:var(--inkSoft);transition:opacity .4s}
      .eq.s2 .eq-uic{opacity:0}
      .eq-group{position:absolute;left:120px;top:478px;width:800px;background:#FFFDF7;padding:22px 22px 26px;border-radius:18px;box-shadow:0 8px 0 rgba(90,74,48,.14),0 18px 40px rgba(90,74,48,.25);transform:rotate(-2.5deg) translateY(60px) scale(.8);opacity:0;transition:transform .7s cubic-bezier(.3,1.4,.5,1),opacity .4s}
      .eq-group img{display:block;width:100%;height:auto;border-radius:10px}
      .eq-group::before{content:"";position:absolute;left:50%;top:-22px;width:190px;height:48px;transform:translateX(-50%) rotate(3deg);background:rgba(242,194,48,.75);border-radius:4px}
      .eq-msg{position:absolute;left:1020px;top:540px;width:820px;margin:0;font-family:var(--display);font-weight:700;font-size:118px;line-height:1.05;color:var(--ink);opacity:0;transform:translateY(40px) scale(.85);transition:opacity .4s .35s,transform .7s .35s cubic-bezier(.3,1.6,.5,1)}
      .eq-msg b{color:var(--green);font-weight:700}
      .eq.s2 .eq-group{opacity:1;transform:rotate(-2.5deg)}
      .eq.s2 .eq-msg{opacity:1;transform:none}
      @media (prefers-reduced-motion:reduce){.eq *{transition:none!important;animation:none!important}}
    `}));
    const root=el("div",{class:"eq"});
    [[40,410,54,GOMET.rojo],[1820,450,48,T.green],[1700,960,64,GOMET.amarillo],[160,960,44,T.blue],[330,1010,30,T.orange],[1860,880,34,GOMET.azul],[50,880,30,T.green]]
      .forEach(([x,y,s,c])=>root.append(el("i",{class:"eq-dot",style:{left:x+"px",top:y+"px",width:s+"px",height:s+"px",background:c}})));
    root.append(el("h1",{class:"eq-title",html:"Mi <b>equipo</b> en la UIC"}));
    const rots=[-4,3,-3,0,4,-3,3];
    const cards=PEOPLE.map(([name,file,c],i)=>{
      const img=el("img",{src:`img/equipo/${file}.jpg`,alt:name,draggable:"false"});
      img.onerror=()=>{ img.style.visibility="hidden"; };
      const p=el("div",{class:"eq-p"+(i===UI?"":" hid")},
        el("div",{class:"eq-ring"}),el("div",{class:"eq-ph"},el("i"),img),el("div",{class:"eq-name",text:name}));
      p.style.setProperty("--c",c); p.style.setProperty("--rot",rots[i]+"deg");
      root.append(p); return p;
    });
    const group=el("figure",{class:"eq-group",style:{margin:0}},el("img",{src:"img/equipo/phday.jpg",alt:"El equipo presentando sus pósteres en la UIC"}));
    root.append(group,
      el("p",{class:"eq-msg",html:"¡La ciencia se hace en <b>equipo</b>!"}),
      el("div",{class:"eq-uic",text:"Biología Computacional del ARN · UIC Barcelona"}));
    box.append(root);
    // Posiciones (centro x, centro y, diámetro) de cada estado
    const LAYOUT={
      0:i=>[960,560,440],
      1:i=>{ const k=i-UI; return [960+k*262, 520+Math.abs(k)*Math.abs(k)*14+(i===UI?-30:0), i===UI?300:232]; },
      2:i=>{ const k=i-UI; return [960+k*250, 285, 160]; }
    };
    let step=0;
    const place=s=>cards.forEach((p,i)=>{ const [x,y,d]=LAYOUT[s](i); Object.assign(p.style,{left:x+"px",top:y+"px",width:d+"px",height:d+"px"}); });
    const set=s=>{
      step=s; place(s);
      cards.forEach((p,i)=>{ if(i===UI) return; p.classList.toggle("hid",s<1); p.style.transitionDelay=(s===1&&!red)?`0s,0s,0s,0s,${0.2+[0,1,2,0,3,4,5][i]*0.32}s,${0.2+[0,1,2,0,3,4,5][i]*0.32}s`:""; });
      root.classList.toggle("s2",s===2);
      if(s===2) audio.ok();
    };
    place(0);
    root.addEventListener("click",()=>APP.next());
    return {
      next(){ if(step<2){ set(step+1); return true; } return false; },
      prev(){ if(step>0){ set(step-1); return true; } return false; },
      destroy(){}
    };
  }
});
