/* Datos generales del sitio (spec §7.1, §7.9): título, navegación, pie y textos fijos de la interfaz. */
window.EEP.data.site = {
  title: 'El territorio que sostiene a Medellín',
  subtitle: 'Siete claves del estudio técnico de la Estructura Ecológica Principal',
  // Nombre de quien facilita una sesión de «Modo clase». Vacío: la línea «Facilita: …» no aparece.
  facilitador: '',
  nav: [
    { href: '#/inicio', label: 'Inicio' },
    { menu: 'Puntos' },
    { href: '#/escalas', label: 'Escalas' },
    { href: '#/cifras', label: 'Cifras' },
    { href: '#/precauciones', label: 'Precauciones' },
    { href: '#/glosario', label: 'Glosario' },
    { href: '#/fuentes', label: 'Fuentes' },
    { href: '#/modo-clase', label: 'Modo clase' },
    { href: '#/acerca', label: 'Acerca' }
  ],
  footer: [
    'El territorio que sostiene a Medellín · Siete claves del estudio técnico de la Estructura Ecológica Principal',
    'Fuente: Distrito de Medellín – DAP; Área Metropolitana del Valle de Aburrá; Universidad de Antioquia – INER (2026). Diagnóstico propositivo de escala metropolitana y regional para la estructura ecológica principal y áreas de amenaza y riesgo del modelo de ocupación territorial. Informe técnico final, Producto 5.',
    'Ilustraciones originales dibujadas con código.',
    'Identidad visual adaptada, sin logotipos ni fotografías.',
    'Las voces de los videos son sintéticas y los personajes, inventados. Las cifras provienen del informe técnico citado y se leen con las precauciones del propio estudio.',
    'Publica: Departamento Administrativo de Planeación, Distrito de Medellín'
  ],
  obligatorySource: 'Distrito de Medellín – DAP; Área Metropolitana del Valle de Aburrá; Universidad de Antioquia – INER (2026). Diagnóstico propositivo de escala metropolitana y regional para la estructura ecológica principal y áreas de amenaza y riesgo del modelo de ocupación territorial. Informe técnico final, Producto 5.',
  transparency: 'Las voces de los videos son sintéticas y los personajes, inventados. Las cifras provienen del informe técnico citado y se leen con las precauciones del propio estudio.',
  publisher: 'Departamento Administrativo de Planeación, Distrito de Medellín',
  // Sellos del curso (spec §3.2): texto y signo.
  stamps: {
    'stamp-insumo': { text: 'Insumo técnico · Decide el Distrito', sign: 'documento' },
    'stamp-corredor': { text: 'Un corredor dibujado no garantiza un corredor que funcione', sign: 'corredor' },
    'stamp-ia': { text: 'La inteligencia artificial apoya, no reemplaza, el criterio técnico', sign: 'lampara-lupa' },
    'stamp-amenaza': { text: 'Amenaza alta no es lo mismo que riesgo alto', sign: 'triada' },
    'stamp-agua': { text: 'El agua es el primer alimento', sign: 'gota-plato' },
    'stamp-base': { text: 'Otra base: no se suma ni se compara', sign: 'dos-barras' },
    'stamp-cartografiada': { text: 'Área cartografiada: medida sobre los mapas', sign: 'hoja-mapa' },
    'stamp-probabilidad': { text: 'Probabilidades, no áreas urbanizadas confirmadas', sign: 'satelite-mancha' }
  },
  // Insignias y textos fijos (spec §3.2 y base §2.5).
  ui: {
    esquema: 'Esquema',
    conMatiz: 'Con matiz',
    personajes: 'Personajes inventados',
    ejemplo: 'Ejemplo ilustrativo'
  }
};
