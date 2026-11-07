#!/usr/bin/env python3
"""Día de la Ciencia v3 — banco de ideas (solo ideas, sin guion)."""
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Spacer, PageBreak, KeepTogether, Table, TableStyle
from make_pdf_v2 import P, bl, table, box, ss, ACC, GREY, LG

TEAL = colors.HexColor("#0f766e")


def footer(c, doc):
    c.saveState()
    c.setFont("DV", 7.5)
    c.setFillColor(GREY)
    c.drawString(1.8 * cm, 1.1 * cm, "Día de la Ciencia · 1r i 2n · El Masnou · v3: banco de ideas (en el aula, con material para el lunes)")
    c.drawRightString(A4[0] - 1.8 * cm, 1.1 * cm, f"pág. {doc.page}")
    c.restoreState()


# (code, name, top, source, experience, hook, minutes, material, link, note)
FAM = {}

FAM["A"] = ("Tú eres el experimento", "Al estilo Mark Rober: la clase no sabe que está dentro del experimento hasta la revelación. Casi todo se monta con cosas de casa o del bazar.", [
    ("A1", "Tu cerebro no ve al dinosaurio (gorila invisible en vivo)", True,
     "Daniel Simons y Christopher Chabris, «Selective attention test» — youtube.com/watch?v=vJG698U2Mvo",
     "Los niños cuentan en voz alta los pases de pelota entre tres compañeros. Mientras tanto la profe cruza el aula con una máscara de dinosaurio o un plátano gigante. Casi nadie lo ve. Luego se pregunta quién vio al dinosaurio y se repite para que lo vean todos.",
     "Les explota la cabeza haberse perdido algo tan obvio. Y quieren hacérselo a sus padres esa noche.",
     "5", "Una pelota y una máscara o disfraz", "«Solo encuentras lo que buscas. Por eso los científicos miramos los datos con ojos nuevos, y por eso usamos ordenadores que miran todo.»",
     "Funciona mejor como primera actividad, antes de que sospechen."),
    ("A2", "¿Qué ha cambiado? (ceguera al cambio)", True,
     "Richard Wiseman, Quirkology, «Colour Changing Card Trick» — youtube.com/watch?v=v3iPrBrGSJM",
     "Se proyecta el vídeo del truco de cartas que les engaña, y al final todo el fondo ha cambiado de color. Giro propio: durante la sesión tú has cambiado en secreto tres cosas de ti o del aula (jersey, gafas, un póster). Al final se lo dices y se ponen a buscar.",
     "Es una caza del tesoro sobre algo que estuvo delante de ellos todo el rato.",
     "5", "Ropa de recambio, un objeto del aula", "«Encontrar la diferencia entre dos cosas casi iguales es mi trabajo: buscar la letra cambiada entre millones.»",
     "Combina muy bien con A1: ambas dicen «tu cerebro te engaña»."),
    ("A3", "La moneda mágica: ¿quién tiene suerte?", True,
     "Derren Brown, «10 heads in a row» — youtube.com/watch?v=XzYLHOX50Bc · explicación de James Grime — youtube.com/watch?v=rwvIGNXY21Y",
     "Los 45 niños lanzan una moneda a la vez. Los que sacan cruz se sientan. Siempre queda alguien de pie tras cinco o seis rondas y se le corona «niño de la suerte». Luego la revelación: con tantos niños, alguien tenía que ganar seguro. No era magia, eran matemáticas.",
     "Todos participan, hay tensión ronda a ronda, y la revelación cambia lo que pensaban de la suerte.",
     "8", "Una moneda por niño (o fichas de dos colores)", "«Cuando miro millones de trozos de ADN, siempre aparece algo raro por casualidad. Tengo que saber cuándo es suerte y cuándo es de verdad.»",
     "Distinto del bebé monstruo: aquí la idea es el azar en un grupo grande, no la herencia."),
    ("A4", "El juego de Penney: papá siempre gana", False,
     "Numberphile, «Penney's Game» — youtube.com/watch?v=Sa9jLWKrX0c",
     "Un niño elige una secuencia de tres colores (rojo-azul-rojo). Tú eliges la tuya después. Se lanza una moneda gigante hasta que sale una de las dos secuencias, y tú ganas casi siempre aunque la moneda es justa. La clase intenta pillarte haciendo trampa.",
     "Un adulto que gana «injustamente» y ellos tienen que descubrir el truco.",
     "10", "Una moneda grande, tarjetas de colores", "Es búsqueda de motivos en secuencias, exactamente lo que se hace con ADN y ARN: unos patrones aparecen antes que otros.",
     "Para 1º puede ser difícil seguir las secuencias: usar solo colores, nunca letras."),
    ("A5", "El bote de la honestidad", False,
     "Mark Rober, «Candy Thieves vs Rigged Candy Bowl» — youtube.com/watch?v=Zb01RStdzEs",
     "Un bote de pegatinas con un cartel «coge UNA» y tú «sales un momento». Sabes en secreto cuántas había. Después enseñas el resultado de toda la clase. Se repite con unos ojos saltones pegados al bote: la gente se porta mejor cuando se siente observada.",
     "Descubren que eran el experimento. Y el truco de los ojos les parece increíble.",
     "10", "Pegatinas, ojos saltones", "Hipótesis, grupo control y grupo de prueba: así se prueban los medicamentos.",
     "Mostrar solo el total de la clase, nunca quién cogió qué."),
    ("A6", "Rojo escrito en azul: 1º contra 2º", False,
     "Operation Ouch! (BBC), «The Stroop Test» — youtube.com/watch?v=wvS7k15BRGk",
     "Tienen que decir el color de la tinta de palabras como ROJO escrita en azul. Lo bonito es comparar cursos: los de 2º, que leen mejor, pueden ir más lentos porque no pueden evitar leer. Tú haces el gráfico de los dos grupos en directo.",
     "Competición entre cursos y un resultado que no se esperan.",
     "8", "Tarjetas impresas (en catalán o castellano)", "Un experimento real con dos grupos y un gráfico, como un estudio científico.",
     "Los de 1º que aún no leen bien «ganan»: está bien, es parte de la sorpresa."),
    ("A7", "Cerebro al revés: dibujar en el espejo", False,
     "Smarter Every Day, «The Backwards Brain Bicycle» — youtube.com/watch?v=MFzDaBzBlL0",
     "Primero se ven 30 segundos del vídeo de la bicicleta que gira al revés. Luego intentan repasar una estrella mirando su mano solo en un espejo. Es dificilísimo y da risa, pero mejora en cada intento. Los errores de cada intento van a una curva de aprendizaje.",
     "Es un reto físico divertido y ven cómo su cerebro aprende en minutos.",
     "10", "Espejitos (bazar), cartulina", "La curva de aprendizaje es la misma que la de una inteligencia artificial cuando se entrena.",
     "Con 45 niños, por parejas y unos pocos espejos rotando."),
    ("A8", "El club de la regla secreta", False,
     "Veritasium, «The Most Common Cognitive Bias» (juego 2-4-6) — youtube.com/watch?v=vKA4w2O61Xo",
     "Tienes un club con una regla secreta. Los niños te ofrecen objetos y tú solo dices «entra» o «no entra». Todos se inventan reglas complicadas y la de verdad es tonta, por ejemplo «todo lo que no es verde». La lección: prueba también lo que crees que va a fallar.",
     "Adivinar un secreto del adulto. Muy parecido a cómo piensan a esa edad.",
     "8", "Objetos del aula", "Probar hipótesis. Y es lo que hace un clasificador de inteligencia artificial: aprender una regla a partir de ejemplos sí y no.",
     ""),
    ("A9", "El apretón que viaja (cadena de neuronas)", False,
     "Inspirado en Greg Gage, TED «How to control someone else's arm with your brain» — ted.com/talks/greg_gage_how_to_control_someone_else_s_arm_with_your_brain",
     "Se enseña un minuto del vídeo de Gage, donde un cerebro mueve el brazo de otra persona. Luego toda la clase se da la mano en cadena, se pasa un apretón y tú cronometras. Repiten tres veces, y el gráfico en el proyector muestra que cada vez van más rápido.",
     "Toda la clase es el experimento y quieren batir su propio récord.",
     "8", "Cronómetro (móvil) y una hoja de cálculo", "Señales eléctricas, medir, y un primer gráfico de datos hecho por ellos.",
     "Para quien no quiera darse la mano: pasar un pañuelo o tocar el hombro."),
    ("A10", "Ilusiones relámpago: agujero en la mano, Yanny o Laurel", False,
     "Operation Ouch! «Hole in your hand» — youtube.com/watch?v=2C5jdVcAM5U · Yanny/Laurel (2018)",
     "Miran por un tubo de papel y ven un agujero en su propia mano. En el audio de Yanny o Laurel, media clase oye una palabra y la otra media otra distinta, y se miran asombrados.",
     "Reacciones enormes en dos o tres minutos. Ideal para empezar o para recuperar la atención.",
     "3–5", "Folios, altavoces", "«Todos tenemos el mismo mundo, pero sensores distintos.»",
     "Yanny/Laurel depende mucho del altavoz: probarlo antes en el aula. Enseñar antes las dos palabras."),
])

FAM["B"] = ("Máquinas que aprenden (más allá del Teachable Machine básico)", "Comprobado el 3 de noviembre de 2026: estas webs funcionan. Varias de Google que eran famosas ya no existen (al final del informe).", [
    ("B1", "Sus dibujos cobran vida y bailan (Animated Drawings)", True,
     "Meta FAIR, sketch.metademolab.com",
     "Los niños dibujan un monstruo o un personaje. Fotografías unos cuantos dibujos y la inteligencia artificial les encuentra el esqueleto: en el proyector, su dibujo salta, baila y saluda.",
     "Probablemente es el mayor «wow» de todo el banco. Es su dibujo, y está vivo.",
     "10", "Portátil, móvil para la foto, internet", "«La IA encontró los brazos y las piernas escondidos en un dibujo. Yo enseño a la IA a encontrar la forma escondida dentro de un ARN.»",
     "Meta dejó de mantener la web en 2023 y la publicó como código abierto. La página carga, pero no se comprobó que siga animando: probarlo esta semana sí o sí. Dibujos sin nombre y nunca fotos de niños."),
    ("B2", "El robot de vasos que aprende a ganar (MENACE)", True,
     "Hannah Fry y Matt Parker, Christmas Lectures 2019 de la Royal Institution — mscroggs.co.uk/blog/71 · rigb.org (Secrets and lies)",
     "Un «cerebro» hecho de vasos de papel con pompones de colores juega a un juego muy simple contra los niños (por ejemplo, coger una o dos fichas; quien coge la última pierde). Cuando pierde le quitan un pompón y cuando gana le dan uno. Tras unas pocas partidas, los vasos empiezan a ganar a la clase.",
     "Unos vasos les ganan, y los han entrenado ellos. Así se entiende de verdad qué es «aprender» para una máquina.",
     "12", "Vasos de papel, pompones o botones, pegatinas (bazar)", "Es aprendizaje por refuerzo: la IA aprende con premios y castigos, no con reglas.",
     "Las tres en raya del original es demasiado grande para 6 años: usar un juego mínimo."),
    ("B3", "Teachable Machine con gracia: peluches, sonidos y el perro blanco", True,
     "Google, teachablemachine.withgoogle.com · Stretch3 (Scratch con extensión de Teachable Machine), stretch3.champierre.com",
     "Variantes con más gracia que «brazos arriba». La clase le enseña sus peluches y luego intenta engañarla. Modo sonido: toda la clase le enseña aplausos, «¡miau!» y silencio. Revelación del sesgo: solo le enseñaste perros marrones y no reconoce al perro blanco, así que la pregunta es qué se olvidaron de enseñarle. Con Stretch3, un aplauso hace saltar al gato de Scratch.",
     "Son los profes de la máquina, y el fallo del perro blanco es un momento de revelación.",
     "15–20", "Portátil con cámara y micrófono", "«Nosotros le dimos 30 ejemplos. Yo le doy millones de ARN, y si le doy de un solo tipo se confunde igual.»",
     "Procesa en el navegador. No pulsar «guardar». Mejor objetos y sonidos que caras."),
    ("B4", "¿Lo hizo un niño o una máquina?", False,
     "Mike Wooldridge, Christmas Lectures 2023 «The Truth about AI» (juego de la imitación, robot pintora Ai-Da) — rigb.org/node/5525",
     "Se proyectan parejas de dibujos: uno lo hizo un niño de otra clase, recogido antes por la profe, y otro una IA. Los niños votan moviéndose a un lado u otro del aula.",
     "Votar con el cuerpo y adivinar. Les encanta acertar contra la máquina.",
     "8", "Diapositivas", "¿Cómo sabemos lo que una máquina «sabe»? Es la pregunta de Turing.",
     "Un minuto del vídeo de Ai-Da pintando es buen gancho."),
    ("B5", "Scroobly: un garabato que se mueve como tú", False,
     "Google Creative Lab, scroobly.com",
     "Un dibujo en la pantalla copia tus movimientos por la cámara. Mejor que lo hagas tú y que la clase te dirija («¡levanta los brazos!», «¡salta!»).",
     "Mandar al adulto y verlo convertido en dibujo animado.",
     "5–10", "Webcam, internet", "La IA encuentra 17 puntos en un cuerpo. Tú encuentras los puntos que se emparejan en un ARN.",
     "Alternativa si falla: Pose Animator (pose-animator-demo.firebaseapp.com)."),
    ("B6", "Blob Opera: la ópera de las gotas", False,
     "David Li para Google Arts & Culture — artsandculture.google.com/experiment/blob-opera/AAHWrq360NcGbw",
     "Cuatro gotas cantan ópera y armonizan solas. La clase dirige gritando «¡arriba!» o «¡abajo!».",
     "Les parece desternillante. Sin cámara ni datos personales.",
     "5", "Portátil, altavoces", "La IA aprendió de grabaciones de cantantes qué suena bien junto. Patrones otra vez.",
     "Buena para abrir o para calmar."),
    ("B7", "El intruso: la clase contra la IA (Odd One Out)", False,
     "Google Arts & Culture — artsandculture.google.com/experiment/wAHNn4JsVTFOiw",
     "Salen cuatro objetos y la clase vota a mano alzada cuál es el que no encaja, contra la IA.",
     "Votación de 45 a la vez, y competición.",
     "5–10", "Portátil, internet", "Encontrar el raro es exactamente cómo buscas ARN nuevos o extraños.",
     ""),
    ("B8", "Nuestra criatura, dibujada por la IA", False,
     "Generadores de imagen operados por un adulto (Gemini, ChatGPT, Firefly) · Google «Say What You See» como versión guiada",
     "La clase grita las partes de una criatura («una jirafa con alas de mariposa y zapatos rojos»), tú las escribes y aparece la imagen. Después se pregunta si es lo que imaginaban y en qué se equivocó.",
     "Ver su idea hecha imagen en segundos. Es lo que contarán en casa.",
     "5–10", "Tu cuenta de adulto, internet", "La IA genera a partir de patrones aprendidos. Contar las patas: ¿lo hizo bien?",
     "Solo lo maneja el adulto (los servicios son para mayores de 13). Probar los prompts antes. Nunca fotos de niños."),
    ("B9", "Engaña al coche robot", False,
     "Mark Rober, «Can You Fool A Self Driving Car?» — youtube.com/watch?v=IQJL3htsDyQ",
     "Se enseña el clip del coche que choca contra una pared pintada como el Correcaminos. Luego ellos son la «cámara» mirando por un tubo con un ojo: ¿es una foto de una puerta o una puerta de verdad?",
     "Lógica de dibujos animados y una máquina de adultos engañada.",
     "10", "Tubos de cartón, fotos impresas, un coche de juguete", "Las IA se equivocan si solo tienen un tipo de dato; por eso se combinan muchos datos.",
     ""),
    ("B10", "¿Le pegarías a un robot?", False,
     "Kate Darling, TED «Why we have an emotional connection to robots» — ted.com/speakers/kate_darling",
     "Presentas un robot de juguete o un Hexbug, la clase le pone nombre, y preguntas: ¿está bien gritarle? ¿tirarlo? Votan. Luego: ¿siente? ¿por qué nos da pena?",
     "Los dilemas morales fascinan a los 6–7 años.",
     "6", "Cualquier robot o juguete que se mueva", "Una máquina que parece viva no está viva. ¿Qué es estar vivo? (currículo 1.2.1)",
     "No enseñar el vídeo del hacha. Contarlo con suavidad."),
])

FAM["C"] = ("Luz, vida y forma", "Biología con un momento visual fuerte, sin nada sucio.", [
    ("C1", "Las bacterias que votan y se encienden", True,
     "Bonnie Bassler, TED «How bacteria talk» — ed.ted.com/lessons/how-bacteria-talk-bonnie-bassler · Edith Widder, TED bioluminiscencia — ted.com/talks/edith_widder_the_weird_wonderful_world_of_bioluminescence",
     "Luces apagadas. Cada niño es una bacteria con una pulsera luminosa o una lucecita apagada. Se pasan una «molécula» (una pelota blanda o un susurro). Cuando hay «suficientes», toda la clase se enciende a la vez. Con solo tres niños, no hay luz. Antes, un minuto de vídeo del calamar que brilla gracias a sus bacterias.",
     "Oscuridad, luz, y los 45 participan a la vez. Es el momento mágico del día.",
     "10", "Pulseras luminosas o luces LED de dedo (bazar, tienda de fiestas)", "Las células «hablan» con moléculas y los genes se encienden todos juntos: así se regula el ARN.",
     "Mejor LED de dedo que barras químicas: el líquido irrita si las muerden."),
    ("C2", "El papel que se dobla solo (plegamiento de ARN)", True,
     "Inspirado en las animaciones de AlphaFold (DeepMind) y en tu propia investigación",
     "Cada grupo tiene una tira larga con pegatinas de colores. Los colores que hacen pareja tienen que tocarse, así que la tira se dobla en horquillas y lazos. Cada grupo acaba con una forma secreta distinta, que sale solo del orden de los colores. Antes, 30 segundos de animación de proteínas plegándose.",
     "Manual, sorprendente, y cada forma es diferente.",
     "10", "Tiras de papel, pegatinas de 4 colores", "Es literalmente tu trabajo: el orden de las letras decide la forma, y tu IA busca formas parecidas.",
     "Es el puente más directo con lo que haces."),
    ("C3", "Robots que bailan: ¿quién les enseñó?", False,
     "Boston Dynamics, «Do You Love Me?» (dic. 2020), YouTube",
     "Un minuto de robots bailando como apertura o cierre. Pregunta: ¿quién les enseñó a bailar? ¿lo saben ellos?",
     "Enganche inmediato.",
     "2", "Proyector", "Las máquinas hacen lo que aprendieron de datos o de instrucciones.",
     "Solo como gancho."),
])

FAM["D"] = ("Nadie es como tú (heredero del árbol de rasgos)", "La misma idea que gustó con los mayores, «el ADN nos hace únicos», en versiones más simples y visuales para 6–7 años.", [
    ("D1", "Detectives de huellas dactilares", True,
     "Unquowa School (1º primaria) — unquowa.org/fantastic-fingerprints/ · Science Foundation Ireland (método lápiz y celo) — sfi.ie (Curious Minds, Investigating fingerprints)",
     "Cada niño saca su huella con tampón o con lápiz blando y celo, la mira con lupa o ampliada en el proyector, y la clasifica: lazo, remolino o arco. La pega en un gran gráfico de la clase. Nadie tiene la misma, ni siquiera los gemelos.",
     "Su dedo tiene un dibujo secreto que nadie más en el mundo tiene. Y les dan una «placa» de detective.",
     "15–20", "Tampón lavable o lápiz 4B, celo, lupas, toallitas", "El gráfico son datos reales. Los móviles y la policía comparan huellas con algoritmos que buscan los puntos donde las líneas se cortan o se acaban.",
     "Las huellas se quedan en papel y se las llevan: «tu huella es tu llave secreta»."),
    ("D2", "Encuentra la misma ballena (juega a ser el ordenador)", True,
     "Happywhale: IA que identifica ballenas por la cola, más de 64.000 individuos — highnorthnews.com (citizen science AI whales) · artículo en cascadiaresearch.org",
     "Cada mesa recibe unas ocho fotos de colas de ballena y tiene que encontrar las dos que son la misma ballena. Después, en el proyector, el ordenador lo hace en un segundo.",
     "Ballenas, un juego de parejas, y ganar o perder contra el ordenador.",
     "10–15", "Fotos impresas", "El ordenador mira las mismas pistas que ellos. Es exactamente cómo un bioinformático compara patrones.",
     "Comprobar la licencia de las fotos."),
    ("D3", "El mapa de estrellas del tiburón ballena", False,
     "El algoritmo que identifica tiburones ballena viene de la astronomía (telescopio Hubble), con más de 6.000 tiburones identificados — scientificamerican.com (Astronomy tool helps ID sharks)",
     "Unen con rotulador los puntos de un tiburón como si fuera una constelación y la comparan con la del compañero.",
     "«El truco que encuentra estrellas encuentra tiburones.»",
     "10", "Fotos impresas, rotuladores", "Un patrón convertido en números: distancias entre puntos.",
     "Combina con D2."),
    ("D4", "Las jirafas bebé heredan las manchas de mamá", False,
     "Lee et al. 2018, PeerJ — peerj.com/articles/5690 · versión para niños en snexplores.org · Microsoft y la identificación de jirafas con IA (2025)",
     "Emparejan jirafas bebé con su madre por la forma de las manchas. Descubren que se parecen pero nunca son iguales.",
     "Herencia explicada sin usar sus propias familias.",
     "10", "Fotos impresas", "Genes más un poco de azar. Encaja con tu mensaje: la receta está escrita, pero no sale una copia exacta.",
     "Mucho mejor que fotos de bebés de los niños (ver lo descartado)."),
    ("D5", "El código de barras de la clase", True,
     "Extensión de las olas de rasgos · Science Museum «Who am I?» (7–11 años)",
     "Cada niño colorea una tira de cinco o seis cuadros según sus rasgos (pulgar cruzado, pecas, rizos…). Juntas, las tiras forman el «código de barras» de la clase. Luego buscan dos tiras iguales y casi nunca las hay.",
     "Mantiene el espíritu de las hojas del árbol, sin escribir nada.",
     "15", "Tiras impresas, ceras", "Parece una lectura de ADN o un mapa de calor: lo que de verdad mira un bioinformático en la pantalla.",
     "Evitar rasgos que puedan dar burlas (peso, piel)."),
    ("D6", "Olas de rasgos y aros de Venn", False,
     "OISE Toronto, Venn con aros para 6–9 años — oise.utoronto.ca/robertson/lesson-plans/introduction-venn-diagrams",
     "«Levántate si…» en ola. Después, dos aros en el suelo (pulgar izquierdo arriba, pecas) con una zona en medio. Se colocan y se convierten en el gráfico.",
     "Se mueven y se ven convertidos en datos.",
     "10", "Aros o cuerdas", "La clase es el conjunto de datos: «nadie está exactamente en los mismos aros que tú».",
     "Enrollar la lengua no es un rasgo genético simple: presentarlo como «diferente», no como «el gen de…»."),
    ("D7", "Haz tu cebra (patrones de Turing)", False,
     "Alan Turing (1952) — popsci.com (animal patterns Turing) · simulador de Karl Sims, karlsims.com/rd.html",
     "Ven en el proyector cómo una simulación hace crecer manchas y rayas solas. Luego cada niño dibuja «su» cebra, y no hay dos iguales.",
     "Magia visual, y algo que se llevan.",
     "10–15", "Siluetas de cebra, rotuladores", "Una receta simple más el azar dan resultados únicos: la misma idea de «tu ADN está escrito, pero cómo se lee cambia».",
     "Comprobar que el simulador va fluido en el portátil del aula."),
    ("D8", "Cilantro: ¿rico o sabe a jabón?", False,
     "Estudio de 23andMe, variante cerca del gen del olfato OR6A2 — arxiv.org/pdf/1209.2096",
     "Huelen hoja de cilantro aplastada, solo oler, y votan con el pulgar.",
     "Reacciones de cara muy divertidas.",
     "5", "Cilantro del súper", "Hay un gen del olfato, pero los genes explican solo una parte: encaja con tu mensaje final.",
     "Solo oler. Preguntar alergias a la profe."),
    ("D9", "Dollar Street: ¿qué tienen todos los niños del mundo?", False,
     "Gapminder (Hans Rosling) — gapminder.org/dollar-street",
     "Fotos reales de cepillos de dientes, camas o juguetes de casas de todo el mundo. ¿Cuál es de España? ¿Qué tienen todas las familias?",
     "Juguetes y camas de niños reales, y buscar parecidos.",
     "7", "Web", "Buscar patrones y agrupar.",
     "No ordenar por «ricos y pobres» a esta edad: centrarlo en lo que se parece."),
])

PICKS = [
    ("Si quieres un momento mágico", "C1 Las bacterias que se encienden"),
    ("Si quieres el mayor «wow» con IA", "B1 Sus dibujos bailan (probarlo antes)"),
    ("Si quieres que entiendan qué es aprender una máquina", "B2 El robot de vasos que aprende a ganar"),
    ("Si quieres el estilo Mark Rober sin gel", "A1 Gorila/dinosaurio invisible + A2 ¿Qué ha cambiado?"),
    ("Si quieres el heredero del árbol", "D1 Huellas + D2 La misma ballena + D5 Código de barras"),
    ("Si quieres tu propia investigación", "C2 El papel que se dobla solo"),
]


def build(path):
    doc = SimpleDocTemplate(path, pagesize=A4, leftMargin=1.8 * cm, rightMargin=1.8 * cm, topMargin=1.6 * cm,
                            bottomMargin=1.8 * cm, title="Día de la Ciencia v3 — banco de ideas", author="Uciel Chorostecki")
    S = []
    S.append(P("Banco de ideas para el Día de la Ciencia", "title"))
    S.append(P("1r i 2n de Primària · El Masnou · Tercera versión: solo ideas, en el aula, con material conseguible antes del lunes", "sub"))
    S.append(P("Este informe no trae guion ni paso a paso. Es un banco de 32 ideas en cuatro familias para elegir. "
               "Sale de cuatro búsquedas nuevas: más Mark Rober y creadores parecidos (Veritasium, Numberphile, Smarter Every Day, Operation Ouch!), "
               "demos de inteligencia artificial que siguen funcionando en 2026, demos de charlas TED y de las Christmas Lectures de la Royal Institution, "
               "e ideas de «todos somos únicos» en la línea del árbol de rasgos que hiciste con tus hijos. "
               "Las marcadas con ★ son mis favoritas de cada familia. Todo es en el aula, y nada de órganos, sangre en botella, fresas ni pulseras."))
    S.append(Spacer(1, 4))
    S.append(P("Atajos: qué elegir según lo que busques", "h2"))
    S.append(table(["Si quieres…", "Mira"], [[a, b] for a, b in PICKS], [7.5, 9.7]))

    S.append(P("El germen invisible sin Glo Germ", "h1"))
    S.append(P("El Paciente Cero de Mark Rober se puede hacer igual sin el gel original. No está probado: hay que comprobarlo en casa este fin de semana."))
    S.append(bl([
        "<b>Vaselina.</b> Es cosmética, está en cualquier farmacia o súper, brilla blanco azulado bajo luz UV y casi no se ve con luz normal, así que el secreto se mantiene. Brilla menos que el Glo Germ, así que conviene aplicarla en dos o tres niños y en el pomo de la puerta.",
        "<b>La versión negativa con protector solar (idea nueva).</b> El protector solar absorbe la luz UV y se ve oscuro. El papel blanco de impresora suele llevar blanqueadores que brillan azul. Así, los dedos con protector dejan huellas oscuras de «germen» sobre papel que brilla. Lo muestran Gizmodo (youtube.com/watch?v=yrs3_F5uzJI) y un segmento de El Hormiguero (youtube.com/watch?v=H3ERG54USB4).",
        "<b>Pintura facial UV.</b> Solo si la etiqueta trae lista de ingredientes (INCI), dirección de un responsable en la Unión Europea y número de lote. Algunas de Amazon son de efectos especiales y dicen «no cosmético». Además se ve de color con luz normal, así que sirve para la revelación, no para el secreto.",
        "<b>Agua tónica.</b> Brilla muchísimo, pero en las manos es pegajosa y los niños la chupan. Úsala solo como objeto que brilla.",
        "<b>Linterna de 365 nm,</b> no de 395 nm, y dos o tres para que el apagón sea rápido.",
    ]))

    for key in ["A", "B", "C", "D"]:
        title, intro, items = FAM[key]
        S.append(PageBreak())
        S.append(P(f"{key} · {title}", "h1"))
        S.append(P(intro))
        for (code, name, top, src, exp, hook, mins, mat, link, note) in items:
            star = " ★" if top else ""
            blk = [P(f"{code} · {name}{star}", "h2"),
                   P(f"<b>{mins} min</b> · <b>Material:</b> {mat}", "small"),
                   P(f"<b>De dónde sale:</b> {src}", "small"),
                   Spacer(1, 2),
                   P(f"<b>Qué viven los niños.</b> {exp}"),
                   P(f"<b>Por qué engancha.</b> {hook}"),
                   P(f"<b>Puente con tu trabajo.</b> <i>{link}</i>")]
            if note:
                blk.append(P(f"<b>Ojo:</b> {note}", "small"))
            blk.append(Spacer(1, 5))
            S.append(KeepTogether(blk))

    S.append(PageBreak())
    S.append(P("Cómo se combinan (hilos posibles, no guion)", "h1"))
    S.append(P("Las ideas encajan solas en tres temas. Sirven para elegir un hilo y luego armar el guion cuando quieras."))
    S.append(table(["Hilo", "Ideas que encajan", "La frase que lo une"], [
        ["«Tu cerebro te engaña»", "A1, A2, A3, A10, A6", "Los científicos usamos datos y ordenadores porque nuestros ojos y nuestra suerte nos engañan."],
        ["«Máquinas que aprenden»", "B2, B3, B1, B4, B6 y cerrar con C2", "Una máquina aprende de ejemplos, como vosotros; yo le enseño ARN."],
        ["«Nadie es como tú»", "D1, D5, D2, D4, D7", "Tu receta está escrita, pero eres único; los ordenadores aprenden a reconocer patrones únicos."],
        ["Mezcla «lo mejor de cada»", "A1 → B2 → D1 → C1 de final", "Engaño, aprendizaje, unicidad y un final con luz."],
    ], [4.0, 5.2, 8.0]))

    S.append(P("Descartado y por qué", "h1"))
    S.append(bl([
        "<b>Experimentos de Google que ya no existen:</b> Semi-Conductor, Move Mirror, Thing Translator, Shadow Art y Teachable Snake (Glitch cerró en julio de 2025). Emoji Scavenger Hunt ahora pide confirmar 13+ años.",
        "<b>Tiras de sabor amargo (PTC/PROP):</b> la asociación de profesores de ciencias de Ontario (STAO) clasifica el PTC como tóxico, un proveedor británico lo vende desde 7º curso (unos 11 años) y no hay distribuidor en España que llegue antes del lunes. Se sustituye por el cilantro.",
        "<b>Láminas de daltonismo (Ishihara) delante de la clase:</b> señalan a niños concretos. Si se quiere tocar el tema, mejor una diapositiva de «cómo ve el mundo un daltónico».",
        "<b>Fotos de bebés de los niños o juegos de parecido con sus padres:</b> pueden hacer daño a niños adoptados o en acogida. Mejor animales (D4) o una foto de bebé tuya.",
        "<b>Glitterbug y GermaGlo</b> (los geles de formación de verdad): no llegan desde el Reino Unido antes del lunes.",
        "<b>Creadores españoles</b> (Date un Voltio, QuantumFracture, CdeCiencia, El Robot de Platón): su contenido es para adultos y no hay formatos de «el público es el experimento» adaptables a esta edad.",
    ]))

    S.append(P("Qué comprobar esta semana, si eliges estas ideas", "h1"))
    S.append(bl([
        "Que Animated Drawings (B1) todavía anima dibujos. Es la única que no se pudo probar entera.",
        "La vaselina o el protector solar bajo tu linterna UV, a oscuras.",
        "El wifi y los altavoces del aula: Quick, Draw!, Blob Opera y Yanny/Laurel dependen de eso. Ten vídeos de respaldo.",
        "Con la profe: si los padres firmaron el permiso de imagen, porque el proyector muestra caras a la clase. Las demos sin cámara (B2, B6, B7, B8) no tienen ese problema.",
    ]))
    S.append(Spacer(1, 6))
    S.append(P("Fuentes principales: los enlaces van en cada idea. Los vídeos de YouTube se verificaron por título y canal, pero no se vieron enteros; conviene buscar tú el minuto exacto de cada clip.", "small"))

    doc.build(S, onFirstPage=footer, onLaterPages=footer)


if __name__ == "__main__":
    build(sys.argv[1])
