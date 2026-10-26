/* CURSO · `carpetas`: tres carpetas cerradas en fila, separadas por reglas verticales, cada una capaz de abrirse un
   poco para mostrar un dibujo pequeño (spec §3.5). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // draw(ctx, box, { labels: [3], open: [0–1, 0–1, 0–1], draw: [fn(ctx, innerBox, p)], p, emph })
  C.carpetas = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var n = 3, cw = box.w / n;
    var out = [];
    for (var i = 0; i < n; i++) {
      var pi = E.clamp((o.p == null ? 1 : o.p) * 3 - i);
      if (pi <= 0) continue;
      var x = box.x + i * cw + cw * 0.12, w = cw * 0.76, h = Math.min(box.h * 0.62, w * 0.75);
      var y = box.y + box.h - h - 40;
      var open = (o.open || [])[i] || 0;
      if (i > 0) S.stroke(ctx, [[box.x + i * cw, box.y], [box.x + i * cw, box.y + box.h]], { role: 'ink-soft', width: 1 });
      S.withAppear(ctx, 'illus', pi, function () {
        // contenido que asoma al abrirse
        if (open > 0 && o.draw && o.draw[i]) {
          ctx.save();
          ctx.beginPath(); ctx.rect(x, y - h * 0.9 * open, w, h * 0.9 * open + 10); ctx.clip();
          o.draw[i](ctx, { x: x + w * 0.08, y: y - h * 0.85 * open, w: w * 0.84, h: h * 0.8 }, open);
          ctx.restore();
        }
        // carpeta: pestaña y cuerpo
        S.fill(ctx, S.rectPath(x, y - 14, w * 0.38, 20, [6, 6, 0, 0]), { role: 'accent-7' });
        S.fill(ctx, S.rectPath(x, y, w, h, 6), { role: 'accent-6' });
        var lid = open * h * 0.18;
        S.fill(ctx, [[x, y + lid], [x + w, y + lid], [x + w, y + h], [x, y + h]], { role: 'accent-9' });
        S.stroke(ctx, [[x + w * 0.1, y + h * 0.6 + lid / 2], [x + w * 0.6, y + h * 0.6 + lid / 2]], { role: 'ink', width: 1.2 });
      });
      if (o.emph === i) S.stroke(ctx, S.rectPath(x - 6, y - 20, w + 12, h + 26, 9), { role: 'ink', width: 2.5, p: pi });
      var lab = (o.labels || [])[i];
      if (lab) S.text(ctx, lab, { x: x + w / 2, y: box.y + box.h - 10, size: 18, weight: 700, align: 'center', maxWidth: cw - 10, p: pi });
      out.push({ x: x, y: y, w: w, h: h });
    }
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);
