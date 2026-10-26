/* CURSO · `retiro`: una quebrada vista desde arriba con franjas en ambas orillas a escala exacta en metros
   (la `scale` de la escena): 10 m, 15 m y 30 m desde la orilla (spec §3.5). La geometría de las franjas es exacta;
   el cauce es ilustrativo. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // draw(ctx, box, o) — o: { scale: {from, to, step, unit}, bands: [{ m, p, label, pattern }], p, t, houses: [{ f, side, p }],
  //   axisP, label, labelP }
  // Devuelve { pxPerM, cy, bankTop, bankBottom }.
  C.retiro = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var sc = o.scale || { from: 0, to: 30, step: 5, unit: 'm' };
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return null;
    var stream = Math.max(14, box.h * 0.06);          // ancho dibujado del cauce (ilustrativo)
    var cy = box.y + box.h / 2;
    var half = (box.h - stream) / 2 - 34;            // espacio por orilla para 0–30 m
    var pxPerM = half / (sc.to - sc.from);
    var top = cy - stream / 2, bottom = cy + stream / 2;
    var a = S.appear('illus', p);
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    // terreno
    S.fill(ctx, S.rectPath(box.x, box.y, box.w, box.h, 6), { role: 'accent-1', alpha: 0.55 });
    // franjas exactas: de la orilla hacia afuera, en ambos lados
    (o.bands || []).slice().sort(function (x, y) { return y.m - x.m; }).forEach(function (b) {
      var bp = b.p == null ? 1 : b.p;
      if (bp <= 0) return;
      var d = b.m * pxPerM;
      ctx.save();
      ctx.globalAlpha *= S.appear('fade', bp).alpha;
      [[top - d, d], [bottom, d]].forEach(function (r) {
        S.fill(ctx, S.rectPath(box.x, r[0], box.w, r[1], 0), { role: 'ground' });
        S.patternFill(ctx, S.rectPath(box.x, r[0], box.w, r[1], 0), b.pattern || 'stripes', { alpha: 0.6 });
        S.stroke(ctx, [[box.x, r[0] === bottom ? bottom + d : top - d], [box.x + box.w, r[0] === bottom ? bottom + d : top - d]], { role: 'ink', width: 2 });
      });
      ctx.restore();
    });
    // cauce ilustrativo
    var pts = [];
    for (var i = 0; i <= 24; i++) pts.push([box.x + box.w * i / 24, cy]);
    S.fill(ctx, S.rectPath(box.x, top, box.w, stream, 0), { role: 'accent-2' });
    S.stroke(ctx, pts, { role: 'paper', alpha: 0.75, width: 1.5, dash: [16, 90], offset: -(S.reduced ? 0 : (o.t || 0)) * 14 });
    // casas a lo largo de la franja
    (o.houses || []).forEach(function (h) {
      var hp = h.p == null ? 1 : h.p;
      if (hp <= 0) return;
      var s = Math.max(18, pxPerM * 6);
      var x = box.x + box.w * h.f;
      var y = h.side > 0 ? bottom + pxPerM * (h.m || 8) + s : top - pxPerM * (h.m || 8);
      S.withAppear(ctx, 'illus', hp, function () { S.building(ctx, { x: x - s / 2, y: y - s, w: s, h: s }, { kind: 'casa' }); });
    });
    ctx.restore();
    // eje exacto de metros en la orilla superior (de la orilla hacia afuera)
    var ap = o.axisP == null ? p : o.axisP;
    if (ap > 0) {
      var ax = box.x + box.w - 18;
      S.stroke(ctx, [[ax, top], [ax, top - (sc.to - sc.from) * pxPerM]], { role: 'ink', width: 1.6, p: ap });
      var n = Math.round((sc.to - sc.from) / sc.step);
      for (var k = 0; k <= n; k++) {
        var v = sc.from + k * sc.step;
        var y = top - (v - sc.from) * pxPerM;
        S.stroke(ctx, [[ax - 6, y], [ax + 6, y]], { role: 'ink', width: 1.6, p: ap });
        if (sc.step * pxPerM >= 18 || k % 2 === 0) S.text(ctx, EEP.util.withUnit(v, sc.unit), { x: ax - 12, y: y + 5, size: 14, align: 'right', role: 'ink', p: ap });
      }
    }
    // rótulos de las franjas
    (o.bands || []).forEach(function (b) {
      if (!b.label || (b.p != null && b.p <= 0)) return;
      var y = top - b.m * pxPerM;
      var m = S.text(ctx, b.label, { size: 16, weight: 700, measureOnly: true });
      var lx = box.x + 14 + (b.labelX || 0);
      ctx.save();
      ctx.globalAlpha *= S.appear('text', b.p == null ? 1 : b.p).alpha;
      ctx.fillStyle = S.role('ground');
      ctx.beginPath(); S.roundRect(ctx, lx - 6, y - 22, m.width + 12, 24, 4); ctx.fill();
      ctx.restore();
      S.text(ctx, b.label, { x: lx, y: y - 5, size: 16, weight: 700, p: b.p == null ? 1 : b.p });
    });
    if (o.label) S.text(ctx, o.label, { x: box.x, y: box.y + box.h + 22, size: 15, role: 'ink-soft', p: o.labelP == null ? p : o.labelP });
    return { pxPerM: pxPerM, cy: cy, top: top, bottom: bottom };
  };
})(typeof window !== 'undefined' ? window : globalThis);
