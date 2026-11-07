#!/usr/bin/env python3
"""Build 'Dia de la Ciencia — propuestas de actividades (1r-2n Primaria)' PDF."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, PageBreak,
                                Table, TableStyle, KeepTogether, ListFlowable, ListItem)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FD = "/usr/share/fonts/truetype/dejavu/"
pdfmetrics.registerFont(TTFont("DV", FD + "DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DV-B", FD + "DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("DV-I", FD + "DejaVuSans-Oblique.ttf"))
pdfmetrics.registerFont(TTFont("DV-BI", FD + "DejaVuSans-BoldOblique.ttf"))
pdfmetrics.registerFontFamily("DV", normal="DV", bold="DV-B", italic="DV-I", boldItalic="DV-BI")

ACC = colors.HexColor("#1f6f8b")      # accent
ACC2 = colors.HexColor("#e8f1f5")     # light band
GREY = colors.HexColor("#555555")
LGREY = colors.HexColor("#f3f3f3")

ss = {
    "title": ParagraphStyle("title", fontName="DV-B", fontSize=20, leading=25, textColor=ACC, spaceAfter=4),
    "sub": ParagraphStyle("sub", fontName="DV", fontSize=11, leading=15, textColor=GREY, spaceAfter=10),
    "h1": ParagraphStyle("h1", fontName="DV-B", fontSize=15, leading=19, textColor=ACC, spaceBefore=10, spaceAfter=6),
    "h2": ParagraphStyle("h2", fontName="DV-B", fontSize=11.5, leading=15, textColor=colors.black, spaceBefore=8, spaceAfter=3),
    "body": ParagraphStyle("body", fontName="DV", fontSize=9.6, leading=13.2, alignment=TA_LEFT, spaceAfter=4),
    "small": ParagraphStyle("small", fontName="DV", fontSize=8.2, leading=11, textColor=GREY),
    "cell": ParagraphStyle("cell", fontName="DV", fontSize=8.2, leading=10.5),
    "cellb": ParagraphStyle("cellb", fontName="DV-B", fontSize=8.2, leading=10.5),
    "quote": ParagraphStyle("quote", fontName="DV-I", fontSize=9.6, leading=13.2, leftIndent=12,
                            textColor=colors.HexColor("#333333"), backColor=ACC2, borderPadding=6, spaceBefore=4, spaceAfter=8),
}


def P(t, s="body"):
    return Paragraph(t, ss[s])


def bullets(items, style="body"):
    return ListFlowable([ListItem(P(i, style), leftIndent=12) for i in items],
                        bulletType="bullet", start="•", leftIndent=12, bulletFontName="DV", bulletFontSize=8)


def numbered(items, style="body"):
    return ListFlowable([ListItem(P(i, style), leftIndent=14) for i in items],
                        bulletType="1", leftIndent=14, bulletFontName="DV", bulletFontSize=9)


def infobox(rows):
    """Two-column key/value box used at the top of each activity sheet."""
    data = [[P(k, "cellb"), P(v, "cell")] for k, v in rows]
    t = Table(data, colWidths=[3.4 * cm, 13.3 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), ACC2),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LINEBELOW", (0, 0), (-1, -2), 0.3, colors.white),
        ("BOX", (0, 0), (-1, -1), 0.5, ACC),
    ]))
    return t


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFont("DV", 7.5)
    canvas.setFillColor(GREY)
    canvas.drawString(1.8 * cm, 1.1 * cm, "Día de la Ciencia · 1r i 2n de Primària (El Masnou) · propuestas de actividades · U. Chorostecki, UIC Barcelona")
    canvas.drawRightString(A4[0] - 1.8 * cm, 1.1 * cm, f"pág. {doc.page}")
    canvas.restoreState()


# --------------------------------------------------------------------------------------
# Activity definitions
# --------------------------------------------------------------------------------------
ACTS = []


def act(num, name, tagline, box, what, learn, steps, materials, say, tips, warn, source):
    ACTS.append(dict(num=num, name=name, tagline=tagline, box=box, what=what, learn=learn, steps=steps,
                     materials=materials, say=say, tips=tips, warn=warn, source=source))


act(1, "Sacar el ADN de una fresa",
    "El clásico que nunca falla: ven con sus ojos los hilos blancos de ADN.",
    [("Tiempo en aula", "25–30 min (10 min de preparación previa en casa)"),
     ("Formato", "Grupos de 4–5 niños con un adulto cada 2 grupos; o demostración en mesa grande con 2–3 niños ayudantes por paso"),
     ("Materiales / coste", "Fresas (1 por grupo), bolsas zip, detergente de platos, sal, agua, filtro de café o colador, vasos transparentes, alcohol de farmacia 96° muy frío (nevera/congelador), palillos. ≈ 10–15 €"),
     ("Relación con mi campo", "Muy alta: esto es literalmente lo primero que hacemos en el laboratorio antes de secuenciar"),
     ("Dificultad", "Media (líquidos, alcohol que manipula solo el adulto)")],
    "Cada grupo aplasta una fresa dentro de una bolsa con agua, jabón y sal. Se filtra el zumo y el adulto añade alcohol frío resbalando por la pared del vaso. En 1 minuto aparece una nube blanca de hilos: es el ADN de la fresa. Se puede enrollar en un palillo y enseñar.",
    "Que todos los seres vivos (fresa, perro, ellos mismos) tienen ADN dentro de cada célula; que el ADN es un hilo larguísimo, y que los científicos lo sacan para «leerlo».",
    ["Antes de ir: mezclar en una botella 100 ml de agua + 2 cucharadas de detergente + 1 cucharadita de sal («poción rompe-células»). Alcohol en el congelador hasta el último momento (llevar en nevera portátil con hielo).",
     "Cada grupo recibe una fresa sin hojas en una bolsa zip. Aplastar con los dedos 2 minutos («estamos rompiendo las paredes de las casitas-células»).",
     "Añadir 2 cucharadas de poción y amasar suave 1 minuto más (sin hacer espuma).",
     "Filtrar en un vaso a través del colador/filtro de café (basta con 1–2 dedos de líquido).",
     "El adulto vierte alcohol frío muy despacio por la pared del vaso, igual cantidad que de zumo. Esperar sin agitar y contar hasta 30.",
     "Aparece la capa blanca y «mocosa»: enrollarla con un palillo. Cada grupo enseña su ADN a los demás.",
     "Cierre: «Esto que veis es lo mismo que yo recibo en el laboratorio, y luego lo leo con una máquina y con ordenadores»."],
    ["Fresas (las congeladas y descongeladas funcionan igual de bien)", "Bolsas zip pequeñas", "Detergente de platos, sal fina, agua",
     "Alcohol 96° de farmacia, muy frío (300 ml para 6 grupos)", "Vasos transparentes, coladores o filtros de café, embudos",
     "Palillos o cucharillas", "Papel de cocina, mantel plástico, toallitas"],
    "«¿Sabéis que dentro de cada fresa, de cada perro y de cada uno de vosotros hay un libro de instrucciones? Se llama ADN. Hoy lo vamos a sacar de una fresa para verlo. Yo en mi trabajo saco el ADN y el ARN, los leo con máquinas y luego le pido ayuda al ordenador para entender qué dicen.»",
    ["Hacer una prueba en casa con tus hijos el día anterior: así ajustas cantidades y ya tienes «ayudantes expertos».",
     "El alcohol lo vierte siempre el adulto; los niños aplastan, filtran y enrollan.",
     "Guantes de nitrilo o pedir que miren sin tocar para quien no quiera mancharse (muy útil para niños con sensibilidad táctil).",
     "Lleva una fresa extra y un vaso ya preparado por si un grupo falla.",
     "En catalán: «l'ADN», «les cèl·lules», «la maduixa», «el llibre d'instruccions»."],
    "Alcohol 96°: inflamable y no debe tocarse ni olerse de cerca; no comer la fresa aplastada. Avisar de alergias a fresa (raras, pero posibles).",
    "yourgenome.org (Wellcome) «Extracting DNA from fruit»; CHEO Research «Strawberry DNA extraction» (edades 6–14); Generation Genius ES «Extracción de ADN de fresas»")

act(2, "ADN de chuches (doble hélice comestible)",
    "Construyen la escalera de caracol del ADN con regaliz y gominolas, y luego se la comen.",
    [("Tiempo en aula", "20–25 min"),
     ("Formato", "Individual o por parejas; funciona con toda la clase a la vez"),
     ("Materiales / coste", "2 tiras de regaliz por niño, gominolas de 4 colores (osos o lacasitos blandos), palillos. ≈ 15–20 € para 50 niños"),
     ("Relación con mi campo", "Alta: estructura del ADN y regla de emparejamiento A-T / C-G"),
     ("Dificultad", "Baja")],
    "Dos tiras de regaliz son los «pasamanos» de la escalera. Cada palillo lleva 2 gominolas, una de cada pareja de colores (rojo siempre con verde, amarillo siempre con naranja). Se clavan los palillos entre los dos regalices y se retuerce suavemente: aparece la hélice.",
    "El ADN tiene 4 «letras» que siempre van en parejas fijas, y por eso el ADN se puede copiar. Es la idea más importante de toda la genética y a los 6 años la entienden perfectamente como «regla de los colores».",
    ["Mostrar un modelo grande ya hecho (o una foto/peluche de ADN) y explicar la «regla de las parejas» con los colores.",
     "Repartir regaliz, 4–5 palillos y un puñado de gominolas por niño.",
     "Cada niño pincha 2 gominolas en cada palillo respetando la regla (rojo-verde, amarillo-naranja). El adulto revisa: «¿hay alguna pareja prohibida?».",
     "Clavar los palillos entre los dos regalices, formando una escalera.",
     "Girar con cuidado desde los extremos: ¡escalera de caracol!",
     "Juego rápido: el profe dice una secuencia de colores de un lado («rojo, rojo, amarillo») y los niños gritan la otra orilla («verde, verde, naranja»).",
     "Al final se lo comen (o se lo llevan en una bolsita)."],
    ["Regaliz rojo o negro en tiras largas (2 por niño)", "Gominolas blandas de 4 colores claros", "Palillos de dientes", "Platos de papel", "Un modelo grande ya montado para enseñar"],
    "«Mi trabajo es leer estas letras de colores: millones y millones seguidas. Y como siempre van en pareja, si me falta un lado puedo adivinar el otro. ¡Vosotros acabáis de hacer lo mismo!»",
    ["Mejor justo antes del patio o al final, porque después de las chuches la atención baja.",
     "Alternativa sin azúcar: la misma idea con pajitas de colores y limpiapipas, o con bloques tipo LEGO (dos filas de 1x2 emparejadas por color).",
     "Pide a la escuela la lista de alergias (gelatina, colorantes, gluten en el regaliz)."],
    "Palillos con punta: dar palillos de punta roma o recortar las puntas. Alergias alimentarias.",
    "Let's Talk Science «Candy DNA»; Vanderbilt CSEO DNA kit; yourgenome.org «Yummy Gummy DNA»")

act(3, "La pulsera del código (secuencia de ADN con cuentas)",
    "Se llevan a casa un trozo real de ADN en forma de pulsera: humano, chimpancé, mariposa…",
    [("Tiempo en aula", "20–25 min"),
     ("Formato", "Individual, toda la clase; 1 adulto cada 8 niños para los nudos"),
     ("Materiales / coste", "Cuentas de plástico de 4 colores (1 color por letra A, C, G, T), hilo elástico, tarjetas con secuencias impresas en colores. ≈ 15 € para 50 pulseras"),
     ("Relación con mi campo", "Muy alta: es una secuencia real; además compara especies (genómica comparativa es parte de mi trabajo)"),
     ("Dificultad", "Baja. Nudos y enhebrar cuentas: los de 1º necesitan ayuda")],
    "Cada niño escoge una tarjeta con un trozo de ADN de un ser vivo (humano, chimpancé, mariposa, plátano, virus…) impresa como bolitas de colores. Enhebra las cuentas en ese orden y se la ata a la muñeca. Al final comparan pulseras: la de humano y la de chimpancé se parecen muchísimo; la de plátano se parece menos.",
    "El ADN es un código de 4 letras; el orden de las letras es lo que nos hace diferentes; los seres vivos parecidos tienen códigos parecidos (parentesco).",
    ["Preparar tarjetas con 12–15 letras de secuencias reales (puedes usar las de yourgenome.org o sacarlas tú de un gen común como la beta-globina / COX1) impresas como círculos de colores grandes, sin letras para los que no leen aún.",
     "Explicar: «cada color es una letra del libro de instrucciones».",
     "Cada niño elige tarjeta (o se reparte al azar para que haya variedad), enhebra, y el adulto anuda.",
     "Juego de comparación: todos los «humanos» se ponen junto a los «chimpancés» y buscan cuántas cuentas coinciden. Luego junto a «plátano».",
     "Variante «pulsera de rasgos»: cada cuenta representa un rasgo del niño (¿color de ojos? ¿puedes enrollar la lengua? ¿hoyuelos? ¿lóbulo pegado? ¿pelo liso o rizado?) y cada niño sale con una pulsera única, como su ADN."],
    ["Cuentas pony (plástico, agujero grande) en 4 colores, unas 15 por niño", "Hilo elástico de bisutería", "Tijeras", "Tarjetas plastificadas con las secuencias", "Bandejas o hueveras para separar colores"],
    "«En mi grupo comparamos el ADN de muchos seres vivos: de personas, de plantas, de virus… y buscamos las partes que se parecen. ¡Ahora vosotros tenéis un trocito real en la muñeca!»",
    ["Compara con un ejemplo que les impresiona: «tu pulsera y la de un chimpancé se parecen en casi todas las cuentas».",
     "Usar hueveras con los 4 colores separados reduce el caos.",
     "Para quien no quiera pulsera: llavero con un limpiapipas."],
    "Cuentas pequeñas: vigilar que no se las lleven a la boca (a 6–7 años es raro, pero avisar).",
    "yourgenome.org «Sequencing bracelets»; The Crick «DNA bracelet» (7+, 15 min); NC Science Festival «Pulsera de rasgos genéticos» (en castellano); ASBMB «Gene sequence bracelets»")

act(4, "Somos el ADN (juego de movimiento en el patio o gimnasio)",
    "Los niños son las letras: se emparejan, se copian y descubren qué es una mutación.",
    [("Tiempo en aula", "15–20 min"),
     ("Formato", "Toda la clase a la vez (ideal para 40–50 niños); necesita espacio: patio, gimnasio o aula con mesas apartadas"),
     ("Materiales / coste", "Petos o cartulinas de 4 colores colgadas del cuello (1 por niño), una cuerda larga. < 10 €"),
     ("Relación con mi campo", "Alta: emparejamiento, copia del ADN, mutación, y el ARN como mensajero que lleva la copia"),
     ("Dificultad", "Baja, pero necesita a los profes para gestionar el grupo")],
    "Cada niño lleva un color (A, C, G, T). Se forman dos filas cogidas de las manos por parejas de colores correctos. Se giran para hacer una hélice humana. Luego «se abre la cremallera» y cada fila busca nuevas parejas: ¡el ADN se ha copiado! Un niño «travieso» (mutación) se cuela con el color equivocado y hay que detectarlo.",
    "La regla de las parejas, que el ADN se copia separándose, y que un error de copia es una mutación. Lo aprenden con el cuerpo, que es como mejor se aprende a esa edad.",
    ["Repartir petos/cartulinas. Explicar la regla: rojo da la mano a verde, amarillo a naranja. Nunca otras parejas.",
     "Ronda 1 – «Formamos el ADN»: los niños buscan su pareja y se colocan en dos filas enfrentadas, cogidos de las manos. Lo retorcemos un poco: escalera de caracol.",
     "Ronda 2 – «Copiar el ADN»: a la señal, se sueltan (la cremallera se abre). Cada fila, por separado, busca nuevos compañeros del color correcto entre un «montón» de niños de reserva. Ahora hay dos escaleras iguales.",
     "Ronda 3 – «La mutación»: con los ojos cerrados, el adulto cambia el peto a un niño. Al abrir los ojos, todos buscan la pareja prohibida. «Así encuentro yo los errores en el ADN de un tumor».",
     "Ronda 4 (opcional) – «El mensajero»: un niño con peto blanco (ARN) corre por la fila leyendo los colores y lleva el mensaje a la «cocina» (otro adulto) que construye algo con bloques según los colores."],
    ["Petos deportivos de 4 colores (la escuela suele tenerlos) o cartulinas con cordón", "Un peto blanco para el ARN", "Silbato o pandereta para las señales", "Opcional: cuerda larga para marcar «el núcleo»"],
    "«Cuando una célula se divide tiene que copiar todo su libro. Lo hace abriendo la escalera por el medio y buscando parejas nuevas. A veces se equivoca: eso es una mutación. En mi laboratorio buscamos esas mutaciones en el ADN y en el ARN de personas con cáncer para entender qué cambia.»",
    ["Haz tú de «ADN gigante» primero con 8 voluntarios para que lo vean antes de hacerlo todos.",
     "Para niños a los que no les gusta el contacto: pueden sujetar los extremos de un pañuelo en lugar de darse la mano, o ser «el científico que vigila» con una lupa de cartón.",
     "Mantén cada ronda corta (3–4 min) y anuncia cuántas rondas hay en total: la previsibilidad ayuda a todos."],
    "Carreras y empujones al buscar pareja: hacerlo «caminando como robots», nunca corriendo.",
    "Diseño propio a partir de ideas de «human DNA model» y TeachEngineering «Mutation Telephone» (versión simplificada)")

act(5, "La receta secreta: del ADN al ARN a la criatura",
    "Un juego de código donde cada tres colores son una pieza, y la clase construye monstruos a partir de un gen.",
    [("Tiempo en aula", "25–30 min"),
     ("Formato", "Grupos de 3–4; toda la clase a la vez"),
     ("Materiales / coste", "Tarjetas de «gen» (tiras de colores), un «diccionario» (póster: 3 colores = 1 pieza), piezas: bloques LEGO/Duplo, plastilina, o partes de cuerpo recortadas en papel (ojos, patas, alas, colas). ≈ 10 € o 0 € con material de la escuela"),
     ("Relación con mi campo", "Máxima: es el ARN mensajero y el código genético, mi tema"),
     ("Dificultad", "Media (hay que preparar bien el diccionario y las tarjetas)")],
    "El ADN está guardado en «la biblioteca» (el núcleo) y no puede salir. Un niño mensajero (ARN) copia la receta en una tira de colores y la lleva a «la cocina» (el ribosoma). Allí el grupo lee los colores de 3 en 3 y, con el diccionario, va cogiendo piezas: 3 colores = una pata, otros 3 = un ojo… Al final cada grupo tiene una criatura distinta, porque cada gen era distinto. Después se cambia un solo color del gen y la criatura sale diferente: ¡mutación!",
    "Que el ADN es una receta, que el ARN es la copia que viaja, y que las «palabras» de 3 letras dicen qué pieza poner. Es la idea central de la biología molecular en versión de 6 años.",
    ["Preparar el «diccionario» en un póster grande: 8–10 combinaciones de 3 colores, cada una con el dibujo de una pieza (ojo, pata, ala, cola, cuerno, boca, cuerpo redondo, cuerpo alargado, STOP).",
     "Preparar 10–12 «genes» distintos: tiras con 12–18 círculos de colores (4–6 palabras) que acaben en STOP.",
     "Contar la historia con los roles: biblioteca (una caja cerrada con los genes), mensajero (un niño por grupo con una tira en blanco donde copia los colores con rotulador o pegatinas), cocina (la mesa del grupo).",
     "El mensajero copia el gen en la biblioteca y vuelve a la cocina. El grupo lee de 3 en 3 con el diccionario y monta la criatura.",
     "Desfile de criaturas: cada grupo presenta la suya y se compara con el gen.",
     "Ronda mutación: el adulto cambia una pegatina de un gen. Se vuelve a construir: ¿qué ha cambiado? A veces nada (la misma pieza), a veces una pata se vuelve ala, a veces aparece STOP antes de tiempo y la criatura queda a medias."],
    ["Póster «diccionario» (A3 plastificado)", "Tiras de gen (cartulina con pegatinas redondas de 4 colores)", "Tiras en blanco y pegatinas/rotuladores para el mensajero", "Piezas: Duplo/LEGO, plastilina, o recortables de partes de animales + pegamento", "Una caja «biblioteca»"],
    "«Yo estudio precisamente el mensajero, el ARN. Es la copia de la receta que sale de la biblioteca. A veces el mensajero se dobla y hace formas raras, y mi ordenador busca esas formas. Y los medicamentos nuevos, como algunas vacunas, son exactamente esto: un mensajero con una receta.»",
    ["Con niños que aún no leen, el diccionario debe ser 100 % visual (colores y dibujos), sin letras.",
     "Mejor 8 palabras que 20: el objetivo es que entiendan el mecanismo, no el código completo.",
     "Puedes dar al mensajero una «capa» o una bandolera: les encanta el rol.",
     "Si sobra tiempo: dos grupos con el mismo gen descubren que construyen la misma criatura (reproducibilidad)."],
    "Piezas pequeñas de LEGO: controlar que no se las lleven a la boca los más pequeños.",
    "Adaptación propia de «Cracking the code» (PMC3577301), Kuraplan «Build-A-Protein», analogía del libro de recetas (Hippocampus), y el juego IMA GENE (UFSC)")

act(6, "Pliega el ARN: el hilo que hace formas",
    "Con limpiapipas y velcro descubren que un hilo de letras se dobla solo y hace horquillas; y que un ordenador puede buscar esas formas.",
    [("Tiempo en aula", "15–20 min"),
     ("Formato", "Individual; toda la clase"),
     ("Materiales / coste", "1–2 limpiapipas largos por niño, pegatinas o cuentas de 4 colores, trocitos de velcro autoadhesivo. ≈ 10 €"),
     ("Relación con mi campo", "Máxima: estructura secundaria del ARN, que es exactamente lo que mido y lo que mi inteligencia artificial compara"),
     ("Dificultad", "Baja")],
    "El ADN tiene dos hilos; el ARN va solo. Y como va solo, cuando encuentra en su propio hilo colores que hacen pareja… ¡se dobla y se pega a sí mismo! Cada niño construye un hilo de ARN con cuentas de colores sobre un limpiapipas y descubre dónde se pega (donde los colores hacen pareja). Salen horquillas, lazos y formas de «llave». Luego la clase compara: ¿quién tiene la misma forma?",
    "Que el ARN es un hilo de una sola hebra que se pliega; que la forma depende del orden de las letras; que formas parecidas pueden hacer el mismo trabajo. Y la idea de «buscar formas parecidas» es lo que hace su ordenador.",
    ["Enseñar primero un modelo grande (limpiapipas gruesos o una cuerda con pompones) que se dobla en horquilla.",
     "Repartir limpiapipas y una tarjeta con una secuencia de 10–12 colores (todas las tarjetas diseñadas para que al doblar por la mitad haya parejas).",
     "Enhebrar o pegar las cuentas en orden. Poner un trocito de velcro en las cuentas que son pareja (el adulto ha marcado en la tarjeta dónde).",
     "«¡Ahora deja que se pliegue!» Doblan el limpiapipas y lo pegan donde los colores hacen pareja: horquilla.",
     "Juego de búsqueda: con todas las formas en la mesa, «¿cuáles son iguales?». Se agrupan por forma, no por color. Explicar: «esto que acabáis de hacer con los ojos lo hace mi ordenador con millones de hilos a la vez».",
     "Opcional: cambiar una cuenta (mutación) y ver que la horquilla ya no cierra."],
    ["Limpiapipas de 30 cm", "Cuentas pony o pegatinas redondas de 4 colores", "Velcro adhesivo en puntos", "Tarjetas con secuencias «plegables» ya diseñadas", "Un modelo gigante"],
    "«Mi trabajo de verdad es este: cojo el ARN, miro qué forma tiene, y le enseño al ordenador a encontrar formas parecidas entre millones. Igual que vosotros agrupando horquillas. Si dos ARN tienen la misma forma, a lo mejor hacen el mismo trabajo, aunque sus letras sean distintas.»",
    ["Diseña 3–4 secuencias distintas que den horquillas de distinto tamaño y una con dos horquillas: así el juego de «agrupar por forma» tiene sentido.",
     "Si los limpiapipas dan problemas con cuentas, usa pegatinas redondas directamente sobre una tira de cartulina flexible.",
     "Esta actividad enlaza perfecto después de la 5 (receta) o la 3 (pulsera): el mismo material (cuentas de 4 colores) sirve para tres actividades."],
    "Puntas de los limpiapipas: doblar los extremos para que no pinchen.",
    "Diseño propio; inspirado en NSTA «Pipe cleaner DNA» y en la actividad de DNA origami de CMU (scaffold & staples)")

act(7, "Detectives del ADN (¿de quién es este código?)",
    "Un juego de emparejar códigos de colores con una «base de datos» en la pared: así identifica un bioinformático de qué animal es un ADN.",
    [("Tiempo en aula", "15–20 min"),
     ("Formato", "Rincón/estación con 4–6 niños a la vez, o toda la clase con tarjetas en la pared"),
     ("Materiales / coste", "Tarjetas «muestra» (tiras de 8–10 colores), póster «base de datos» con 8–10 animales y su código, pegatinas de premio. < 5 €"),
     ("Relación con mi campo", "Muy alta: es la idea de BLAST/búsqueda de secuencias, el pan de cada día de la bioinformática"),
     ("Dificultad", "Muy baja, perfecta para 1º")],
    "Cada niño coge una «muestra misteriosa» (un pelo, una pluma, una caca de animal… de mentira) con su tira de colores de ADN. Tiene que buscar en el póster-base de datos a qué animal pertenece comparando los colores. Cuando lo encuentra, pone la pegatina del animal en su cuaderno de detective. Nivel 2: una muestra con un color cambiado, «se parece pero no es igual»: ¿cuál es el pariente más cercano?",
    "Que cada especie tiene un código distinto, que comparando códigos se puede saber de quién es una muestra (así se identifican especies, se estudian virus, se resuelven delitos), y la idea de «buscar lo parecido» en una lista gigante.",
    ["Preparar 10 animales con códigos de 8–10 colores claramente distintos y un póster A2 con sus dibujos y códigos.",
     "Preparar 20–25 tarjetas-muestra (varias por animal) en sobres «pruebas» con un dibujo de la pista (pluma, huella, pelo).",
     "Cada niño o pareja coge un sobre y busca la coincidencia exacta. El adulto valida con una pegatina.",
     "Ronda 2: tarjetas con 1 error. «No es igual a ninguno: ¿a quién se parece más?» (introduce la idea de parentesco y mutación).",
     "Cierre: «Mi ordenador hace esto mismo, pero con un libro de 3.000 millones de letras y en un segundo»."],
    ["Póster base de datos", "Sobres con tarjetas-muestra", "Pegatinas de animales", "Lupas de juguete (opcional, pero les encanta)", "Un «cuaderno de detective» (media hoja doblada) por niño"],
    "«Cuando aparece un virus nuevo, o un bicho raro en el mar, o un pelo en una escena de crimen, los científicos leen su ADN y lo comparan con una lista gigante. Yo construyo programas para hacer esas búsquedas, pero con la forma del ARN en lugar de las letras.»",
    ["Usa animales que conozcan y alguno que sorprenda (un delfín y un hipopótamo con códigos parecidos: ¡son parientes!).",
     "Para 1º: 6 colores en vez de 10 y solo coincidencia exacta.",
     "Funciona genial como estación autónoma con una profesora mientras tú haces la fresa con otro grupo."],
    "Ninguno.",
    "USF «DNA Detectives» (Kerr & Breitbart 2021, grados 2–5, usado desde 6 años); yourgenome «Microbe Maker»; U. Edinburgh «DNA detectives» (ensamblar fragmentos)")

act(8, "El ordenador que aprende (inteligencia artificial sin pantallas)",
    "Dos juegos cortos para que entiendan qué hace un ordenador y cómo «aprende» a clasificar.",
    [("Tiempo en aula", "15–20 min (dos juegos de 7–10 min)"),
     ("Formato", "Toda la clase"),
     ("Materiales / coste", "Tarjetas con dibujos (animales reales/inventados, hojas, caras sonrientes/tristes), pan de molde y chocolate o cartulina para el «robot». < 5 €"),
     ("Relación con mi campo", "Alta: explica la parte «AI» de mi trabajo"),
     ("Dificultad", "Baja")],
    "Juego 1 «Papá robot»: tú eres un robot que solo hace exactamente lo que le dicen. Los niños te tienen que dar instrucciones para untar chocolate en el pan (o dibujar una casa en la pizarra). Si dicen «pon el chocolate», lo pones encima del bote cerrado. Risas garantizadas y aprenden qué es un programa.<br/><br/>Juego 2 «Enséñale al ordenador»: tú eres un ordenador que no sabe qué es un pájaro. Los niños te enseñan ejemplos (tarjetas: «esto sí es un pájaro», «esto no»). Tú vas «aprendiendo» una regla en voz alta («¿tiene plumas?... ¿tiene alas?... ¡pero el murciélago tiene alas!») y luego te ponen a prueba con tarjetas nuevas. Cuando te equivocas, te dan más ejemplos.",
    "Que los ordenadores no entienden nada por sí solos: siguen instrucciones exactas (programar) o aprenden de muchos ejemplos (inteligencia artificial). Y que se equivocan si los ejemplos son pocos o malos.",
    ["«Papá robot»: ponte una caja de cartón en la cabeza o unas gafas de robot. Pide instrucciones y cúmplelas al pie de la letra. Deja que mejoren las instrucciones. Cierra con: «un programa es una lista de instrucciones muy exactas».",
     "«Enséñale al ordenador»: baraja de 20 tarjetas (10 pájaros variados, 10 no-pájaros con trampas: murciélago, avión, mariposa, pingüino). Enseñan de una en una y tú dices en voz alta qué regla crees. Ponte a prueba con 5 nuevas.",
     "Puente con tu trabajo: «Yo hago lo mismo con formas de ARN: le enseño al ordenador miles de ejemplos para que aprenda a reconocer las que son importantes».",
     "Opcional (si hay tiempo): pulsera binaria con la inicial del nombre en 2 colores de cuentas (así guarda las letras un ordenador)."],
    ["Caja o gafas de «robot»", "Pan de molde, crema de cacao, cuchillo de plástico (o pizarra y tiza)", "Baraja de tarjetas pájaro / no-pájaro", "Opcional: cuentas de 2 colores e hilo para la pulsera binaria"],
    "«Mi ordenador no sabe nada de biología. Yo le enseño con miles y miles de ejemplos, como vosotros me habéis enseñado qué es un pájaro. Y a veces se equivoca, como yo con el murciélago, y hay que enseñarle más.»",
    ["Los niños con TEA suelen disfrutar especialmente del «robot literal» porque las reglas son explícitas; anúncialo bien: «ahora voy a ser un robot y haré SOLO lo que digáis».",
     "El juego del pájaro funciona mejor si exageras tus errores.",
     "Puedes sustituir pájaro por «¿es un ser vivo?», que está en su currículo de 1º–2º."],
    "Alergias si usas chocolate/pan. Cuchillo de plástico.",
    "Code.org «Unplugged»; CS Unplugged «Binary bracelets» (7+); AI Unplugged (Lindner & Seegerer) «Good monkey / bad monkey»; «Robot sandwich» (variante popular en aulas de infantil)")

act(9, "Mira dentro: células al microscopio",
    "Ven con sus propios ojos las «casitas» de las que están hechos los seres vivos.",
    [("Tiempo en aula", "15–20 min como estación (4–6 niños cada vez)"),
     ("Formato", "Estación con un adulto; muestras ya preparadas"),
     ("Materiales / coste", "1–2 microscopios USB o digitales con pantalla (30–60 €; a veces la escuela tiene) o Foldscope (≈ 2 € cada uno), cebolla, hoja de elodea/musgo, pelo, polen, un ala de insecto; portas. Opcional: proyectar en la pizarra digital"),
     ("Relación con mi campo", "Media-alta: el ADN y el ARN están dentro de cada célula; conecta con la fresa"),
     ("Dificultad", "Media (equipo)")],
    "Un microscopio digital conectado al proyector de clase es lo más eficaz: toda la clase ve la piel de cebolla con sus celdillas, un pelo de la profe, polen, una pata de mosca. Después, en estación, cada niño mira por sí mismo algo que ha traído o elegido (una hoja, un trozo de su jersey, un grano de sal).",
    "Que los seres vivos están hechos de células y que dentro de cada una está el ADN (la fresa que han aplastado tenía millones). También que la ciencia es mirar con mejores ojos.",
    ["Preparar 4–5 muestras en casa (cebolla con una gota de azul de metileno o yodo diluido o incluso sin teñir; elodea; polen; pelo; sal).",
     "Proyectar la cebolla: «cada cuadradito es una célula; dentro de cada uno hay un libro de instrucciones entero».",
     "Estación: los niños eligen una muestra y la enfocan (el microscopio USB tiene una sola rueda: a los 6 años pueden).",
     "Reto: «¿cuántas células cabrían en tu uña?».",
     "Si hay Foldscopes: cada niño puede quedarse el suyo (plegarlo requiere un adulto, mejor llevarlos ya montados)."],
    ["Microscopio USB/digital (muchas escuelas tienen uno; pregunta) o Foldscope", "Portaobjetos y cubres", "Cebolla, elodea o musgo, polen, pelo, azúcar/sal, ala de insecto", "Pinzas, cuentagotas, colorante opcional"],
    "«Vosotros tenéis unos 30 billones de estas casitas. Y en cada una, un libro de instrucciones de 2 metros de largo enrollado tan apretado que no lo ves. Lo que hemos sacado de la fresa venía de millones de casitas como estas.»",
    ["Pregunta a la escuela con antelación qué microscopio tienen y si la pizarra digital acepta USB/HDMI.",
     "Evita células de la mejilla con niños tan pequeños (higiene y logística): cebolla y polen bastan.",
     "Microscopio digital con pantalla propia > microscopio óptico con ocular: a 6 años cuesta cerrar un ojo y enfocar."],
    "Cubres de vidrio: usar portas de plástico o preparar tú las muestras. Yodo mancha.",
    "Michigan Public (Foldscope con niños de 6–11 años); UEN lesson «Onion skin & cheek cells» (adaptado)")

act(10, "Gérmenes de purpurina: cómo viaja un virus",
    "Una demostración corta y muy visual sobre cómo se contagian los virus, enlazada con tu trabajo en dengue y zika.",
    [("Tiempo en aula", "10–15 min"),
     ("Formato", "Toda la clase, con 4–6 voluntarios"),
     ("Materiales / coste", "Purpurina (o mejor: gel hidroalcohólico mezclado con purpurina, o polvo fluorescente y linterna UV), toallitas, jabón. < 10 €"),
     ("Relación con mi campo", "Media: virus de ARN (dengue, zika) que estudiamos en el laboratorio"),
     ("Dificultad", "Muy baja")],
    "Un voluntario «estornuda» con purpurina en la mano, saluda a 3 compañeros, que saludan a otros… En 2 minutos media clase brilla. Luego prueban a lavarse solo con agua (queda) y con jabón (se va). Se cierra contando qué es un virus: un mensajero de ARN pirata que entra en una célula y le hace copiar su receta.",
    "Cómo se contagian los virus, por qué funciona el jabón, y que un virus es básicamente un trozo de ARN con una «receta» equivocada que engaña a la célula.",
    ["Un voluntario se pone purpurina (o gel+purpurina) en la mano: «acaba de estornudar».",
     "Saluda a 3 compañeros, estos a otros 3… parar a los 2 minutos y mirar manos, mesas, mejillas.",
     "Lavado con agua sola vs. con jabón: comparar.",
     "Enlace: «El virus del dengue, que estudio en mi laboratorio, es un hilo de ARN con su receta. Entra en una célula y la engaña para que fabrique virus. Mi trabajo es mirar la forma de ese ARN para encontrar dónde atacarlo.»",
     "Versión más limpia: polvo fluorescente (Glo Germ) y linterna UV; se ve con la luz apagada y no deja purpurina por el aula."],
    ["Purpurina fina o polvo fluorescente + linterna UV", "Gel hidroalcohólico", "Toallitas, jabón, acceso a lavabo", "Un dibujo grande del virus del dengue (icosaedro) con su ARN dentro"],
    "«Un virus no es un ser vivo del todo: es una receta de ARN con una cáscara. Entra en vuestras células y las engaña. Vuestro cuerpo aprende a reconocerlo, y algunas vacunas lo que hacen es enseñarle al cuerpo un trocito de la receta antes de que llegue el virus.»",
    ["Los profes pueden tener reparos con purpurina (se queda semanas): el polvo UV es la alternativa elegante.",
     "Hazlo al final, justo antes de ir a lavarse las manos para el patio o el comedor.",
     "Evita el estornudo real; es un «estornudo de mentira» con la mano."],
    "Purpurina en los ojos: usar purpurina gruesa o la versión UV. Niños que no quieran que les toquen: son los «científicos que cuentan contagios».",
    "Education World «Glitter germs»; Kaplan «Germ science»; yourgenome «Handshake hazard» y «Sneeze zone»")

act(11, "Abrir y cerrar: ¿cómo es un científico? + el libro de 2 metros",
    "Dos piezas de 5 minutos para empezar y acabar la sesión: rompen el estereotipo y dan la escala de lo que hacéis.",
    [("Tiempo en aula", "5 min al inicio + 5 min al final"),
     ("Formato", "Toda la clase"),
     ("Materiales / coste", "Medio folio por niño y lápices; una bata, gafas de laboratorio y una pipeta para disfrazar a un niño; un rollo de papel higiénico o cinta de 2 metros; un ovillo de hilo. 0 €"),
     ("Relación con mi campo", "Alta: presenta tu trabajo y la escala del genoma"),
     ("Dificultad", "Muy baja")],
    "Al empezar: «Dibujad un científico» (2 min). Mostráis unos cuantos: casi todos serán un señor con bata y gafas. Tú te presentas: «yo soy científico y mi laboratorio es… ¡un ordenador!», y disfrazas de científica a una niña con la bata (y a tu hija si quiere). Luego la escala: desenrollas 2 metros de cinta: «esto es lo que mide el ADN de UNA de vuestras células, y lo tenéis enrollado en una casita que no se ve». Si leyéramos una letra por segundo sin dormir, tardaríamos 100 años en leer un solo libro. Al acabar: «dibujad otra vez un científico». Compáralos.",
    "Que los científicos son personas normales de todo tipo (también mujeres, también gente que trabaja con ordenadores) y que el ADN es enorme pero cabe en algo diminuto.",
    ["Dibujo inicial (2 min). Recoge 5–6 y coméntalos sin juzgar.",
     "Preséntate en 1 minuto con 3 cosas: «leo el libro de instrucciones de los seres vivos», «miro la forma del ARN mensajero», «enseño a un ordenador a buscar formas».",
     "Cinta de 2 m desenrollada y un ovillo de hilo enrollado: así cabe.",
     "Los números para niños: 1 libro por célula, 30 billones de células, 100 años para leerlo letra a letra, y «vuestro libro y el de un chimpancé casi iguales; el vuestro y el de un plátano se parecen la mitad».",
     "Dibujo final (2 min). Pregunta: «¿qué ha cambiado?»"],
    ["Folios y lápices", "Bata, gafas, guantes, una pipeta (si tienes una P1000 de sobra, déjales apretar el émbolo: es un éxito seguro)", "Cinta métrica o papel de 2 m y un ovillo"],
    "«Hoy he venido a enseñaros mi trabajo. No tengo bata casi nunca: mi herramienta es un ordenador muy grande que lee libros de instrucciones de seres vivos y busca formas en ellos.»",
    ["Si tu hija está en la clase, decide con ella antes si quiere participar o no en la presentación; lo mismo con cualquier anécdota familiar.",
     "Escribe en la pizarra el «plan de hoy» con 3–4 dibujos (fresa, pulsera, robot, dibujo) y ve tachando: la previsibilidad baja la ansiedad de muchos niños, no solo de los que tienen TEA."],
    "Ninguno.",
    "NSTA «Draw a scientist»; Oxford (Knight group) sesión con Year 1 «Have the cake and eat it» (genoma como receta, longitud del genoma)")


# --------------------------------------------------------------------------------------
# Build document
# --------------------------------------------------------------------------------------
def build(path):
    doc = SimpleDocTemplate(path, pagesize=A4, leftMargin=1.8 * cm, rightMargin=1.8 * cm,
                            topMargin=1.7 * cm, bottomMargin=1.8 * cm,
                            title="Día de la Ciencia — propuestas de actividades 1r-2n Primària",
                            author="Uciel Chorostecki")
    S = []

    # ---------------- Cover / intro ----------------
    S.append(P("Día de la Ciencia en la escuela", "title"))
    S.append(P("Propuestas de actividades para 1r i 2n de Primària (6–7 años) · El Masnou · "
               "Biomedicina, ADN/ARN, genómica, biología computacional e IA", "sub"))
    S.append(P("Para quién es este documento", "h1"))
    S.append(P("Este dosier recoge 11 actividades probadas en divulgación con niños de 5–8 años, adaptadas a tu campo "
               "(ARN, genómica, bioinformática e IA) y a una clase mixta de 1º y 2º. Cada ficha incluye el tiempo real "
               "en aula, el formato, los materiales con coste aproximado, el paso a paso, la frase que conecta la actividad "
               "con tu investigación y avisos de seguridad. Al final hay tres planes de sesión listos (30, 50 y 90 minutos), "
               "una lista de compra y las fuentes."))
    S.append(P("Qué funciona con niños de 6–7 años (lo que dicen las fuentes y la experiencia de outreach)", "h1"))
    S.append(bullets([
        "<b>Bloques de 10–15 minutos.</b> La atención sostenida a esa edad es corta: alterna hacer / mirar / moverse. Un «show» de 45 minutos seguido no funciona; tres actividades cortas sí.",
        "<b>Nada que dependa de leer.</b> Muchos de 1º todavía no leen con fluidez. Todo el código genético aquí es de <b>colores</b>, no de letras. Las 4 letras A, C, G, T las dices tú; ellos trabajan con rojo/verde/amarillo/naranja.",
        "<b>Una cosa que ven, una que tocan, una que se llevan.</b> Ver los hilos de ADN de la fresa, construir algo con las manos, y salir con una pulsera o una criatura es la combinación que mejor recuerdan.",
        "<b>Una sola idea grande.</b> Para esta edad basta con: «dentro de cada ser vivo hay un libro de instrucciones escrito con 4 letras de colores; yo lo leo con ordenadores». Todo lo demás (ARN, mutación, IA) cuelga de esa frase.",
        "<b>Previsibilidad.</b> Escribe el plan de la sesión en la pizarra con dibujos y ve tachando. Anuncia cada cambio («ahora nos levantamos»). Ofrece siempre un rol alternativo (observador, contador, fotógrafo) a quien no quiera tocar, mancharse o dar la mano. Esto ayuda a los niños con TEA y, en la práctica, a toda la clase.",
        "<b>Ayudantes.</b> Pide a la escuela 1 adulto por cada 8–10 niños para las actividades con material (fresa, pulseras). Si la clase es doble (1º + 2º juntos, 40–50 niños), el formato de <b>estaciones rotativas</b> es el que mejor funciona.",
        "<b>Catalán / castellano.</b> Los niños probablemente trabajan en catalán. Las frases clave: <i>l'ADN, l'ARN missatger, la cèl·lula, el llibre d'instruccions, la maduixa, les parelles de colors, l'ordinador que aprèn</i>.",
    ]))

    # ---------------- Comparison table ----------------
    S.append(PageBreak())
    S.append(P("Tabla comparativa de las 11 actividades", "h1"))
    S.append(P("Tiempo = minutos reales en aula (sin contar tu preparación). Vínculo = cuánto conecta con tu investigación "
               "(★★★ = es literalmente tu tema). Diversión y Facilidad son estimaciones para 6–7 años.", "small"))
    S.append(Spacer(1, 6))
    hdr = ["#", "Actividad", "Min", "Formato", "Coste", "Vínculo", "Diversión", "Facilidad", "Concepto clave"]
    rows = [
        ["1", "Sacar el ADN de una fresa", "25–30", "Grupos 4–5 + adulto", "10–15 €", "★★★", "★★★", "★★", "Todo ser vivo tiene ADN; se puede ver"],
        ["2", "ADN de chuches", "20–25", "Individual", "15–20 €", "★★", "★★★", "★★★", "Doble hélice; parejas A-T, C-G"],
        ["3", "Pulsera del código", "20–25", "Individual + adulto para nudos", "15 €", "★★★", "★★★", "★★", "Secuencia real; especies parecidas, códigos parecidos"],
        ["4", "Somos el ADN (patio)", "15–20", "Toda la clase, espacio", "<10 €", "★★★", "★★★", "★★", "Copia del ADN; mutación; mensajero"],
        ["5", "La receta secreta (ARN → criatura)", "25–30", "Grupos 3–4", "0–10 €", "★★★", "★★★", "★★", "ARN mensajero; código de 3; mutación"],
        ["6", "Pliega el ARN", "15–20", "Individual", "10 €", "★★★", "★★", "★★★", "El ARN se pliega; buscar formas iguales"],
        ["7", "Detectives del ADN", "15–20", "Estación 4–6 o toda la clase", "<5 €", "★★★", "★★", "★★★", "Comparar códigos = identificar especies (BLAST)"],
        ["8", "El ordenador que aprende", "15–20", "Toda la clase", "<5 €", "★★★", "★★★", "★★★", "Programa = instrucciones; IA = aprender de ejemplos"],
        ["9", "Células al microscopio", "15–20", "Estación + proyector", "0–60 €", "★★", "★★", "★★", "Seres vivos = células; ADN dentro"],
        ["10", "Gérmenes de purpurina", "10–15", "Toda la clase", "<10 €", "★★", "★★★", "★★★", "Contagio; virus = receta de ARN pirata"],
        ["11", "Dibuja un científico + libro de 2 m", "5 + 5", "Toda la clase", "0 €", "★★", "★★", "★★★", "Científicos diversos; escala del genoma"],
    ]
    data = [[P(h, "cellb") for h in hdr]] + [[P(c, "cell") for c in r] for r in rows]
    for i in range(len(hdr)):
        data[0][i] = Paragraph(hdr[i], ParagraphStyle("hw", parent=ss["cellb"], textColor=colors.white))
    t = Table(data, colWidths=[0.7 * cm, 3.5 * cm, 1.1 * cm, 2.7 * cm, 1.4 * cm, 1.5 * cm, 1.7 * cm, 1.7 * cm, 3.1 * cm], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), ACC),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LGREY]),
        ("VALIGN", (0, 0), (-1, -1), "TOP"), ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#bbbbbb")),
        ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LEFTPADDING", (0, 0), (-1, -1), 3), ("RIGHTPADDING", (0, 0), (-1, -1), 3),
    ]))
    S.append(t)
    S.append(Spacer(1, 10))
    S.append(P("Mi recomendación", "h1"))
    S.append(P("Si solo puedes hacer <b>una</b> cosa: la <b>fresa (1)</b>. Es la que más recuerdan y la que más se parece a lo que haces. "
               "Si puedes hacer <b>tres</b>: <b>fresa (1) + receta secreta (5) + ordenador que aprende (8)</b>, abriendo y cerrando con la pieza 11. "
               "Con eso cubres exactamente tu perfil: ADN que se ve, ARN mensajero que lleva la receta, e inteligencia artificial que aprende. "
               "Si la clase es doble y tienes 90 minutos y 3–4 adultos: formato de estaciones (plan C)."))
    S.append(P("Las actividades 3, 5, 6 y 7 usan el mismo material (cuentas o pegatinas de 4 colores): comprando una vez tienes cuatro opciones. "
               "La 4 no necesita casi nada y es la válvula de escape si ves que necesitan moverse."))

    # ---------------- Activity sheets ----------------
    for a in ACTS:
        S.append(PageBreak())
        S.append(P(f"{a['num']}. {a['name']}", "h1"))
        S.append(P(a["tagline"], "sub"))
        S.append(infobox(a["box"]))
        S.append(Spacer(1, 6))
        S.append(P("Qué pasa en el aula", "h2"))
        S.append(P(a["what"]))
        S.append(P("Qué aprenden", "h2"))
        S.append(P(a["learn"]))
        S.append(P("Paso a paso", "h2"))
        S.append(numbered(a["steps"]))
        S.append(P("Materiales", "h2"))
        S.append(bullets(a["materials"]))
        S.append(P("Cómo lo conecto con mi investigación (frase para los niños)", "h2"))
        S.append(P(a["say"], "quote"))
        S.append(P("Consejos y adaptaciones", "h2"))
        S.append(bullets(a["tips"]))
        S.append(P("Seguridad / avisos", "h2"))
        S.append(P(a["warn"]))
        S.append(P("<b>Fuente / inspiración:</b> " + a["source"], "small"))

    # ---------------- Session plans ----------------
    S.append(Spacer(1, 14))
    S.append(P("Tres planes de sesión listos para usar", "h1"))

    def plan(title, intro, rows_):
        S.append(P(title, "h2"))
        S.append(P(intro))
        d = [[Paragraph(h, ParagraphStyle("hw2", parent=ss["cellb"], textColor=colors.white)) for h in ["Min", "Bloque", "Qué haces", "Material"]]]
        d += [[P(c, "cell") for c in r] for r in rows_]
        tt = Table(d, colWidths=[1.6 * cm, 4.0 * cm, 7.0 * cm, 4.1 * cm], repeatRows=1)
        tt.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), ACC),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, LGREY]),
            ("VALIGN", (0, 0), (-1, -1), "TOP"), ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#bbbbbb")),
            ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ]))
        S.append(tt)
        S.append(Spacer(1, 10))

    plan("Plan A · 30 minutos (una clase, sin ayudantes)",
         "Para cuando te dan media hora y una sola aula. Una demostración central y un juego sin material.",
         [["0–5", "Abrir (11)", "Dibujo del científico + «el libro de 2 metros». Plan en la pizarra con dibujos.", "Folios, cinta de 2 m, bata"],
          ["5–20", "Fresa (1), versión demo", "Tú haces una extracción grande en la mesa; 4–6 niños ayudan por turnos (aplastar, filtrar, enrollar). Pasa el vaso para que todos vean los hilos.", "Kit fresa, 1 vaso grande"],
          ["20–28", "Ordenador que aprende (8)", "«Papá robot» con la pizarra (dibujar una casa) o «enséñale qué es un pájaro».", "Tarjetas pájaro"],
          ["28–30", "Cerrar (11)", "Segundo dibujo rápido, o solo la pregunta: «¿qué hace un científico?»", "Folios"]])

    plan("Plan B · 50 minutos (una clase, 1–2 ayudantes) — recomendado",
         "El plan que cubre tu perfil completo: ADN que se ve, ARN mensajero, IA.",
         [["0–5", "Abrir (11)", "Dibujo + presentación + libro de 2 m + plan en la pizarra.", "Folios, cinta"],
          ["5–25", "Fresa (1), por grupos", "Grupos de 4–5 con bolsa propia; tú y los ayudantes vertéis el alcohol. Cada grupo enseña su ADN.", "Kit fresa × nº grupos"],
          ["25–40", "Receta secreta (5)", "Historia biblioteca/mensajero/cocina; cada grupo construye su criatura; ronda de mutación corta.", "Diccionario, genes, piezas"],
          ["40–48", "Ordenador que aprende (8)", "Solo «enséñale al ordenador qué es un pájaro» (7 min).", "Tarjetas"],
          ["48–50", "Cerrar (11)", "Segundo dibujo o una pregunta de cierre; se llevan la criatura a casa.", "—"]])

    plan("Plan C · 90 minutos, clase doble 1º+2º (40–50 niños), formato estaciones",
         "4 estaciones de 15 minutos, grupos de 10–12 niños rotando, cada estación con un adulto. Tú llevas la fresa (la que necesita más mano). "
         "Antes y después, toda la clase junta.",
         [["0–10", "Abrir (11) + Somos el ADN (4), ronda 1", "Todos juntos: presentación, libro de 2 m, y una sola ronda de «formamos el ADN» con petos para fijar la regla de las parejas que usarán todas las estaciones.", "Petos 4 colores, cinta"],
          ["10–70", "4 estaciones × 15 min (rotación)", "E1 Fresa (1) — tú. E2 Pulsera del código (3) — profe. E3 Detectives del ADN (7) — profe. E4 Microscopio (9) o Pliega el ARN (6) — profe/ayudante. Señal sonora para rotar; cada estación tiene su cartel con dibujo.", "Ver fichas 1, 3, 6/7, 9"],
          ["70–85", "Ordenador que aprende (8) + purpurina (10)", "Todos juntos: «papá robot» 7 min y gérmenes de purpurina 8 min (justo antes de lavarse las manos).", "Tarjetas, purpurina/UV"],
          ["85–90", "Cerrar (11)", "Segundo dibujo del científico; foto de grupo con las pulseras.", "Folios"]])

    # ---------------- Shopping list ----------------
    S.append(P("Lista de compra / qué llevar (plan B, 25 niños)", "h1"))
    S.append(bullets([
        "<b>Fresa:</b> 8 fresas, 8 bolsas zip, 1 botella de «poción» (100 ml agua + 2 cdas detergente + 1 cdta sal, ×2), 300 ml alcohol 96° en nevera con hielo, 8 vasos transparentes, 8 filtros de café + 8 embudos o coladores, palillos, mantel plástico, papel de cocina, guantes de nitrilo pequeños.",
        "<b>Receta secreta:</b> póster diccionario A3 plastificado, 10 tiras de gen con pegatinas de 4 colores, 10 tiras en blanco + pegatinas para los mensajeros, una caja «biblioteca», piezas (Duplo de la escuela o recortables de partes de animales + barras de pegamento).",
        "<b>IA:</b> 20 tarjetas pájaro / no-pájaro (puedes imprimir fotos), caja o gafas de «robot».",
        "<b>Abrir/cerrar:</b> 50 medios folios, bata, gafas de laboratorio, guantes, una pipeta, cinta de 2 m, ovillo.",
        "<b>Opcional (misma compra sirve para 3, 6 y 7):</b> 1 bolsa de cuentas pony de 4 colores (≈ 1000 uds), hilo elástico, hueveras.",
        "<b>Para ti:</b> plan en la pizarra con dibujos, un reloj visible, lista de alergias que te pase la escuela, y una prueba completa de la fresa en casa con tus hijos el día anterior.",
    ]))

    S.append(P("Los números que vas a decir (verificados)", "h1"))
    S.append(bullets([
        "ADN de una célula humana estirado: ≈ 2 metros (6.400 millones de pares de bases × 0,34 nm).",
        "Letras del genoma humano: ≈ 3.200 millones (una copia). A una letra por segundo sin parar: ≈ 101 años.",
        "Células en un cuerpo humano adulto: ≈ 30–37 billones (3 × 10<super>13</super>). Un niño de 7 años, algo menos.",
        "Parecido entre humano y chimpancé en las regiones que se alinean: ≈ 98–99 %. Con el plátano, por genes compartidos, alrededor de la mitad (es la cifra divulgativa habitual; en el aula di «la mitad»).",
        "Impreso en libros de 1.000 páginas con 3.000 letras cada una: ≈ 1.000 libros, una torre de unos 100 metros.",
    ]))

    # ---------------- Sources ----------------
    S.append(P("Fuentes consultadas", "h1"))
    srcs = [
        "yourgenome.org (Wellcome Connecting Science) — recursos 5–12 años: Extracting DNA from fruit, Sequencing bracelets, Origami DNA, Yummy Gummy DNA, Handshake hazard, Mastering micropipetting. https://www.yourgenome.org/students-and-teachers/resources-for-5-12-year-olds/",
        "The Francis Crick Institute, Crick Kids — DNA bracelet (7+, 15 min). https://kids.crick.ac.uk/code-of-life/dna-bracelet",
        "CHEO Research Institute — Strawberry DNA extraction (6–14 años). https://www.cheoresearch.ca/?p=6428",
        "Biology Corner — Simple experiment to extract DNA from a strawberry. https://www.biologycorner.com/2016/04/07/dna-extraction/",
        "Generation Genius (ES) — Extracción de ADN de fresas DIY. https://www.generationgenius.com/es/activities/extraccion-de-adn-de-fresas-diy/",
        "Let's Talk Science — Candy DNA. https://letstalkscience.ca/volunteer-hands-on-activities/candy-dna",
        "NC Science Festival — Pulsera de rasgos genéticos (castellano). https://ncsciencefestival.org/sites/default/files/documents/DESN%20Activity-Genetic%20Trait%20Bracelet-Spanish.pdf",
        "ASBMB — Gene sequence bracelets. https://www.asbmb.org/science-outreach/gene-sequence-bracelets",
        "Kerr & Breitbart (2021) — DNA Detectives outreach activity (grados 2–5). https://pure.lib.usf.edu/en/publications/dna-detectives-outreach-activity-teaching-students-to-identify-fi-2/",
        "Cracking the code (PMC3577301) — translation with beads. https://pmc.ncbi.nlm.nih.gov/articles/PMC3577301",
        "TeachEngineering — Mutation Telephone. https://www.teachengineering.org/activities/view/uoh_mutations_lesson01_activity1",
        "NSTA — Idea bank: Pipe cleaner DNA. https://www.nsta.org/resources/idea-bank-pipe-cleaner-dna",
        "CMU — DNA origami: scaffold & staple strands (limpiapipas). https://www.cmu.edu/gelfand/researchatcmu/roadtoresearch_mtr/r2r_mtr_documents_and_images/dnaorigami_scaffoldstaplestrands.pdf",
        "Code.org — Unplugged lessons. https://global.code.org/unplugged",
        "CS Unplugged — Binary numbers / bracelets; Card flip magic. https://www.csunplugged.org/",
        "Lindner & Seegerer — AI Unplugged. https://computingeducation.de/aiunplugged-en.pdf",
        "Oxford, Julian Knight group — Genome-based activity at a local primary school (Year 1). https://www.chg.ox.ac.uk/research/research-groups/julian-knight-group/research-projects/group-news/genome-based-activity-at-a-local-primary-school-have-the-cake-and-eat-it",
        "Education World — Glitter germs. https://www.educationworld.com/a_lesson/00-2/lp2191.shtml",
        "Michigan Public — Foldscope con niños de 6–11 años. https://www.michiganpublic.org/2024-11-24/fold-paper-insert-lens-this-2-microscope-changes-how-kids-see-the-world",
        "NSTA — Draw a scientist. https://www.nsta.org/draw-scientist",
        "Genetic Science Learning Center (Utah) — Family traits trivia. https://teach.genetics.utah.edu/content/heredity/files/Family-Traits-Trivia.pdf",
        "STEM Learning (UK) — Supporting pupils with autism in primary science. https://stem.org.uk/node/539556",
    ]
    for s_ in srcs:
        S.append(P("• " + s_, "small"))

    doc.build(S, onFirstPage=on_page, onLaterPages=on_page)


if __name__ == "__main__":
    import sys
    build(sys.argv[1])
