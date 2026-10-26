/* ESTILO · trazo, relleno, textura, aparición, vida ambiental y funciones de S11.
   Líneas parejas, puntas redondas, rellenos planos sin contorno, sin degradados ni sombras (style S1). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var S = EEP.style;
  var T = S.tokens;
  var rngF = function (seed) { return EEP.engine.rng(seed == null ? 1 : seed); };
  var E = function () { return EEP.engine.ease; };

  S.reduced = false; // lo fija main.js en la página; los modos de render lo dejan en false.

  // ---------- color ----------
  var cache = {};
  function hexToRgb(h) {
    h = h.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function role(name, alpha) {
    var hex = T.roles[name] || T.extra[name];
    if (!hex) hex = EEP.engine.legend && EEP.engine.legend.CORE[name];
    if (!hex && /^#/.test(name)) hex = name; // colores de leyenda ya resueltos por legend.js
    if (!hex) hex = T.roles.ink;
    if (alpha == null || alpha >= 1) return hex;
    var k = hex + '|' + alpha.toFixed(3);
    if (cache[k]) return cache[k];
    var c = hexToRgb(hex);
    return (cache[k] = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + alpha.toFixed(3) + ')');
  }
  S.role = role;
  S.hexToRgb = hexToRgb;

  // ---------- caminos ----------
  // path: function(ctx) | [[x,y],...] | { pts, closed, smooth }
  function trace(ctx, path) {
    ctx.beginPath();
    if (typeof path === 'function') { path(ctx); return; }
    var pts = Array.isArray(path) ? path : path.pts;
    var closed = !Array.isArray(path) && path.closed;
    var smooth = !Array.isArray(path) && path.smooth;
    if (!pts || !pts.length) return;
    if (smooth && pts.length > 2) {
      var n = pts.length;
      ctx.moveTo(pts[0][0], pts[0][1]);
      var count = closed ? n : n - 1;
      for (var i = 0; i < count; i++) {
        var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
        if (!closed) { if (i === 0) p0 = p1; if (i + 2 >= n) p3 = p2; }
        ctx.bezierCurveTo(
          p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
          p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
          p2[0], p2[1]);
      }
    } else {
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (var j = 1; j < pts.length; j++) ctx.lineTo(pts[j][0], pts[j][1]);
    }
    if (closed) ctx.closePath();
  }
  S.trace = trace;

  function polyLength(pts, closed) {
    var L = 0;
    for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (closed && pts.length > 1) L += Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]);
    return L;
  }

  var WEIGHTS = { thin: 1.3, regular: 1.6, bold: 2, data: 2, map: 1.5 };

  // Una línea pareja en el manejo del estilo. opts: { weight, role, p, seed, alpha, dash, width, offset }
  function stroke(ctx, path, opts) {
    opts = opts || {};
    var p = opts.p == null ? 1 : opts.p;
    if (p <= 0) return;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = opts.width || WEIGHTS[opts.weight || 'thin'] || 1.3;
    ctx.strokeStyle = role(opts.role || 'ink', opts.alpha);
    var pts = Array.isArray(path) ? path : (path && path.pts);
    if (p < 1 && pts && !S.reduced) {
      var L = path.smooth ? polyLength(pts, path.closed) * 1.08 : polyLength(pts, path && path.closed);
      if (opts.dash) {
        // Línea discontinua que se dibuja: recorte progresivo por longitud aproximada.
        ctx.setLineDash(opts.dash);
        ctx.lineDashOffset = opts.offset || 0;
        ctx.globalAlpha *= E().clamp(p * 3);
      } else {
        ctx.setLineDash([L * p, L + 10]);
      }
    } else if (opts.dash) {
      ctx.setLineDash(opts.dash);
      ctx.lineDashOffset = opts.offset || 0;
    }
    if (p < 1 && !pts) ctx.globalAlpha *= p;
    trace(ctx, path);
    ctx.stroke();
    ctx.restore();
  }
  S.stroke = stroke;

  // Relleno plano. opts: { role, p, alpha, color }
  function fill(ctx, shape, opts) {
    opts = opts || {};
    var p = opts.p == null ? 1 : opts.p;
    if (p <= 0) return;
    ctx.save();
    var a = appear('fade', p).alpha;
    ctx.globalAlpha *= a;
    ctx.fillStyle = opts.color || role(opts.role || 'accent-6', opts.alpha);
    trace(ctx, shape);
    ctx.fill(opts.rule || 'nonzero');
    ctx.restore();
  }
  S.fill = fill;

  // ---------- aparición (style S2) ----------
  function appear(kind, p) {
    var e = E();
    p = e.clamp(p == null ? 1 : p);
    if (S.reduced) return { alpha: p > 0 ? e.clamp(p * 5) : 0, scale: 1, dx: 0, dy: 0, reveal: p > 0 ? 1 : 0 };
    switch (kind) {
      case 'illus': return { alpha: e.clamp(p / 0.4), scale: 1, dx: 0, dy: 24 * (1 - e.out(p)), reveal: p };
      case 'bar': return { alpha: e.clamp(p / 0.25), scale: 1, dx: -60 * (1 - e.out(p)), dy: 0, reveal: e.out(p) };
      case 'text': return { alpha: e.out(p), scale: 1, dx: 0, dy: 6 * (1 - e.out(p)), reveal: p };
      case 'line': return { alpha: 1, scale: 1, dx: 0, dy: 0, reveal: e.inOut(p) };
      case 'card': return { alpha: e.clamp((p - 0.45) / 0.3), scale: 1, dx: 0, dy: 0, reveal: e.inOut(e.clamp(p / 0.5)) };
      case 'exit': return { alpha: 1 - p, scale: 1, dx: 0, dy: 8 * p, reveal: 1 };
      default: return { alpha: e.out(p), scale: 1, dx: 0, dy: 0, reveal: p };
    }
  }
  S.appear = appear;

  // Envuelve un dibujo con la aparición de un tipo dado.
  S.withAppear = function (ctx, kind, p, draw) {
    if (p <= 0) return;
    var a = appear(kind, p);
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(a.dx, a.dy);
    draw(a);
    ctx.restore();
  };

  // ---------- texto ----------
  function font(face, size, weight, italic) {
    var fam = face === 'display' ? T.fonts.display : T.fonts.body;
    return (italic ? 'italic ' : '') + (weight || (face === 'display' ? 700 : 400)) + ' ' + size + 'px ' + fam;
  }
  S.font = font;

  var measureCache = {};
  S.clearMeasureCache = function () { measureCache = {}; };
  function measure(ctx, text, f) {
    var k = f + '|' + text;
    var v = measureCache[k];
    if (v == null) { ctx.save(); ctx.font = f; v = ctx.measureText(text).width; ctx.restore(); measureCache[k] = v; }
    return v;
  }
  S.measure = measure;

  function prepText(text, face, upper) {
    var s = String(text == null ? '' : text);
    if (face === 'display' && upper !== false) s = s.toLocaleUpperCase('es-CO');
    return s;
  }

  // Divide en líneas por palabras para un ancho máximo.
  function wrap(ctx, text, f, maxWidth) {
    var words = String(text).split(/\s+/).filter(Boolean);
    var lines = [], cur = '';
    words.forEach(function (w) {
      var t = cur ? cur + ' ' + w : w;
      if (!cur || measure(ctx, t, f) <= maxWidth) cur = t;
      else { lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    return lines;
  }
  S.wrap = wrap;

  // Texto en el lienzo. opts: { x, y, size, weight, role, face, align, maxWidth, lineHeight, p, upper,
  //   italic, baseline, tracking, alpha, nums }
  // Devuelve { width, height, lines }.
  function text(ctx, str, opts) {
    opts = opts || {};
    var face = opts.face || 'body';
    var size = opts.size || 22;
    var f = font(face, size, opts.weight, opts.italic);
    var s = prepText(str, face, opts.upper);
    var lines = opts.maxWidth ? wrap(ctx, s, f, opts.maxWidth) : [s];
    var lh = (opts.lineHeight || (face === 'display' ? 1.08 : 1.25)) * size;
    var w = 0;
    lines.forEach(function (l) { w = Math.max(w, measure(ctx, l, f)); });
    var res = { width: w, height: lines.length * lh, lines: lines, lineHeight: lh };
    if (opts.measureOnly) return res;
    var p = opts.p == null ? 1 : opts.p;
    if (p <= 0) return res;
    ctx.save();
    ctx.font = f;
    if ('fontVariantNumeric' in ctx) { try { ctx.fontVariantNumeric = 'tabular-nums'; } catch (e) {} }
    if (face === 'display' && 'letterSpacing' in ctx) ctx.letterSpacing = (size * 0.03).toFixed(2) + 'px';
    ctx.fillStyle = role(opts.role || 'ink', opts.alpha);
    ctx.textAlign = opts.align || 'left';
    ctx.textBaseline = 'alphabetic';
    var y0 = opts.y;
    if (opts.baseline === 'top') y0 += size * 0.8;
    else if (opts.baseline === 'middle') y0 += size * 0.35 - (lines.length - 1) * lh / 2;
    else if (opts.baseline === 'bottom') y0 -= (lines.length - 1) * lh;
    lines.forEach(function (l, i) {
      var li = lines.length > 1 ? E().clamp(p * lines.length - i) : p;
      if (li <= 0) return;
      var a = appear('text', li);
      ctx.globalAlpha = (opts.alpha == null ? 1 : 1) * a.alpha;
      ctx.fillText(l, opts.x, y0 + i * lh + a.dy);
    });
    ctx.restore();
    return res;
  }
  S.text = text;

  // ---------- formas de base ----------
  function roundRect(ctx, x, y, w, h, r) {
    var rr = typeof r === 'number' ? [r, r, r, r] : r; // tl, tr, br, bl
    ctx.moveTo(x + rr[0], y);
    ctx.lineTo(x + w - rr[1], y);
    ctx.arcTo(x + w, y, x + w, y + rr[1], rr[1]);
    ctx.lineTo(x + w, y + h - rr[2]);
    ctx.arcTo(x + w, y + h, x + w - rr[2], y + h, rr[2]);
    ctx.lineTo(x + rr[3], y + h);
    ctx.arcTo(x, y + h, x, y + h - rr[3], rr[3]);
    ctx.lineTo(x, y + rr[0]);
    ctx.arcTo(x, y, x + rr[0], y, rr[0]);
    ctx.closePath();
  }
  S.roundRect = roundRect;
  S.rectPath = function (x, y, w, h, r) { return function (ctx) { roundRect(ctx, x, y, w, h, r || 0); }; };
  S.circlePath = function (x, y, r) { return function (ctx) { ctx.arc(x, y, r, 0, Math.PI * 2); }; };
  S.ellipsePath = function (x, y, rx, ry, rot) { return function (ctx) { ctx.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2); }; };

  // Revelado de un rectángulo redondeado (marco que se dibuja).
  function rectStrokeReveal(ctx, x, y, w, h, r, opts, reveal) {
    var L = 2 * (w + h);
    ctx.save();
    ctx.lineWidth = opts.width || 1.2;
    ctx.strokeStyle = role(opts.role || 'ink');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (reveal < 1 && !S.reduced) ctx.setLineDash([L * reveal, L + 20]);
    ctx.beginPath();
    roundRect(ctx, x, y, w, h, r);
    ctx.stroke();
    ctx.restore();
  }
  S.rectStrokeReveal = rectStrokeReveal;

  // ---------- textura (solo copas de árboles, pre-renderizada) ----------
  var texCache = {};
  S.texture = function (kind, w, h, seed) {
    var k = kind + '|' + w + '|' + h + '|' + seed;
    if (texCache[k]) return texCache[k];
    var c = makeCanvas(w, h);
    var x = c.getContext('2d');
    var r = rngF(seed || 7);
    if (kind === 'stipple') {
      x.fillStyle = role('ink', 0.08);
      var n = Math.round(w * h / 90);
      for (var i = 0; i < n; i++) x.fillRect(Math.floor(r() * w), Math.floor(r() * h), 1, 1);
    }
    texCache[k] = c;
    return c;
  };

  function makeCanvas(w, h) {
    if (typeof OffscreenCanvas !== 'undefined' && !root.document) return new OffscreenCanvas(w, h);
    var c = root.document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  }
  S.makeCanvas = makeCanvas;

  // ---------- zonas de significado ----------
  function hitsZones(box, zones) {
    if (!zones) return false;
    for (var i = 0; i < zones.length; i++) {
      var z = zones[i];
      if (box.x < z.x + z.w && box.x + box.w > z.x && box.y < z.y + z.h && box.y + box.h > z.y) return true;
    }
    return false;
  }
  S.hitsZones = hitsZones;

  // ---------- nubes (S11) ----------
  function cloudShape(ctx, x, y, w, seed) {
    var r = rngF(seed);
    var arcs = 3 + Math.floor(r() * 3);
    var h = w * 0.42;
    ctx.beginPath();
    ctx.moveTo(x, y);
    var step = w / arcs;
    for (var i = 0; i < arcs; i++) {
      var cx = x + step * (i + 0.5);
      var rad = step * (0.55 + r() * 0.25) * (i === 0 || i === arcs - 1 ? 0.85 : 1.15);
      rad = Math.min(rad, h);
      ctx.arc(cx, y, rad, Math.PI, 0, false);
    }
    ctx.lineTo(x, y);
    ctx.closePath();
  }
  S.clouds = function (ctx, box, opts) {
    opts = opts || {};
    var r = rngF(opts.seed || 3);
    var n = opts.count || 2;
    var t = S.reduced ? 0 : (opts.t || 0);
    for (var i = 0; i < n; i++) {
      var w = (opts.size || 110) * (0.7 + r() * 0.6);
      var speed = 3 + r() * 3; // ≤ 6 px/s
      var span = box.w + w;
      var x0 = box.x + r() * box.w;
      var x = box.x - w + (((x0 - box.x + w) + speed * t) % span + span) % span;
      var y = box.y + w * 0.35 + r() * Math.max(1, box.h - w * 0.45);
      if (opts.zones && hitsZones({ x: x, y: y - w * 0.45, w: w, h: w * 0.45 }, opts.zones)) continue;
      ctx.save();
      ctx.fillStyle = role(opts.role || 'paper', opts.alpha);
      cloudShape(ctx, x, y, w, (opts.seed || 3) * 13 + i);
      ctx.fill();
      ctx.restore();
    }
  };

  // ---------- colinas (S11) ----------
  // layers: 1–3; roles: [[face, flank], …] de lejos a cerca.
  S.hills = function (ctx, box, opts) {
    opts = opts || {};
    var r = rngF(opts.seed || 11);
    var layers = opts.layers || 2;
    var roles = opts.roles || [['accent-1', 'accent-6'], ['accent-6', 'accent-7'], ['accent-7', 'ink']];
    var a = appear('illus', opts.p == null ? 1 : opts.p);
    if (a.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(0, a.dy);
    for (var L = 0; L < layers; L++) {
      var rl = roles[Math.min(L, roles.length - 1)];
      var top = box.y + box.h * (0.15 + L * 0.22);
      var pts = [];
      var n = 4 + Math.floor(r() * 3);
      for (var i = 0; i <= n; i++) {
        pts.push([box.x - 40 + (box.w + 80) * i / n, top + r() * box.h * 0.35]);
      }
      var poly = pts.concat([[box.x + box.w + 40, box.y + box.h + 2], [box.x - 40, box.y + box.h + 2]]);
      // cara
      ctx.fillStyle = role(rl[0]);
      ctx.beginPath();
      smoothOpen(ctx, pts);
      ctx.lineTo(box.x + box.w + 40, box.y + box.h + 2);
      ctx.lineTo(box.x - 40, box.y + box.h + 2);
      ctx.closePath();
      ctx.fill();
      // flanco sombreado: desde la cima más alta hacia un lado
      var hi = 0;
      for (var k = 1; k < pts.length; k++) if (pts[k][1] < pts[hi][1]) hi = k;
      var pk = pts[hi];
      ctx.fillStyle = role(rl[1]);
      ctx.beginPath();
      ctx.moveTo(pk[0], pk[1]);
      var nx = pts[Math.min(hi + 1, pts.length - 1)];
      ctx.quadraticCurveTo((pk[0] + nx[0]) / 2, (pk[1] + nx[1]) / 2 - 4, nx[0], nx[1]);
      ctx.lineTo(nx[0], box.y + box.h + 2);
      ctx.lineTo(pk[0] + (nx[0] - pk[0]) * 0.18, box.y + box.h + 2);
      ctx.closePath();
      ctx.fill();
      void poly;
    }
    ctx.restore();
  };
  function smoothOpen(ctx, pts) {
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
        p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
  }
  S.smoothOpen = smoothOpen;

  // Silueta de una colina sencilla con flanco (para el signo `colina`).
  S.hill = function (ctx, x, y, w, h, opts) {
    opts = opts || {};
    ctx.save();
    ctx.fillStyle = role(opts.face || 'accent-6');
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + w * 0.25, y, x + w * 0.35, y - h, x + w * 0.5, y - h);
    ctx.bezierCurveTo(x + w * 0.65, y - h, x + w * 0.75, y, x + w, y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = role(opts.flank || 'accent-7');
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y - h);
    ctx.bezierCurveTo(x + w * 0.65, y - h, x + w * 0.75, y, x + w, y);
    ctx.lineTo(x + w * 0.62, y);
    ctx.bezierCurveTo(x + w * 0.6, y - h * 0.4, x + w * 0.55, y - h * 0.8, x + w * 0.5, y - h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  // ---------- línea de contorno (S11) ----------
  var contourCache = {};
  S.contourLine = function (ctx, box, opts) {
    opts = opts || {};
    var seed = opts.seed || 5;
    var key = seed + '|' + box.x + '|' + box.y + '|' + box.w + '|' + box.h;
    var pts = contourCache[key];
    if (!pts) {
      var r = rngF(seed);
      var n = 7 + Math.floor(r() * 5);
      var cx = box.x + box.w * (0.3 + r() * 0.4), cy = box.y + box.h * (0.3 + r() * 0.4);
      var R = Math.max(box.w, box.h) * 0.62;
      pts = [];
      for (var i = 0; i < n; i++) {
        var ang = (i / n) * Math.PI * 2 + r() * 0.4;
        var rad = R * (0.6 + r() * 0.55);
        pts.push([cx + Math.cos(ang) * rad * 1.15, cy + Math.sin(ang) * rad * 0.8]);
      }
      contourCache[key] = pts;
    }
    var p = opts.p == null ? 1 : opts.p;
    var crawl = (opts.dash && !S.reduced) ? -(opts.t || 0) * 2 : 0;
    stroke(ctx, { pts: pts, closed: true, smooth: true }, {
      role: opts.role || 'ink', alpha: opts.alpha, width: opts.width || 1.6,
      p: S.reduced ? 1 : p, dash: opts.dash, offset: crawl
    });
  };

  // ---------- barra de etiqueta (S11) ----------
  // opts: { x, y, role, textRole, p, align, size, maxWidth } → { w, h }
  S.labelBar = function (ctx, str, opts) {
    opts = opts || {};
    var size = opts.size || 22;
    var padX = Math.round(size * 0.7), padY = Math.round(size * 0.5);
    var f = font('display', size, 700);
    var s = prepText(str, 'display');
    var lines = opts.maxWidth ? wrap(ctx, s, f, opts.maxWidth - padX * 2) : [s];
    var tw = 0;
    lines.forEach(function (l) { tw = Math.max(tw, measure(ctx, l, f) + size * 0.03 * l.length); });
    var lh = size * 1.12;
    var w = tw + padX * 2, h = lines.length * lh + padY * 2 - (lh - size);
    var x = opts.align === 'right' ? opts.x - w : opts.x;
    var res = { x: x, y: opts.y, w: w, h: h };
    if (opts.measureOnly) return res;
    var p = opts.p == null ? 1 : opts.p;
    if (p <= 0) return res;
    var a = appear('bar', p);
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(a.dx, 0);
    ctx.fillStyle = role(opts.role || 'dark');
    ctx.beginPath();
    roundRect(ctx, x, opts.y, w, h, 4);
    ctx.fill();
    ctx.font = f;
    if ('letterSpacing' in ctx) ctx.letterSpacing = (size * 0.03).toFixed(2) + 'px';
    ctx.fillStyle = role(opts.textRole || (opts.role && opts.role !== 'dark' ? 'ink' : 'on-dark'));
    ctx.textBaseline = 'alphabetic';
    lines.forEach(function (l, i) { ctx.fillText(l, x + padX, opts.y + padY + size * 0.82 + i * lh); });
    ctx.restore();
    return res;
  };

  // ---------- tarjeta etiqueta (S11) ----------
  // box: {x,y,w,h}; opts: { role, tilt (grados), holes, p, outline }
  S.tagCard = function (ctx, box, opts) {
    opts = opts || {};
    var p = opts.p == null ? 1 : opts.p;
    if (p <= 0) return;
    var a = appear('bar', p);
    var cut = Math.min(16, box.w * 0.12);
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(box.x + box.w / 2 + a.dx, box.y + box.h / 2);
    ctx.rotate((opts.tilt || 0) * Math.PI / 180 * (S.reduced ? 1 : E().out(p)));
    var x = -box.w / 2, y = -box.h / 2;
    ctx.beginPath();
    ctx.moveTo(x + cut, y);
    ctx.lineTo(x + box.w - cut, y);
    ctx.lineTo(x + box.w, y + cut);
    ctx.lineTo(x + box.w, y + box.h);
    ctx.lineTo(x, y + box.h);
    ctx.lineTo(x, y + cut);
    ctx.closePath();
    ctx.fillStyle = role(opts.role || 'accent-8');
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = role('ink');
    ctx.stroke();
    var holes = opts.holes == null ? 1 : opts.holes;
    for (var i = 0; i < holes; i++) {
      var hx = holes === 1 ? x + box.w / 2 : x + 18 + i * 16;
      if (opts.holeLeft) hx = x + 18 + i * 16;
      ctx.beginPath();
      ctx.arc(hx, y + 12, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = role('ground');
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();
    return { x: box.x, y: box.y, w: box.w, h: box.h };
  };

  // ---------- píldora (S11) ----------
  S.pill = function (ctx, box, opts) {
    opts = opts || {};
    var p = opts.p == null ? 1 : opts.p;
    if (p <= 0) return;
    ctx.save();
    ctx.globalAlpha *= appear('fade', p).alpha;
    ctx.beginPath();
    roundRect(ctx, box.x, box.y, box.w, box.h, box.h / 2);
    if (opts.role) { ctx.fillStyle = role(opts.role); ctx.fill(); }
    if (opts.outline) { ctx.lineWidth = opts.outlineWidth || 1.6; ctx.strokeStyle = role(opts.outline); ctx.stroke(); }
    ctx.restore();
  };

  // ---------- disco de ordinal (S11) ----------
  S.numeralDisc = function (ctx, opts) {
    var a = appear('illus', opts.p == null ? 1 : opts.p);
    if (a.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.fillStyle = role('accent-7');
    ctx.beginPath();
    ctx.arc(opts.x, opts.y, opts.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    text(ctx, opts.text, { x: opts.x, y: opts.y, size: Math.round(opts.r * 0.6), weight: 700, role: 'ground', align: 'center', baseline: 'middle', p: opts.p });
  };

  // ---------- panel de mapa (polo B, S7, S11) ----------
  // Devuelve la caja interior. Llama a opts.draw(inner) con recorte si se da.
  S.mapPanel = function (ctx, box, opts) {
    opts = opts || {};
    var p = opts.p == null ? 1 : opts.p;
    var inner = { x: box.x + 12, y: box.y + (opts.title ? 40 : 12), w: box.w - 24, h: box.h - (opts.title ? 52 : 24) };
    if (p <= 0) return inner;
    var a = appear('fade', E().clamp(p / 0.6));
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.fillStyle = role('machine-ground');
    ctx.beginPath();
    roundRect(ctx, box.x, box.y, box.w, box.h, 9);
    ctx.fill();
    if (opts.grid !== false) {
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, box.x, box.y, box.w, box.h, 9);
      ctx.clip();
      ctx.strokeStyle = role('machine-grid');
      ctx.lineWidth = 1;
      ctx.globalAlpha *= E().clamp((p - 0.2) / 0.5);
      ctx.beginPath();
      for (var gx = box.x + 16; gx < box.x + box.w; gx += 16) { ctx.moveTo(gx + 0.5, box.y); ctx.lineTo(gx + 0.5, box.y + box.h); }
      for (var gy = box.y + 16; gy < box.y + box.h; gy += 16) { ctx.moveTo(box.x, gy + 0.5); ctx.lineTo(box.x + box.w, gy + 0.5); }
      ctx.stroke();
      ctx.restore();
    }
    if (opts.title) {
      text(ctx, opts.title, { x: box.x + 16, y: box.y + 28, size: 15, face: 'display', role: 'on-dark' });
    }
    ctx.restore();
    if (opts.draw) {
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, box.x, box.y, box.w, box.h, 9);
      ctx.clip();
      opts.draw(inner, E().clamp((p - 0.3) / 0.7));
      ctx.restore();
    }
    return inner;
  };

  S.mapLine = function (ctx, path, opts) {
    opts = opts || {};
    if (opts.glow) {
      stroke(ctx, path, { role: 'machine-glow-1', alpha: 0.3, width: (opts.weight || 1.5) + 6, p: opts.p, dash: opts.dashed ? [7, 6] : null });
    }
    stroke(ctx, path, { role: opts.role || 'machine-line', width: opts.weight || 1.5, p: opts.p, dash: opts.dashed ? [7, 6] : null, offset: opts.offset });
  };

  // Etiqueta pequeña del polo B (mono, mayúsculas, on-dark).
  S.mapLabel = function (ctx, str, x, y, opts) {
    opts = opts || {};
    return text(ctx, str, { x: x, y: y, size: opts.size || 13, face: 'display', role: 'on-dark', align: opts.align, p: opts.p, maxWidth: opts.maxWidth });
  };

  // ---------- agua (S11) ----------
  S.water = function (ctx, path, opts) {
    opts = opts || {};
    var p = opts.p == null ? 1 : opts.p;
    if (p <= 0) return;
    stroke(ctx, path, { role: 'accent-2', width: opts.width || 10, p: p });
    if (p >= 1) {
      var t = S.reduced ? 0 : (opts.t || 0);
      stroke(ctx, path, { role: 'paper', alpha: 0.75, width: 1.5, dash: [16, 120], offset: -t * 14 });
    }
  };

  // ---------- árbol (S11) ----------
  S.tree = function (ctx, opts) {
    var x = opts.x, y = opts.y, s = opts.size || 40;
    var r = rngF(opts.seed || 2);
    var kind = opts.kind || 'round';
    var sway = (!S.reduced && opts.t != null) ? Math.sin(opts.t * 0.8 + (opts.seed || 0)) * Math.PI / 180 : 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha *= opts.alpha == null ? 1 : opts.alpha;
    // tronco
    ctx.fillStyle = role('ink');
    ctx.fillRect(-s * 0.05, -s * 0.55, s * 0.1, s * 0.55);
    ctx.translate(0, -s * 0.55);
    ctx.rotate(sway);
    var crown = opts.role || (kind === 'dense' ? 'accent-7' : 'accent-6');
    ctx.fillStyle = role(crown);
    ctx.beginPath();
    if (kind === 'scalloped') {
      var n = 6;
      for (var i = 0; i < n; i++) {
        var a = (i / n) * Math.PI * 2;
        ctx.moveTo(Math.cos(a) * s * 0.3 + s * 0.22, -s * 0.38 + Math.sin(a) * s * 0.3);
        ctx.arc(Math.cos(a) * s * 0.3, -s * 0.38 + Math.sin(a) * s * 0.28, s * 0.22, 0, Math.PI * 2);
      }
      ctx.moveTo(s * 0.3, -s * 0.38);
      ctx.arc(0, -s * 0.38, s * 0.3, 0, Math.PI * 2);
    } else if (kind === 'dense') {
      ctx.ellipse(0, -s * 0.42, s * 0.3, s * 0.48, 0, 0, Math.PI * 2);
    } else {
      ctx.arc(0, -s * 0.36, s * 0.4, 0, Math.PI * 2);
    }
    ctx.fill();
    // sombra plana de la copa (segundo tono)
    ctx.save();
    ctx.clip();
    ctx.fillStyle = role(crown === 'accent-6' ? 'accent-7' : 'ink', crown === 'accent-6' ? 1 : 0.25);
    ctx.beginPath();
    ctx.arc(s * 0.22, -s * 0.2, s * 0.42, 0, Math.PI * 2);
    ctx.fill();
    if (opts.stipple !== false && s >= 30) {
      var tex = S.texture('stipple', 64, 64, 9);
      ctx.drawImage(tex, -s * 0.6, -s * 1.0, s * 1.2, s * 1.2);
    }
    ctx.restore();
    // nervadura
    ctx.strokeStyle = role('ink');
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -s * 0.28);
    ctx.moveTo(0, -s * 0.16);
    ctx.lineTo(s * 0.1 * r.sign(), -s * 0.26);
    ctx.stroke();
    ctx.restore();
  };

  // ---------- edificios (S11) ----------
  // kind: casa | bloque | torre | cabecera
  S.building = function (ctx, box, opts) {
    opts = opts || {};
    var r = rngF(opts.seed || 4);
    var x = box.x, y = box.y, w = box.w, h = box.h;
    var body = opts.role || (opts.kind === 'casa' ? 'accent-4' : 'ground-2');
    ctx.save();
    ctx.globalAlpha *= opts.alpha == null ? 1 : opts.alpha;
    if (opts.kind === 'casa' || opts.kind === 'cabecera') {
      var roofH = h * 0.38;
      ctx.fillStyle = role(body);
      ctx.fillRect(x, y + roofH, w, h - roofH);
      ctx.fillStyle = role(opts.roof || 'accent-7');
      ctx.beginPath();
      ctx.moveTo(x - w * 0.08, y + roofH);
      ctx.lineTo(x + w / 2, y);
      ctx.lineTo(x + w * 1.08, y + roofH);
      ctx.closePath();
      ctx.fill();
      // ventana y puerta
      ctx.strokeStyle = role('ink');
      ctx.lineWidth = 1.2;
      var ww = w * 0.24;
      ctx.strokeRect(x + w * 0.16, y + roofH + (h - roofH) * 0.2, ww, ww);
      ctx.beginPath();
      ctx.moveTo(x + w * 0.16 + ww / 2, y + roofH + (h - roofH) * 0.2);
      ctx.lineTo(x + w * 0.16 + ww / 2, y + roofH + (h - roofH) * 0.2 + ww);
      ctx.stroke();
      ctx.fillStyle = role('ink');
      ctx.fillRect(x + w * 0.6, y + h - (h - roofH) * 0.55, w * 0.2, (h - roofH) * 0.55);
    } else {
      ctx.fillStyle = role(body);
      ctx.beginPath();
      roundRect(ctx, x, y, w, h, 2);
      ctx.fill();
      ctx.fillStyle = role('ink-soft', 0.18);
      ctx.fillRect(x + w * 0.72, y, w * 0.28, h);
      var cols = Math.max(2, Math.round(w / 14)), rows = Math.max(2, Math.round(h / 18));
      ctx.strokeStyle = role('ink');
      ctx.lineWidth = 1.1;
      var cw = w / (cols + 1), rh = h / (rows + 1);
      for (var i = 0; i < cols; i++) for (var j = 0; j < rows; j++) {
        if (opts.kind === 'torre' || r() > 0.15) ctx.strokeRect(x + cw * (i + 0.7), y + rh * (j + 0.6), cw * 0.6, rh * 0.5);
      }
    }
    ctx.restore();
  };

  // ---------- vida ambiental (style S2, S5) ----------
  S.ambient = function (ctx, sceneType, t, seed, zones) {
    if (sceneType === 'figure' || sceneType === 'compare' || sceneType === 'card') return;
    var W = 1280;
    if (sceneType === 'title' || sceneType === 'hero') return; // las nubes ya están en el fondo
    if (sceneType === 'explain' || sceneType === 'dialogue') {
      S.clouds(ctx, { x: 0, y: 30, w: W, h: 120 }, { seed: (seed || 1) + 31, count: sceneType === 'dialogue' ? 2 : 1, t: t, zones: zones, role: 'paper', size: 90 });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
