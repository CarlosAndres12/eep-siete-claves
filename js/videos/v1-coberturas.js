/* V1 · «Cómo se mapea la vegetación de Medellín con satélites e inteligencia artificial» (spec §11, V1). Solo dibujo:
   los textos vienen de js/data/videos.js (`texts`, t1…tn en el orden del brief), las cifras del banco y las personas
   del reparto. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var M = 72;

  function badgeEsquema(ctx, env, x, y, p, txt) {
    env.style.mark(ctx, 'badge', { x: x, y: y }, { text: txt || env.data.site.ui.esquema, variant: 'state', glyph: 'g-esquema', size: 14, align: 'right', p: p });
  }
  // Chip de glosario: píldora clara con contorno `ink` y el término.
  function glosChip(ctx, env, str, x, y, o) {
    o = o || {};
    var S = env.style;
    var size = o.size || 19;
    var m = S.text(ctx, str, { size: size, weight: 700, measureOnly: true });
    var w = m.width + size * 2.2, h = size * 2;
    var bx = o.align === 'center' ? x - w / 2 : x;
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return { x: bx, y: y, w: w, h: h };
    S.pill(ctx, { x: bx, y: y, w: w, h: h }, { role: 'ground', outline: 'ink', outlineWidth: 2, p: p });
    S.pill(ctx, { x: bx + size * 0.55, y: y + h / 2 - size * 0.22, w: size * 0.44, h: size * 0.44 }, { role: 'accent-6', p: p });
    S.text(ctx, str, { x: bx + size * 1.4, y: y + h / 2, size: size, weight: 700, baseline: 'middle', p: p });
    return { x: bx, y: y, w: w, h: h };
  }
  // Texto del polo B en el cuerpo (para rótulos con números: nunca en la letra mono).
  function panelText(ctx, env, str, x, y, o) {
    o = o || {};
    return env.style.text(ctx, str, { x: x, y: y, size: o.size || 15, weight: 700, role: 'on-dark', align: o.align, maxWidth: o.maxWidth, p: o.p });
  }
  // Pin del polo B: gota de líneas finas que se enciende en `machine-glow-1`.
  function panelPin(ctx, env, x, y, glow, p) {
    var S = env.style;
    if (p <= 0) return;
    var path = { pts: [[x, y], [x - 10, y - 16], [x - 11, y - 26], [x - 6, y - 34], [x, y - 36], [x + 6, y - 34], [x + 11, y - 26], [x + 10, y - 16]], closed: true, smooth: true };
    if (glow > 0) {
      S.fill(ctx, path, { role: 'machine-glow-1', alpha: 0.9 * glow, p: p });
      ctx.save(); ctx.globalAlpha *= glow * p * 0.25; ctx.fillStyle = S.role('machine-glow-1');
      ctx.beginPath(); ctx.arc(x, y - 22, 30, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
    S.mapLine(ctx, path, { p: p });
    ctx.save(); ctx.globalAlpha *= p; ctx.strokeStyle = S.role(glow > 0.5 ? 'machine-ground' : 'machine-line'); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y - 24, 4, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  }
  function arrowHead(ctx, env, x, y, dir, p) {
    env.style.mapLine(ctx, [[x - 10 * dir, y - 7], [x, y], [x - 10 * dir, y + 7]], { p: p });
  }

  EEP.videos.v1 = {
    setup: function () {},
    scenes: {
      // Draw: title background; on line 1 the title «¿QUÉ CUBRE EL SUELO DE MEDELLÍN?» appears at the left margin in the
      // lower half while the sign `valle-corte` rises along the bottom edge without labels; on line 2 a small map panel opens
      // at the top right and the satellite crosses it along a dashed scan line.
      gancho: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        env.course.valleCorte(ctx, { x: 0, y: 440, w: 1280, h: 160 }, { p: s.at(0), badge: false, t: s.t });
        S.title(ctx, env.text('t1'), { x: M, y: 300, size: 60, maxWidth: 820, p: s.at(0) });
        var mp = s.at(1);
        if (mp > 0) {
          S.mapPanel(ctx, { x: 900, y: 50, w: 308, h: 180 }, { p: mp, draw: function (inner, pp) {
            env.course.sateliteCruce(ctx, inner, { k: E.clamp(mp * 1.3 - 0.15), p: pp, t: s.t, scanLength: inner.h - 30 });
          } });
        }
      },

      // Draw: explain background; on line 1 the sign `valle-corte` fills the lower half and five labels appear over its parts
      // in order: «Bosque», «Pastos», «Cultivos», «Agua», «Ciudad»; on line 2 LUCÍA enters from the left (pose: asking,
      // notebook in hand); on line 3 the five labels gather into one glossary chip «coberturas de la tierra»; on line 4 a
      // small map panel opens in the top right corner with the satellite and a question mark sign.
      cobertura: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: 72, y: 330, w: 1136, h: 250 };
        var g = env.course.valleCorte(ctx, box, { p: s.at(0), t: s.t, badge: false });
        var gather = E.inOut(s.at(2));
        var chipX = 640, chipY = 236;
        // [texto, fracción del corte, altura sobre el terreno]
        var labs = [['t1', 0.93, 120], ['t2', 0.79, 70], ['t3', 0.22, 70], ['t4', 0.5, 70], ['t5', 0.64, 120]];
        labs.forEach(function (L, i) {
          var li = E.clamp(s.at(0) * 7 - 1 - i * 1.1);
          if (li <= 0 || gather >= 1) return;
          var tx = g.px(L[1]), ty = g.hAt(L[1]) - L[2];
          if (L[0] === 't4') ty = g.base - box.h * 0.06 - 150;
          var m = S.labelBar(ctx, env.text(L[0]), { x: 0, y: 0, size: 18, measureOnly: true });
          var x0 = tx - m.w / 2, y0 = ty - m.h;
          var x = E.lerp(x0, chipX - m.w / 2, gather), y = E.lerp(y0, chipY, gather);
          var a = li * (1 - gather);
          if (gather <= 0) S.stroke(ctx, [[tx, ty], [tx, L[0] === 't4' ? g.base - box.h * 0.07 : g.hAt(L[1]) - 6]], { role: 'ink', width: 1.4, p: li });
          S.labelBar(ctx, env.text(L[0]), { x: x, y: y, size: 18, p: a });
        });
        glosChip(ctx, env, env.text('t6'), chipX, chipY - 4, { align: 'center', p: E.clamp(s.at(2) * 2 - 0.8), size: 21 });
        var mp = s.at(3);
        if (mp > 0) {
          S.mapPanel(ctx, { x: 948, y: 40, w: 260, h: 150 }, { p: mp, draw: function (inner, pp) {
            env.course.satelite(ctx, { x: inner.x + 70, y: inner.y + 34, size: 40, p: pp, scan: true, scanLength: inner.h - 44, t: s.t });
            S.mapLabel(ctx, '?', inner.x + inner.w - 70, inner.y + inner.h - 26, { size: 58, p: pp, align: 'center' });
          } });
        }
        var lp = s.at(1);
        var lx = E.lerp(-80, 170, E.out(lp));
        if (lp > 0) S.person(ctx, env.cast('lucia'), { pose: 'asking', x: lx, y: 610, height: 270, p: E.clamp(lp * 3) });
        return { on: { lucia: { x: 170, y: 610 - 270 } } };
      },

      // Draw: explain background with a map panel on the right half; on line 1 three input cards slide into the panel one by
      // one, labeled «Mapa oficial de coberturas 2021 · zona rural», «Ortofotos» and «Imágenes de satélite anuales»; on line 2
      // the cards stack under the lamp of the `clasificador-coberturas`, whose light falls on them, and the glossary chip
      // «clasificación supervisada» appears under the panel.
      insumos: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: 600, y: 50, w: 608, h: 420 };
        env.zones.push(box);
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner, pp) {
          var stack = E.inOut(s.at(1));
          var lx = inner.x + 150, ly = inner.y + inner.h - 40, ls = 230;
          env.course.clasificador(ctx, { x: lx, y: ly, size: ls, p: E.clamp(pp * 2 - 0.4) * stack, light: stack });
          var cw = 120, ch = 40;
          for (var i = 0; i < 3; i++) {
            var ci = E.out(E.clamp(s.at(0) * 3.4 - i * 1.05));
            if (ci <= 0) continue;
            var x0 = inner.x + 200 + (1 - ci) * 300, y0 = inner.y + 60 + i * 84;
            var sx = lx + ls * 0.36 + i * 6, sy = ly - 18 - ch - i * 10;
            var x = E.lerp(x0, sx, stack), y = E.lerp(y0, sy, stack);
            S.machine(ctx, 'card', { x: x, y: y, w: cw, h: ch, p: ci, kind: 'tile' });
            panelText(ctx, env, env.text('t' + (i + 1)), x0 + cw + 16, y0 + ch / 2 + 6, { size: 16, maxWidth: 220, p: ci * (1 - stack) });
          }
        } });
        glosChip(ctx, env, env.text('t4'), box.x + box.w / 2, box.y + box.h + 22, { align: 'center', p: E.clamp(s.at(1) * 2 - 0.6) });
      },

      // Draw: explain background; the sign `muestreo` at the center; on line 1 a coverage patch appears and its outline
      // shrinks inward to a dashed inner outline, and the figure card `P1-C02` appears at the lower right; on line 2 LUCÍA
      // appears at the lower left (pose: pointing at the patch's edge); on line 3 a regular grid of sample dots appears only
      // inside the inner outline, and two dots placed too close outside the grid fade away with the label «Demasiado cerca».
      muestras: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p1 = s.at(0), p3 = s.at(2);
        var box = { x: 370, y: 120, w: 470, h: 340 };
        var geo = env.course.muestreo(ctx, box, { p: E.clamp(p1 * 3), shrink: E.clamp(p1 * 2 - 0.5), grid: p3, seed: 23 });
        var c = env.cards.draw(ctx, 'P1-C02', { x: 880, y: 300, w: 330, compact: true, p: E.clamp(p1 * 2 - 0.8) });
        env.zones.push(c);
        if (p3 > 0) {
          // dos puntos demasiado cercanos, fuera de la malla (en la franja del borde), que se desvanecen
          var a = geo.at(-2.35, 0.86), b = [a[0] + 15, a[1] - 9];
          var fade = E.clamp(1 - (p3 - 0.55) * 2.4);
          var appear = E.clamp(p3 * 5);
          [a, b].forEach(function (d) {
            ctx.save(); ctx.globalAlpha *= appear * fade;
            ctx.beginPath(); ctx.arc(d[0], d[1], 6, 0, Math.PI * 2);
            ctx.fillStyle = S.role('accent-9'); ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = S.role('ink'); ctx.stroke();
            ctx.restore();
          });
          var lab = S.labelBar(ctx, env.text('t1'), { x: 0, y: 0, size: 18, measureOnly: true });
          var lx = a[0] - lab.w - 40, ly = a[1] - 90;
          S.stroke(ctx, [[lx + lab.w, ly + lab.h / 2], [a[0] - 4, a[1] - 8]], { role: 'ink', width: 1.4, p: E.clamp(p3 * 4) });
          S.labelBar(ctx, env.text('t1'), { x: lx, y: ly, size: 18, p: E.clamp(p3 * 4) });
        }
        S.person(ctx, env.cast('lucia'), { pose: 'pointing', x: 220, y: 610, height: 260, p: s.at(1) });
        return { on: { lucia: { x: 220, y: 610 - 260 } } };
      },

      // Draw: a map panel at full width; on line 1 the `arboles-decision` row draws itself left to right under the lamp, each
      // small tree with a short arrow to the next and the label «Cada árbol corrige los errores del anterior»; on line 2 the
      // dial of the `optimizador` on the lamp's base turns two steps and the trees redraw slightly, with the label
      // «Ajustes automáticos».
      arboles: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: 72, y: 50, w: 1136, h: 490 };
        env.zones.push(box);
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner, pp) {
          var lx = inner.x + 130, ly = inner.y + inner.h - 70;
          env.course.optimizador(ctx, { x: lx, y: ly, size: 360, p: pp, light: 0.8, step: 2 * E.inOut(s.at(1)) });
          var rowY = ly - 40;
          env.course.arbolesDecision(ctx, { x: inner.x + 300, y: rowY, w: inner.w - 330, p: s.at(0), redraw: E.inOut(s.at(1)) });
          S.mapLabel(ctx, env.text('t1'), inner.x + 560, rowY - 90, { size: 17, p: E.clamp(s.at(0) * 2 - 0.4), maxWidth: inner.w - 580 });
          var ap = s.at(1);
          if (ap > 0) {
            S.mapLine(ctx, [[lx + 60, ly - 12], [lx + 110, ly + 26]], { p: ap });
            S.mapLabel(ctx, env.text('t2'), lx + 118, ly + 40, { size: 17, p: ap });
          }
        } });
      },

      // Draw: explain background; on line 1 a timeline arrow from «2021» to «2024» runs across the top, the lamp moves along it
      // and a stack of cards labeled «Imágenes de 2024» goes under its light; on line 1 still, the output strip appears with
      // four labeled cells: «Territorios artificializados», «Territorios agrícolas», «Bosques y áreas seminaturales», «Zonas
      // húmedas y cuerpos de agua»; on line 2 LUCÍA raises a hand at the lower left (pose: asking); on line 3 the label «Clases
      // urbanas: método no descrito» appears next to the strip; on line 4 the three steps of the chapter appear as three small
      // tag cards: «Ejemplos», «Árboles que corrigen errores», «Ajuste automático».
      transferencia: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: 72, y: 40, w: 1136, h: 340 };
        env.zones.push(box);
        var p1 = s.at(0);
        var strip = null;
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner, pp) {
          var ty = inner.y + 150, x0 = inner.x + 50, x1 = inner.x + inner.w - 50;
          var tl = E.clamp(p1 * 4);
          S.mapLine(ctx, [[x0, ty], [x0 + (x1 - x0) * tl, ty]], { p: pp });
          if (tl >= 1) arrowHead(ctx, env, x1, ty, 1, pp);
          panelText(ctx, env, env.text('t1'), x0, ty + 28, { size: 18, p: pp });
          panelText(ctx, env, env.text('t2'), x1, ty + 28, { size: 18, align: 'right', p: tl });
          // pila de imágenes de 2024 al final
          var stx = x1 - 240, cp = E.clamp(p1 * 4 - 0.6);
          for (var i = 0; i < 3; i++) S.machine(ctx, 'card', { x: stx + i * 6, y: ty - 30 - i * 9, w: 110, h: 30, p: cp, kind: 'tile' });
          panelText(ctx, env, env.text('t3'), stx + 60, ty - 74, { size: 16, align: 'center', p: cp });
          var mv = E.inOut(E.clamp(p1 * 3 - 0.5));
          var lampX = E.lerp(x0 + 60, stx - 120, mv);
          S.machine(ctx, 'lamp', { x: lampX, y: ty, size: 130, p: pp, light: E.clamp(mv * 2 - 1) + 0.2, reach: 100 });
          strip = { x: inner.x + 40, y: inner.y + inner.h - 82, cw: 250, ch: 54 };
          S.machine(ctx, 'strip', { x: strip.x, y: strip.y, cw: strip.cw, ch: strip.ch, gap: 10, size: 13, p: E.clamp(p1 * 2.4 - 1.2),
            cells: [env.text('t4'), env.text('t5'), env.text('t6'), env.text('t7')] });
        } });
        var p3 = s.at(2);
        if (p3 > 0) {
          var lb = S.labelBar(ctx, env.text('t8'), { x: 330, y: box.y + box.h + 16, size: 17, role: 'accent-1', p: p3 });
          S.stroke(ctx, [[400, box.y + box.h + 16], [300, box.y + box.h - 38]], { role: 'ink', width: 1.4, dash: [5, 4], p: p3 });
          void lb;
        }
        var tags = ['t9', 't10', 't11'];
        tags.forEach(function (k, i) {
          var ti = E.clamp(s.at(3) * 3 - i * 0.8);
          env.course.tag(ctx, { x: 440 + i * 260, y: 470, w: 240, h: 84 }, env.text(k), { p: ti, size: 18, tilt: i % 2 ? 2 : -2 });
        });
        S.person(ctx, env.cast('lucia'), { pose: 'asking', x: 170, y: 610, height: 185, p: s.at(1) });
        return { on: { lucia: { x: 170, y: 610 - 185 } } };
      },

      // Draw: a map panel at the center holding the sign `valle-planta`, filled with abstract patches that appear and are
      // labeled in order: «Territorios artificializados» along the river, «Territorios agrícolas» and «Bosques y áreas
      // seminaturales» on the slopes, «Zonas húmedas y cuerpos de agua» as thin lines; the badge «Esquema» at its top right;
      // on line 2 the label bar «INSUMO PARA EL DIAGNÓSTICO» slides in under the panel.
      'mapa-2024': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: 190, y: 50, w: 900, h: 440 };
        env.zones.push(box);
        var p1 = s.at(0);
        var q = function (i) { return E.clamp(p1 * 4.6 - i * 1.1); };
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner, pp) {
          var vb = { x: inner.x + 190, y: inner.y, w: inner.w - 380, h: inner.h };
          var g = env.course.vallePlanta(ctx, vb, { p: pp, patches: [
            { u: 0.52, v: 0.28, r: 34, kind: 'cells', p: q(0) }, { u: 0.47, v: 0.5, r: 40, kind: 'cells', p: q(0) }, { u: 0.55, v: 0.72, r: 32, kind: 'cells', p: q(0) },
            { u: 0.12, v: 0.42, r: 34, kind: 'pattern', pattern: 'checks', p: q(1) }, { u: 0.9, v: 0.66, r: 30, kind: 'pattern', pattern: 'checks', p: q(1) },
            { u: 0.88, v: 0.3, r: 38, kind: 'pattern', pattern: 'dots', p: q(2) }, { u: 0.1, v: 0.78, r: 32, kind: 'pattern', pattern: 'dots', p: q(2) }
          ] });
          // zonas húmedas: líneas finas
          var wq = q(3);
          [[0.28, 0.16], [0.7, 0.86], [0.3, 0.62]].forEach(function (uv) {
            var c = g.at(uv[0], uv[1]);
            S.mapLine(ctx, { pts: [[c[0] - 26, c[1]], [c[0] - 10, c[1] - 5], [c[0] + 8, c[1] + 3], [c[0] + 26, c[1] - 3]], smooth: true }, { p: wq, glow: true });
          });
          var lab = function (i, str, tx, ty, ax, ay, align) {
            var li = q(i);
            if (li <= 0) return;
            S.mapLine(ctx, [[tx + (align === 'right' ? 6 : -6), ty - 5], [ax, ay]], { p: li, weight: 1 });
            S.mapLabel(ctx, str, tx, ty, { size: 13, p: li, maxWidth: 170, align: align });
          };
          var a = g.at(0.52, 0.28), b = g.at(0.12, 0.42), c2 = g.at(0.88, 0.3), d = g.at(0.3, 0.62);
          lab(0, env.text('t1'), inner.x + inner.w - 175, inner.y + 40, a[0] + 34, a[1] - 6, 'left');
          lab(1, env.text('t2'), inner.x + 175, inner.y + 150, b[0] - 34, b[1], 'right');
          lab(2, env.text('t3'), inner.x + inner.w - 175, inner.y + 190, c2[0] + 38, c2[1], 'left');
          lab(3, env.text('t4'), inner.x + 175, inner.y + inner.h - 90, d[0] - 26, d[1], 'right');
        } });
        badgeEsquema(ctx, env, box.x + box.w, box.y - 8, s.intro, env.text('t5'));
        var m = S.labelBar(ctx, env.text('t6'), { x: 0, y: 0, size: 24, measureOnly: true });
        S.labelBar(ctx, env.text('t6'), { x: 640 - m.w / 2, y: box.y + box.h + 16, size: 24, p: s.at(1) });
      },

      // Draw: figure background; the figure card `P1-C01` at the center; on line 2 its badge «Con matiz» appears and the
      // scope line is emphasized; on line 3 LUCÍA appears small at the lower left, outside the card (pose: pointing at the
      // card); on line 4 the label «Meta, no medición» appears under the card.
      'meta-85': function (ctx, s, env) {
        var S = env.style;
        var c = env.cards.draw(ctx, 'P1-C01', { x: 360, y: 60, w: 600, p: s.intro, emphasize: 'scope', emph: s.at(1) });
        env.zones.push(c);
        S.labelBar(ctx, env.text('t2'), { x: c.x, y: Math.min(c.y + c.h + 18, 540), size: 22, p: s.at(3) });
        S.person(ctx, env.cast('lucia'), { pose: 'pointing-card', x: 190, y: 610, height: 220, p: s.at(2) });
        return { on: { lucia: { x: 190, y: 610 - 220 } } };
      },

      // Draw: explain background; on line 1 three small signs appear in a row, each with its label: a `lupa` over the ground
      // «Verificación en terreno», a folded `hoja-mapa` «Cartografía oficial» and a small panel «Imágenes aéreas recientes»;
      // on line 2 the stamp `stamp-ia` slides in below them.
      criterio: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p1 = s.at(0);
        var xs = [300, 640, 980], baseY = 300;
        xs.forEach(function (x, i) {
          var pi = E.clamp(p1 * 3.4 - i * 1.05);
          if (pi <= 0) return;
          S.withAppear(ctx, 'illus', pi, function () {
            if (i === 0) {
              S.fill(ctx, S.ellipsePath(x, baseY - 6, 90, 16), { role: 'accent-4' });
              S.tree(ctx, { x: x - 56, y: baseY - 8, size: 44, seed: 3, kind: 'round' });
              S.sign(ctx, 'lupa', { x: x + 10, y: baseY - 10, size: 120 });
            } else if (i === 1) {
              S.fill(ctx, S.ellipsePath(x, baseY - 2, 100, 14), { role: 'accent-4' });
              S.sign(ctx, 'hoja-mapa', { x: x, y: baseY - 4, size: 150 });
              // contorno `ink` de los tres pliegues (el papel claro se pierde sobre el fondo)
              var hs = 150, hw = hs * 1.1, hh = hs * 0.8, hx = x - hw / 2, hy = baseY - 4 - hh;
              for (var f = 0; f < 3; f++) {
                var o2 = f % 2;
                S.stroke(ctx, { pts: [[hx + f * hw / 3, hy + (o2 ? hs * 0.06 : 0)], [hx + (f + 1) * hw / 3, hy + (o2 ? 0 : hs * 0.06)],
                  [hx + (f + 1) * hw / 3, hy + hh + (o2 ? 0 : -hs * 0.06) + hs * 0.06], [hx + f * hw / 3, hy + hh + (o2 ? -hs * 0.06 : 0) + hs * 0.06]], closed: true },
                  { role: 'ink', width: 1.6 });
              }
            }
          });
          if (i === 2) {
            S.mapPanel(ctx, { x: x - 85, y: baseY - 130, w: 170, h: 120 }, { p: pi, draw: function (inner, pp) {
              S.mapLine(ctx, { pts: [[inner.x + 10, inner.y + 70], [inner.x + 50, inner.y + 40], [inner.x + 95, inner.y + 60], [inner.x + 140, inner.y + 20]], smooth: true }, { p: pp, glow: true });
              S.mapLine(ctx, S.rectPath(inner.x + 20, inner.y + 14, 40, 26, 2), { p: pp });
              S.mapLine(ctx, S.rectPath(inner.x + 90, inner.y + 60, 36, 22, 2), { p: pp });
            } });
          }
          S.text(ctx, env.text('t' + (i + 1)), { x: x, y: baseY + 40, size: 21, weight: 700, align: 'center', maxWidth: 300, p: pi });
        });
        var m = env.course.stamp(ctx, 'stamp-ia', 0, 0, { measureOnly: true, w: 560 });
        env.course.stamp(ctx, 'stamp-ia', 640 - m.w / 2, 410, { p: s.at(1), w: 560 });
      },

      // Draw: explain background; on line 1 the rural band of the `valle-corte` appears in close-up with the label «Uso actual»
      // over its plots; on line 2 a map panel at the right shows a dashed zoning line labeled «Lo que permite la norma», and
      // where the two disagree an area takes the `stripes` pattern with the glossary chip «conflicto de uso»; the badge «Esquema».
      usos: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p1 = s.at(0), p2 = s.at(1);
        // primer plano de la franja rural: parcelas en ladera, casa y bosque de cresta
        S.withAppear(ctx, 'illus', p1, function () {
          S.fill(ctx, { pts: [[72, 560], [72, 230], [200, 200], [600, 330], [600, 560]], closed: true, smooth: false }, { role: 'accent-6' });
          for (var i = 0; i < 4; i++) S.tree(ctx, { x: 90 + i * 34, y: 218 + i * 6, size: 70, seed: i + 2, kind: i % 2 ? 'dense' : 'round', t: s.t });
        });
        env.course.predios(ctx, { x: 150, y: 300, w: 430, h: 220 }, { p: p1, seed: 12, slope: 0.35, badge: false });
        S.withAppear(ctx, 'illus', p1, function () { S.building(ctx, { x: 440, y: 270, w: 40, h: 40 }, { kind: 'casa' }); });
        S.labelBar(ctx, env.text('t1'), { x: 250, y: 240, size: 20, p: E.clamp(p1 * 2 - 0.5) });
        var box = { x: 660, y: 120, w: 548, h: 380 };
        env.zones.push(box);
        if (p2 > 0) {
          S.mapPanel(ctx, box, { p: p2, draw: function (inner, pp) {
            // parcelas en planta
            var cols = 6, rows = 4, cw = (inner.w - 60) / cols, rh = (inner.h - 90) / rows, ox = inner.x + 30, oy = inner.y + 60;
            for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) S.mapLine(ctx, S.rectPath(ox + c * cw + 3, oy + r * rh + 3, cw - 6, rh - 6, 2), { p: pp, weight: 1 });
            // zona donde no coinciden: rayas
            var zp = E.clamp(pp * 2 - 0.8);
            var zone = { pts: [[ox + cw * 3, oy], [ox + cw * 4.4, oy], [ox + cw * 5, oy + rh * 2], [ox + cw * 4, oy + rh * 4], [ox + cw * 3, oy + rh * 4]], closed: true };
            ctx.save(); ctx.globalAlpha *= zp; S.patternFill(ctx, zone, 'stripes', { onDark: true }); ctx.restore();
            // línea de zonificación discontinua
            S.mapLine(ctx, [[ox + cw * 3, oy - 20], [ox + cw * 3, oy + rh * 4 + 10]], { p: pp, dashed: true, glow: true });
            S.mapLabel(ctx, env.text('t2'), ox, inner.y + 26, { size: 14, p: pp, maxWidth: inner.w - 60 });
          } });
          glosChip(ctx, env, env.text('t3'), box.x + box.w * 0.62, box.y + box.h + 18, { align: 'center', p: E.clamp(p2 * 2 - 0.8) });
        }
        badgeEsquema(ctx, env, 1208, 76, s.intro, env.text('t4'));
      },

      // Draw: figure background; the figure card `P1-C09` at the center with its badges «Resultado del estudio» and «Con
      // matiz»; on line 2 HERNÁN appears at the lower left, outside the card (pose: hat in hand, asking); on line 3 a short note
      // appears under the card: «No significa ilegalidad ni daño ambiental».
      conflicto: function (ctx, s, env) {
        var S = env.style;
        var c = env.cards.draw(ctx, 'P1-C09', { x: 380, y: 60, w: 620, p: s.intro });
        env.zones.push(c);
        S.labelBar(ctx, env.text('t3'), { x: c.x, y: Math.min(c.y + c.h + 18, 540), size: 21, role: 'accent-1', p: s.at(2) });
        S.person(ctx, env.cast('hernan'), { pose: 'hat-in-hand', x: 200, y: 610, height: 250, p: s.at(1) });
        return { on: { hernan: { x: 200, y: 610 - 250 } } };
      },

      // Draw: compare background with two columns; the left column, titled «Estructura ecológica rural», shows a hill whose tree
      // crowns grow denser on line 1; the right column, titled «Corredores que conectan», shows two forest patches joined by a
      // corridor with gaps; on line 2 the note «Sin cifras: capas de fuentes distintas» appears under both columns; no values.
      recuperacion: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        S.labelBar(ctx, env.text('t1'), { x: 40, y: 50, size: 22, p: s.intro });
        S.labelBar(ctx, env.text('t2'), { x: 680, y: 50, size: 22, p: s.intro });
        var L = { x: 40, y: 110, w: 560, h: 300 }, R = { x: 680, y: 110, w: 560, h: 300 };
        env.zones.push(L, R);
        S.withAppear(ctx, 'illus', s.intro, function () {
          S.fill(ctx, { pts: [[L.x + 20, L.y + L.h - 20], [L.x + 140, L.y + 120], [L.x + 280, L.y + 70], [L.x + 420, L.y + 130], [L.x + L.w - 20, L.y + L.h - 20]], closed: true, smooth: true }, { role: 'accent-6' });
          S.fill(ctx, S.rectPath(L.x, L.y + L.h - 34, L.w, 34, 4), { role: 'accent-4', alpha: 0.8 });
        });
        var spots = [[0.5, 0.36], [0.3, 0.55], [0.7, 0.52], [0.42, 0.45], [0.6, 0.42], [0.22, 0.72], [0.8, 0.7], [0.36, 0.66], [0.64, 0.64], [0.5, 0.58], [0.15, 0.84], [0.86, 0.84], [0.27, 0.86], [0.73, 0.86]];
        var dense = s.at(0);
        spots.forEach(function (sp, i) {
          var ti = i < 5 ? s.intro : E.clamp(dense * 10 - (i - 5));
          if (ti <= 0) return;
          S.withAppear(ctx, 'illus', ti, function () {
            S.tree(ctx, { x: L.x + L.w * sp[0], y: L.y + L.h * sp[1] + 30, size: 62, seed: i + 4, kind: i % 3 ? 'round' : 'dense', t: s.t, stipple: false });
          });
        });
        env.course.corredorTerritorio(ctx, R, { p: s.intro, t: s.t, gaps: 0.5 });
        var m = S.labelBar(ctx, env.text('t3'), { x: 0, y: 0, size: 22, measureOnly: true });
        S.labelBar(ctx, env.text('t3'), { x: 640 - m.w / 2, y: 450, size: 22, role: 'accent-1', p: s.at(1) });
      },

      // Draw: figure background; on line 1 the figure card `P1-C24` appears at the left; on line 2 the figure card `P1-C42`
      // appears at its right; on line 3 three place labels appear below the cards, outside them: «Santa Elena», «San Sebastián
      // de Palmitas», «San Antonio de Prado», each with a small `arboleda` sign.
      bosques: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.draw(ctx, 'P1-C24', { x: 80, y: 50, w: 540, compact: true, p: s.at(0) });
        var b = env.cards.draw(ctx, 'P1-C42', { x: 660, y: 50, w: 540, compact: true, p: s.at(1) });
        env.zones.push(a, b);
        var y = Math.min(Math.max(a.y + a.h, b.y + b.h) + 90, 560);
        [250, 640, 1030].forEach(function (x, i) {
          var pi = E.clamp(s.at(2) * 3 - i * 0.8);
          if (pi <= 0) return;
          S.sign(ctx, 'arboleda', { x: x, y: y - 26, size: 56, p: pi });
          S.text(ctx, env.text('t' + (i + 1)), { x: x, y: y + 4, size: 20, weight: 700, align: 'center', p: pi });
        });
      },

      // Draw: explain background; a map panel on the right holds the sign `valle-planta`; on line 1 the satellite passes twice,
      // one small patch changes between passes and a `pin` lights in `machine-glow-1` with the label «Alerta temprana»; on line
      // 2 a second `pin` lights near a roof pictogram with the label «Alertas de urbanización»; on line 3 the stamp
      // `stamp-insumo` slides in at the lower left.
      alertas: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var box = { x: 560, y: 50, w: 648, h: 500 };
        env.zones.push(box);
        var p1 = s.at(0), p2 = s.at(1);
        S.mapPanel(ctx, box, { p: s.intro, draw: function (inner, pp) {
          var vb = { x: inner.x + 150, y: inner.y + 40, w: inner.w - 300, h: inner.h - 40 };
          var k1 = E.clamp(p1 * 2.4), k2 = E.clamp(p1 * 2.4 - 1.2);
          var changed = k2 > 0.45 ? 1 : 0;
          var g = env.course.vallePlanta(ctx, vb, { p: pp, patches: [
            { u: 0.2, v: 0.36, r: changed ? 40 : 26, kind: changed ? 'cells' : 'lines', p: pp },
            { u: 0.8, v: 0.62, r: 30, kind: 'pattern', pattern: 'dots', p: pp }
          ] });
          var passing = k1 > 0 && k1 < 1 ? k1 : (k2 > 0 && k2 < 1 ? k2 : -1);
          if (passing >= 0) env.course.sateliteCruce(ctx, { x: inner.x, y: inner.y, w: inner.w, h: inner.h }, { k: passing, p: pp, t: s.t, y: inner.y + 22 });
          var c = g.at(0.2, 0.36);
          var pinP = E.clamp(k2 * 3 - 1.6);
          panelPin(ctx, env, c[0], c[1] - 18, pinP, pinP);
          S.mapLabel(ctx, env.text('t1'), c[0] - 30, c[1] - 66, { size: 14, p: pinP, align: 'right' });
          // tejado y segundo pin
          var r = g.at(0.62, 0.8);
          if (p2 > 0) {
            S.mapLine(ctx, [[r[0] - 18, r[1]], [r[0] - 18, r[1] - 16], [r[0], r[1] - 30], [r[0] + 18, r[1] - 16], [r[0] + 18, r[1]], [r[0] - 18, r[1]]], { p: p2 });
            panelPin(ctx, env, r[0] + 34, r[1] - 18, E.clamp(p2 * 2 - 0.5), p2);
            S.mapLabel(ctx, env.text('t2'), r[0] + 60, r[1] - 30, { size: 14, p: p2, maxWidth: 150 });
          }
        } });
        env.course.stamp(ctx, 'stamp-insumo', M, 400, { p: s.at(2), w: 440 });
      },

      // Draw: recap background; on line 1 LUCÍA and HERNÁN stand on the ridge looking at the valley (poses: leaning on the
      // railing, hat in hand); on line 2 the motto appears on the label bar: «LA INTELIGENCIA ARTIFICIAL APOYA, NO REEMPLAZA,
      // EL CRITERIO TÉCNICO».
      cierre: function (ctx, s, env) {
        var S = env.style;
        env.course.mirador(ctx, { x: 0, y: 160, w: 1280, h: 440 }, { p: s.intro, t: s.t });
        S.person(ctx, env.cast('lucia'), { pose: 'leaning', x: 300, y: 600, height: 270, p: s.at(0) });
        S.person(ctx, env.cast('hernan'), { pose: 'hat-in-hand', x: 470, y: 600, height: 280, p: s.at(0) });
        var m = S.labelBar(ctx, env.text('t1'), { x: 0, y: 0, size: 26, maxWidth: 900, measureOnly: true });
        S.labelBar(ctx, env.text('t1'), { x: 1208 - m.w, y: 70, size: 26, maxWidth: 900, role: 'accent-1', p: s.at(1) });
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
