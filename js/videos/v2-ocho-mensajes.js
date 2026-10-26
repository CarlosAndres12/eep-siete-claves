/* V2 · «Los ocho mensajes principales del estudio» (spec §11, V2). Solo dibujo: los textos vienen de
   js/data/videos.js (`texts`, t1…tn en el orden del brief), las cifras del banco y las personas del reparto. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var W = 1280, M = 72;

  function seg(s, i) { return s.at(i); }
  function stamp(ctx, env, id, x, y, p, w) { return env.course.stamp(ctx, id, x, y, { p: p, w: w }); }
  function badgeEsquema(ctx, env, x, y, p) {
    env.style.mark(ctx, 'badge', { x: x, y: y }, { text: env.data.site.ui.esquema, variant: 'state', glyph: 'g-esquema', size: 14, p: p });
  }
  function msgBar(ctx, env, s) {
    return env.style.labelBar(ctx, env.text('t1'), { x: M, y: 40, size: 22, p: s.at(-1) });
  }
  function cast(env, id) { return env.cast(id); }

  EEP.videos.v2 = {
    setup: function () {},
    scenes: {
      // Draw: title background; on line 1 the title «LOS OCHO MENSAJES» with the second line «del estudio técnico» appears,
      // and eight small tag cards drop in a row along the bottom edge, each with one label; on line 2 the stamp
      // `stamp-insumo` slides in at the top left.
      apertura: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        S.title(ctx, env.text('t1'), { x: M, y: 300, size: 84, second: env.text('t2'), p: s.at(0) });
        for (var i = 0; i < 8; i++) {
          var pi = E.clamp(s.at(0) * 2.2 - i * 0.14);
          if (pi <= 0) continue;
          var w = 132, gap = 10, x = M + i * (w + gap) - 6, drop = (1 - E.out(pi)) * -40;
          ctx.save(); ctx.translate(0, drop);
          env.course.tag(ctx, { x: x, y: 440, w: w, h: 108 }, env.text('t' + (i + 3)), { p: pi, size: 14, tilt: (i % 2 ? 2 : -2) });
          ctx.restore();
        }
        stamp(ctx, env, 'stamp-insumo', M, 60, s.at(1), 380);
      },

      // Draw: figure background; a `dark` label bar at the top left; on line 1 the figure card `P2-C03` appears at the center;
      // on line 2 the card `P2-C04` appears to its right, smaller, with the label «Unidad Agrícola Familiar», and the sign
      // `predios` appears at the lower left, outside the cards, with the badge «Esquema»; on line 3 the card `P2-C04` is emphasized.
      m1: function (ctx, s, env) {
        var S = env.style;
        msgBar(ctx, env, s);
        var a = env.cards.draw(ctx, 'P2-C03', { x: 300, y: 110, w: 520, p: s.at(0) });
        env.zones.push(a);
        var b = env.cards.draw(ctx, 'P2-C04', { x: 850, y: 150, w: 360, compact: true, p: s.at(1), emphasize: 'card', emph: s.at(2) });
        env.zones.push(b);
        S.labelBar(ctx, env.text('t2'), { x: 850, y: 108, size: 16, p: s.at(1), role: 'accent-1' });
        env.course.predios(ctx, { x: 70, y: 440, w: 200, h: 110 }, { p: s.at(1), seed: 5 });
      },

      // Draw: dialogue background with the place `huerta` on the ridge; on line 1 the sign `predios` fills the far slope as a
      // quilt of small plots and a `dark` label bar appears; on line 2 HERNÁN appears beside his garden (pose: hat in hand,
      // pointing at the slope); on line 3 a dashed line labeled «Borde urbano» appears, still, at the right edge of the plots;
      // on line 4 the label bar shrinks to the top left.
      'm1-decision': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        env.course.predios(ctx, { x: 560, y: 250, w: 520, h: 200 }, { p: s.at(0), seed: 9, slope: 0.5, badge: false });
        S.mark(ctx, 'badge', { x: 1080, y: 210 }, { text: env.data.site.ui.esquema, variant: 'state', glyph: 'g-esquema', size: 14, align: 'right', p: s.at(0) });
        env.course.huerta(ctx, { x: 60, y: 440, w: 520, h: 150 }, { p: s.intro, t: s.t });
        var lb = s.at(3);
        var size = E.lerp(26, 18, lb);
        S.labelBar(ctx, env.text('t1'), { x: M, y: E.lerp(110, 30, lb), size: size, maxWidth: E.lerp(1000, 760, lb), p: s.at(0) });
        // borde urbano: línea discontinua quieta en el borde derecho de las parcelas
        var bp = s.at(2);
        if (bp > 0) {
          S.stroke(ctx, [[1100, 230], [1110, 470]], { role: 'ink', width: 2.4, dash: [10, 8], p: bp });
          S.text(ctx, env.text('t2'), { x: 1120, y: 260, size: 18, weight: 700, p: bp });
          for (var i = 0; i < 3; i++) S.building(ctx, { x: 1130 + i * 34, y: 300 + i * 30, w: 28, h: 60 }, { kind: 'bloque', seed: i, alpha: bp });
        }
        S.person(ctx, cast(env, 'hernan'), { pose: s.line >= 1 ? 'pointing-valley' : 'hat-in-hand', x: 470, y: 600, height: 300, p: s.at(1) });
        return { on: { hernan: { x: 470, y: 600 - 300 } } };
      },

      // Draw: figure background; the label bar; on line 1 the figure card `P2-C09` appears at the center, with the card `P2-C08`
      // folded beneath it as its detail; on line 2 the card shows the line of `P2-C10`, and the sign `valle-corte` appears small at
      // the lower left, outside the card, with both slopes filled with the `dots` pattern and labeled «Ladera»; the badge «Esquema».
      m2: function (ctx, s, env) {
        var S = env.style;
        msgBar(ctx, env, s);
        var a = env.cards.draw(ctx, 'P2-C09', { x: 370, y: 96, w: 610, p: s.at(0), compact: true });
        var b = env.cards.draw(ctx, 'P2-C08', { x: 370, y: a.y + a.h + 8, w: 610, compact: true, maxHead: 28, p: s.at(0) });
        env.zones.push(a, b);
        var c = env.cards.draw(ctx, 'P2-C10', { x: 1000, y: 96, w: 240, compact: true, maxHead: 24, p: s.at(1) });
        env.zones.push(c);
        env.course.valleCorte(ctx, { x: 30, y: 400, w: 320, h: 140 }, { p: s.at(1), fill: { ladera: 'dots' }, labels: { ladera: env.text('t2') }, labelSize: 15, t: s.t });
      },

      // Draw: explain background; the sign `valle-corte` across the lower half; on line 1 the label «El ordenamiento no modifica la
      // amenaza» appears over the slopes; small houses appear on the slope and on the valley floor with the labels «Dónde se
      // construye» and «Con qué densidad»; on line 2 a small cloud with rain appears over the slope with the label «Cambio climático».
      'm2-exposicion': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var g = env.course.valleCorte(ctx, { x: 80, y: 300, w: 1120, h: 280 }, { p: s.intro, fill: { ladera: 'dots' }, t: s.t });
        S.labelBar(ctx, env.text('t1'), { x: M, y: 70, size: 26, p: s.at(0) });
        var hp = E.clamp(s.at(0) * 1.5 - 0.3);
        for (var i = 0; i < 4; i++) {
          var f = 0.31 + i * 0.03;
          S.withAppear(ctx, 'illus', E.clamp(hp * 2 - i * 0.2), function () { S.building(ctx, { x: g.px(f) - 13, y: g.hAt(f) - 30, w: 26, h: 26 }, { kind: 'casa' }); });
        }
        S.text(ctx, env.text('t2'), { x: g.px(0.3), y: g.hAt(0.3) - 70, size: 20, weight: 700, p: hp });
        S.text(ctx, env.text('t3'), { x: g.px(0.5), y: 230, size: 20, weight: 700, align: 'center', p: E.clamp(hp * 2 - 1) });
        S.stroke(ctx, [[g.px(0.5), 240], [g.px(0.5), g.hAt(0.5) - 120]], { role: 'ink', width: 1.4, p: E.clamp(hp * 2 - 1) });
        var cp = s.at(1);
        if (cp > 0) {
          var cx = g.px(0.75), cy = 200;
          S.clouds(ctx, { x: cx - 90, y: cy - 60, w: 180, h: 60 }, { seed: 4, count: 1, size: 150, role: 'ground-2', alpha: cp });
          for (var k = 0; k < 6; k++) S.stroke(ctx, [[cx - 50 + k * 20, cy + 10], [cx - 58 + k * 20, cy + 40]], { role: 'accent-2', width: 2, p: cp });
          S.text(ctx, env.text('t4'), { x: cx + 100, y: cy - 10, size: 20, weight: 700, p: cp });
        }
      },

      // Draw: compare background with two columns; the left column, titled «Área urbanizada · mapa combinado», holds the card
      // `P2-C09`; on line 1 the right column, titled «Todo el Distrito · zonificación oficial», receives the card `P2-C13`; on line 2
      // LUCÍA appears between the columns at the bottom (pose: asking); on line 3 the stamp `stamp-base` lands between the columns.
      'm2-bases': function (ctx, s, env) {
        var S = env.style;
        S.labelBar(ctx, env.text('t1'), { x: 40, y: 40, size: 18, p: s.intro, maxWidth: 580 });
        var a = env.cards.draw(ctx, 'P2-C09', { x: 40, y: 104, w: 560, compact: true, p: s.intro });
        S.labelBar(ctx, env.text('t2'), { x: 680, y: 40, size: 18, p: s.at(0), maxWidth: 580 });
        var b = env.cards.draw(ctx, 'P2-C13', { x: 680, y: 104, w: 560, compact: true, p: s.at(0) });
        env.zones.push(a, b);
        S.person(ctx, env.cast('lucia'), { pose: 'asking', x: 640, y: 640, height: 210, p: s.at(1) });
        var m = env.course.stamp(ctx, 'stamp-base', 0, 0, { measureOnly: true, w: 360 });
        env.course.stamp(ctx, 'stamp-base', 640 - m.w / 2 - 230, 470, { p: s.at(2), w: 360 });
        return { on: { lucia: { x: 640, y: 640 - 210 } } };
      },

      // Draw: explain background; the label bar; on line 1 a small `canasta` sign at the center labeled «Producción de Medellín»,
      // and many larger produce crates arriving from the edges of the frame with the label «Alimentos que demanda el valle», with
      // the badge «Esquema»; on line 2 a `card` frame without values at the right, with the title «Porcentaje del titular» and the
      // note «Sin cifra: medidas que no son equivalentes»; on line 3 a text card appears under it.
      m3: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        msgBar(ctx, env, s);
        var p = s.at(0);
        var cx = 400, cy = 420;
        var crates = [[-280, -150], [-310, 20], [-230, 140], [250, -150], [290, 10], [220, 140], [-110, -200], [110, -205], [-120, 160], [120, 160]];
        crates.forEach(function (d, i) {
          var pi = E.out(E.clamp(p * 2 - i * 0.1));
          if (pi <= 0) return;
          var far = 1 - pi;
          env.course.signs.cajon(ctx, cx + d[0] * (1 + far * 1.4), cy + d[1] * (1 + far * 1.4), 104);
        });
        S.sign(ctx, 'canasta', { x: cx, y: cy + 10, size: 40, p: p });
        S.text(ctx, env.text('t2'), { x: cx, y: cy + 44, size: 18, weight: 700, align: 'center', p: p });
        S.text(ctx, env.text('t3'), { x: cx, y: 128, size: 20, weight: 700, align: 'center', p: E.clamp(p * 2 - 1) });
        badgeEsquema(ctx, env, 90, 540, p);
        var bx = env.cards.blank(ctx, { x: 760, y: 170, w: 440, title: env.text('t5'), note: env.text('t6'), p: s.at(1) });
        env.zones.push(bx);
        if (s.at(2) > 0) env.course.tag(ctx, { x: 760, y: bx.y + bx.h + 26, w: 440, h: 96 }, env.text('t7'), { p: s.at(2), size: 19 });
      },

      // Draw: dialogue background with the place `mercado-campesino` and the extras `extra-2` behind the stall; on line 1 HERNÁN
      // stands at the stall with his basket (pose: holding the basket, asking); on line 2 arrows of produce enter the valley from
      // the mountain edges, labeled «Subregiones y otros departamentos»; on line 3 a label bar appears; on line 4 it shrinks to the top left.
      'm3-region': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var ex = env.cast('extra-2').people;
        S.person(ctx, ex[0], { pose: 'standing', x: 610, y: 560, height: 205, p: s.intro });
        S.person(ctx, ex[1], { pose: 'standing', x: 770, y: 560, height: 212, facing: 'left', p: s.intro });
        env.course.mercado(ctx, 520, 590, { w: 360, h: 340, p: s.intro });
        S.person(ctx, env.cast('hernan'), { pose: 'basket', x: 360, y: 600, height: 300, p: s.at(0) });
        var ap = s.at(1);
        env.course.produceArrow(ctx, [40, 160], [300, 330], { p: ap });
        env.course.produceArrow(ctx, [1240, 150], [980, 330], { p: E.clamp(ap * 1.2 - 0.1) });
        env.course.produceArrow(ctx, [1240, 420], [1000, 440], { p: E.clamp(ap * 1.2 - 0.2) });
        S.text(ctx, env.text('t1'), { x: 1220, y: 120, size: 20, weight: 700, align: 'right', p: ap });
        var lb = s.at(3);
        S.labelBar(ctx, env.text('t2'), { x: M, y: E.lerp(220, 30, lb), size: E.lerp(24, 17, lb), p: s.at(2) });
        return { on: { hernan: { x: 360, y: 300 } } };
      },

      // Draw: figure background; the label bar; on line 1 the sign `retiro` appears at the center with an exact scale from 0 to 30 m on
      // each bank and the label «Cauce y referencias ilustrativos», its bands still empty; on line 2 the bands at 10 m and 15 m
      // appear, then the 30 m band, and the cards `P2-C30` and `P2-C31` appear below the scheme; on line 3 the badge «Con matiz»
      // on `P2-C31` is emphasized, with the note «El capítulo prospectivo cita otra norma».
      m4: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        msgBar(ctx, env, s);
        var b2 = s.at(1);
        var box = { x: 72, y: 100, w: 660, h: 470 };
        env.course.retiro(ctx, box, {
          scale: env.scene.scale, p: s.at(0), t: s.t, label: env.text('t2'),
          bands: [
            { m: 10, p: E.clamp(b2 * 3), label: '', pattern: 'dots' },
            { m: 15, p: E.clamp(b2 * 3 - 0.5), label: env.text('t3'), pattern: 'dots' },
            { m: 30, p: E.clamp(b2 * 3 - 1.4), label: env.text('t4'), pattern: 'stripes' }
          ]
        });
        env.zones.push(box);
        var cp = E.clamp(b2 * 2 - 1);
        var c1 = env.cards.draw(ctx, 'P2-C30', { x: 770, y: 100, w: 440, compact: true, p: cp, maxHead: 34 });
        var c2 = env.cards.draw(ctx, 'P2-C31', { x: 770, y: c1.y + c1.h + 12, w: 440, compact: true, p: cp, maxHead: 34, emphasize: 'scope', emph: s.at(2) });
        env.zones.push(c1, c2);
        if (s.at(2) > 0) S.labelBar(ctx, env.text('t6'), { x: 770, y: 54, size: 15, role: 'accent-1', p: s.at(2) });
      },

      // Draw: figure background; on line 1 the figure card `P2-C28` appears at the center with its badges; on line 2 the note «El
      // documento no cuantifica la parte urbana» appears under the card; on line 3 a thin dashed band along a stream passes between
      // three small houses at the lower right, outside the card, labeled «Régimen de transición por tipo de tramo», and the card
      // `P2-C31` appears small beside it.
      'm4-ciudad': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.draw(ctx, 'P2-C28', { x: 90, y: 70, w: 600, p: s.at(0) });
        env.zones.push(a);
        S.labelBar(ctx, env.text('t3'), { x: 90, y: a.y + a.h + 18, size: 18, role: 'accent-1', p: s.at(1) });
        var p3 = s.at(2);
        if (p3 > 0) {
          var bx = 760, by = 420;
          S.water(ctx, [[bx, by + 60], [bx + 160, by + 40], [bx + 320, by + 70], [bx + 460, by + 50]], { width: 12, p: p3, t: s.t });
          S.stroke(ctx, [[bx, by + 30], [bx + 160, by + 10], [bx + 320, by + 40], [bx + 460, by + 20]], { role: 'ink', width: 1.6, dash: [7, 6], p: p3 });
          S.stroke(ctx, [[bx, by + 90], [bx + 160, by + 70], [bx + 320, by + 100], [bx + 460, by + 80]], { role: 'ink', width: 1.6, dash: [7, 6], p: p3 });
          [[bx + 90, by + 4], [bx + 250, by + 0], [bx + 390, by + 130]].forEach(function (h, i) {
            S.withAppear(ctx, 'illus', E.clamp(p3 * 2 - i * 0.3), function () { S.building(ctx, { x: h[0], y: h[1] - 30, w: 34, h: 34 }, { kind: 'casa' }); });
          });
          S.text(ctx, env.text('t4'), { x: bx, y: by + 170, size: 18, weight: 700, p: p3 });
          var c = env.cards.draw(ctx, 'P2-C31', { x: 760, y: 70, w: 440, compact: true, maxHead: 34, p: p3 });
          env.zones.push(c);
        }
      },

      // Draw: compare background with two columns; the left column, titled «En el mapa», holds a map panel with two forest patches
      // joined by a dashed corridor (version «dibujado»); on line 1 the right column, titled «En el territorio», shows the same two
      // patches joined by a strip of trees with gaps (version «en el territorio»); on line 2 the stamp `stamp-corredor` slides in.
      m5: function (ctx, s, env) {
        var S = env.style;
        S.labelBar(ctx, env.text('t1'), { x: 40, y: 50, size: 22, p: s.intro });
        var box = { x: 40, y: 110, w: 560, h: 300 };
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner, pp) { env.course.corredorDibujado(ctx, inner, { p: pp }); } });
        S.labelBar(ctx, env.text('t3'), { x: 680, y: 50, size: 22, p: s.at(0) });
        env.course.corredorTerritorio(ctx, { x: 680, y: 110, w: 560, h: 300 }, { p: s.at(0), t: s.t });
        env.zones.push(box, { x: 680, y: 110, w: 560, h: 300 });
        var m = env.course.stamp(ctx, 'stamp-corredor', 0, 0, { measureOnly: true, w: 520 });
        env.course.stamp(ctx, 'stamp-corredor', 640 - m.w / 2, 440, { p: s.at(1), w: 520 });
      },

      // Draw: figure background; on line 1 a `card` frame without values appears at the left, with the title «Serie de los enlaces
      // estructurantes» and the note «Sin cifra: el texto y una figura no coinciden en los años»; on line 2 LUCÍA appears at the lower
      // left, outside the cards (pose: pointing at the empty card); on line 3 the figure card `P2-C41` appears at the right, with its
      // scope line emphasized; on line 4 a small `ave` sign flies a dashed path under the card.
      'm5-cifra': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.blank(ctx, { x: 120, y: 90, w: 420, title: env.text('t1'), note: env.text('t2'), p: s.at(0) });
        var b = env.cards.draw(ctx, 'P2-C41', { x: 620, y: 60, w: 600, compact: true, p: s.at(2), emphasize: 'scope', emph: s.at(2) });
        env.zones.push(a, b);
        S.person(ctx, env.cast('lucia'), { pose: 'pointing-card', x: 200, y: 600, height: 230, p: s.at(1) });
        var bp = s.at(3);
        if (bp > 0) {
          var path = [[640, b.y + b.h + 50], [820, b.y + b.h + 20], [1000, b.y + b.h + 60], [1180, b.y + b.h + 30]];
          S.stroke(ctx, { pts: path, smooth: true }, { role: 'ink-soft', width: 1.4, dash: [6, 6], p: bp });
          var k = E.inOut(bp);
          S.sign(ctx, 'ave', { x: 640 + 540 * k, y: b.y + b.h + 50 - 20 * Math.sin(k * Math.PI), size: 40 });
        }
        return { on: { lucia: { x: 200, y: 600 - 230 } } };
      },

      // Draw: figure background; the label bar; on line 1 the figure card `P2-C43` with the line of `P2-C42` beneath it, and the
      // label «Medición de alta resolución · ganancia bruta»; on line 2 the sign `valle-corte` appears small at the lower left,
      // outside the card, with the corregimiento bands filled with the `stripes` pattern and labeled «Corregimientos»; on line 3
      // the label «La mayor parte del área del Distrito» appears over those bands.
      m6: function (ctx, s, env) {
        var S = env.style;
        msgBar(ctx, env, s);
        S.labelBar(ctx, env.text('t2'), { x: 560, y: 96, size: 16, role: 'accent-1', p: s.at(0) });
        var a = env.cards.draw(ctx, 'P2-C43', { x: 560, y: 140, w: 640, compact: true, p: s.at(0) });
        var b = env.cards.draw(ctx, 'P2-C42', { x: 560, y: a.y + a.h + 14, w: 640, compact: true, p: s.at(0), maxHead: 34 });
        env.zones.push(a, b);
        env.course.valleCorte(ctx, { x: 60, y: 300, w: 440, h: 170 }, {
          p: s.at(1), fill: { corregimientos: 'stripes' }, labels: { corregimientos: env.text('t3') }, labelSize: 15, t: s.t
        });
        S.text(ctx, env.text('t4'), { x: 70, y: 520, size: 18, weight: 700, maxWidth: 420, p: s.at(2) });
      },

      // Draw: dialogue background with the place `mirador`; on line 1 HERNÁN and LUCÍA stand at the railing looking at the valley far
      // below; on line 2 small new roofs appear on the high slopes in three groups labeled «Cabeceras», «Áreas de expansión» and
      // «Condominios»; on line 3 a small map panel at the top right shows dots along a central corridor, labeled «Otra medición, otro método».
      'm6-lectura': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var mir = env.course.mirador(ctx, { x: 0, y: 160, w: 1280, h: 440 }, { p: s.intro, t: s.t });
        var rp = s.at(1);
        [[620, 440, 't1'], [820, 410, 't2'], [1030, 445, 't3']].forEach(function (g, i) {
          var gp = E.clamp(rp * 2 - i * 0.4);
          for (var k = 0; k < 4; k++) S.withAppear(ctx, 'illus', gp, function () { S.building(ctx, { x: g[0] + k * 22, y: g[1] + (k % 2) * 8, w: 18, h: 18 }, { kind: 'casa', roof: 'accent-5' }); });
          S.text(ctx, env.text(g[2]), { x: g[0] + 40, y: g[1] - 14, size: 17, weight: 700, align: 'center', p: gp });
        });
        var mp = s.at(2);
        if (mp > 0) {
          var box = { x: 960, y: 40, w: 270, h: 150 };
          S.mapPanel(ctx, box, { p: mp, draw: function (inner, pp) {
            S.mapLine(ctx, [[inner.x + inner.w * 0.5, inner.y + 6], [inner.x + inner.w * 0.5, inner.y + inner.h - 6]], { p: pp, dashed: true });
            for (var d = 0; d < 9; d++) {
              ctx.save(); ctx.globalAlpha *= pp; ctx.fillStyle = S.role('machine-glow-1');
              ctx.beginPath(); ctx.arc(inner.x + inner.w * 0.5 + ((d * 37) % 17 - 8), inner.y + 12 + d * (inner.h - 24) / 8, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
            }
          } });
          S.text(ctx, env.text('t4'), { x: 960, y: 214, size: 17, weight: 700, p: mp });
        }
        S.person(ctx, env.cast('hernan'), { pose: s.line >= 0 ? 'pointing-valley' : 'standing', x: 250, y: 600, height: 280, p: s.at(0) });
        S.person(ctx, env.cast('lucia'), { pose: 'leaning', x: 420, y: 600, height: 270, p: s.at(0) });
        return { on: { hernan: { x: 250, y: 320 }, lucia: { x: 420, y: 330 } } };
      },

      // Draw: figure background; the label bar; on line 1 the figure card `P2-C47` appears at the left; on line 2 an exact horizontal
      // bar chart appears at the right: three bars from zero on one scale, labeled «La Fe» (`P2-C48`), «Río Grande II» (`P2-C49`) and
      // «Piedras Blancas» (`P2-C50`), each bar filled with the legend color of its figure's `escala`, outlined in `ink`, with that
      // scale's legend chip at its base and its exact value at its end; on line 3 LUCÍA appears at the lower left, outside the chart.
      m7: function (ctx, s, env) {
        var S = env.style;
        msgBar(ctx, env, s);
        var a = env.cards.draw(ctx, 'P2-C47', { x: 60, y: 100, w: 470, compact: true, p: s.at(0) });
        var chart = env.charts.hbars(ctx, {
          x: 570, y: 130, w: 680, h: 300, labelW: 180, valueW: 150, p: s.at(1),
          items: [{ label: env.text('t2'), figure: 'P2-C48' }, { label: env.text('t3'), figure: 'P2-C49' }, { label: env.text('t4'), figure: 'P2-C50' }]
        });
        env.zones.push(a, chart);
        S.person(ctx, env.cast('lucia'), { pose: 'asking', x: 220, y: 610, height: 230, p: s.at(2) });
        return { on: { lucia: { x: 220, y: 610 - 230 } } };
      },

      // Draw: explain background; the sign `embalses` across the frame; on line 1 a `dark` label bar appears across the ridge; on line
      // 2 a small meeting-table sign appears beside the pipes with the label «Comité de integración territorial · recomendación»; on
      // line 3 the label bar is replaced by «CASI TODA EL AGUA CONCESIONADA NACE EN LA REGIÓN».
      'm7-gobernanza': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var res = env.course.embalses(ctx, { x: 60, y: 240, w: 1160, h: 330 }, { p: s.intro, t: s.t });
        var swap = s.at(2);
        S.labelBar(ctx, env.text('t1'), { x: M, y: 70, size: 24, p: s.at(0) * (1 - swap) });
        if (swap > 0) S.labelBar(ctx, env.text('t3'), { x: M, y: 70, size: 24, p: swap });
        var tp = s.at(1);
        if (tp > 0 && res) {
          S.withAppear(ctx, 'illus', tp, function () { env.course.signs.mesa(ctx, 640, 250, 70); });
          S.labelBar(ctx, env.text('t2'), { x: 700, y: 196, size: 16, role: 'accent-1', p: tp });
        }
      },

      // Draw: explain background; the label bar; the sign `contradicciones`: on line 1 six tag cards appear in a ring, one by one, with
      // the figure card `P2-C54` small at the top right; on line 2 the first two cards are emphasized; on line 3 thin lines join each
      // card to a central label «Un mismo sistema», and each card gets a small `pin` labeled «Su instancia».
      m8: function (ctx, s, env) {
        msgBar(ctx, env, s);
        var box = { x: 60, y: 100, w: 860, h: 470 };
        env.course.contradicciones(ctx, box, {
          cards: [2, 3, 4, 5, 6, 7].map(function (k) { return env.text('t' + k); }),
          center: env.text('t8'), p: s.at(0), emph: [0, 1], emphP: s.at(1) * (1 - s.at(2) * 0.6), linksP: s.at(2), pinsP: s.at(2), pinLabel: env.text('t9')
        });
        var c = env.cards.draw(ctx, 'P2-C54', { x: 950, y: 90, w: 290, compact: true, maxHead: 26, p: s.at(0) });
        env.zones.push(box, c);
      },

      // Draw: recap background; on line 1 the stamp `stamp-insumo` slides in at the top left; on line 2 five small signs appear one by one
      // along the bottom, each with its label; one thin line joins them to the label bar with the motto: «UN MISMO SISTEMA».
      cierre: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        stamp(ctx, env, 'stamp-insumo', 80, 60, s.at(0), 400);
        var p2 = s.at(1);
        var xs = [560, 680, 800, 920, 1040], y = 440;
        var bar = S.labelBar(ctx, env.text('t6'), { x: 0, y: 0, size: 26, measureOnly: true });
        var bx = 800 - bar.w / 2, by = 250;
        xs.forEach(function (x, i) {
          var pi = E.clamp(p2 * 6 - i);
          if (pi <= 0) return;
          S.withAppear(ctx, 'illus', pi, function () {
            if (i === 0) S.water(ctx, [[x - 40, y - 10], [x - 10, y - 20], [x + 20, y - 8], [x + 40, y - 16]], { width: 9, t: s.t });
            else if (i === 1) S.stroke(ctx, [[x - 40, y - 10], [x + 40, y - 18]], { role: 'ink', width: 2.4, dash: [8, 6] });
            else if (i === 2) { S.building(ctx, { x: x - 30, y: y - 64, w: 24, h: 64 }, { kind: 'torre', seed: 2 }); S.building(ctx, { x: x, y: y - 48, w: 26, h: 48 }, { kind: 'bloque', seed: 3 }); }
            else if (i === 3) { var pth = [[x - 44, y], [x, y - 50], [x + 44, y]]; S.fill(ctx, pth, { role: 'accent-6' }); S.patternFill(ctx, pth, 'dots', {}); }
            else { S.sign(ctx, 'gota', { x: x - 16, y: y, size: 40 }); S.sign(ctx, 'canasta', { x: x + 22, y: y, size: 34 }); }
          });
          S.text(ctx, env.text('t' + (i + 1)), { x: x, y: y + 34, size: 17, weight: 700, align: 'center', p: pi });
          S.stroke(ctx, [[x, y - 72], [800, by + bar.h + 4]], { role: 'ink', width: 1.2, p: E.clamp(p2 * 2 - 1) });
        });
        S.labelBar(ctx, env.text('t6'), { x: bx, y: by, size: 26, role: 'accent-1', p: E.clamp(p2 * 2 - 1) });
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
