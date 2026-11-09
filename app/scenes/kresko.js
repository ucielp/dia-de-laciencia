/* Escena 39 · kresko: la empresa de Uciel (Kresko RNAtech), en versión para niños.
   Pantalla fija, sin pasos: logo + imagen del deck (ARN + producto) + «moléculas de plantas que son buenas para la piel y el sueño». */
(function(){
const SC=(window.SCENES=window.SCENES||[]);
SC.push({id:"kresko",title:"¡Y tengo una empresa!",order:39,mount(box,APP){
  const {el,T}=APP;
  box.append(el("style",{text:`
    .kr{position:absolute;inset:0;overflow:hidden;cursor:pointer}
    .kr-title{position:absolute;left:100px;top:70px;margin:0;font-family:var(--display);font-weight:700;font-size:100px;line-height:1;color:var(--ink)}
    .kr-title b{color:#3E7D3A;font-weight:700}
    .kr-logo{position:absolute;left:100px;top:215px;width:560px;height:auto}
    .kr-txt{position:absolute;left:100px;top:420px;width:960px;margin:0;font-family:var(--display);font-weight:600;font-size:60px;line-height:1.15;color:var(--ink)}
    .kr-txt b{color:#3E7D3A;font-weight:700}
    .kr-chips{position:absolute;left:100px;top:700px;display:flex;flex-direction:column;gap:26px}
    .kr-chip{display:flex;align-items:center;gap:26px;background:#FFFDF7;border-radius:999px;padding:14px 46px 14px 16px;box-shadow:0 6px 0 rgba(31,42,68,.08),0 14px 30px rgba(31,42,68,.12);font-family:var(--display);font-weight:700;font-size:58px;line-height:1;color:var(--ink)}
    .kr-chip i{flex:none;width:104px;height:104px;border-radius:50%;background:var(--c);display:flex;align-items:center;justify-content:center}
    .kr-chip svg{width:66px;height:66px}
    .kr-img{position:absolute;right:40px;top:230px;width:820px;height:auto;filter:drop-shadow(0 18px 30px rgba(31,42,68,.18))}
  `}));
  const W="#FFFFFF";
  const ICON={
    piel:`<svg viewBox="0 0 100 100"><path d="M50 12 C70 34 80 50 80 64 A30 30 0 0 1 20 64 C20 50 30 34 50 12 Z" fill="none" stroke="${W}" stroke-width="8" stroke-linejoin="round"/><path d="M36 66 A14 14 0 0 0 50 80" stroke="${W}" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`,
    sueno:`<svg viewBox="0 0 100 100"><path d="M62 14 A36 36 0 1 0 86 62 A28 28 0 0 1 62 14 Z" fill="none" stroke="${W}" stroke-width="8" stroke-linejoin="round"/><path d="M68 26 H84 L68 44 H84" stroke="${W}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  };
  const chip=(k,c,txt)=>{ const d=el("div",{class:"kr-chip"},el("i",{html:ICON[k]}),el("span",{text:txt})); d.querySelector("i").style.setProperty("--c",c); return d; };
  const img=el("img",{class:"kr-img",src:"img/kresko/producto.png",alt:"Una hebra de ARN y una bolsa con el ingrediente de Kresko",draggable:"false"});
  img.onerror=()=>{ img.style.visibility="hidden"; };
  const root=el("div",{class:"kr"},
    el("h1",{class:"kr-title",html:"¡Y tengo una <b>empresa</b>!"}),
    el("img",{class:"kr-logo",src:"img/kresko/logo.svg",alt:"Kresko RNA Tech",draggable:"false"}),
    el("p",{class:"kr-txt",html:"Encontramos <b>moléculas en las plantas</b> que son buenas para nuestro cuerpo:"}),
    el("div",{class:"kr-chips"},chip("piel",T.orange,"una piel más sana"),chip("sueno",T.blue,"dormir mejor")),
    img);
  box.append(root);
  root.addEventListener("click",()=>APP.next());
  return { next(){ return false; }, prev(){ return false; }, destroy(){} };
}});
})();
