/* Tarjetas de cifra en el lienzo (base §5.2): cifra, alcance, insignia de tipo, ficha de escala y fuente.
   El marco se dibuja primero (marca `card`); la cifra aparece entera con p ≥ 0,6 y nunca cuenta. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var S = function () { return EEP.style; };

  var TYPE_GLYPH = {
    'Resultado del estudio': 'g-resultado',
    'Preliminar (prediagnóstico)': 'g-preliminar',
    'Ilustrativo': 'g-ilustrativo',
    'Teórico o potencial': 'g-teorico',
    'Propuesta del estudio': 'g-propuesta',
    'Norma vigente': 'g-norma',
    'Decisión judicial': 'g-judicial',
    'Fuente secundaria': 'g-secundaria'
  };

  function fig(id) {
    var list = EEP.data.figures || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function source(key) {
    var list = EEP.data.sources || [];
    for (var i = 0; i < list.length; i++) if (list[i].key === key) return list[i];
    return null;
  }
  function sourceLine(f) {
    var shorts = (f.fuentes || []).map(function (k) { var s = source(k); return s ? (s.corta || s.cita) : k; });
    return 'Fuente: ' + shorts.join(' · ');
  }

  // Ficha de escala: muestra, signo, etiqueta corta y contorno ink (base §1.5).
  function chip(ctx, escala, x, y, opts) {
    opts = opts || {};
    var st = S();
    var leg = EEP.engine.legend;
    var it = leg.item(escala);
    if (!it) return 0;
    var fl = leg.fillFor(escala);
    var h = opts.h || 30;
    var label = it.short || it.label;
    var f = st.font('body', opts.size || 15, 700);
    var tw = st.measure(ctx, label, f);
    var w = Math.round(h * 0.9 + h * 1.0 + tw + h * 0.55);
    if (opts.measureOnly) return w;
    ctx.save();
    ctx.globalAlpha *= opts.alpha == null ? 1 : opts.alpha;
    ctx.beginPath(); st.roundRect(ctx, x, y, w, h, 4);
    ctx.fillStyle = st.role('ground'); ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = st.role('ink'); ctx.stroke();
    // muestra de color con contorno ink de 2 px
    var sw = h - 10;
    ctx.beginPath(); st.roundRect(ctx, x + 5, y + 5, sw, sw, 3);
    if (fl.color) { ctx.fillStyle = fl.color; ctx.fill(); }
    else st.patternFill(ctx, st.rectPath(x + 5, y + 5, sw, sw, 3), fl.pattern, { ground: 'ground' });
    ctx.lineWidth = 2; ctx.strokeStyle = st.role('ink'); ctx.stroke();
    // signo
    if (EEP.course.legendSign) EEP.course.legendSign(ctx, escala, x + 5 + sw + 4 + h * 0.5, y + h - 6, h * 0.62);
    st.text(ctx, label, { x: x + 5 + sw + 8 + h, y: y + h / 2, size: opts.size || 15, weight: 700, baseline: 'middle' });
    ctx.restore();
    return w;
  }

  // Disposición de una tarjeta (medida una vez y guardada).
  var layoutCache = {};
  function layout(ctx, f, w, o) {
    var st = S();
    var key = f.id + '|' + w + '|' + (o.compact ? 1 : 0) + '|' + (o.scope ? 1 : 0) + '|' + (o.headline || '') + '|' + (o.only || '') + '|' + (o.maxHead || '');
    if (layoutCache[key]) return layoutCache[key];
    var pad = o.compact ? 16 : 22;
    var inner = w - pad * 2;
    var L = { pad: pad, rows: [], w: w };
    var y = pad;
    L.top = y;
    var chipW = chip(ctx, f.escala, 0, 0, { measureOnly: true });
    var badgeW = st.mark(ctx, 'badge', { x: 0, y: 0, h: 30 }, { text: f.tipo, variant: 'type', glyph: TYPE_GLYPH[f.tipo], size: 14, measureOnly: true });
    L.badgeRow2 = chipW + badgeW + 10 > inner;
    if (L.badgeRow2) { L.badgeY = y + 38; y += 38; }
    y += 32 + (o.compact ? 10 : 14);
    var partes = (f.partes || []).slice();
    if (o.only != null) partes = [partes[o.only]];
    var head = partes[0];
    var headSize = o.maxHead || (o.compact ? 44 : 64);
    var hf;
    while (headSize > 18) {
      hf = st.font('body', headSize, 700);
      if (st.measure(ctx, head.valor, hf) <= inner) break;
      headSize -= 2;
    }
    L.head = { text: head.valor, size: headSize, y: y + headSize * 0.82 };
    y += headSize * 1.02;
    var lblSize = o.compact ? 18 : 21;
    var lbl = st.text(ctx, head.etiqueta, { size: lblSize, maxWidth: inner, measureOnly: true });
    L.headLabel = { lines: lbl.lines, size: lblSize, y: y + lblSize * 0.95, lh: lbl.lineHeight };
    y += lbl.height + 6;
    partes.slice(1).forEach(function (pt) {
      var vs = o.compact ? 20 : 24;
      var vf = st.font('body', vs, 700);
      var vw = st.measure(ctx, pt.valor, vf);
      var below = vw > inner * 0.5;
      var rest = st.text(ctx, pt.etiqueta, { size: lblSize - 2, maxWidth: below ? inner : inner - vw - 10, measureOnly: true });
      var rowH = below ? vs * 1.15 + rest.height : Math.max(vs * 1.2, rest.height);
      L.rows.push({ valor: pt.valor, vs: vs, vw: vw, below: below, label: rest.lines, ls: lblSize - 2, lh: rest.lineHeight, y: y + vs * 0.95 });
      y += rowH + 4;
    });
    var showScope = o.scope || f.estado === 'Con matiz';
    if (showScope) {
      y += 8;
      L.scopeBadgeY = f.estado === 'Con matiz' ? y : null;
      if (L.scopeBadgeY != null) y += 28 + 8;
      var ss = o.compact ? 14 : 16;
      var sc = st.text(ctx, f.alcance, { size: ss, maxWidth: inner, measureOnly: true });
      L.scope = { lines: sc.lines, size: ss, y: y + ss * 0.95, lh: sc.lineHeight };
      y += sc.height + 4;
    }
    y += 8;
    var src = st.text(ctx, sourceLine(f), { size: o.compact ? 13 : 14, maxWidth: inner, measureOnly: true });
    L.source = { lines: src.lines, size: o.compact ? 13 : 14, y: y + 14, lh: src.lineHeight };
    y += src.height + pad - 2;
    L.h = Math.ceil(y);
    layoutCache[key] = L;
    return L;
  }

  // draw(ctx, id, { x, y, w, p, compact, scope, emphasize: 'scope'|'card'|null, emph (0–1), anchor: 'center' })
  // Devuelve la caja dibujada (zona de significado).
  function draw(ctx, id, o) {
    o = o || {};
    var st = S();
    var f = fig(id);
    if (!f) return null;
    var w = o.w || 560;
    var L = layout(ctx, f, w, o);
    var x = o.x, y = o.y;
    if (o.anchor === 'center') { x -= w / 2; y -= L.h / 2; }
    else if (o.anchor === 'bottom') { y -= L.h; }
    var box = { x: x, y: y, w: w, h: L.h };
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return box;
    ctx.save();
    if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    st.mark(ctx, 'card', box, { p: Math.min(1, p / 0.6), ground: o.ground });
    var cA = EEP.engine.ease.clamp((p - 0.45) / 0.15);
    if (st.reduced) cA = p > 0 ? 1 : 0;
    if (cA > 0) {
      ctx.save();
      ctx.globalAlpha *= cA;
      chip(ctx, f.escala, x + L.pad, y + L.top);
      if (L.badgeRow2) st.mark(ctx, 'badge', { x: x + L.pad, y: y + L.badgeY, h: 30 }, { text: f.tipo, variant: 'type', glyph: TYPE_GLYPH[f.tipo], size: 14 });
      else st.mark(ctx, 'badge', { x: x + w - L.pad, y: y + L.top + 1, h: 30 }, { text: f.tipo, variant: 'type', glyph: TYPE_GLYPH[f.tipo], align: 'right', size: 14 });
      ctx.restore();
    }
    // La cifra aparece entera con p ≥ 0,6.
    if (p >= 0.6 || st.reduced) {
      var emph = o.emph == null ? 1 : o.emph;
      st.text(ctx, L.head.text, { x: x + L.pad, y: y + L.head.y, size: L.head.size, weight: 700 });
      L.headLabel.lines.forEach(function (l, i) {
        st.text(ctx, l, { x: x + L.pad, y: y + L.headLabel.y + i * L.headLabel.lh, size: L.headLabel.size });
      });
      L.rows.forEach(function (r) {
        st.text(ctx, r.valor, { x: x + L.pad, y: y + r.y, size: r.vs, weight: 700 });
        r.label.forEach(function (l, i) {
          if (r.below) st.text(ctx, l, { x: x + L.pad, y: y + r.y + r.vs * 0.95 + i * r.lh, size: r.ls });
          else st.text(ctx, l, { x: x + L.pad + r.vw + 10, y: y + r.y - 2 + i * r.lh, size: r.ls });
        });
      });
      if (L.scope) {
        if (o.emphasize === 'scope' && emph > 0) {
          ctx.save();
          ctx.fillStyle = st.role('accent-8');
          ctx.globalAlpha *= emph;
          var top = (L.scopeBadgeY != null ? L.scopeBadgeY : L.scope.y - L.scope.size) - 6;
          ctx.fillRect(x + L.pad - 8, y + top, w - 2 * L.pad + 16, L.scope.y + (L.scope.lines.length - 1) * L.scope.lh + 10 - top);
          ctx.restore();
        }
        if (L.scopeBadgeY != null) st.mark(ctx, 'badge', { x: x + L.pad, y: y + L.scopeBadgeY, h: 28 }, { text: 'Con matiz', variant: 'state', glyph: 'g-matiz', size: 14, ground: 'ground-2' });
        L.scope.lines.forEach(function (l, i) {
          st.text(ctx, l, { x: x + L.pad, y: y + L.scope.y + i * L.scope.lh, size: L.scope.size, role: 'ink' });
        });
      }
      L.source.lines.forEach(function (l, i) {
        st.text(ctx, l, { x: x + L.pad, y: y + L.source.y + i * L.source.lh, size: L.source.size, role: 'ink-soft' });
      });
    }
    if (o.emphasize === 'card' && (o.emph || 0) > 0) {
      ctx.save();
      ctx.globalAlpha *= o.emph;
      ctx.lineWidth = 3; ctx.strokeStyle = st.role('ink');
      ctx.beginPath(); st.roundRect(ctx, x - 5, y - 5, w + 10, L.h + 10, 12); ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
    return box;
  }

  function measure(ctx, id, o) {
    var f = fig(id);
    if (!f) return { w: 0, h: 0 };
    var L = layout(ctx, f, (o && o.w) || 560, o || {});
    return { w: L.w, h: L.h };
  }

  // Tarjeta sin valores (spec §3.2): solo un título y una nota de una línea.
  function blank(ctx, o) {
    var st = S();
    var w = o.w || 460, pad = 24;
    var t = st.text(ctx, o.title || '', { size: 26, weight: 700, maxWidth: w - 2 * pad, measureOnly: true });
    var n = st.text(ctx, o.note || '', { size: 19, maxWidth: w - 2 * pad, measureOnly: true });
    var h = pad + t.height + 12 + n.height + pad;
    var x = o.anchor === 'center' ? o.x - w / 2 : o.x, y = o.anchor === 'center' ? o.y - h / 2 : o.y;
    var box = { x: x, y: y, w: w, h: h };
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return box;
    st.mark(ctx, 'card', box, { p: Math.min(1, p / 0.6) });
    if (p >= 0.6 || st.reduced) {
      st.text(ctx, o.title, { x: x + pad, y: y + pad + 22, size: 26, weight: 700, maxWidth: w - 2 * pad });
      st.text(ctx, o.note, { x: x + pad, y: y + pad + t.height + 12 + 16, size: 19, role: 'ink-soft', maxWidth: w - 2 * pad, lineHeight: 1.3 });
    }
    return box;
  }

  EEP.engine.cards = { draw: draw, measure: measure, blank: blank, chip: chip, fig: fig, source: source, sourceLine: sourceLine, TYPE_GLYPH: TYPE_GLYPH, clearCache: function () { layoutCache = {}; } };
})(typeof window !== 'undefined' ? window : globalThis);
