/* Reparto (spec §3.4 y §5.1). `look` traduce la descripción al dibujo (style S6); `wordsPerSecond` lo actualiza
   la prueba de voces. Los extras no hablan: no tienen `label` ni `voice`. */
window.EEP.data.cast = [
  { id: 'narrador', label: 'NARRADOR', name: 'Narrador', voice: 'es-MX-JorgeNeural', wordsPerSecond: 2.4,
    description: 'Voz en off; nunca se dibuja.',
    browser: { first: { name: 'Jorge', lang: 'es-MX' }, then: ['Microsoft Gerardo Online (Natural) - Spanish (Mexico)'], gender: 'male', lang: 'es-MX', last: { rate: 0.96 } } },
  { id: 'lucia', label: 'LUCÍA', name: 'Lucía', voice: 'es-CO-SalomeNeural', wordsPerSecond: 2.4,
    description: 'Lucía, docente de ciencias sociales de un colegio público de Medellín, que prepara una clase sobre la revisión del POT.',
    accents: { cardigan: 'accent-3', shirt: 'accent-1' },
    browser: { first: { name: 'Salome', lang: 'es-CO' }, then: ['Microsoft Dalia Online (Natural) - Spanish (Mexico)', 'Microsoft Andrea Online (Natural) - Spanish (Ecuador)'], gender: 'female', last: { pitch: 1.1 } },
    props: ['cuaderno', 'bolígrafo'],
    poses: ['notebook', 'asking', 'pointing-card', 'leaning', 'seated'],
    look: { skin: 'skin-2', gender: 'f', age: 'adult', build: 'medium', glasses: true,
      hair: { style: 'curly-tied', role: 'ink' },
      top: { kind: 'cardigan', role: 'accent-3' }, shirt: { role: 'accent-1' }, bottom: { kind: 'trousers', role: 'ink' } } },
  { id: 'hernan', label: 'HERNÁN', name: 'Hernán', voice: 'es-CO-GonzaloNeural', wordsPerSecond: 2.4,
    description: 'Hernán, vecino de un corregimiento, de unos sesenta años, que cultiva una huerta familiar y asiste a las socializaciones del POT.',
    accents: { shirt: 'accent-2', vest: 'accent-1' },
    browser: { first: { name: 'Gonzalo', lang: 'es-CO' }, then: ['Microsoft Alex Online (Natural) - Spanish (Peru)'], gender: 'male', notSameAs: 'narrador', last: { as: 'narrador', rate: 0.92, pitch: 0.85 } },
    props: ['sombrero', 'canasta', 'manguera'],
    poses: ['hat-in-hand', 'pointing-valley', 'hose', 'basket', 'seated', 'walking'],
    look: { skin: 'skin-4', gender: 'm', age: 'senior', build: 'slim', beard: true, hat: true,
      hair: { style: 'short', role: 'ground-2' },
      top: { kind: 'vest', role: 'accent-1', sleeves: false }, shirt: { role: 'accent-2' }, bottom: { kind: 'trousers', role: 'ink' } } },
  { id: 'extra-1', description: 'Asistentes a una socialización: cinco adultos de distintas edades y oficios.',
    poses: ['seated', 'standing'],
    people: [
      { skin: 'skin-1', gender: 'f', age: 'adult', build: 'medium', hair: { style: 'shoulder', role: 'skin-5' }, shirt: { role: 'accent-2' }, bottom: { kind: 'skirt', role: 'accent-7' } },
      { skin: 'skin-5', gender: 'm', age: 'young', build: 'slim', hair: { style: 'short', role: 'ink' }, shirt: { role: 'accent-1' }, bottom: { kind: 'trousers', role: 'ink' }, backpack: true },
      { skin: 'skin-3', gender: 'f', age: 'senior', build: 'broad', hair: { style: 'bun', role: 'ground-2' }, shirt: { role: 'accent-3' }, bottom: { kind: 'skirt', role: 'ink' }, cane: true, glasses: true },
      { skin: 'skin-2', gender: 'm', age: 'adult', build: 'broad', hair: { style: 'bald', role: 'ink' }, shirt: { role: 'accent-3' }, bottom: { kind: 'trousers', role: 'ink' }, beard: true },
      { skin: 'skin-4', gender: 'm', age: 'adult', build: 'medium', hair: { style: 'short', role: 'ink' }, shirt: { role: 'accent-2' }, top: { kind: 'vest', role: 'accent-1', sleeves: false }, bottom: { kind: 'trousers', role: 'ink' }, glasses: true }
    ] },
  { id: 'extra-2', description: 'Productores en un mercado campesino: una mujer con delantal y un hombre con gorra.',
    poses: ['standing'],
    people: [
      { skin: 'skin-3', gender: 'f', age: 'adult', build: 'medium', hair: { style: 'long', role: 'ink' }, shirt: { role: 'accent-3' }, apron: 'accent-2', bottom: { kind: 'trousers', role: 'ink' } },
      { skin: 'skin-1', gender: 'm', age: 'adult', build: 'broad', hair: { style: 'short', role: 'skin-5' }, shirt: { role: 'accent-2' }, cap: 'accent-1', bottom: { kind: 'trousers', role: 'ink' } }
    ] },
  { id: 'extra-3', description: 'Panel de expertos: dieciséis figuras pequeñas sentadas alrededor de una mesa larga.',
    poses: ['seated'], people: 'panel' },
  { id: 'extra-4', description: 'Transeúntes: una mujer con bolsa de compras, un joven con morral y un hombre mayor.',
    poses: ['bag', 'backpack', 'walking'],
    people: [
      { skin: 'skin-4', gender: 'f', age: 'adult', build: 'medium', hair: { style: 'curly-tied', role: 'ink' }, shirt: { role: 'accent-1' }, bottom: { kind: 'skirt', role: 'accent-7' } },
      { skin: 'skin-2', gender: 'm', age: 'young', build: 'slim', hair: { style: 'short', role: 'skin-5' }, shirt: { role: 'accent-3' }, bottom: { kind: 'trousers', role: 'ink' } },
      { skin: 'skin-5', gender: 'm', age: 'senior', build: 'medium', hair: { style: 'bald', role: 'ground-2' }, shirt: { role: 'accent-2' }, bottom: { kind: 'trousers', role: 'ink' }, glasses: true }
    ] },
  { id: 'extra-5', description: 'Equipo técnico de las entidades: cuatro adultos en una mesa de reunión con carpetas, un portátil y escarapelas.',
    poses: ['folders', 'seated-talk'],
    people: [
      { skin: 'skin-1', gender: 'm', age: 'adult', build: 'medium', hair: { style: 'short', role: 'ink-soft' }, shirt: { role: 'accent-2' }, bottom: { kind: 'trousers', role: 'ink' }, lanyard: true, glasses: true },
      { skin: 'skin-4', gender: 'f', age: 'adult', build: 'slim', hair: { style: 'long', role: 'ink' }, shirt: { role: 'accent-3' }, bottom: { kind: 'trousers', role: 'ink' }, lanyard: true },
      { skin: 'skin-2', gender: 'f', age: 'senior', build: 'medium', hair: { style: 'bun', role: 'ground-2' }, shirt: { role: 'accent-1' }, bottom: { kind: 'skirt', role: 'ink' }, lanyard: true, glasses: true },
      { skin: 'skin-5', gender: 'm', age: 'young', build: 'broad', hair: { style: 'short', role: 'ink' }, shirt: { role: 'accent-1' }, bottom: { kind: 'trousers', role: 'ink' }, lanyard: true }
    ] }
];
