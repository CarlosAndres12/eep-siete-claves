/* Textos de las vistas (spec §7.3–§7.10). */
window.EEP.data.views = {
  punto: {
    requestTitle: 'Lo que se pidió',
    messagesTitle: 'Mensajes clave',
    figsTitle: 'Las cifras de este punto',
    readTitle: 'Para leer bien estas cifras',
    wordsTitle: 'Palabras clave',
    sourceTitle: 'Fuente',
    sourcesToggle: 'Fuentes',
    prev: 'Punto anterior',
    next: 'Punto siguiente',
    chaptersTitle: 'Los ocho mensajes, uno por uno'
  },
  escalas: {
    h1: 'Tres escalas',
    dek: 'Distrito, Valle de Aburrá y región',
    text: 'El estudio trabajó en tres escalas: la del Distrito de Medellín, la metropolitana del Valle de Aburrá y la de la ciudad-región. Muchas cifras solo se entienden si se sabe de qué territorio hablan; por eso cada tarjeta de cifra lleva el símbolo de su escala.',
    items: [
      { id: 'distrito', label: 'Distrito de Medellín', text: 'El territorio del Distrito: sus dieciséis comunas y cinco corregimientos.' },
      { id: 'valle', label: 'Valle de Aburrá', text: 'La escala metropolitana: Medellín y los otros nueve municipios del valle.' },
      { id: 'region', label: 'Región', text: 'La ciudad-región: las subregiones de Antioquia y otros territorios de los que Medellín recibe agua, alimentos, energía y otros soportes.' }
    ]
  },
  cifras: {
    h1: 'Cifras',
    dek: 'Tal como las reporta el estudio, con su alcance y su fuente',
    text: 'Cada cifra se muestra con lo que mide, el territorio y el periodo al que se refiere, el tipo de dato y su fuente. Las cifras marcadas «Con matiz» tienen una advertencia que se lee junto a ellas.',
    note: 'Las cifras se escriben con coma decimal y punto de miles. El documento original usa el formato inverso; cada tarjeta muestra la forma original en «Cómo aparece en el documento».',
    filters: { punto: 'Punto', escala: 'Escala', tipo: 'Tipo de dato', search: 'Buscar una cifra', all: 'Todos' }
  },
  precauciones: {
    h1: 'Precauciones',
    dek: 'Lo que sí se puede decir y lo que no',
    text: 'Esta tabla reúne advertencias del propio estudio y precauciones que resultan de revisar sus cifras: las lecturas correctas, las que conviene evitar y su razón.',
    cols: { tema: 'Tema', usa: 'Usa', noUses: 'No uses', porque: 'Por qué' },
    code1: '(inconsistencia interna del documento)',
    codeN: '(inconsistencias internas del documento)'
  },
  glosario: {
    h1: 'Glosario',
    dek: 'Palabras del estudio en lenguaje sencillo',
    search: 'Buscar un término',
    punto: 'Punto',
    all: 'Todos',
    definition: 'Definición en el documento',
    points: 'Puntos: '
  },
  fuentes: {
    h1: 'Fuentes',
    obligatory: 'Fuente obligatoria',
    cited: 'Fuentes citadas por el estudio',
    base: 'Base de este sitio',
    howTitle: 'Cómo citar este sitio',
    how: 'Departamento Administrativo de Planeación, Distrito de Medellín (2026). El territorio que sostiene a Medellín: siete claves del estudio técnico de la Estructura Ecológica Principal. Sitio de divulgación basado en el Informe técnico final, Producto 5.'
  },
  modoClase: {
    h1: 'Modo clase',
    text: 'Para proyectar en una socialización o compartir pantalla. Los videos se detienen al final de cada capítulo para conversar.',
    choose: 'Elegir punto',
    slides: 'Diapositivas',
    video: 'Video',
    prev: 'Anterior',
    next: 'Siguiente',
    full: 'Pantalla completa',
    clock: 'Reloj de la sesión',
    start: 'Iniciar',
    pause: 'Pausar',
    reset: 'Reiniciar',
    chapterPause: 'Pausar al final de cada capítulo',
    facilita: 'Facilita: ',
    notes: 'Notas del presentador',
    widget: '¿Qué mide esta cifra?'
  },
  acerca: {
    h1: 'Acerca de este sitio',
    blocks: [
      { title: 'Qué es', text: 'Un sitio de divulgación ciudadana basado en la extracción de siete puntos del Documento técnico final de la Estructura Ecológica Principal, Producto 5, preparada como insumo para videos del Distrito.' },
      { title: 'Publica', text: 'Departamento Administrativo de Planeación, Distrito de Medellín.' },
      { title: 'Versión', text: 'Informe técnico final, Producto 5, versión 0 según su portada, 15 de octubre de 2026. Extracción del 24 de octubre de 2026.' },
      { title: 'Cómo se hizo', text: 'Las voces son sintéticas. Lucía y Hernán son personajes inventados. Las ilustraciones se dibujan con código, sin fotografías, sin logotipos y sin mapas reales.' }
    ]
  }
};
