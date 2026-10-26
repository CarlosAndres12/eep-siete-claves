/* ESTILO · hoja de prueba del estilo (base §1.6): dos páginas de 1280×720. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var S = EEP.style;
  var role = S.role;

  function lum(hex) {
    var c = S.hexToRgb(hex).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contrast(a, b) {
    var la = lum(a), lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }
  S.contrast = contrast;

  function heading(ctx, txt, x, y) { S.text(ctx, txt, { x: x, y: y, size: 15, face: 'display', role: 'ink' }); }
  function scaled(ctx, x, y, k, fn) { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); fn(); ctx.restore(); }

  function page1(ctx) {
    var T = S.tokens.roles;
    var U = EEP.util;
    ctx.fillStyle = role('ground'); ctx.fillRect(0, 0, 1280, 720);
    S.text(ctx, 'Hoja de prueba del estilo · 1 de 2', { x: 40, y: 34, size: 18, face: 'display' });
    S.text(ctx, S.tokens.name, { x: 520, y: 34, size: 16, role: 'ink-soft' });
    // Roles con su contraste medido
    heading(ctx, 'Roles de la paleta · contraste sobre ground', 40, 66);
    var names = Object.keys(T);
    names.forEach(function (n, i) {
      var col = i % 9, row = Math.floor(i / 9);
      var x = 40 + col * 136, y = 76 + row * 80;
      ctx.fillStyle = T[n]; ctx.fillRect(x, y, 126, 40);
      ctx.lineWidth = 1; ctx.strokeStyle = role('ink-soft'); ctx.strokeRect(x + 0.5, y + 0.5, 125, 39);
      var c = contrast(T[n], T.ground);
      var label = U.formatNumber(c, 2) + ':1';
      if (n === 'on-dark') label += ' · ' + U.formatNumber(contrast(T['on-dark'], T.dark), 2) + ':1 en dark';
      if (n === 'machine-line') label = U.formatNumber(contrast(T['machine-line'], T['machine-ground']), 2) + ':1 en panel';
      S.text(ctx, n, { x: x, y: y + 56, size: 14, weight: 700 });
      S.text(ctx, T[n] + ' · ' + label, { x: x, y: y + 74, size: 11.5, role: 'ink-soft', maxWidth: 130 });
    });
    // Leyenda: ranuras en orden con contorno ink, signo y etiqueta
    heading(ctx, 'Leyenda · ranuras en orden', 40, 330);
    var C = EEP.course;
    var boxes = S.__legendBoxes = [];
    [['distrito', 40], ['valle', 340], ['region', 790]].forEach(function (d) {
      C.legendItem(ctx, d[0], d[1], 342, { size: 36, textSize: 16 });
      boxes.push({ id: d[0], x: d[1], y: 342, w: 36, h: 36 });
    });
    var ord = EEP.engine.legend.order();
    for (var k = 4; k <= ord.length; k++) {
      var x = 1110 + (k - 4) * 80;
      ctx.fillStyle = EEP.engine.legend.slotColor(k); ctx.fillRect(x, 342, 36, 36);
      ctx.lineWidth = 2; ctx.strokeStyle = role('ink'); ctx.strokeRect(x, 342, 36, 36);
      boxes.push({ id: 'ranura-' + k, x: x, y: 342, w: 36, h: 36 });
      S.text(ctx, 'Ranura ' + k, { x: x, y: 394, size: 12, role: 'ink-soft' });
    }
    // Tramas
    heading(ctx, 'Tramas', 40, 420);
    ['dots', 'stripes', 'crosses', 'checks', 'waves', 'grid'].forEach(function (pt, i) {
      var x = 40 + i * 62;
      S.mark(ctx, 'pattern', { x: x, y: 430, w: 50, h: 50 }, { variant: pt });
      S.text(ctx, pt, { x: x, y: 496, size: 12, role: 'ink-soft' });
    });
    // Marcas en p = 0,5 y 1
    heading(ctx, 'Marcas · izquierda p = 0,5 · derecha p = 1', 440, 420);
    var marks = [
      ['correct', function (p) { S.mark(ctx, 'correct', { x: 0, y: 0, h: 40 }, { p: p }); }],
      ['retry', function (p) { S.mark(ctx, 'retry', { x: 0, y: 0, h: 40, w: 330 }, { p: p, text: 'Casi. Pista: la clave está aquí.' }); }],
      ['misreading', function (p) { S.mark(ctx, 'misreading', { x: 0, y: 14, w: 140 }, { p: p, size: 15 }); }],
      ['speaking', function (p) { S.mark(ctx, 'speaking', { x: 0, y: 0 }, { p: p, text: 'Lucía' }); }],
      ['chapter', function (p) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 340, 100); ctx.clip(); S.mark(ctx, 'chapter', { x: 10, w: 300, h: 80 }, { p: p, text: 'Qué cubre el suelo' }); ctx.restore(); }],
      ['divider', function (p) { S.mark(ctx, 'divider', { x: 0, y: 30, w: 320 }, { p: p, text: 'Fuente' }); }],
      ['stamp', function (p) { S.mark(ctx, 'stamp', { x: 0, y: 0, w: 380 }, { p: p, text: 'Insumo técnico · Decide el Distrito', sign: function (c, x, y, s) { if (C.signs && C.signs.documento) C.signs.documento(c, x, y, s); } }); }],
      ['card', function (p) { S.mark(ctx, 'card', { x: 0, y: 0, w: 300, h: 80 }, { p: p, hole: true }); }],
      ['button', function (p) { S.mark(ctx, 'button', { x: 0, y: 10 }, { p: p, text: 'Ver de nuevo' }); }],
      ['badge', function (p) {
        var w = S.mark(ctx, 'badge', { x: 0, y: 0 }, { p: p, text: 'Resultado del estudio', variant: 'type', glyph: 'g-resultado' });
        S.mark(ctx, 'badge', { x: 0, y: 36 }, { p: p, text: 'Con matiz', variant: 'state', glyph: 'g-matiz' });
        S.mark(ctx, 'badge', { x: 140, y: 36 }, { p: p, text: 'Esquema', variant: 'state', glyph: 'g-esquema' });
        void w;
      }],
      ['pattern', function (p) { ctx.save(); ctx.globalAlpha = p; S.mark(ctx, 'pattern', { x: 0, y: 0, w: 140, h: 60 }, { variant: 'stripes' }); ctx.restore(); }]
    ];
    marks.forEach(function (m, i) {
      var col = i % 3, row = Math.floor(i / 3);
      var x = 440 + col * 280, y = 432 + row * 72;
      S.text(ctx, m[0], { x: x, y: y + 10, size: 12, weight: 700, role: 'ink-soft' });
      ctx.save(); ctx.beginPath(); ctx.rect(x, y + 14, 132, 56); ctx.clip();
      scaled(ctx, x, y + 18, 0.34, function () { m[1](0.5); });
      ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.rect(x + 136, y + 14, 136, 56); ctx.clip();
      scaled(ctx, x + 136, y + 18, 0.34, function () { m[1](1); });
      ctx.restore();
    });
    // Ficha de escala en tarjetas
    heading(ctx, 'Fichas de escala', 40, 530);
    var cx = 40;
    ['distrito', 'valle', 'region'].forEach(function (id) {
      boxes.push({ id: 'ficha-' + id, x: cx + 5, y: 547, w: 18, h: 18 });
      cx += EEP.engine.cards.chip(ctx, id, cx, 542, { h: 28, size: 13 }) + 8;
    });
    S.text(ctx, 'Cifras tabulares en DM Sans:', { x: 40, y: 612, size: 15, role: 'ink-soft' });
    S.text(ctx, '3.491,58 ha · 40,93 % · 1.358,25 ha', { x: 40, y: 644, size: 26, weight: 700 });
    S.text(ctx, '0123456789 · 1111 · 8888', { x: 40, y: 676, size: 26, weight: 700 });
    S.text(ctx, 'Las cifras nunca van en la letra mono.', { x: 40, y: 704, size: 14, role: 'ink-soft' });
  }

  function page2(ctx) {
    var cast = EEP.data.cast || [];
    var lucia = cast.filter(function (c) { return c.id === 'lucia'; })[0];
    var hernan = cast.filter(function (c) { return c.id === 'hernan'; })[0];
    ctx.fillStyle = role('ground'); ctx.fillRect(0, 0, 1280, 720);
    S.text(ctx, 'Hoja de prueba del estilo · 2 de 2', { x: 40, y: 34, size: 18, face: 'display' });
    // Fondos por tipo de escena
    heading(ctx, 'Fondos por tipo de escena', 40, 64);
    var bgs = ['title', 'explain', 'figure', 'compare', 'dialogue', 'case', 'recap', 'hero', 'card'];
    bgs.forEach(function (b, i) {
      var x = 40 + i * 136, y = 74;
      ctx.save(); ctx.translate(x, y); ctx.scale(0.1, 0.1);
      ctx.beginPath(); ctx.rect(0, 0, 1280, 720); ctx.clip();
      S.background(ctx, b, { t: 0, seed: 1 });
      ctx.restore();
      ctx.lineWidth = 1; ctx.strokeStyle = role('ink-soft'); ctx.strokeRect(x + 0.5, y + 0.5, 128, 72);
      S.text(ctx, b, { x: x, y: y + 90, size: 12, role: 'ink-soft' });
    });
    // Personas en tres poses y viñeta; la lámpara junto a una persona
    heading(ctx, 'Personas · tres poses y viñeta · la lámpara (los dos manejos)', 40, 196);
    ctx.save(); ctx.beginPath(); ctx.rect(30, 204, 800, 270); ctx.clip();
    ctx.fillStyle = role('ground-2'); ctx.fillRect(30, 440, 780, 34);
    S.person(ctx, lucia, { pose: 'notebook', x: 90, y: 456, height: 230 });
    S.person(ctx, lucia, { pose: 'asking', x: 200, y: 456, height: 230 });
    S.person(ctx, hernan, { pose: 'hat-in-hand', x: 320, y: 456, height: 226, facing: 'left' });
    S.person(ctx, hernan, { pose: 'basket', x: 430, y: 456, height: 226 });
    S.person(ctx, lucia, { vignette: true, x: 535, y: 300, label: 'LUCÍA' });
    S.mapPanel(ctx, { x: 520, y: 380, w: 290, h: 80 }, { title: 'Panel de mapa' });
    S.machine(ctx, 'lamp', { x: 690, y: 452, size: 66, light: 1 });
    S.machine(ctx, 'card', { x: 712, y: 434, w: 44, h: 16 });
    ctx.restore();
    // Tarjeta de cifra y gráfico exacto
    heading(ctx, 'Tarjeta de cifra · gráfico exacto de barras', 840, 196);
    EEP.engine.cards.draw(ctx, 'P2-C47', { x: 840, y: 206, w: 400, compact: true, p: 1 });
    // Título de rotulación y banda de subtítulos
    heading(ctx, 'Título de rotulación · banda de subtítulos', 40, 496);
    ctx.save();
    ctx.translate(40, 506); ctx.scale(0.4, 0.4);
    ctx.fillStyle = role('dark'); ctx.fillRect(0, 0, 1280, 300);
    S.title(ctx, 'Los ocho mensajes', { x: 72, y: 130, size: 88, second: 'del estudio técnico' });
    ctx.restore();
    ctx.save(); ctx.translate(-20, 626); ctx.scale(0.55, 0.55); ctx.translate(0, -600);
    ctx.fillStyle = role('accent-8'); ctx.fillRect(96, 600, 1088, 120);
    EEP.engine.captions.drawBand(ctx, { speaker: 'Lucía', text: '¿Y cuál de las dos cifras es la correcta?' });
    ctx.restore();
    EEP.engine.charts.hbars(ctx, {
      x: 640, y: 545, w: 620, h: 160, labelW: 170, valueW: 120,
      items: [{ label: 'La Fe', figure: 'P2-C48' }, { label: 'Río Grande II', figure: 'P2-C49' }, { label: 'Piedras Blancas', figure: 'P2-C50' }]
    });
  }

  S.testsheet = function (canvas, page) {
    var ctx = canvas.getContext('2d');
    ctx.save();
    if (page === 2) page2(ctx); else page1(ctx);
    ctx.restore();
  };
})(typeof window !== 'undefined' ? window : globalThis);
