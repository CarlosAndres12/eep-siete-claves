/* CURSO · `ruta-2040`: ocho piedras de paso sobre un camino que sube hacia la derecha, cada una con su etiqueta
   (spec §3.5). Las etiquetas vienen de la escena. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // draw(ctx, box, { labels: [8 textos], p, emph (índice), emphP, labelSize, t }) → [{ x, y, rx, ry }] (centro de cada piedra)
  C.ruta2040 = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var labels = o.labels || [];
    var n = Math.max(8, labels.length);
    var p = o.p == null ? 1 : o.p;
    var step = box.w / n;
    var rx = Math.min(step * 0.36, 52), ry = rx * 0.36;
    var stones = [];
    for (var i = 0; i < n; i++) {
      var f = (i + 0.5) / n;
      stones.push({ x: box.x + step * (i + 0.5), y: box.y + box.h - ry - 70 - f * (box.h - ry * 2 - 90), rx: rx, ry: ry });
    }
    if (p <= 0) return stones;
    // el camino: una línea suave discontinua bajo las piedras
    var path = [[box.x, stones[0].y + 22]].concat(stones.map(function (s0) { return [s0.x, s0.y + 4]; }));
    path.push([box.x + box.w, stones[n - 1].y - 14]);
    S.stroke(ctx, { pts: path, smooth: true }, { role: 'ink-soft', width: 1.6, dash: [6, 7], p: E.clamp(p * 1.4) });
    stones.forEach(function (s0, k) {
      var pi = E.clamp(p * (n + 1) - k - 0.5);
      if (pi <= 0) return;
      var last = k === n - 1;
      S.withAppear(ctx, 'illus', pi, function () {
        S.fill(ctx, S.ellipsePath(s0.x + 3, s0.y + 5, rx, ry), { role: 'ink-soft', alpha: 0.35 });
        S.fill(ctx, S.ellipsePath(s0.x, s0.y, rx, ry), { role: last ? 'accent-1' : 'ground-2' });
        S.stroke(ctx, S.ellipsePath(s0.x, s0.y, rx, ry), { role: 'ink', width: 1.6 });
        if (last) S.sign(ctx, 'arbol', { x: s0.x, y: s0.y - 2, size: 34 });
      });
      if (o.emph === k && (o.emphP || 0) > 0) S.stroke(ctx, S.ellipsePath(s0.x, s0.y, rx + 7, ry + 6), { role: 'ink', width: 2.6, p: o.emphP });
      if (labels[k]) S.text(ctx, labels[k], { x: s0.x, y: s0.y + ry + 22, size: o.labelSize || 16, weight: 700, align: 'center', maxWidth: step - 8, lineHeight: 1.15, p: pi });
    });
    return stones;
  };
})(typeof window !== 'undefined' ? window : globalThis);
