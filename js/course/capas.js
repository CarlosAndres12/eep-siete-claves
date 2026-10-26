/* CURSO · `capas`: tres hojas apiladas del panel de mapa, algo desplazadas, cada una con una etiqueta (spec §3.5).
   Los textos de las etiquetas vienen de la escena. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // draw(ctx, box, { labels: [3 textos], p, emph (índice) })
  C.capas = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var labels = o.labels || [];
    var n = Math.max(3, labels.length);
    var sw = box.w * 0.72, sh = box.h * 0.46;
    var out = [];
    for (var i = n - 1; i >= 0; i--) {
      var pi = E.clamp((o.p == null ? 1 : o.p) * n - (n - 1 - i));
      if (pi <= 0) continue;
      var x = box.x + i * (box.w - sw) / (n - 1), y = box.y + (n - 1 - i) * (box.h - sh) / (n - 1);
      var b = { x: x, y: y, w: sw, h: sh };
      S.mapPanel(ctx, b, { p: pi });
      if (o.emph === i) S.stroke(ctx, S.rectPath(x - 4, y - 4, sw + 8, sh + 8, 11), { role: 'ink', width: 2.5, p: pi });
      if (labels[i]) S.mapLabel(ctx, labels[i], x + 14, y + 26, { p: pi, size: 13, maxWidth: sw - 28 });
      out.unshift(b);
    }
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);
