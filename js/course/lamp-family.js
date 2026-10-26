/* CURSO · la familia de la lámpara (spec §3.3), descrita por función y partes; style S7 la dibuja.
   `clasificador-coberturas`, `arboles-decision`, `optimizador` (V1) y `panel-con-ia` (V9). Nunca rostro ni cuerpo. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // Clasificador de coberturas: la lámpara sobre una pila de tarjetas de entrada; su luz las convierte en una tira
  // de salida de celdas etiquetadas. o: { x, y (base), size, p, cards: [etiquetas], cardsP, cells: [etiquetas], cellsP, light }
  C.clasificador = function (ctx, o) {
    var S = EEP.style, E = EEP.engine.ease;
    var s = o.size || 140;
    var lamp = S.machine(ctx, 'lamp', { x: o.x, y: o.y, size: s, p: o.p, light: o.light == null ? 1 : o.light, reach: s * 0.62 });
    var cards = o.cards || [];
    var cx = o.x + s * 0.36, cy = o.y - s * 0.16;
    cards.forEach(function (lab, i) {
      var pi = E.clamp((o.cardsP == null ? 1 : o.cardsP) * cards.length - i);
      if (pi <= 0) return;
      S.machine(ctx, 'card', { x: cx - 4 + i * 6, y: cy - i * 8, w: s * 0.5, h: s * 0.14, p: pi, kind: 'tile' });
    });
    if (o.cells && o.cells.length) S.machine(ctx, 'strip', { x: o.stripX == null ? o.x - s * 0.2 : o.stripX, y: o.stripY == null ? o.y + 20 : o.stripY, cells: o.cells, p: o.cellsP, cw: o.cw || 150, ch: o.ch || 46, vertical: o.vertical });
    return lamp;
  };

  // Árboles de decisión: fila de cinco glifos pequeños, cada uno con una flecha corta al siguiente.
  // o: { x, y, w, p, redraw (0–1, leve cambio de forma) }
  C.arbolesDecision = function (ctx, o) {
    var S = EEP.style, E = EEP.engine.ease;
    var n = 5, step = o.w / n;
    for (var i = 0; i < n; i++) {
      var pi = E.clamp((o.p == null ? 1 : o.p) * n - i);
      if (pi <= 0) continue;
      var x = o.x + step * (i + 0.5), y = o.y;
      var sp = 16 + (o.redraw || 0) * (i % 2 ? 4 : -3);
      var pts = [[x, y - 30], [x - sp, y], [x, y - 30], [x + sp, y], [x - sp, y], [x - sp - 9, y + 26], [x - sp, y], [x - sp + 9, y + 26], [x + sp, y], [x + sp + 9, y + 26]];
      for (var k = 0; k < pts.length; k += 2) S.mapLine(ctx, [pts[k], pts[k + 1]], { p: pi });
      [[x, y - 30], [x - sp, y], [x + sp, y]].forEach(function (n0) {
        ctx.save(); ctx.globalAlpha *= pi; ctx.strokeStyle = S.role('machine-line'); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(n0[0], n0[1], 4, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      });
      if (i < n - 1) {
        var ax = x + step * 0.32, bx = x + step * 0.68;
        S.mapLine(ctx, [[ax, y - 4], [bx, y - 4]], { p: E.clamp(pi * 2 - 1) });
        S.mapLine(ctx, [[bx - 7, y - 9], [bx, y - 4], [bx - 7, y + 1]], { p: E.clamp(pi * 2 - 1) });
      }
    }
  };

  // Optimizador: la lámpara con un pequeño dial en su base que gira un paso por beat. o: { x, y, size, p, step }
  C.optimizador = function (ctx, o) {
    return EEP.style.machine(ctx, 'lamp', { x: o.x, y: o.y, size: o.size || 120, p: o.p, light: o.light == null ? 0.6 : o.light, dial: o.step || 0 });
  };

  // Panel con IA: la lámpara de pie en un extremo de la mesa del panel de expertos, con su luz sobre una pila de
  // tarjetas. Los expertos (extra-3) son personas del polo A y los coloca la escena. o: { x, y (mesa), size, p }
  C.panelConIA = function (ctx, o) {
    var S = EEP.style;
    var s = o.size || 90;
    var lamp = S.machine(ctx, 'lamp', { x: o.x, y: o.y, size: s, p: o.p, light: 1, onPaper: true, reach: s * 0.55, facing: o.facing });
    for (var i = 0; i < 3; i++) S.fill(ctx, S.rectPath(o.x + (o.facing === 'left' ? -s * 0.8 : s * 0.3) + i * 4, o.y - 8 - i * 6, s * 0.42, 8, 1), { role: i % 2 ? 'accent-4' : 'ground-2', p: o.p });
    return lamp;
  };
})(typeof window !== 'undefined' ? window : globalThis);
