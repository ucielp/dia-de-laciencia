/* Día de la Ciencia · Actividad 2 «Busca a tu familia por el ADN» (v2).
   window.TREE: tiras de ADN (6 letras A/T/G/C), parejas, animales que guarda el adulto y forma del árbol.

   Dinámica:
   - Los niños forman 10 grupos (10 especies). Única tarea: buscar el grupo cuya tira tiene SOLO 1 diferencia
     con la suya y juntarse en pareja (humano+chimpancé, perro+lobo, gato+león, ballena+hipopótamo, gallina+pingüino).
   - Un ADULTO guarda 5 carteles que NO se reparten (murciélago, T-rex, cocodrilo, rana, tiburón) y los va sacando:
       1 murciélago: 2 diferencias con los 8 mamíferos → se une a los mamíferos.
       2 T-rex: 2 diferencias con gallina y pingüino → ¡las aves son dinosaurios!
       3 cocodrilo: 3 diferencias con gallina, pingüino y T-rex.
       4 rana: 4 o más con todos → más lejos (anfibios).
       5 tiburón: 5 o más con todos → el más lejano (peces).
   TREE.check() comprueba todas estas condiciones (devuelve [] si todo está bien). */
(function(){
"use strict";
// Colores de las bases (modelo físico): letra blanca sobre el color
const colors={A:"#2F6BD8",T:"#E0245E",G:"#1E9A57",C:"#F28A1E"};
const colorNames={A:"azul",T:"rojo",G:"verde",C:"naranja"};
const dna={
  humano:"GTATAC",   chimpance:"GCATAC",
  perro:"CGTCAC",    lobo:"CGTAAC",
  gato:"CGATCG",     leon:"CGATCA",
  ballena:"TGGTAC",  hipopotamo:"TGCTAC",
  gallina:"AACGGG",  pinguino:"AACGGT",
  murcielago:"CGATAC",
  trex:"AACGAC",
  cocodrilo:"TACGCA",
  rana:"TAACAG",
  tiburon:"ATGCTA"
};
const names={humano:"humano",chimpance:"chimpancé",perro:"perro",lobo:"lobo",gato:"gato",leon:"león",ballena:"ballena",hipopotamo:"hipopótamo",murcielago:"murciélago",gallina:"gallina",pinguino:"pingüino",trex:"T-rex",cocodrilo:"cocodrilo",rana:"rana",tiburon:"tiburón"};
// Artículo para frases («con el murciélago», «con la rana»)
const art={humano:"el",chimpance:"el",perro:"el",lobo:"el",gato:"el",leon:"el",ballena:"la",hipopotamo:"el",murcielago:"el",gallina:"la",pinguino:"el",trex:"el",cocodrilo:"el",rana:"la",tiburon:"el"};
// Orden de las hojas al dibujar el árbol (de izquierda a derecha)
const leaves=["humano","chimpance","perro","lobo","gato","leon","ballena","hipopotamo","murcielago","gallina","pinguino","trex","cocodrilo","rana","tiburon"];
const pairs=[["humano","chimpance"],["perro","lobo"],["gato","leon"],["ballena","hipopotamo"],["gallina","pinguino"]];
const kids=pairs.flat();                                   // los 10 carteles que se reparten
const adults=["murcielago","trex","cocodrilo","rana","tiburon"]; // los guarda un adulto, en este orden

// Nodos internos. level = altura de dibujo (no es el nº de diferencias). reveal = 0 parejas, 1..5 animal del adulto.
const nodes={
  prim:  {children:["humano","chimpance"],level:1,reveal:0,name:"primates"},
  perros:{children:["perro","lobo"],level:1,reveal:0,name:"perro y lobo"},
  gatos: {children:["gato","leon"],level:1,reveal:0,name:"felinos"},
  cet:   {children:["ballena","hipopotamo"],level:1,reveal:0,name:"ballena e hipopótamo"},
  aves:  {children:["gallina","pinguino"],level:1,reveal:0,name:"aves"},
  mam:   {children:["prim","perros","gatos","cet","murcielago"],level:2,reveal:1,name:"mamíferos"},
  dino:  {children:["aves","trex"],level:2,reveal:2,name:"dinosaurios"},
  arco:  {children:["dino","cocodrilo"],level:3,reveal:3,name:"aves y reptiles"},
  amn:   {children:["mam","arco"],level:4,reveal:4,name:"amniotas"},
  tetra: {children:["amn","rana"],level:5,reveal:4,name:"tetrápodos (4 patas)"},
  vert:  {children:["tetra","tiburon"],level:6,reveal:5,name:"vertebrados"}
};
const root="vert";

// Lo que saca el adulto, paso a paso. ask = nº de diferencias que se pregunta; min=true → «N o más con todos».
const reveals=[
  {id:"murcielago",ask:2,nodes:["mam"],
   q:"¿Quién tiene <b>2 diferencias</b> con el murciélago?",
   a:"¡Todos los <b>mamíferos</b> tienen 2!",
   msg:"Se parece a los mamíferos… pero no tanto como perro y lobo (1)."},
  {id:"trex",ask:2,nodes:["dino"],
   q:"¿Quién tiene <b>2 diferencias</b> con el T-rex?",
   a:"¡Gallina y pingüino tienen 2!",
   msg:"¡Las <b>aves</b> son <b>dinosaurios</b>!"},
  {id:"cocodrilo",ask:3,nodes:["arco"],
   q:"¿Quién tiene <b>3 diferencias</b> con el cocodrilo?",
   a:"¡Gallina, pingüino y T-rex tienen 3!",
   msg:"El cocodrilo es primo de las aves y los dinosaurios."},
  {id:"rana",ask:4,min:true,nodes:["amn","tetra"],
   q:"¿Y la <b>rana</b>? ¿Cuántas diferencias tiene con vosotros?",
   a:"¡<b>4 o más</b> con todos!",
   msg:"La rana está más lejos: es un <b>anfibio</b>."},
  {id:"tiburon",ask:5,min:true,nodes:["vert"],
   q:"¿Y el <b>tiburón</b>? ¿Cuántas diferencias tiene?",
   a:"¡<b>5 o más</b> con todos!",
   msg:"El tiburón es el más lejano: es un <b>pez</b>."}
];
// Ramas grandes rotuladas al final
const clades=[
  {node:"mam",members:["humano","chimpance","perro","lobo","gato","leon","ballena","hipopotamo","murcielago"],label:"mamíferos",color:"#F7931E"},
  {node:"dino",members:["gallina","pinguino","trex"],label:"aves = dinosaurios",color:"#5FA040"},
  {members:["cocodrilo"],label:"reptil",color:"#7D9A5A"},
  {members:["rana"],label:"anfibio",color:"#29ABE2"},
  {members:["tiburon"],label:"pez",color:"#6D6E71"}
];

function diff(a,b){ const x=dna[a],y=dna[b]; let d=0; for(let i=0;i<6;i++) if(x[i]!==y[i]) d++; return d; }
function diffPos(a,b){ const x=dna[a],y=dna[b], r=[]; for(let i=0;i<6;i++) if(x[i]!==y[i]) r.push(i); return r; }
function leavesOf(id){ return nodes[id]?nodes[id].children.flatMap(leavesOf):[id]; }
function parentOf(id){ return Object.keys(nodes).find(k=>nodes[k].children.includes(id))||null; }
/** Parientes más cercanos en el árbol: las hojas de la rama hermana más pequeña. */
function closest(id){ const p=parentOf(id); return p?nodes[p].children.filter(c=>c!==id).flatMap(leavesOf):[]; }
/** Especies que «responden» cuando el adulto saca reveals[i] (las que están ya en juego). */
function answerers(i){ const r=reveals[i]; const inPlay=kids.concat(adults.slice(0,i));
  return inPlay.filter(k=>r.min?diff(r.id,k)>=r.ask:diff(r.id,k)===r.ask); }

/** Comprueba las condiciones del diseño. Devuelve una lista de errores ([] = todo bien). */
function check(){
  const errs=[], E=(c,m)=>{ if(!c) errs.push(m); };
  const mammals=["humano","chimpance","perro","lobo","gato","leon","ballena","hipopotamo"], birds=["gallina","pinguino"];
  for(const id of leaves) E(/^[ATGC]{6}$/.test(dna[id]),`${id}: tira no válida`);
  for(const [a,b] of pairs) E(diff(a,b)===1,`pareja ${a}-${b}: ${diff(a,b)} ≠ 1`);
  const pairOf=k=>pairs.findIndex(p=>p.includes(k));
  for(const a of kids) for(const b of kids) if(a<b&&pairOf(a)!==pairOf(b)) E(diff(a,b)>=3,`${a}-${b}: ${diff(a,b)} < 3`);
  for(const m of mammals) E(diff("murcielago",m)===2,`murciélago-${m}: ${diff("murcielago",m)} ≠ 2`);
  for(const b of birds) E(diff("murcielago",b)===6,`murciélago-${b}: ${diff("murcielago",b)} ≠ 6`);
  for(const k of leaves) if(k!=="trex") E(birds.includes(k)?diff("trex",k)===2:diff("trex",k)>=3,`T-rex-${k}: ${diff("trex",k)}`);
  for(const k of leaves) if(k!=="cocodrilo") E([...birds,"trex"].includes(k)?diff("cocodrilo",k)===3:diff("cocodrilo",k)>=4,`cocodrilo-${k}: ${diff("cocodrilo",k)}`);
  for(const k of leaves) if(k!=="rana") E(diff("rana",k)>=4&&diff("rana",k)<=5,`rana-${k}: ${diff("rana",k)}`);
  for(const k of leaves) if(k!=="tiburon") E(diff("tiburon",k)>=5,`tiburón-${k}: ${diff("tiburon",k)}`);
  // en cada paso, responden exactamente los esperados
  const want=[mammals,birds,[...birds,"trex"],null,null];
  reveals.forEach((r,i)=>{ const got=answerers(i);
    if(want[i]) E(got.length===want[i].length&&want[i].every(x=>got.includes(x)),`${r.id}: responden ${got.join(",")}`);
    else E(got.length===kids.length+i,`${r.id}: no todos tienen ${r.ask} o más`); });
  E(new Set(Object.values(dna)).size===leaves.length,"hay tiras repetidas");
  return errs;
}
window.TREE={colors,colorNames,dna,names,art,leaves,pairs,kids,adults,nodes,root,reveals,clades,diff,diffPos,leavesOf,parentOf,closest,answerers,check};
if(typeof module!=="undefined") module.exports=window.TREE;
})();
