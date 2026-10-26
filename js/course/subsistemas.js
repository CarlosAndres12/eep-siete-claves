/* CURSO · `subsistemas`: cinco bloques redondeados que pueden moverse a un centro rotulado «Núcleo» (spec §3.5).
   Las etiquetas y el rótulo del centro vienen de la escena. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // draw(ctx, box, { labels: [5 textos], p, core: [índices], coreP, coreLabel, labelSize }) → { blocks, core }
  // Al inicio los bloques forman una fila; con coreP los del núcleo se apilan al centro dentro de un marco y los
  // demás se reparten a los lados.
  C.subsistemas = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var labels = o.labels || [];
    var n = Math.max(5, labels.length);
    var p = o.p == null ? 1 : o.p;
    var core = o.core || [0, 1];
    var cp = E.inOut(E.clamp(o.coreP || 0));
    var gap = 16;
    var bw = (box.w - gap * (n - 1)) / n, bh = Math.min(104, box.h * 0.4);
    var cx = box.x + box.w / 2, cy = box.y + box.h / 2;
    var roles = ['accent-1', 'accent-2', 'accent-3', 'accent-4', 'accent-6'];
    // posiciones finales
    var finals = {}, others = [];
    for (var i = 0; i < n; i++) if (core.indexOf(i) < 0) others.push(i);
    var fw = Math.min(300, bw * 1.25);
    var frame = { x: cx - fw / 2 - 18, y: cy - bh - gap / 2 - 40, w: fw + 36, h: bh * 2 + gap + 56 };
    core.forEach(function (k, j) { finals[k] = { x: cx - fw / 2, y: cy - bh - gap / 2 + j * (bh + gap) + 10, w: fw }; });
    var left = others.filter(function (k, j) { return j % 2 === 0; }), right = others.filter(function (k, j) { return j % 2 === 1; });
    [left, right].forEach(function (col, side) {
      col.forEach(function (k, j) {
        var tot = col.length * bh + (col.length - 1) * gap;
        finals[k] = { x: side ? box.x + box.w - bw : box.x, y: cy - tot / 2 + j * (bh + gap) + 10, w: bw };
      });
    });
    var blocks = [];
    if (p <= 0) return { blocks: blocks, core: frame };
    if (cp > 0) {
      S.fill(ctx, S.rectPath(frame.x, frame.y, frame.w, frame.h, 22), { role: 'accent-8', alpha: 0.6 * cp });
      S.stroke(ctx, S.rectPath(frame.x, frame.y, frame.w, frame.h, 22), { role: 'ink', width: 2, dash: [8, 6], p: cp });
      if (o.coreLabel) S.text(ctx, o.coreLabel, { x: cx, y: frame.y + 28, size: 20, weight: 700, align: 'center', face: 'display', p: cp });
      others.forEach(function (k) {
        var f = finals[k], toLeft = f.x < cx;
        S.stroke(ctx, [[toLeft ? f.x + f.w : f.x, f.y + bh / 2], [toLeft ? frame.x : frame.x + frame.w, f.y + bh / 2]], { role: 'ink', width: 1.4, p: cp });
      });
    }
    for (var k = 0; k < n; k++) {
      var pi = E.clamp(p * (n + 1) - k);
      var x0 = box.x + k * (bw + gap), y0 = cy - bh / 2;
      var f = finals[k];
      var b = { x: E.lerp(x0, f.x, cp), y: E.lerp(y0, f.y, cp), w: E.lerp(bw, f.w, cp), h: bh };
      blocks.push(b);
      if (pi <= 0) continue;
      (function (b, k, pi) {
        S.withAppear(ctx, 'illus', pi, function () {
          S.fill(ctx, S.rectPath(b.x, b.y, b.w, b.h, 18), { role: roles[k % roles.length] });
          S.stroke(ctx, S.rectPath(b.x, b.y, b.w, b.h, 18), { role: 'ink', width: 1.8 });
        });
        if (labels[k]) S.text(ctx, labels[k], { x: b.x + b.w / 2, y: b.y + b.h / 2, size: o.labelSize || 17, weight: 700, align: 'center', baseline: 'middle', maxWidth: b.w - 24, lineHeight: 1.15, p: pi });
      })(b, k, pi);
    }
    return { blocks: blocks, core: frame };
  };
})(typeof window !== 'undefined' ? window : globalThis);
