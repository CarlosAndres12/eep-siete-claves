/* Vistas de punto (spec §7.2 y §7.3): títulos, pedido literal, introducción, videos, «Para leer bien estas cifras»
   y sellos. Las cifras se escriben como {fig:id}. */
window.EEP.data.puntos = [
  { n: 1, route: '#/punto-1', h1: 'Punto 1 · Cómo se mapea la vegetación',
    card: { title: 'Cómo se mapea la vegetación', line: 'Satélites y aprendizaje automático para saber qué cubre el suelo, y los límites de ese mapa.' },
    request: 'Proceso de estimación de coberturas vegetales (énfasis en métodos) y sus potencialidades.',
    intro: 'El estudio actualizó el mapa de lo que cubre el suelo de Medellín con imágenes de satélite y aprendizaje automático. Aquí se explica cómo se hizo, qué permite ese mapa y cuáles son sus límites.',
    videos: ['v1'], stamp: 'stamp-ia',
    bullets: [
      'El {fig:P1-C01} es la meta de exactitud que el estudio se fijó; el documento todavía no reporta esa verificación.',
      'Las {fig:P1-C09} en conflicto son una primera estimación; el documento las refiere a años distintos según el pasaje.',
      'Un conflicto de uso es una diferencia entre el uso actual y lo que permite la norma: no significa ilegalidad ni implica necesariamente daño ambiental.',
      'Las cifras del prediagnóstico son preliminares.',
      'La serie de bosques de los enlaces estructurantes no se usa: el texto y una figura del documento le asignan años distintos.'
    ] },
  { n: 2, route: '#/punto-2', h1: 'Punto 2 · Los ocho mensajes principales',
    card: { title: 'Los ocho mensajes', line: 'Los mensajes principales del estudio, uno por uno y con sus matices.' },
    request: 'Los mensajes que se están presentando.',
    intro: 'El documento intercala ocho mensajes principales que sintetizan sus hallazgos. Aquí se presentan uno por uno, con sus matices y, cuando corresponde, con la cifra que los respalda.',
    videos: ['v2'], chapterLinks: true, retiros: true,
    bullets: [
      'Los mensajes sintetizan hallazgos para los equipos de decisión; no son normas ni decisiones adoptadas.',
      'La amenaza alta por movimientos en masa se mide con dos bases que no se suman ni se comparan: el {fig:P2-C09} del área urbanizada, según el mapa combinado, y el {fig:P2-C13} del Distrito, según la zonificación oficial.',
      'Según el estudio, {fig:P2-C47} del caudal concesionado a los tres embalses proviene de cuencas fuera del Distrito; no equivale al agua que se consume.',
      '“Tres de cada cuatro” redondea el {fig:P2-C42}; los corregimientos abarcan la mayor parte del área del Distrito.',
      'El mensaje de conectividad se presenta sin la serie de su titular: el texto y una figura del documento le asignan años distintos.',
      'El mensaje de soberanía alimentaria se presenta sin porcentaje: el documento mide la dependencia alimentaria de formas que no son equivalentes.'
    ] },
  { n: 3, route: '#/punto-3', h1: 'Punto 3 · La expansión urbana',
    card: { title: 'La expansión urbana', line: 'Tres mediciones distintas de la expansión urbana, que no se suman ni se comparan.' },
    request: 'El análisis de la expansión urbana.',
    intro: 'El estudio mide la expansión con tres métricas distintas que el propio documento pide no combinar. Por eso este punto tiene tres videos separados.',
    stamp: 'stamp-base', stampNote: 'Tres mediciones, tres métodos: no se suman, no se restan ni se comparan entre sí.',
    videos: ['v3', 'v4', 'v5'],
    tabs: [
      { id: 'a', label: 'A · Ganancia de tejido urbano (Medellín)', video: 'v3', grupo: 'A',
        bullets: [
          'Los dos periodos no suman exactamente el total; el documento no explica la diferencia.',
          'El documento no reporta la exactitud del mapa de alta resolución.',
          'Según el estudio, gran parte de la ganancia en los corregimientos es suburbanización; también incluye urbanización formal, como cabeceras y áreas de expansión.'
        ] },
      { id: 'b', label: 'B · Piso duro (Valle de Aburrá)', video: 'v4', grupo: 'B',
        bullets: [
          'Son áreas cartografiadas: parte del cambio puede reflejar diferencias de detalle de los mapas y de representación de las vías.',
          'Solo cinco de los otros nueve municipios limitan con Medellín.',
          'La continuidad de coberturas artificiales en los límites no equivale a una ciudad continua.'
        ] },
      { id: 'c', label: 'C · Probabilidad de cambio urbano', video: 'v5', grupo: 'C',
        bullets: [
          'Son probabilidades de cambio, no áreas urbanizadas confirmadas.',
          'Las luces nocturnas son de una sola fecha, posterior al periodo.',
          'El cambio no concluyente no se atribuye directamente a urbanización.'
        ] }
    ] },
  { n: 4, route: '#/punto-4', h1: 'Punto 4 · Los cambios y la estructura ecológica',
    card: { title: 'La estructura ecológica', line: 'Qué cambió entre 2014 y 2024 y cómo propone el estudio actualizar su delimitación.' },
    request: 'Los cambios y la estructura ecológica principal.',
    intro: 'La Estructura Ecológica Principal es la red de áreas naturales que sostiene los procesos ecológicos de Medellín. El estudio analiza cómo cambió entre 2014 y 2024 y propone actualizar su delimitación.',
    videos: ['v6'], stamp: 'stamp-corredor', retiros: true,
    bullets: [
      'Las {fig:P4-C01} son la estructura vigente de 2014; el documento no reporta el área total de la propuesta.',
      'La delimitación es una propuesta técnica, no un acto administrativo, y debe concertarse con las autoridades ambientales.',
      'Las {fig:P4-C35} y las {fig:P4-C45} se incorporan a elementos de la propuesta; no equivalen necesariamente a área nueva de la estructura.',
      'Las {fig:P4-C21} salen de un modelo para aves.',
      'La matriz de cambios cuenta cuánto cambió cada cobertura, no qué significa ese cambio: una pérdida en ella no equivale a deterioro ambiental.'
    ] },
  { n: 5, route: '#/punto-5', h1: 'Punto 5 · Amenaza, exposición y vulnerabilidad',
    card: { title: 'Amenaza, exposición y vulnerabilidad', line: 'Cómo lee el estudio el riesgo y qué propone para el ordenamiento.' },
    request: 'El análisis de la vulnerabilidad y su asociación con amenaza y riesgo (metodología y su incorporación en el tema de análisis de riesgo).',
    intro: 'El estudio no calcula un índice de riesgo: lee la amenaza, la cruza con lo que está expuesto y analiza aparte la vulnerabilidad, porque el ordenamiento actúa sobre la exposición y la vulnerabilidad, pero no modifica la amenaza.',
    videos: ['v7'], stamp: 'stamp-amenaza',
    bullets: [
      'Amenaza alta no es lo mismo que riesgo alto.',
      'La amenaza alta por movimientos en masa se mide con dos bases que no se suman ni se comparan: el {fig:P5-C01} del área urbanizada, según el mapa combinado, y el {fig:P5-C22} de todo el Distrito, según la zonificación oficial.',
      'Los mapas orientan dónde se necesitan estudios de detalle; no definen el riesgo predio a predio.',
      'La vulnerabilidad se presenta solo de forma agregada; ningún barrio se señala como vulnerable.'
    ] },
  { n: 6, route: '#/punto-6', h1: 'Punto 6 · Agua, alimentos y región',
    card: { title: 'Agua, alimentos y región', line: 'Las relaciones de Medellín con el valle y la región, con énfasis en los alimentos.' },
    request: 'La dinámica de las relaciones del Distrito en otras escalas y con énfasis en los alimentos.',
    intro: 'Medellín depende de la región para la mayor parte de su agua, y de otros territorios para la mayor parte de sus alimentos. El estudio describe esas relaciones, quiénes producen dentro del Distrito y qué propone para ordenar el territorio con esa realidad.',
    videos: ['v8'], stamp: 'stamp-agua',
    bullets: [
      'La dependencia alimentaria se expresa en el documento con cifras que miden cosas distintas; por eso el sitio usa la conclusión del estudio: la producción local es una fracción mínima de la demanda.',
      'Según el estudio, {fig:P6-C80} del caudal concesionado a los embalses que abastecen al Distrito proviene de cuencas fuera de su territorio; no equivale al agua que se consume.',
      'Los {fig:P6-C70} registros cuentan viajes de carga, no toneladas.',
      'El {fig:P6-C58} de los 18.493 predios rurales tiene menos de 4 hectáreas, un umbral operativo del estudio, menor que la Unidad Agrícola Familiar; otro capítulo del documento describe la misma cifra con otro umbral, que aquí no se usa.',
      'Los datos sociales del campesinado se presentan solo de forma agregada.'
    ] },
  { n: 7, route: '#/punto-7', h1: 'Punto 7 · Anticiparse y coordinarse',
    card: { title: 'Anticiparse y coordinarse', line: 'Factores de cambio, gobernanza y hechos metropolitanos hacia 2040.' },
    request: 'Los factores de cambio y la gobernanza y prospectiva con los hechos metropolitanos influyentes. En el marco del proyecto.',
    intro: 'El estudio pensó el futuro de Medellín a 2040 con un panel de expertos, describió cómo anticiparse a los cambios y revisó qué asuntos del valle condicionan las decisiones del Distrito.',
    videos: ['v9'],
    bullets: [
      'La priorización de factores es un ejercicio de {fig:P7-C04} expertos apoyado en inteligencia artificial, no una consulta ciudadana.',
      'Los puntajes de la priorización no se citan: el documento usa un código de colores contradictorio.',
      'El informe no enumera los {fig:P7-C23} hechos metropolitanos declarados ni los cruza con los factores de cambio.',
      'El comité de integración territorial es una recomendación, no una decisión adoptada.'
    ] }
];
