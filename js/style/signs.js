/* ESTILO · vocabulario libre de signos (style S5) y glifos pequeños para sellos e insignias.
   Cada signo se dibuja con su base centrada en (x, y) y una altura aproximada `size`. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var S = EEP.style;
  var role = S.role;

  function line(ctx, pts, w, r, a) {
    ctx.save();
    ctx.strokeStyle = role(r || 'ink', a);
    ctx.lineWidth = w || 1.3;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
    ctx.restore();
  }

  var SIGNS = {
    hoja: function (ctx, s) {
      ctx.fillStyle = role('accent-6');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 0.45, -s * 0.3, -s * 0.3, -s * 0.85, 0, -s);
      ctx.bezierCurveTo(s * 0.3, -s * 0.85, s * 0.45, -s * 0.3, 0, 0);
      ctx.fill();
      ctx.fillStyle = role('accent-7');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(s * 0.45, -s * 0.3, s * 0.3, -s * 0.85, 0, -s);
      ctx.lineTo(0, 0);
      ctx.fill();
      line(ctx, [[0, 0], [0, -s * 0.85]], 1.2);
    },
    arbol: function (ctx, s, o) { S.tree(ctx, { x: 0, y: 0, size: s, seed: o.seed, t: o.t }); },
    arboleda: function (ctx, s, o) {
      S.tree(ctx, { x: -s * 0.42, y: 0, size: s * 0.7, seed: (o.seed || 1) + 1, t: o.t, kind: 'round' });
      S.tree(ctx, { x: s * 0.42, y: 0, size: s * 0.8, seed: (o.seed || 1) + 2, t: o.t, kind: 'dense' });
      S.tree(ctx, { x: 0, y: 0, size: s, seed: (o.seed || 1) + 3, t: o.t, kind: 'scalloped' });
      line(ctx, [[-s * 0.8, 0], [s * 0.8, 0]], 1.3);
    },
    colina: function (ctx, s) { S.hill(ctx, -s * 0.9, 0, s * 1.8, s * 0.8); },
    nube: function (ctx, s, o) { S.clouds(ctx, { x: -s, y: -s, w: s * 2, h: s }, { seed: o.seed || 2, count: 1, size: s * 1.4, role: o.role || 'paper' }); },
    gota: function (ctx, s) {
      ctx.fillStyle = role('accent-2');
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.15, -s * 0.7, s * 0.38, -s * 0.5, s * 0.38, -s * 0.3);
      ctx.arc(0, -s * 0.3, s * 0.38, 0, Math.PI, false);
      ctx.bezierCurveTo(-s * 0.38, -s * 0.5, -s * 0.15, -s * 0.7, 0, -s);
      ctx.fill();
      line(ctx, [[-s * 0.18, -s * 0.38], [-s * 0.12, -s * 0.2]], 1.2, 'paper');
    },
    rio: function (ctx, s, o) {
      var pts = [];
      for (var i = 0; i <= 16; i++) pts.push([-s * 1.2 + i * s * 0.15, -s * 0.2 + Math.sin(i * 0.8) * s * 0.12]);
      S.water(ctx, pts, { width: s * 0.22, t: o.t });
    },
    casa: function (ctx, s) { S.building(ctx, { x: -s * 0.4, y: -s, w: s * 0.8, h: s }, { kind: 'casa' }); },
    edificio: function (ctx, s, o) { S.building(ctx, { x: -s * 0.25, y: -s, w: s * 0.5, h: s }, { kind: 'torre', seed: o.seed }); },
    grua: function (ctx, s) {
      S.building(ctx, { x: s * 0.05, y: -s * 0.55, w: s * 0.4, h: s * 0.55 }, { kind: 'bloque' });
      line(ctx, [[-s * 0.25, 0], [-s * 0.25, -s], [s * 0.55, -s], [s * 0.45, -s * 0.85]], 1.6);
      line(ctx, [[-s * 0.25, -s], [-s * 0.45, -s], [-s * 0.25, -s * 0.85]], 1.6);
      line(ctx, [[s * 0.4, -s], [s * 0.4, -s * 0.7]], 1.2);
    },
    teleferico: function (ctx, s) {
      S.hill(ctx, -s, 0, s * 2, s * 0.6);
      line(ctx, [[-s, -s * 0.9], [s, -s * 0.4]], 1.3);
      [-0.4, 0.4].forEach(function (k) {
        var cx = k * s, cy = -s * 0.65 - k * s * 0.25;
        line(ctx, [[cx, cy], [cx, cy + s * 0.1]], 1.2);
        ctx.fillStyle = role('accent-3');
        ctx.fillRect(cx - s * 0.1, cy + s * 0.1, s * 0.2, s * 0.15);
      });
    },
    pin: function (ctx, s, o) {
      ctx.fillStyle = role(o.role || 'accent-2');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-s * 0.15, -s * 0.3, -s * 0.36, -s * 0.48, -s * 0.36, -s * 0.66);
      ctx.arc(0, -s * 0.66, s * 0.36, Math.PI, 0, false);
      ctx.bezierCurveTo(s * 0.36, -s * 0.48, s * 0.15, -s * 0.3, 0, 0);
      ctx.fill();
      ctx.fillStyle = role(o.hole || 'ground');
      ctx.beginPath();
      ctx.arc(0, -s * 0.66, s * 0.14, 0, Math.PI * 2);
      ctx.fill();
    },
    lupa: function (ctx, s, o) {
      ctx.save();
      ctx.strokeStyle = role(o.role || 'ink');
      ctx.lineWidth = Math.max(1.6, s * 0.08);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(-s * 0.1, -s * 0.6, s * 0.3, 0, Math.PI * 2);
      ctx.moveTo(s * 0.12, -s * 0.38);
      ctx.lineTo(s * 0.4, -s * 0.08);
      ctx.stroke();
      ctx.restore();
    },
    flecha: function (ctx, s, o) {
      line(ctx, [[-s * 0.6, -s * 0.1], [-s * 0.2, -s * 0.45], [s * 0.05, -s * 0.3], [s * 0.55, -s * 0.85]], 2, o.role);
      line(ctx, [[s * 0.3, -s * 0.85], [s * 0.55, -s * 0.85], [s * 0.55, -s * 0.6]], 2, o.role);
    },
    flor: function (ctx, s, o) {
      line(ctx, [[0, 0], [0, -s * 0.6]], 1.3, 'accent-7');
      ctx.fillStyle = role(o.role || 'accent-9');
      for (var i = 0; i < 5; i++) {
        var a = i / 5 * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * s * 0.17, -s * 0.75 + Math.sin(a) * s * 0.17, s * 0.13, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = role('ink');
      ctx.beginPath(); ctx.arc(0, -s * 0.75, s * 0.06, 0, Math.PI * 2); ctx.fill();
    },
    ave: function (ctx, s, o) {
      ctx.save();
      ctx.strokeStyle = role(o.role || 'ink');
      ctx.lineWidth = Math.max(1.4, s * 0.08);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, -s * 0.5);
      ctx.quadraticCurveTo(-s * 0.25, -s * 0.8, 0, -s * 0.5);
      ctx.quadraticCurveTo(s * 0.25, -s * 0.8, s * 0.5, -s * 0.5);
      ctx.stroke();
      ctx.restore();
    },
    canasta: function (ctx, s) {
      var fr = ['accent-5', 'accent-9', 'accent-1'];
      fr.forEach(function (r, i) {
        ctx.fillStyle = role(r);
        ctx.beginPath();
        ctx.arc((i - 1) * s * 0.26, -s * 0.52, s * 0.16, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = role('accent-4');
      ctx.beginPath();
      ctx.moveTo(-s * 0.55, -s * 0.5); ctx.lineTo(s * 0.55, -s * 0.5); ctx.lineTo(s * 0.42, 0); ctx.lineTo(-s * 0.42, 0);
      ctx.closePath(); ctx.fill();
      line(ctx, [[-s * 0.48, -s * 0.3], [s * 0.48, -s * 0.3]], 1.2);
      line(ctx, [[-s * 0.44, -s * 0.12], [s * 0.44, -s * 0.12]], 1.2);
      ctx.save(); ctx.strokeStyle = role('ink'); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(0, -s * 0.5, s * 0.42, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); ctx.restore();
    },
    carretilla: function (ctx, s) {
      ctx.fillStyle = role('accent-2');
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, -s * 0.55); ctx.lineTo(s * 0.35, -s * 0.55); ctx.lineTo(s * 0.2, -s * 0.25); ctx.lineTo(-s * 0.4, -s * 0.25);
      ctx.closePath(); ctx.fill();
      ['accent-1', 'accent-9', 'accent-5', 'accent-1'].forEach(function (r, i) {
        ctx.fillStyle = role(r);
        ctx.beginPath(); ctx.arc(-s * 0.3 + i * s * 0.18, -s * 0.6, s * 0.1, 0, Math.PI * 2); ctx.fill();
      });
      line(ctx, [[-s * 0.4, -s * 0.25], [-s * 0.75, -s * 0.45]], 1.6);
      line(ctx, [[s * 0.05, -s * 0.25], [s * 0.05, -s * 0.05]], 1.6);
      ctx.fillStyle = role('ink');
      ctx.beginPath(); ctx.arc(s * 0.2, -s * 0.12, s * 0.12, 0, Math.PI * 2); ctx.fill();
    },
    'hoja-mapa': function (ctx, s, o) {
      var w = s * 1.1, h = s * 0.8;
      var x = -w / 2, y = -h;
      ['accent-4', 'ground-2', 'accent-4'].forEach(function (r, i) {
        ctx.fillStyle = role(r);
        ctx.beginPath();
        ctx.moveTo(x + i * w / 3, y + (i % 2 ? s * 0.06 : 0));
        ctx.lineTo(x + (i + 1) * w / 3, y + (i % 2 ? 0 : s * 0.06));
        ctx.lineTo(x + (i + 1) * w / 3, y + h + (i % 2 ? 0 : -s * 0.06) + s * 0.06);
        ctx.lineTo(x + i * w / 3, y + h + (i % 2 ? -s * 0.06 : 0) + s * 0.06);
        ctx.closePath(); ctx.fill();
        ctx.lineWidth = 1.2; ctx.strokeStyle = role('ink'); ctx.stroke();
      });
      S.stroke(ctx, [[x + w * 0.12, y + h * 0.75], [x + w * 0.35, y + h * 0.45], [x + w * 0.6, y + h * 0.6], [x + w * 0.85, y + h * 0.25]],
        { role: o.role || 'ink', width: 1.4, dash: [4, 4] });
    },
    sol: function (ctx, s) {
      ctx.fillStyle = role('accent-9');
      ctx.beginPath(); ctx.arc(0, -s * 0.5, s * 0.5, 0, Math.PI * 2); ctx.fill();
    }
  };

  // Glifos pequeños para insignias y sellos, en un rol de línea (on-dark o ink).
  function sheet(ctx, s, r, dashed) {
    S.stroke(ctx, S.rectPath(-s * 0.32, -s * 0.9, s * 0.64, s * 0.8, 1), { role: r, width: 1.3, dash: dashed ? [2.5, 2.5] : null });
  }
  var GLYPHS = {
    'g-resultado': function (ctx, s, r) { sheet(ctx, s, r); SIGNS.lupa(ctx, s * 0.7, { role: r }); },
    'g-preliminar': function (ctx, s, r) { sheet(ctx, s, r, true); },
    'g-ilustrativo': function (ctx, s, r) {
      sheet(ctx, s, r);
      ctx.save(); ctx.strokeStyle = role(r); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(0, -s * 0.45, s * 0.2, 0, Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.38); ctx.lineTo(s * 0.1, -s * 0.38); ctx.stroke(); ctx.restore();
    },
    'g-teorico': function (ctx, s, r) { line(ctx, [[-s * 0.4, -s * 0.1], [s * 0.4, -s * 0.1], [-s * 0.4, -s * 0.85], [-s * 0.4, -s * 0.1]], 1.4, r); },
    'g-propuesta': function (ctx, s, r) {
      line(ctx, [[-s * 0.35, -s * 0.1], [s * 0.3, -s * 0.8]], 3, r);
      line(ctx, [[-s * 0.35, -s * 0.1], [-s * 0.42, s * 0.0]], 1.4, r);
    },
    'g-norma': function (ctx, s, r) {
      ctx.save(); ctx.strokeStyle = role(r); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(0, -s * 0.48, s * 0.36, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -s * 0.48, s * 0.2, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    },
    'g-judicial': function (ctx, s, r) {
      line(ctx, [[-s * 0.35, -s * 0.75], [s * 0.05, -s * 0.35]], 4, r);
      line(ctx, [[-s * 0.1, -s * 0.5], [s * 0.4, -s * 0.05]], 1.6, r);
      line(ctx, [[-s * 0.45, -s * 0.05], [s * 0.1, -s * 0.05]], 1.6, r);
    },
    'g-secundaria': function (ctx, s, r) {
      S.stroke(ctx, S.rectPath(-s * 0.38, -s * 0.9, s * 0.5, s * 0.66, 1), { role: r, width: 1.2 });
      S.stroke(ctx, S.rectPath(-s * 0.12, -s * 0.7, s * 0.5, s * 0.66, 1), { role: r, width: 1.2 });
      line(ctx, [[-s * 0.3, -s * 0.15], [-s * 0.05, -s * 0.15]], 1.2, r);
    },
    'g-matiz': function (ctx, s, r) {
      ctx.save(); ctx.strokeStyle = role(r); ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-s * 0.4, -s * 0.4);
      ctx.bezierCurveTo(-s * 0.2, -s * 0.7, 0, -s * 0.1, s * 0.4, -s * 0.5); ctx.stroke(); ctx.restore();
    },
    'g-esquema': function (ctx, s, r) { S.stroke(ctx, S.rectPath(-s * 0.35, -s * 0.85, s * 0.7, s * 0.7, 0), { role: r, width: 1.3, dash: [2.5, 2.5] }); },
    'g-personajes': function (ctx, s, r) {
      ctx.save(); ctx.strokeStyle = role(r); ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(-s * 0.18, -s * 0.6, s * 0.16, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(s * 0.2, -s * 0.55, s * 0.16, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(-s * 0.18, -s * 0.05, s * 0.28, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.beginPath(); ctx.arc(s * 0.2, 0, s * 0.28, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.restore();
    },
    'g-ejemplo': function (ctx, s, r) { sheet(ctx, s, r); line(ctx, [[-s * 0.15, -s * 0.5], [s * 0.15, -s * 0.5]], 1.3, r); },
    'g-alerta': function (ctx, s, r) { line(ctx, [[-s * 0.3, -s * 0.8], [s * 0.3, -s * 0.2]], 1.6, r); line(ctx, [[s * 0.3, -s * 0.8], [-s * 0.3, -s * 0.2]], 1.6, r); }
  };

  // style.sign(ctx, name, { x, y, size, p, seed, t, role })
  S.sign = function (ctx, name, opts) {
    opts = opts || {};
    var f = SIGNS[name] || (EEP.course.signs && EEP.course.signs[name]);
    var p = opts.p == null ? 1 : opts.p;
    if (!f || p <= 0) return;
    var a = S.appear('illus', p);
    ctx.save();
    ctx.globalAlpha *= a.alpha * (opts.alpha == null ? 1 : opts.alpha);
    ctx.translate(opts.x || 0, (opts.y || 0) + a.dy);
    f(ctx, opts.size || 40, opts);
    ctx.restore();
  };
  S.glyph = function (ctx, name, x, y, size, r) {
    var f = GLYPHS[name];
    if (!f) return;
    ctx.save();
    ctx.translate(x, y);
    f(ctx, size, r || 'ink');
    ctx.restore();
  };
  S.SIGNS = SIGNS;
  S.GLYPHS = GLYPHS;
})(typeof window !== 'undefined' ? window : globalThis);
