/* Escena 35 · portada: va DESPUÉS de «¿Qué hace la ciencia?». Paso 0: «¿Y yo?» · paso 1: «Soy Uciel y soy científico» + foto (img/equipo/uciel.jpg) enmarcada en cartulina. */
(window.SCENES=window.SCENES||[]).push({
  id:"portada", title:"¿Y yo? Soy Uciel", order:35,
  mount(box,APP){
    const {el,T,GOMET}=APP;
    box.append(el("style",{text:`
      .po{position:absolute;inset:0;background:radial-gradient(circle at 70% 45%,#FFF6E4 0,#F6F1E6 55%,#EFE5D2 100%);overflow:hidden;cursor:pointer}
      .po-logo{position:absolute;left:90px;top:70px;width:420px;height:auto;background:#fff;padding:22px 28px;border-radius:28px;box-shadow:0 6px 0 rgba(90,74,48,.12),0 14px 30px rgba(90,74,48,.12)}
      .po-dot{position:absolute;border-radius:50%;box-shadow:0 4px 0 rgba(0,0,0,.08),0 8px 16px rgba(90,74,48,.18);animation:poFloat 6s ease-in-out infinite}
      @keyframes poFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}
      .po-q{position:absolute;left:90px;top:330px;font-family:var(--display);font-weight:700;font-size:230px;line-height:1;color:var(--orange);margin:0;transition:all .6s cubic-bezier(.4,0,.2,1)}
      .po.on .po-q{top:322px;font-size:96px;color:var(--grey)}
      .po-r{opacity:0;transform:translateY(30px);transition:opacity .5s,transform .6s cubic-bezier(.3,1.5,.6,1)}
      .po.on .po-r{opacity:1;transform:none}
      .po.on .po-hi{transition-delay:.25s}.po.on .po-sub{transition-delay:.55s}.po.on .po-tag{transition-delay:.8s}
      .po-hi{position:absolute;left:90px;top:440px;font-family:var(--display);font-weight:700;font-size:150px;line-height:1;color:var(--ink);margin:0}
      .po-hi span{color:var(--orange)}
      .po-sub{position:absolute;left:96px;top:605px;font-family:var(--display);font-weight:500;font-size:84px;line-height:1.05;color:var(--ink);margin:0}
      .po-sub b{color:var(--blue);font-weight:700}
      .po-tag{position:absolute;left:96px;top:760px;display:flex;gap:18px}
      .po-tag p{margin:0;font-family:var(--display);font-weight:600;font-size:40px;padding:12px 30px;border-radius:999px;color:#fff}
      /* Foto en capas de cartulina: mancha naranja, tarjeta azul, marco de papel, cinta adhesiva */
      .po-ph{position:absolute;left:1130px;top:170px;width:660px;height:760px;opacity:0;transform:translateY(60px) rotate(6deg) scale(.85);transition:opacity .5s .35s,transform .8s .35s cubic-bezier(.3,1.5,.5,1)}
      .po.on .po-ph{opacity:1;transform:none}
      .po-blob{position:absolute;left:-40px;top:40px;width:640px;height:640px;border-radius:46% 54% 50% 50%/52% 46% 54% 48%;background:var(--orange);opacity:.9;box-shadow:0 8px 0 rgba(90,74,48,.14)}
      .po-card{position:absolute;left:70px;top:-6px;width:560px;height:640px;border-radius:30px;background:var(--blue);transform:rotate(-6deg);box-shadow:0 8px 0 rgba(90,74,48,.16),0 18px 34px rgba(90,74,48,.2)}
      .po-mat{position:absolute;left:40px;top:30px;width:580px;height:680px;box-sizing:border-box;padding:28px 28px 0;background:#FFFDF7;border-radius:16px;transform:rotate(2.5deg);box-shadow:0 10px 0 rgba(90,74,48,.14),0 22px 44px rgba(90,74,48,.28)}
      .po-mat img{display:block;width:524px;height:524px;object-fit:cover;border-radius:8px;background:#E8E2D6}
      .po-mat p{margin:0;height:128px;display:flex;align-items:center;justify-content:center;gap:16px;font-family:var(--display);font-weight:700;font-size:64px;color:var(--ink)}
      .po-mat p i{display:inline-block;width:30px;height:30px;border-radius:50%;background:var(--green)}
      .po-tape{position:absolute;width:190px;height:54px;background:rgba(242,194,48,.78);border-radius:4px;box-shadow:0 2px 4px rgba(90,74,48,.15)}
      .po-mix{position:absolute;left:90px;top:722px;width:1000px;opacity:0;transform:translateY(40px);transition:opacity .5s,transform .6s cubic-bezier(.3,1.5,.6,1);pointer-events:none}
      .po.mix .po-mix{opacity:1;transform:none}
      .po.mix .po-tag{opacity:0}
      .po-mix h3{margin:0 0 10px;font-family:var(--display);font-weight:600;font-size:54px;color:var(--ink)}
      .po-mix h3 b{color:var(--orange)}
      .po-mix .row{display:flex;align-items:center;gap:26px}
      .po-mc{width:430px;background:#FFFDF7;border-radius:30px;padding:14px 16px 10px;box-shadow:0 7px 0 rgba(90,74,48,.14),0 16px 30px rgba(90,74,48,.18);text-align:center}
      .po-mc .ill{height:160px;border-radius:20px;display:flex;align-items:center;justify-content:center}
      .po-mc .ill svg{height:150px;width:auto}
      .po-mc p{margin:6px 0 0;font-family:var(--display);font-weight:700;font-size:40px;white-space:nowrap;line-height:1.05}
      .po-plus{font-family:var(--display);font-weight:700;font-size:110px;color:var(--orange);line-height:1}
      .po-hint{position:absolute;right:120px;bottom:36px;font-size:30px;color:var(--grey);font-family:var(--body)}
      @media (prefers-reduced-motion:reduce){.po-dot{animation:none}.po *{transition:none!important}}
    `}));
    const root=el("div",{class:"po"});
    const dots=[[1560,70,70,GOMET.rojo],[1850,250,50,GOMET.azul],[1060,120,46,GOMET.amarillo],[820,140,70,T.green],[960,330,40,T.blue],[760,900,56,GOMET.amarillo],[620,990,34,T.orange],[1840,960,44,T.green],[1080,960,36,GOMET.rojo]];
    dots.forEach(([x,y,s,c],i)=>root.append(el("i",{class:"po-dot",style:{left:x+"px",top:y+"px",width:s+"px",height:s+"px",background:c,animationDelay:(i*0.6)+"s"}})));
    const img=el("img",{src:"img/equipo/uciel.jpg",alt:"Foto de Uciel",draggable:"false"});
    img.onerror=()=>{ img.style.visibility="hidden"; };
    const photo=el("div",{class:"po-ph"},
      el("div",{class:"po-blob"}),el("div",{class:"po-card"}),
      el("div",{class:"po-mat"},img,el("p",{},el("i"),"Uciel")),
      el("i",{class:"po-tape",style:{left:"250px",top:"6px",transform:"rotate(-4deg)"}}),
      el("i",{class:"po-tape",style:{left:"520px",top:"620px",width:"150px",transform:"rotate(-38deg)"}}));
    root.append(
      el("img",{class:"po-logo",src:"img/elm.png",alt:"Institut-Escola Lluís Millet, El Masnou"}),
      el("h1",{class:"po-q",text:"¿Y yo?"}),
      el("p",{class:"po-hi po-r",html:"Soy <span>Uciel</span>"}),
      el("p",{class:"po-sub po-r",html:"y soy <b>científico</b>"}),
      el("div",{class:"po-tag po-r"},el("p",{text:"Día de la Ciencia",style:{background:T.green}}),el("p",{text:"1º y 2º",style:{background:T.orange}})),
      photo
    );
    // Paso 2: «Mi ciencia mezcla…» medicina + IA (dibujos de la escena «ámbitos»)
    const ART=window.CIENCIA_ART;
    if(ART){
      const card=k=>{ const a=ART.AMB.find(x=>x.k===k); return el("div",{class:"po-mc"},el("div",{class:"ill",style:{background:a.bg},html:ART.paper("0 0 300 200",a.ill,'preserveAspectRatio="xMidYMid meet"')}),el("p",{text:k==="med"?"Biomedicina":"Inteligencia artificial",style:{color:a.col}})); };
      root.append(el("div",{class:"po-mix"},el("h3",{html:"Mi ciencia <b>mezcla</b>…"}),el("div",{class:"row"},card("med"),el("span",{class:"po-plus",text:"+"}),card("ia"))));
    }
    box.append(root);
    root.addEventListener("click",()=>APP.next());
    let step=0; const MAX=window.CIENCIA_ART?2:1;
    const show=n=>{ step=n; root.classList.toggle("on",n>=1); root.classList.toggle("mix",n>=2); };
    return {
      next(){ if(step<MAX){ show(step+1); return true; } return false; },
      prev(){ if(step>0){ show(step-1); return true; } return false; },
      destroy(){}
    };
  }
});

/* Escena 37 · equipo: «Mi equipo en la UIC» · Grupo de Biología Computacional del ARN. Retratos en B/N (img/equipo/*.jpg) en marcos redondos de cartulina.
   Al entrar: Uciel solo, en grande. Paso 1: aparece todo el equipo (2 filas de 4), uno a uno. Paso 2: foto del grupo en un congreso (congreso.jpg) + «¡La ciencia se hace en equipo!». */
(window.SCENES=window.SCENES||[]).push({
  id:"equipo", title:"Mi equipo", order:37,
  mount(box,APP){
    const {el,T,GOMET,audio}=APP, red=APP.reduced();
    const PEOPLE=[ // nombre, archivo, color del marco de cartulina
      ["Uciel","uciel",T.orange],["Nicolás","nicolas",T.blue],["Jorge","jorge",T.green],["Santiago","santiago",GOMET.amarillo],
      ["Fernando","fernando",GOMET.rojo],["Meki","meki",GOMET.azul],["Clara","clara",T.pink],["Júlia","julia","#8E6CC4"]
    ];
    const UI=0; // índice de Uciel
    box.append(el("style",{text:`
      .eq{position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,#FFF6E4 0,#F6F1E6 60%,#EFE5D2 100%);overflow:hidden;cursor:pointer}
      .eq-dot{position:absolute;border-radius:50%;opacity:.55;box-shadow:0 4px 0 rgba(0,0,0,.06)}
      .eq-title{position:absolute;left:0;right:0;top:40px;margin:0;text-align:center;font-family:var(--display);font-weight:700;font-size:100px;line-height:1;color:var(--ink)}
      .eq-title b{color:var(--orange);font-weight:700}
      .eq-sub{position:absolute;left:50%;top:160px;transform:translateX(-50%);margin:0;white-space:nowrap;font-family:var(--display);font-weight:500;font-size:46px;line-height:1;color:#fff;background:var(--blue);padding:12px 34px 14px;border-radius:999px;box-shadow:0 5px 0 rgba(90,74,48,.14)}
      .eq-p{position:absolute;left:0;top:0;transform:translate(-50%,-50%) rotate(var(--rot)) scale(var(--sc,1));transition:left .8s cubic-bezier(.5,0,.2,1),top .8s cubic-bezier(.5,0,.2,1),width .8s cubic-bezier(.5,0,.2,1),height .8s cubic-bezier(.5,0,.2,1),transform .55s cubic-bezier(.3,1.6,.5,1),opacity .3s}
      .eq-p.hid{--sc:0;opacity:0}
      .eq-ring{position:absolute;inset:0;border-radius:50%;background:var(--c);box-shadow:0 7px 0 rgba(90,74,48,.16),0 16px 30px rgba(90,74,48,.22)}
      .eq-ph{position:absolute;inset:6%;border-radius:50%;background:#FFFDF7;padding:3.5%;box-sizing:border-box}
      .eq-ph img{position:relative;display:block;width:100%;height:100%;border-radius:50%;object-fit:cover;background:#E8E2D6}
      .eq-name{position:absolute;left:50%;top:100%;transform:translate(-50%,6px) rotate(calc(var(--rot) * -1));white-space:nowrap;background:#FFFDF7;color:var(--ink);font-family:var(--display);font-weight:600;font-size:46px;line-height:1;padding:10px 26px 12px;border-radius:999px;box-shadow:0 4px 0 rgba(90,74,48,.14);transition:font-size .8s,padding .8s}
      .eq-name::before{content:"";display:inline-block;width:20px;height:20px;border-radius:50%;background:var(--c);margin-right:12px;vertical-align:2px}
      .eq.s0 .eq-name{font-size:60px}
      .eq.s2 .eq-name{font-size:40px;padding:6px 16px 8px}
      .eq.s2 .eq-name::before{display:none}
      .eq-group{position:absolute;left:70px;top:478px;width:960px;margin:0;background:#FFFDF7;padding:22px 22px 26px;box-sizing:border-box;border-radius:18px;box-shadow:0 8px 0 rgba(90,74,48,.14),0 18px 40px rgba(90,74,48,.25);transform:rotate(-2deg) translateY(60px) scale(.8);opacity:0;transition:transform .7s cubic-bezier(.3,1.4,.5,1),opacity .4s}
      .eq-group img{display:block;width:916px;height:515px;object-fit:cover;border-radius:10px;background:#E8E2D6}
      .eq-group::before,.eq-group::after{content:"";position:absolute;top:-22px;width:170px;height:48px;background:rgba(242,194,48,.75);border-radius:4px}
      .eq-group::before{left:40px;transform:rotate(-8deg)}.eq-group::after{right:40px;transform:rotate(7deg)}
      .eq-msg{position:absolute;left:1100px;top:540px;width:760px;margin:0;font-family:var(--display);font-weight:700;font-size:112px;line-height:1.05;color:var(--ink);opacity:0;transform:translateY(40px) scale(.85);transition:opacity .4s .35s,transform .7s .35s cubic-bezier(.3,1.6,.5,1)}
      .eq-msg b{color:var(--green);font-weight:700}
      .eq.s2 .eq-group{opacity:1;transform:rotate(-2deg)}
      .eq.s2 .eq-msg{opacity:1;transform:none}
      @media (prefers-reduced-motion:reduce){.eq *{transition:none!important;animation:none!important}}
    `}));
    const root=el("div",{class:"eq s0"});
    [[40,410,54,GOMET.rojo],[1840,470,48,T.green],[1760,980,64,GOMET.amarillo],[120,990,44,T.blue],[330,1030,30,T.orange],[1880,860,34,GOMET.azul],[50,860,30,T.green]]
      .forEach(([x,y,s,c])=>root.append(el("i",{class:"eq-dot",style:{left:x+"px",top:y+"px",width:s+"px",height:s+"px",background:c}})));
    root.append(el("h1",{class:"eq-title",html:"Mi <b>equipo</b> en la UIC"}),
      el("p",{class:"eq-sub",text:"Grupo de Biología Computacional del ARN (UIC)"}));
    const rots=[0,3,-3,4,-4,3,-3,4];
    const cards=PEOPLE.map(([name,file,c],i)=>{
      const img=el("img",{src:`img/equipo/${file}.jpg`,alt:name,draggable:"false"});
      img.onerror=()=>{ img.style.visibility="hidden"; };
      const p=el("div",{class:"eq-p"+(i===UI?"":" hid")},
        el("div",{class:"eq-ring"}),el("div",{class:"eq-ph"},img),el("div",{class:"eq-name",text:name}));
      p.style.setProperty("--c",c); p.style.setProperty("--rot",rots[i]+"deg");
      root.append(p); return p;
    });
    const gimg=el("img",{src:"img/equipo/congreso.jpg",alt:"El equipo en un congreso de ciencia"});
    gimg.onerror=()=>{ gimg.style.visibility="hidden"; };
    root.append(el("figure",{class:"eq-group"},gimg),
      el("p",{class:"eq-msg",html:"¡La ciencia se hace en <b>equipo</b>!"}));
    box.append(root);
    // Posiciones (centro x, centro y, diámetro) de cada estado
    const LAYOUT={
      0:i=>[960,590,460],
      1:i=>{ const r=i<4?0:1, c=i%4; return [960+(c-1.5)*400+(r?40:-40), r?775:405, 250]; },
      2:i=>[960+(i-3.5)*226, 315, 140]
    };
    let step=0;
    const place=s=>cards.forEach((p,i)=>{ const [x,y,d]=LAYOUT[s](i); Object.assign(p.style,{left:x+"px",top:y+"px",width:d+"px",height:d+"px"}); });
    const set=s=>{
      step=s; place(s);
      cards.forEach((p,i)=>{ if(i===UI) return; p.classList.toggle("hid",s<1); const d=0.2+(i-1)*0.3; p.style.transitionDelay=(s===1&&!red)?`0s,0s,0s,0s,${d}s,${d}s`:""; });
      root.classList.toggle("s0",s===0); root.classList.toggle("s2",s===2);
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
