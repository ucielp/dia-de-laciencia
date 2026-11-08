# Contrato de la app «Científicos por un día»

App de una sola página para el proyector, clase de ciencia para 52 niños de 6–7 años (**no escribir nunca el número de niños en pantalla**) (1º y 2º de primaria, Institut-Escola Lluís Millet, El Masnou). Todo en **español**, frases muy cortas, letra enorme. La presenta un científico que investiga **ARN, genómica, bioinformática e IA**.

## Archivos y quién los escribe
| Archivo | Autor |
|---|---|
| `index.html`, `core.js` | coordinador (ya existen: LEERLOS antes de empezar) |
| `scenes/portada.js`, `scenes/perro.js`, `scenes/cierre.js` | coordinador |
| `scenes/ciencia.js`, `scenes/video.js` | agente «ciencia» |
| `art/species.js`, `data/tree.js`, `scenes/familia.js` | agente «familia» |
| `data/notes.js`, `../guion_clase.md` | agente «guion» |

Escribe **solo tus archivos**. No toques `core.js` ni `index.html`; si necesitas algo de ellos, dilo en tu informe final.

## Escenario
- Un `div` de **1920×1080 px** fijo que `core.js` escala al tamaño de pantalla. Coloca todo con píxeles dentro de ese lienzo (position:absolute o flex), como si fuera una diapositiva.
- Texto: mínimo **40 px** (títulos 90–140 px). Fuentes: `var(--display)` = Fredoka (títulos), `var(--body)` = Nunito Sans.
- Colores (CSS vars y `APP.T`): logo del cole `--blue #29ABE2`, `--orange #F7931E`, `--green #7AC143`, `--grey #6D6E71`; tinta `--ink #1F2A44`; papel `--paper #FFFDF7`, `--cream #F6F1E6`, `--sand #EFE5D2`; gomets `--red #E04B3A`, `--gblue #2453C7`, `--yellow #F2C230`.
- Fondo de cada escena: píntalo tú (el escenario es `--paper`).

## Registrar una escena
```js
(window.SCENES=window.SCENES||[]).push({
  id:"ambitos",            // único, [a-z0-9-]
  title:"¿Qué hace la ciencia?",
  order:30,                // orden global (ver tabla)
  mount(box, APP){         // box = div 1920x1080 vacío
    // construir DOM dentro de box (APP.el, APP.svg ...)
    return {
      next(){ return true; },   // true si avanzó un paso interno; false = pasar a la siguiente escena
      prev(){ return false; },
      destroy(){ /* parar timers, animaciones, listeners de window */ }
    };
  }
});
```
- Navegación: flechas ←/→, espacio, PageUp/PageDown (mando de presentaciones). Cada pulsación llama a `next()` de la escena; si devuelve `false`, pasa a la siguiente escena. Usa pasos internos para ir revelando cosas (máx. ~6 pasos por escena).
- Clicks en elementos de la escena también deben funcionar (el presentador puede usar ratón).
- Escena opcional: `available(APP)` (opcional) devuelve `true/false` o una `Promise<boolean>`; `core.js` la comprueba al arrancar y, si no es `true`, la escena queda fuera de la navegación y de los puntos.
- `destroy()` debe limpiar `setInterval`, `requestAnimationFrame` y listeners en `window/document`.

## Orden global de escenas (v2, tras la revisión del presentador)
| order | id | Contenido | Archivo |
|---|---|---|---|
| 5 | misterio | Pantalla casi vacía: un «?» gigante y música de misterio en bucle (sintetizada; empieza con la 1.ª pulsación) mientras el presentador hace el experimento de la espuma EN SILENCIO. Al pulsar: «¿Qué ha pasado?» | ciencia.js |
| 8 | experimento | Explicación animada del experimento de la espuma (dos ingredientes → gas → el jabón atrapa el gas en burbujas → espuma). Sustituye a la pimienta. Ya NO lleva el paso del vídeo | ciencia.js |
| 9 | metodo | Método científico (ciclo de 5 pasos) | ciencia.js |
| 25 | no-solo | «La ciencia es mucho más que experimentos» (transición) | ciencia.js |
| 30 | ambitos | ¿Qué hace la ciencia? tarjetas; las DOS ÚLTIMAS son medicina y ordenadores/IA; hay una de historia | ciencia.js |
| 35 | portada | Logo del cole, «Hola, soy Uciel y soy científico» (ahora va DESPUÉS de ámbitos) | portada.js |
| 37 | equipo | Mi equipo en la UIC: fotos, «La ciencia se hace en equipo» | portada.js |
| 40 | mi-trabajo | Lo que yo hago: niño → célula → ADN → 4 letras (colores del modelo) → «yo estudio estas letras y lo combino con IA» (sin ARN) | ciencia.js |
| 50 | receta | El ADN es una receta (ejemplo: panellets) → la receta del perro (3 gomets) | perro.js |
| 52 | familia-perro | Historia: mamá perra y papá perro → los cachorros reciben cada parte de mamá o de papá. Nos parecemos a nuestros padres | perro.js |
| 55 | como-buscar | Cómo se hace la actividad 1 (aquí se para y se hace la actividad) | perro.js |
| 57 | actividad-1 | Separador «¡A trabajar! Actividad 1: descubran su perro» (aquí se para y se hace la actividad; sin pasos) | perro.js |
| 60 | laboratorio | Laboratorio de perros: clic en 3 colores → perro | perro.js |
| 70 | parientes | ¿Quién es pariente de quién? | familia.js |
| 75 | busca-familia | Instrucciones actividad 2 (10 grupos, parejas) | familia.js |
| 77 | actividad-2 | Separador «¡A jugar! Actividad 2: busquen a su pareja» (aquí se hace la actividad; sin pasos) | familia.js |
| 80 | arbol | Árbol: parejas + el adulto saca murciélago, T-rex, cocodrilo, rana, tiburón | familia.js |
| 90 | cierre | ¡Hoy han sido científicos! | cierre.js |
| 95 | video | OPCIONAL: «¡Así lo preparamos en casa!», vídeo `video/experimento.mp4` en bucle (clic = pausa). Si el archivo no existe, la escena no aparece y todo termina en cierre | video.js |

## Colores de las bases del ADN (modelo físico que estará a la vista)
A = azul `#2F6BD8` · T = rojo frambuesa `#E0245E` · G = verde `#1E9A57` · C = naranja `#F28A1E`. Cada casilla de ADN se dibuja con su color **y su letra en blanco** (así no se confunde con los gomets redondos de los perros: rojo/azul/amarillo).

## Sonido
Menos sonidos: solo en momentos clave (ladrido al aparecer un perro, revelaciones grandes, música de misterio del experimento, final). Nada de pop/click en cada paso.

## API disponible: `window.APP` (ver core.js)
- `APP.el(tag, attrs, ...hijos)` — crea elementos (`style` objeto, `class`, `html`, `onclick`...).
- `APP.svg(markup)` — convierte texto SVG en nodo.
- `APP.audio.pop() / ok() / win() / whoosh() / boing() / click() / bark(pitch) / tone(f,d,type,vol,when,slide)` — sonidos sintetizados (no hay archivos de audio).
- `APP.paperSVG(shapes, {vb, eyes:[[x,y]], eyeR, label, cls})` — dibujo en estilo **papel recortado** (sombra suave, sin contorno). Formas: `APP.R(x,y,w,h,rx,color)`, `APP.C(cx,cy,r,color)`, `APP.E(cx,cy,rx,ry,color,rot)`, `APP.P(d,color)`, `APP.L(d,color,ancho)` (trazo grueso), `APP.LN(d,color,ancho)` (línea fina sin sombra).
- `APP.dog.svg(e,c,t)` — el perro geométrico (orejas, pelaje, cola ∈ "rojo","azul","amarillo").
- `APP.sleep(ms)`, `APP.reduced()` (prefers-reduced-motion), `APP.store` (estado compartido), `APP.goto(id)`, `APP.next()`.

## Restricciones técnicas (obligatorias)
- **Sin imágenes ni vídeos externos**: el navegador bloquea cualquier URL que no sea un archivo propio. Todo se dibuja con SVG, CSS o canvas. Animaciones con CSS keyframes, Web Animations API o requestAnimationFrame.
- Sin librerías externas (si de verdad hace falta una, solo de cdnjs.cloudflare.com con versión exacta; mejor no).
- Sin `alert/confirm/prompt`. Sin emojis como iconos: dibuja.
- Estilo visual: **papel recortado** (formas planas con sombra suave, como cartulina), colores del logo. Bonito, cálido, infantil pero no chillón.
- CSS de tu escena: inyecta un `<style>` dentro de `box` o usa estilos en línea; prefija tus clases con el id de la escena para no chocar.
- Respeta `APP.reduced()`: si es true, sin animaciones largas (mostrar estado final).
