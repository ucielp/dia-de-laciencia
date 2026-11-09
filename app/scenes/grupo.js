/* Escena 38 · grupo: qué hace mi grupo de investigación (Computational RNA Biology, UIC), en versión para niños.
   Al entrar: título + imagen del ARN doblado. Cada pulsación revela una idea (genoma → IA → enfermedades y medicinas). */
(function(){
const SC=(window.SCENES=window.SCENES||[]);
SC.push({id:"grupo",title:"¿Qué hace mi grupo?",order:38,mount(box,APP){
  const {el,T}=APP, red=APP.reduced();
  box.append(el("style",{text:`
    .gr{position:absolute;inset:0;overflow:hidden;cursor:pointer}
    .gr-title{position:absolute;left:0;right:0;top:44px;margin:0;text-align:center;font-family:var(--display);font-weight:700;font-size:96px;line-height:1;color:var(--ink)}
    .gr-title b{color:var(--orange);font-weight:700}
    .gr-sub{position:absolute;left:50%;top:160px;transform:translateX(-50%);margin:0;white-space:nowrap;font-family:var(--display);font-weight:500;font-size:40px;line-height:1;color:#fff;background:var(--blue);padding:12px 32px 14px;border-radius:999px;box-shadow:0 5px 0 rgba(31,42,68,.14)}
    .gr-fig{position:absolute;left:90px;top:290px;width:740px;margin:0;display:flex;flex-direction:column;align-items:center;gap:20px}
    .gr-fig .ph{width:700px;height:700px;border-radius:50%;overflow:hidden;background:#05040A;box-shadow:0 10px 0 rgba(31,42,68,.12),0 24px 50px rgba(31,42,68,.3)}
    .gr-fig img{width:100%;height:100%;display:block;object-fit:cover;animation:grSpin 160s linear infinite}
    @keyframes grSpin{to{transform:rotate(360deg)}}
    .gr-fig figcaption{font-family:var(--display);font-weight:600;font-size:40px;line-height:1.15;color:var(--inkSoft);text-align:center;max-width:720px}
    .gr-fig figcaption b{color:var(--ink)}
    .gr-list{position:absolute;left:920px;top:290px;width:920px;display:flex;flex-direction:column;gap:34px}
    .gr-it{display:flex;align-items:center;gap:34px;background:#FFFDF7;border-radius:34px;padding:26px 36px;box-shadow:0 6px 0 rgba(31,42,68,.08),0 14px 30px rgba(31,42,68,.12);opacity:0;transform:translateX(60px);transition:opacity .45s,transform .6s cubic-bezier(.3,1.5,.5,1)}
    .gr-it.on{opacity:1;transform:none}
    .gr-ic{flex:none;width:150px;height:150px;border-radius:50%;background:var(--c);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 0 rgba(31,42,68,.14)}
    .gr-ic svg{width:96px;height:96px}
    .gr-it p{margin:0;font-family:var(--display);font-weight:600;font-size:54px;line-height:1.12;color:var(--ink)}
    .gr-it p b{color:var(--c);font-weight:700}
    @media (prefers-reduced-motion:reduce){.gr *{animation:none!important;transition:none!important}}
  `}));
  const W="#FFFFFF";
  const ICON={
    genoma:`<svg viewBox="0 0 100 100"><path d="M30 10 C70 30 30 70 70 90" stroke="${W}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M70 10 C30 30 70 70 30 90" stroke="${W}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><path d="M40 22 H60 M38 50 H62 M40 78 H60" stroke="${W}" stroke-width="6" stroke-linecap="round"/></svg>`,
    ia:`<svg viewBox="0 0 100 100"><rect x="14" y="20" width="72" height="50" rx="8" fill="none" stroke="${W}" stroke-width="7"/><path d="M36 84 H64 M50 70 V84" stroke="${W}" stroke-width="7" stroke-linecap="round"/><circle cx="38" cy="45" r="6" fill="${W}"/><circle cx="62" cy="38" r="6" fill="${W}"/><circle cx="58" cy="56" r="6" fill="${W}"/><path d="M38 45 L62 38 M38 45 L58 56 M62 38 L58 56" stroke="${W}" stroke-width="4"/></svg>`,
    salud:`<svg viewBox="0 0 100 100"><path d="M50 86 C20 64 10 48 14 32 C18 16 40 12 50 30 C60 12 82 16 86 32 C90 48 80 64 50 86 Z" fill="none" stroke="${W}" stroke-width="7" stroke-linejoin="round"/><path d="M50 38 V64 M37 51 H63" stroke="${W}" stroke-width="8" stroke-linecap="round"/></svg>`
  };
  const ITEMS=[
    ["genoma",T.blue,"Leemos el <b>genoma</b>: ¡millones de letras de ADN y ARN!"],
    ["ia",T.green,"El ordenador y la <b>inteligencia artificial</b> nos ayudan a buscar pistas"],
    ["salud",T.red||"#E04B3A","Para entender <b>enfermedades</b> y ayudar a encontrar <b>medicinas</b>"]
  ];
  const root=el("div",{class:"gr"});
  const img=el("img",{src:"img/equipo/arn_grupo.jpg",alt:"Una molécula de ARN doblada: cada línea une dos partes de la molécula",draggable:"false"});
  img.onerror=()=>{ img.style.visibility="hidden"; };
  root.append(
    el("h1",{class:"gr-title",html:"¿Qué hace mi <b>grupo</b>?"}),
    el("p",{class:"gr-sub",text:"Computational RNA Biology · UIC"}),
    el("figure",{class:"gr-fig"},el("div",{class:"ph"},img)));
  const list=el("div",{class:"gr-list"});
  const its=ITEMS.map(([k,c,h])=>{ const d=el("div",{class:"gr-it"},el("div",{class:"gr-ic",html:ICON[k]}),el("p",{html:h})); d.style.setProperty("--c",c); list.append(d); return d; });
  root.append(list); box.append(root);
  let step=0;
  const set=s=>{ step=s; its.forEach((d,i)=>d.classList.toggle("on",i<s)); if(s>0&&!red) APP.audio.ok&&APP.audio.ok(); };
  root.addEventListener("click",()=>APP.next());
  return {
    next(){ if(step<ITEMS.length){ set(step+1); return true; } return false; },
    prev(){ if(step>0){ set(step-1); return true; } return false; },
    destroy(){}
  };
}});
})();
