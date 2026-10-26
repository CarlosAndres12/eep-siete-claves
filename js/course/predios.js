/* CURSO · `predios`: una colcha de muchas parcelas rectangulares pequeñas y unas pocas grandes en una ladera.
   Esquema sin valores (spec §3.5). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  var cache = {};
  function layout(box, seed) {
    var k = [box.x, box.y, box.w, box.h, seed].join('|');
    if (cache[k]) return cache[k];
    var r = EEP.engine.rng(seed || 23);
    var cells = [];
    // subdivisión recursiva: unas pocas parcelas grandes, muchas pequeñas
    function split(x, y, w, h, depth) {
      var big = depth >= 1 && r() < 0.12 && w * h > 0.02;
      if (depth >= 6 || big || (w < 0.09 && h < 0.2)) { cells.push({ x: x, y: y, w: w, h: h, big: big }); return; }
      if (w * box.w > h * box.h) { var f = 0.35 + r() * 0.3; split(x, y, w * f, h, depth + 1); split(x + w * f, y, w * (1 - f), h, depth + 1); }
      else { var g = 0.35 + r() * 0.3; split(x, y, w, h * g, depth + 1); split(x, y + h * g, w, h * (1 - g), depth + 1); }
    }
    split(0, 0, 1, 1, 0);
    cache[k] = cells;
    return cells;
  }

  // draw(ctx, box, { p, seed, slope (0–1 inclinación), badge }) — la colcha se dibuja en una ladera inclinada.
  C.predios = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return;
    var cells = layout({ x: 0, y: 0, w: box.w, h: box.h }, o.seed);
    var slope = o.slope == null ? 0.35 : o.slope;
    var roles = ['accent-1', 'accent-6', 'accent-4', 'accent-9', 'accent-1', 'accent-6'];
    // ladera: paralelogramo con la parte alta a la derecha
    function map(u, v) { return [box.x + u * box.w, box.y + v * box.h + (1 - u) * box.h * slope * 0.5 - box.h * slope * 0.25]; }
    var a = S.appear('illus', p);
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(0, a.dy);
    cells.forEach(function (c, i) {
      var pi = E.clamp(p * 1.6 - (i / cells.length) * 0.6);
      if (pi <= 0) return;
      var u0 = c.x, v0 = c.y, u1 = c.x + c.w, v1 = c.y + c.h;
      var pts = [map(u0, v0), map(u1, v0), map(u1, v1), map(u0, v1)];
      S.fill(ctx, pts, { role: c.big ? 'accent-7' : roles[i % roles.length], p: pi });
      S.stroke(ctx, { pts: pts, closed: true }, { role: 'ink', width: 1.1, alpha: 0.85 });
    });
    ctx.restore();
    if (o.badge !== false) S.mark(ctx, 'badge', { x: box.x, y: box.y + box.h + 10 }, { text: EEP.data.site.ui.esquema, variant: 'state', glyph: 'g-esquema', size: 14, p: p });
    return { map: map };
  };
})(typeof window !== 'undefined' ? window : globalThis);
