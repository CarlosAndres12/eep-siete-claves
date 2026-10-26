/* CURSO · signos de las tres escalas (spec §3.1) y el signo `escalas` (spec §3.5). Solo compone la API del estilo. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // Perfil de valle: dos laderas que bajan a un fondo plano. (x, y) = centro de la base; s = ancho.
  function profile(ctx, x, y, s, r) {
    var S = EEP.style;
    S.stroke(ctx, [[x - s * 0.5, y - s * 0.55], [x - s * 0.2, y - s * 0.08], [x + s * 0.2, y - s * 0.08], [x + s * 0.5, y - s * 0.55]],
      { role: r || 'ink', width: Math.max(1.4, s * 0.07) });
  }

  // legendSign(ctx, id, x, y, size): el signo de cada ítem, en `ink`.
  C.legendSign = function (ctx, id, x, y, s, r) {
    var S = EEP.style;
    r = r || 'ink';
    var w = Math.max(1.3, s * 0.07);
    if (id === 'region') {
      S.stroke(ctx, [[x - s * 0.55, y - s * 0.5], [x - s * 0.35, y - s * 0.9], [x - s * 0.1, y - s * 0.6], [x + s * 0.12, y - s * 1.0], [x + s * 0.32, y - s * 0.62], [x + s * 0.52, y - s * 0.88], [x + s * 0.62, y - s * 0.5]], { role: r, width: w });
    }
    profile(ctx, x, y, s, r);
    if (id === 'distrito') {
      ctx.save(); ctx.fillStyle = S.role(r);
      ctx.beginPath(); ctx.arc(x, y - s * 0.08, Math.max(2, s * 0.08), 0, Math.PI * 2); ctx.fill(); ctx.restore();
    } else if (id === 'valle') {
      var pts = [];
      for (var i = 0; i <= 8; i++) pts.push([x - s * 0.2 + i * s * 0.05, y - s * 0.16 + Math.sin(i * 1.4) * s * 0.03]);
      S.stroke(ctx, pts, { role: r, width: Math.max(1.2, s * 0.05) });
      ctx.save(); ctx.fillStyle = S.role(r);
      for (var k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(x - s * 0.16 + k * s * 0.08, y - s * 0.02, Math.max(1, s * 0.03), 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    } else if (id === 'region') {
      [[-0.45, -0.25], [0, -0.42], [0.45, -0.25]].forEach(function (d) {
        var sx = x + d[0] * s * 1.1, sy = y + d[1] * s - s * 0.1;
        var ex = x + d[0] * s * 0.35, ey = y - s * 0.15;
        S.stroke(ctx, [[sx, sy], [ex, ey]], { role: r, width: Math.max(1.1, s * 0.045) });
        var a = Math.atan2(ey - sy, ex - sx), hl = s * 0.09;
        S.stroke(ctx, [[ex - Math.cos(a - 0.5) * hl, ey - Math.sin(a - 0.5) * hl], [ex, ey], [ex - Math.cos(a + 0.5) * hl, ey - Math.sin(a + 0.5) * hl]], { role: r, width: Math.max(1.1, s * 0.045) });
      });
    }
  };

  // Ítem de leyenda completo: forma con color de ranura y contorno ink de 2 px, signo y etiqueta.
  C.legendItem = function (ctx, id, x, y, o) {
    o = o || {};
    var S = EEP.style, leg = EEP.engine.legend;
    var it = leg.item(id);
    if (!it) return 0;
    var fl = leg.fillFor(id);
    var sz = o.size || 44;
    ctx.save();
    ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    ctx.beginPath(); S.roundRect(ctx, x, y, sz, sz, 6);
    if (fl.color) { ctx.fillStyle = fl.color; ctx.fill(); }
    else S.patternFill(ctx, S.rectPath(x, y, sz, sz, 6), fl.pattern, { ground: 'ground' });
    ctx.lineWidth = 2; ctx.strokeStyle = S.role('ink'); ctx.stroke();
    C.legendSign(ctx, id, x + sz + 30, y + sz - 6, sz * 0.8);
    S.text(ctx, o.short ? it.short : it.label, { x: x + sz + 66, y: y + sz / 2, size: o.textSize || 20, weight: 700, baseline: 'middle', role: o.textRole || 'ink' });
    ctx.restore();
    return sz;
  };

  // Signo `escalas`: tres marcos redondeados anidados, cada uno con su ficha de leyenda.
  // box: { x, y, w, h }; o: { p, focus: id }
  C.escalas = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, ease = EEP.engine.ease, cards = EEP.engine.cards;
    var ids = ['region', 'valle', 'distrito'];
    var p = o.p == null ? 1 : o.p;
    ids.forEach(function (id, i) {
      var pi = ease.clamp(p * 3 - i);
      if (pi <= 0) return;
      var inset = i * Math.min(box.w, box.h) * 0.17;
      var bx = box.x + inset, by = box.y + inset * 0.9, bw = box.w - inset * 2, bh = box.h - inset * 1.8;
      var rev = S.appear('line', pi).reveal;
      S.rectStrokeReveal(ctx, bx, by, bw, bh, 18, { width: o.focus && o.focus !== id ? 1.4 : 2.2, role: 'ink' }, rev);
      if (pi > 0.5) cards.chip(ctx, id, bx + 14, by + 12, { alpha: S.appear('fade', (pi - 0.5) * 2).alpha });
    });
    return box;
  };
})(typeof window !== 'undefined' ? window : globalThis);
