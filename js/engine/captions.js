/* Subtítulos: troceo (función pura del texto, compartida con las herramientas) y banda de subtítulos (base §2.4).
   La parte de troceo no toca el DOM ni un lienzo al cargarse. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var MAX = 84;
  var CONJ = ['y', 'e', 'o', 'u', 'ni', 'pero', 'que', 'aunque', 'porque', 'sino', 'mientras', 'donde', 'como', 'cuando', 'para', 'con', 'sin', 'según'];

  // Rangos protegidos: citas «…», comillas “…” y "…", números con separadores (1.358,25 · 14–15 % · 2017–2024).
  function protectedRanges(s) {
    var r = [], m;
    var re = /«[^»]*»|“[^”]*”|"[^"]*"|\d[\d.,–\-]*\d(?:\s?%)?|\d\s?%/g;
    while ((m = re.exec(s))) r.push([m.index, m.index + m[0].length]);
    return r;
  }
  function inside(pos, ranges) {
    for (var i = 0; i < ranges.length; i++) if (pos > ranges[i][0] && pos < ranges[i][1]) return true;
    return false;
  }

  // Candidatos de corte (posición donde empieza el trozo siguiente), por prioridad.
  function candidates(s, cls) {
    var out = [], m, re;
    var prot = protectedRanges(s);
    if (cls === 0) re = /[.?!…»](?=\s+[«¿¡"“A-ZÁÉÍÓÚÑ0-9])/g;
    else if (cls === 1) re = /[;:](?=\s)/g;
    else if (cls === 2) re = /,(?=\s)/g;
    else if (cls === 3) re = new RegExp('\\s(?=(?:' + CONJ.join('|') + ')\\s)', 'g');
    else re = /\s/g;
    while ((m = re.exec(s))) {
      var cut = cls >= 3 ? m.index : m.index + m[0].length;
      if (cut <= 0 || cut >= s.length) continue;
      if (inside(m.index, prot)) continue;
      out.push(cut);
    }
    return out;
  }

  function splitPiece(s, minCls) {
    s = s.trim();
    if (!s) return [];
    if (s.length <= MAX && minCls > 0) return [s];
    for (var cls = minCls; cls <= 4; cls++) {
      var c = candidates(s, cls);
      if (cls === 0) {
        if (!c.length) continue;
        var parts = [], last = 0;
        c.forEach(function (k) { parts.push(s.slice(last, k)); last = k; });
        parts.push(s.slice(last));
        return parts.reduce(function (acc, part) { return acc.concat(splitPiece(part, 1)); }, []);
      }
      if (!c.length) continue;
      // el corte más cercano a la mitad que deje ambos lados con contenido
      var mid = s.length / 2, best = -1, bd = 1e9;
      c.forEach(function (k) {
        var d = Math.abs(k - mid);
        var a = s.slice(0, k).trim(), b = s.slice(k).trim();
        if (a.length < 8 || b.length < 8) d += 500;
        if (d < bd) { bd = d; best = k; }
      });
      if (best > 0) return splitPiece(s.slice(0, best), cls).concat(splitPiece(s.slice(best), cls));
    }
    return [s];
  }

  // chunk(text) → [trozos] de 84 caracteres como máximo, en orden.
  function chunk(text) {
    var s = String(text || '').replace(/\s+/g, ' ').trim();
    if (!s) return [];
    return splitPiece(s, 0).map(function (x) { return x.trim(); }).filter(Boolean);
  }

  // ---------- banda (dibujo) ----------
  var wrapCache = {};
  function bandLines(ctx, speaker, text, maxW) {
    var S = EEP.style;
    var k = (speaker || '') + '|' + text + '|' + maxW;
    if (wrapCache[k]) return wrapCache[k];
    var fBody = S.font('body', 30, 500), fName = S.font('body', 30, 700);
    var nameW = speaker ? S.measure(ctx, speaker + ': ', fName) : 0;
    var words = text.split(' ');
    var lines = [], cur = '', curW = nameW, first = true;
    words.forEach(function (w) {
      var t = cur ? cur + ' ' + w : w;
      var tw = S.measure(ctx, t, fBody) + (first ? nameW : 0);
      if (!cur || tw <= maxW) cur = t;
      else { lines.push({ text: cur, name: first ? speaker : null }); first = false; cur = w; }
    });
    if (cur) lines.push({ text: cur, name: first ? speaker : null });
    wrapCache[k] = lines;
    return lines;
  }

  // drawBand(ctx, { speaker, text, alpha }) — la banda crece a 3 líneas antes que encoger el texto.
  function drawBand(ctx, o) {
    var S = EEP.style;
    if (!o || !o.text) return;
    var maxW = 1280 - 2 * 120;
    var lines = bandLines(ctx, o.speaker, o.text, maxW);
    var lh = 40;
    var h = lines.length * lh + 26;
    var y = 720 - h - 14;
    ctx.save();
    ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
    ctx.fillStyle = S.role('dark', 0.9);
    ctx.beginPath();
    S.roundRect(ctx, 96, y, 1280 - 192, h, 6);
    ctx.fill();
    ctx.textBaseline = 'alphabetic';
    if ('fontVariantNumeric' in ctx) { try { ctx.fontVariantNumeric = 'tabular-nums'; } catch (e) {} }
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    lines.forEach(function (l, i) {
      var fBody = S.font('body', 30, 500), fName = S.font('body', 30, 700);
      var nameStr = l.name ? l.name + ': ' : '';
      var tw = S.measure(ctx, l.text, fBody) + (nameStr ? S.measure(ctx, nameStr, fName) : 0);
      var x = 640 - tw / 2;
      var yy = y + 13 + 30 + i * lh;
      ctx.fillStyle = S.role('on-dark');
      if (nameStr) { ctx.font = fName; ctx.fillText(nameStr, x, yy); x += S.measure(ctx, nameStr, fName); }
      ctx.font = fBody;
      ctx.fillText(l.text, x, yy);
    });
    ctx.restore();
    return { y: y, h: h };
  }

  EEP.engine.captions = { MAX: MAX, chunk: chunk, drawBand: drawBand, clearCache: function () { wrapCache = {}; } };
})(typeof window !== 'undefined' ? window : globalThis);
