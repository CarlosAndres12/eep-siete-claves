/* V7 · «Amenaza, exposición y vulnerabilidad: así se lee el riesgo en Medellín» (spec §11, V7). Solo dibujo: los
   textos vienen de js/data/videos.js (`texts`, t1…tn en el orden del brief), las cifras del banco y las personas del
   reparto. */
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
    var m = S.text(ctx, txt, { size: size, weight: 700, measureOnly: true, maxWidth: o.maxWidth, lineHeight: 1.2 });
    var w = m.width + 16, h = m.height + 12;
    var x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    if (o.to) S.stroke(ctx, [o.from || [x0 + w / 2, y + h], o.to], { role: 'ink', width: o.lineWidth || 1.4, p: p });
    ctx.save();
    ctx.globalAlpha *= S.appear('text', p).alpha;
    ctx.fillStyle = S.role(o.role || 'ground');
    ctx.beginPath(); S.roundRect(ctx, x0, y, w, h, 4); ctx.fill();
    if (o.outline) { ctx.lineWidth = 1.5; ctx.strokeStyle = S.role('ink'); ctx.stroke(); }
    ctx.restore();
    S.text(ctx, txt, { x: x0 + 8, y: y + size * 0.95 + 5, size: size, weight: 700, maxWidth: o.maxWidth, p: p, lineHeight: 1.2 });
    return { x: x0, y: y, w: w, h: h };
  }
  function arrow(ctx, env, from, to, p, width) {
    var S = env.style;
    if (p <= 0) return;
    S.stroke(ctx, [from, to], { role: 'ink', width: width || 2.4, p: p });
    if (p >= 1) {
      var a = Math.atan2(to[1] - from[1], to[0] - from[0]), hl = 8 + (width || 2.4) * 2;
      S.stroke(ctx, [[to[0] - Math.cos(a - 0.45) * hl, to[1] - Math.sin(a - 0.45) * hl], to, [to[0] - Math.cos(a + 0.45) * hl, to[1] - Math.sin(a + 0.45) * hl]], { role: 'ink', width: width || 2.4 });
    }
  }
  // Ladera con trama `dots` (amenaza). (x, y) = base izquierda; w, h.
  function slope(ctx, env, x, y, w, h, o) {
    o = o || {};
    var S = env.style;
    var pts = { pts: [[x, y], [x + w * 0.18, y - h * 0.55], [x + w * 0.42, y - h], [x + w * 0.62, y - h * 0.82], [x + w, y]], closed: true, smooth: true };
    S.fill(ctx, pts, { role: o.role || 'accent-6' });
    if (o.dots !== false) S.patternFill(ctx, pts, 'dots', { alpha: o.dotsP == null ? 1 : o.dotsP });
    S.stroke(ctx, pts, { role: 'ink', width: 1.6 });
    return function (f) { // altura de la superficie en la fracción f (aprox.)
      var k = f < 0.42 ? f / 0.42 : (1 - f) / 0.58;
      return y - h * Math.sin(Math.max(0, Math.min(1, k)) * Math.PI / 2) * 0.92;
    };
  }
  function roofs(ctx, env, x, y, n, s, p, seed) {
    var S = env.style, E = env.ease;
    for (var i = 0; i < n; i++) {
      (function (i) {
        S.withAppear(ctx, 'illus', E.clamp(p * 2 - i * 0.15), function () {
          S.building(ctx, { x: x + i * s * 1.15, y: y - s - (i % 2) * s * 0.35, w: s, h: s }, { kind: 'casa', seed: (seed || 0) + i, roof: i % 3 ? 'accent-5' : null });
        });
      })(i);
    }
  }
  // Pictograma de persona (no personaje): cabeza y torso.
  function pictoPerson(ctx, env, x, y, s, r) {
    var S = env.style;
    S.fill(ctx, S.circlePath(x, y - s * 0.78, s * 0.16), { role: r || 'ink-soft' });
    S.fill(ctx, function (c) { c.arc(x, y - s * 0.22, s * 0.26, Math.PI, 0); c.lineTo(x + s * 0.26, y); c.lineTo(x - s * 0.26, y); }, { role: r || 'ink-soft' });
  }
  // Mano abierta que sostiene (pictograma).
  function hand(ctx, env, x, y, s) {
    var S = env.style;
    S.fill(ctx, function (c) { c.ellipse(x, y, s * 0.55, s * 0.2, 0, 0, Math.PI); }, { role: 'skin-3' });
    S.fill(ctx, S.ellipsePath(x - s * 0.62, y - s * 0.02, s * 0.16, s * 0.08, -0.5), { role: 'skin-3' });
    S.stroke(ctx, function (c) { c.ellipse(x, y, s * 0.55, s * 0.2, 0, 0, Math.PI); }, { role: 'ink', width: 1.4 });
  }
  function folder(ctx, env, x, y, w, h) {
    var S = env.style;
    S.fill(ctx, S.rectPath(x, y - 10, w * 0.4, 14, [5, 5, 0, 0]), { role: 'accent-7' });
    S.fill(ctx, S.rectPath(x, y, w, h, 5), { role: 'accent-9' });
    S.stroke(ctx, S.rectPath(x, y, w, h, 5), { role: 'ink', width: 1.6 });
    S.stroke(ctx, [[x + w * 0.15, y + h * 0.55], [x + w * 0.7, y + h * 0.55]], { role: 'ink', width: 1.2 });
  }

  EEP.videos.v7 = {
    setup: function () {},
    scenes: {
      // Draw: title background; on line 1 the title «AMENAZA, EXPOSICIÓN Y VULNERABILIDAD» with the second line «así se lee
      // el riesgo» appears, and the sign `triada` draws its three circles in order at the right.
      gancho: function (ctx, s, env) {
        var S = env.style;
        S.title(ctx, env.text('t1'), { x: M, y: 200, size: 60, second: env.text('t2'), p: s.at(0), maxWidth: 640 });
        env.course.triada(ctx, { x: 790, y: 150, w: 410, h: 390 }, { p: s.at(0), onDark: true, badge: false });
      },

      // Draw: explain background; the sign `triada` at the center; on line 1 the circle «Amenaza» (`dots`) is emphasized with
      // a small slope pictogram; on line 2 the circle «Exposición» (`stripes`) with roofs, two people and a school pictogram;
      // on line 3 the circle «Vulnerabilidad» (`crosses`) with a small house and an open hand; on line 4 the triple overlap
      // fills with the label «Riesgo»; the badge «Esquema».
      triada: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: 330, y: 74, w: 620, h: 420 };
        var em = [0, 1, 2].map(function (i) { return s.at(i) * (1 - 0.6 * s.at(i + 1)); });
        var g = env.course.triada(ctx, box, {
          p: s.intro, labels: [env.text('t1'), env.text('t2'), env.text('t3')], center: env.text('t4'),
          emph: em, centerP: s.at(3), badge: env.data.site.ui.esquema
        });
        env.zones.push(box);
        // pictogramas en la parte propia de cada círculo, sobre un disco de fondo
        var spots = g.c.map(function (c) {
          var dx = c[0] - g.cx, dy = c[1] - g.cy, L = Math.sqrt(dx * dx + dy * dy) || 1;
          return [c[0] + dx / L * g.r * 0.5, c[1] + dy / L * g.r * 0.5];
        });
        var R = g.r * 0.36;
        spots.forEach(function (sp, i) {
          var pi = s.at(i);
          if (pi <= 0) return;
          S.withAppear(ctx, 'illus', pi, function () {
            S.fill(ctx, S.circlePath(sp[0], sp[1], R), { role: 'ground' });
            S.stroke(ctx, S.circlePath(sp[0], sp[1], R), { role: 'ink', width: 1.6 });
            var bx = sp[0], by = sp[1] + R * 0.45;
            if (i === 0) {
              slope(ctx, env, bx - R * 0.75, by, R * 1.5, R * 1.0);
              S.fill(ctx, S.circlePath(bx + R * 0.45, by - R * 0.12, R * 0.08), { role: 'ink-soft' });
              S.fill(ctx, S.circlePath(bx + R * 0.6, by - R * 0.06, R * 0.06), { role: 'ink-soft' });
            } else if (i === 1) {
              S.building(ctx, { x: bx - R * 0.78, y: by - R * 0.42, w: R * 0.4, h: R * 0.42 }, { kind: 'casa', roof: 'accent-5' });
              S.building(ctx, { x: bx - R * 0.34, y: by - R * 0.5, w: R * 0.4, h: R * 0.5 }, { kind: 'casa' });
              pictoPerson(ctx, env, bx + R * 0.18, by, R * 0.55);
              pictoPerson(ctx, env, bx + R * 0.4, by, R * 0.45, 'accent-7');
              env.course.signs.escuela(ctx, bx + R * 0.7, by - R * 0.55, R * 0.4);
            } else {
              S.building(ctx, { x: bx - R * 0.3, y: by - R * 0.95, w: R * 0.6, h: R * 0.6 }, { kind: 'casa' });
              hand(ctx, env, bx, by - R * 0.3, R * 0.9);
            }
          });
        });
      },

      // Draw: dialogue background with the place `mirador`; on line 1 LUCÍA stands at the railing (pose: asking); on line 2 an
      // empty slope across the valley takes the `dots` pattern, labeled «Amenaza alta, poca exposición»; on line 3 roofs
      // appear on the same slope and the label changes to «Si se ocupa, sube el riesgo», and the stamp `stamp-amenaza` slides
      // in; the badge «Esquema».
      'no-es-igual': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        env.course.mirador(ctx, { x: 0, y: 160, w: 1280, h: 440 }, { p: s.intro, t: s.t });
        var dp = s.at(1), rp = s.at(2);
        // la ladera al otro lado del valle; la trama aparece en la línea 2
        var sx = 700, sy = 525, sw = 430, sh = 225;
        var hAt = null;
        S.withAppear(ctx, 'illus', s.intro, function () { hAt = slope(ctx, env, sx, sy, sw, sh, { role: 'accent-6', dotsP: dp }); });
        if (rp > 0 && hAt) {
          [0.2, 0.3, 0.52, 0.62, 0.72].forEach(function (f, i) {
            var x = sx + sw * f, y = hAt(f) + 18;
            S.withAppear(ctx, 'illus', E.clamp(rp * 2.5 - i * 0.25), function () { S.building(ctx, { x: x - 13, y: y - 26, w: 26, h: 26 }, { kind: 'casa', roof: i % 2 ? 'accent-5' : null }); });
          });
        }
        var l1 = dp * (1 - rp);
        if (l1 > 0) callout(ctx, env, env.text('t1'), sx + sw / 2, 236, l1, { size: 20, align: 'center', to: [sx + sw * 0.42, sy - sh + 10], from: [sx + sw / 2, 270], outline: true });
        if (rp > 0) callout(ctx, env, env.text('t2'), sx + sw / 2, 236, rp, { size: 20, align: 'center', to: [sx + sw * 0.42, sy - sh + 10], from: [sx + sw / 2, 270], role: 'accent-9', outline: true });
        badgeEsquema(ctx, env, sx + sw, sy + 14, dp, 'right');
        env.course.stamp(ctx, 'stamp-amenaza', M, 40, { p: rp, w: 440 });
        S.person(ctx, env.cast('lucia'), { pose: 'asking', x: 330, y: 600, height: 270, p: s.intro });
        return { on: { lucia: { x: 330, y: 600 - 270 } } };
      },

      // Draw: compare background with two columns; the left column, titled «Área urbanizada · mapa combinado», holds the
      // cards `P5-C01` and `P5-C04`; on line 2 the right column, titled «Todo el Distrito · zonificación oficial», receives
      // the card `P5-C22`; on line 3 the stamp `stamp-base` lands between the columns.
      'dos-bases': function (ctx, s, env) {
        var S = env.style;
        S.labelBar(ctx, env.text('t1'), { x: 40, y: 36, size: 18, p: s.intro, maxWidth: 560 });
        // columna izquierda a escala 0,9 para que las dos tarjetas quepan sobre la banda de subtítulos
        var k = 0.9;
        ctx.save(); ctx.translate(40, 90); ctx.scale(k, k);
        var a0 = env.cards.draw(ctx, 'P5-C01', { x: 0, y: 0, w: 620, compact: true, p: s.intro });
        var b0 = env.cards.draw(ctx, 'P5-C04', { x: 0, y: a0.h + 10, w: 620, compact: true, maxHead: 34, p: s.intro });
        ctx.restore();
        var a = { x: 40, y: 90, w: a0.w * k, h: a0.h * k }, b = { x: 40, y: 90 + b0.y * k, w: b0.w * k, h: b0.h * k };
        S.labelBar(ctx, env.text('t2'), { x: 680, y: 36, size: 18, p: s.at(1), maxWidth: 560 });
        var c = env.cards.draw(ctx, 'P5-C22', { x: 680, y: 94, w: 560, compact: true, p: s.at(1) });
        env.zones.push(a, b, c);
        var m = env.course.stamp(ctx, 'stamp-base', 0, 0, { measureOnly: true, w: 400 });
        env.course.stamp(ctx, 'stamp-base', 640 + 20, Math.min(c.y + c.h + 36, 590 - m.h), { p: s.at(2), w: 400 });
      },

      // Draw: a map panel at the center; on line 1 two thin grids labeled «Estudios Básicos de Amenaza» and «Evaluación de
      // riesgos climáticos de Medellín» overlap, and each cell keeps the higher of its two categories and is redrawn with the
      // `dots` pattern where it is «Alta»; on line 2 HERNÁN appears outside the panel at the lower left (pose: asking); on line
      // 3 the label «Producto de diagnóstico, no zonificación oficial» appears under the panel; the badge «Esquema».
      combinado: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: 330, y: 50, w: 700, h: 420 };
        var p = s.at(0);
        var cols = 9, rows = 5;
        var rA = env.rng(31), rB = env.rng(57);
        var A = [], B = [];
        for (var i = 0; i < cols * rows; i++) { A.push(Math.floor(rA() * 3)); B.push(Math.floor(rB() * 3)); }
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner, pp) {
          var gx = inner.x + 40, gy = inner.y + 70, gw = inner.w - 80, gh = inner.h - 130;
          var cw = gw / cols, ch = gh / rows;
          var gA = E.clamp(p * 4), gB = E.clamp(p * 4 - 0.8), merge = E.inOut(E.clamp(p * 3 - 1.2)), fillP = E.clamp(p * 3 - 1.6);
          var off = 14 * (1 - merge);
          function grid(dx, dy, gp) {
            if (gp <= 0) return;
            for (var c = 0; c <= cols; c++) S.mapLine(ctx, [[gx + dx + c * cw, gy + dy], [gx + dx + c * cw, gy + dy + gh]], { p: gp });
            for (var r = 0; r <= rows; r++) S.mapLine(ctx, [[gx + dx, gy + dy + r * ch], [gx + dx + gw, gy + dy + r * ch]], { p: gp });
          }
          // celdas: la categoría más alta de las dos; trama `dots` donde es «Alta»
          if (fillP > 0) {
            for (var k = 0; k < cols * rows; k++) {
              var cat = Math.max(A[k], B[k]);
              var cx = gx + (k % cols) * cw, cy = gy + Math.floor(k / cols) * ch;
              var cp = E.clamp(fillP * 2 - (k % cols) * 0.08);
              if (cp <= 0 || cat === 0) continue;
              ctx.save(); ctx.globalAlpha *= cp;
              if (cat === 1) S.fill(ctx, S.rectPath(cx + 2, cy + 2, cw - 4, ch - 4, 2), { role: 'machine-grid' });
              else S.patternFill(ctx, S.rectPath(cx + 2, cy + 2, cw - 4, ch - 4, 2), 'dots', { onDark: true });
              ctx.restore();
            }
          }
          grid(-off, -off, gA * (1 - merge * 0.5));
          grid(off, off, gB);
          S.mapLabel(ctx, env.text('t1'), gx - off, gy - off - 14, { p: gA, size: 14 });
          S.mapLabel(ctx, env.text('t2'), gx + gw + off, gy + gh + off + 26, { p: gB, size: 14, align: 'right' });
          // leyenda «Alta»
          if (fillP > 0) {
            ctx.save(); ctx.globalAlpha *= fillP;
            S.patternFill(ctx, S.rectPath(inner.x + 40, inner.y + inner.h - 34, 22, 22, 3), 'dots', { onDark: true });
            S.stroke(ctx, S.rectPath(inner.x + 40, inner.y + inner.h - 34, 22, 22, 3), { role: 'machine-line', width: 1.4 });
            ctx.restore();
            S.mapLabel(ctx, env.text('t3'), inner.x + 72, inner.y + inner.h - 17, { p: fillP, size: 14 });
          }
        } });
        env.zones.push(box);
        badgeEsquema(ctx, env, box.x + box.w, box.y - 40, s.intro, 'right');
        S.labelBar(ctx, env.text('t4'), { x: box.x, y: box.y + box.h + 18, size: 18, role: 'accent-1', p: s.at(2) });
        S.person(ctx, env.cast('hernan'), { pose: 'asking', x: 170, y: 610, height: 260, p: s.at(1) });
        return { on: { hernan: { x: 170, y: 610 - 260 } } };
      },

      // Draw: explain background; the `valle-corte` across the lower half; on line 1 small pictograms appear in order: the
      // extras `extra-4` walking and roofs, labeled «Población»; built blocks, labeled «Área construida»; a hospital, a school
      // and an emergency post, labeled «Equipamientos»; and the label bar «LO EXPUESTO» slides in.
      exposicion: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: M, y: 300, w: 1136, h: 270 };
        var g = env.course.valleCorte(ctx, box, { p: s.intro, t: s.t, badge: false });
        badgeEsquema(ctx, env, 1208, 66, s.intro, 'right');
        var p = s.at(0);
        var p1 = E.clamp(p * 4.5), p2 = E.clamp(p * 4.5 - 1), p3 = E.clamp(p * 4.5 - 2), p4 = E.clamp(p * 4.5 - 3);
        // población: transeúntes y techos en la ladera izquierda
        var ex = env.cast('extra-4').people;
        if (p1 > 0) {
          roofs(ctx, env, g.px(0.33) - 10, g.hAt(0.33) + 4, 3, 22, p1, 3);
          [[0.36, 0], [0.385, 1], [0.41, 2]].forEach(function (d, i) {
            S.person(ctx, ex[d[1]], { pose: i === 0 ? 'bag' : i === 1 ? 'backpack' : 'walking', x: g.px(d[0]), y: g.hAt(d[0]) + 6, height: 70, p: E.clamp(p1 * 2 - i * 0.3), facing: i % 2 ? 'left' : 'right' });
          });
        }
        callout(ctx, env, env.text('t1'), g.px(0.36), 196, p1, { size: 20, align: 'center', to: [g.px(0.37), g.hAt(0.37) - 70], from: [g.px(0.36), 232], outline: true });
        // área construida: bloques destacados en la ladera derecha
        if (p2 > 0) {
          for (var b = 0; b < 4; b++) {
            (function (b) {
              var f = 0.62 + b * 0.028;
              S.withAppear(ctx, 'illus', E.clamp(p2 * 2 - b * 0.2), function () {
                S.building(ctx, { x: g.px(f) - 12, y: g.hAt(f) - 54 + 4, w: 24, h: 54 }, { kind: 'bloque', seed: 30 + b });
              });
            })(b);
          }
        }
        callout(ctx, env, env.text('t2'), g.px(0.66), 196, p2, { size: 20, align: 'center', to: [g.px(0.66), g.hAt(0.66) - 60], from: [g.px(0.66), 232], outline: true });
        // equipamientos en el fondo del valle
        if (p3 > 0) {
          var by = g.base - box.h * 0.06;
          [['hospital', 0.455], ['escuela', 0.5], ['emergencia', 0.545]].forEach(function (d, i) {
            S.withAppear(ctx, 'illus', E.clamp(p3 * 2 - i * 0.3), function () {
              S.fill(ctx, S.rectPath(g.px(d[1]) - 26, by - 62, 52, 62, 6), { role: 'ground' });
              S.stroke(ctx, S.rectPath(g.px(d[1]) - 26, by - 62, 52, 62, 6), { role: 'ink', width: 1.4 });
              env.course.signs[d[0]](ctx, g.px(d[1]), by - 8, 44);
            });
          });
        }
        callout(ctx, env, env.text('t3'), g.px(0.5), 250, p3, { size: 20, align: 'center', to: [g.px(0.5), g.base - box.h * 0.06 - 66], from: [g.px(0.5), 286], outline: true });
        S.labelBar(ctx, env.text('t4'), { x: M, y: 60, size: 30, p: p4 });
      },

      // Draw: explain background; on line 1 a house pictogram appears with five small tags: «Ingresos», «Vivienda»,
      // «Educación», «Redes de apoyo», «Capacidad de adaptación», and the label «Más allá de las construcciones»; on line 2 two
      // arrows leave the house toward two labels: «Exposición: controlar la expansión» and «Vulnerabilidad: alertas tempranas y
      // mejores condiciones socioeconómicas»; on line 3 a third, thinner arrow points to the label «En otro apartado del
      // documento: mitigación y reasentamiento»; on line 4 the label bar «LO QUE HAY EN EL LUGAR Y CÓMO RESPONDE» slides in.
      vulnerabilidad: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p = s.at(0);
        var hx = 300, hy = 400, hs = 150;
        S.withAppear(ctx, 'illus', E.clamp(p * 3), function () {
          S.fill(ctx, S.rectPath(hx - 120, hy - 4, 240, 12, 4), { role: 'accent-4' });
          S.building(ctx, { x: hx - hs / 2, y: hy - hs, w: hs, h: hs }, { kind: 'casa', roof: 'accent-5' });
        });
        var tags = [
          { x: 40, y: 120, w: 170 }, { x: 40, y: 220, w: 170 }, { x: 40, y: 320, w: 170 },
          { x: 392, y: 150, w: 180 }, { x: 392, y: 260, w: 180 }
        ];
        tags.forEach(function (t, i) {
          var pi = E.clamp(p * 3 - 0.6 - i * 0.3);
          env.course.tag(ctx, { x: t.x, y: t.y, w: t.w, h: i === 4 ? 82 : 64 }, env.text('t' + (i + 1)), { p: pi, size: 16, tilt: i % 2 ? 1.5 : -1.5 });
        });
        S.labelBar(ctx, env.text('t6'), { x: hx - 170, y: hy + 22, size: 17, role: 'accent-1', p: E.clamp(p * 3 - 2) });
        // flechas hacia lo que puede hacer el ordenamiento
        var ap = s.at(1);
        arrow(ctx, env, [600, 260], [680, 150], E.clamp(ap * 2), 2.6);
        arrow(ctx, env, [600, 280], [680, 290], E.clamp(ap * 2 - 0.5), 2.6);
        callout(ctx, env, env.text('t7'), 692, 126, E.clamp(ap * 2), { size: 21, maxWidth: 500 });
        callout(ctx, env, env.text('t8'), 692, 262, E.clamp(ap * 2 - 0.5), { size: 21, maxWidth: 500 });
        var tp = s.at(2);
        arrow(ctx, env, [600, 300], [680, 412], tp, 1.3);
        callout(ctx, env, env.text('t9'), 692, 398, tp, { size: 18, maxWidth: 500 });
        S.labelBar(ctx, env.text('t10'), { x: 692, y: 512, size: 20, p: s.at(3), maxWidth: 520 });
      },

      // Draw: explain background; on line 1 a slope with the `dots` pattern and roofs on it gets a tag «Área con condición de
      // riesgo»; on line 2 a small folder labeled «Estudio de detalle» appears next to one of three similar slopes, while the
      // other two get the label «Sin estudio de detalle»; the badge «Esquema».
      'condicion-riesgo': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p1 = s.at(0), p2 = s.at(1);
        var base = 470, xs = [110, 480, 850], w = 320, h = 200;
        xs.forEach(function (x, i) {
          var pi = i === 0 ? s.intro : E.clamp(p2 * 2.5 - (i - 1) * 0.4);
          if (pi <= 0) return;
          var hAt;
          S.withAppear(ctx, 'illus', pi, function () {
            hAt = slope(ctx, env, x, base, w, h);
            [0.22, 0.34, 0.55, 0.68].forEach(function (f, k) {
              S.building(ctx, { x: x + w * f - 13, y: hAt(f) + 16 - 26, w: 26, h: 26 }, { kind: 'casa', roof: (k + i) % 2 ? 'accent-5' : null });
            });
          });
        });
        env.course.tag(ctx, { x: 110, y: 100, w: 300, h: 76 }, env.text('t1'), { p: p1, size: 19, tilt: -1.5 });
        if (p1 > 0) S.stroke(ctx, [[260, 180], [245, base - h + 10]], { role: 'ink', width: 1.4, p: p1 });
        // la carpeta junto a la primera ladera; «Sin estudio de detalle» en las otras dos
        var fp = E.clamp(p2 * 2);
        S.withAppear(ctx, 'illus', fp, function () { folder(ctx, env, 120, 496, 84, 60); });
        callout(ctx, env, env.text('t2'), 216, 506, fp, { size: 18 });
        [1, 2].forEach(function (i) {
          var lp = E.clamp(p2 * 2.5 - i * 0.4 - 0.3);
          callout(ctx, env, env.text('t3'), xs[i] + w / 2, 500, lp, { size: 18, align: 'center', outline: true });
        });
        badgeEsquema(ctx, env, 1208, 50, s.intro, 'right');
      },

      // Draw: explain background; on line 1 a tag card appears: «No aumentar densidades sobre amenaza alta por movimientos en
      // masa en la media ladera», then a second: «Priorizar estudios de detalle en áreas con condición de riesgo»; on line 2 a
      // third tag card: «Adaptación frente a inundaciones en el fondo del valle»; on line 3 the stamp `stamp-insumo` slides in.
      propuestas: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var ps = [E.clamp(s.at(0) * 2.5), E.clamp(s.at(0) * 2.5 - 1.2), s.at(1)];
        [72, 456, 840].forEach(function (x, i) {
          var b = { x: x, y: 90, w: 360, h: 290 };
          env.course.tag(ctx, b, env.text('t' + (i + 1)), { p: ps[i], size: 22, tilt: [-1.5, 1, -1][i] });
          if (ps[i] <= 0) return;
          S.withAppear(ctx, 'illus', ps[i], function () {
            var cx = x + b.w / 2, by = b.y + b.h - 26;
            if (i === 0) {
              slope(ctx, env, cx - 80, by, 160, 70);
              S.building(ctx, { x: cx - 30, y: by - 66, w: 20, h: 20 }, { kind: 'casa' });
            } else if (i === 1) {
              folder(ctx, env, cx - 70, by - 52, 70, 50);
              S.sign(ctx, 'lupa', { x: cx + 40, y: by, size: 54 });
            } else {
              S.water(ctx, [[cx - 90, by - 10], [cx - 30, by - 18], [cx + 30, by - 6], [cx + 90, by - 14]], { width: 12, t: s.t });
              S.sign(ctx, 'nube', { x: cx, y: by - 34, size: 46 });
            }
          });
        });
        var m = env.course.stamp(ctx, 'stamp-insumo', 0, 0, { measureOnly: true, w: 440 });
        env.course.stamp(ctx, 'stamp-insumo', 640 - m.w / 2, 430, { p: s.at(2), w: 440 });
      },

      // Draw: recap background; LUCÍA and HERNÁN stand on the ridge (poses: leaning on the railing, hat in hand); on line 1 the
      // stamp `stamp-amenaza` lands; on line 3 the motto appears on the label bar: «EL RIESGO DEBE ESTRUCTURAR LA CLASIFICACIÓN
      // DEL SUELO Y LA INTENSIDAD DE OCUPACIÓN», with the small label «Conclusión del estudio» above it.
      cierre: function (ctx, s, env) {
        var S = env.style;
        S.withAppear(ctx, 'illus', s.intro, function () {
          S.hill(ctx, 640, 650, 860, 120);
          // baranda corta en la loma
          S.stroke(ctx, [[880, 470], [1010, 466]], { role: 'ink', width: 3 });
          S.stroke(ctx, [[880, 490], [1010, 486]], { role: 'ink', width: 1.6 });
          [880, 945, 1010].forEach(function (x) { S.stroke(ctx, [[x, 470], [x, 548]], { role: 'ink', width: 1.6 }); });
        });
        env.course.stamp(ctx, 'stamp-amenaza', 80, 60, { p: s.at(0), w: 440 });
        S.labelBar(ctx, env.text('t2'), { x: 80, y: 262, size: 15, role: 'accent-1', p: s.at(2) });
        S.labelBar(ctx, env.text('t1'), { x: 80, y: 300, size: 28, role: 'accent-1', p: s.at(2), maxWidth: 660 });
        S.person(ctx, env.cast('lucia'), { pose: 'leaning', x: 960, y: 560, height: 250, p: s.intro });
        S.person(ctx, env.cast('hernan'), { pose: 'hat-in-hand', x: 1110, y: 560, height: 262, facing: 'left', p: s.intro });
        return { on: { lucia: { x: 960, y: 560 - 250 }, hernan: { x: 1110, y: 560 - 262 } } };
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
