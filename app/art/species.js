/* Día de la Ciencia · 15 especies dibujadas en estilo «papel recortado» (como el perro geométrico de core.js).
   window.SPECIES = [{id, name, svg(opts) -> texto SVG}]. Todas comparten el mismo viewBox que el perro,
   así tienen el mismo tamaño aparente. Mirando a la izquierda, como el perro. Requiere window.APP (core.js). */
(function(){
"use strict";
const A=window.APP, {R,C,E,P,L,LN}=A;
const VB="4 20 200 165";               // mismo encuadre que APP.dog
const cheek=(x,y,r=5)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#E59AAE" opacity=".55"/>`;
const mirror=(d,cx=104)=>d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g,(m,x,y)=>`${2*cx-+x} ${y}`);
function draw(id,name,shapes,eyes,eyeR,extra){
  return {id,name,svg(opts={}){ return A.paperSVG(shapes,{vb:VB,eyes,eyeR,label:opts.label||name,cls:opts.cls,extra}); }};
}

// ---------- Primates (de frente, para ver que se parecen) ----------
const SKIN="#E9B892", HAIR="#5A3E2B";
const humano=draw("humano","humano",[
  R(88,128,13,46,6,"#3E4A6B"),R(107,128,13,46,6,"#3E4A6B"),
  R(82,168,21,10,5,"#3A302C"),R(105,168,21,10,5,"#3A302C"),
  R(64,84,15,44,7,"#4F9FCB"),R(129,84,15,44,7,"#4F9FCB"),C(71,131,8,SKIN),C(137,131,8,SKIN),
  R(76,78,56,58,14,"#4F9FCB"),R(96,66,16,16,5,SKIN),
  C(79,55,6,SKIN),C(129,55,6,SKIN),C(104,52,25,SKIN),
  P("M79 52 Q78 24 104 24 Q130 24 129 52 Q122 38 106 40 Q92 40 79 52 Z",HAIR),
  LN("M97 65 Q104 71 111 65","#7A4B35",3)
],[[95,53],[113,53]],5,cheek(89,62,4.5)+cheek(119,62,4.5));

const FUR="#6B4A35", FACE="#D9B48F";
const chimpance=draw("chimpance","chimpancé",[
  R(86,136,17,38,8,FUR),R(105,136,17,38,8,FUR),E(92,174,13,6,"#4E3424"),E(116,174,13,6,"#4E3424"),
  R(58,82,17,72,8,FUR),R(133,82,17,72,8,FUR),C(66,156,10,FACE),C(142,156,10,FACE),
  R(74,76,60,70,22,FUR),E(104,116,19,22,"#957055"),
  C(71,56,12,FACE),C(137,56,12,FACE),C(104,54,31,FUR),
  E(104,62,24,21,FACE),E(95,48,11,9,FACE),E(113,48,11,9,FACE),E(104,74,16,10,"#E8CBA8"),
  LN("M99 70 L100 72 M109 70 L108 72","#5A3E2B",2.5),LN("M96 78 Q104 82 112 78","#5A3E2B",3)
],[[95,54],[113,54]],5);

// ---------- Carnívoros ----------
const perro={id:"perro",name:"perro",svg(opts={}){ return A.dog.svg("rojo","rojo","rojo",{label:opts.label||"perro",cls:opts.cls,vb:VB}); }};

const WG="#8F949C", WB="#DCD8CF", WD="#5C606A";
const lobo=draw("lobo","lobo",[
  E(184,96,24,10,WG,-42),E(196,80,8,6,WB,-42),
  R(80,138,14,38,5,WG),R(100,138,14,38,5,WG),R(134,138,14,38,5,WG),R(152,138,14,38,5,WG),
  R(72,94,96,50,12,WG),R(86,130,66,9,4,WB),
  P("M48 64 L54 30 L70 60 Z",WD),P("M66 62 L80 30 L88 62 Z",WD),
  R(36,58,54,50,12,WG),
  R(8,82,40,24,8,WB),C(12,87,6,"#2A2A30"),
  LN("M18 100 L40 100")
],[[60,76]],8.5);

const CO="#E39B4F", CL="#F4D3A6", CS="#B86A2C";
const gato=draw("gato","gato",[
  L("M160 118 Q192 112 188 72 Q186 56 172 60",CO,11),
  R(84,138,12,38,6,CO),R(101,138,12,38,6,CO),R(136,138,12,38,6,CO),R(152,138,12,38,6,CO),
  R(74,102,94,44,20,CO),R(102,102,9,20,4,CS),R(120,102,9,22,4,CS),R(138,102,9,20,4,CS),
  P("M28 82 L32 46 L56 66 Z",CO),P("M60 64 L82 46 L86 82 Z",CO),
  P("M34 74 L36 56 L48 67 Z","#E59AAE"),P("M68 67 L79 56 L80 74 Z","#E59AAE"),
  C(57,94,32,CO),R(54,62,6,14,3,CS),
  E(57,108,16,11,CL),P("M52 100 L62 100 L57 106 Z","#C86E86"),
  LN("M57 106 L57 110 M57 110 Q52 115 48 111 M57 110 Q62 115 66 111","#7A4B35",2.5)
],[[45,90],[69,90]],7,`<path d="M40 106 L18 102 M40 111 L19 114 M74 106 L96 102 M74 111 L95 114" stroke="#7A4B35" stroke-width="2" stroke-linecap="round"/>`);

const LB="#D9A54A", LM="#A35F2A", LL="#F1D39B";
const mane=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2; mane.push(C(+(58+38*Math.cos(a)).toFixed(1),+(90+38*Math.sin(a)).toFixed(1),15,LM));}
const leon=draw("leon","león",[
  L("M166 114 Q192 128 192 96",LB,7),C(192,90,10,LM),
  R(80,136,16,40,7,LB),R(100,136,16,40,7,LB),R(134,136,16,40,7,LB),R(154,136,16,40,7,LB),
  R(72,98,102,50,22,LB),
  C(58,90,40,LM),...mane,
  C(36,64,9,LB),C(80,64,9,LB),C(58,92,29,LB),
  E(58,106,16,12,LL),P("M52 98 L64 98 L58 105 Z","#6B3E22"),
  LN("M58 105 L58 109 M58 109 Q53 114 49 110 M58 109 Q63 114 67 110","#6B3E22",2.5)
],[[47,87],[69,87]],7);

// ---------- Cetartiodáctilos y murciélago ----------
const BW="#4E78A8", BWL="#C9D8E6";
const ballena=draw("ballena","ballena",[
  L("M72 64 Q66 46 54 38",  "#9CC9E8",6),L("M74 64 Q78 44 92 36","#9CC9E8",6),L("M73 64 L73 40","#9CC9E8",6),
  P("M14 112 Q14 64 88 64 Q148 64 166 102 L186 78 Q200 74 198 90 L184 112 L198 134 Q200 150 186 146 L166 122 Q148 154 88 154 Q14 154 14 112 Z",BW),
  P("M20 122 Q50 150 116 150 Q150 150 162 126 Q120 140 70 134 Q40 130 20 122 Z",BWL),
  E(92,138,22,8,"#3C628C",28),
  LN("M40 136 L54 138 M62 142 L78 143 M88 145 L104 145","#9FB3C8",3),
  LN("M20 116 Q36 124 56 118","#2E4A6B",3)
],[[44,102]],7);

const HP="#9A8BA6", HL="#C9BFD2", HD="#6F617E";
const hipopotamo=draw("hipopotamo","hipopótamo",[
  L("M188 106 L198 118",HD,5),
  R(72,140,24,36,9,HP),R(100,140,24,36,9,HP),R(142,140,24,36,9,HP),R(166,140,22,36,9,HP),
  E(126,114,70,46,HP),
  C(68,66,10,HP),C(68,66,5,"#E59AAE"),
  R(14,72,80,60,28,HP),
  R(4,98,72,48,22,HL),C(18,108,4.5,HD),C(34,108,4.5,HD),
  LN("M10 130 Q38 138 68 130",HD,3),R(22,129,7,8,2,"#FFFDF6"),R(52,129,7,8,2,"#FFFDF6")
],[[54,88]],7);

const BM="#5C4E6B", BWg="#7A6A8C", BLt="#B7A9C6";
const wingL="M96 94 L18 70 L28 98 L10 110 L34 118 L26 140 L96 122 Z";
const murcielago=draw("murcielago","murciélago",[
  P(wingL,BWg),P(mirror(wingL),BWg),
  LN("M96 100 L30 84 M96 108 L22 112 M96 116 L34 132","#5C4E6B",2.5),
  LN(mirror("M96 100 L30 84 M96 108 L22 112 M96 116 L34 132"),"#5C4E6B",2.5),
  R(94,140,8,16,3,BM),R(106,140,8,16,3,BM),
  E(104,114,24,32,BM),E(104,120,14,20,BLt),
  P("M84 68 L78 34 L100 56 Z",BM),P("M124 68 L130 34 L108 56 Z",BM),
  P("M85 62 L82 44 L94 56 Z","#E59AAE"),P("M123 62 L126 44 L114 56 Z","#E59AAE"),
  C(104,76,25,BM),
  P("M98 88 L101 95 L104 88 Z","#FFFDF6"),P("M104 88 L107 95 L110 88 Z","#FFFDF6"),
  C(104,82,3.5,"#3A2F45")
],[[95,72],[113,72]],6);

// ---------- Aves y dinosaurios ----------
const HB="#D08A4E", HW="#A8622E", HT="#7E4A26", RED="#E04B3A", YEL="#F2C230", LEG="#E9A23B";
const gallina=draw("gallina","gallina",[
  L("M104 148 L100 176",LEG,5),L("M124 148 L126 176",LEG,5),
  LN("M90 177 L100 176 L108 178 M116 177 L126 176 L134 178",LEG,4),
  P("M150 100 L184 62 L180 98 L198 90 L172 132 Z",HT),
  E(118,118,52,38,HB),E(84,98,20,26,HB,-30),
  C(62,56,8,RED),C(72,52,9,RED),C(83,56,8,RED),
  C(72,80,24,HB),
  P("M50 78 L32 85 L50 92 Z",YEL),E(54,100,6,9,RED),
  E(128,116,28,19,HW,-12),LN("M112 118 Q128 126 146 116","#8A4E24",2.5)
],[[68,76]],7);

const PB="#2E3646", PW="#F4F1EA", PO="#F29A2E";
const pinguino=draw("pinguino","pingüino",[
  E(90,174,15,7,PO),E(118,174,15,7,PO),
  E(62,114,11,32,PB,20),E(146,114,11,32,PB,-20),
  E(104,106,46,72,PB),E(104,118,32,56,PW),
  P("M76 64 Q104 46 132 64 Q118 74 104 70 Q90 74 76 64 Z",PB),
  P("M95 80 L104 94 L113 80 Z",PO)
],[[92,72],[116,72]],6,cheek(84,86,5)+cheek(124,86,5));

const TG="#6E9E5A", TL="#C7D9A0", TD="#4E7A44";
const trex=draw("trex","T-rex",[
  P("M132 90 L202 130 L198 140 L136 136 Z",TG),
  R(150,136,18,36,7,TD),R(144,168,32,9,4,TD),
  E(122,110,42,32,TG,-22),E(112,120,22,16,TL,-22),
  E(98,86,18,26,TG,32),
  R(124,134,18,38,7,TG),R(116,168,32,9,4,TG),
  R(32,82,62,16,8,TD),
  R(26,42,76,44,16,TG),
  P("M38 86 L42 93 L46 86 L50 93 L54 86 L58 93 L62 86 L66 93 L70 86 Z","#FFFDF6"),
  L("M100 106 L90 118 L84 116",TG,6),
  C(36,54,3,TD),R(64,46,18,6,3,TD)
],[[73,59]],7);

// ---------- Reptil, anfibio y pez ----------
const KG="#5E8F55", KL="#B9CC86", KD="#3F6B3F";
const cocodrilo=draw("cocodrilo","cocodrilo",[
  P("M150 116 L204 128 L204 136 L150 146 Z",KG),
  R(68,138,16,28,6,KD),R(136,138,16,28,6,KD),
  R(52,106,112,42,18,KG),R(60,134,96,10,5,KL),
  P("M74 108 L80 97 L86 108 L92 97 L98 108 L104 97 L110 108 L116 97 L122 108 L128 97 L134 108 L140 97 L146 108 Z",KD),
  R(4,112,68,26,10,KG),E(68,112,22,16,KG),C(66,100,11,KG),
  P("M12 128 L15 134 L18 128 L24 128 L27 134 L30 128 L38 128 L41 134 L44 128 L52 128 L55 134 L58 128 Z","#FFFDF6"),
  R(90,138,16,28,6,KG),R(152,138,14,26,6,KG),
  C(10,118,2.5,KD),LN("M6 128 L64 128",KD,3)
],[[66,99]],6.5);

const FG="#7AB648", FL="#D3E6AA", FD="#5A8C36";
const rana=draw("rana","rana",[
  E(58,150,32,18,FG,-15),E(150,150,32,18,FG,15),
  E(40,172,18,6,FD),E(168,172,18,6,FD),
  E(104,128,52,44,FG),E(104,140,32,30,FL),
  R(80,140,12,32,6,FG),R(116,140,12,32,6,FG),E(84,173,11,5,FD),E(124,173,11,5,FD),
  C(74,68,19,FG),C(134,68,19,FG),
  E(104,98,60,34,FG),
  LN("M72 106 Q104 124 136 106",FD,3.5)
],[[74,66],[134,66]],11,cheek(70,108,6)+cheek(138,108,6));

const SG="#7D93A8", SW="#E8EDF0", SD="#5F7488";
const tiburon=draw("tiburon","tiburón",[
  P("M162 104 L200 62 L190 108 L200 152 Z",SG),
  P("M88 78 L112 36 L128 80 Z",SG),
  P("M8 108 Q30 72 100 72 Q150 74 172 104 Q150 136 100 138 Q30 140 8 108 Z",SG),
  P("M14 114 Q40 136 100 136 Q148 134 168 110 Q120 126 60 122 Q30 120 14 114 Z",SW),
  P("M92 122 L78 156 L112 128 Z",SD),
  LN("M60 94 Q56 104 60 114 M70 94 Q66 104 70 114 M80 94 Q76 104 80 114","#4E6275",3),
  P("M22 117 L25 122 L28 118 L31 123 L34 118 L37 123 L40 118 Z","#FFFDF6"),
  LN("M18 115 Q30 121 44 117","#3D4E60",3)
],[[36,98]],7);

window.SPECIES=[humano,chimpance,perro,lobo,gato,leon,ballena,hipopotamo,murcielago,gallina,pinguino,trex,cocodrilo,rana,tiburon];
window.SPECIES.byId=Object.fromEntries(window.SPECIES.map(s=>[s.id,s]));
})();
