/* V9 · «Medellín 2040: anticiparse al cambio y coordinarse con el valle» (spec §11, V9). Solo dibujo: los textos vienen
   de js/data/videos.js (`texts`, t1…tn en el orden del brief), las cifras del banco y las personas del reparto. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var M = 72;

  // Panel de expertos (extra-3): dieciséis figuras pequeñas, solo roles.
  var SKINS = ['skin-1', 'skin-2', 'skin-3', 'skin-4', 'skin-5'];
  var HAIRS = [{ style: 'short', role: 'ink' }, { style: 'long', role: 'ink' }, { style: 'bun', role: 'ground-2' }, { style: 'bald', role: 'ink' },
    { style: 'curly-tied', role: 'ink' }, { style: 'shoulder', role: 'skin-5' }, { style: 'short', role: 'ink-soft' }, { style: 'long', role: 'accent-7' }];
  var SHIRTS = ['accent-1', 'accent-2', 'accent-3', 'accent-5', 'accent-7', 'accent-9'];
  var PANEL = [];
  for (var i = 0; i < 16; i++) {
    PANEL.push({ skin: SKINS[(i * 3) % 5], hair: HAIRS[(i * 5) % 8], shirt: { role: SHIRTS[(i * 7) % 6] }, glasses: i % 4 === 1, beard: i % 7 === 3 });
  }

  function stamp(ctx, env, id, x, y, p, w) { return env.course.stamp(ctx, id, x, y, { p: p, w: w }); }
  function escalasOnPaper(ctx, env, box, p) {
    if (p <= 0) return;
    env.style.mark(ctx, 'card', { x: box.x - 22, y: box.y - 22, w: box.w + 44, h: box.h + 44 }, { p: p });
    env.course.escalas(ctx, box, { p: p });
  }

  EEP.videos.v9 = {
    setup: function () {},
    scenes: {
      // Draw: title background; on line 1 the title «MEDELLÍN 2040» with the second line «anticiparse al cambio y coordinarse
      // con el valle» appears, and the sign `escalas` rises at the right with its three frames and chips.
      gancho: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        S.title(ctx, env.text('t1'), { x: M, y: 250, size: 84, maxWidth: 620, second: env.text('t2'), p: s.at(0) });
        var ep = E.clamp(s.at(0) * 1.4 - 0.3);
        var a = S.appear('illus', ep);
        ctx.save(); ctx.translate(0, a.dy * 2);
        escalasOnPaper(ctx, env, { x: 770, y: 110, w: 420, h: 380 }, ep);
        ctx.restore();
      },

      // Draw: figure background; on line 1 the figure card `P7-C23` appears with the legend chip `valle` and its badges
      // «Preliminar (prediagnóstico)» and «Con matiz»; on line 2 LUCÍA appears at the lower left, outside the card (pose:
      // asking); on line 3 the note «El informe no los enumera» appears under the card.
      hechos: function (ctx, s, env) {
        var S = env.style;
        var a = env.cards.draw(ctx, 'P7-C23', { x: 400, y: 80, w: 600, p: s.at(0) });
        env.zones.push(a);
        S.person(ctx, env.cast('lucia'), { pose: 'asking', x: 190, y: 600, height: 240, p: s.at(1) });
        S.labelBar(ctx, env.text('t3'), { x: 400, y: a.y + a.h + 18, size: 18, role: 'accent-1', p: s.at(2) });
        return { on: { lucia: { x: 190, y: 600 - 240 } } };
      },

      // Draw: figure background; on line 1 the figure card `P7-C24` appears at the top, and three tag cards appear under it,
      // labeled «Recurso hídrico», «Riesgo» and «Conectividad ecológica metropolitana»; on line 2 the note «El informe no dice si
      // están entre los declarados» appears beside them; on line 3 the label bar «¿CÓMO PENSÓ EL ESTUDIO EL FUTURO?» slides in.
      'tres-hechos': function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.draw(ctx, 'P7-C24', { x: M, y: 50, w: 700, compact: true, p: s.at(0) });
        env.zones.push(a);
        var ty = a.y + a.h + 24;
        for (var k = 0; k < 3; k++) {
          env.course.tag(ctx, { x: M + k * 236, y: ty, w: 220, h: 104 }, env.text('t' + (k + 1)), { p: E.clamp(s.at(0) * 2 - 0.6 - k * 0.2), size: 18, tilt: k % 2 ? 2 : -2 });
        }
        S.labelBar(ctx, env.text('t4'), { x: 800, y: ty + 10, size: 18, role: 'accent-1', maxWidth: 400, p: s.at(1) });
        S.labelBar(ctx, env.text('t5'), { x: M, y: 520, size: 26, p: s.at(2) });
      },

      // Draw: figure background; on line 1 the sign `ruta-2040`: eight stepping stones appear one by one, labeled «Delimitación»,
      // «Diagnóstico», «Factores de cambio», «Variables», «Priorización», «Análisis estructural», «Escenarios» and «Apuesta
      // 2040», with the card `P7-C02` small at the top left; on line 2 the cards `P7-C04` and `P7-C01` appear above the fifth
      // stone, and the extras `extra-3` appear at the lower right around their table, with the lamp of the `panel-con-ia` at the
      // end of it; on line 3 the label «Ejercicio de expertos, no consulta ciudadana» appears under the table.
      ruta: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var labels = [];
        for (var k = 1; k <= 8; k++) labels.push(env.text('t' + k));
        var stones = env.course.ruta2040(ctx, { x: M, y: 250, w: 1136, h: 220 }, { labels: labels, p: s.at(0), emph: 4, emphP: s.at(1), labelSize: 16 });
        var c0 = env.cards.draw(ctx, 'P7-C02', { x: M, y: 40, w: 330, compact: true, maxHead: 30, p: s.at(0) });
        var p2 = s.at(1);
        var st = stones[4];
        var c1 = env.cards.draw(ctx, 'P7-C04', { x: 430, y: 40, w: 250, compact: true, maxHead: 30, p: p2 });
        var c2 = env.cards.draw(ctx, 'P7-C01', { x: 694, y: 40, w: 250, compact: true, maxHead: 30, p: p2 });
        env.zones.push(c0, c1, c2);
        S.stroke(ctx, [[st.x, Math.max(c1.y + c1.h, c2.y + c2.h) + 6], [st.x, st.y - st.ry - 6]], { role: 'ink', width: 1.4, dash: [4, 4], p: p2 });
        // panel de expertos: ocho detrás de la mesa, ocho delante; la lámpara al extremo derecho
        var tx = 760, tw = 330, tyy = 476;
        var gp = E.clamp(p2 * 1.5);
        if (gp > 0) {
          for (var b = 0; b < 8; b++) S.person(ctx, PANEL[b], { bust: true, x: tx + 20 + b * (tw - 40) / 7, y: tyy + 4, height: 120, p: E.clamp(gp * 2 - b * 0.08) });
          S.withAppear(ctx, 'illus', gp, function () {
            S.fill(ctx, S.rectPath(tx, tyy, tw, 26, 6), { role: 'accent-7' });
            S.stroke(ctx, S.rectPath(tx, tyy, tw, 26, 6), { role: 'ink', width: 1.4 });
          });
          for (var f = 0; f < 8; f++) S.person(ctx, PANEL[8 + f], { bust: true, x: tx + 20 + f * (tw - 40) / 7, y: tyy + 66, height: 120, p: E.clamp(gp * 2 - 0.4 - f * 0.08) });
          env.course.panelConIA(ctx, { x: tx + tw + 60, y: tyy + 20, size: 84, p: gp, facing: 'left' });
        }
        S.text(ctx, env.text('t9'), { x: tx + tw / 2 + 20, y: 572, size: 17, weight: 700, align: 'center', p: s.at(2) });
      },

      // Draw: explain background; on line 1 two large rounded blocks appear at the center, labeled «Ocupación y uso del suelo» and
      // «Adaptación al cambio climático», with arrows radiating to smaller blocks; on line 2 a `card` frame without values, with
      // the title «Puntajes de la priorización» and the note «Sin puntajes: código de colores contradictorio», appears at the
      // right; the badge «Esquema» on the blocks.
      motores: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p = s.at(0);
        var big = [{ x: 260, y: 150, w: 300, h: 120, r: 'accent-1', t: 't1' }, { x: 260, y: 330, w: 300, h: 120, r: 'accent-2', t: 't2' }];
        var small = [[100, 110], [100, 250], [100, 390], [640, 110], [640, 250], [640, 390], [330, 500]];
        small.forEach(function (sm, i) {
          var sp = E.clamp(p * 2 - 0.6 - i * 0.08);
          if (sp <= 0) return;
          var cx = sm[0] + 50, cy = sm[1] + 25;
          var src = cy < 300 && i !== 6 ? big[0] : big[1];
          var fx = Math.max(src.x, Math.min(src.x + src.w, cx)), fy = Math.max(src.y, Math.min(src.y + src.h, cy));
          if (i === 6) { fx = src.x + src.w / 2; fy = src.y + src.h; }
          var tx0 = cx < src.x ? sm[0] + 100 : (cx > src.x + src.w ? sm[0] : cx), ty0 = i === 6 ? sm[1] : cy;
          S.stroke(ctx, [[fx, fy], [tx0, ty0]], { role: 'ink', width: 1.6, p: sp });
          var ang = Math.atan2(ty0 - fy, tx0 - fx);
          S.stroke(ctx, [[tx0 - Math.cos(ang - 0.5) * 10, ty0 - Math.sin(ang - 0.5) * 10], [tx0, ty0], [tx0 - Math.cos(ang + 0.5) * 10, ty0 - Math.sin(ang + 0.5) * 10]], { role: 'ink', width: 1.6, p: sp });
          S.withAppear(ctx, 'illus', sp, function () {
            S.fill(ctx, S.rectPath(sm[0], sm[1], 100, 50, 14), { role: 'ground-2' });
            S.stroke(ctx, S.rectPath(sm[0], sm[1], 100, 50, 14), { role: 'ink', width: 1.4 });
          });
        });
        big.forEach(function (b, i) {
          var bp = E.clamp(p * 2 - i * 0.3);
          S.withAppear(ctx, 'illus', bp, function () {
            S.fill(ctx, S.rectPath(b.x, b.y, b.w, b.h, 24), { role: b.r });
            S.stroke(ctx, S.rectPath(b.x, b.y, b.w, b.h, 24), { role: 'ink', width: 2.2 });
          });
          S.text(ctx, env.text(b.t), { x: b.x + b.w / 2, y: b.y + b.h / 2, size: 22, weight: 700, align: 'center', baseline: 'middle', maxWidth: b.w - 30, p: bp });
        });
        S.mark(ctx, 'badge', { x: 260, y: 104 }, { text: env.text('t5'), variant: 'state', glyph: 'g-esquema', size: 14, p: p });
        var bx = env.cards.blank(ctx, { x: 800, y: 200, w: 410, title: env.text('t3'), note: env.text('t4'), p: s.at(1) });
        env.zones.push(bx, { x: 100, y: 104, w: 640, h: 446 });
      },

      // Draw: figure background; on line 1 the figure card `P7-C15` appears at the top, and the sign `subsistemas` shows five
      // rounded blocks labeled «Estructura ecológica funcional y conectividad», «Agua, riesgo y adaptación climática», «Gobernanza
      // ciudad-región», «Sistema alimentario y suelo rural» and «Equilibrio económico regional»; on line 2 the first two blocks
      // move to the center, labeled «Núcleo», and a label bar appears: «APUESTA DEL ESTUDIO: REORIENTAR LA OCUPACIÓN EN TORNO A
      // LA ESTRUCTURA ECOLÓGICA Y EL RIESGO».
      subsistemas: function (ctx, s, env) {
        var S = env.style;
        var a = env.cards.draw(ctx, 'P7-C15', { x: M, y: 30, w: 620, compact: true, maxHead: 34, p: s.at(0) });
        env.zones.push(a);
        var labels = [1, 2, 3, 4, 5].map(function (k) { return env.text('t' + k); });
        var top = a.y + a.h + 14;
        var box = { x: M, y: top, w: 1136, h: 500 - top };
        env.course.subsistemas(ctx, box, { labels: labels, p: s.at(0), core: [0, 1], coreP: s.at(1), coreLabel: env.text('t6'), labelSize: 17 });
        env.zones.push(box);
        S.labelBar(ctx, env.text('t7'), { x: M, y: 520, size: 18, maxWidth: 1136, p: s.at(1) });
      },

      // Draw: explain background; on line 1 a timeline arrow runs left to right with a small cloud pictogram ahead of its tip,
      // labeled «Antes de que el problema se consolide»; on line 2 a small map panel with data lines appears at the left, labeled
      // «Datos y monitoreo», and three people talking appear at the right, labeled «Conocimiento de las comunidades»; a line joins
      // the two, labeled «Gobernanza anticipatoria».
      anticipatoria: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var p = s.at(0);
        S.stroke(ctx, [[100, 210], [960, 210]], { role: 'ink', width: 3, p: p });
        for (var k = 0; k < 6; k++) S.stroke(ctx, [[140 + k * 150, 200], [140 + k * 150, 220]], { role: 'ink', width: 2, p: p });
        if (p >= 1) S.stroke(ctx, [[944, 198], [962, 210], [944, 222]], { role: 'ink', width: 3 });
        S.clouds(ctx, { x: 1010, y: 160, w: 150, h: 60 }, { seed: 3, count: 1, size: 120, role: 'ground-2', alpha: E.clamp(p * 2 - 1) });
        for (var r = 0; r < 4; r++) S.stroke(ctx, [[1050 + r * 22, 214], [1044 + r * 22, 238]], { role: 'accent-2', width: 2, p: E.clamp(p * 2 - 1) });
        S.text(ctx, env.text('t1'), { x: 1180, y: 130, size: 19, weight: 700, align: 'right', p: E.clamp(p * 2 - 1) });
        var p2 = s.at(1);
        var box = { x: M, y: 290, w: 330, h: 190 };
        S.mapPanel(ctx, box, { p: p2, draw: function (inner, pp) {
          for (var l = 0; l < 3; l++) {
            var pts = [];
            for (var j = 0; j <= 8; j++) pts.push([inner.x + 10 + j * (inner.w - 20) / 8, inner.y + 30 + l * 50 + Math.sin(j * 1.3 + l) * 14]);
            S.mapLine(ctx, pts, { p: pp, glow: l === 0 });
          }
        } });
        S.text(ctx, env.text('t2'), { x: M, y: 510, size: 19, weight: 700, p: p2 });
        var ex = env.cast('extra-1').people;
        var people = [[880, ex[0], 'standing', 'right'], [990, ex[3], 'pointing', 'left'], [1110, ex[4], 'standing', 'left']];
        people.forEach(function (pp0, i) {
          S.person(ctx, pp0[1], { pose: pp0[2], x: pp0[0], y: 590, height: 200, facing: pp0[3], p: E.clamp(p2 * 2 - i * 0.2) });
        });
        S.text(ctx, env.text('t3'), { x: 995, y: 350, size: 19, weight: 700, align: 'center', maxWidth: 360, p: p2 });
        var lp = E.clamp(p2 * 2 - 1);
        S.stroke(ctx, [[box.x + box.w + 6, 400], [820, 440]], { role: 'ink', width: 2, dash: [8, 6], p: lp });
        S.labelBar(ctx, env.text('t4'), { x: 450, y: 340, size: 18, role: 'accent-1', p: lp });
        env.zones.push(box);
      },

      // Draw: figure background; on line 1 the figure card `P7-C28` appears at the left with the legend chip `region`, and the
      // sign `embalses` appears small at the right, outside the card; on line 2 a tag card appears under the sign: «Comité de
      // integración territorial o esquema asociativo · recomendación».
      'agua-region': function (ctx, s, env) {
        var a = env.cards.draw(ctx, 'P7-C28', { x: M, y: 80, w: 560, p: s.at(0) });
        env.zones.push(a);
        env.course.embalses(ctx, { x: 690, y: 110, w: 520, h: 250 }, { p: s.at(0), t: s.t });
        env.course.tag(ctx, { x: 720, y: 410, w: 460, h: 104 }, env.text('t1'), { p: s.at(1), size: 19, tilt: -1.5 });
      },

      // Draw: figure background; on line 1 the figure card `P7-C33` appears at the right, and the extras `extra-5` sit at a
      // meeting table at the lower left, outside the card, labeled «Entidades públicas y universidades»; on line 2 HERNÁN stands
      // beside the table (pose: asking); on line 3 three empty chairs appear at the end of the table, labeled «Más voces»; on line
      // 4 the label bar «COORDINARSE EXIGE MÁS VOCES Y ACUERDOS» slides in.
      articulacion: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.draw(ctx, 'P7-C33', { x: 720, y: 110, w: 490, p: s.at(0) });
        env.zones.push(a);
        var p = s.at(0);
        var ex = env.cast('extra-5').people;
        var tx = 230, tw = 330, ty = 478;
        ex.forEach(function (lk, i) {
          S.person(ctx, lk, { pose: i % 2 ? 'seated-talk' : 'folders', x: tx + 40 + i * 82, y: 590, height: 190, facing: i < 2 ? 'right' : 'left', p: E.clamp(p * 2 - i * 0.15) });
        });
        S.withAppear(ctx, 'illus', p, function () {
          S.fill(ctx, S.rectPath(tx, ty, tw, 16, 4), { role: 'accent-7' });
          S.stroke(ctx, [[tx + 16, ty + 16], [tx + 16, 590]], { role: 'ink', width: 2.4 });
          S.stroke(ctx, [[tx + tw - 16, ty + 16], [tx + tw - 16, 590]], { role: 'ink', width: 2.4 });
          S.fill(ctx, S.rectPath(tx + 120, ty - 14, 40, 14, 2), { role: 'ink-soft' });
          S.fill(ctx, S.rectPath(tx + 200, ty - 6, 46, 6, 1), { role: 'accent-4' });
        });
        S.labelBar(ctx, env.text('t1'), { x: tx, y: 372, size: 17, role: 'accent-1', p: p });
        // sillas vacías al extremo de la mesa
        var cp = s.at(2);
        for (var c = 0; c < 3; c++) {
          var cx = tx + tw + 30 + c * 44, cpi = E.clamp(cp * 2 - c * 0.3);
          if (cpi <= 0) continue;
          S.stroke(ctx, [[cx - 14, 556], [cx + 14, 556]], { role: 'ink-soft', width: 2.4, p: cpi });
          S.stroke(ctx, [[cx - 12, 556], [cx - 12, 590]], { role: 'ink-soft', width: 2, p: cpi });
          S.stroke(ctx, [[cx + 12, 556], [cx + 12, 590]], { role: 'ink-soft', width: 2, p: cpi });
          S.stroke(ctx, [[cx - 14, 556], [cx - 18, 512]], { role: 'ink-soft', width: 2.4, p: cpi });
        }
        S.text(ctx, env.text('t2'), { x: tx + tw + 74, y: 490, size: 18, weight: 700, align: 'center', p: cp });
        S.person(ctx, env.cast('hernan'), { pose: 'asking', x: 140, y: 600, height: 260, p: s.at(1) });
        S.labelBar(ctx, env.text('t3'), { x: M, y: 40, size: 24, p: s.at(3) });
        return { on: { hernan: { x: 140, y: 600 - 260 } } };
      },

      // Draw: figure background; on line 1 the figure card `P7-C34` appears at the top left, and nine small tag cards appear in a
      // grid, labeled «Estructura ecológica rezagada y medida por superficie», «El agua como sistema ordenador», «Riesgo sobre
      // suelo ya ocupado», «Frente de urbanización desplazado hacia los bordes», «Brecha entre la norma rural y el uso real»,
      // «Dependencia metabólica regional», «Densificación condicionada al soporte», «El corredor del río como eje ecológico
      // incompleto» and «Gobernanza multiescalar»; on line 2 the last card is emphasized and five small labels appear around it:
      // «Área Metropolitana», «Corantioquia», «Comisión Conjunta del POMCA», «Gobernación», «Municipios vecinos».
      asuntos: function (ctx, s, env) {
        var S = env.style, E = env.ease;
        var a = env.cards.draw(ctx, 'P7-C34', { x: M, y: 110, w: 360, compact: true, p: s.at(0) });
        env.zones.push(a);
        var gx = 460, gy = 110, cw = 240, ch = 100, gap = 10;
        var p2 = s.at(1);
        var last = null;
        for (var k = 0; k < 9; k++) {
          var col = k % 3, row = Math.floor(k / 3);
          var box = { x: gx + col * (cw + gap), y: gy + row * (ch + gap), w: cw, h: ch };
          if (k === 8) last = box;
          env.course.tag(ctx, box, env.text('t' + (k + 1)), { p: E.clamp(s.at(0) * 2.4 - k * 0.15), size: 15, role: k === 8 && p2 > 0 ? 'accent-1' : 'accent-8' });
        }
        env.zones.push({ x: gx, y: gy, w: 3 * cw + 2 * gap, h: 3 * ch + 2 * gap });
        if (p2 > 0) {
          S.stroke(ctx, S.rectPath(last.x - 5, last.y - 5, last.w + 10, last.h + 10, 8), { role: 'ink', width: 3, p: p2 });
          // las cinco entidades, agrupadas bajo la tarjeta destacada
          var rows = [[10, 11, 12], [13, 14]], right = 1190, ry0 = 478, minX = right;
          var placed = [];
          rows.forEach(function (row, r) {
            var ws = row.map(function (k) { return S.labelBar(ctx, env.text('t' + k), { x: 0, y: 0, size: 15, measureOnly: true }).w; });
            var x = right - ws.reduce(function (acc, w) { return acc + w + 10; }, -10);
            minX = Math.min(minX, x);
            row.forEach(function (k, j) { placed.push({ k: k, x: x, y: ry0 + r * 46 }); x += ws[j] + 10; });
          });
          var gpP = E.clamp(p2 * 2);
          var gb = { x: minX - 14, y: ry0 - 14, w: right - minX + 28, h: 46 * 2 + 18 };
          S.stroke(ctx, S.rectPath(gb.x, gb.y, gb.w, gb.h, 10), { role: 'ink', width: 1.4, dash: [6, 5], p: gpP });
          S.stroke(ctx, [[last.x + last.w / 2, last.y + last.h + 6], [last.x + last.w / 2, gb.y]], { role: 'ink', width: 1.6, p: gpP });
          placed.forEach(function (pl, i) {
            S.labelBar(ctx, env.text('t' + pl.k), { x: pl.x, y: pl.y, size: 15, role: 'dark', p: E.clamp(p2 * 2 - 0.3 - i * 0.15) });
          });
        }
      },

      // Draw: recap background; LUCÍA, HERNÁN and the extras `extra-1` stand on the ridge; on line 1 the motto appears on the
      // label bar: «LA GOBERNANZA REGIONAL NO ES UN COMPONENTE INSTITUCIONAL QUE SE AGREGA AL FINAL»; on line 2 the stamp
      // `stamp-insumo` slides in.
      cierre: function (ctx, s, env) {
        var S = env.style;
        S.withAppear(ctx, 'illus', s.intro, function () {
          S.fill(ctx, { pts: [[560, 600], [700, 560], [900, 540], [1100, 548], [1280, 570], [1280, 620], [560, 620]], smooth: true }, { role: 'accent-6' });
        });
        var ex = env.cast('extra-1').people;
        var xs = [1000, 1080, 1160, 1230];
        [ex[0], ex[2], ex[3], ex[4]].forEach(function (lk, i) {
          S.person(ctx, lk, { pose: 'standing', x: xs[i] - 40, y: 566, height: 176, facing: 'left', p: s.intro });
        });
        S.person(ctx, env.cast('lucia'), { pose: 'standing', x: 760, y: 572, height: 200, p: s.intro });
        S.person(ctx, env.cast('hernan'), { pose: 'hat-in-hand', x: 870, y: 566, height: 200, p: s.intro });
        S.labelBar(ctx, env.text('t1'), { x: M, y: 80, size: 30, role: 'accent-1', maxWidth: 1000, p: s.at(0) });
        stamp(ctx, env, 'stamp-insumo', M, 400, s.at(1), 400);
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
