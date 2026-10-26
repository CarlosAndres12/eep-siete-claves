/* CURSO · `muestreo` (spec §3.5): un parche de cobertura cuyo contorno se encoge hacia adentro hasta un contorno
   interior discontinuo, con una malla regular de puntos de muestra solo dentro del contorno interior. Polo A (papel). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // Contorno orgánico como polígono denso (para poder probar si un punto está dentro sin aproximaciones).
  function outline(cx, cy, rx, ry, seed, k) {
    var r = EEP.engine.rng(seed);
    var a1 = r() * 6.28, a2 = r() * 6.28, a3 = r() * 6.28;
    var pts = [];
    for (var i = 0; i < 64; i++) {
      var a = i / 64 * Math.PI * 2;
      var w = 1 + 0.08 * Math.sin(a * 2 + a1) + 0.06 * Math.sin(a * 3 + a2) + 0.04 * Math.sin(a * 5 + a3);
      pts.push([cx + Math.cos(a) * rx * w * k, cy + Math.sin(a) * ry * w * k]);
    }
    return pts;
  }
  function inside(pts, x, y) {
    var c = false;
    for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }

  // draw(ctx, box, o) — o: { p (parche), shrink (0–1: el contorno interior se separa del borde), grid (0–1: malla),
  //   seed, inner (fracción del contorno interior, por defecto 0.68), step (paso de la malla en px) }
  // Devuelve { cx, cy, outer, inner, dots, at(angle, k) } para que la escena coloque personas o puntos extra.
  C.muestreo = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var p = o.p == null ? 1 : o.p;
    var seed = o.seed || 23;
    var cx = box.x + box.w / 2, cy = box.y + box.h / 2, rx = box.w * 0.46, ry = box.h * 0.44;
    var kIn = o.inner || 0.68;
    var outer = outline(cx, cy, rx, ry, seed, 1);
    var innerFinal = outline(cx, cy, rx, ry, seed, kIn);
    var step = o.step || Math.max(18, Math.round(box.w / 13));
    var dots = [];
    var safe = outline(cx, cy, rx, ry, seed, kIn - 0.05);
    var nx = Math.ceil(rx / step), ny = Math.ceil(ry / step);
    for (var j = -ny; j <= ny; j++) {
      for (var i0 = -nx; i0 <= nx; i0++) {
        var gx = cx + i0 * step, gy = cy + j * step;
        if (inside(safe, gx, gy)) dots.push([gx, gy]);
      }
    }
    var geo = {
      cx: cx, cy: cy, outer: outer, inner: innerFinal, dots: dots, step: step,
      at: function (ang, k) { var i = Math.round(((ang % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) / (Math.PI * 2) * 64) % 64; var q = outer[i]; return [cx + (q[0] - cx) * k, cy + (q[1] - cy) * k]; }
    };
    if (p <= 0) return geo;

    var a = S.appear('illus', p);
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(0, a.dy);
    // parche de cobertura
    S.fill(ctx, { pts: outer, closed: true }, { role: 'accent-6' });
    var sh = E.inOut(E.clamp(o.shrink == null ? 0 : o.shrink));
    // franja del borde (donde se mezclan coberturas): tono más oscuro que crece con el encogimiento
    if (sh > 0) {
      var k = 1 - (1 - kIn) * sh;
      var cur = outline(cx, cy, rx, ry, seed, k);
      ctx.save();
      ctx.beginPath();
      outer.forEach(function (q, i) { if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]); });
      ctx.closePath();
      for (var i = cur.length - 1; i >= 0; i--) { if (i === cur.length - 1) ctx.moveTo(cur[i][0], cur[i][1]); else ctx.lineTo(cur[i][0], cur[i][1]); }
      ctx.closePath();
      ctx.fillStyle = S.role('accent-7', 0.45 * sh);
      ctx.fill();
      ctx.restore();
      S.stroke(ctx, { pts: cur, closed: true }, { role: 'ink', width: 2.2, dash: [9, 7] });
    }
    S.stroke(ctx, { pts: outer, closed: true }, { role: 'ink', width: 2.4 });
    ctx.restore();

    // malla regular de puntos, fila por fila
    var gp = o.grid == null ? 0 : o.grid;
    if (gp > 0) {
      var y0 = cy - ry, span = 2 * ry;
      dots.forEach(function (d) {
        var di = E.clamp(gp * 1.6 - (d[1] - y0) / span * 0.6);
        if (di <= 0) return;
        ctx.save();
        ctx.globalAlpha *= S.appear('fade', di).alpha;
        ctx.beginPath(); ctx.arc(d[0], d[1], Math.max(3.5, step * 0.14), 0, Math.PI * 2);
        ctx.fillStyle = S.role('ground'); ctx.fill();
        ctx.lineWidth = 1.6; ctx.strokeStyle = S.role('ink'); ctx.stroke();
        ctx.restore();
      });
    }
    return geo;
  };
})(typeof window !== 'undefined' ? window : globalThis);
