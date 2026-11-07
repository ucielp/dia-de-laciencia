#!/usr/bin/env python3
"""Día de la Ciencia v2 — ideas con efecto WOW (1r-2n primària)."""
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
                                ListFlowable, ListItem, KeepTogether)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FD = "/usr/share/fonts/truetype/dejavu/"
for n, f in [("DV", "DejaVuSans"), ("DV-B", "DejaVuSans-Bold"), ("DV-I", "DejaVuSans-Oblique"), ("DV-BI", "DejaVuSans-BoldOblique")]:
    pdfmetrics.registerFont(TTFont(n, FD + f + ".ttf"))
pdfmetrics.registerFontFamily("DV", normal="DV", bold="DV-B", italic="DV-I", boldItalic="DV-BI")

ACC = colors.HexColor("#c2410c")     # warm orange accent
ACC_L = colors.HexColor("#fff4ec")
INK = colors.HexColor("#1f2933")
GREY = colors.HexColor("#5b6670")
LG = colors.HexColor("#f4f5f7")
WARN = colors.HexColor("#fdecec")

ss = {
    "title": ParagraphStyle("t", fontName="DV-B", fontSize=22, leading=27, textColor=ACC, spaceAfter=4),
    "sub": ParagraphStyle("s", fontName="DV", fontSize=11, leading=15, textColor=GREY, spaceAfter=10),
    "h1": ParagraphStyle("h1", fontName="DV-B", fontSize=15, leading=19, textColor=ACC, spaceBefore=10, spaceAfter=6),
    "h2": ParagraphStyle("h2", fontName="DV-B", fontSize=11.5, leading=15, textColor=INK, spaceBefore=8, spaceAfter=3),
    "body": ParagraphStyle("b", fontName="DV", fontSize=9.6, leading=13.3, textColor=INK, spaceAfter=4),
    "small": ParagraphStyle("sm", fontName="DV", fontSize=7.9, leading=10.4, textColor=GREY),
    "cell": ParagraphStyle("c", fontName="DV", fontSize=8.1, leading=10.4, textColor=INK),
    "cellb": ParagraphStyle("cb", fontName="DV-B", fontSize=8.1, leading=10.4, textColor=INK),
    "cellw": ParagraphStyle("cw", fontName="DV-B", fontSize=8.1, leading=10.4, textColor=colors.white),
    "quote": ParagraphStyle("q", fontName="DV-I", fontSize=9.6, leading=13.3, textColor=INK, backColor=ACC_L,
                            borderPadding=6, leftIndent=6, rightIndent=6, spaceBefore=4, spaceAfter=8),
}


def P(t, s="body"):
    return Paragraph(t, ss[s])


def bl(items):
    return ListFlowable([ListItem(P(i), leftIndent=12) for i in items], bulletType="bullet", start="•",
                        leftIndent=12, bulletFontName="DV", bulletFontSize=8)


def nl(items):
    return ListFlowable([ListItem(P(i), leftIndent=14) for i in items], bulletType="1", leftIndent=14,
                        bulletFontName="DV", bulletFontSize=9)


def table(header, rows, widths, zebra=True):
    d = [[P(h, "cellw") for h in header]] + [[P(c, "cell") for c in r] for r in rows]
    t = Table(d, colWidths=[w * cm for w in widths], repeatRows=1)
    st = [("BACKGROUND", (0, 0), (-1, 0), ACC), ("VALIGN", (0, 0), (-1, -1), "TOP"),
          ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#c9ced3")),
          ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
          ("LEFTPADDING", (0, 0), (-1, -1), 3), ("RIGHTPADDING", (0, 0), (-1, -1), 3)]
    if zebra:
        st.append(("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LG]))
    t.setStyle(TableStyle(st))
    return t


def box(text, bg=ACC_L, border=ACC):
    t = Table([[P(text)]], colWidths=[17.2 * cm])
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), bg), ("BOX", (0, 0), (-1, -1), 0.6, border),
                           ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                           ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8)]))
    return t


def footer(c, doc):
    c.saveState()
    c.setFont("DV", 7.5)
    c.setFillColor(GREY)
    c.drawString(1.8 * cm, 1.1 * cm, "Día de la Ciencia · 1r i 2n de Primària · El Masnou · v2: ideas con efecto WOW · U. Chorostecki")
    c.drawRightString(A4[0] - 1.8 * cm, 1.1 * cm, f"pág. {doc.page}")
    c.restoreState()


# ---------------------------------------------------------------------------------------------
# Ideas catalogue: (id, name, wow, minutes, cost, who/source short, what kids do, why it hooks, link, cautions)
# ---------------------------------------------------------------------------------------------
IDEAS = [
    ("A1", "Paciente Cero: el germen invisible que brilla", 5, "Sembrar al inicio + 15 al final", "40–60 €",
     "Mark Rober (vídeo viral en un aula de 3º con Glo Germ); yourgenome/Wellcome «Handshake Hazard»",
     "Sin que nadie lo sepa, al empezar le pones polvo/gel fluorescente invisible en la mano a 1–2 niños (o a ti). Durante la sesión se tocan, se dan la mano, abren la puerta. Al final: luces apagadas, linterna UV, y media clase brilla en la oscuridad. Entonces viene el misterio: entre todos reconstruyen en la pizarra «¿quién tocó a quién?» y encuentran al Paciente Cero.",
     "Oscuridad + cosas que brillan + misterio + ellos son los detectives. Les pilla por sorpresa: no sabían que estaban dentro del experimento.",
     "Es epidemiología y ciencia de redes: «con ordenadores y el ARN del virus encontramos al Paciente Cero entre millones de personas, así se siguió la COVID».",
     "No tóxico. Solo en manos, no en cara. Lavado al final. Avisar a las profes (no a los niños)."),
    ("A2", "Entrena a la máquina en directo… y engáñala", 5, "15", "0 €",
     "Google Teachable Machine; guía «Learning like a robot» (4–7 años); Blakeley Payne (MIT Media Lab) con niños de 6–10",
     "En el proyector, en 2 minutos, entrenas al ordenador con voluntarios: «brazos arriba = dinosaurio, brazos abajo = pájaro» (o un peluche vs un coche). Luego toda la clase hace la pose y la pantalla adivina. Después intentan engañarla con medias poses o con un peluche. Gran giro final: la entrenaste solo con un niño o solo con objetos rojos, y falla con los demás.",
     "Ellos son los datos con su propio cuerpo. Y ganan cuando la engañan. Entienden «la máquina solo sabe lo que le enseñamos» sin una palabra técnica.",
     "Es literalmente tu trabajo: «Yo le enseño al ordenador miles de formas de ARN, igual que vosotros le habéis enseñado dinosaurios».",
     "Funciona en el navegador sin enviar imágenes. Usar poses u objetos, no caras. No guardar el proyecto. Probar en casa con el wifi del colegio (o sin wifi) antes."),
    ("A3", "Pulmones de verdad que se inflan", 5, "8–10", "5–10 € (carnicería) o kit 150–300 €",
     "Outreach universitario: U. Edinburgh (6º primaria), UAB (3º), una médica-madre en Dunedin con pulmones de ciervo y un inflador de bici",
     "Sacas de una bandeja unos pulmones de cerdo (en la carnicería: «bofe»/«asadura», pídelos con tráquea). Metes un tubo y bombeas: el órgano flácido se hincha enorme y rosa y luego «suspira». Toda la clase respira al mismo ritmo que el pulmón.",
     "Real, enorme, un poco asqueroso y parece vivo. Es el tipo de momento que cuentan en casa esa misma noche.",
     "«Cada trocito rosa son millones de células, y cada una tiene su libro de instrucciones».",
     "Guantes, bandeja, bolsa. Avisar a las familias con una nota (familias vegetarianas o niños aprensivos: pueden mirar desde lejos)."),
    ("A4", "Papá robot: el reto de las instrucciones exactas", 5, "10–15", "5 €",
     "Josh Darnit «Exact Instructions Challenge» (vídeo viral); Linda Liukas «Hello Ruby»; CATEDU (Aragón) para infantil y 1er ciclo",
     "Eres un robot que hace EXACTAMENTE lo que le dicen. Los niños te dictan cómo hacer un bocadillo de mermelada: si dicen «pon la mermelada en el pan», pones el bote cerrado encima del pan. Con cada error lo arreglan («depurar»). Versión biología: «yo soy una célula y vosotros sois mi ADN; cada error es una mutación» y sale un bocadillo monstruo.",
     "Un adulto que obedece a niños y hace el tonto. Es la actividad que más risas genera a esta edad.",
     "El ADN es un programa que lee una máquina (el ribosoma). Una letra mal y sale otra cosa.",
     "Alergias: usar pan sin frutos secos. Cuchillo de plástico."),
    ("A5", "¿Chihuahua o magdalena? Niños contra la IA", 4, "5", "0 €",
     "Mariya Yao (freeCodeCamp) probó APIs de visión con la cuadrícula chihuahua/magdalena: «un niño pequeño gana al deep learning»",
     "Proyectas la famosa cuadrícula de fotos. La clase grita «¡perro!» o «¡magdalena!» en cada una. Luego enseñas en cuáles se equivocó el ordenador. Hay más parejas: perro pastor/fregona, labradoodle/pollo frito.",
     "Fotos graciosas y ellos ganan al ordenador. Perfecto para abrir y bajar nervios.",
     "La IA no «ve» como nosotros: busca patrones, y a veces patrones equivocados.",
     "Ninguno."),
    ("A6", "Carrera contra la IA que adivina dibujos (Quick, Draw!)", 4, "10", "0 €",
     "Google Quick, Draw! (50 millones de dibujos, 345 categorías)",
     "Un voluntario dibuja en el portátil o en la pizarra digital mientras la IA dice en voz alta lo que cree que es. La clase intenta adivinar antes que la máquina. Al final enseñas cientos de gatos dibujados por niños de todo el mundo.",
     "La máquina habla y es una carrera. Todos quieren salir a dibujar.",
     "«La IA aprende de millones de dibujos; yo busco patrones en millones de trozos de ARN».",
     "Necesita internet. Sin cámara. Tener un vídeo grabado por si falla el wifi."),
    ("A7", "Bebés monstruo: genética a cara o cruz", 4, "30", "20 €",
     "ASU «Ask A Biologist: Monster Inheritance»; Maine DOE «A Pack of Monsters» (1º primaria); U. Edinburgh «Build a monster»",
     "Por parejas: uno es «mamá monstruo» y otro «papá monstruo», cada uno con su carta de rasgos (cuernos sí/no, 1 o 3 ojos, manchas, color). Para cada rasgo tiran una moneda y construyen el bebé con plastilina y limpiapipas. Los hermanos salen distintos. Carta sorpresa «mutación»: un error en la receta da un rasgo nuevo que no tenía nadie.",
     "Monstruos, crear con las manos, azar, y responde a algo que se preguntan de verdad: «¿por qué me parezco a mamá?».",
     "El gen es una receta. El ARN es la fotocopia con la que cocina la célula. La mutación es una errata.",
     "Plastilina sin gluten si hay celíacos."),
    ("A8", "Inmunidad: pilla-pilla de superhéroes (con vacuna)", 4, "15–20", "0–15 €",
     "Science in School «Ready, set, infect!»; HowToSmile (cinturones rojos para gérmenes, pulseras blancas para glóbulos blancos)",
     "En el patio: unos niños son virus que intentan cruzar «el cuerpo». Otros son la piel (se dan la mano y hacen muro). Otros son glóbulos blancos que pillan virus. Ronda «vacuna»: antes de empezar, los glóbulos blancos ven el cartel de «SE BUSCA» con la cara del virus, y lo pillan mucho más rápido.",
     "Correr, superhéroes, y es de los pocos juegos que funcionan con 50 niños a la vez. Explica las vacunas sin agujas.",
     "Dengue y zika: virus de ARN que estudias. «Una vacuna es enseñarle al cuerpo el cartel de SE BUSCA».",
     "Nivel educación física. Andar rápido en vez de correr si el espacio es pequeño."),
    ("A9", "Estornudo medido: ¿hasta dónde llega?", 4, "10", "<10 €",
     "yourgenome «Sneeze Zone» (lo usó un Year 1 en un STEAM day); Science Friday; MIT midió gotas a 6–8 m",
     "Una tira de papel de 4 m en el suelo con muñequitos dibujados. Cada uno apuesta dónde caerá el «estornudo» y se pone ahí. Disparas un pulverizador con agua coloreada: medís, contáis cuántos muñecos se «contagiaron». Repetís con un pañuelo y con el codo.",
     "Estornudar sobre cosas, apostar, y descubrir que se equivocaron. Además salen datos para hacer un gráfico.",
     "Virus respiratorios (de ARN) y un gráfico de clase en directo.",
     "Agua con colorante mancha: hacerlo en el patio o con plástico."),
    ("A10", "Placa de tus manos: lo que vive en ti (resultado en una semana)", 5, "15 + 10 a la semana", "≈1 € por placa",
     "Tasha Sturm: foto viral de la mano de su hijo de 8 años en agar (≈2 M de vistas); Science in School «Painting in a petri dish» (U. Lisboa)",
     "Enseñas la foto de la mano de colores. Cada grupo apoya los dedos en una placa antes de lavarse y en otra después. Algún voluntario toca el móvil, una zapatilla o una moneda. Las placas se van contigo y a la semana vuelves (o mandas fotos) con colonias de colores: «esto vive en VOSOTROS».",
     "Lo descubren días después: es la actividad que se recuerda semanas. Es personal, asquerosa y bonita a la vez.",
     "Microbioma: «en mi laboratorio leemos el ADN de estos bichitos para saber quiénes son».",
     "Las placas las preparas, incubas (≤25 °C, nunca a 37 °C) y destruyes tú en tu instituto. Cerradas con cinta y NUNCA se reabren. Pedir permiso a dirección. Si dicen que no: usa la foto viral y listo."),
    ("A11", "La biblioteca gigante y la caza de la errata", 4, "10", "Impresión + hilo",
     "Wellcome Collection (genoma humano impreso: más de 100 volúmenes, una estantería enorme); packs de DNA origami Oxford/Royal Society",
     "Sacas 2 metros de hilo fino de una cajita del tamaño de un guisante: «esto está en cada puntito de vosotros». Enseñas la foto de la estantería del genoma impreso, más alta que una jirafa, escrita solo con A, C, G y T. Cada niño recibe una tira de letras de colores y busca la errata escondida (la mutación) o su «palabra secreta».",
     "Escala gigante + truco de magia + búsqueda del tesoro.",
     "Literalmente tu trabajo: leer el libro y encontrar las erratas, pero con un ordenador que lo hace en un segundo.",
     "Ninguno. Las cifras de volúmenes varían según la fuente: di «más de 100 libros»."),
    ("A12", "Gráfico humano + el ordenador lo dibuja en directo", 3, "10", "0 €",
     "Práctica docente común (sin fuente única)",
     "«¿Cuántos dientes se os han caído?» o «¿animal favorito?». Los niños se ponen en filas en el suelo marcado con cinta: son un gráfico de barras humano. Tú tecleas los números y aparece el gráfico en la pantalla. Pregunta de detective: «¿qué grupo es el más grande? ¿hay alguna sorpresa?».",
     "Se mueven, se ven a sí mismos convertidos en datos y luego en un dibujo en la pantalla.",
     "«Yo hago gráficos con millones de datos, pero la idea es esta».",
     "Solo números de grupo, nada personal."),
    ("A13", "Tu brazo lo controla mi cerebro (Backyard Brains)", 5, "10", "≈300 € (kit)",
     "Greg Gage / Backyard Brains, «Human-Human Interface» (charla TED con millones de vistas)",
     "Un niño aprieta el puño y TU brazo se mueve solo. Luego van turnándose para «controlarte». Es la demo más espectacular de toda la lista, pero cuesta dinero.",
     "Sienten que tienen un superpoder y que controlan a un adulto.",
     "El cuerpo funciona con señales eléctricas, que son datos que un ordenador puede leer.",
     "Solo tú recibes la estimulación; el niño solo lleva electrodos pasivos. Revisar instrucciones del fabricante. Opcional: quizá tu universidad tenga uno."),
    ("A14", "Construye un virus con su receta de ARN dentro", 3, "20–25", "20 €",
     "Glasgow Caledonian Univ. (Glasgow Science Festival 2025); Alaska Afterschool «Construye un virus» (en castellano, 5–9 años)",
     "Cada niño hace un virus con una bola, plastilina y limpiapipas (las «llaves» para entrar en la célula). Antes de cerrarlo, mete dentro una tira de papel con su «receta de ARN» de colores. Al final, foto de microscopio electrónico del virus del zika: «¡se parece al vuestro!».",
     "Crear algo con las manos que se pueden llevar, y la idea de un «paquete secreto» dentro.",
     "La más directa con tu proyecto de dengue/zika: «un virus es una bolsa con una receta de ARN; yo leo esa receta».",
     "Ninguno."),
    ("A15", "Sangre en un bote para llevar a casa", 3, "15–20", "≈1 €/niño",
     "U. Liverpool «Make your own blood» (6–11 años, «la actividad más popular» de su evento); U. Salford «Build your blood»",
     "Cada niño llena un bote: agua amarilla con sal (plasma), cereales rojos (glóbulos rojos), pompones blancos (glóbulos blancos), confeti (plaquetas). Lo agitan y se lo llevan.",
     "Un souvenir de «sangre de verdad». Les encanta llevárselo.",
     "«En un análisis de sangre se puede leer el ARN y el ADN para saber si estás enfermo».",
     "No comer. Evitar nubes con gelatina de cerdo (usar pompones); cereales con gluten. Botes con rosca."),
    ("A16", "Ojo de cerdo: la lente que es un cristal", 4, "10", "Pocos € (carnicería)",
     "Exploratorium (San Francisco) «Cow eye dissection»; Science Museum of Virginia",
     "Abres un ojo de cerdo bajo la cámara del portátil proyectada. Sale una gelatina negra y luego una lente transparente como un cristal, que aumenta las letras de un papel.",
     "Asqueroso y precioso a la vez: «la joya escondida dentro del ojo».",
     "La retina está hecha de células que captan la luz, y la IA lee fotos del ojo para detectar enfermedades.",
     "Solo corta el adulto. Avisar a las familias. Proyectar para que 50 niños lo vean. Puede ser demasiado para algunos: opcional."),
]

# ---------------------------------------------------------------------------------------------


def build(path):
    doc = SimpleDocTemplate(path, pagesize=A4, leftMargin=1.8 * cm, rightMargin=1.8 * cm, topMargin=1.6 * cm,
                            bottomMargin=1.8 * cm, title="Día de la Ciencia v2 — ideas con efecto WOW", author="Uciel Chorostecki")
    S = []
    S.append(P("Día de la Ciencia: ideas con efecto WOW", "title"))
    S.append(P("1r i 2n de Primària (6–7 años) · El Masnou · Segunda versión, basada en lo que hacen divulgadores profesionales", "sub"))

    S.append(P("Qué cambia respecto a la primera versión", "h1"))
    S.append(P("La primera lista era de experimentos de libro de texto: sacar ADN, hacer un modelo, una pulsera. A un niño de 6 años "
               "no le importa el ADN de una fresa. Lo que sí le importa es <b>ser el protagonista</b>, <b>descubrir un misterio</b>, "
               "ver algo <b>enorme, asqueroso o que brilla</b>, y <b>ganarle a un adulto o a una máquina</b>. "
               "Este reporte sale de cuatro búsquedas paralelas: divulgadores y shows infantiles (Mark Rober, Royal Institution, "
               "Science Museum, Operation Ouch!, Backyard Brains, Emily Calandrelli), IA y programación para 5–8 años, "
               "biomedicina y cuerpo humano en outreach universitario, y programas de divulgación en Cataluña y España."))

    S.append(P("Lo que dicen los que mejor lo hacen", "h1"))
    S.append(bl([
        "<b>Una historia, no una lista.</b> El Science Museum Group y un estudio de UCL con niños de 4–7 años coinciden: la narrativa y la "
        "agencia del niño son lo que engancha. Por eso abajo propongo <b>tres shows con hilo argumental</b>, no actividades sueltas.",
        "<b>Ritmo implacable.</b> Las Christmas Lectures de la Royal Institution sobre el cuerpo humano (Nancy Rothwell) iban a una demo por minuto. "
        "Para 6–7 años: ningún bloque de más de 10–12 minutos sin cambiar de registro (mirar → moverse → hacer).",
        "<b>Que el niño haga, no que mire.</b> Participación real: ellos son los datos, los virus, los detectives, los programadores.",
        "<b>Empezar por algo cotidiano.</b> La regla de Faraday que cita la Royal Institution, y el formato de <i>Maddie's Do You Know?</i> (CBeebies): "
        "una pregunta de su vida diaria (¿por qué estornudamos? ¿por qué me parezco a mamá?) y de ahí a la ciencia.",
        "<b>Lógica antes que pantallas.</b> Linda Liukas (<i>Hello Ruby</i>) y la guía de CATEDU (Aragón) para infantil y primer ciclo: "
        "la IA se entiende primero con el cuerpo (clasificar, ordenar, equivocarse) y luego se enseña en la pantalla.",
    ]))
    S.append(Spacer(1, 4))
    S.append(box("<b>Urgente (plazo 30 de noviembre de 2026):</b> la <b>Iniciativa 11F</b> (Día Internacional de la Mujer y la Niña en la Ciencia, "
                 "11 de febrero) abre del 15 oct al 30 nov 2026 el plazo para que los colegios pidan charlas; acepta solicitudes tardías hasta el 1 feb 2027. "
                 "Si el Día de la Ciencia del colegio puede caer en torno al 11 de febrero, registrar la visita en 11defebrero.org la hace oficial y da visibilidad. "
                 "Además, la <b>Setmana de la Ciència</b> (FCRi) es del 6 al 15 de noviembre de 2026: si la visita cae en esas fechas, se puede inscribir como actividad."))

    # ---------------- Shows ----------------
    S.append(PageBreak())
    S.append(P("Tres shows con historia (elige uno o mézclalos)", "h1"))
    S.append(P("Cada show dura 50–60 minutos, tiene un hilo argumental y un gran final. Los códigos (A1, A2…) remiten al catálogo de la página siguiente."))

    S.append(P("Show 1 · «Misión Paciente Cero: hay un germen invisible en esta clase»", "h2"))
    S.append(P("Mi favorito: une virus de ARN (tu trabajo en dengue/zika), datos y redes. La clase está dentro del experimento sin saberlo desde el minuto uno."))
    S.append(table(["Min", "Momento", "Qué pasa"], [
        ["0", "Siembra secreta (A1)", "Antes de entrar, gel UV invisible en tu mano y en la de 1–2 niños (acordado con la profe). Saludas a varios al entrar."],
        ["0–5", "La pregunta", "«Hoy hay un germen invisible en esta clase. Al final vamos a descubrir quién lo trajo.» Foto de un virus de verdad al microscopio."],
        ["5–15", "¿Cómo viaja? (A9)", "Estornudo medido en una tira de 4 m: apuestan, disparas, contáis los muñecos contagiados. Con pañuelo, con codo."],
        ["15–25", "¿Qué hay dentro? (A14 versión rápida o A3)", "O pulmones de cerdo que se inflan («aquí es donde llega el estornudo»), o un virus gigante de plastilina con su receta de ARN dentro."],
        ["25–35", "La máquina que reconoce (A2)", "Teachable Machine: entrenas «sano» (brazos arriba) vs «enfermo» (brazos cruzados). La engañan. «Yo enseño a los ordenadores a reconocer virus por su receta.»"],
        ["35–50", "Superhéroes (A8)", "Pilla-pilla en el patio o gimnasio: piel, glóbulos blancos y virus. Segunda ronda con «vacuna» (el cartel de SE BUSCA)."],
        ["50–60", "Gran final: apagón (A1)", "Luces apagadas, linterna UV. Brillan manos, el pomo de la puerta, tu mano. Entre todos dibujan en la pizarra la red de contactos y encuentran al Paciente Cero. Luego, a lavarse las manos y volver a mirar con la UV."],
    ], [1.5, 4.2, 11.5]))

    S.append(P("Show 2 · «Enséñale a la máquina»: datos, patrones e inteligencia artificial", "h2"))
    S.append(P("El show de tu lado de ciencia de datos. Funciona en el aula, sin nada sucio, solo con portátil y proyector."))
    S.append(table(["Min", "Momento", "Qué pasa"], [
        ["0–5", "¿Chihuahua o magdalena? (A5)", "Niños contra la IA. Ganan ellos. «Los ordenadores no ven como vosotros: buscan patrones.»"],
        ["5–15", "Papá robot (A4)", "El reto de las instrucciones exactas con el bocadillo. Risas. «Un programa es una lista de instrucciones exactas. El ADN también.»"],
        ["15–25", "Quick, Draw! (A6)", "Carrera: la clase contra la IA que adivina dibujos. Enseñas los miles de gatos dibujados por niños del mundo."],
        ["25–40", "Entrena a la máquina (A2)", "Teachable Machine con poses o peluches. La engañan. Giro: solo la entrenaste con un niño y falla con los demás."],
        ["40–50", "Gráfico humano (A12)", "Dientes caídos o animal favorito: se colocan en filas y aparece el gráfico en la pantalla."],
        ["50–60", "Gran final: la caza de la errata (A11)", "Cada uno busca la errata escondida en su tira de letras de colores (1–2 min). Luego tu portátil la encuentra en un millón de letras en menos de un segundo, con un programa de 3 líneas proyectado."],
    ], [1.5, 4.2, 11.5]))

    S.append(P("Show 3 · «Monstruos, recetas y erratas»: genética para 6 años", "h2"))
    S.append(P("Para el lado genómica/ARN. Muy manual y creativo, ideal con mesas y profes ayudando."))
    S.append(table(["Min", "Momento", "Qué pasa"], [
        ["0–5", "¿Por qué te pareces a mamá?", "Pregunta de su vida. Hilo de 2 m que sale de una cajita: «esto está en cada puntito de ti» (A11)."],
        ["5–15", "Papá robot versión ADN (A4)", "«Yo soy una célula y vosotros sois mi receta.» Cada error de instrucción = mutación = bocadillo monstruo."],
        ["15–45", "Bebés monstruo (A7)", "Cara o cruz por cada rasgo, construyen el bebé en plastilina. Carta mutación. Desfile de familias de monstruos: ¿por qué los hermanos son distintos?"],
        ["45–55", "El ARN mensajero", "Un niño con capa de «mensajero» lleva la receta de un monstruo a otra mesa, que tiene que construirlo sin ver el original. ¿Sale igual?"],
        ["55–60", "Final: la biblioteca gigante (A11)", "Foto de la estantería del genoma impreso. «Yo leo este libro con ordenadores y busco las erratas que causan enfermedades.»"],
    ], [1.5, 4.2, 11.5]))
    S.append(Spacer(1, 6))
    S.append(box("<b>Mi recomendación:</b> el <b>Show 1 (Paciente Cero)</b>. Tiene misterio, oscuridad, movimiento, un poco de asco, IA y un final que se cuenta en casa. "
                 "Y conecta con tu investigación real (virus de ARN + búsqueda con ordenadores). Si prefieres algo 100 % limpio y en el aula, el Show 2. "
                 "Si te dan dos sesiones, haz el 1 con una clase y el 2 con la otra, o el 1 el día de ciencia y vuelve a la semana con las <b>placas de las manos (A10)</b> como «segunda parte»."))

    # ---------------- Catalogue table ----------------
    S.append(PageBreak())
    S.append(P("Catálogo: 16 ideas ordenadas por efecto WOW", "h1"))
    S.append(P("WOW de 1 a 5 según el atractivo para 6–7 años (mi valoración a partir de las fuentes). Minutos de aula reales. Las fichas detalladas vienen después.", "small"))
    S.append(Spacer(1, 4))
    rows = [[i[0], i[1], f"{i[2]}/5", i[3], i[4], i[5].split(";")[0]] for i in IDEAS]
    S.append(table(["#", "Idea", "WOW", "Min", "Coste", "Quién lo hace / fuente"], rows, [0.9, 4.8, 1.1, 2.1, 2.3, 6.0]))

    # ---------------- Idea sheets ----------------
    S.append(PageBreak())
    S.append(P("Fichas de cada idea", "h1"))
    for (code, name, wow, mins, cost, who, what, why, link, caut) in IDEAS:
        blk = [P(f"{code} · {name}", "h2"),
               P(f"<b>WOW:</b> {'★' * wow}{'☆' * (5 - wow)} · <b>Tiempo:</b> {mins} min · <b>Coste:</b> {cost}", "small"),
               P(f"<b>De dónde sale:</b> {who}", "small"),
               Spacer(1, 3),
               P(f"<b>Qué hacen los niños.</b> {what}"),
               P(f"<b>Por qué engancha.</b> {why}"),
               P(f"<b>Tu frase puente.</b> <i>{link}</i>"),
               P(f"<b>Cuidado con.</b> {caut}"),
               Spacer(1, 6)]
        S.append(KeepTogether(blk))

    # ---------------- Borrow / Catalonia ----------------
    S.append(PageBreak())
    S.append(P("Recursos de Cataluña y España que puedes pedir o descargar", "h1"))
    S.append(P("Casi todos los programas estructurados de centros de investigación empiezan en 3º–5º de primaria. Para 6–7 años lo útil son materiales descargables, un juego para pedir prestado, ciencia ciudadana y buenos libros."))
    S.append(table(["Recurso", "Qué es y cómo usarlo", "Cómo conseguirlo"], [
        ["«Quién es quién» de científicas (PRBB)", "Juego tipo «¿Quién es quién?» con científicas de distintas culturas. «¿Lleva gafas? ¿Trabaja con ADN?» Perfecto como estación o para abrir, y rompe el estereotipo.", "Maleta de madera 80×80 cm en préstamo (gender@prbb.org) o fichas imprimibles en prbb.org/divulgacion.php"],
        ["Cuaderno de actividades EMBL (castellano)", "El PRBB lo recomienda explícitamente para primer ciclo de primaria. Para llevar a casa o estación tranquila.", "PDF gratis en resources.embl.org"],
        ["Mosquito Alert (CEAB-CSIC, CREAF, UPF)", "App gratuita en catalán (4+). «Detectives de mosquitos»: foto → experto valida → punto en el mapa. Puente perfecto con datos e IA y con el dengue.", "App gratuita. Reto en familia mejor en primavera (en noviembre hay pocos mosquitos)"],
        ["«Melanogaster: Catch the Fly!» (IBE CSIC-UPF, Josefa González)", "Trampa de plátano en un bote para atrapar moscas de la fruta y enviarlas al laboratorio, que lee su genoma. Encontraron el «virus Tomelloso».", "Contactar con el grupo para ver si siguen reclutando. Coste casi cero"],
        ["Genigma (CRG/CNAG)", "Juego de móvil donde los jugadores ayudan a ordenar el genoma del cáncer de mama. Demo de 5 min: «jugando se ayuda a la ciencia».", "App gratuita (catalán/castellano)"],
        ["BSC «L'aventura de la supercomputació a l'aula»", "Juegos y retos sin pantalla sobre «un ordenador sigue órdenes». Pensado para 3º–4º, adaptable.", "visitesprimaria@bsc.es"],
        ["Formato «Periodistas científicos» (PRBB)", "Los niños preparan antes preguntas dibujadas y el día de la visita te «entrevistan» como reporteros. Muy fácil de copiar.", "Idea libre; kit para 4º–5º en comunicacio@prbb.org"],
        ["Libros", "<i>Genética</i> (Carlos Pazos, Futuros Genios, Beascoa): libro de cartón de 24 págs., ≈10 €, para leer en voz alta. <i>Mati y los Matemonstruos</i> (Clara Grima y Raquel Gu, desde 6 años): gráficos, estadística, códigos secretos.", "Librerías"],
        ["e-Bug (UKHSA) en castellano", "Materiales oficiales de higiene y microbios para 5–7 años.", "PDF gratis; también en la librería del Ministerio de Educación"],
    ], [3.8, 8.4, 5.0]))

    S.append(P("Ganchos con el currículo catalán (cicle inicial, Decret 175/2022)", "h2"))
    S.append(P("Útil para «vender» la propuesta a la tutora: <b>1.2.1</b> funciones vitales de los seres vivos frente a objetos inertes; "
               "<b>1.2.3</b> clasificar seres vivos por rasgos observables; <b>1.2.5</b> hábitos saludables e higiene; "
               "<b>1.1.1–1.1.2</b> hacer preguntas, predecir y registrar datos; <b>1.1.5</b> la ciencia como actividad humana con perspectiva de género; "
               "<b>2.2.1</b> pensamiento computacional, órdenes y secuencias. El Show 1 toca cinco de estos puntos."))

    # ---------------- Cautions ----------------
    S.append(P("Lo que NO haría (y por qué)", "h1"))
    S.append(bl([
        "<b>Nitrógeno líquido o «explosiones».</b> Son el recurso fácil de los shows, pero en octubre de 2022 un experimento con nitrógeno líquido en una feria de ciencia en Girona hirió a 18 personas, 10 de ellas niños. No compensa.",
        "<b>El cáncer como tema central.</b> Cancer Research UK señala que los niños pequeños a menudo temen que el cáncer «se contagie» o que lo han causado ellos, y en una clase de 50 puede haber un familiar afectado. Como mucho, «una errata en la receta».",
        "<b>Caras de los niños en pantalla o fotos.</b> Aunque Teachable Machine procesa en local, usa poses, manos u objetos. No grabes ni fotografíes sin el consentimiento escrito que gestione el colegio.",
        "<b>Placas de bacterias sin permiso.</b> Pide autorización a dirección; incuba tú a temperatura ambiente y destruye en tu instituto. Nunca se abren en el aula.",
        "<b>Gelatina de cerdo y gluten.</b> Las nubes y algunas recetas de mocos llevan gelatina porcina; los cereales llevan gluten. Pide la lista de alergias y dietas.",
        "<b>Depender del wifi del colegio.</b> Graba en vídeo las demos en línea (Quick, Draw!, Teachable Machine) por si falla la conexión.",
    ]))

    S.append(P("Ideas extra para dejar huella", "h1"))
    S.append(bl([
        "<b>Carnet o diploma de «Científico/a ayudante»</b> con su nombre y el sello de tu laboratorio. Cuesta casi nada y lo guardan durante años.",
        "<b>La segunda parte una semana después:</b> vuelves con las fotos de las placas de las manos (A10) o mandas un vídeo corto desde el laboratorio enseñando la secuenciadora o el clúster de ordenadores.",
        "<b>Una pregunta para casa:</b> «Pregunta a tu familia: ¿a quién te pareces y en qué?». La traen al día siguiente y la profe hace con ellas un gráfico de clase.",
        "<b>Bata para todos:</b> camisetas viejas de adulto como «bata» desde el principio. Cambia el ambiente en cuanto se la ponen.",
    ]))

    # ---------------- Sources ----------------
    S.append(P("Fuentes", "h1"))
    src = [
        "Mark Rober, germ spread video: thekidshouldseethis.com/post/see-germs-spread-mark-rober",
        "yourgenome (Wellcome Connecting Science), Handshake Hazard y Sneeze Zone: yourgenome.org/wp-content/uploads/2025/01/Handshake-Hazard_Activity-Guide.pdf · yourgenome.org/wp-content/uploads/2025/03/Sneeze-Zone_ActivityGuide.pdf",
        "Google Teachable Machine: teachablemachine.withgoogle.com · guía 4–7 años: smaileproject.github.io/teacher_guides/scenario_training_ai_4-7_guide.docx · Common Sense review: commonsense.org/education/reviews/teachable-machine",
        "Blakeley Payne (MIT) con niños de 6–10: itpro.com/machine-learning/34782/google-tool-teaches-machine-learning-to-six-year-olds",
        "Quick, Draw!: quickdraw.withgoogle.com · dataset: quickdraw.withgoogle.com/data",
        "Chihuahua or muffin (M. Yao): freecodecamp.org/news/chihuahua-or-muffin-my-search-for-the-best-computer-vision-api-cbda4d6b425d/",
        "CATEDU, IA en infantil y primer ciclo: libros.catedu.es (Aplicación de la IA en el aula, cap. 4)",
        "Hello Ruby (Linda Liukas): helloruby.com",
        "Pulmones en outreach: research.ed.ac.uk/en/activities/lung-biology-activitydemonstration/ · odt.co.nz/news/dunedin/pupils-mesmerised-lesson-lungs",
        "Backyard Brains Human-Human Interface: makershed.com/products/human-human-interface",
        "Monster Inheritance (ASU): askabiologist.asu.edu/experiments/monster-inheritance · Maine DOE «A Pack of Monsters» (1st grade)",
        "Science in School: «Ready, set, infect!» scienceinschool.org/content/ready-set-infect · «Painting in a petri dish» scienceinschool.org/content/painting-petri-dish",
        "Mano en agar (T. Sturm): smithsonianmag.com/smart-news/what-happens-when-you-culture-bacteria-eight-year-olds-hand-180955528/",
        "Incubación segura de placas: practicalbiology.org/standard-techniques/incubating-and-viewing-plates.html",
        "U. Liverpool Make your own blood: liverpool.ac.uk (public engagement resources)",
        "Construye un virus (castellano, 5–9): Alaska Afterschool Network, PDF «Learning About COVID-19 SPANISH 5-9»",
        "Exploratorium cow eye: annex.exploratorium.edu/learning_studio/cow_eye/",
        "Genoma impreso, Wellcome Collection: wellcomecollection.org/stories/the-key-to-memory--write-it-down",
        "Science Museum Group, grupos de niños pequeños: sciencemuseumgroup.org.uk/learning/resources/how-make-most-museum-visit-groups-younger-children · UCL 4–7 años: discovery.ucl.ac.uk/10175980/",
        "Royal Institution / Nancy Rothwell: rsb.org.uk/biologist-features/ (artículo «The iguana escaped…»)",
        "Iniciativa 11F: 11defebrero.org · Setmana de la Ciència: setmanaciencia.fcri.cat",
        "PRBB divulgación (Quién es quién, periodistas, EMBL): prbb.org/divulgacion.php",
        "Mosquito Alert: ceab.csic.es/en/programa-educatiu-mosquito-alert-per-aquest-curs/ · Melanogaster Catch the Fly: eu-citizen.science/project/166 · Genigma: pcb.ub.edu/en/?p=70981",
        "e-Bug castellano KS1: e-bug (UKHSA) es_ks1_hh_hand_hygiene.pdf · Cancer Research UK, hablar con niños: cancerresearchuk.org/about-cancer/coping/emotionally/children-resources",
        "Accidente nitrógeno líquido Girona 2022: contextotucuman.com/nota/278647/",
    ]
    for s_ in src:
        S.append(P("• " + s_, "small"))
    S.append(Spacer(1, 6))
    S.append(P("Nota: costes de kits, carnicería y polvo UV son estimaciones. Antes del día conviene comprobar que Teachable Machine funciona con la red del colegio "
               "y que el colegio acepta placas de cultivo y órganos de carnicería.", "small"))

    doc.build(S, onFirstPage=footer, onLaterPages=footer)


if __name__ == "__main__":
    build(sys.argv[1])
