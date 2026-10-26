/* ESTILO · las once marcas (style S4) y las tramas (style S5). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var S = EEP.style;
  var role = S.role;
  var E = function () { return EEP.engine.ease; };

  // ---------- tramas ----------
  var tiles = {};
  function tile(kind, r) {
    var k = kind + '|' + r;
    if (tiles[k]) return tiles[k];
    var size = { dots: 10, stripes: 8, crosses: 12, checks: 16, waves: 20, grid: 10 }[kind] || 10;
    var hgt = kind === 'waves' ? 10 : size;
    var c = S.makeCanvas(kind === 'stripes' ? 8 : size, kind === 'stripes' ? 8 : hgt);
    var x = c.getContext('2d');
    x.strokeStyle = role(r); x.fillStyle = role(r); x.lineWidth = 1.5; x.lineCap = 'square';
    if (kind === 'dots') { x.beginPath(); x.arc(5, 5, 1.25, 0, Math.PI * 2); x.fill(); }
    else if (kind === 'stripes') {
      x.beginPath();
      x.moveTo(-2, 10); x.lineTo(10, -2);
      x.moveTo(-2, 2); x.lineTo(2, -2);
      x.moveTo(6, 10); x.lineTo(10, 6);
      x.stroke();
    } else if (kind === 'crosses') { x.beginPath(); x.moveTo(3, 6); x.lineTo(9, 6); x.moveTo(6, 3); x.lineTo(6, 9); x.stroke(); }
    else if (kind === 'checks') { x.globalAlpha = 0.35; x.fillRect(0, 0, 8, 8); x.fillRect(8, 8, 8, 8); }
    else if (kind === 'waves') {
      x.beginPath();
      for (var i = 0; i <= 20; i++) { var yy = 5 + Math.sin(i / 20 * Math.PI * 2) * 2; if (i) x.lineTo(i, yy); else x.moveTo(i, yy); }
      x.stroke();
    } else if (kind === 'grid') { x.beginPath(); x.moveTo(0.75, 0); x.lineTo(0.75, 10); x.moveTo(0, 0.75); x.lineTo(10, 0.75); x.stroke(); }
    tiles[k] = c;
    return c;
  }
  // Rellena un camino con una trama. opts: { onDark, alpha, ground }
  S.patternFill = function (ctx, path, kind, opts) {
    opts = opts || {};
    ctx.save();
    if (opts.ground) { ctx.fillStyle = role(opts.ground); S.trace(ctx, path); ctx.fill(); }
    var pat = ctx.createPattern(tile(kind, opts.onDark ? 'on-dark' : (opts.role || 'ink')), 'repeat');
    ctx.fillStyle = pat;
    ctx.globalAlpha *= opts.alpha == null ? 1 : opts.alpha;
    S.trace(ctx, path);
    ctx.fill();
    ctx.restore();
  };

  // ---------- insignia ----------
  // Devuelve el ancho. opts: { x, y, text, variant: 'type'|'state'|'alert', glyph, size, p, measureOnly, h }
  function badge(ctx, opts) {
    var size = Math.max(14, opts.size || 14);
    var h = opts.h || Math.round(size * 1.9);
    var f = S.font('display', size, 700);
    var label = String(opts.text || '').toLocaleUpperCase('es-CO');
    var tw = S.measure(ctx, label, f) + label.length * size * 0.03;
    var gw = opts.glyph ? h * 0.75 : 0;
    var w = Math.round(tw + gw + h * 0.9);
    if (opts.measureOnly) return w;
    var p = opts.p == null ? 1 : opts.p;
    if (p <= 0) return w;
    var v = opts.variant || 'state';
    var x = opts.align === 'right' ? opts.x - w : opts.x, y = opts.y;
    ctx.save();
    ctx.globalAlpha *= S.appear('fade', p).alpha;
    var fillR = v === 'type' ? 'dark' : (opts.ground || 'ground');
    var lineR = v === 'type' ? 'on-dark' : v === 'alert' ? 'alert' : 'ink';
    ctx.beginPath();
    S.roundRect(ctx, x, y, w, h, h / 2);
    ctx.fillStyle = role(fillR);
    ctx.fill();
    if (v !== 'type') { ctx.lineWidth = 1.6; ctx.strokeStyle = role(lineR); ctx.stroke(); }
    if (opts.glyph) S.glyph(ctx, opts.glyph, x + h * 0.48 + gw * 0.15, y + h * 0.8, h * 0.62, lineR);
    ctx.font = f;
    if ('letterSpacing' in ctx) ctx.letterSpacing = (size * 0.03).toFixed(2) + 'px';
    ctx.fillStyle = role(lineR);
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + h * 0.45 + gw, y + h / 2 + 1);
    ctx.restore();
    return w;
  }

  // ---------- marcas ----------
  var M = {};

  M.correct = function (ctx, box, o) {
    var p = o.p == null ? 1 : o.p;
    var a = S.appear('bar', p);
    var h = box.h || 44, w = h * 1.6;
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(a.dx, 0);
    S.pill(ctx, { x: box.x, y: box.y, w: w, h: h }, { role: 'accent-1' });
    var c1 = E().clamp(p * 2), c2 = E().clamp(p * 2 - 1);
    var x0 = box.x + w * 0.32, y0 = box.y + h * 0.52;
    ctx.strokeStyle = role('ink'); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0 + w * 0.12 * c1, y0 + h * 0.18 * c1);
    if (c2 > 0) ctx.lineTo(x0 + w * 0.12 + w * 0.26 * c2, y0 + h * 0.18 - h * 0.4 * c2);
    ctx.stroke();
    ctx.restore();
    S.text(ctx, o.text || '¡Muy bien!', { x: box.x + w + 14, y: box.y + h / 2, size: Math.round(h * 0.5), weight: 700, baseline: 'middle', p: p });
  };

  M.retry = function (ctx, box, o) {
    var p = o.p == null ? 1 : o.p;
    var a = S.appear('text', p);
    var h = box.h || 44, w = h * 1.6;
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(0, a.dy);
    S.pill(ctx, { x: box.x, y: box.y, w: w, h: h }, { role: 'ground', outline: 'ink', outlineWidth: 2 });
    ctx.strokeStyle = role('ink'); ctx.lineWidth = 2.4; ctx.lineCap = 'round';
    var cx = box.x + w / 2, cy = box.y + h / 2;
    ctx.beginPath(); ctx.arc(cx, cy, h * 0.22, Math.PI * 0.2, Math.PI * 1.6); ctx.stroke();
    var ex = cx + Math.cos(Math.PI * 1.6) * h * 0.22, ey = cy + Math.sin(Math.PI * 1.6) * h * 0.22;
    ctx.beginPath(); ctx.moveTo(ex - 6, ey - 3); ctx.lineTo(ex, ey); ctx.lineTo(ex - 2, ey + 6); ctx.stroke();
    ctx.restore();
    S.text(ctx, o.text || 'Casi. Pista: …', { x: box.x + w + 14, y: box.y + h / 2, size: Math.round(h * 0.45), baseline: 'middle', p: p, maxWidth: box.w ? box.w - w - 14 : null });
  };

  M.misreading = function (ctx, box, o) {
    var p = o.p == null ? 1 : o.p;
    ctx.save();
    ctx.globalAlpha *= S.appear('fade', p).alpha;
    ctx.strokeStyle = role('ink-soft'); ctx.lineWidth = 1.5;
    ctx.beginPath();
    var w = Math.min(box.w || 140, 140);
    for (var i = 0; i <= w; i += 2) {
      var y = box.y + Math.sin(i / 6) * 2.5;
      if (i) ctx.lineTo(box.x + i, y); else ctx.moveTo(box.x + i, y);
    }
    ctx.stroke();
    ctx.restore();
    S.text(ctx, o.text || 'Error de lectura, corregido a continuación', { x: box.x, y: box.y + 26, size: o.size || 18, role: 'ink-soft', italic: true, p: p });
  };

  M.speaking = function (ctx, box, o) {
    return S.labelBar(ctx, o.text || '', { x: box.x, y: box.y, size: o.size || 22, p: o.p, role: 'dark' });
  };

  // Pestaña colgante. o.p: 0→1 entrada, o.out: 0→1 salida.
  M.chapter = function (ctx, box, o) {
    var w = box.w || 320, h = box.h || 96;
    var x = box.x != null ? box.x : 1280 - w - 72;
    var e = E();
    var drop = S.reduced ? 0 : (1 - e.out(o.p == null ? 1 : o.p)) * 20 + e.in(o.out || 0) * (h + 20);
    var alpha = S.reduced ? (o.p > 0 ? 1 : 0) * (1 - (o.out || 0)) : e.clamp((o.p == null ? 1 : o.p) * 3) * (1 - e.clamp((o.out || 0) * 1.4 - 0.4));
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(0, -drop);
    ctx.fillStyle = role('ground');
    ctx.beginPath();
    S.roundRect(ctx, x, -12, w, h + 12, [0, 0, 12, 12]);
    ctx.fill();
    ctx.lineWidth = 1.2; ctx.strokeStyle = role('ink', 0.35); ctx.stroke();
    S.text(ctx, o.text || '', { x: x + 22, y: h * 0.5, size: o.size || 20, face: 'display', baseline: 'middle', maxWidth: w - 44, lineHeight: 1.1 });
    ctx.restore();
  };

  M.divider = function (ctx, box, o) {
    var y = box.y + 0.5;
    var gap = o.text ? S.measure(ctx, o.text.toUpperCase(), S.font('display', 14, 700)) + 30 : 30;
    var cx = box.x + box.w / 2;
    ctx.save();
    ctx.globalAlpha *= S.appear('fade', o.p == null ? 1 : o.p).alpha;
    ctx.strokeStyle = role('accent-6'); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(box.x, y); ctx.lineTo(cx - gap / 2, y); ctx.moveTo(cx + gap / 2, y); ctx.lineTo(box.x + box.w, y); ctx.stroke();
    ctx.restore();
    if (o.text) S.text(ctx, o.text, { x: cx, y: y + 5, size: 14, face: 'display', align: 'center', role: 'ink-soft', p: o.p });
  };

  // Sello: tarjeta etiqueta inclinada 3°. o: { text, sign(ctx, x, y, size), p, size }
  M.stamp = function (ctx, box, o) {
    var size = o.size || 20;
    var f = S.font('display', size, 700);
    var maxW = box.w || 420;
    var signW = o.sign ? size * 2.6 : 0;
    var lines = S.wrap(ctx, String(o.text || '').toLocaleUpperCase('es-CO'), f, maxW - signW - 40);
    var tw = 0;
    lines.forEach(function (l) { tw = Math.max(tw, S.measure(ctx, l, f) + l.length * size * 0.03); });
    var w = tw + signW + 44, lh = size * 1.12;
    var h = Math.max(lines.length * lh + 46, signW + 30);
    if (o.measureOnly) return { w: w, h: h };
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return { w: w, h: h };
    var a = S.appear('bar', p);
    var tilt = -3 * (S.reduced ? 1 : E().out(p));
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(box.x + w / 2 + a.dx, box.y + h / 2);
    ctx.rotate(tilt * Math.PI / 180);
    ctx.translate(-w / 2, -h / 2);
    S.tagCard(ctx, { x: 0, y: 0, w: w, h: h }, { role: 'accent-8', holes: 1, holeLeft: true });
    if (o.sign) { ctx.save(); o.sign(ctx, 20 + signW / 2, h / 2 + signW * 0.42, signW * 0.85); ctx.restore(); }
    ctx.font = f;
    if ('letterSpacing' in ctx) ctx.letterSpacing = (size * 0.03).toFixed(2) + 'px';
    ctx.fillStyle = role('ink');
    var ty = h / 2 - (lines.length * lh) / 2 + size * 0.85 + 4;
    lines.forEach(function (l, i) { ctx.fillText(l, 22 + signW, ty + i * lh); });
    ctx.restore();
    return { w: w, h: h };
  };

  // Marco de tarjeta: o: { p, hole, ground }
  M.card = function (ctx, box, o) {
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return;
    var a = S.appear('card', p);
    ctx.save();
    ctx.globalAlpha *= E().clamp(p * 4);
    ctx.fillStyle = role(o.ground || 'ground-2');
    ctx.globalAlpha *= S.reduced ? 1 : E().clamp(a.reveal * 1.2);
    ctx.beginPath();
    S.roundRect(ctx, box.x, box.y, box.w, box.h, 9);
    ctx.fill();
    ctx.restore();
    S.rectStrokeReveal(ctx, box.x, box.y, box.w, box.h, 9, { width: o.outline || 1.2 }, a.reveal);
    if (o.hole && a.reveal >= 1) {
      ctx.save();
      ctx.beginPath(); ctx.arc(box.x + 22, box.y + 22, 6, 0, Math.PI * 2);
      ctx.fillStyle = role('ground'); ctx.fill();
      ctx.lineWidth = 1.2; ctx.strokeStyle = role('ink'); ctx.stroke();
      ctx.restore();
    }
    return a.alpha; // alfa del contenido
  };

  M.button = function (ctx, box, o) {
    var size = o.size || 20;
    var label = '→ ' + String(o.text || '').toLocaleUpperCase('es-CO');
    var f = S.font('display', size, 700);
    var w = S.measure(ctx, label, f) + label.length * size * 0.03 + size * 2;
    var h = size * 2.3;
    var x = box.w ? box.x + (box.w - w) / 2 : box.x, y = box.h ? box.y + (box.h - h) / 2 : box.y;
    ctx.save();
    ctx.globalAlpha *= S.appear('fade', o.p == null ? 1 : o.p).alpha;
    S.pill(ctx, { x: x, y: y, w: w, h: h }, { role: 'dark' });
    ctx.font = f;
    if ('letterSpacing' in ctx) ctx.letterSpacing = (size * 0.03).toFixed(2) + 'px';
    ctx.fillStyle = role('on-dark');
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + size, y + h / 2 + 1);
    ctx.restore();
    return { x: x, y: y, w: w, h: h };
  };

  M.badge = function (ctx, box, o) {
    return badge(ctx, { x: box.x, y: box.y, text: o.text, variant: o.variant, glyph: o.glyph, size: o.size, p: o.p, align: o.align, measureOnly: o.measureOnly, h: box.h, ground: o.ground });
  };

  M.pattern = function (ctx, box, o) {
    var path = o.path || S.rectPath(box.x, box.y, box.w, box.h, 0);
    S.patternFill(ctx, path, o.variant || 'dots', { onDark: o.onDark, ground: o.ground === false ? null : (o.onDark ? null : (o.ground || 'ground')), alpha: o.alpha });
    if (o.outline !== false) S.stroke(ctx, path, { role: o.onDark ? 'on-dark' : 'ink', width: 1.5 });
  };

  S.mark = function (ctx, name, box, opts) {
    var f = M[name];
    if (!f) return;
    return f(ctx, box || {}, opts || {});
  };
  S.MARKS = Object.keys(M);
})(typeof window !== 'undefined' ? window : globalThis);
