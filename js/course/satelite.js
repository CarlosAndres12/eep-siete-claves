/* CURSO · el satélite: instrumento del polo B, no un sistema de IA (spec §3.3). Una caja pequeña con dos alas de
   paneles y una línea de barrido discontinua, siempre dentro del panel de mapa. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // draw(ctx, { x, y, size, p, scan, scanLength, t })
  C.satelite = function (ctx, o) {
    return EEP.style.machine(ctx, 'satellite', o || {});
  };

  // Paso del satélite a lo largo de una caja (dentro del panel): k 0→1 es la posición horizontal.
  // o: { k, p, size, scan, t, y }
  C.sateliteCruce = function (ctx, box, o) {
    o = o || {};
    var E = EEP.engine.ease;
    var k = E.inOut(o.k == null ? 1 : o.k);
    var x = box.x + 30 + (box.w - 60) * k;
    var y = o.y == null ? box.y + 26 : o.y;
    if (o.path !== false) EEP.style.stroke(ctx, [[box.x + 20, y], [box.x + box.w - 20, y]], { role: 'machine-line', width: 1, dash: [3, 7], alpha: 0.6, p: o.p });
    C.satelite(ctx, { x: x, y: y, size: o.size || 34, p: o.p, scan: o.scan !== false, scanLength: o.scanLength || box.h * 0.6, t: o.t });
    return { x: x, y: y };
  };
})(typeof window !== 'undefined' ? window : globalThis);
