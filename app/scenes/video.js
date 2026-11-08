/* Escena final OPCIONAL (order 95, después de «cierre»): vídeo de cómo se preparó el experimento en casa.
   Ver CONTRACT.md. */
(function(){
"use strict";
/* CÓMO AÑADIR EL VÍDEO: guarda el archivo como  app/video/experimento.mp4  (MP4 H.264 + AAC; mejor < 50 MB para Vercel).
   Si el archivo no existe o no se puede cargar, esta pantalla NO aparece: la presentación termina en «cierre».
   Para usar otro nombre, cambia solo esta ruta (relativa a index.html). */
const VIDEO_SRC="video/experimento.mp4";

/* ¿Existe y se puede reproducir? Sirve igual en http(s) y en file:// (usa un <video> y espera loadedmetadata/error). */
function probe(){
  return new Promise(res=>{
    const v=document.createElement("video"); let done=false;
    const end=ok=>{ if(done) return; done=true; clearTimeout(to); try{ v.removeAttribute("src"); v.load(); }catch(e){} res(ok); };
    const to=setTimeout(()=>end(false),3500);
    v.preload="metadata"; v.muted=true;
    v.addEventListener("loadedmetadata",()=>end(true));
    v.addEventListener("error",()=>end(false));
    try{ v.src=VIDEO_SRC; }catch(e){ end(false); }
  });
}

(window.SCENES=window.SCENES||[]).push({
  id:"video", title:"¡Así lo preparamos en casa!", order:95,
  available:probe,
  mount(box,APP){
    const {el}=APP;
    box.append(el("style",{text:`
    .vd{position:absolute;inset:0;background:radial-gradient(circle at 50% 55%,#FFF8EA 0,#F4E6CC 70%,#E9D4AE 100%);overflow:hidden}
    .vd h1{position:absolute;left:0;right:0;top:44px;margin:0;text-align:center;font-family:var(--display);font-weight:700;font-size:100px;line-height:1;color:var(--ink)}
    .vd h1 b{color:var(--orange);font-weight:700}
    .vd-frame{position:absolute;left:50%;top:186px;width:1440px;height:852px;margin-left:-720px;box-sizing:border-box;padding:24px;background:#FFFDF7;border-radius:22px;transform:rotate(-1deg);box-shadow:0 10px 0 rgba(90,74,48,.14),0 24px 50px rgba(90,74,48,.28);animation:vdIn .6s cubic-bezier(.3,1.3,.5,1) both}
    @keyframes vdIn{from{opacity:0;transform:rotate(-1deg) scale(.92)}}
    .vd-frame::before,.vd-frame::after{content:"";position:absolute;top:-24px;width:200px;height:52px;background:rgba(242,194,48,.78);border-radius:4px;z-index:2}
    .vd-frame::before{left:80px;transform:rotate(-6deg)}.vd-frame::after{right:80px;transform:rotate(5deg)}
    .vd-frame video{display:block;width:1392px;height:804px;object-fit:contain;background:#1F2A44;border-radius:12px;cursor:pointer}
    .vd-play{position:absolute;left:50%;top:50%;width:220px;height:220px;margin:-110px 0 0 -110px;pointer-events:none;opacity:0;transition:opacity .25s}
    .vd.paused .vd-play{opacity:1}
    .vd-dots i{position:absolute;border-radius:50%;opacity:.5}
    @media (prefers-reduced-motion:reduce){.vd *{animation:none!important;transition:none!important}}
    `}));
    const root=el("div",{class:"vd"}); box.append(root);
    const dots=el("div",{class:"vd-dots"});
    [[70,90,46,"#29ABE2"],[1810,120,56,"#7AC143"],[90,980,60,"#E59AAE"],[1830,960,42,"#F2C230"]]
      .forEach(([x,y,s,c])=>dots.append(el("i",{style:{left:x+"px",top:y+"px",width:s+"px",height:s+"px",background:c}})));
    const video=el("video",{src:VIDEO_SRC,loop:true,playsinline:true,preload:"auto","aria-label":"Vídeo: así se preparó el experimento en casa"});
    const play=APP.svg(`<svg class="vd-play" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#FFFDF7" opacity=".92"/><path d="M40 30 L72 50 L40 70Z" fill="#F7931E"/></svg>`);
    const frame=el("div",{class:"vd-frame"},video,play);
    root.append(dots,el("h1",{html:"¡Así lo preparamos <b>en casa</b>!"}),frame);
    const sync=()=>root.classList.toggle("paused",video.paused);
    video.addEventListener("play",sync); video.addEventListener("pause",sync);
    const start=()=>{ const p=video.play(); if(p&&p.catch) p.catch(()=>sync()); };
    video.addEventListener("click",()=>{ if(video.paused) start(); else video.pause(); });
    start();
    return {
      next(){ return false; },
      prev(){ return false; },
      destroy(){ try{ video.pause(); video.removeAttribute("src"); video.load(); }catch(e){} }
    };
  }
});
})();
