/* CURSO · `valle-corte`: corte esquemático y simétrico del Valle de Aburrá (spec §3.5). Nunca un mapa.
   Desde cada borde hacia adentro: cresta con bosque, franja rural con parcelas y casas, borde urbano-rural,
   ladera construida y fondo del valle con bloques densos y el río en el centro. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // Geometría del perfil (fracciones del ancho) para una caja dada.
  function geom(box) {
    var x = box.x, w = box.w, y = box.y, h = box.h;
    var base = y + h;
    function px(f) { return x + w * f; }
    // alturas relativas: cresta 1, franja rural 0.75, borde 0.55, ladera 0.32, fondo 0.06
    var prof = [[0, 0.9], [0.06, 1], [0.12, 0.92], [0.2, 0.74], [0.27, 0.6], [0.33, 0.42], [0.39, 0.2], [0.44, 0.07], [0.5, 0.05]];
    var pts = prof.map(function (p) { return [px(p[0]), base - h * p[1]]; });
    var right = prof.slice(0, -1).reverse().map(function (p) { return [px(1 - p[0]), base - h * p[1]]; });
    return { pts: pts.concat(right), base: base, px: px, hAt: function (f) {
      var ff = f > 0.5 ? 1 - f : f;
      for (var i = 1; i < prof.length; i++) if (ff <= prof[i][0]) {
        var a = prof[i - 1], b = prof[i], k = (ff - a[0]) / (b[0] - a[0]);
        return base - h * (a[1] + (b[1] - a[1]) * k);
      }
      return base - h * 0.05;
    } };
  }

  // Zonas (fracciones del ancho, lado izquierdo; el derecho es simétrico).
  var ZONES = {
    cresta: [0, 0.16], rural: [0.16, 0.27], borde: [0.27, 0.29], ladera: [0.29, 0.43], fondo: [0.43, 0.5]
  };

  // draw(ctx, box, o) — o: { p, seed, labels: { corregimientos, borde, ladera, fondo, rio }, fill: { ladera: 'dots', corregimientos: 'stripes' },
  //   highlight: 'rural', badge: 'Esquema', t, houses (0–1), roofs: [...], hide: {} }
  C.valleCorte = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var g = geom(box);
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return g;
    var a = S.appear('illus', p);
    var r = EEP.engine.rng(o.seed || 17);
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(0, a.dy);
    // terreno
    S.fill(ctx, { pts: g.pts.concat([[box.x + box.w, g.base], [box.x, g.base]]), closed: true }, { role: 'accent-6' });
    // flanco sombreado de la ladera derecha
    var rp = g.pts.slice(Math.floor(g.pts.length / 2));
    S.fill(ctx, { pts: rp.concat([[box.x + box.w, g.base], [g.px(0.5), g.base]]), closed: true }, { role: 'accent-7', alpha: 0.35 });
    // fondo del valle (franja plana) y ladera construida, en tono de suelo
    [-1, 1].forEach(function (side) {
      function fx(f) { return side < 0 ? g.px(f) : g.px(1 - f); }
      // cresta con bosque
      for (var i = 0; i < 5; i++) {
        var f = 0.015 + i * 0.03;
        S.tree(ctx, { x: fx(f), y: g.hAt(f) + 4, size: box.h * (0.2 + r() * 0.06), seed: i + (side > 0 ? 10 : 0), kind: i % 2 ? 'dense' : 'round', t: o.t, stipple: box.h > 200 });
      }
      // franja rural: parcelas y casas dispersas
      for (var k = 0; k < 4; k++) {
        var f1 = 0.165 + k * 0.026, f2 = f1 + 0.022;
        var y1 = g.hAt(f1), y2 = g.hAt(f2);
        var roleP = ['accent-1', 'accent-4', 'accent-9', 'accent-1'][k];
        S.fill(ctx, [[fx(f1), y1 + 2], [fx(f2), y2 + 2], [fx(f2), y2 + 10], [fx(f1), y1 + 10]], { role: roleP });
      }
      var hs = box.h * 0.07;
      S.building(ctx, { x: fx(0.215) - hs / 2, y: g.hAt(0.215) - hs + 2, w: hs, h: hs }, { kind: 'casa' });
      // ladera construida
      for (var b = 0; b < 5; b++) {
        var fb = 0.3 + b * 0.027;
        var bh = box.h * (0.08 + r() * 0.05), bw = box.w * 0.018;
        S.building(ctx, { x: fx(fb) - bw / 2, y: g.hAt(fb) - bh + 3, w: bw, h: bh }, { kind: 'bloque', seed: b + side * 7 });
      }
      // fondo: bloques densos
      for (var d = 0; d < 3; d++) {
        var fd = 0.435 + d * 0.018;
        var dh = box.h * (0.18 + r() * 0.12), dw = box.w * 0.016;
        S.building(ctx, { x: fx(fd) - dw / 2, y: g.base - box.h * 0.05 - dh, w: dw, h: dh }, { kind: 'torre', seed: d + side * 3 });
      }
    });
    // río en el centro
    var rw = Math.max(6, box.w * 0.012);
    S.fill(ctx, S.rectPath(g.px(0.5) - rw, g.base - box.h * 0.06, rw * 2, box.h * 0.06 + 1, 0), { role: 'accent-2' });
    ctx.restore();

    // tramas de zonas (esquema): ladera con `dots`, corregimientos con `stripes`
    var fills = o.fill || {};
    Object.keys(fills).forEach(function (zone) {
      var fp = fills[zone + 'P'] == null ? 1 : fills[zone + 'P'];
      if (zone.slice(-1) === 'P' || fp <= 0) return;
      var range = zone === 'corregimientos' ? [0, 0.27] : ZONES[zone];
      if (!range) return;
      [-1, 1].forEach(function (side) {
        var pts = [];
        for (var f = range[0]; f <= range[1] + 1e-6; f += 0.01) pts.push([side < 0 ? g.px(f) : g.px(1 - f), g.hAt(f) - 2]);
        for (var f2 = range[1]; f2 >= range[0] - 1e-6; f2 -= 0.01) pts.push([side < 0 ? g.px(f2) : g.px(1 - f2), g.hAt(f2) + box.h * 0.12]);
        ctx.save(); ctx.globalAlpha *= fp * a.alpha;
        S.mark(ctx, 'pattern', {}, { path: { pts: pts, closed: true }, variant: fills[zone], ground: false, outline: true });
        ctx.restore();
      });
    });

    // etiquetas
    var L = o.labels || {};
    var lab = function (txt, f, dy, lp) {
      if (!txt) return;
      var x = g.px(f), y = g.hAt(f) - (dy || 40);
      var m = S.text(ctx, txt, { size: o.labelSize || 18, weight: 700, measureOnly: true });
      var bx = Math.max(box.x, Math.min(box.x + box.w - m.width - 16, x - m.width / 2 - 8));
      ctx.save(); ctx.globalAlpha *= S.appear('text', lp == null ? 1 : lp).alpha;
      ctx.fillStyle = S.role('ground'); ctx.beginPath(); S.roundRect(ctx, bx, y - 20, m.width + 16, 28, 4); ctx.fill();
      ctx.restore();
      S.text(ctx, txt, { x: bx + 8, y: y, size: o.labelSize || 18, weight: 700, p: lp });
    };
    var LP = o.labelP || {};
    lab(L.corregimientos, 0.1, box.h * 0.32, LP.corregimientos);
    lab(L.borde, 0.28, box.h * 0.28, LP.borde);
    lab(L.ladera, 0.36, box.h * 0.3, LP.ladera);
    lab(L.fondo, 0.5, box.h * 0.55, LP.fondo);
    lab(L.rio, 0.5, -box.h * 0.0 + 4 - box.h * 0.0 + 16, LP.rio);
    if (L.laderaR) lab(L.laderaR, 0.64, box.h * 0.3, LP.ladera);
    if (o.badge !== false) S.mark(ctx, 'badge', { x: box.x + box.w - 8, y: box.y - 4 }, { text: o.badge || EEP.data.site.ui.esquema, variant: 'state', glyph: 'g-esquema', align: 'right', size: 14, p: p });
    return g;
  };
  C.valleCorteGeom = geom;
})(typeof window !== 'undefined' ? window : globalThis);
