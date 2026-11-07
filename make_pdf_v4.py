#!/usr/bin/env python3
"""Día de la Ciencia v4: el perro del ADN adaptado a 6-7 años, variantes e ideas con IA (solo ideas)."""
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Spacer, KeepTogether, Table, TableStyle
from make_pdf_v2 import P, bl, table, box, ss, ACC, GREY, LG


def footer(c, doc):
    c.saveState()
    c.setFont("DV", 7.5)
    c.setFillColor(GREY)
    c.drawString(1.8 * cm, 1.1 * cm, "Día de la Ciencia · 1r i 2n · El Masnou · v4: el perro del ADN para 6-7 años (solo ideas)")
    c.drawRightString(A4[0] - 1.8 * cm, 1.1 * cm, f"pág. {doc.page}")
    c.restoreState()


# Colores de las "letras" (gomets)
GC = {"rojo": "#dc2626", "azul": "#2563eb", "verde": "#16a34a", "amarillo": "#facc15"}


def code_table():
    """Ejemplo de tabla de descodificación con gomets de color."""
    hdr = ["Gen", "rojo", "azul", "verde", "amarillo"]
    rows = [
        ["Cuerpo", "largo como salchicha", "redondo como pelota", "alto y flaco", "pequeñito"],
        ["Orejas", "caídas", "de punta", "gigantes", "una arriba, una abajo"],
        ["Cola", "rizada", "larga", "de plumero", "cortita"],
        ["Pelo", "con manchas", "con rayas", "liso", "de colores"],
        ["Gen sorpresa (2º)", "lengua fuera", "cejas enfadadas", "pajarita", "gafas"],
    ]
    data = [[P(f"<b>{h}</b>", "cellb" if h == "amarillo" else "cellw") for h in hdr]]
    data += [[P(f"<b>{r[0]}</b>", "cellb")] + [P(x, "cell") for x in r[1:]] for r in rows]
    t = Table(data, colWidths=[3.2 * cm] + [3.5 * cm] * 4)
    st = [("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#d4d4d4")),
          ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
          ("BACKGROUND", (0, 0), (0, 0), ACC),
          ("BACKGROUND", (0, 1), (0, -1), LG),
          ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]
    for j, k in enumerate(["rojo", "azul", "verde", "amarillo"], start=1):
        st.append(("BACKGROUND", (j, 0), (j, 0), colors.HexColor(GC[k])))
    t.setStyle(TableStyle(st))
    return t


def strip():
    """Tira de ADN de ejemplo: un gomet por gen."""
    seq = ["azul", "rojo", "verde", "amarillo"]
    t = Table([[""] * 4, [P(x, "small") for x in ["cuerpo", "orejas", "cola", "pelo"]]],
              colWidths=[1.6 * cm] * 4, rowHeights=[0.9 * cm, 0.5 * cm])
    st = [("BOX", (0, 0), (-1, 0), 0.8, colors.black), ("INNERGRID", (0, 0), (-1, 0), 0.8, colors.white),
          ("ALIGN", (0, 1), (-1, 1), "CENTER")]
    for j, k in enumerate(seq):
        st.append(("BACKGROUND", (j, 0), (j, 0), colors.HexColor(GC[k])))
    t.setStyle(TableStyle(st))
    return t


# (code, name, top, idea, why, time, material, science)
VARS = [
    ("V1", "Gemelos secretos", True,
     "Sin decirlo, das a dos niños de mesas distintas exactamente el mismo código. Al colgar los perros, alguien descubre que hay dos iguales. «¿Os habéis copiado?» No: tenían la misma receta.",
     "La revelación es suya: ellos encuentran a los gemelos. Es el momento Mark Rober de la actividad.",
     "+3 min", "Nada extra", "Misma receta, mismo perro: los gemelos idénticos tienen el mismo ADN."),
    ("V2", "La mutación", True,
     "Se proyecta un perro y su tira. Cambias un solo gomet («¡oh no, una errata!») y la clase grita qué parte del perro cambia. Luego cada niño puede cambiar un gomet de su tira y dibujar el perro mutante al lado.",
     "Lo prohibido divierte: estropear la receta a propósito. Y el antes y después se ve.",
     "5 min", "Gomets sueltos", "Un cambio de una letra cambia el animal. Es exactamente lo que buscas tú en el ordenador."),
    ("V3", "El mensajero (tu ARN)", True,
     "El «libro del ADN» con todos los códigos se queda en la mesa del profe, que es el núcleo, y no puede salir de ahí. Cada niño va, copia su tira en un papelito (el ARN mensajero) y lo lleva a su mesa, que es la fábrica donde se construye el perro.",
     "Les da un rol con movimiento (ir, copiar, volver) y una regla de juego: el libro no se toca.",
     "+5 min", "Un cuaderno o carpeta grande como «libro», tiras en blanco", "El ADN se guarda; lo que viaja es una copia en ARN. Es tu campo, y lo explica sin palabras."),
    ("V4", "Mamá perro + papá perro = cachorro", False,
     "Cada niño recibe dos tiras, la de la mamá y la del papá. Para cada gen tira una moneda: cara copia el gomet de mamá, cruz el de papá. Luego dibuja el cachorro. Los de la misma mesa, con los mismos padres, comparan: son hermanos, se parecen pero no son iguales.",
     "La moneda les engancha y el «¿por qué mi hermano tiene otras orejas?» sale solo.",
     "12 min", "Monedas o un dado, dos tiras por niño", "Herencia: la mitad de cada uno. Es el puente directo con el árbol de rasgos de tus hijos."),
    ("V5", "Detectives del ADN (al revés)", False,
     "En lugar de leer el código y dibujar, les enseñas un perro ya dibujado y tienen que adivinar qué gomets lo hicieron, mirando la tabla. Puede ser un juego de toda la clase con la pizarra.",
     "Es un acertijo y lo resuelven gritando. Funciona muy bien de cierre rápido.",
     "5 min", "3-4 perros dibujados y proyectados", "Bioinformática: a partir de lo que vemos, averiguar qué dice el código."),
    ("V6", "¿Hay dos perros iguales en la clase?", False,
     "Si los códigos salen al azar (bolsa de gomets o dado), con 4 genes hay 256 perros posibles y aun así, con 45 niños, casi seguro aparecen dos iguales. Cálculo hecho: un 98 % de probabilidad (60 % con 22 niños). Con 5 genes (1024 perros) baja al 63 %. Les preguntas antes «¿saldrán dos iguales?» y casi todos dicen que no.",
     "Apuesta de clase, y luego la búsqueda de parejas entre los perros colgados.",
     "+5 min", "Gomets en una bolsa opaca", "La «paradoja del cumpleaños»: las coincidencias son más fáciles de lo que parecen. Ciencia de datos de verdad."),
    ("V7", "La manada en un gráfico", False,
     "Cuelgas todos los perros en la pizarra agrupados por orejas (o cola). Se forma solo un gráfico de barras hecho de perros. «¿Qué oreja ganó?» Se puede repetir agrupando por otro gen.",
     "Ven su dibujo formar parte de algo grande.",
     "5 min", "Cinta adhesiva o masilla", "Encontrar patrones en muchos datos: lo que haces tú con miles de genes."),
    ("V8", "El ADN gigante", False,
     "Su tira del perro tiene 4 gomets. Desenrollas un rollo de papel de cocina o de caja registradora larguísimo, lleno de gomets, que cruza el aula. «Esto es solo un trocito del vuestro.» Recupera la diapositiva de «El problema… ¡el tamaño!» de tu presentación.",
     "El rollo atravesando la clase es visual y físico.",
     "3 min", "Un rollo de papel y gomets (o puntos con rotulador)", "Por eso hacen falta ordenadores para leer el ADN: tu trabajo."),
    ("V9", "El interruptor (epigenética para peques)", False,
     "Cada niño tiene un post-it pequeño: puede tapar UN gen y elegir que ese no se lea (el perro sale sin cola, o con la cola de serie). La receta no cambia, solo qué parte se lee.",
     "Recupera tu mensaje final («ustedes ayudan a decidir qué partes leer») con algo que pueden tocar.",
     "3 min", "Post-its pequeños", "Epigenética: el mismo ADN, distintas partes encendidas."),
]

THEMES = [
    ["Perro (el original)", "Lo conocen todos, y además encaja con tus diapositivas de cuerpo y cabeza."],
    ["Criatura del mar del Masnou", "Pez o monstruo marino con aletas, dientes, escamas y antenas de luz. Conexión local con la playa, y la luz de los animales del fondo enlaza con la idea C1 (bacterias que se encienden) del informe anterior."],
    ["Monstruo o dragón", "Permite genes absurdos (número de ojos, cuernos, alas) y eso les encanta. Es el clásico «Dragon genetics» simplificado."],
    ["Robot", "Engancha a quienes no les va dibujar animales, y abre la conversación hacia la IA."],
    ["Criatura de la clase", "Cada mesa diseña un gen nuevo y su tabla. Al final, la clase entera inventa un animal. Más difícil de controlar con 45 niños."],
]

AI = [
    ("IA1", "Tú preparas las piezas con IA (antes de clase)", True,
     "Generas con una IA de imagen las ilustraciones de la tabla (4 cuerpos, 4 orejas, 4 colas…) en un estilo uniforme, «dibujo para colorear, línea negra, fondo blanco». Para 1º puedes imprimir las piezas para recortar y pegar en lugar de dibujar desde cero.",
     "Las tablas quedan bonitas y coherentes, y los que no se atreven a dibujar también terminan su perro.",
     "Gemini, ChatGPT o la IA que uses; pide variantes hasta que encajen entre sí."),
    ("IA2", "Del dibujo al perro «de verdad»", True,
     "Fotografías 3-4 dibujos (sin caras ni nombres de niños) y la IA los convierte en un perro realista, de peluche o de película animada, manteniendo sus rasgos. Se proyecta el dibujo al lado de su versión. Si no da tiempo en clase, haces los de todos después y la profe los muestra otro día como «la manada».",
     "Es el «wow» más seguro de la lista: su dibujo se convierte en algo que parece real.",
     "Gemini o ChatGPT con la foto y algo como «convierte este dibujo de niño en un perro realista; respeta exactamente las orejas, la cola y las manchas». Ensaya el prompt en casa con dibujos de tus hijos."),
    ("IA3", "La IA como ribosoma: ¿leyó bien el código?", True,
     "Le das a la IA, delante de ellos, la tabla y una tira («rojo, azul, verde, amarillo») y le pides que dibuje el perro. Los niños, que ya saben leer la tabla, comprueban si la máquina se equivocó: ¿tiene las orejas caídas? ¿y la cola rizada? Si falla, mejor todavía.",
     "Los pone en el papel de expertos que corrigen a la máquina.",
     "Mensaje para el final: las máquinas ayudan mucho, pero alguien tiene que revisar. Eso es parte de tu trabajo."),
    ("IA4", "El perro mutante dibujado por la IA", False,
     "Combinación con V2: la IA dibuja el perro original y luego el mismo perro con un solo gen cambiado. Se proyecta como un «antes y después».",
     "Se ve muy claro qué cambió y qué se quedó igual.",
     "Pide en la misma conversación «el mismo perro, igual en todo, pero con las orejas de punta» para mantener el estilo."),
    ("IA5", "¿Adivina la máquina que es un perro?", False,
     "Un voluntario dibuja su perro en Quick, Draw! (quickdraw.withgoogle.com) en la pantalla y la IA intenta adivinar qué es. Con orejas gigantes y cola de plumero quizá diga «gato» o «zorro».",
     "Gracioso y rápido. Sirve de enlace con las ideas de máquinas que aprenden del informe anterior.",
     "Comprueba que sigue funcionando y que «perro» está entre sus categorías."),
    ("IA6", "Perros que se mueven", False,
     "Animated Drawings (sketch.metademolab.com) anima dibujos, pero está pensado para figuras de pie, con brazos y piernas. Un perro de cuatro patas probablemente no se anime bien; un perro dibujado de pie, como un personaje, puede funcionar y ser muy gracioso.",
     "Si funciona, es lo que más gritos provoca.",
     "No lo verifiqué; la web lleva tiempo sin mantenimiento. Pruébalo con un dibujo de Clara antes de contar con ello."),
]


def item(code, name, top, rows, accent=ACC):
    star = " ★" if top else ""
    head = Table([[P(f"<b>{code}</b>", "cellw"), P(f"<b>{name}{star}</b>", "h2")]], colWidths=[1.1 * cm, 16.1 * cm])
    head.setStyle(TableStyle([("BACKGROUND", (0, 0), (0, 0), accent), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                              ("ALIGN", (0, 0), (0, 0), "CENTER")]))
    body = Table([[P(f"<b>{k}</b>", "cellb"), P(v, "cell")] for k, v in rows], colWidths=[2.8 * cm, 14.4 * cm])
    body.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LINEBELOW", (0, 0), (-1, -2), 0.3, LG),
                              ("TOPPADDING", (0, 0), (-1, -1), 2), ("BOTTOMPADDING", (0, 0), (-1, -1), 2)]))
    return KeepTogether([head, body, Spacer(1, 7)])


def build(path):
    doc = SimpleDocTemplate(path, pagesize=A4, leftMargin=1.8 * cm, rightMargin=1.8 * cm, topMargin=1.6 * cm,
                            bottomMargin=1.8 * cm, title="Día de la Ciencia v4: el perro del ADN",
                            author="Uciel Chorostecki")
    S = []
    S.append(P("El perro del ADN, versión para 6-7 años", "title"))
    S.append(P("1r i 2n de Primària · El Masnou · Cuarta versión: la actividad de la presentación de tus hijos, adaptada, con variantes e ideas con IA", "sub"))
    S.append(P("En la actividad que hiciste con tus hijos cada uno leía una tira de símbolos, buscaba en la tabla qué forma de cuerpo y de cabeza le tocaba y dibujaba su perro. "
               "La idea funciona igual con 6-7 años si se cambian tres cosas: colores en lugar de símbolos, un solo «gomet» por gen, y piezas grandes con dibujo. "
               "Como antes, esto es un banco de ideas, no un guion. Las marcadas con ★ son mis favoritas."))

    S.append(P("La versión base", "h1"))
    S.append(P("Cada niño recibe una tira con 4 gomets de colores. Cada gomet es un gen. Busca en la tabla qué le toca y dibuja (o pega) su perro. "
               "Con 4 genes y 4 colores salen 256 perros distintos. Un ejemplo de tabla:"))
    S.append(code_table())
    S.append(Spacer(1, 6))
    S.append(Table([[P("Tira de ejemplo:", "cellb"), strip(), P("= cuerpo redondo, orejas caídas, cola de plumero, pelo de colores.", "cell")]],
                   colWidths=[2.8 * cm, 6.6 * cm, 7.8 * cm], style=[("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    S.append(Spacer(1, 6))

    S.append(P("Qué cambia respecto a lo que hiciste con tus hijos", "h2"))
    S.append(table(["En tu presentación", "Para 6-7 años", "Por qué"], [
        ["Símbolos (cruz, puzle, estrella, espiral) en secuencias de 4", "Un gomet de color por gen; en 2º, opcionalmente dos gomets por gen", "Muchos de 1º todavía leen con esfuerzo; un color se encuentra de un vistazo."],
        ["2 genes: cuerpo y cabeza", "4 genes: cuerpo, orejas, cola y pelo (más un gen sorpresa para 2º)", "Rasgos que se ven y se dibujan fácil. La cabeza de perfil es difícil a esta edad."],
        ["Dibujar el perro entero a partir del contorno", "Dibujo libre o piezas impresas para recortar y pegar", "Nadie se queda bloqueado; los de 1º pueden pegar y los de 2º dibujar."],
        ["Una actividad larga", "Bloques de 10-15 minutos, con un giro en cada uno", "La atención de esta edad es corta; las variantes de abajo son los giros."],
        ["Grupo pequeño", "45 niños: mesas de 4-5 con la misma tabla y un adulto si se puede", "Las tablas en cada mesa evitan colas en la pizarra."],
    ], [5.0, 6.0, 6.2]))
    S.append(Spacer(1, 4))
    S.append(box("Material para el lunes: gomets de 4 colores (papelería o bazar), tiras de cartulina, tablas impresas en color (o en blanco y negro con el nombre del color), "
                 "rotuladores y, si se usa, piezas impresas, tijeras y pegamento. Todo se consigue esta semana."))

    vs = [item(c, n, tp, [("La idea", i), ("Por qué engancha", w), ("La ciencia", sc), ("Tiempo / material", f"{t} · {m}")])
          for c, n, tp, i, w, t, m, sc in VARS]
    S.append(KeepTogether([P("Variantes (los giros)", "h1"),
                           P("Se pueden encadenar dos o tres sobre la versión base. Cada una añade un momento sorpresa y una idea de ciencia."), vs[0]]))
    S.extend(vs[1:])

    S.append(P("Otros animales con la misma mecánica", "h1"))
    S.append(P("La tabla se puede rehacer con otra criatura sin cambiar nada más. Si pruebas varias, la IA (IA1) te genera las piezas de cada una en minutos."))
    S.append(table(["Criatura", "Qué aporta"], THEMES, [4.5, 12.7]))

    S.append(P("Ideas con IA para dibujar los perros", "h1"))
    S.append(P("Las dos primeras no dependen del wifi del aula, porque se preparan en casa. Las de en directo necesitan proyector y conexión."))
    for code, name, top, idea, why, how in AI:
        S.append(item(code, name, top, [("La idea", idea), ("Por qué engancha", why), ("Cómo / ojo", how)],
                      accent=colors.HexColor("#0f766e")))

    S.append(P("Cuidado con las fotos", "h2"))
    S.append(bl([
        "Sube solo fotos del dibujo, sin caras, nombres ni la libreta del niño, y desde tu propia cuenta.",
        "Evita apps de «dibujo a foto» desconocidas: muchas guardan las imágenes y no está claro qué hacen con ellas.",
        "Si los resultados se mandan a las familias, que lo haga la escuela por su canal habitual.",
    ]))

    S.append(P("Tres combinaciones posibles", "h1"))
    S.append(table(["Si quieres…", "Combinación", "Duración aprox."], [
        ["Lo más sencillo", "Versión base + V1 gemelos + IA2 (después de clase)", "20 min"],
        ["Que salga tu ARN", "Versión base con V3 mensajero + V2 mutación + IA4 mutante", "25-30 min"],
        ["Ciencia de datos", "Base con gomets al azar + V6 «¿dos iguales?» + V7 gráfico + IA3 ribosoma", "30 min"],
    ], [3.6, 10.0, 3.6]))
    S.append(Spacer(1, 6))
    S.append(P("Fuentes: tu presentación «¿Cómo el ADN nos hace únicos?»; la actividad clásica de los Reebops (Patti Soderberg, Universidad de Wisconsin), "
               "que la SSERC escocesa adaptó a primaria con dados (practicalbiology.org, tes.com); y artículos sobre familias que usan ChatGPT o Gemini para convertir dibujos infantiles en imágenes realistas (getcoai.com). "
               "Las probabilidades de V6 son cálculos propios (paradoja del cumpleaños). Ninguna de las ideas con IA está probada con esta tabla concreta: conviene ensayarlas en casa con Clara.", "small"))

    doc.build(S, onFirstPage=footer, onLaterPages=footer)


if __name__ == "__main__":
    build(sys.argv[1])
