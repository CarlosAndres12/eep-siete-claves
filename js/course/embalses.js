/* CURSO · `embalses`: el perfil del valle en el centro con tres embalses; dos más allá de las crestas y uno en la
   cresta oriental, cada uno unido al valle por una tubería (spec §3.5). Esquema; los nombres vienen de la escena. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // draw(ctx, box, { p, labels: [izquierda, derecha, cresta oriental], pipesP, t, badge })
  C.embalses = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return null;
    var x = box.x, y = box.y, w = box.w, h = box.h;
    var base = y + h;
    var a = S.appear('illus', p);
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(0, a.dy);
    // crestas exteriores (región) y perfil del valle
    S.hill(ctx, x - w * 0.02, base, w * 0.36, h * 0.62, { face: 'accent-1', flank: 'accent-6' });
    S.hill(ctx, x + w * 0.66, base, w * 0.36, h * 0.62, { face: 'accent-1', flank: 'accent-6' });
    var vx = x + w * 0.27, vw = w * 0.46;
    S.fill(ctx, [[vx, base - h * 0.55], [vx + vw * 0.38, base - h * 0.08], [vx + vw * 0.62, base - h * 0.08], [vx + vw, base - h * 0.55], [vx + vw, base], [vx, base]], { role: 'accent-6' });
    S.fill(ctx, [[vx + vw * 0.62, base - h * 0.08], [vx + vw, base - h * 0.55], [vx + vw, base], [vx + vw * 0.62, base]], { role: 'accent-7', alpha: 0.4 });
    // ciudad en el fondo del valle
    for (var i = 0; i < 4; i++) S.building(ctx, { x: vx + vw * (0.4 + i * 0.05), y: base - h * 0.08 - h * (0.1 + (i % 2) * 0.05), w: vw * 0.04, h: h * (0.1 + (i % 2) * 0.05) }, { kind: 'torre', seed: i });
    S.fill(ctx, S.rectPath(vx + vw * 0.49, base - h * 0.08, vw * 0.02, h * 0.08, 0), { role: 'accent-2' });
    ctx.restore();
    // embalses: (cx, cy) y destino de la tubería
    var dest = [vx + vw * 0.5, base - h * 0.12];
    var res = [
      { c: [x + w * 0.12, base - h * 0.3], rx: w * 0.07 },
      { c: [x + w * 0.88, base - h * 0.3], rx: w * 0.07 },
      { c: [vx + vw * 0.86, base - h * 0.5], rx: w * 0.04 }
    ];
    var pp = o.pipesP == null ? p : o.pipesP;
    res.forEach(function (r0, k) {
      var rp = E.clamp(p * 3 - k * 0.6);
      if (rp <= 0) return;
      ctx.save();
      ctx.globalAlpha *= S.appear('fade', rp).alpha;
      ctx.fillStyle = S.role('accent-2');
      ctx.beginPath(); ctx.ellipse(r0.c[0], r0.c[1], r0.rx, r0.rx * 0.32, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      if (pp > 0) {
        var mid = [(r0.c[0] + dest[0]) / 2, Math.min(r0.c[1], dest[1]) - h * 0.18];
        S.stroke(ctx, { pts: [r0.c, mid, dest], smooth: true }, { role: 'ink-soft', width: 3, p: E.clamp(pp * 1.4 - k * 0.2) });
      }
      var L = (o.labels || [])[k];
      if (L) S.text(ctx, L, { x: r0.c[0], y: r0.c[1] + r0.rx * 0.32 + 24, size: o.labelSize || 17, weight: 700, align: 'center', p: rp });
    });
    if (o.badge !== false) S.mark(ctx, 'badge', { x: box.x + box.w, y: box.y - 6 }, { text: EEP.data.site.ui.esquema, variant: 'state', glyph: 'g-esquema', align: 'right', size: 14, p: p });
    return { dest: dest, reservoirs: res };
  };
})(typeof window !== 'undefined' ? window : globalThis);
