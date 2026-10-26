/* CURSO · `valle-planta`: vista esquemática desde arriba del valle como una cuenca alargada, sur abajo y norte arriba,
   con el río ondulado a lo largo y las crestas como dos bandas suaves (spec §3.5). Sin límites municipales ni bordes.
   Se dibuja en el manejo del polo B dentro de un panel de mapa (líneas finas) o, con `paper`, en el polo A. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // Geometría en una caja: devuelve funciones de posición. u: 0 (oeste) → 1 (este); v: 0 (norte) → 1 (sur).
  function geom(box) {
    var cx = box.x + box.w / 2;
    function halfW(v) { return box.w * (0.2 + 0.1 * Math.sin(v * Math.PI)) ; }
    function axisX(v) { return cx + Math.sin(v * Math.PI * 2.2) * box.w * 0.04; }
    return {
      at: function (u, v) { var y = box.y + box.h * (0.06 + v * 0.88); return [axisX(v) + (u - 0.5) * 2 * halfW(v), y]; },
      river: function () { var pts = []; for (var i = 0; i <= 24; i++) { var v = i / 24; pts.push([axisX(v) + Math.sin(v * 9) * box.w * 0.012, box.y + box.h * (0.06 + v * 0.88)]); } return pts; },
      edge: function (side, k) { var pts = []; for (var i = 0; i <= 20; i++) { var v = i / 20; pts.push([axisX(v) + side * halfW(v) * (k || 1), box.y + box.h * (0.06 + v * 0.88)]); } return pts; }
    };
  }

  // draw(ctx, box, o) — o: { p, labels: { norte, sur }, paper (polo A), patches: [{ u, v, r, kind: 'lines'|'cells'|'pattern', pattern, label, p }] }
  C.vallePlanta = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var g = geom(box);
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return g;
    var paper = !!o.paper;
    var line = function (pts, opts) {
      if (paper) S.stroke(ctx, { pts: pts, smooth: true }, Object.assign({ role: 'ink', width: 1.5 }, opts || {}));
      else S.mapLine(ctx, { pts: pts, smooth: true }, opts || {});
    };
    // crestas: dos bandas suaves (dos líneas por lado)
    [-1, 1].forEach(function (side) {
      line(g.edge(side, 1), { p: E.clamp(p * 2) });
      line(g.edge(side, 1.35), { p: E.clamp(p * 2 - 0.3), dashed: false, weight: 1 });
    });
    // río
    if (paper) S.water(ctx, { pts: g.river(), smooth: true }, { width: 6, p: E.clamp(p * 2 - 0.5), t: o.t });
    else S.mapLine(ctx, { pts: g.river(), smooth: true }, { p: E.clamp(p * 2 - 0.5), glow: true });
    // manchas abstractas
    (o.patches || []).forEach(function (pt) {
      var pp = pt.p == null ? p : pt.p;
      if (pp <= 0) return;
      var c = g.at(pt.u, pt.v);
      var r = pt.r || box.w * 0.06;
      var path = S.ellipsePath(c[0], c[1], r, r * 0.7);
      ctx.save();
      ctx.globalAlpha *= S.appear('fade', pp).alpha;
      if (pt.kind === 'pattern') S.patternFill(ctx, path, pt.pattern || 'stripes', { onDark: !paper });
      else if (pt.kind === 'cells') { ctx.fillStyle = S.role('machine-glow-1', 0.22); S.trace(ctx, path); ctx.fill(); }
      ctx.restore();
      if (paper) S.stroke(ctx, path, { role: 'ink', width: 1.4, p: pp, dash: pt.dashed ? [5, 4] : null });
      else S.mapLine(ctx, path, { p: pp, dashed: !!pt.dashed });
      if (pt.label) {
        if (paper) S.text(ctx, pt.label, { x: c[0] + r + 8, y: c[1] + 5, size: pt.size || 15, weight: 700, p: pp, maxWidth: pt.labelWidth });
        else S.mapLabel(ctx, pt.label, c[0] + r + 8, c[1] + 4, { p: pp, size: pt.size || 12, maxWidth: pt.labelWidth });
      }
    });
    var L = o.labels || {};
    var tl = function (txt, x, y) {
      if (!txt) return;
      if (paper) S.text(ctx, txt, { x: x, y: y, size: 15, face: 'display', align: 'center', p: p });
      else S.mapLabel(ctx, txt, x, y, { align: 'center', p: p });
    };
    tl(L.norte, box.x + box.w / 2, box.y + 16);
    tl(L.sur, box.x + box.w / 2, box.y + box.h - 4);
    return g;
  };
  C.vallePlantaGeom = geom;
})(typeof window !== 'undefined' ? window : globalThis);
