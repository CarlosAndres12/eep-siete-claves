/* V4 · «¿Cuánto creció el suelo construido en el Valle de Aburrá?» (spec §11, V4). Mapas de coberturas del valle (grupo B del
   Punto 3): solo sus cifras. Solo dibujo: los textos vienen de js/data/videos.js (`texts`, t1…tn en el orden del brief), las
   cifras del banco y las personas del reparto. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var M = 72;

  function badge(ctx, env, text, glyph, x, y, p, align) {
    return env.style.mark(ctx, 'badge', { x: x, y: y }, { text: text, variant: 'state', glyph: glyph, size: 14, p: p, align: align });
  }

  // ---- pictogramas del piso duro (polo A, rellenos) ; (x, y) = base centrada, s = alto ----
  function pBuild(S, ctx, x, y, s) {
    S.building(ctx, { x: x - s * 0.42, y: y - s * 0.8, w: s * 0.36, h: s * 0.8 }, { kind: 'bloque', seed: 2 });
    S.building(ctx, { x: x + 0.02 * s, y: y - s, w: s * 0.4, h: s }, { kind: 'torre', seed: 5 });
  }
  function pIndustry(S, ctx, x, y, s) {
    var w = s * 1.1, x0 = x - w / 2, h = s * 0.5;
    S.fill(ctx, S.rectPath(x0, y - h, w, h, 0), { role: 'ground-2' });
    var teeth = [];
    for (var i = 0; i < 3; i++) teeth.push([x0 + i * w / 3, y - h], [x0 + i * w / 3, y - h - s * 0.24], [x0 + (i + 1) * w / 3, y - h]);
    S.fill(ctx, teeth.concat([[x0 + w, y - h], [x0, y - h]]), { role: 'accent-7' });
    S.fill(ctx, S.rectPath(x0 + w * 0.78, y - s, w * 0.1, s * 0.3, 0), { role: 'ink-soft' });
    S.fill(ctx, S.rectPath(x0 + w * 0.4, y - h * 0.55, w * 0.2, h * 0.55, 0), { role: 'ink' });
  }
  function pRoad(S, ctx, x, y, s) {
    var w = s * 1.2;
    S.fill(ctx, [[x - w * 0.18, y - s], [x + w * 0.18, y - s], [x + w * 0.5, y], [x - w * 0.5, y]], { role: 'ink-soft' });
    S.stroke(ctx, [[x, y - s + 4], [x, y - 2]], { role: 'ground', width: 3, dash: [s * 0.14, s * 0.1] });
  }
  function pUnknown(S, ctx, x, y, s) {
    var path = S.rectPath(x - s * 0.45, y - s * 0.9, s * 0.9, s * 0.9, 6);
    S.patternFill(ctx, path, 'stripes', {});
    S.stroke(ctx, path, { role: 'ink', width: 1.8, dash: [6, 5] });
    qmark(S, ctx, x, y - s * 0.45, s * 0.5, 'ink');
  }
  // Signo de interrogación dibujado (no es texto): arco, trazo y punto.
  function qmark(S, ctx, x, y, s, r) {
    S.stroke(ctx, function (c) { c.arc(x, y - s * 0.3, s * 0.28, Math.PI * 1.05, Math.PI * 0.45); }, { role: r, width: Math.max(2, s * 0.12) });
    S.stroke(ctx, [[x + s * 0.06, y - s * 0.04], [x, y + s * 0.18]], { role: r, width: Math.max(2, s * 0.12) });
    S.fill(ctx, S.circlePath(x, y + s * 0.42, Math.max(2, s * 0.08)), { role: r });
  }
  var PICTOS = [pBuild, pIndustry, pRoad, pUnknown];
  // Los mismos pictogramas como contornos finos del polo B.
  function oBuild(S, ctx, x, y, s, p) {
    S.mapLine(ctx, S.rectPath(x - s * 0.42, y - s * 0.8, s * 0.36, s * 0.8, 0), { p: p });
    S.mapLine(ctx, S.rectPath(x + 0.02 * s, y - s, s * 0.4, s, 0), { p: p });
  }
  function oIndustry(S, ctx, x, y, s, p) {
    var w = s * 1.1, x0 = x - w / 2, h = s * 0.5;
    var pts = [[x0, y], [x0, y - h]];
    for (var i = 0; i < 3; i++) pts.push([x0 + i * w / 3, y - h - s * 0.24], [x0 + (i + 1) * w / 3, y - h]);
    pts.push([x0 + w, y]);
    S.mapLine(ctx, { pts: pts, closed: true }, { p: p });
  }
  function oRoad(S, ctx, x, y, s, p) {
    var w = s * 1.2;
    S.mapLine(ctx, [[x - w * 0.18, y - s], [x - w * 0.5, y]], { p: p });
    S.mapLine(ctx, [[x + w * 0.18, y - s], [x + w * 0.5, y]], { p: p });
    S.mapLine(ctx, [[x, y - s], [x, y]], { p: p, dashed: true });
  }
  function oUnknown(S, ctx, x, y, s, p) {
    S.mapLine(ctx, S.rectPath(x - s * 0.45, y - s * 0.9, s * 0.9, s * 0.9, 4), { p: p, dashed: true });
  }
  var OUTLINES = [oBuild, oIndustry, oRoad, oUnknown];

  // Pequeña carpeta cerrada (como las del signo `carpetas`), base en (x, y).
  function folder(S, ctx, x, y, w) {
    var h = w * 0.72;
    S.fill(ctx, S.rectPath(x, y - h - 10, w * 0.38, 14, [5, 5, 0, 0]), { role: 'accent-7' });
    S.fill(ctx, S.rectPath(x, y - h, w, h, 5), { role: 'accent-6' });
    S.fill(ctx, [[x, y - h * 0.82], [x + w, y - h * 0.82], [x + w, y], [x, y]], { role: 'accent-9' });
    S.stroke(ctx, [[x + w * 0.12, y - h * 0.4], [x + w * 0.6, y - h * 0.4]], { role: 'ink', width: 1.2 });
  }

  EEP.videos.v4 = {
    setup: function () {},
    scenes: {
      // Draw: title background; on line 1 the title «¿CUÁNTO CRECIÓ EL SUELO CONSTRUIDO?» with the second line «mapas de coberturas
      // del Valle de Aburrá, 2017–2024»; on line 2 the figure card `P3-C23` appears at the right, with the legend chip `valle`.
      gancho: function (ctx, s, env) {
        env.style.title(ctx, env.text('t1'), { x: M, y: 210, size: 60, maxWidth: 640, second: env.text('t2'), p: s.at(0) });
        var c = env.cards.draw(ctx, 'P3-C23', { x: 800, y: 210, w: 408, p: s.at(1) });
        env.zones.push(c);
      },

      // Draw: explain background; on line 1 four small pictograms appear in a row, labeled «Construcciones», «Zonas industriales o
      // comerciales», «Vías» and «Una clase sin verificar», and they gather under the label bar «PISO DURO»; on line 2 a map panel
      // shows the same pictograms as thin outlines, with the label «Área cartografiada»; on line 3 a small balance of a plus bar
      // and a minus bar appears under the panel, labeled «Cambio neto».
      'piso-duro': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p1 = s.at(0);
        var gather = E.inOut(E.clamp(p1 * 2 - 1));
        var y = 330, size = 74;
        for (var i = 0; i < 4; i++) {
          (function (i) {
            var pi = E.clamp(p1 * 4 - i * 0.6);
            if (pi <= 0) return;
            var spread = 150 - 14 * gather;
            var x = 330 + (i - 1.5) * spread;
            S.withAppear(ctx, 'illus', pi, function () { PICTOS[i](S, ctx, x, y, size); });
            S.text(ctx, env.text('t' + (i + 1)), { x: x, y: y + 34, size: 17, weight: 700, align: 'center', maxWidth: 128, p: pi });
          })(i);
        }
        if (gather > 0) {
          var x0 = 330 - 1.5 * 136 - 60, x1 = 330 + 1.5 * 136 + 60;
          S.stroke(ctx, [[x0, y - size - 24], [x0, y - size - 40], [x1, y - size - 40], [x1, y - size - 24]], { role: 'ink', width: 1.6, p: gather });
          var m = S.labelBar(ctx, env.text('t5'), { x: 0, y: 0, size: 30, measureOnly: true });
          S.labelBar(ctx, env.text('t5'), { x: 330 - m.w / 2, y: y - size - 40 - m.h - 10, size: 30, p: gather });
        }
        var box = { x: 700, y: 90, w: 508, h: 300 };
        S.mapPanel(ctx, box, { p: s.at(1), title: env.text('t6'), draw: function (inner, pp) {
          for (var k = 0; k < 4; k++) OUTLINES[k](S, ctx, inner.x + inner.w * (0.14 + k * 0.24), inner.y + inner.h * 0.68, 70, E.clamp(pp * 2 - k * 0.25));
        } });
        env.zones.push(box);
        // balanza del cambio neto: barra de ganancia, barra de pérdida y la diferencia
        var bp = s.at(2);
        if (bp > 0) {
          var cx = 954, by = 440;
          S.stroke(ctx, [[cx, by - 8], [cx, by + 76]], { role: 'ink', width: 2, p: bp });
          S.withAppear(ctx, 'bar', bp, function () {
            S.fill(ctx, S.rectPath(cx, by, 170, 26, 0), { role: 'accent-1' });
            S.stroke(ctx, S.rectPath(cx, by, 170, 26, 0), { role: 'ink', width: 1.4 });
            S.fill(ctx, S.rectPath(cx - 70, by + 40, 70, 26, 0), { role: 'accent-5' });
            S.stroke(ctx, S.rectPath(cx - 70, by + 40, 70, 26, 0), { role: 'ink', width: 1.4 });
            // signos más y menos dibujados
            S.stroke(ctx, [[cx + 186, by + 13], [cx + 202, by + 13]], { role: 'ink', width: 2.4 });
            S.stroke(ctx, [[cx + 194, by + 5], [cx + 194, by + 21]], { role: 'ink', width: 2.4 });
            S.stroke(ctx, [[cx - 102, by + 53], [cx - 86, by + 53]], { role: 'ink', width: 2.4 });
          });
          var np = E.clamp(bp * 2 - 1);
          S.stroke(ctx, [[cx + 70, by - 10], [cx + 70, by - 18], [cx + 170, by - 18], [cx + 170, by - 10]], { role: 'ink', width: 1.4, p: np });
          S.labelBar(ctx, env.text('t7'), { x: cx + 4, y: by + 82, size: 18, role: 'accent-1', p: bp });
        }
      },

      // Draw: explain background; on line 1 three map sheets labeled «2017», «2021» and «2024» slide in from the left and stack; on
      // line 2 a small note appears beside the stack: «Productor de las capas no indicado»; on line 3 a question mark sign appears
      // over the stack.
      fuente: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p1 = s.at(0);
        for (var i = 0; i < 3; i++) {
          (function (i) {
            var pi = E.out(E.clamp(p1 * 3 - i * 0.8));
            if (pi <= 0) return;
            var tx = 200 + i * 44, ty = 190 + i * 40;
            var x = E.lerp(-420, tx, pi);
            var box = { x: x, y: ty, w: 380, h: 250 };
            S.mapPanel(ctx, box, { p: E.clamp(pi * 1.5), draw: function (inner, pp) {
              var r = [[0.1, 0.3, 0.3], [0.6, 0.25, 0.22], [0.35, 0.7, 0.26], [0.78, 0.7, 0.16]];
              r.forEach(function (q, k) {
                S.mapLine(ctx, S.ellipsePath(inner.x + inner.w * q[0] + 30, inner.y + inner.h * q[1], inner.w * q[2] * 0.5, inner.h * q[2] * 0.42, k * 0.4), { p: pp });
              });
              S.mapLine(ctx, { pts: [[inner.x, inner.y + inner.h * 0.55], [inner.x + inner.w * 0.4, inner.y + inner.h * 0.48], [inner.x + inner.w, inner.y + inner.h * 0.62]], smooth: true }, { p: pp, glow: true });
            } });
            S.text(ctx, env.text('t' + (i + 1)), { x: x + 18, y: ty + 30, size: 20, weight: 700, role: 'on-dark', p: pi });
          })(i);
        }
        env.course.tag(ctx, { x: 800, y: 300, w: 380, h: 96 }, env.text('t4'), { p: s.at(1), size: 21, tilt: -2 });
        var qp = s.at(2);
        if (qp > 0) {
          S.withAppear(ctx, 'illus', qp, function () {
            S.fill(ctx, S.circlePath(660, 120, 46), { role: 'ground' });
            S.stroke(ctx, S.circlePath(660, 120, 46), { role: 'ink', width: 2.4 });
            qmark(S, ctx, 660, 120, 56, 'ink');
          });
        }
      },

      // Draw: compare background with two columns; the left column, titled «Medellín», holds the card `P3-C21` with the legend chip
      // `distrito`; on line 1 the right column, titled «Otros nueve municipios», receives the cards `P3-C23` and `P3-C22` with the
      // chip `valle`; on line 2 LUCÍA appears between the columns at the bottom (pose: asking); on line 3 the label «Áreas
      // cartografiadas» appears across both columns; on line 4 two closed folders appear at the top right, labeled «Otras
      // mediciones · no se combinan».
      medellin: function (ctx, s, env) {
        var S = env.style;
        // Tarjetas a escala 0,86 (maquetadas a 650 px) para que las dos columnas quepan sobre la franja de subtítulos.
        var K = 0.86, LW = 650;
        function card(id, x, y, p, o) {
          var box = env.cards.measure(ctx, id, { w: LW, compact: true, maxHead: o && o.maxHead });
          if (p > 0) {
            ctx.save(); ctx.translate(x, y); ctx.scale(K, K);
            env.cards.draw(ctx, id, { x: 0, y: 0, w: LW, compact: true, maxHead: o && o.maxHead, p: p });
            ctx.restore();
          }
          var z = { x: x, y: y, w: LW * K, h: box.h * K };
          if (p > 0) env.zones.push(z);
          return z;
        }
        S.labelBar(ctx, env.text('t1'), { x: 40, y: 28, size: 18, p: s.intro });
        var a = card('P3-C21', 40, 112, s.intro);
        S.labelBar(ctx, env.text('t2'), { x: 680, y: 28, size: 18, p: s.at(0) });
        var b = card('P3-C23', 680, 112, s.at(0), { maxHead: 34 });
        card('P3-C22', 680, b.y + b.h + 6, s.at(0), { maxHead: 34 });
        var m = S.labelBar(ctx, env.text('t3'), { x: 0, y: 0, size: 18, measureOnly: true });
        S.labelBar(ctx, env.text('t3'), { x: 640 - m.w / 2, y: 70, size: 18, role: 'accent-1', p: s.at(2) });
        var fp = s.at(3);
        if (fp > 0) {
          var fy = a.y + a.h + 120;
          S.withAppear(ctx, 'illus', fp, function () { folder(S, ctx, 40, fy, 64); folder(S, ctx, 116, fy, 64); });
          S.text(ctx, env.text('t4'), { x: 200, y: fy - 30, size: 18, weight: 700, maxWidth: 300, p: fp });
        }
        S.person(ctx, env.cast('lucia'), { pose: 'asking', x: 630, y: 620, height: 190, p: s.at(1) });
        return { on: { lucia: { x: 630, y: 620 - 190 } } };
      },

      // Draw: figure background; the figure card `P3-C27` at the left; on line 2 a map panel at the right shows the same hillside
      // drawn twice, once with three large polygons and once with many small polygons, labeled «Menos detalle» and «Más detalle»;
      // the badge «Esquema» on the panel.
      detalle: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.draw(ctx, 'P3-C27', { x: M, y: 110, w: 480, p: s.intro });
        env.zones.push(a);
        var box = { x: 600, y: 90, w: 608, h: 400 };
        var p2 = s.at(1);
        S.mapPanel(ctx, box, { p: p2, draw: function (inner, pp) {
          var hw = inner.w / 2;
          [0, 1].forEach(function (k) {
            var x0 = inner.x + k * hw + 16, w = hw - 32, yb = inner.y + inner.h - 60, h = inner.h - 120;
            var hill = [];
            for (var i = 0; i <= 16; i++) { var u = i / 16; hill.push([x0 + w * u, yb - h * Math.sin(u * Math.PI) * (0.8 + 0.2 * Math.sin(u * 7))]); }
            var outline = hill.concat([[x0 + w, yb], [x0, yb]]);
            var pk = E.clamp(pp * 2 - k * 0.6);
            if (pk <= 0) return;
            ctx.save();
            S.trace(ctx, { pts: outline, closed: true }); ctx.clip();
            if (k === 0) {
              S.mapLine(ctx, [[x0 + w * 0.36, yb], [x0 + w * 0.46, yb - h]], { p: pk });
              S.mapLine(ctx, [[x0 + w * 0.4, yb - h * 0.45], [x0 + w, yb - h * 0.25]], { p: pk });
            } else {
              for (var c = 1; c < 7; c++) S.mapLine(ctx, [[x0 + w * c / 7 + 6, yb], [x0 + w * c / 7 - 6, yb - h]], { p: pk, weight: 1 });
              for (var r = 1; r < 6; r++) S.mapLine(ctx, [[x0, yb - h * r / 6 + (r % 2) * 8], [x0 + w, yb - h * r / 6 - 6]], { p: pk, weight: 1 });
            }
            ctx.restore();
            S.mapLine(ctx, { pts: outline, closed: true }, { p: pk });
            S.mapLabel(ctx, env.text(k === 0 ? 't1' : 't2'), x0 + w / 2, inner.y + inner.h - 18, { align: 'center', p: pk, size: 15 });
          });
        } });
        env.zones.push(box);
        badge(ctx, env, env.text('t3'), 'g-esquema', box.x + box.w, box.y + box.h + 14, p2, 'right');
      },

      // Draw: a map panel at the center; on line 1 the same road appears as a thin line on a sheet labeled «2017» and as a wider
      // band on a sheet labeled «2024», side by side, with the label «Misma vía, otra representación»; on line 2 the badge «Esquema».
      vias: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: 220, y: 60, w: 840, h: 400 };
        var p1 = s.at(0);
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner) {
          [0, 1].forEach(function (k) {
            var pk = E.clamp(p1 * 2 - k * 0.7);
            if (pk <= 0) return;
            var sx = inner.x + 24 + k * (inner.w / 2), sw = inner.w / 2 - 48, sy = inner.y + 20, sh = inner.h - 40;
            S.mapLine(ctx, S.rectPath(sx, sy, sw, sh, 6), { p: pk, role: 'machine-line' });
            var road = { pts: [[sx + 10, sy + sh * 0.8], [sx + sw * 0.4, sy + sh * 0.55], [sx + sw * 0.7, sy + sh * 0.45], [sx + sw - 10, sy + sh * 0.2]], smooth: true };
            if (k === 0) S.mapLine(ctx, road, { p: pk, weight: 1.6 });
            else {
              S.stroke(ctx, road, { role: 'machine-glow-1', alpha: 0.35, width: 26, p: pk });
              S.stroke(ctx, road, { role: 'machine-line', width: 1.4, p: pk, offset: 0 });
            }
            ctx.save(); ctx.globalAlpha *= pk;
            ctx.fillStyle = S.role('machine-ground'); ctx.fillRect(sx + 10, sy + 10, 80, 34);
            ctx.restore();
            S.text(ctx, env.text(k === 0 ? 't1' : 't2'), { x: sx + 20, y: sy + 36, size: 22, weight: 700, role: 'on-dark', p: pk });
          });
        } });
        env.zones.push(box);
        var m = S.labelBar(ctx, env.text('t3'), { x: 0, y: 0, size: 22, measureOnly: true });
        S.labelBar(ctx, env.text('t3'), { x: 640 - m.w / 2, y: box.y + box.h + 22, size: 22, role: 'accent-1', p: E.clamp(p1 * 2 - 1) });
        badge(ctx, env, env.text('t4'), 'g-esquema', box.x + box.w, box.y - 14 - 27 + 0, s.at(1), 'right');
      },

      // Draw: a map panel holding the sign `valle-planta`, south at the bottom and north at the top; on line 1 the northern part of
      // the panel takes the `stripes` pattern and three floating labels appear there: «Barbosa», «Girardota», «Copacabana»; on line
      // 2 the badge «Con matiz» appears with the note «Detalle cartográfico»; on line 3 the label «Territorio, no gestión
      // municipal» appears under the panel.
      norte: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: 330, y: 36, w: 520, h: 470 };
        var p1 = s.at(0);
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner, pp) {
          var g = env.course.vallePlanta(ctx, inner, { p: pp, t: s.t, patches: [
            { u: 0.5, v: 0.17, r: inner.w * 0.2, kind: 'pattern', pattern: 'stripes', p: E.clamp(p1 * 2) }
          ] });
          if (!g || !g.at) return;
          var c = g.at(0.5, 0.17), r = inner.w * 0.2;
          [[c[0] + r + 14, c[1] - r * 0.35, 't1', 'left'], [c[0] - r - 14, c[1] + 4, 't2', 'right'], [c[0] + r + 14, c[1] + r * 0.45, 't3', 'left']].forEach(function (l, i) {
            var lp = E.clamp(p1 * 3 - 0.8 - i * 0.5);
            var ex = l[3] === 'left' ? c[0] + r * 0.82 : c[0] - r * 0.82;
            S.mapLine(ctx, [[l[3] === 'left' ? l[0] - 4 : l[0] + 4, l[1] - 5], [ex, l[1] - 5]], { p: lp, weight: 1 });
            S.mapLabel(ctx, env.text(l[2]), l[0], l[1], { p: lp, size: 14, align: l[3] });
          });
        } });
        env.zones.push(box);
        var p2 = s.at(1);
        var bw = badge(ctx, env, env.text('t4'), 'g-matiz', 890, 180, p2);
        S.text(ctx, env.text('t5'), { x: 890, y: 240, size: 20, weight: 700, maxWidth: 300, p: p2 });
        var m = S.labelBar(ctx, env.text('t6'), { x: 0, y: 0, size: 22, measureOnly: true });
        S.labelBar(ctx, env.text('t6'), { x: 590 - m.w / 2, y: box.y + box.h + 20, size: 22, role: 'accent-1', p: s.at(2) });
        void bw;
      },

      // Draw: figure background; the figure card `P3-C32` at the center with the legend chip `valle`; on line 2 HERNÁN appears at the
      // lower left, outside the card (pose: pointing); on line 3 a thin strip under the card shows a road with roofs on both sides,
      // labeled «Coberturas artificiales a ambos lados · incluye vías».
      bordes: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.draw(ctx, 'P3-C32', { x: 400, y: 60, w: 560, p: s.intro });
        env.zones.push(a);
        var p3 = s.at(2);
        if (p3 > 0) {
          var x0 = 420, x1 = 1180, ry = Math.max(a.y + a.h + 90, 400);
          S.fill(ctx, S.rectPath(x0, ry, (x1 - x0) * E.out(p3), 28, 0), { role: 'ink-soft' });
          if (p3 >= 1) S.stroke(ctx, [[x0 + 6, ry + 14], [x1 - 6, ry + 14]], { role: 'ground', width: 2, dash: [14, 10] });
          for (var i = 0; i < 9; i++) {
            (function (i) {
              var hx = x0 + 20 + i * 84;
              var hp = E.clamp(p3 * 2 - 0.4 - i * 0.06);
              S.withAppear(ctx, 'illus', hp, function () {
                S.building(ctx, { x: hx, y: ry - 34, w: 30, h: 30 }, { kind: 'casa', roof: i % 2 ? 'accent-5' : 'accent-3' });
                S.building(ctx, { x: hx + 30, y: ry + 34, w: 30, h: 30 }, { kind: 'casa', roof: i % 2 ? 'accent-3' : 'accent-5' });
              });
            })(i);
          }
          S.text(ctx, env.text('t1'), { x: x0, y: ry + 100, size: 19, weight: 700, p: E.clamp(p3 * 2 - 1) });
        }
        S.person(ctx, env.cast('hernan'), { pose: 'pointing', x: 200, y: 610, height: 270, p: s.at(1) });
        return { on: { hernan: { x: 200, y: 610 - 270 } } };
      },

      // Draw: explain background; on line 1 three tag cards appear one by one, labeled «Misma fuente cartográfica», «Evaluar la
      // exactitud de los cambios» and «Reglas comunes para los bordes»; on line 2 the stamp `stamp-insumo` slides in.
      propuesta: function (ctx, s, env) {
        var E = env.ease;
        for (var i = 0; i < 3; i++) {
          env.course.tag(ctx, { x: 120 + i * 360, y: 140, w: 320, h: 124 }, env.text('t' + (i + 1)), { p: E.clamp(s.at(0) * 3 - i), size: 24, tilt: i === 1 ? 2 : -2 });
        }
        var m = env.course.stamp(ctx, 'stamp-insumo', 0, 0, { measureOnly: true, w: 460 });
        env.course.stamp(ctx, 'stamp-insumo', 640 - m.w / 2, 360, { p: s.at(1), w: 460 });
      },

      // Draw: recap background; on line 1 the stamp `stamp-cartografiada` lands; on line 2 the motto appears on the label bar: «EL
      // NORTE DEL VALLE ES EL LUGAR DONDE SE DECIDIRÁ LA PRÓXIMA DÉCADA DE LA OCUPACIÓN METROPOLITANA».
      cierre: function (ctx, s, env) {
        var S = env.style;
        S.hills(ctx, { x: 460, y: 500, w: 820, h: 220 }, { seed: 4, layers: 2, roles: [['accent-6', 'accent-7'], ['accent-7', 'accent-6']] });
        env.course.stamp(ctx, 'stamp-cartografiada', 520, 70, { p: s.at(0), w: 520 });
        S.labelBar(ctx, env.text('t1'), { x: 520, y: 250, size: 28, maxWidth: 680, p: s.at(1) });
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
