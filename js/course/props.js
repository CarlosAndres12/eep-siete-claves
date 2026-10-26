/* CURSO · utilería (spec §3.5): camión, tuberías, tarjetas etiqueta, mesa de reunión, cajones, flechas de
   productos y los signos de los sellos del curso (spec §3.2). Los textos vienen de los datos. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;
  C.signs = C.signs || {};

  // Camión de carga (pictograma). (x, y) = base; s = alto.
  C.signs.camion = function (ctx, x, y, s) {
    var S = EEP.style;
    S.fill(ctx, S.rectPath(x - s * 0.9, y - s * 0.8, s * 1.1, s * 0.62, 3), { role: 'accent-4' });
    S.fill(ctx, S.rectPath(x + s * 0.24, y - s * 0.6, s * 0.5, s * 0.42, 4), { role: 'accent-2' });
    S.stroke(ctx, S.rectPath(x + s * 0.4, y - s * 0.54, s * 0.22, s * 0.16, 2), { role: 'ink', width: 1.2 });
    [x - s * 0.6, x - s * 0.1, x + s * 0.5].forEach(function (cx) { S.fill(ctx, S.circlePath(cx, y - s * 0.12, s * 0.12), { role: 'ink' }); });
  };
  // Mesa de reunión pequeña (pictograma).
  C.signs.mesa = function (ctx, x, y, s) {
    var S = EEP.style;
    S.fill(ctx, S.rectPath(x - s * 0.7, y - s * 0.5, s * 1.4, s * 0.12, 3), { role: 'accent-7' });
    S.stroke(ctx, [[x - s * 0.55, y - s * 0.38], [x - s * 0.55, y]], { role: 'ink', width: 2 });
    S.stroke(ctx, [[x + s * 0.55, y - s * 0.38], [x + s * 0.55, y]], { role: 'ink', width: 2 });
    [-0.45, 0, 0.45].forEach(function (k) {
      S.fill(ctx, S.circlePath(x + k * s, y - s * 0.78, s * 0.12), { role: 'ink-soft' });
      S.fill(ctx, function (c) { c.arc(x + k * s, y - s * 0.5, s * 0.18, Math.PI, 0); }, { role: 'ink-soft' });
    });
  };
  // Cajón de productos.
  C.signs.cajon = function (ctx, x, y, s) {
    var S = EEP.style;
    var roles = ['accent-9', 'accent-5', 'accent-1', 'skin-2'];
    for (var i = 0; i < 4; i++) S.fill(ctx, S.circlePath(x - s * 0.3 + i * s * 0.2, y - s * 0.55, s * 0.12), { role: roles[i] });
    S.fill(ctx, S.rectPath(x - s * 0.45, y - s * 0.5, s * 0.9, s * 0.5, 2), { role: 'accent-4' });
    S.stroke(ctx, [[x - s * 0.45, y - s * 0.25], [x + s * 0.45, y - s * 0.25]], { role: 'ink', width: 1.2 });
  };
  // Hospital, escuela y puesto de emergencias (pictogramas sobrios).
  C.signs.hospital = function (ctx, x, y, s) {
    var S = EEP.style;
    S.fill(ctx, S.rectPath(x - s * 0.4, y - s * 0.8, s * 0.8, s * 0.8, 2), { role: 'ground-2' });
    S.fill(ctx, S.rectPath(x - s * 0.06, y - s * 0.66, s * 0.12, s * 0.36, 0), { role: 'accent-7' });
    S.fill(ctx, S.rectPath(x - s * 0.18, y - s * 0.54, s * 0.36, s * 0.12, 0), { role: 'accent-7' });
  };
  C.signs.escuela = function (ctx, x, y, s) {
    var S = EEP.style;
    S.building(ctx, { x: x - s * 0.45, y: y - s * 0.8, w: s * 0.9, h: s * 0.8 }, { kind: 'casa', roof: 'accent-3' });
    S.stroke(ctx, [[x, y - s * 0.8], [x, y - s * 1.05]], { role: 'ink', width: 1.4 });
    S.fill(ctx, [[x, y - s * 1.05], [x + s * 0.2, y - s * 0.98], [x, y - s * 0.92]], { role: 'accent-9' });
  };
  C.signs.emergencia = function (ctx, x, y, s) {
    var S = EEP.style;
    S.fill(ctx, S.rectPath(x - s * 0.35, y - s * 0.6, s * 0.7, s * 0.6, 2), { role: 'accent-4' });
    S.fill(ctx, S.circlePath(x, y - s * 0.72, s * 0.12), { role: 'accent-9' });
    S.stroke(ctx, S.rectPath(x - s * 0.15, y - s * 0.32, s * 0.3, s * 0.32, 0), { role: 'ink', width: 1.2 });
  };

  // Tubería del polo A: línea gruesa en ink-soft.
  C.pipe = function (ctx, pts, o) {
    EEP.style.stroke(ctx, { pts: pts, smooth: true }, { role: 'ink-soft', width: (o && o.width) || 4, p: o && o.p });
  };

  // Flecha de productos entrando desde un borde: una línea con cajones pequeños.
  C.produceArrow = function (ctx, from, to, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return;
    S.stroke(ctx, [from, to], { role: 'ink', width: 2, p: p, dash: [8, 6] });
    var k = E.out(p);
    var hx = from[0] + (to[0] - from[0]) * k, hy = from[1] + (to[1] - from[1]) * k;
    C.signs.cajon(ctx, hx, hy + 10, o.size || 34);
    var ang = Math.atan2(to[1] - from[1], to[0] - from[0]);
    if (p >= 1) S.stroke(ctx, [[to[0] - Math.cos(ang - 0.5) * 14, to[1] - Math.sin(ang - 0.5) * 14], to, [to[0] - Math.cos(ang + 0.5) * 14, to[1] - Math.sin(ang + 0.5) * 14]], { role: 'ink', width: 2 });
  };

  // Tarjeta etiqueta con texto (texto desde los datos). box; o: { p, tilt, role, size }
  C.tag = function (ctx, box, text, o) {
    o = o || {};
    var S = EEP.style;
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return box;
    S.tagCard(ctx, box, { role: o.role || 'accent-8', tilt: o.tilt || 0, holes: 1, p: p });
    ctx.save();
    ctx.globalAlpha *= S.appear('fade', p).alpha;
    S.text(ctx, text, { x: box.x + 12, y: box.y + 36, size: o.size || 15, weight: 700, maxWidth: box.w - 24, lineHeight: 1.18 });
    ctx.restore();
    return box;
  };

  // ---------- signos de los sellos (spec §3.2) ----------
  // Cada uno: (ctx, x, y, s) con base centrada en (x, y).
  var stampSigns = {
    documento: function (ctx, x, y, s) { C.signs.documento(ctx, x, y, s); },
    corredor: function (ctx, x, y, s) {
      var S = EEP.style;
      S.tree(ctx, { x: x - s * 0.36, y: y, size: s * 0.6, seed: 2, stipple: false });
      S.tree(ctx, { x: x + s * 0.36, y: y, size: s * 0.6, seed: 3, stipple: false });
      S.stroke(ctx, [[x - s * 0.2, y - s * 0.12], [x + s * 0.2, y - s * 0.12]], { role: 'ink', width: 1.4, dash: [3, 3] });
    },
    'lampara-lupa': function (ctx, x, y, s) {
      var S = EEP.style;
      S.machine(ctx, 'lamp', { x: x - s * 0.18, y: y, size: s * 0.9, onPaper: true, light: 0 });
      S.sign(ctx, 'lupa', { x: x + s * 0.34, y: y, size: s * 0.6 });
    },
    triada: function (ctx, x, y, s) {
      var S = EEP.style;
      [[-0.18, -0.6], [0.18, -0.6], [0, -0.32]].forEach(function (d) { S.stroke(ctx, S.circlePath(x + d[0] * s, y + d[1] * s, s * 0.28), { role: 'ink', width: 1.4 }); });
    },
    'gota-plato': function (ctx, x, y, s) {
      var S = EEP.style;
      S.stroke(ctx, S.ellipsePath(x, y - s * 0.14, s * 0.46, s * 0.12), { role: 'ink', width: 1.4 });
      S.sign(ctx, 'gota', { x: x, y: y - s * 0.24, size: s * 0.66 });
    },
    'dos-barras': function (ctx, x, y, s) {
      var S = EEP.style;
      S.fill(ctx, S.rectPath(x - s * 0.42, y - s * 0.7, s * 0.26, s * 0.7, 0), { role: 'ink-soft' });
      S.fill(ctx, S.rectPath(x + s * 0.06, y - s * 0.55, s * 0.26, s * 0.55, 0), { role: 'ink-soft' });
    },
    'hoja-mapa': function (ctx, x, y, s) { EEP.style.sign(ctx, 'hoja-mapa', { x: x, y: y, size: s }); },
    'satelite-mancha': function (ctx, x, y, s) {
      var S = EEP.style;
      S.stroke(ctx, S.rectPath(x - s * 0.08, y - s * 0.95, s * 0.16, s * 0.16, 0), { role: 'ink', width: 1.4 });
      S.stroke(ctx, [[x - s * 0.36, y - s * 0.87], [x + s * 0.36, y - s * 0.87]], { role: 'ink', width: 1.4 });
      S.patternFill(ctx, S.ellipsePath(x, y - s * 0.25, s * 0.4, s * 0.2), 'dots', {});
      S.stroke(ctx, S.ellipsePath(x, y - s * 0.25, s * 0.4, s * 0.2), { role: 'ink', width: 1.2, dash: [3, 3] });
    }
  };
  C.stampSigns = stampSigns;

  // Sello del curso por id (texto y signo en js/data/site.js `stamps`). o: { p, w, size }
  C.stamp = function (ctx, id, x, y, o) {
    o = o || {};
    var st = (EEP.data.site.stamps || {})[id];
    if (!st) return { w: 0, h: 0 };
    var sign = stampSigns[st.sign];
    return EEP.style.mark(ctx, 'stamp', { x: x, y: y, w: o.w || 460 }, { text: st.text, p: o.p, size: o.size || 19, sign: sign, measureOnly: o.measureOnly });
  };
})(typeof window !== 'undefined' ? window : globalThis);
