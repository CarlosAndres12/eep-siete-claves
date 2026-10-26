/* CURSO · `triada` (spec §3.5): tres círculos que se cruzan, rotulados «Amenaza», «Exposición» y «Vulnerabilidad»,
   con las tramas de spec §3.2 (`dots`, `stripes`, `crosses`) y «Riesgo» escrito en el cruce de los tres. Insignia
   «Esquema». Los rótulos vienen de la escena (env.text); este archivo no lleva textos en pantalla. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;
  var PATTERNS = ['dots', 'stripes', 'crosses'];

  // Círculo como polilínea cerrada (para que el trazo se dibuje progresivamente), empezando en un ángulo distinto por círculo.
  function ring(cx, cy, r, i) {
    var pts = [], a0 = -Math.PI / 2 + i * 2.1;
    for (var k = 0; k <= 72; k++) { var a = a0 + k / 72 * Math.PI * 2; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
    return pts;
  }

  // Geometría: centro (cx, cy) y radio r de cada círculo; los tres centros forman un triángulo.
  function geom(box) {
    var r = Math.min(box.w / 3.1, box.h / 2.95);
    var cx = box.x + box.w / 2, cy = box.y + box.h / 2 + r * 0.06;
    var d = r * 0.62;
    return {
      r: r, cx: cx, cy: cy,
      c: [
        [cx - d * 0.866, cy - d * 0.5],   // Amenaza: arriba a la izquierda
        [cx + d * 0.866, cy - d * 0.5],   // Exposición: arriba a la derecha
        [cx, cy + d]                      // Vulnerabilidad: abajo
      ]
    };
  }

  // draw(ctx, box, o) — o: { labels: [3], center (texto «Riesgo»), p (los tres círculos se dibujan en orden),
  //   emph: [0–1 ×3], centerP, labelSize, onDark, badge (texto o false), badgeP, fillP }
  // Devuelve la geometría { r, cx, cy, c }.
  C.triada = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var g = geom(box);
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return g;
    var line = o.onDark ? 'on-dark' : 'ink';
    var emph = o.emph || [];
    var labels = o.labels || [];
    var ls = o.labelSize || Math.max(15, Math.round(g.r * 0.19));
    // rellenos con trama
    g.c.forEach(function (c, i) {
      var pi = E.clamp(p * 3 - i);
      if (pi <= 0) return;
      var fp = E.clamp((pi - 0.55) / 0.45) * (o.fillP == null ? 1 : o.fillP);
      var path = S.circlePath(c[0], c[1], g.r);
      if (fp > 0) {
        ctx.save();
        ctx.globalAlpha *= fp;
        if (!o.onDark) S.fill(ctx, path, { role: 'accent-8', alpha: 0.35 + 0.65 * (emph[i] || 0) });
        S.patternFill(ctx, path, PATTERNS[i], { onDark: o.onDark, alpha: 0.75 + 0.25 * (emph[i] || 0) });
        ctx.restore();
      }
    });
    // cruce de los tres: se llena con «Riesgo»
    var cp = o.centerP || 0;
    if (cp > 0 && p >= 1) {
      ctx.save();
      ctx.globalAlpha *= E.clamp(cp * 2);
      g.c.forEach(function (c) { ctx.beginPath(); ctx.arc(c[0], c[1], g.r, 0, Math.PI * 2); ctx.clip(); });
      S.fill(ctx, S.rectPath(g.cx - g.r * 2, g.cy - g.r * 2, g.r * 4, g.r * 4, 0), { role: 'accent-5' });
      ctx.restore();
    }
    // contornos: cada círculo se traza en orden; el enfatizado, más grueso
    g.c.forEach(function (c, i) {
      var pi = E.clamp(p * 3 - i);
      if (pi <= 0) return;
      S.stroke(ctx, ring(c[0], c[1], g.r, i), { role: line, width: 2 + 1.6 * (emph[i] || 0), p: pi });
    });
    // rótulos fuera de los círculos, sobre una barra de fondo
    var spots = [
      [g.c[0][0] - g.r * 0.55, g.c[0][1] - g.r - 18, 'right'],
      [g.c[1][0] + g.r * 0.55, g.c[1][1] - g.r - 18, 'left'],
      [g.c[2][0], g.c[2][1] + g.r + 30, 'center']
    ];
    labels.forEach(function (txt, i) {
      if (!txt) return;
      var pi = E.clamp(p * 3 - i - 0.4);
      if (pi <= 0) return;
      var m = S.text(ctx, txt, { size: ls, weight: 700, measureOnly: true });
      var sp = spots[i];
      var x0 = sp[2] === 'right' ? sp[0] - m.width : sp[2] === 'left' ? sp[0] : sp[0] - m.width / 2;
      ctx.save();
      ctx.globalAlpha *= S.appear('text', pi).alpha;
      ctx.fillStyle = S.role(emph[i] ? 'accent-9' : 'ground');
      ctx.beginPath(); S.roundRect(ctx, x0 - 8, sp[1] - ls * 1.05, m.width + 16, ls * 1.5, 4); ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = S.role('ink'); ctx.stroke();
      ctx.restore();
      S.text(ctx, txt, { x: x0, y: sp[1], size: ls, weight: 700, role: 'ink', p: pi });
    });
    if (o.center && cp > 0 && p >= 1) {
      var cs = Math.max(15, Math.round(g.r * 0.17));
      var cm = S.text(ctx, o.center, { size: cs, weight: 700, measureOnly: true });
      var ccy = g.cy - g.r * 0.02;
      ctx.save();
      ctx.globalAlpha *= S.appear('text', cp).alpha;
      ctx.fillStyle = S.role('ground');
      ctx.beginPath(); S.roundRect(ctx, g.cx - cm.width / 2 - 8, ccy - cs * 0.8, cm.width + 16, cs * 1.6, 4); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = S.role('ink'); ctx.stroke();
      ctx.restore();
      S.text(ctx, o.center, { x: g.cx, y: ccy, size: cs, weight: 700, align: 'center', baseline: 'middle', p: cp });
    }
    if (o.badge !== false) {
      S.mark(ctx, 'badge', { x: box.x + box.w, y: box.y + box.h - 30 }, {
        text: o.badge || EEP.data.site.ui.esquema, variant: 'state', glyph: 'g-esquema', align: 'right', size: 14,
        p: o.badgeP == null ? p : o.badgeP
      });
    }
    return g;
  };
  C.triadaGeom = geom;
})(typeof window !== 'undefined' ? window : globalThis);
