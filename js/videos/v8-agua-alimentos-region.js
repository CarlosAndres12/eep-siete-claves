/* V8 · «Medellín no se alimenta sola: agua, alimentos y región» (spec §11, V8). Solo dibujo: los textos vienen de
   js/data/videos.js (`texts`, t1…tn en el orden del brief), las cifras del banco y las personas del reparto. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var M = 72;

  function stamp(ctx, env, id, x, y, p, w) { return env.course.stamp(ctx, id, x, y, { p: p, w: w }); }
  // Escalas sobre una hoja clara (el fondo de título es oscuro y el signo se dibuja en `ink`).
  function escalasOnPaper(ctx, env, box, p) {
    if (p <= 0) return;
    env.style.mark(ctx, 'card', { x: box.x - 22, y: box.y - 22, w: box.w + 44, h: box.h + 44 }, { p: p });
    env.course.escalas(ctx, box, { p: p });
  }
  // Ficha de glosario: píldora clara con contorno `ink` y el término.
  function glossChip(ctx, env, str, x, y, p) {
    var S = env.style;
    if (p <= 0) return;
    var m = S.text(ctx, str, { size: 18, weight: 700, measureOnly: true });
    S.pill(ctx, { x: x, y: y, w: m.width + 56, h: 40 }, { role: 'accent-8', outline: 'ink', outlineWidth: 2, p: p });
    S.sign(ctx, 'hoja', { x: x + 22, y: y + 30, size: 20, p: p });
    S.text(ctx, str, { x: x + 40, y: y + 20, size: 18, weight: 700, baseline: 'middle', p: p });
  }
  // Signo de interrogación dibujado (sin texto).
  function questionSign(ctx, env, x, y, s, p) {
    var S = env.style;
    S.stroke(ctx, function (c) { c.arc(x, y - s * 0.62, s * 0.22, Math.PI * 1.05, Math.PI * 2.35); }, { role: 'ink', width: s * 0.09, p: p });
    S.stroke(ctx, [[x + s * 0.05, y - s * 0.42], [x, y - s * 0.3], [x, y - s * 0.2]], { role: 'ink', width: s * 0.09, p: p });
    S.fill(ctx, S.circlePath(x, y - s * 0.06, s * 0.06), { role: 'ink', p: p });
  }

  EEP.videos.v8 = {
    setup: function () {},
    scenes: {
      // Draw: title background; on line 1 the title «MEDELLÍN NO SE ALIMENTA SOLA» with the second line «agua, alimentos y
      // región» appears; on line 2 the sign `escalas` rises at the right: the `distrito`, `valle` and `region` frames, each with
      // its legend chip and label.
      gancho: function (ctx, s, env) {
        var S = env.style;
        S.title(ctx, env.text('t1'), { x: M, y: 220, size: 72, maxWidth: 620, second: env.text('t2'), p: s.at(0) });
        var a = S.appear('illus', s.at(1));
        ctx.save(); ctx.translate(0, a.dy * 2);
        escalasOnPaper(ctx, env, { x: 770, y: 110, w: 420, h: 380 }, s.at(1));
        ctx.restore();
      },

      // Draw: explain background; on line 1 a small `canasta` sign at the center, labeled «Producción de Medellín», and produce
      // arrows arriving from the edges of the frame, labeled «Otras subregiones», «Otros departamentos» and «Exterior», with the
      // badge «Esquema» and no values; on line 2 LUCÍA appears at the lower left (pose: notebook in hand, asking); on line 3 a
      // `card` frame without values, with the title «Dependencia alimentaria» and the note «Sin cifra: medidas que no son
      // equivalentes», appears at the right.
      fraccion: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p = s.at(0);
        var cx = 560, cy = 400;
        env.course.produceArrow(ctx, [90, 150], [cx - 90, cy - 60], { p: p });
        env.course.produceArrow(ctx, [560, 120], [cx, cy - 110], { p: E.clamp(p * 1.2 - 0.1) });
        env.course.produceArrow(ctx, [1180, 170], [cx + 90, cy - 60], { p: E.clamp(p * 1.2 - 0.2) });
        S.text(ctx, env.text('t2'), { x: 90, y: 118, size: 19, weight: 700, p: p });
        S.text(ctx, env.text('t3'), { x: 560, y: 92, size: 19, weight: 700, align: 'center', p: E.clamp(p * 1.2 - 0.1) });
        S.text(ctx, env.text('t4'), { x: 1180, y: 140, size: 19, weight: 700, align: 'right', p: E.clamp(p * 1.2 - 0.2) });
        S.sign(ctx, 'canasta', { x: cx, y: cy, size: 90, p: p });
        S.text(ctx, env.text('t1'), { x: cx, y: cy + 34, size: 18, weight: 700, align: 'center', p: p });
        S.mark(ctx, 'badge', { x: cx - 50, y: cy + 60 }, { text: env.text('t5'), variant: 'state', glyph: 'g-esquema', size: 14, p: p });
        S.person(ctx, env.cast('lucia'), { pose: 'asking', x: 190, y: 600, height: 240, p: s.at(1) });
        var bx = env.cards.blank(ctx, { x: 790, y: 300, w: 420, title: env.text('t6'), note: env.text('t7'), p: s.at(2) });
        env.zones.push(bx);
        return { on: { lucia: { x: 190, y: 600 - 240 } } };
      },

      // Draw: figure background; on line 1 the figure card `P6-C70` appears at the center with the legend chip `valle`, and a
      // small truck pictogram drives along a road at the lower left, outside the card, carrying a crate; on line 2 the note
      // «Cuenta viajes, no toneladas» appears under the card; on line 3 a `gota` sign appears at the right edge with a question
      // mark sign.
      carga: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.draw(ctx, 'P6-C70', { x: 360, y: 70, w: 560, p: s.at(0) });
        env.zones.push(a);
        var p = s.at(0);
        S.stroke(ctx, [[M, 560], [330, 548]], { role: 'ink-soft', width: 6, p: p });
        S.stroke(ctx, [[M, 560], [330, 548]], { role: 'ground', width: 1.4, dash: [10, 10], p: p });
        if (p > 0) {
          var tx = E.lerp(110, 250, E.inOut(p));
          var ty = 560 - (tx - M) * 12 / 258;
          S.withAppear(ctx, 'fade', p, function () {
            env.course.signs.camion(ctx, tx, ty - 2, 60);
            env.course.signs.cajon(ctx, tx - 20, ty - 50, 34);
          });
        }
        S.labelBar(ctx, env.text('t1'), { x: 360, y: a.y + a.h + 18, size: 18, role: 'accent-1', p: s.at(1) });
        var q = s.at(2);
        S.sign(ctx, 'gota', { x: 1110, y: 420, size: 70, p: q });
        questionSign(ctx, env, 1170, 360, 70, q);
      },

      // Draw: figure background; on line 1 the stamp `stamp-agua` appears at the top; on line 2 the figure card `P6-C80` appears at
      // the left with the legend chip `region`, and the sign `embalses` appears small at the right, outside the card.
      agua: function (ctx, s, env) {
        var m = env.course.stamp(ctx, 'stamp-agua', 0, 0, { measureOnly: true, w: 520 });
        stamp(ctx, env, 'stamp-agua', 640 - m.w / 2, 36, s.at(0), 520);
        var a = env.cards.draw(ctx, 'P6-C80', { x: M, y: 170, w: 560, p: s.at(1) });
        env.zones.push(a);
        env.course.embalses(ctx, { x: 690, y: 250, w: 520, h: 250 }, { p: s.at(1), t: s.t });
      },

      // Draw: dialogue background with the place `huerta`; on line 1 HERNÁN holds the garden hose (pose: holding the hose); on
      // line 2 a thin pipe runs from the far ridge to a tap, labeled «Caudal concesionado: agua autorizada para captar».
      concesionado: function (ctx, s, env) {
        var S = env.style;
        S.hill(ctx, 760, 470, 520, 230, { face: 'accent-1', flank: 'accent-6' });
        env.course.huerta(ctx, { x: 40, y: 400, w: 680, h: 190 }, { p: s.intro, t: s.t });
        var pp = s.at(1);
        if (pp > 0) {
          env.course.pipe(ctx, [[1150, 300], [1000, 380], [820, 470], [640, 500]], { p: pp, width: 4 });
          S.withAppear(ctx, 'illus', pp, function () {
            S.stroke(ctx, [[640, 500], [640, 540]], { role: 'ink', width: 4 });
            S.stroke(ctx, [[640, 540], [622, 540], [622, 552]], { role: 'ink', width: 4 });
            S.fill(ctx, S.rectPath(630, 492, 20, 8, 2), { role: 'accent-7' });
            S.sign(ctx, 'gota', { x: 622, y: 578, size: 18 });
          });
          S.labelBar(ctx, env.text('t1'), { x: 760, y: 170, size: 20, role: 'accent-1', maxWidth: 440, p: pp });
        }
        S.person(ctx, env.cast('hernan'), { pose: 'hose', x: 330, y: 600, height: 290, p: s.at(0) });
        return { on: { hernan: { x: 330, y: 600 - 290 } } };
      },

      // Draw: figure background; on line 1 the figure cards `P6-C42`, `P6-C44` and `P6-C57` appear in a row, each with the legend
      // chip `distrito`; on line 2 the extras `extra-2` appear behind a small stall at the lower left, outside the cards.
      campesinado: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var ids = ['P6-C42', 'P6-C44', 'P6-C57'];
        ids.forEach(function (id, i) {
          var b = env.cards.draw(ctx, id, { x: M + i * 388, y: 110, w: 360, compact: true, p: E.clamp(s.at(0) * 2 - i * 0.4) });
          env.zones.push(b);
        });
        var ex = env.cast('extra-2').people;
        S.person(ctx, ex[0], { pose: 'standing', x: 150, y: 575, height: 190, p: s.at(1) });
        S.person(ctx, ex[1], { pose: 'standing', x: 270, y: 575, height: 196, facing: 'left', p: s.at(1) });
        env.course.mercado(ctx, 100, 590, { w: 220, h: 160, p: s.at(1) });
      },

      // Draw: figure background; the figure card `P6-C58` at the center; on line 1 the sign `predios` appears at the lower left,
      // outside the card, with the badge «Esquema».
      predios: function (ctx, s, env) {
        var a = env.cards.draw(ctx, 'P6-C58', { x: 360, y: 70, w: 560, p: s.intro });
        env.zones.push(a);
        env.course.predios(ctx, { x: M, y: 400, w: 250, h: 120 }, { p: s.at(0), seed: 11, badge: false });
        env.style.mark(ctx, 'badge', { x: M, y: 540 }, { text: env.text('t1'), variant: 'state', glyph: 'g-esquema', size: 14, p: s.at(0) });
      },

      // Draw: figure background; on line 1 the figure card `P6-C64` appears at the left; on line 2 a small `canasta` with a single
      // fruit appears under it, outside the card; on line 3 the card `P6-C66` appears at the center with its three parts labeled
      // «Leve», «Moderada» and «Severa», and the card `P6-C65` appears at the right with the label «Zona rural»; on line 4 the
      // label bar «¿QUÉ PROPONE EL ESTUDIO?» slides in.
      inseguridad: function (ctx, s, env) {
        var S = env.style;
        var a = env.cards.draw(ctx, 'P6-C64', { x: 60, y: 70, w: 360, compact: true, p: s.at(0) });
        env.zones.push(a);
        var cp = s.at(1);
        // canasta casi vacía: una sola fruta
        var by = a.y + a.h + 130;
        S.withAppear(ctx, 'illus', cp, function () {
          S.fill(ctx, S.circlePath(232, by - 62, 13), { role: 'accent-5' });
          S.stroke(ctx, function (c) { c.arc(240, by - 56, 44, Math.PI, 0); }, { role: 'ink', width: 2.4 });
          var bk = [[180, by - 56], [300, by - 56], [284, by], [196, by]];
          S.fill(ctx, bk, { role: 'accent-4' });
          S.stroke(ctx, { pts: bk, closed: true }, { role: 'ink', width: 1.6 });
          S.stroke(ctx, [[188, by - 30], [292, by - 30]], { role: 'ink', width: 1.2 });
        });
        var p3 = s.at(2);
        var b = env.cards.draw(ctx, 'P6-C66', { x: 450, y: 70, w: 380, compact: true, p: p3 });
        S.labelBar(ctx, env.text('t4'), { x: 860, y: 30, size: 16, role: 'accent-1', p: p3 });
        var c = env.cards.draw(ctx, 'P6-C65', { x: 860, y: 70, w: 350, compact: true, p: p3 });
        env.zones.push(b, c);
        if (p3 > 0) {
          var lx = 450;
          ['t1', 't2', 't3'].forEach(function (k) {
            var r = S.labelBar(ctx, env.text(k), { x: lx, y: b.y + b.h + 14, size: 15, role: 'dark', p: p3 });
            lx += r.w + 10;
          });
        }
        S.labelBar(ctx, env.text('t5'), { x: 450, y: 500, size: 26, p: s.at(3) });
      },

      // Draw: explain background; the sign `escalas` at the center; on line 1 lines like a handshake join the `distrito` frame and
      // the `region` frame, labeled «Acuerdos de reciprocidad», and the `predios` sign appears with the label bar «EL ESTUDIO PIDE
      // UNA DECISIÓN SOBRE LA ESTRUCTURA PREDIAL CAMPESINA»; on line 2 the glossary chip «reciprocidad territorial» appears and
      // the stamp `stamp-insumo` slides in.
      propuesta: function (ctx, s, env) {
        var S = env.style;
        var box = { x: 400, y: 130, w: 480, h: 340 };
        env.course.escalas(ctx, box, { p: s.intro });
        var p = s.at(0);
        var inset = 2 * Math.min(box.w, box.h) * 0.17;
        var cy = box.y + box.h * 0.55;
        // dos líneas que se entrelazan, del marco del Distrito al marco de la región (a ambos lados)
        [-1, 1].forEach(function (side) {
          var xi = side < 0 ? box.x + inset : box.x + box.w - inset;
          var xo = side < 0 ? box.x : box.x + box.w;
          S.stroke(ctx, { pts: [[xi, cy - 14], [(xi + xo) / 2, cy - 44], [xo - side * 2, cy + 6]], smooth: true }, { role: 'accent-7', width: 3, p: p });
          S.stroke(ctx, { pts: [[xo, cy - 22], [(xi + xo) / 2, cy + 24], [xi + side * 2, cy + 14]], smooth: true }, { role: 'ink', width: 3, p: p });
          S.fill(ctx, S.circlePath((xi + xo) / 2, cy - 6, 6), { role: 'accent-9', p: p });
        });
        S.text(ctx, env.text('t1'), { x: M, y: cy - 30, size: 20, weight: 700, maxWidth: 300, p: p });
        S.stroke(ctx, [[M + 40, cy - 16], [box.x - 4, cy - 6]], { role: 'ink', width: 1.2, p: p });
        S.labelBar(ctx, env.text('t2'), { x: M, y: 30, size: 22, maxWidth: 780, p: p });
        env.course.predios(ctx, { x: 940, y: 200, w: 260, h: 130 }, { p: p, seed: 7, slope: 0.4 });
        var p2 = s.at(1);
        glossChip(ctx, env, env.text('t3'), M, 430, p2);
        stamp(ctx, env, 'stamp-insumo', 900, 430, p2, 320);
        env.zones.push(box);
      },

      // Draw: dialogue background with the place `huerta`; on line 1 HERNÁN (pose: holding the basket) and LUCÍA (pose: notebook
      // in hand) talk by the fence; on line 2 three small labeled groups appear in the corregimiento: a market stall «Circuitos
      // cortos», a basket «Alimentos frescos» and a house with a garden «Identidad campesina».
      'valor-rural': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        env.course.huerta(ctx, { x: 30, y: 400, w: 560, h: 190 }, { p: s.intro, t: s.t, house: false });
        S.person(ctx, env.cast('hernan'), { pose: 'basket', x: 200, y: 600, height: 280, p: s.at(0) });
        S.person(ctx, env.cast('lucia'), { pose: 'notebook', x: 400, y: 600, height: 265, facing: 'left', p: s.at(0) });
        var p2 = s.at(1);
        var g1 = E.clamp(p2 * 3), g2 = E.clamp(p2 * 3 - 0.7), g3 = E.clamp(p2 * 3 - 1.4);
        env.course.mercado(ctx, 660, 560, { w: 160, h: 170, p: g1 });
        S.text(ctx, env.text('t1'), { x: 740, y: 360, size: 19, weight: 700, align: 'center', p: g1 });
        S.sign(ctx, 'canasta', { x: 930, y: 556, size: 70, p: g2 });
        S.text(ctx, env.text('t2'), { x: 930, y: 430, size: 19, weight: 700, align: 'center', maxWidth: 150, p: g2 });
        S.withAppear(ctx, 'illus', g3, function () {
          S.building(ctx, { x: 1060, y: 470, w: 80, h: 90 }, { kind: 'casa', roof: 'accent-5' });
          for (var k = 0; k < 4; k++) S.sign(ctx, 'hoja', { x: 1150 + (k % 2) * 22, y: 560 - Math.floor(k / 2) * 20, size: 20 });
        });
        S.text(ctx, env.text('t3'), { x: 1110, y: 400, size: 19, weight: 700, align: 'center', maxWidth: 160, p: g3 });
        return { on: { hernan: { x: 200, y: 600 - 280 }, lucia: { x: 400, y: 600 - 265 } } };
      },

      // Draw: recap background; on line 1 the stamp `stamp-agua` lands; on line 2 the motto appears on the label bar: «LA SOBERANÍA
      // ALIMENTARIA EMPIEZA POR LA SOBERANÍA HÍDRICA»; on line 3 the stamp `stamp-insumo` slides in.
      cierre: function (ctx, s, env) {
        var S = env.style;
        stamp(ctx, env, 'stamp-agua', M, 70, s.at(0), 480);
        S.labelBar(ctx, env.text('t1'), { x: M, y: 280, size: 34, role: 'accent-1', maxWidth: 1000, p: s.at(1) });
        stamp(ctx, env, 'stamp-insumo', M, 440, s.at(2), 400);
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
