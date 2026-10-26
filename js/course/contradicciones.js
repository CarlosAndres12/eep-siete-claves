/* CURSO · `contradicciones`: seis tarjetas etiqueta en anillo alrededor de una etiqueta central, cada una unida al
   centro por una línea fina (spec §3.5). Zona de significado: sin decoración dentro. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;

  // draw(ctx, box, { cards: [6 textos], center, p (aparición de tarjetas), linksP, emph: [índices], emphP, pinsP, pinLabel })
  C.contradicciones = function (ctx, box, o) {
    o = o || {};
    var S = EEP.style, E = EEP.engine.ease;
    var cx = box.x + box.w / 2, cy = box.y + box.h / 2;
    var cards = o.cards || [];
    var cw = Math.min(270, box.w * 0.3), ch = 118;
    var out = [];
    cards.forEach(function (txt, i) {
      var col = i < 3 ? i : 5 - i;
      var px = box.x + col * (box.w - cw) / 2;
      var py = i < 3 ? box.y : box.y + box.h - ch;
      out.push({ x: px, y: py, w: cw, h: ch });
    });
    var lp = o.linksP || 0;
    if (lp > 0) out.forEach(function (b, i) {
      S.stroke(ctx, [[b.x + b.w / 2, b.y + b.h / 2], [cx, cy]], { role: 'ink', width: 1.4, p: E.clamp(lp * 1.5 - i * 0.08) });
    });
    if (lp > 0 && o.center) {
      var m = S.labelBar(ctx, o.center, { x: 0, y: 0, size: 22, measureOnly: true });
      S.labelBar(ctx, o.center, { x: cx - m.w / 2, y: cy - m.h / 2, size: 22, p: lp });
    }
    cards.forEach(function (txt, i) {
      var b = out[i];
      var pi = E.clamp((o.p == null ? 1 : o.p) * 6 - i);
      if (pi <= 0) return;
      var emph = (o.emph || []).indexOf(i) >= 0 ? (o.emphP || 0) : 0;
      S.tagCard(ctx, b, { role: emph > 0.5 ? 'accent-1' : 'accent-8', holes: 1, p: pi });
      ctx.save(); ctx.globalAlpha *= S.appear('fade', pi).alpha;
      S.text(ctx, txt, { x: b.x + 14, y: b.y + 40, size: 15, weight: 700, maxWidth: b.w - 28, lineHeight: 1.18 });
      ctx.restore();
      if (emph > 0) S.stroke(ctx, S.rectPath(b.x - 5, b.y - 5, b.w + 10, b.h + 10, 8), { role: 'ink', width: 2.5, alpha: emph });
      var pp = o.pinsP || 0;
      if (pp > 0) {
        S.sign(ctx, 'pin', { x: b.x + 22, y: b.y + b.h - 6, size: 22, p: E.clamp(pp * 1.5 - i * 0.1) });
        if (o.pinLabel) S.text(ctx, o.pinLabel, { x: b.x + 38, y: b.y + b.h - 10, size: 13, weight: 700, p: E.clamp(pp * 1.5 - i * 0.1) });
      }
    });
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);
