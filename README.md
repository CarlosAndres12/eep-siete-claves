# El territorio que sostiene a Medellín

Sitio de divulgación ciudadana, sin conexión, sobre siete claves del Informe técnico final, Producto 5, del estudio de la Estructura Ecológica Principal (Convenio 422 de 2025). Tiene nueve videos narrados, cifras con su alcance y su fuente, diapositivas para «Modo clase», un glosario y las precauciones del propio estudio.

**Antes de cada sesión, quien facilite debe revisar todos los guiones y todas las cifras.** El sitio es un insumo de divulgación: las decisiones sobre el ordenamiento corresponden al Distrito.

## Cómo abrir el sitio

- Doble clic en `index.html`. Funciona sin internet y sin instalar nada.
- Navegadores recomendados: Chrome, Edge o Firefox recientes.

### Servir la carpeta en un servidor local (para grabar video con voz)

Los navegadores no dejan capturar el audio de una página abierta como archivo. Para usar «Descargar video» con voz, sirva la carpeta:

```
cd eep-siete-claves
python3 -m http.server 8000
```

y abra `http://localhost:8000/`.

## Dónde editar textos y datos

Todo el texto está en `js/data/`; ningún archivo de dibujo tiene texto propio.

| Archivo | Contenido |
|---|---|
| `site.js` | título, navegación, pie, sellos, insignias fijas y `facilitador` |
| `home.js`, `views.js` | textos de las vistas |
| `puntos.js` | cada punto: pedido literal, introducción, «Para leer bien estas cifras», pestañas del Punto 3 |
| `videos.js` | los nueve videos: escenas, «Se ve», textos en pantalla (`texts`), líneas de voz, preguntas, capítulos |
| `figures.js` | el banco de 70 cifras (literal, alcance, tipo, fuente, ubicación en el documento) |
| `sources.js` | las fuentes |
| `glossary.js` | glosario y palabras clave por punto |
| `messages.js` | mensajes clave por punto |
| `slides.js` | diapositivas de «Modo clase» |
| `corrections.js` | la tabla de «Precauciones» |
| `widgets.js` | los tres juegos |
| `allowed.js` | cifras permitidas por video |
| `cast.js` | reparto, voces y velocidad de habla |

Mini-marcado en los textos: `**negrita**`, `{fig:P2-C47}` (una cifra del banco, con su tipo y enlace), `{glos:término}` (enlace al glosario), `[texto](ref:clave)` (una fuente).

En las escenas de `videos.js`, `texts` guarda, en orden, los textos que muestra la escena (`t1`, `t2`…). Se pueden cambiar las palabras sin tocar el código de dibujo.

### Facilitador

Antes de una sesión, escriba el nombre de quien facilita en `facilitador` dentro de `js/data/site.js`. Las diapositivas de título de «Modo clase» mostrarán entonces «Facilita: » y ese nombre. Si el campo está vacío, la línea no aparece.

## Cómo cambiar los tiempos de las escenas

Cada escena tiene un `min` (segundos mínimos) en `js/data/videos.js`. La duración real es la mayor entre `min` y lo que necesitan sus voces (con una entrada de 0,6 s, 0,5 s entre líneas y 1,2 s al final). Una línea puede llevar `pause` (segundos extra de silencio después). Después de cambiar textos o tiempos, regenere las voces (abajo); el video sigue la voz sola.

## Voces

La narración usa voces neuronales de Microsoft con estos nombres: narrador `es-MX-JorgeNeural`, Lucía `es-CO-SalomeNeural` y Hernán `es-CO-GonzaloNeural`. Lucía y Hernán son personajes inventados; las voces son sintéticas.

Esta versión se generó con las mismas voces a través del servicio de voz de Microsoft Edge (`engine: "edge"` en `tools/voice.config.json`), que es gratuito y no necesita clave. Las herramientas también admiten Azure AI Speech.

### Regenerar las voces

Requisitos: Node 20 o superior, `ffmpeg` y `ffprobe`, y para el motor «edge» el programa `edge-tts` (`pipx install edge-tts`).

```
cd eep-siete-claves/tools
npm install
node generate-voiceover.mjs --voice-test   # una muestra por voz y calibración de palabras por segundo
node generate-voiceover.mjs --dry-run      # duración estimada de cada video frente a su objetivo, sin sintetizar
node generate-voiceover.mjs                # sintetiza todo (o --only v4); --force ignora la caché
```

- **Caché:** cada trozo sintetizado se guarda en `tools/.cache/clips/` con una huella de la voz, la velocidad, el tono y el texto; una línea que no cambió nunca se vuelve a pedir.
- **Libro de uso:** `tools/.cache/usage.json` cuenta los caracteres de cada mes y `--dry-run` muestra cuántos caracteres facturaría la misma síntesis en Azure.
- **Pronunciación:** los alias están en `tools/lexicon.es.json`; los números se escriben siempre en palabras (`tools/lib/normalize-es.mjs`). Una línea puede llevar `say` con el texto exacto que debe decirse.
- **Cambiar una voz:** edite `tools/voice.config.json` (nombre, velocidad `rate`, tono `pitch`) y el nombre en `js/data/cast.js`; luego ejecute `--voice-test` y regenere.

### Con Azure AI Speech (nivel gratuito F0)

1. En el portal de Azure, cree un recurso de Azure Speech (hoy aparece en Microsoft Foundry como «Azure Speech in Foundry Tools») con el plan de tarifa **Free F0**, y copie su clave y su región.
2. Ponga `AZURE_SPEECH_KEY` y `AZURE_SPEECH_REGION` en el entorno o en `tools/.env` (vea `tools/.env.example`; ese archivo nunca se sube al repositorio). La clave nunca se escribe en el sitio ni en los registros.
3. `npm install microsoft-cognitiveservices-speech-sdk`, cambie `engine` a `"azure"` en `tools/voice.config.json` y use el adaptador `tools/lib/tts-azure.mjs`.
4. F0 incluye 0,5 millones de caracteres al mes y 20 peticiones por minuto. Cuando se acaba la cuota no hay cobro: la síntesis se detiene hasta el mes siguiente. Una síntesis completa de este sitio usa unos 60.000 caracteres (alrededor del 12 %).

## Grabar o exportar los videos

- **«Descargar video»** en cada reproductor: si existe el MP4 exportado, lo ofrece como «Descargar MP4». Si no, graba una pasada en tiempo real (la pestaña debe quedar visible). «Descargar este capítulo» graba solo el capítulo actual.
- **Exportar MP4** (desarrollo): `node tools/render-videos.mjs` dibuja cada cuadro en Chromium, lo une con la narración y escribe `assets/video/<slug>.mp4`. Se puede reanudar: los capítulos ya renderizados quedan en `tools/.cache/render/`.
- **Logotipos:** el sitio y sus videos no llevan logotipos. Si un MP4 exportado necesita los logotipos institucionales, la oficina de comunicaciones los agrega después de exportar, con sus propias herramientas de video y los archivos de `recursos-graficos/logos/`, como lo pide su manual de identidad.
- **Los tres videos del Punto 3** son piezas separadas: publíquelos o expórtelos cada uno por su cuenta y nunca edite uno para citar las cifras de otro.

## Formato de los números

El sitio escribe los números con coma decimal y punto de miles (40,93 %; 3.491,58 ha). Para mostrar el formato del documento original (punto decimal), cambie `NUMBER_FORMAT` en `js/core/namespace.js` y regenere las voces; las voces leen los números en palabras de cualquier modo.

## Añadir una cifra retenida, cuando el DAP la valide

Algunas cifras del documento no se usan (por ejemplo, el porcentaje del Mensaje 3 o la serie de los enlaces estructurantes). Cuando el DAP valide una:

1. Añada su fila a `js/data/figures.js` con su `original` y su `cita` tomados del archivo de contenido.
2. Añada su id a la lista del video en `js/data/allowed.js`.
3. Quite su patrón de los enunciados prohibidos en `tools/check-figures.mjs`.
4. Edite la línea correspondiente en `js/data/videos.js`.
5. Ejecute `node tools/generate-voiceover.mjs --dry-run` antes de sintetizar.

## Cambiar el estilo gráfico

El aspecto vive solo en `js/style/`, `css/tokens.css` y `css/style.css`, a partir del archivo de estilo `content/estilo-enfoque-metropolitano.md`. Para cambiarlo: reemplace ese archivo por el nuevo (siempre hay uno solo), reconstruya esos tres lugares desde él, ejecute `node tools/check-style.mjs`, genere la hoja de prueba (`node tools/snapshots.mjs --estilo`) y las capturas (`node tools/snapshots.mjs`) y revíselas con la lista de verificación del nuevo estilo. Datos, dibujos del curso y videos no cambian.

## Revisiones automáticas (desarrollo)

```
node tools/check-figures.mjs   # trazabilidad de cifras y enunciados prohibidos
node tools/check-style.mjs     # aislamiento del estilo y paleta
node tools/check-allowed.mjs   # cifras permitidas por video y separación del Punto 3
node tools/check-site.mjs      # todas las rutas sin errores de consola ni peticiones externas
node tools/snapshots.mjs       # cuadros de revisión y hojas de contacto en review/
node tools/update-index.mjs    # reescribe la lista de scripts de index.html al añadir archivos
```

## Imprimir

Cada vista se imprime en tamaño carta y en blanco y negro (Archivo › Imprimir): la ficha de cada punto, el banco de cifras (`#/cifras`), el glosario, las precauciones y las transcripciones de los videos (abra «Transcripción» antes de imprimir).

## Créditos y licencias

- Fuente obligatoria: Distrito de Medellín – DAP; Área Metropolitana del Valle de Aburrá; Universidad de Antioquia – INER (2026). Diagnóstico propositivo de escala metropolitana y regional para la estructura ecológica principal y áreas de amenaza y riesgo del modelo de ocupación territorial. Informe técnico final, Producto 5.
- Publica: Departamento Administrativo de Planeación, Distrito de Medellín.
- Tipografías DM Sans e IBM Plex Mono, con licencia SIL Open Font License (`assets/fonts/*/OFL.txt`).
- Ilustraciones originales dibujadas con código; sin fotografías, logotipos ni mapas reales.
