/* Geometría exacta de gráficos (base §5.1): las barras empiezan en cero, comparten escala y llevan su cifra exacta.
   El estilo vive en el trazo y el relleno, nunca en la geometría. */
(function (root) {
  'use strict';
  var EEP = root.EEP;

  // Convierte una cifra escrita en formato del sitio («9,11 m³/s», «1.358,25 ha») en número.
  function parse(str) {
    var m = String(str).match(/[−-]?\d{1,3}(?:\.\d{3})*(?:,\d+)?|[−-]?\d+(?:,\d+)?/);
    if (!m) return NaN;
    return parseFloat(m[0].replace(/−/g, '-').replace(/\./g, '').replace(',', '.'));
  }

  // Barras horizontales. o: { x, y, w, h, items: [{ label, figure, parte, escala }], p, labelW, valueW }
  // Cada barra: relleno del color de su escala, contorno ink de 2 px, ficha de escala en su base y valor exacto al final.
  function hbars(ctx, o) {
    var S = EEP.style, cards = EEP.engine.cards, leg = EEP.engine.legend, ease = EEP.engine.ease;
    var items = o.items.map(function (it) {
      var f = cards.fig(it.figure);
      var pt = f.partes[it.parte || 0];
      return { label: it.label, value: parse(pt.valor), display: pt.valor, escala: it.escala || f.escala };
    });
    var max = o.max || Math.max.apply(null, items.map(function (i) { return i.value; }));
    var labelW = o.labelW || 190, valueW = o.valueW || 150;
    var chipW = 150;
    var x0 = o.x + labelW + chipW + 14, x1 = o.x + o.w - valueW;
    var span = x1 - x0;
    var n = items.length;
    var rowH = o.h / n, barH = Math.min(46, rowH * 0.56);
    var p = o.p == null ? 1 : o.p;
    // eje en cero
    S.stroke(ctx, [[x0, o.y], [x0, o.y + o.h]], { role: 'ink', width: 2, p: Math.min(1, p * 3) });
    items.forEach(function (it, i) {
      var pi = ease.clamp(p * n - i * 0.7);
      if (pi <= 0) return;
      var cy = o.y + rowH * (i + 0.5);
      var len = span * it.value / max; // exacto
      S.text(ctx, it.label, { x: o.x, y: cy, size: 22, weight: 700, baseline: 'middle', p: pi, maxWidth: labelW - 10 });
      cards.chip(ctx, it.escala, o.x + labelW, cy - 15, { alpha: S.appear('fade', pi).alpha });
      // la barra se revela de izquierda a derecha, pero su cifra solo aparece cuando está completa
      var reveal = S.reduced ? 1 : ease.out(ease.clamp(pi * 1.4));
      var fl = leg.fillFor(it.escala);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, cy - barH / 2 - 3, len * reveal + 3, barH + 6);
      ctx.clip();
      ctx.beginPath(); ctx.rect(x0, cy - barH / 2, len, barH);
      if (fl.color) { ctx.fillStyle = fl.color; ctx.fill(); }
      else S.patternFill(ctx, S.rectPath(x0, cy - barH / 2, len, barH, 0), fl.pattern, { ground: 'ground' });
      ctx.lineWidth = 2; ctx.strokeStyle = S.role('ink'); ctx.stroke();
      ctx.restore();
      if (reveal >= 0.999) S.text(ctx, it.display, { x: x0 + len + 12, y: cy, size: 24, weight: 700, baseline: 'middle' });
    });
    return { x: o.x, y: o.y, w: o.w, h: o.h };
  }

  // Barras verticales con la misma regla. o: { x, y, w, h, items, p }
  function vbars(ctx, o) {
    var S = EEP.style, cards = EEP.engine.cards, leg = EEP.engine.legend, ease = EEP.engine.ease;
    var items = o.items.map(function (it) {
      var f = cards.fig(it.figure);
      var pt = f.partes[it.parte || 0];
      return { label: it.label, value: parse(pt.valor), display: pt.valor, escala: it.escala || f.escala };
    });
    var max = o.max || Math.max.apply(null, items.map(function (i) { return i.value; }));
    var base = o.y + o.h - 60, top = o.y + 40;
    var colW = o.w / items.length, barW = Math.min(110, colW * 0.5);
    var p = o.p == null ? 1 : o.p;
    S.stroke(ctx, [[o.x, base], [o.x + o.w, base]], { role: 'ink', width: 2 });
    items.forEach(function (it, i) {
      var pi = ease.clamp(p * items.length - i * 0.7);
      if (pi <= 0) return;
      var cx = o.x + colW * (i + 0.5);
      var hgt = (base - top) * it.value / max;
      var reveal = S.reduced ? 1 : ease.out(ease.clamp(pi * 1.4));
      var fl = leg.fillFor(it.escala);
      ctx.save();
      ctx.beginPath(); ctx.rect(cx - barW / 2 - 3, base - hgt * reveal - 3, barW + 6, hgt * reveal + 3); ctx.clip();
      ctx.beginPath(); ctx.rect(cx - barW / 2, base - hgt, barW, hgt);
      if (fl.color) { ctx.fillStyle = fl.color; ctx.fill(); }
      ctx.lineWidth = 2; ctx.strokeStyle = S.role('ink'); ctx.stroke();
      ctx.restore();
      if (reveal >= 0.999) S.text(ctx, it.display, { x: cx, y: base - hgt - 12, size: 22, weight: 700, align: 'center' });
      S.text(ctx, it.label, { x: cx, y: base + 30, size: 18, align: 'center', p: pi, maxWidth: colW - 10 });
    });
    return { x: o.x, y: o.y, w: o.w, h: o.h };
  }

  // Eje o recta numérica que no es una cifra: los valores vienen de `scale` y los formatea el motor.
  // o: { x, y, w, scale: { from, to, step, unit }, p, role }
  function axis(ctx, o) {
    var S = EEP.style, U = EEP.util;
    var sc = o.scale;
    var p = o.p == null ? 1 : o.p;
    S.stroke(ctx, [[o.x, o.y], [o.x + o.w, o.y]], { role: o.role || 'ink', width: 1.6, p: p });
    var n = Math.round((sc.to - sc.from) / sc.step);
    for (var i = 0; i <= n; i++) {
      var v = sc.from + i * sc.step;
      var x = o.x + o.w * (v - sc.from) / (sc.to - sc.from);
      var pi = EEP.engine.ease.clamp(p * (n + 1) - i);
      if (pi <= 0) continue;
      S.stroke(ctx, [[x, o.y - 6], [x, o.y + 6]], { role: o.role || 'ink', width: 1.6 });
      S.text(ctx, U.withUnit(v, i === n ? sc.unit : ''), { x: x, y: o.y + 26, size: o.size || 16, align: 'center', role: o.labelRole || 'ink-soft', p: pi });
    }
    return { pos: function (v) { return o.x + o.w * (v - sc.from) / (sc.to - sc.from); } };
  }

  EEP.engine.charts = { parse: parse, hbars: hbars, vbars: vbars, axis: axis };
})(typeof window !== 'undefined' ? window : globalThis);
