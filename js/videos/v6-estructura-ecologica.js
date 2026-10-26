/* V6 · «La estructura ecológica de Medellín: qué cambió y cómo se propone actualizarla» (spec §11, V6). Solo dibujo:
   los textos vienen de js/data/videos.js (`texts`, t1…tn en el orden del brief), las cifras del banco y las personas
   del reparto. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var M = 72;

  function badgeEsquema(ctx, env, x, y, p, align) {
    env.style.mark(ctx, 'badge', { x: x, y: y }, { text: env.data.site.ui.esquema, variant: 'state', glyph: 'g-esquema', size: 14, align: align, p: p });
  }
  // Rótulo sobre una barra de fondo claro, con una línea fina opcional hacia lo que nombra.
  function callout(ctx, env, txt, x, y, p, o) {
    o = o || {};
    var S = env.style;
    if (p <= 0) return null;
    var size = o.size || 18;
    var m = S.text(ctx, txt, { size: size, weight: 700, measureOnly: true, maxWidth: o.maxWidth });
    var w = m.width + 16, h = m.height + 10;
    var x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    if (o.to) S.stroke(ctx, [[o.from ? o.from[0] : x0 + w / 2, o.from ? o.from[1] : y + h], o.to], { role: o.lineRole || 'ink', width: 1.4, p: p });
    ctx.save();
    ctx.globalAlpha *= S.appear('text', p).alpha;
    ctx.fillStyle = S.role(o.role || 'ground');
    ctx.beginPath(); S.roundRect(ctx, x0, y, w, h, 4); ctx.fill();
    ctx.restore();
    S.text(ctx, txt, { x: x0 + 8, y: y + size * 0.95 + 4, size: size, weight: 700, maxWidth: o.maxWidth, p: p, lineHeight: 1.18 });
    return { x: x0, y: y, w: w, h: h };
  }
  function blob(env, cx, cy, rx, ry, seed) {
    var r = env.rng(seed), pts = [];
    for (var i = 0; i < 10; i++) {
      var a = i / 10 * Math.PI * 2, k = 0.86 + r() * 0.22;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return { pts: pts, closed: true, smooth: true };
  }
  function grass(ctx, env, x, y, s, alpha) {
    var S = env.style;
    [[-0.5, -0.2], [0, 0], [0.5, 0.2]].forEach(function (d) {
      S.stroke(ctx, [[x + d[0] * s * 0.5, y], [x + d[0] * s * 0.5 + d[1] * s, y - s * (0.7 + Math.abs(d[0]) * -0.3)]], { role: 'accent-7', width: 2, alpha: alpha });
    });
  }

  EEP.videos.v6 = {
    setup: function () {},
    scenes: {
      // Draw: title background; on line 1 the title «LA ESTRUCTURA ECOLÓGICA PRINCIPAL» with the second line «qué cambió y
      // cómo se propone actualizarla» appears, and the `valle-corte` rises along the bottom with its forests, streams, river
      // and ridges, labeled in order «Áreas protegidas», «Ríos y quebradas», «Humedales», «Montañas», «Corredores».
      gancho: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p = s.at(0);
        S.title(ctx, env.text('t1'), { x: M, y: 120, size: 64, second: env.text('t2'), p: p, maxWidth: 1000 });
        var box = { x: M, y: 380, w: 1136, h: 190 };
        var g = env.course.valleCorte(ctx, box, { p: E.clamp(p * 1.6), t: s.t, badge: false });
        // quebradas que bajan por las laderas hacia el río
        var wp = E.clamp(p * 2 - 0.5);
        if (wp > 0) {
          [0.3, 0.7].forEach(function (f) {
            var dir = f < 0.5 ? 1 : -1, pts = [];
            for (var k = 0; k <= 6; k++) { var ff = f + dir * k * 0.022; pts.push([g.px(ff), g.hAt(ff) + 6]); }
            S.water(ctx, pts, { width: 5, p: wp, t: s.t });
          });
          // humedal en el fondo del valle
          S.fill(ctx, S.ellipsePath(g.px(0.465), g.base - 8, 22, 5), { role: 'accent-2', alpha: wp });
        }
        // rótulos en orden, cada uno con una línea fina hacia lo que nombra
        var spots = [
          ['t3', g.px(0.06), 330, g.px(0.06), g.hAt(0.06) - 30],
          ['t4', g.px(0.26), 330, g.px(0.32), g.hAt(0.32)],
          ['t5', g.px(0.46), 300, g.px(0.465), g.base - 12],
          ['t6', g.px(0.93), 330, g.px(0.95), g.hAt(0.95) - 30],
          ['t7', g.px(0.7), 300, g.px(0.82), g.hAt(0.82) - 6]
        ];
        spots.forEach(function (sp, i) {
          var pi = E.clamp(p * 6 - 0.8 - i * 0.9);
          if (pi <= 0) return;
          S.stroke(ctx, [[sp[1], sp[2] + 24], [sp[3], sp[4]]], { role: 'on-dark', width: 1.4, p: pi });
          S.labelBar(ctx, env.text(sp[0]), { x: Math.max(M, Math.min(1208 - 200, sp[1] - 60)), y: sp[2] - 10, size: 16, role: 'accent-1', p: pi });
        });
      },

      // Draw: figure background; on line 1 the figure card `P4-C01` appears with its badges «Norma vigente» and «Con matiz»,
      // and a second, smaller panel appears to its right, labeled «Estructura Ecológica Complementaria · segundo nivel»; on
      // line 2 LUCÍA appears at the lower left, outside the card (pose: pointing at the card); on line 3 the note «El documento
      // no reporta el área de la propuesta» appears under the card.
      vigente: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.draw(ctx, 'P4-C01', { x: 330, y: 70, w: 520, p: s.at(0) });
        env.zones.push(a);
        var pp = E.clamp(s.at(0) * 1.4 - 0.3);
        var b = { x: 890, y: 110, w: 318, h: 250 };
        if (pp > 0) {
          S.mark(ctx, 'card', b, { p: pp });
          if (pp >= 0.6) {
            S.text(ctx, env.text('t3'), { x: b.x + 20, y: b.y + 40, size: 20, weight: 700, maxWidth: b.w - 40, lineHeight: 1.2 });
            // dos manchas pequeñas unidas por una franja: apoya y conecta
            var by = b.y + b.h - 40;
            S.fill(ctx, S.rectPath(b.x + 20, by + 2, b.w - 40, 10, 4), { role: 'accent-4' });
            [0, 1, 2].forEach(function (k) { S.tree(ctx, { x: b.x + 44 + k * 22, y: by + 6, size: 46, seed: k + 2, stipple: false }); });
            [0, 1, 2].forEach(function (k) { S.tree(ctx, { x: b.x + b.w - 92 + k * 22, y: by + 6, size: 46, seed: k + 7, stipple: false }); });
            S.stroke(ctx, [[b.x + 120, by - 12], [b.x + b.w - 110, by - 12]], { role: 'ink', width: 1.6, dash: [5, 5] });
          }
          env.zones.push(b);
        }
        S.labelBar(ctx, env.text('t4'), { x: 330, y: a.y + a.h + 16, size: 17, role: 'accent-1', p: s.at(2), maxWidth: 560 });
        S.person(ctx, env.cast('lucia'), { pose: 'pointing-card', x: 170, y: 610, height: 240, p: s.at(1) });
        return { on: { lucia: { x: 170, y: 610 - 240 } } };
      },

      // Draw: explain background; on line 1 a forest patch keeps its outline while its tree crowns thin out and some turn into
      // grass shapes, with the labels «La forma se mantiene» and «Cambia la calidad»; on line 2 the label bar «¿QUÉ CAMBIÓ
      // ENTRE 2014 Y 2024?» slides in; the badge «Esquema».
      calidad: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var cx = 470, cy = 380;
        var patch = blob(env, cx, cy, 340, 140, 12);
        S.fill(ctx, patch, { role: 'accent-1', alpha: 0.7, p: s.intro });
        var k = E.inOut(E.clamp(s.at(0) * 1.3));
        var r = env.rng(5);
        var trees = [];
        for (var row = 0; row < 3; row++) for (var col = 0; col < 7; col++) {
          var tx = cx - 255 + col * 85 + (row % 2) * 40 + (r() - 0.5) * 18, ty = cy - 20 + row * 56;
          if (Math.pow((tx - cx) / 310, 2) + Math.pow((ty - 30 - cy) / 130, 2) > 1) continue;
          trees.push({ x: tx, y: ty, thr: r(), seed: row * 7 + col });
        }
        trees.sort(function (a, b) { return a.y - b.y; });
        S.withAppear(ctx, 'illus', s.intro, function () {
          trees.forEach(function (t) {
            var gone = E.clamp((k - t.thr * 0.9) * 4) * (t.thr < 0.5 ? 1 : 0);
            if (gone < 1) S.tree(ctx, { x: t.x, y: t.y, size: 80 * (1 - 0.35 * k) * (1 - gone), seed: t.seed, kind: t.seed % 3 ? 'round' : 'dense', t: s.t, stipple: false });
            if (gone > 0) grass(ctx, env, t.x, t.y, 26, gone);
          });
        });
        // el contorno se mantiene, quieto
        S.stroke(ctx, patch, { role: 'ink', width: 2.6, p: s.intro });
        var lp = E.clamp(s.at(0) * 2.5);
        callout(ctx, env, env.text('t1'), 840, 210, lp, { size: 20, to: [770, 300], from: [860, 244] });
        callout(ctx, env, env.text('t2'), 860, 440, E.clamp(s.at(0) * 2 - 0.9), { size: 20, to: [640, 410], from: [860, 458] });
        S.labelBar(ctx, env.text('t3'), { x: M, y: 60, size: 28, p: s.at(1) });
        badgeEsquema(ctx, env, 1208, 60, s.intro, 'right');
      },

      // Draw: figure background; on line 1 an exact horizontal bar from zero spans most of the frame width: its full length is
      // the 7.385 ha of `P4-C13`, and its marked part, from zero, is the 4.557,7 ha of `P4-C14`, labeled «Suelos con capacidad
      // para servicios ecosistémicos»; the cards `P4-C13` and `P4-C14` sit below the bar; on line 2 the marked part is emphasized.
      perdida: function (ctx, s, env) {
        var S = env.style, E = env.ease, cards = env.cards, parse = env.charts.parse;
        var leg = EEP.engine.legend;
        var f13 = cards.fig('P4-C13'), f14 = cards.fig('P4-C14');
        var total = parse(f13.partes[0].valor), part = parse(f14.partes[1].valor);
        var x0 = 100, x1 = 1060, y = 120, h = 64;
        var full = x1 - x0, marked = full * part / total; // exacto, desde cero
        var p = s.at(0), em = s.at(1);
        var reveal = S.reduced ? 1 : E.out(E.clamp(p * 1.6));
        var fl = leg.fillFor(f13.escala);
        if (p > 0) {
          S.stroke(ctx, [[x0, y - 14], [x0, y + h + 14]], { role: 'ink', width: 2, p: E.clamp(p * 3) });
          ctx.save();
          ctx.beginPath(); ctx.rect(x0 - 2, y - 4, full * reveal + 4, h + 8); ctx.clip();
          // longitud total: P4-C13
          ctx.save(); ctx.globalAlpha *= 0.35;
          ctx.beginPath(); ctx.rect(x0, y, full, h);
          if (fl.color) { ctx.fillStyle = fl.color; ctx.fill(); } else S.patternFill(ctx, S.rectPath(x0, y, full, h, 0), fl.pattern, { ground: 'ground' });
          ctx.restore();
          // parte marcada: P4-C14
          ctx.beginPath(); ctx.rect(x0, y, marked, h);
          if (fl.color) { ctx.fillStyle = fl.color; ctx.fill(); } else S.patternFill(ctx, S.rectPath(x0, y, marked, h, 0), fl.pattern, { ground: 'ground' });
          if (em > 0) S.patternFill(ctx, S.rectPath(x0, y, marked, h, 0), 'stripes', { alpha: 0.5 * em });
          ctx.lineWidth = 2; ctx.strokeStyle = S.role('ink');
          ctx.beginPath(); ctx.rect(x0, y, full, h); ctx.stroke();
          ctx.lineWidth = 2 + 2 * em;
          ctx.beginPath(); ctx.rect(x0, y, marked, h); ctx.stroke();
          ctx.restore();
          if (reveal >= 0.999) {
            cards.chip(ctx, f13.escala, x0, y - 48);
            S.text(ctx, f13.partes[0].valor, { x: x1 + 12, y: y + h / 2, size: 24, weight: 700, baseline: 'middle' });
            S.text(ctx, f14.partes[1].valor, { x: x0 + marked, y: y - 14, size: 22, weight: 700, align: 'right' });
            S.stroke(ctx, [[x0, y + h + 10], [x0, y + h + 18], [x0 + marked, y + h + 18], [x0 + marked, y + h + 10]], { role: 'ink', width: 1.6 + em });
            callout(ctx, env, env.text('t1'), x0 + marked / 2, y + h + 26, E.clamp((p - 0.6) * 3), { size: 17, align: 'center', role: em > 0 ? 'accent-9' : 'ground' });
          }
        }
        env.zones.push({ x: x0, y: y - 50, w: x1 - x0 + 140, h: h + 110 });
        var cp = E.clamp(p * 1.5 - 0.4);
        var a = cards.draw(ctx, 'P4-C13', { x: 100, y: 290, w: 480, compact: true, p: cp });
        var b = cards.draw(ctx, 'P4-C14', { x: 620, y: 290, w: 560, compact: true, p: cp, emphasize: 'card', emph: em });
        env.zones.push(a, b);
      },

      // Draw: dialogue background with the place `mirador`; HERNÁN and LUCÍA stand at the railing; on line 1 HERNÁN turns
      // (pose: pointing at the valley); on line 2 tree crowns on the far rural slope grow denser while a corridor shows gaps;
      // the badge «Esquema».
      'sin-alarma': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        env.course.mirador(ctx, { x: 0, y: 160, w: 1280, h: 440 }, { p: s.intro, t: s.t });
        var gp = E.inOut(s.at(1));
        // ladera rural lejana: copas que se vuelven más densas
        var r = env.rng(9);
        for (var i = 0; i < 9; i++) {
          var x = 700 + i * 26 + (r() - 0.5) * 10, y = 392 + (i % 3) * 9;
          var extra = i % 2 ? gp : 1;
          if (extra > 0) S.tree(ctx, { x: x, y: y, size: (34 + 16 * gp) * (i % 2 ? Math.max(0.2, extra) : 1), seed: 40 + i, kind: 'dense', t: s.t, stipple: false });
        }
        // un corredor con vacíos hacia la derecha
        if (gp > 0) {
          var xs = [960, 986, 1062, 1088, 1164];
          xs.forEach(function (cx, k) {
            S.withAppear(ctx, 'illus', E.clamp(gp * 2 - k * 0.2), function () { S.tree(ctx, { x: cx, y: 404 + (k % 2) * 5, size: 36, seed: 70 + k, kind: 'scalloped', t: s.t, stipple: false }); });
          });
          S.stroke(ctx, [[1010, 398], [1040, 398]], { role: 'ink', width: 1.4, dash: [4, 4], p: gp });
          S.stroke(ctx, [[1112, 398], [1142, 398]], { role: 'ink', width: 1.4, dash: [4, 4], p: gp });
        }
        badgeEsquema(ctx, env, 1208, 300, s.intro, 'right');
        S.person(ctx, env.cast('hernan'), { pose: s.line >= 0 ? 'pointing-valley' : 'standing', x: 250, y: 600, height: 280, p: s.intro });
        S.person(ctx, env.cast('lucia'), { pose: 'leaning', x: 420, y: 600, height: 270, p: s.intro });
        return { on: { hernan: { x: 250, y: 320 }, lucia: { x: 420, y: 330 } } };
      },

      // Draw: compare background with two columns; the left column, titled «En el mapa», holds a map panel with the dashed
      // `corredor` (version «dibujado»); the right column, titled «En el territorio», shows the strip of trees with gaps
      // (version «en el territorio»); on line 1 the stamp `stamp-corredor` slides in at the bottom.
      corredor: function (ctx, s, env) {
        var S = env.style;
        S.labelBar(ctx, env.text('t1'), { x: 40, y: 50, size: 22, p: s.intro });
        var box = { x: 40, y: 110, w: 560, h: 290 };
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner, pp) { env.course.corredorDibujado(ctx, inner, { p: pp }); } });
        S.text(ctx, env.text('t2'), { x: 40, y: 428, size: 17, role: 'ink-soft', weight: 700, p: s.intro });
        S.labelBar(ctx, env.text('t3'), { x: 680, y: 50, size: 22, p: s.intro });
        var tb = { x: 680, y: 110, w: 560, h: 290 };
        env.course.corredorTerritorio(ctx, tb, { p: s.intro, t: s.t });
        S.text(ctx, env.text('t4'), { x: 680, y: 428, size: 17, role: 'ink-soft', weight: 700, p: s.intro });
        env.zones.push(box, tb);
        var m = env.course.stamp(ctx, 'stamp-corredor', 0, 0, { measureOnly: true, w: 520 });
        env.course.stamp(ctx, 'stamp-corredor', 640 - m.w / 2, 452, { p: s.at(0), w: 520 });
      },

      // Draw: figure background; on line 1 the figure card `P4-C21` appears at the center, and a small `ave` sign flies a dashed
      // path between two tree groups at the lower right, outside the card, labeled «Modelo para un ave».
      aves: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p = s.at(0);
        var a = env.cards.draw(ctx, 'P4-C21', { x: 300, y: 50, w: 600, p: p, compact: true });
        env.zones.push(a);
        var gp = E.clamp(p * 1.6 - 0.4);
        if (gp > 0) {
          var base = 575, xa = 960, xb = 1180;
          S.withAppear(ctx, 'illus', gp, function () {
            S.fill(ctx, S.rectPath(xa - 60, base - 4, 300, 10, 4), { role: 'accent-4' });
            [-24, 0, 24].forEach(function (d, k) { S.tree(ctx, { x: xa + d, y: base + (k % 2) * 4, size: 74, seed: 3 + k, t: s.t, stipple: false }); });
            [-24, 0, 24].forEach(function (d, k) { S.tree(ctx, { x: xb + d, y: base + (k % 2) * 4, size: 74, seed: 9 + k, t: s.t, stipple: false }); });
          });
          var path = [[xa + 30, base - 80], [xa + 80, base - 120], [xb - 80, base - 120], [xb - 30, base - 80]];
          S.stroke(ctx, { pts: path, smooth: true }, { role: 'ink-soft', width: 1.4, dash: [6, 6], p: gp });
          var kk = E.inOut(E.clamp(p * 1.6 - 0.6));
          var bx = xa + 30 + (xb - xa - 60) * kk;
          S.sign(ctx, 'ave', { x: bx, y: base - 84 - 40 * Math.sin(kk * Math.PI), size: 38 });
          callout(ctx, env, env.text('t1'), xb + 30, base - 200, gp, { size: 17, align: 'right' });
        }
      },

      // Draw: figure background; on line 1 the figure card `P4-C29` appears at the left; on line 2 four tag cards appear at the
      // right, labeled «Planes de cuencas», «Humedales urbanos», «Corredores de conectividad» and «Retiro de 30 m», each with a
      // half-filled check box labeled «No incluido o solo en parte»; on line 3 a small `retiro` sign appears under the cards,
      // with the bands on both banks and the label «Retiro: franja libre a cada lado del cauce».
      determinantes: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.draw(ctx, 'P4-C29', { x: M, y: 70, w: 440, p: s.at(0) });
        env.zones.push(a);
        var c33 = env.cards.draw(ctx, 'P4-C33', { x: M, y: a.y + a.h + 14, w: 440, compact: true, maxHead: 30, p: s.at(1) });
        env.zones.push(c33);
        var tp = s.at(1);
        for (var i = 0; i < 4; i++) {
          var pi = E.clamp(tp * 2.4 - i * 0.45);
          if (pi <= 0) continue;
          var bx = { x: 560 + (i % 2) * 330, y: 70 + Math.floor(i / 2) * 136, w: 310, h: 120 };
          env.course.tag(ctx, bx, env.text('t' + (i + 1)), { p: pi, size: 19, tilt: i % 2 ? 1.5 : -1.5 });
          S.withAppear(ctx, 'fade', pi, function () {
            var cx = bx.x + 14, cy = bx.y + bx.h - 40;
            S.fill(ctx, S.rectPath(cx, cy, 22, 22, 3), { role: 'ground' });
            S.fill(ctx, S.rectPath(cx, cy + 11, 22, 11, 0), { role: 'accent-5' });
            S.stroke(ctx, S.rectPath(cx, cy, 22, 22, 3), { role: 'ink', width: 2 });
            S.text(ctx, env.text('t5'), { x: cx + 32, y: cy + 16, size: 14, weight: 700, maxWidth: bx.w - 60 });
          });
        }
        env.course.retiro(ctx, { x: 560, y: 330, w: 560, h: 210 }, {
          scale: env.scene.scale, p: s.at(2), t: s.t, label: env.text('t6'),
          bands: [{ m: 30, p: E.clamp(s.at(2) * 2 - 0.4), pattern: 'stripes' }]
        });
      },

      // Draw: explain background; on line 1 a large panel labeled «Estructura de 2014 · base mínima» appears, and new pieces
      // attach to its edges, labeled «Áreas de normas y estudios posteriores», while a separate panel slides aside, labeled
      // «Estructura complementaria, aparte»; on line 2 the label «Propuesta: debe concertarse» appears under the panels; the
      // badge «Esquema».
      'base-minima': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p = s.at(0);
        var B = { x: 170, y: 200, w: 460, h: 250 };
        var bp = E.clamp(p * 2.5);
        if (bp > 0) {
          S.withAppear(ctx, 'illus', bp, function () {
            S.fill(ctx, S.rectPath(B.x, B.y, B.w, B.h, 18), { role: 'accent-6' });
            S.patternFill(ctx, S.rectPath(B.x, B.y, B.w, B.h, 18), 'dots', { alpha: 0.35 });
            S.stroke(ctx, S.rectPath(B.x, B.y, B.w, B.h, 18), { role: 'ink', width: 2.4 });
            for (var k = 0; k < 6; k++) S.tree(ctx, { x: B.x + 70 + k * 64, y: B.y + B.h - 34 + (k % 2) * 8, size: 70, seed: 20 + k, t: s.t, stipple: false });
          });
          S.labelBar(ctx, env.text('t1'), { x: B.x + 20, y: B.y + 22, size: 18, role: 'accent-1', p: bp, maxWidth: B.w - 40 });
        }
        // piezas nuevas que se suman a los bordes
        var pieces = [
          { x: B.x + B.w - 6, y: B.y + 30, w: 90, h: 80, dx: 60, dy: 0 },
          { x: B.x + 90, y: B.y - 64, w: 140, h: 70, dx: 0, dy: -50 },
          { x: B.x - 74, y: B.y + 130, w: 80, h: 90, dx: -60, dy: 0 },
          { x: B.x + 260, y: B.y + B.h - 6, w: 150, h: 60, dx: 0, dy: 50 }
        ];
        pieces.forEach(function (pc, i) {
          var pi = E.clamp(p * 4 - 1 - i * 0.4);
          if (pi <= 0) return;
          var k = 1 - E.out(pi);
          var x = pc.x + pc.dx * k, y = pc.y + pc.dy * k;
          ctx.save(); ctx.globalAlpha *= E.clamp(pi * 3);
          S.fill(ctx, S.rectPath(x, y, pc.w, pc.h, 12), { role: 'accent-9' });
          S.patternFill(ctx, S.rectPath(x, y, pc.w, pc.h, 12), 'stripes', { alpha: 0.5 });
          S.stroke(ctx, S.rectPath(x, y, pc.w, pc.h, 12), { role: 'ink', width: 2 });
          ctx.restore();
        });
        var lp = E.clamp(p * 4 - 2.4);
        callout(ctx, env, env.text('t2'), B.x + 250, 70, lp, { size: 18, to: [B.x + 200, B.y - 64], from: [B.x + 300, 102] });
        // estructura complementaria, aparte
        var sp = E.clamp(p * 3 - 1.5);
        if (sp > 0) {
          var sx = E.lerp(B.x + B.w - 120, 870, E.inOut(sp));
          var C = { x: sx, y: 230, w: 300, h: 190 };
          ctx.save(); ctx.globalAlpha *= E.clamp(sp * 3);
          S.fill(ctx, S.rectPath(C.x, C.y, C.w, C.h, 16), { role: 'accent-4' });
          S.stroke(ctx, S.rectPath(C.x, C.y, C.w, C.h, 16), { role: 'ink', width: 2, dash: [8, 6] });
          for (var t = 0; t < 4; t++) S.tree(ctx, { x: C.x + 50 + t * 66, y: C.y + C.h - 24, size: 54, seed: 50 + t, kind: 'scalloped', t: s.t, stipple: false });
          ctx.restore();
          S.text(ctx, env.text('t3'), { x: C.x + 18, y: C.y + 34, size: 18, weight: 700, maxWidth: C.w - 36, p: E.clamp(sp * 2 - 1) });
        }
        S.labelBar(ctx, env.text('t4'), { x: 170, y: 528, size: 22, p: s.at(1) });
        badgeEsquema(ctx, env, 1208, 40, s.intro, 'right');
        env.zones.push(B);
      },

      // Draw: figure background; on line 1 the figure card `P4-C35` appears at the left and the sign `retiro` at the right, with
      // the 30 m band on an exact scale from 0 to 30 m and small houses along part of the band, labeled «Tramos con ocupación»;
      // on line 2 LUCÍA appears at the lower left, outside the card (pose: asking); on line 3 the note «No equivale
      // necesariamente a área nueva» appears under the card.
      retiros: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p = s.at(0);
        var a = env.cards.draw(ctx, 'P4-C35', { x: M, y: 50, w: 500, compact: true, p: p });
        env.zones.push(a);
        var box = { x: 620, y: 90, w: 590, h: 440 };
        var hp = E.clamp(p * 2 - 0.8);
        var houses = [];
        [0.42, 0.52, 0.62, 0.72].forEach(function (f, i) {
          houses.push({ f: f, side: -1, m: 14, p: E.clamp(hp * 2 - i * 0.25) });
          houses.push({ f: f + 0.05, side: 1, m: 12, p: E.clamp(hp * 2 - i * 0.25 - 0.1) });
        });
        var r = env.course.retiro(ctx, box, {
          scale: env.scene.scale, p: p, t: s.t,
          bands: [{ m: 30, p: E.clamp(p * 2 - 0.4), pattern: 'stripes' }],
          houses: houses
        });
        if (r && hp > 0) {
          var y0 = r.top - 30 * r.pxPerM - 8;
          S.stroke(ctx, [[box.x + box.w * 0.38, y0 + 6], [box.x + box.w * 0.38, y0], [box.x + box.w * 0.8, y0], [box.x + box.w * 0.8, y0 + 6]], { role: 'ink', width: 1.8, p: hp });
          callout(ctx, env, env.text('t1'), box.x + box.w * 0.59, y0 - 38, hp, { size: 17, align: 'center', role: 'accent-9' });
        }
        env.zones.push(box);
        S.labelBar(ctx, env.text('t2'), { x: 240, y: a.y + a.h + 18, size: 16, role: 'accent-1', p: s.at(2), maxWidth: 340 });
        S.person(ctx, env.cast('lucia'), { pose: 'asking', x: 140, y: 610, height: 220, p: s.at(1) });
        return { on: { lucia: { x: 140, y: 610 - 220 } } };
      },

      // Draw: figure background; on line 1 the figure card `P4-C45` appears at the left with the legend chip `distrito`; on
      // line 2 the sign `escalas` appears at the right with the `distrito` frame inside the `valle` frame, and a corridor line
      // crosses from one to the other, labeled «Corredores con los municipios vecinos».
      metropolitana: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.draw(ctx, 'P4-C45', { x: M, y: 90, w: 520, p: s.at(0) });
        env.zones.push(a);
        var box = { x: 660, y: 70, w: 548, h: 430 };
        env.course.escalas(ctx, box, { p: s.at(1), focus: 'distrito' });
        env.zones.push(box);
        var cp = E.clamp(s.at(1) * 2 - 1);
        if (cp > 0) {
          var pts = [[905, 300], [960, 335], [1030, 360], [1100, 410], [1140, 430]];
          S.stroke(ctx, { pts: pts, smooth: true }, { role: 'accent-7', width: 10, p: cp, alpha: 0.5 });
          S.stroke(ctx, { pts: pts, smooth: true }, { role: 'ink', width: 2, dash: [8, 6], p: cp });
          [[930, 318], [1000, 350], [1070, 390], [1120, 420]].forEach(function (t, k) {
            S.withAppear(ctx, 'illus', E.clamp(cp * 2 - k * 0.25), function () { S.tree(ctx, { x: t[0], y: t[1], size: 30, seed: 80 + k, stipple: false }); });
          });
          callout(ctx, env, env.text('t1'), 1208, 522, cp, { size: 18, align: 'right', to: [1110, 425], from: [1090, 522] });
        }
      },

      // Draw: recap background; LUCÍA and HERNÁN stand on the ridge (poses: notebook in hand, hat in hand); on line 1 the stamp
      // `stamp-insumo` slides in; on line 2 the motto appears on the label bar: «NO BASTA CON DIBUJARLA EN EL MAPA».
      cierre: function (ctx, s, env) {
        var S = env.style;
        S.withAppear(ctx, 'illus', s.intro, function () { S.hill(ctx, 640, 650, 860, 120); });
        env.course.stamp(ctx, 'stamp-insumo', 80, 60, { p: s.at(0), w: 420 });
        S.labelBar(ctx, env.text('t1'), { x: 80, y: 300, size: 32, role: 'accent-1', p: s.at(1), maxWidth: 560 });
        S.person(ctx, env.cast('lucia'), { pose: 'notebook', x: 960, y: 560, height: 250, p: s.intro });
        S.person(ctx, env.cast('hernan'), { pose: 'hat-in-hand', x: 1110, y: 560, height: 262, facing: 'left', p: s.intro });
        return { on: { lucia: { x: 960, y: 560 - 250 }, hernan: { x: 1110, y: 560 - 262 } } };
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
