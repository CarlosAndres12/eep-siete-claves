/* V5 · «¿Dónde muestran los satélites señales de urbanización?» (spec §11, V5). Señales satelitales (grupo C del Punto 3):
   solo sus cifras. Solo dibujo: los textos vienen de js/data/videos.js (`texts`, t1…tn en el orden del brief), las cifras del
   banco y las personas del reparto. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var M = 72;
  var DOTS = null; // puntos de señal precalculados en setup (fracciones del corte del valle)

  function badge(ctx, env, text, glyph, x, y, p, align) {
    return env.style.mark(ctx, 'badge', { x: x, y: y }, { text: text, variant: 'state', glyph: glyph, size: 14, p: p, align: align });
  }
  // Punto de señal sobre papel (polo A): relleno machine-glow-1 con contorno ink para que se lea.
  function signalDot(S, ctx, x, y, r, a) {
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = S.role('machine-glow-1'); ctx.strokeStyle = S.role('ink'); ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  function glowDot(S, ctx, x, y, r, a) {
    ctx.save(); ctx.globalAlpha *= a;
    ctx.fillStyle = S.role('machine-glow-1', 0.3); ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = S.role('machine-glow-1'); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // Pictogramas finos del polo B: hoja y techo. (x, y) = centro, s = tamaño.
  function oLeaf(S, ctx, x, y, s, p, alpha) {
    ctx.save(); ctx.globalAlpha *= alpha;
    S.mapLine(ctx, { pts: [[x, y + s * 0.45], [x - s * 0.32, y], [x, y - s * 0.45], [x + s * 0.32, y]], smooth: true, closed: true }, { p: p, weight: 1.8 });
    S.mapLine(ctx, [[x, y + s * 0.5], [x, y - s * 0.3]], { p: p, weight: 1.2 });
    ctx.restore();
  }
  function oRoof(S, ctx, x, y, s, p, alpha, glow) {
    ctx.save(); ctx.globalAlpha *= alpha;
    var r = glow ? 'machine-glow-1' : 'machine-line';
    S.stroke(ctx, [[x - s * 0.45, y - s * 0.05], [x, y - s * 0.45], [x + s * 0.45, y - s * 0.05]], { role: r, width: 2, p: p });
    S.stroke(ctx, [[x - s * 0.32, y - s * 0.12], [x - s * 0.32, y + s * 0.38], [x + s * 0.32, y + s * 0.38], [x + s * 0.32, y - s * 0.12]], { role: r, width: 2, p: p });
    ctx.restore();
  }
  function arrow(S, ctx, x0, y, x1, p) {
    S.mapLine(ctx, [[x0, y], [x1, y]], { p: p });
    if (p >= 1) S.mapLine(ctx, [[x1 - 9, y - 7], [x1, y], [x1 - 9, y + 7]], {});
  }
  // Pictogramas del polo A para «no solo urbano»; (x, y) = base centrada, s = alto.
  function pMine(S, ctx, x, y, s, env) {
    var w = s * 1.4;
    for (var k = 0; k < 3; k++) {
      var inset = k * w * 0.14, top = y - s * 0.6 + k * s * 0.2;
      S.fill(ctx, [[x - w / 2 + inset, top], [x + w / 2 - inset, top], [x + w / 2 - inset - w * 0.06, top + s * 0.2], [x - w / 2 + inset + w * 0.06, top + s * 0.2]], { role: k % 2 ? 'accent-4' : 'ground-2' });
      S.stroke(ctx, [[x - w / 2 + inset, top], [x + w / 2 - inset, top]], { role: 'ink', width: 1.4 });
    }
    S.fill(ctx, [[x - w / 2 - 10, y - s * 0.6], [x - w / 2, y - s * 0.6], [x - w * 0.29, y], [x - w / 2 - 10, y]], { role: 'accent-6' });
    S.fill(ctx, [[x + w / 2 + 10, y - s * 0.6], [x + w / 2, y - s * 0.6], [x + w * 0.29, y], [x + w / 2 + 10, y]], { role: 'accent-6' });
    env.course.signs.camion(ctx, x + s * 0.1, y - s * 0.02, s * 0.22);
  }
  function pBare(S, ctx, x, y, s) {
    var path = { pts: [[x - s * 0.75, y], [x - s * 0.6, y - s * 0.32], [x - s * 0.1, y - s * 0.42], [x + s * 0.5, y - s * 0.34], [x + s * 0.75, y]], smooth: true, closed: true };
    S.fill(ctx, path, { role: 'accent-4' });
    [[-0.4, -0.12], [-0.05, -0.22], [0.3, -0.1], [0.1, -0.06], [-0.25, -0.26]].forEach(function (d) {
      S.fill(ctx, S.ellipsePath(x + d[0] * s, y + d[1] * s, s * 0.06, s * 0.035), { role: 'ink-soft' });
    });
    S.tree(ctx, { x: x + s * 0.85, y: y, size: s * 0.5, seed: 3 });
  }
  function pFarm(S, ctx, x, y, s) {
    var w = s * 1.5;
    var field = { pts: [[x - w / 2, y], [x - w * 0.3, y - s * 0.4], [x, y - s * 0.52], [x + w * 0.3, y - s * 0.4], [x + w / 2, y]], smooth: true, closed: true };
    S.fill(ctx, field, { role: 'accent-1' });
    ctx.save();
    S.trace(ctx, field); ctx.clip();
    for (var k = 0; k < 5; k++) {
      var off = (k - 2) * w * 0.16;
      S.stroke(ctx, { pts: [[x + off * 1.6, y + 2], [x + off * 1.1, y - s * 0.25], [x + off * 0.6, y - s * 0.55]], smooth: true }, { role: 'accent-7', width: 3 });
    }
    ctx.restore();
    S.sign(ctx, 'canasta', { x: x + w * 0.55, y: y, size: s * 0.36 });
  }

  EEP.videos.v5 = {
    setup: function (env) {
      var r = env.rng(53);
      DOTS = { fondo: [], oeste: [] };
      for (var i = 0; i < 26; i++) DOTS.fondo.push([0.42 + r() * 0.16, r()]);
      for (var k = 0; k < 14; k++) DOTS.oeste.push([0.17 + r() * 0.2, r()]);
    },
    scenes: {
      // Draw: title background; on line 1 the title «¿DÓNDE MUESTRAN LOS SATÉLITES SEÑALES DE URBANIZACIÓN?»; on line 2 the figure
      // card `P3-C36`, with the line of `P3-C37` beneath it, appears at the right with the legend chip `distrito`.
      gancho: function (ctx, s, env) {
        env.style.title(ctx, env.text('t1'), { x: M, y: 190, size: 56, maxWidth: 660, p: s.at(0) });
        var a = env.cards.draw(ctx, 'P3-C36', { x: 790, y: 120, w: 418, compact: true, p: s.at(1) });
        var b = env.cards.draw(ctx, 'P3-C37', { x: 790, y: a.y + a.h + 8, w: 418, compact: true, maxHead: 30, p: s.at(1) });
        env.zones.push(a, b);
      },

      // Draw: a map panel at full width; on line 1 a small patch shows a leaf pictogram fading and a roof pictogram brightening, with
      // the labels «Baja la vegetación» and «Sube lo construido»; on line 2 the same change repeats in a second small panel labeled
      // «Segundo periodo», and both panels get a check made of two straight strokes with the label «Alta confianza».
      senales: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: M, y: 50, w: 1136, h: 480 };
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner) {
          var p1 = s.at(0), p2 = s.at(1);
          [0, 1].forEach(function (k) {
            var pk = k === 0 ? p1 : p2;
            if (pk <= 0) return;
            var bw = inner.w / 2 - 40, bx = inner.x + 20 + k * (inner.w / 2), by = inner.y + 30, bh = inner.h - 60;
            S.mapLine(ctx, S.rectPath(bx, by, bw, bh, 8), { p: E.clamp(pk * 3) });
            if (k === 1) S.mapLabel(ctx, env.text('t3'), bx + 16, by + 30, { p: pk, size: 15 });
            var ch = E.clamp(pk * 2 - 0.4);
            var cy = by + bh * 0.48;
            oLeaf(S, ctx, bx + bw * 0.25, cy, 96, E.clamp(pk * 3), 1 - ch * 0.75);
            arrow(S, ctx, bx + bw * 0.4, cy, bx + bw * 0.6, E.clamp(pk * 3 - 0.6));
            oRoof(S, ctx, bx + bw * 0.75, cy, 96, E.clamp(pk * 3 - 0.6), 0.35 + ch * 0.65, ch > 0.5);
            if (ch > 0.5) { ctx.save(); ctx.globalAlpha *= (ch - 0.5) * 2; ctx.fillStyle = S.role('machine-glow-1', 0.16); ctx.beginPath(); ctx.arc(bx + bw * 0.75, cy, 70, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
            S.mapLabel(ctx, env.text('t1'), bx + bw * 0.25, cy + 96, { p: E.clamp(pk * 3 - 0.3), size: 15, align: 'center' });
            S.mapLabel(ctx, env.text('t2'), bx + bw * 0.75, cy + 96, { p: E.clamp(pk * 3 - 0.9), size: 15, align: 'center' });
            // marca de alta confianza: dos trazos rectos
            var cp = E.clamp(p2 * 2 - 0.8);
            if (cp > 0) {
              var mx = bx + bw - 60, my = by + 46;
              S.stroke(ctx, [[mx - 20, my], [mx - 6, my + 14]], { role: 'machine-glow-1', width: 4, p: E.clamp(cp * 2) });
              S.stroke(ctx, [[mx - 6, my + 14], [mx + 22, my - 18]], { role: 'machine-glow-1', width: 4, p: E.clamp(cp * 2 - 1) });
            }
          });
          var lp = E.clamp(p2 * 2 - 1.2);
          S.mapLabel(ctx, env.text('t4'), inner.x + inner.w / 2, inner.y + inner.h - 4, { p: lp, size: 18, align: 'center' });
        } });
        env.zones.push(box);
      },

      // Draw: a map panel at full width; on line 1 a night strip at the top of the panel shows small lights in `machine-glow-1` over
      // some patches, labeled «Luces nocturnas · una sola fecha», and one patch without light shows a roof pictogram labeled «Sin
      // alumbrado todavía»; on line 2 LUCÍA appears outside the panel at the lower left (pose: asking); on line 3 the label
      // «Probabilidad, no confirmación» appears under the panel.
      luces: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: M, y: 56, w: 1136, h: 300 };
        var p1 = s.at(0);
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner, pp) {
          var stripH = 70;
          S.mapLine(ctx, [[inner.x, inner.y + stripH], [inner.x + inner.w, inner.y + stripH]], { p: pp, dashed: true });
          S.mapLabel(ctx, env.text('t1'), inner.x + 12, inner.y + 24, { p: p1, size: 15 });
          var xs = [0.12, 0.27, 0.42, 0.57, 0.72, 0.88];
          xs.forEach(function (u, i) {
            var cx = inner.x + inner.w * u, cy = inner.y + stripH + 110 + (i % 2) * 40;
            S.mapLine(ctx, S.ellipsePath(cx, cy, 62, 36, 0.2 * (i % 3)), { p: E.clamp(pp * 2 - i * 0.1) });
            var lit = i !== 3;
            var li = E.clamp(p1 * 3 - 0.4 - i * 0.2);
            if (lit && li > 0) {
              for (var k = 0; k < 4; k++) glowDot(S, ctx, cx - 24 + k * 16, inner.y + 36 + (k % 2) * 12, 3, li);
              S.stroke(ctx, [[cx, inner.y + stripH + 4], [cx, cy - 40]], { role: 'machine-glow-1', width: 1, dash: [2, 5], alpha: 0.6, p: li });
            }
            if (!lit) {
              oRoof(S, ctx, cx, cy, 42, E.clamp(p1 * 3 - 1.2), 1, false);
              S.mapLabel(ctx, env.text('t2'), cx, cy + 62, { p: E.clamp(p1 * 3 - 1.4), size: 14, align: 'center' });
            }
          });
        } });
        env.zones.push(box);
        var m = S.labelBar(ctx, env.text('t3'), { x: 0, y: 0, size: 24, measureOnly: true });
        S.labelBar(ctx, env.text('t3'), { x: 1208 - m.w, y: box.y + box.h + 30, size: 24, role: 'accent-1', p: s.at(2) });
        S.person(ctx, env.cast('lucia'), { pose: 'asking', x: 200, y: 620, height: 210, p: s.at(1) });
        return { on: { lucia: { x: 200, y: 620 - 210 } } };
      },

      // Draw: explain background; the sign `valle-corte`, labeled «Distrito de Medellín · esquema» with the legend chip `distrito`,
      // west on the left; on line 1 dots in `machine-glow-1` gather on the valley floor along the central corridor and its main
      // roads, labeled «Corredor central y ejes viales», and more dots appear on the left slope, labeled «Costado occidental»; the
      // badge «Esquema».
      donde: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var vb = { x: 80, y: 250, w: 1120, h: 320 };
        var g = env.course.valleCorte(ctx, vb, { p: s.intro, t: s.t, badge: false });
        badge(ctx, env, env.text('t4'), 'g-esquema', 1208, 54, s.intro, 'right');
        var lb = S.labelBar(ctx, env.text('t1'), { x: M, y: 50, size: 20, p: s.intro });
        env.cards.chip(ctx, 'distrito', lb.x + lb.w + 14, lb.y + 4, { alpha: s.intro });
        var p1 = s.at(0);
        var pf = E.clamp(p1 * 2), po = E.clamp(p1 * 2 - 0.9);
        DOTS.fondo.forEach(function (d, i) {
          var a = E.clamp(pf * 2 - i * 0.05);
          if (a <= 0) return;
          var gather = E.out(a);
          var x = g.px(d[0]), y0 = g.base - 8 - d[1] * vb.h * 0.06 - Math.abs(d[0] - 0.5) * vb.h * 0.9;
          var sx = g.px(0.5) + (d[0] - 0.5) * vb.w * 1.6;
          signalDot(S, ctx, E.lerp(sx, x, gather), y0, 5, a);
        });
        DOTS.oeste.forEach(function (d, i) {
          var a = E.clamp(po * 2 - i * 0.08);
          if (a <= 0) return;
          signalDot(S, ctx, g.px(d[0]), g.hAt(d[0]) + 10 + d[1] * 30, 5, a);
        });
        S.labelBar(ctx, env.text('t2'), { x: g.px(0.5) - 40, y: 120, size: 18, role: 'accent-1', p: pf });
        S.stroke(ctx, [[g.px(0.5), 156], [g.px(0.5), g.base - vb.h * 0.4]], { role: 'ink', width: 1.4, p: pf });
        S.labelBar(ctx, env.text('t3'), { x: g.px(0.16), y: 120, size: 18, role: 'accent-1', p: po });
        S.stroke(ctx, [[g.px(0.24), 156], [g.px(0.27), g.hAt(0.27) - 6]], { role: 'ink', width: 1.4, p: po });
      },

      // Draw: explain background with the same `valle-corte` scheme of the Distrito; on line 1 some patches on both slopes take the
      // `waves` pattern, labeled «Cambio no concluyente», and the label «No se atribuye a urbanización» appears beside them.
      'no-concluyente': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var vb = { x: 80, y: 250, w: 1120, h: 320 };
        var g = env.course.valleCorte(ctx, vb, { p: s.intro, t: s.t, badge: false });
        badge(ctx, env, env.data.site.ui.esquema, 'g-esquema', 1208, 40, s.intro, 'right');
        var p1 = s.at(0);
        var spots = [0.2, 0.34, 0.68, 0.79];
        spots.forEach(function (f, i) {
          var a = E.clamp(p1 * 3 - i * 0.3);
          if (a <= 0) return;
          var cx = g.px(f), cy = g.hAt(f) + 34;
          var path = S.ellipsePath(cx, cy, 52, 26, f < 0.5 ? 0.45 : -0.45);
          ctx.save(); ctx.globalAlpha *= S.appear('fade', a).alpha;
          S.mark(ctx, 'pattern', {}, { path: path, variant: 'waves', ground: 'ground', outline: true });
          ctx.restore();
        });
        var lp = E.clamp(p1 * 3 - 1);
        var lb = S.labelBar(ctx, env.text('t1'), { x: 240, y: 90, size: 22, p: lp });
        S.stroke(ctx, [[lb.x + 80, lb.y + lb.h], [g.px(0.2), g.hAt(0.2) + 8]], { role: 'ink', width: 1.2, p: lp });
        S.stroke(ctx, [[lb.x + lb.w - 20, lb.y + lb.h], [g.px(0.68), g.hAt(0.68) + 8]], { role: 'ink', width: 1.2, p: lp });
        S.labelBar(ctx, env.text('t2'), { x: lb.x + lb.w + 20, y: 94, size: 18, role: 'accent-1', p: E.clamp(p1 * 3 - 1.8) });
      },

      // Draw: figure background; on line 1 the figure cards `P3-C40` and `P3-C41` appear side by side, each with the legend chip
      // `valle`.
      metropolitano: function (ctx, s, env) {
        var E = env.ease;
        var a = env.cards.draw(ctx, 'P3-C40', { x: 90, y: 110, w: 520, p: E.clamp(s.at(0) * 2) });
        var b = env.cards.draw(ctx, 'P3-C41', { x: 670, y: 110, w: 520, p: E.clamp(s.at(0) * 2 - 0.5) });
        env.zones.push(a, b);
      },

      // Draw: explain background; on line 1 three pictograms appear in a row, labeled «Superficies mineras», «Suelo desnudo» and
      // «Posibles usos agropecuarios», next to a small roof pictogram labeled «Urbanización»; the badge «Esquema».
      'no-solo-urbano': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p1 = s.at(0);
        var items = [[220, pMine, 't1'], [500, pBare, 't2'], [780, pFarm, 't3']];
        items.forEach(function (it, i) {
          var a = E.clamp(p1 * 4 - i * 0.7);
          S.withAppear(ctx, 'illus', a, function () { it[1](S, ctx, it[0], 360, 120, env); });
          S.text(ctx, env.text(it[2]), { x: it[0], y: 410, size: 20, weight: 700, align: 'center', maxWidth: 220, p: a });
        });
        var rp = E.clamp(p1 * 4 - 2.4);
        S.stroke(ctx, [[960, 200], [960, 470]], { role: 'ink-soft', width: 1.2, p: s.intro });
        S.withAppear(ctx, 'illus', rp, function () { S.building(ctx, { x: 1050, y: 300, w: 60, h: 60 }, { kind: 'casa', roof: 'accent-5' }); });
        S.text(ctx, env.text('t4'), { x: 1080, y: 410, size: 20, weight: 700, align: 'center', p: rp });
        badge(ctx, env, env.text('t5'), 'g-esquema', 1208, 60, s.intro, 'right');
      },

      // Draw: explain background; the sign `carpetas` with three closed folders labeled «Esta medición», «Alta resolución» and «Mapas
      // de coberturas»; on line 1 the label bar «NO SE SUMAN NI SE COMPARAN» appears below them; on line 2 the second folder opens a
      // little to show roofs gathered on high slopes, labeled «Corregimientos».
      otras: function (ctx, s, env) {
        var S = env.style;
        var box = { x: 140, y: 190, w: 1000, h: 300 };
        var op = s.at(1);
        env.course.carpetas(ctx, box, {
          labels: [env.text('t1'), env.text('t2'), env.text('t3')], p: s.intro, open: [0, op * 0.9, 0],
          draw: [null, function (c, b) {
            S.fill(c, S.rectPath(b.x, b.y, b.w, b.h, 6), { role: 'ground' });
            var pts = [[b.x, b.y + b.h * 0.25], [b.x + b.w * 0.22, b.y + b.h * 0.35], [b.x + b.w * 0.45, b.y + b.h * 0.9], [b.x + b.w * 0.55, b.y + b.h * 0.9], [b.x + b.w * 0.78, b.y + b.h * 0.35], [b.x + b.w, b.y + b.h * 0.25], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h]];
            S.fill(c, pts, { role: 'accent-6' });
            [[0.06, 0.24], [0.14, 0.27], [0.8, 0.27], [0.88, 0.24]].forEach(function (q) {
              S.building(c, { x: b.x + b.w * q[0], y: b.y + b.h * q[1] - 16, w: 16, h: 16 }, { kind: 'casa', roof: 'accent-5' });
            });
          }, null]
        });
        S.text(ctx, env.text('t5'), { x: 640, y: 96, size: 18, weight: 700, align: 'center', p: op });
        var m = S.labelBar(ctx, env.text('t4'), { x: 0, y: 0, size: 26, measureOnly: true });
        S.labelBar(ctx, env.text('t4'), { x: 640 - m.w / 2, y: 512, size: 26, p: s.at(0) });
      },

      // Draw: a map panel at the right; on line 1 the satellite makes a loop labeled «Seguimiento periódico» and pins light up,
      // labeled «Alertas tempranas de urbanización»; on line 2 the stamp `stamp-insumo` slides in at the lower left.
      propuesta: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: 560, y: 50, w: 648, h: 440 };
        var p1 = s.at(0);
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner, pp) {
          var cx = inner.x + inner.w / 2, cy = inner.y + inner.h * 0.42, rx = inner.w * 0.4, ry = inner.h * 0.3;
          S.stroke(ctx, S.ellipsePath(cx, cy, rx, ry), { role: 'machine-line', width: 1, dash: [3, 7], alpha: 0.7, p: E.clamp(p1 * 3) });
          var ang = -Math.PI / 2 + E.clamp(p1 * 1.5) * Math.PI * 2 + s.t * 0.15;
          env.course.satelite(ctx, { x: cx + Math.cos(ang) * rx, y: cy + Math.sin(ang) * ry, size: 34, p: E.clamp(p1 * 3), scan: true, scanLength: 50, t: s.t });
          S.mapLabel(ctx, env.text('t1'), cx, cy - ry - 18, { p: E.clamp(p1 * 3), size: 15, align: 'center' });
          [[0.3, 0.5], [0.48, 0.36], [0.62, 0.55], [0.4, 0.62]].forEach(function (q, i) {
            var pp2 = E.clamp(p1 * 3 - 1 - i * 0.3);
            var x = inner.x + inner.w * q[0], y = inner.y + inner.h * q[1];
            S.mapLine(ctx, S.circlePath(x, y - 12, 7), { p: pp2 });
            S.mapLine(ctx, [[x, y - 5], [x, y + 6]], { p: pp2 });
            if (pp2 > 0) glowDot(S, ctx, x, y - 12, 3, pp2);
          });
          S.mapLabel(ctx, env.text('t2'), cx, inner.y + inner.h - 22, { p: E.clamp(p1 * 3 - 2), size: 15, align: 'center' });
        } });
        env.zones.push(box);
        env.course.stamp(ctx, 'stamp-insumo', M, 430, { p: s.at(1), w: 440 });
      },

      // Draw: recap background; on line 1 the stamp `stamp-probabilidad` lands and the motto appears on the label bar: «SON
      // PROBABILIDADES, NO ÁREAS URBANIZADAS CONFIRMADAS».
      cierre: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        S.hills(ctx, { x: 460, y: 500, w: 820, h: 220 }, { seed: 9, layers: 2, roles: [['accent-6', 'accent-7'], ['accent-7', 'accent-6']] });
        env.course.stamp(ctx, 'stamp-probabilidad', 520, 90, { p: E.clamp(s.at(0) * 2), w: 560 });
        S.labelBar(ctx, env.text('t1'), { x: 520, y: 270, size: 30, maxWidth: 680, p: E.clamp(s.at(0) * 2 - 0.8) });
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
