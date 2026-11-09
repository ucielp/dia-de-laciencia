/* Escena 39 · kresko: la empresa de Uciel (Kresko RNAtech), en versión para niños.
   Al entrar: título + logo. Cada pulsación revela una idea (fruta con ARN → IA busca trocitos → alimentos que cuidan). */
(function(){
const SC=(window.SCENES=window.SCENES||[]);
SC.push({id:"kresko",title:"¡Y tengo una empresa!",order:39,mount(box,APP){
  const {el,T}=APP, red=APP.reduced();
  box.append(el("style",{text:`
    .kr{position:absolute;inset:0;overflow:hidden;cursor:pointer}
    .kr-title{position:absolute;left:0;right:0;top:44px;margin:0;text-align:center;font-family:var(--display);font-weight:700;font-size:96px;line-height:1;color:var(--ink)}
    .kr-title b{color:#3E7D3A;font-weight:700}
    .kr-logo{position:absolute;left:90px;top:330px;width:740px;height:420px;box-sizing:border-box;padding:50px 56px;background:#FFFDF7;border-radius:40px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 0 rgba(31,42,68,.08),0 20px 40px rgba(31,42,68,.14)}
    .kr-logo img{width:100%;height:auto;display:block}
    .kr-list{position:absolute;left:920px;top:230px;width:920px;display:flex;flex-direction:column;gap:30px}
    .kr-it{display:flex;align-items:center;gap:34px;background:#FFFDF7;border-radius:34px;padding:26px 36px;box-shadow:0 6px 0 rgba(31,42,68,.08),0 14px 30px rgba(31,42,68,.12);opacity:0;transform:translateX(60px);transition:opacity .45s,transform .6s cubic-bezier(.3,1.5,.5,1)}
    .kr-it.on{opacity:1;transform:none}
    .kr-ic{flex:none;width:150px;height:150px;border-radius:50%;background:var(--c);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 0 rgba(31,42,68,.14)}
    .kr-ic svg{width:96px;height:96px}
    .kr-it p{margin:0;font-family:var(--display);font-weight:600;font-size:52px;line-height:1.1;color:var(--ink)}
    .kr-it p b{color:var(--c);font-weight:700}
    @media (prefers-reduced-motion:reduce){.kr *{transition:none!important}}
  `}));
  const W="#FFFFFF";
  const ICON={
    fruta:`<svg viewBox="0 0 100 100"><path d="M50 32 C38 22 16 26 16 52 C16 76 34 92 50 84 C66 92 84 76 84 52 C84 26 62 22 50 32 Z" fill="none" stroke="${W}" stroke-width="7" stroke-linejoin="round"/><path d="M50 32 C50 22 54 14 60 10" stroke="${W}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M54 20 C62 10 76 12 78 16 C72 24 60 24 54 20 Z" fill="${W}"/></svg>`,
    lupa:`<svg viewBox="0 0 100 100"><circle cx="42" cy="42" r="26" fill="none" stroke="${W}" stroke-width="8"/><path d="M61 61 L86 86" stroke="${W}" stroke-width="10" stroke-linecap="round"/><path d="M30 36 Q36 30 42 36 T54 36 M30 48 Q36 42 42 48 T54 48" stroke="${W}" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`,
    cuida:`<svg viewBox="0 0 100 100"><path d="M50 86 C20 64 10 48 14 32 C18 16 40 12 50 30 C60 12 82 16 86 32 C90 48 80 64 50 86 Z" fill="none" stroke="${W}" stroke-width="7" stroke-linejoin="round"/><path d="M36 56 C36 40 50 34 64 36 C64 52 54 60 40 58 M40 58 L56 44" stroke="${W}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };
  const ITEMS=[
    ["fruta",T.green,"Las frutas y verduras <b>frescas</b> también tienen <b>ARN</b>"],
    ["lupa",T.blue,"Con la <b>inteligencia artificial</b> buscamos el ARN que nos hace bien"],
    ["cuida",T.orange,"Para hacer <b>alimentos</b> que ayuden a cuidar nuestro cuerpo"]
  ];
  const root=el("div",{class:"kr"});
  const img=el("img",{src:"img/kresko/logo.svg",alt:"Kresko RNA Tech",draggable:"false"});
  root.append(
    el("h1",{class:"kr-title",html:"¡Y tengo una <b>empresa</b>!"}),
    el("div",{class:"kr-logo"},img));
  const list=el("div",{class:"kr-list"});
  const its=ITEMS.map(([k,c,h])=>{ const d=el("div",{class:"kr-it"},el("div",{class:"kr-ic",html:ICON[k]}),el("p",{html:h})); d.style.setProperty("--c",c); list.append(d); return d; });
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
