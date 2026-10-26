/* V3 · «¿Hacia dónde creció Medellín?» (spec §11, V3). Medición de alta resolución (grupo A del Punto 3): solo sus cifras.
   Solo dibujo: los textos vienen de js/data/videos.js (`texts`, t1…tn en el orden del brief), las cifras del banco y
   las personas del reparto. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var M = 72;

  function badge(ctx, env, text, glyph, x, y, p, align) {
    return env.style.mark(ctx, 'badge', { x: x, y: y }, { text: text, variant: 'state', glyph: glyph, size: 14, p: p, align: align });
  }
  // Grupo pequeño de techos nuevos (casas con techo de acento), base en (x, y).
  function roofs(ctx, S, x, y, n, s, p, roof) {
    for (var k = 0; k < n; k++) {
      (function (k) {
        S.withAppear(ctx, 'illus', p, function () {
          S.building(ctx, { x: x + k * s * 1.15, y: y - s - (k % 2) * s * 0.3, w: s, h: s }, { kind: 'casa', roof: roof || 'accent-5' });
        });
      })(k);
    }
  }
  // Pictogramas finos del polo B: colina y techo.
  function pictoHill(S, ctx, x, y, s, p) {
    S.mapLine(ctx, { pts: [[x - s * 0.45, y + s * 0.25], [x - s * 0.15, y - s * 0.2], [x + s * 0.05, y], [x + s * 0.2, y - s * 0.12], [x + s * 0.45, y + s * 0.25]], smooth: true }, { p: p });
  }
  function pictoRoof(S, ctx, x, y, s, p) {
    S.stroke(ctx, { pts: [[x - s * 0.4, y - s * 0.02], [x, y - s * 0.38], [x + s * 0.4, y - s * 0.02]] }, { role: 'machine-glow-1', width: 1.8, p: p });
    S.stroke(ctx, { pts: [[x - s * 0.28, y - s * 0.08], [x - s * 0.28, y + s * 0.3], [x + s * 0.28, y + s * 0.3], [x + s * 0.28, y - s * 0.08]] }, { role: 'machine-glow-1', width: 1.8, p: p });
  }

  EEP.videos.v3 = {
    setup: function () {},
    scenes: {
      // Draw: title background; on line 1 the title «¿HACIA DÓNDE CRECIÓ MEDELLÍN?» with the second line «medición de alta
      // resolución, 2017–2024»; on line 2 the figure card `P3-C01` appears at the right, with the legend chip `distrito`.
      gancho: function (ctx, s, env) {
        env.style.title(ctx, env.text('t1'), { x: M, y: 230, size: 64, maxWidth: 660, second: env.text('t2'), p: s.at(0) });
        var c = env.cards.draw(ctx, 'P3-C01', { x: 800, y: 210, w: 408, p: s.at(1) });
        env.zones.push(c);
      },

      // Draw: explain background with a map panel on the right half; on line 1 a grid of small cells appears over an abstract
      // patch and some cells switch from a hill pictogram to a roof pictogram, with the labels «Campo, bosque u otra cobertura»
      // and «Área construida»; on line 2 the badge «Con matiz» appears under the panel with the note «Exactitud no reportada».
      metodo: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p1 = s.at(0);
        // lado A: la idea en grande (colina → casa) con las dos etiquetas
        S.withAppear(ctx, 'illus', E.clamp(p1 * 3), function () { S.sign(ctx, 'colina', { x: 200, y: 300, size: 110 }); });
        S.text(ctx, env.text('t1'), { x: 200, y: 340, size: 20, weight: 700, align: 'center', maxWidth: 240, p: E.clamp(p1 * 3) });
        var ap = E.clamp(p1 * 3 - 1);
        S.stroke(ctx, [[330, 260], [400, 260]], { role: 'ink', width: 2.4, p: ap });
        if (ap >= 1) S.stroke(ctx, [[388, 250], [400, 260], [388, 270]], { role: 'ink', width: 2.4 });
        S.withAppear(ctx, 'illus', E.clamp(p1 * 3 - 1.4), function () {
          S.building(ctx, { x: 450, y: 196, w: 90, h: 100 }, { kind: 'casa' });
        });
        S.text(ctx, env.text('t2'), { x: 495, y: 340, size: 20, weight: 700, align: 'center', maxWidth: 220, p: E.clamp(p1 * 3 - 1.4) });
        // panel del mapa: celdas sobre una mancha abstracta
        var box = { x: 640, y: 70, w: 568, h: 400 };
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner, pp) {
          var cx = inner.x + inner.w / 2, cy = inner.y + inner.h / 2, rx = inner.w * 0.42, ry = inner.h * 0.4;
          S.mapLine(ctx, { pts: [[cx - rx, cy], [cx - rx * 0.6, cy - ry], [cx + rx * 0.3, cy - ry * 1.05], [cx + rx, cy - ry * 0.2], [cx + rx * 0.7, cy + ry * 0.9], [cx - rx * 0.4, cy + ry]], smooth: true, closed: true }, { p: pp, dashed: true });
          var cs = 52, cols = 8, rows = 6;
          var x0 = cx - cols * cs / 2, y0 = cy - rows * cs / 2;
          var gp = E.clamp(p1 * 2);
          for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) {
            var dx = (x0 + (i + 0.5) * cs - cx) / rx, dy = (y0 + (j + 0.5) * cs - cy) / ry;
            if (dx * dx + dy * dy > 1.05) continue;
            var ci = E.clamp(gp * 2 - (i + j) * 0.06);
            if (ci <= 0) continue;
            var x = x0 + i * cs, y = y0 + j * cs;
            S.stroke(ctx, S.rectPath(x + 2, y + 2, cs - 4, cs - 4, 2), { role: 'machine-grid', width: 1, alpha: 0.9, p: ci });
            var turns = ((i * 13 + j * 7 + i * j) % 7) < 3;
            var sw = turns ? E.clamp(p1 * 2.4 - 1.2 - ((i * 3 + j) % 6) * 0.08) : 0;
            if (sw < 1) { ctx.save(); ctx.globalAlpha *= 1 - sw; pictoHill(S, ctx, x + cs / 2, y + cs / 2, cs * 0.7, ci); ctx.restore(); }
            if (sw > 0) {
              ctx.save(); ctx.globalAlpha *= sw;
              ctx.fillStyle = S.role('machine-glow-1', 0.18); ctx.fillRect(x + 3, y + 3, cs - 6, cs - 6);
              pictoRoof(S, ctx, x + cs / 2, y + cs / 2, cs * 0.7, 1);
              ctx.restore();
            }
          }
        } });
        env.zones.push(box);
        var bp = s.at(1);
        var bw = badge(ctx, env, env.text('t3'), 'g-matiz', box.x, box.y + box.h + 22, bp);
        S.text(ctx, env.text('t4'), { x: box.x + bw + 16, y: box.y + box.h + 44, size: 20, weight: 700, p: bp });
      },

      // Draw: figure background; on line 1 an exact vertical bar chart with two bars from zero on one scale, labeled «2017–2021»
      // (`P3-C03`) and «2021–2024» (`P3-C04`), each carrying its exact value in ha/año; on line 2 LUCÍA appears at the lower left,
      // outside the chart (pose: asking, notebook in hand); on line 3 a thin bracket over both bars shows the label «Ritmos por
      // año, no partes del total»; on line 4 the second bar is emphasized.
      ritmo: function (ctx, s, env) {
        var S = env.style;
        var ch = { x: 520, y: 130, w: 600, h: 430 };
        env.charts.vbars(ctx, { x: ch.x, y: ch.y, w: ch.w, h: ch.h, p: s.at(0),
          items: [{ label: env.text('t1'), figure: 'P3-C03' }, { label: env.text('t2'), figure: 'P3-C04' }] });
        env.zones.push(ch);
        var base = ch.y + ch.h - 60, top = ch.y + 40, colW = ch.w / 2, barW = Math.min(110, colW * 0.5);
        // corchete sobre las dos barras
        var bp = s.at(2);
        if (bp > 0) {
          var by = top - 44, xl = ch.x + colW * 0.5 - barW / 2, xr = ch.x + colW * 1.5 + barW / 2;
          S.stroke(ctx, [[xl, by + 12], [xl, by], [xr, by], [xr, by + 12]], { role: 'ink', width: 1.6, p: bp });
          S.text(ctx, env.text('t3'), { x: (xl + xr) / 2, y: by - 14, size: 20, weight: 700, align: 'center', p: bp });
        }
        // la segunda barra se destaca
        var ep = s.at(3);
        if (ep > 0) {
          var cx2 = ch.x + colW * 1.5;
          S.stroke(ctx, S.rectPath(cx2 - barW / 2 - 14, top - 40 + 8, barW + 28, base - top + 40, 8), { role: 'ink', width: 3, p: ep });
        }
        S.person(ctx, env.cast('lucia'), { pose: 'asking', x: 230, y: 610, height: 250, p: s.at(1) });
        return { on: { lucia: { x: 230, y: 610 - 250 } } };
      },

      // Draw: figure background; on line 1 the figure card `P3-C06` with the line of `P3-C05` beneath it appears at the left; on
      // line 2 two context cards appear at the right, `P3-C53` over `P3-C54`, and then the cards `P3-C55` and `P3-C56` side by side
      // under them, with the label «Respecto a su área».
      corregimientos: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.draw(ctx, 'P3-C06', { x: M, y: 70, w: 500, p: s.at(0) });
        var b = env.cards.draw(ctx, 'P3-C05', { x: M, y: a.y + a.h + 10, w: 500, compact: true, maxHead: 30, p: s.at(0) });
        env.zones.push(a, b);
        var p2 = s.at(1);
        var rx = 620, rw = 588;
        var c = env.cards.draw(ctx, 'P3-C53', { x: rx, y: 36, w: rw, compact: true, maxHead: 26, p: E.clamp(p2 * 2) });
        var d = env.cards.draw(ctx, 'P3-C54', { x: rx, y: c.y + c.h + 6, w: rw, compact: true, maxHead: 26, p: E.clamp(p2 * 2) });
        var p3 = E.clamp(p2 * 2 - 1);
        var lb = S.labelBar(ctx, env.text('t1'), { x: rx, y: d.y + d.h + 8, size: 15, role: 'accent-1', p: p3 });
        var hw = (rw - 12) / 2;
        var e = env.cards.draw(ctx, 'P3-C55', { x: rx, y: lb.y + lb.h + 6, w: hw, compact: true, maxHead: 26, p: p3 });
        var f = env.cards.draw(ctx, 'P3-C56', { x: rx + hw + 12, y: lb.y + lb.h + 6, w: hw, compact: true, maxHead: 26, p: p3 });
        env.zones.push(c, d, e, f);
      },

      // Draw: figure background; the figure card `P3-C12` at the center; on line 2 HERNÁN appears at the lower left, outside the
      // card (pose: hat in hand, asking); on line 3 two small labels appear under the card, each with a small roof group:
      // «Suburbanización: condominios cerrados» and «Urbanización formal: cabeceras y áreas de expansión».
      'santa-elena': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.draw(ctx, 'P3-C12', { x: 400, y: 50, w: 540, p: s.intro });
        env.zones.push(a);
        var p3 = s.at(2);
        if (p3 > 0) {
          var y = Math.max(a.y + a.h + 30, 420);
          var g1 = E.clamp(p3 * 2), g2 = E.clamp(p3 * 2 - 0.6);
          // condominio cerrado: casas iguales dentro de una cerca
          S.stroke(ctx, S.rectPath(420, y + 4, 200, 62, 6), { role: 'ink', width: 1.6, dash: [5, 4], p: g1 });
          roofs(ctx, S, 438, y + 56, 5, 28, g1);
          S.text(ctx, env.text('t1'), { x: 640, y: y + 30, size: 18, weight: 700, maxWidth: 220, p: g1 });
          // urbanización formal: cabecera con bloques
          S.withAppear(ctx, 'illus', g2, function () {
            S.building(ctx, { x: 880, y: y + 2, w: 34, h: 64 }, { kind: 'bloque', seed: 3 });
            S.building(ctx, { x: 920, y: y + 16, w: 40, h: 50 }, { kind: 'cabecera', seed: 4 });
            S.building(ctx, { x: 966, y: y - 4, w: 30, h: 70 }, { kind: 'bloque', seed: 5 });
          });
          S.text(ctx, env.text('t2'), { x: 1010, y: y + 22, size: 18, weight: 700, maxWidth: 200, p: g2 });
        }
        S.person(ctx, env.cast('hernan'), { pose: 'hat-in-hand', x: 200, y: 610, height: 270, p: s.at(1) });
        return { on: { hernan: { x: 200, y: 610 - 270 } } };
      },

      // Draw: compare background with two columns over the sign `valle-corte` split in two; the left column, titled «La apuesta
      // del plan», shows new roofs placed on the valley floor near the river with the label «Crecer hacia adentro»; on line 2 the
      // right column, titled «Lo observado», shows new roofs on the slopes and in the corregimiento bands with the label
      // «Corregimientos y laderas»; the badge «Esquema».
      adentro: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        S.labelBar(ctx, env.text('t1'), { x: 40, y: 40, size: 22, p: s.intro });
        var lb = { x: 40, y: 250, w: 560, h: 280 };
        var g = env.course.valleCorte(ctx, lb, { p: s.intro, badge: false, t: s.t });
        badge(ctx, env, env.text('t5'), 'g-esquema', lb.x + lb.w, lb.y + lb.h + 12, s.intro, 'right');
        var p1 = E.clamp(s.at(-1) * 1.4 - 0.3);
        [0.455, 0.475, 0.525, 0.545].forEach(function (f, i) {
          roofs(ctx, S, g.px(f) - 9, g.base - lb.h * 0.06 - (i % 2) * 22, 1, 18, E.clamp(p1 * 2 - i * 0.2));
        });
        S.labelBar(ctx, env.text('t2'), { x: g.px(0.5) - 110, y: 150, size: 18, role: 'accent-1', p: p1 });
        S.stroke(ctx, [[g.px(0.5), 190], [g.px(0.5), g.base - lb.h * 0.06 - 70]], { role: 'ink', width: 1.4, p: p1 });
        var p2 = s.at(1);
        S.labelBar(ctx, env.text('t3'), { x: 680, y: 40, size: 22, p: p2 });
        var rb = { x: 680, y: 250, w: 560, h: 280 };
        var h = env.course.valleCorte(ctx, rb, { p: p2, badge: false, t: s.t, fill: { corregimientos: 'stripes', corregimientosP: E.clamp(p2 * 2 - 0.4) } });
        var spots = [0.12, 0.2, 0.31, 0.36, 0.64, 0.69, 0.8, 0.88];
        spots.forEach(function (f, i) {
          roofs(ctx, S, h.px(f) - 9, h.hAt(f) - 2, 1, 18, E.clamp(p2 * 2 - 0.6 - i * 0.08));
        });
        S.labelBar(ctx, env.text('t4'), { x: 760, y: 150, size: 18, role: 'accent-1', p: E.clamp(p2 * 2 - 1) });
        badge(ctx, env, env.text('t5'), 'g-esquema', rb.x + rb.w, rb.y + rb.h + 12, p2, 'right');
        env.zones.push(lb, rb);
      },

      // Draw: explain background; the edge band of the `valle-corte` in close-up; on line 1 a forest corridor is cut by new roofs,
      // rain falls on newly sealed ground labeled «Zonas de recarga», and small houses appear on a slope filled with the `dots`
      // pattern labeled «Amenaza»; the badge «Esquema».
      bordes: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p = s.at(0);
        // ladera del borde en primer plano: de la cresta (izquierda) hacia el valle (derecha)
        var top = function (x) { return 200 + (x - 60) * 0.26 + Math.sin(x / 140) * 14; };
        var pts = [];
        for (var x = -20; x <= 1300; x += 40) pts.push([x, top(x)]);
        S.fill(ctx, { pts: pts.concat([[1300, 640], [-20, 640]]), closed: true }, { role: 'accent-6', p: s.intro });
        // corredor de bosque: una fila de árboles con un tramo cortado por techos nuevos
        var cut = E.clamp(p * 3);
        for (var i = 0; i < 12; i++) {
          var tx = 90 + i * 46;
          if (i >= 5 && i <= 7) {
            if (cut < 1) S.tree(ctx, { x: tx, y: top(tx) + 6, size: 70, seed: i, kind: 'dense', t: s.t, alpha: 1 - cut });
            continue;
          }
          S.tree(ctx, { x: tx, y: top(tx) + 6, size: 70, seed: i, kind: i % 2 ? 'dense' : 'round', t: s.t });
        }
        [5, 6, 7].forEach(function (k, j) {
          var hx = 90 + k * 46;
          S.withAppear(ctx, 'illus', E.clamp(cut * 2 - 1 - j * 0.2), function () { S.building(ctx, { x: hx - 16, y: top(hx) - 28, w: 32, h: 32 }, { kind: 'casa', roof: 'accent-5' }); });
        });
        // suelo recién sellado y lluvia
        var rp = E.clamp(p * 3 - 1);
        var sx = 680;
        var seal = [[sx, top(sx) + 2], [sx + 200, top(sx + 200) + 2], [sx + 200, top(sx + 200) + 22], [sx, top(sx) + 22]];
        S.fill(ctx, seal, { role: 'ground-2', p: rp });
        S.stroke(ctx, seal.concat([seal[0]]), { role: 'ink', width: 1.4, p: rp });
        if (rp > 0) {
          S.clouds(ctx, { x: sx + 10, y: 120, w: 180, h: 60 }, { seed: 6, count: 1, size: 140, role: 'ground-2', alpha: rp });
          for (var k = 0; k < 8; k++) for (var q = 0; q < 3; q++) {
            var rx0 = sx + 30 + k * 22 - q * 12, ry0 = 192 + q * 52 + (k % 2) * 16;
            if (ry0 + 30 < top(rx0) - 4) S.stroke(ctx, [[rx0, ry0], [rx0 - 7, ry0 + 28]], { role: 'accent-2', width: 2, p: rp });
          }
          S.labelBar(ctx, env.text('t1'), { x: sx + 20, y: top(sx + 100) + 44, size: 18, role: 'accent-1', p: rp });
        }
        // ladera con amenaza (`dots`) y casas pequeñas
        var hp = E.clamp(p * 3 - 2);
        var ax = 960;
        var zone = [[ax, top(ax) + 4], [ax + 230, top(ax + 230) + 4], [ax + 230, top(ax + 230) + 90], [ax, top(ax) + 90]];
        if (hp > 0) {
          ctx.save(); ctx.globalAlpha *= S.appear('fade', hp).alpha;
          S.mark(ctx, 'pattern', {}, { path: { pts: zone, closed: true }, variant: 'dots', ground: false, outline: true });
          ctx.restore();
          [0, 1, 2].forEach(function (j) {
            var hx = ax + 40 + j * 70;
            S.withAppear(ctx, 'illus', E.clamp(hp * 2 - j * 0.3), function () { S.building(ctx, { x: hx - 13, y: top(hx) - 24, w: 26, h: 26 }, { kind: 'casa', roof: 'accent-5' }); });
          });
          S.labelBar(ctx, env.text('t2'), { x: ax + 40, y: top(ax) - 110, size: 18, role: 'accent-1', p: hp });
        }
        badge(ctx, env, env.text('t3'), 'g-esquema', 1208, 60, s.intro, 'right');
      },

      // Draw: explain background; the sign `carpetas` with three closed folders labeled «Esta medición», «Mapas de coberturas» and
      // «Señales satelitales»; on line 1 the label bar «NO SE SUMAN NI SE COMPARAN» appears below them; on line 2 the third folder
      // opens a little to show dots along a central corridor, labeled «Corredor central y occidente».
      otras: function (ctx, s, env) {
        var S = env.style;
        var box = { x: 140, y: 190, w: 1000, h: 300 };
        var op = s.at(1);
        env.course.carpetas(ctx, box, {
          labels: [env.text('t1'), env.text('t2'), env.text('t3')], p: s.intro, open: [0, 0, op * 0.9],
          draw: [null, null, function (c, b, pp) {
            S.mapPanel(c, b, { p: 1, grid: false, draw: function (inner) {
              S.mapLine(c, [[inner.x + inner.w * 0.5, inner.y + 4], [inner.x + inner.w * 0.5, inner.y + inner.h]], { dashed: true });
              for (var d = 0; d < 8; d++) {
                c.fillStyle = S.role('machine-glow-1');
                c.beginPath(); c.arc(inner.x + inner.w * 0.5 + ((d * 37) % 15 - 7), inner.y + 10 + d * 14, 3, 0, Math.PI * 2); c.fill();
                if (d % 2) { c.beginPath(); c.arc(inner.x + inner.w * 0.22 + (d % 3) * 6, inner.y + 20 + d * 12, 3, 0, Math.PI * 2); c.fill(); }
              }
            } });
          }]
        });
        S.text(ctx, env.text('t5'), { x: box.x + box.w - 10, y: 96, size: 18, weight: 700, align: 'right', p: op });
        var m = S.labelBar(ctx, env.text('t4'), { x: 0, y: 0, size: 26, measureOnly: true });
        S.labelBar(ctx, env.text('t4'), { x: 640 - m.w / 2, y: 512, size: 26, p: s.at(0) });
      },

      // Draw: explain background; on line 1 a dashed line runs along the urban-rural edge of the `valle-corte`, labeled «Borde
      // urbano-rural como límite», and a small map panel at the top right shows a satellite pass and a `pin` labeled «Alerta
      // temprana»; on line 2 the stamp `stamp-insumo` slides in.
      propuesta: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var vb = { x: 80, y: 330, w: 1120, h: 250 };
        var g = env.course.valleCorte(ctx, vb, { p: s.intro, t: s.t, badge: false });
        var p1 = s.at(0);
        var bm = S.labelBar(ctx, env.text('t1'), { x: 0, y: 0, size: 20, measureOnly: true });
        var bar = S.labelBar(ctx, env.text('t1'), { x: 640 - bm.w / 2, y: 196, size: 20, role: 'accent-1', p: p1 });
        [0.28, 0.72].forEach(function (f) {
          var x = g.px(f), y = g.hAt(f);
          S.stroke(ctx, [[x, y - 90], [x, y + 24]], { role: 'ink', width: 2.6, dash: [9, 7], p: p1 });
        });
        S.stroke(ctx, [[bar.x + 30, bar.y + bar.h], [g.px(0.28), g.hAt(0.28) - 92]], { role: 'ink', width: 1.2, p: p1 });
        S.stroke(ctx, [[bar.x + bar.w - 30, bar.y + bar.h], [g.px(0.72), g.hAt(0.72) - 92]], { role: 'ink', width: 1.2, p: p1 });
        var pb = { x: 900, y: 40, w: 308, h: 190 };
        S.mapPanel(ctx, pb, { p: p1, draw: function (inner, pp) {
          env.course.sateliteCruce(ctx, inner, { k: E.clamp(pp * 1.2) * 0.62, p: pp, t: s.t, size: 30, scanLength: inner.h * 0.55 });
          var px = inner.x + inner.w * 0.62, py = inner.y + inner.h * 0.78;
          var pin = E.clamp(pp * 2 - 1);
          S.mapLine(ctx, S.circlePath(px, py - 14, 7), { p: pin });
          S.mapLine(ctx, [[px, py - 7], [px, py + 4]], { p: pin });
          if (pin > 0) { ctx.save(); ctx.globalAlpha *= pin; ctx.fillStyle = S.role('machine-glow-1'); ctx.beginPath(); ctx.arc(px, py - 14, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
          S.mapLabel(ctx, env.text('t2'), px - 16, py + 2, { p: pin, align: 'right', size: 13 });
        } });
        env.zones.push(pb);
        env.course.stamp(ctx, 'stamp-insumo', M, 60, { p: s.at(1), w: 420 });
      },

      // Draw: recap background; LUCÍA and HERNÁN stand on the ridge (poses: notebook in hand, pointing at the valley); on line 1
      // the motto appears on the label bar: «MEDELLÍN CRECIÓ MÁS HACIA SUS BORDES QUE HACIA ADENTRO».
      cierre: function (ctx, s, env) {
        var S = env.style;
        S.hills(ctx, { x: 420, y: 470, w: 860, h: 250 }, { seed: 7, layers: 2, roles: [['accent-6', 'accent-7'], ['accent-7', 'accent-6']] });
        S.person(ctx, env.cast('lucia'), { pose: 'notebook', x: 760, y: 610, height: 260, p: s.intro });
        S.person(ctx, env.cast('hernan'), { pose: 'pointing-valley', x: 960, y: 610, height: 270, facing: 'left', p: s.intro });
        S.labelBar(ctx, env.text('t1'), { x: M, y: 80, size: 32, maxWidth: 1000, p: s.at(0) });
        return { on: { lucia: { x: 760, y: 350 }, hernan: { x: 960, y: 340 } } };
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
