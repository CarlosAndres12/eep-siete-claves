/* CURSO · `corredor`: dos manchas de bosque unidas por un corredor, en dos versiones (spec §3.5):
   «dibujado» (contorno discontinuo dentro del panel de mapa, polo B) y «en el territorio» (franja de árboles con
   vacíos, polo A). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  function blob(cx, cy, rx, ry, seed) {
    var r = EEP.engine.rng(seed);
    var pts = [];
    for (var i = 0; i < 9; i++) {
      var a = i / 9 * Math.PI * 2;
      var k = 0.82 + r() * 0.3;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return { pts: pts, closed: true, smooth: true };
  }

  // drawn(ctx, box, { p }) — dentro de un panel de mapa ya dibujado por quien llama.
  C.corredorDibujado = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var p = o.p == null ? 1 : o.p;
    var cy = box.y + box.h / 2;
    var A = blob(box.x + box.w * 0.18, cy, box.w * 0.14, box.h * 0.3, 3);
    var B = blob(box.x + box.w * 0.82, cy, box.w * 0.14, box.h * 0.3, 5);
    S.mapLine(ctx, A, { p: E.clamp(p * 3) });
    S.mapLine(ctx, B, { p: E.clamp(p * 3 - 0.5) });
    var c = E.clamp(p * 2 - 0.6);
    if (c > 0) {
      var x1 = box.x + box.w * 0.3, x2 = box.x + box.w * 0.7;
      var path = function (dy) { return { pts: [[x1, cy + dy], [box.x + box.w * 0.42, cy + dy - box.h * 0.06], [box.x + box.w * 0.58, cy + dy + box.h * 0.04], [x2, cy + dy]], smooth: true }; };
      S.mapLine(ctx, path(-box.h * 0.08), { dashed: true, p: c });
      S.mapLine(ctx, path(box.h * 0.08), { dashed: true, p: c });
    }
  };

  // territory(ctx, box, { p, t, gaps (0–1 proporción de vacíos), density (0–1) })
  C.corredorTerritorio = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return;
    var r = EEP.engine.rng(o.seed || 41);
    var base = box.y + box.h * 0.78;
    var a = S.appear('illus', p);
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(0, a.dy);
    // suelo
    S.fill(ctx, S.rectPath(box.x, base - 6, box.w, box.h * 0.22 + 6, 4), { role: 'accent-4', alpha: 0.8 });
    // dos manchas densas
    [[0.04, 0.3], [0.7, 0.96]].forEach(function (rg, j) {
      var n = 6;
      for (var i = 0; i < n; i++) {
        var f = rg[0] + (rg[1] - rg[0]) * (i + 0.5) / n;
        S.tree(ctx, { x: box.x + box.w * f, y: base + (i % 2) * 6, size: box.h * (0.36 + r() * 0.1), seed: i + j * 10, kind: i % 3 ? 'round' : 'dense', t: o.t, stipple: false });
      }
    });
    // la franja con vacíos
    var gaps = o.gaps == null ? 0.45 : o.gaps;
    for (var k = 0; k < 9; k++) {
      var f2 = 0.33 + 0.34 * (k + 0.5) / 9;
      if (r() < gaps) continue;
      S.tree(ctx, { x: box.x + box.w * f2, y: base, size: box.h * (0.22 + r() * 0.08), seed: 60 + k, kind: 'scalloped', t: o.t, stipple: false });
    }
    ctx.restore();
  };
})(typeof window !== 'undefined' ? window : globalThis);
