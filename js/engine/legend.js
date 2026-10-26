/* Colores núcleo de la leyenda (Okabe–Ito) y su asignación a las ranuras (base §1.5). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var CORE = {
    'blue': '#0072B2',
    'vermillion': '#D55E00',
    'bluish green': '#009E73',
    'reddish purple': '#CC79A7',
    'sky blue': '#56B4E9',
    'orange': '#E69F00',
    'yellow': '#F0E442'
  };

  function order() {
    var t = EEP.style.tokens || {};
    var ex = t.legendExclude || [];
    return (t.legendOrder || Object.keys(CORE)).filter(function (n) { return ex.indexOf(n) < 0 && CORE[n]; });
  }

  // Color de la ranura k (1…n); null si no hay color (se usa `ink` con trama).
  function slotColor(k) {
    var o = order();
    var name = o[k - 1];
    return name ? CORE[name] : null;
  }

  var PATTERNS = ['dots', 'stripes', 'crosses', 'checks', 'waves', 'grid'];

  function item(id) {
    var list = (EEP.data.legend || []);
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  // Estilo de relleno para un ítem: { color, pattern }
  function fillFor(id) {
    var it = item(id);
    if (!it) return { color: null, pattern: null };
    var c = slotColor(it.slot);
    if (c) return { color: c, pattern: null, item: it };
    return { color: null, pattern: PATTERNS[(it.slot - order().length - 1) % PATTERNS.length], item: it };
  }

  EEP.engine.legend = {
    CORE: CORE,
    order: order,
    slotColor: slotColor,
    item: item,
    fillFor: fillFor
  };
})(typeof window !== 'undefined' ? window : globalThis);
