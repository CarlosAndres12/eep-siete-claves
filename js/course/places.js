/* CURSO · lugares del polo A (spec §3.5): `mirador`, `mercado-campesino` y `huerta`. Nunca mapas políticos. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // Mirador: baranda, banca y árbol en una ladera alta, mirando hacia el valle lejano.
  // box: zona del mirador (suelo en box.y + box.h). o: { p, t, valley: true }
  C.mirador = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style;
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return {};
    var ground = box.y + box.h;
    var a = S.appear('illus', p);
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    // valle lejano (abajo, a la derecha): colinas pálidas y una ciudad diminuta
    if (o.valley !== false) {
      S.hills(ctx, { x: box.x + box.w * 0.25, y: ground - 230, w: box.w * 0.75, h: 150 }, { seed: 7, layers: 2, roles: [['accent-1', 'accent-6'], ['accent-6', 'accent-7']] });
      for (var i = 0; i < 9; i++) S.building(ctx, { x: box.x + box.w * (0.52 + i * 0.03), y: ground - 120 - (i % 3) * 8, w: 14, h: 30 + (i % 3) * 8 }, { kind: 'bloque', seed: i });
      S.fill(ctx, S.rectPath(box.x + box.w * 0.48, ground - 92, box.w * 0.52, 8, 0), { role: 'accent-2' });
    }
    // plataforma del mirador
    S.fill(ctx, [[box.x - 20, ground - 70], [box.x + box.w * 0.55, ground - 90], [box.x + box.w * 0.62, ground + 2], [box.x - 20, ground + 2]], { role: 'accent-4' });
    ctx.restore();
    // baranda (líneas finas ink), banca y árbol
    var ry = ground - 112;
    S.withAppear(ctx, 'illus', p, function () {
      S.stroke(ctx, [[box.x + box.w * 0.08, ry], [box.x + box.w * 0.6, ry - 14]], { role: 'ink', width: 3 });
      S.stroke(ctx, [[box.x + box.w * 0.08, ry + 22], [box.x + box.w * 0.6, ry + 8]], { role: 'ink', width: 1.6 });
      for (var k = 0; k <= 6; k++) {
        var fx = box.x + box.w * (0.08 + k * 0.52 / 6), fy = ry - k * 14 / 6;
        S.stroke(ctx, [[fx, fy], [fx, fy + 52]], { role: 'ink', width: 1.6 });
      }
      // banca
      var bx = box.x + box.w * 0.12;
      S.fill(ctx, S.rectPath(bx, ground - 46, 110, 10, 3), { role: 'accent-7' });
      S.stroke(ctx, [[bx + 10, ground - 36], [bx + 10, ground - 10]], { role: 'ink', width: 2 });
      S.stroke(ctx, [[bx + 100, ground - 36], [bx + 100, ground - 10]], { role: 'ink', width: 2 });
      S.tree(ctx, { x: box.x + box.w * 0.04, y: ground - 40, size: 150, seed: 31, t: o.t });
    });
    return { railY: ry, ground: ground };
  };

  // Mercado campesino: puesto con toldo, cajones de productos y una balanza colgante. (x, y) = base del puesto.
  C.mercado = function (ctx, x, y, o) {
    o = o || {};
    var S = EEP.style;
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return;
    var w = o.w || 360, h = o.h || 250;
    S.withAppear(ctx, 'illus', p, function () {
      // postes y toldo a rayas
      S.stroke(ctx, [[x, y], [x, y - h]], { role: 'ink', width: 3 });
      S.stroke(ctx, [[x + w, y], [x + w, y - h]], { role: 'ink', width: 3 });
      for (var i = 0; i < 6; i++) {
        S.fill(ctx, [[x - 14 + i * (w + 28) / 6, y - h], [x - 14 + (i + 1) * (w + 28) / 6, y - h], [x - 14 + (i + 1) * (w + 28) / 6, y - h + 36], [x - 14 + i * (w + 28) / 6, y - h + 36]], { role: i % 2 ? 'accent-4' : 'accent-6' });
      }
      for (var j = 0; j < 6; j++) {
        var cx = x - 14 + (j + 0.5) * (w + 28) / 6;
        S.fill(ctx, function (c) { c.arc(cx, y - h + 36, (w + 28) / 12, 0, Math.PI); }, { role: j % 2 ? 'accent-4' : 'accent-6' });
      }
      // mostrador
      S.fill(ctx, S.rectPath(x - 6, y - 92, w + 12, 92, 2), { role: 'accent-7' });
      S.stroke(ctx, [[x - 6, y - 92], [x + w + 6, y - 92]], { role: 'ink', width: 1.4 });
      // cajones con productos: plátanos, papas, verduras, frutas
      var crops = [['accent-9', 'platano'], ['skin-2', 'papa'], ['accent-6', 'verde'], ['accent-5', 'fruta']];
      crops.forEach(function (cr, k) {
        var bx = x + 8 + k * (w - 16) / 4, bw = (w - 16) / 4 - 10;
        S.fill(ctx, S.rectPath(bx, y - 132, bw, 40, 2), { role: 'accent-4' });
        S.stroke(ctx, [[bx, y - 112], [bx + bw, y - 112]], { role: 'ink', width: 1.1 });
        for (var m = 0; m < 5; m++) {
          var fx = bx + 8 + m * (bw - 16) / 4;
          if (cr[1] === 'platano') S.stroke(ctx, function (c) { c.arc(fx, y - 140, 9, 0.2 * Math.PI, 0.9 * Math.PI); }, { role: 'accent-9', width: 6 });
          else S.fill(ctx, S.circlePath(fx, y - 138, cr[1] === 'verde' ? 9 : 7), { role: cr[0] });
        }
      });
      // balanza colgante
      var sx = x + w * 0.82;
      S.stroke(ctx, [[sx, y - h + 40], [sx, y - h + 78]], { role: 'ink', width: 1.4 });
      S.fill(ctx, S.circlePath(sx, y - h + 92, 14), { role: 'ground' });
      S.stroke(ctx, S.circlePath(sx, y - h + 92, 14), { role: 'ink', width: 1.6 });
      S.stroke(ctx, [[sx, y - h + 92], [sx + 7, y - h + 85]], { role: 'ink', width: 1.4 });
      S.stroke(ctx, [[sx - 18, y - h + 128], [sx, y - h + 106], [sx + 18, y - h + 128]], { role: 'ink', width: 1.2 });
      S.stroke(ctx, function (c) { c.arc(sx, y - h + 128, 18, 0, Math.PI); }, { role: 'ink', width: 1.6 });
    });
  };

  // Huerta de Hernán en una ladera: hileras de plantas, una manguera, una casita y una cerca.
  // box: área de la huerta (suelo en box.y + box.h). o: { p, t, house: true, fence: true }
  C.huerta = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style;
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return {};
    var g = box.y + box.h;
    S.withAppear(ctx, 'illus', p, function () {
      // terreno en ladera
      S.fill(ctx, [[box.x, g - 30], [box.x + box.w, g - 70], [box.x + box.w, g + 2], [box.x, g + 2]], { role: 'accent-4', alpha: 0.9 });
      // hileras de plantas
      for (var row = 0; row < 3; row++) {
        for (var k = 0; k < 7; k++) {
          var fx = box.x + 30 + k * (box.w - 160) / 7;
          var fy = g - 18 - row * 16 - (fx - box.x) / box.w * 40;
          S.sign(ctx, 'hoja', { x: fx, y: fy, size: 18 + (k % 2) * 4 });
        }
      }
      // casita
      if (o.house !== false) S.building(ctx, { x: box.x + box.w - 120, y: g - 190, w: 96, h: 110 }, { kind: 'casa', roof: 'accent-5' });
      // cerca
      if (o.fence !== false) {
        S.stroke(ctx, [[box.x, g - 48], [box.x + box.w * 0.6, g - 72]], { role: 'ink', width: 1.6 });
        for (var f = 0; f <= 8; f++) {
          var px = box.x + f * box.w * 0.6 / 8, py = g - 48 - f * 24 / 8;
          S.stroke(ctx, [[px, py - 12], [px, py + 22]], { role: 'ink', width: 1.6 });
        }
      }
      // manguera enrollada
      S.stroke(ctx, S.circlePath(box.x + box.w - 150, g - 34, 14), { role: 'accent-7', width: 4 });
    });
    return { ground: g };
  };
})(typeof window !== 'undefined' ? window : globalThis);
