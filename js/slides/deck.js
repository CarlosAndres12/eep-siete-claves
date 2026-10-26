/* Diapositivas en vivo (spec §4.5), dibujadas en un lienzo de 1280×720: título en rotulación, mensaje en letra de
   cuerpo, tarjetas de cifra, un signo del curso como diagrama y notas del presentador (fuera del lienzo). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var W = 1280, M = 72;

  function data() { return EEP.data.slides; }
  function item(id) { return data().items.filter(function (s) { return s.id === id; })[0]; }
  function punto(n) { return EEP.data.puntos.filter(function (p) { return p.n === n; })[0]; }
  function message(n, id) { return (EEP.data.messages[n] || []).filter(function (m) { return m.id === id; })[0]; }
  function sceneTexts(vid, sid) {
    var v = EEP.engine.stage.videoData(vid);
    var s = v && v.scenes.filter(function (x) { return x.id === sid; })[0];
    return (s && s.texts) || {};
  }
  function textsMatching(vid, sid, keys) {
    var t = sceneTexts(vid, sid), out = [];
    keys.forEach(function (k) { if (t[k]) out.push(t[k]); });
    return out;
  }

  // Lista ordenada de diapositivas de un mazo: título, mensajes, cierre.
  function deckSlides(key) {
    var d = data().decks[key];
    if (!d) return [];
    return [key + '-titulo'].concat(d.slides, [key + '-cierre']);
  }

  // Texto plano del mensaje con las cifras en su forma del sitio.
  function plainMessage(m) {
    return EEP.util.plain(m.text, function (id) { var f = EEP.engine.cards.fig(id); return f ? f.partes[0].valor : ''; })
      .replace(/^(\p{Ll})/u, function (c) { return c.toUpperCase(); });
  }

  // ---------- diagramas ----------
  function diagram(ctx, name, box, sl) {
    var S = EEP.style, C = EEP.course;
    var base = name.split(',')[0].trim().replace(/\s+/g, '-');
    var variant = (name.split(',')[1] || '').trim().replace(/\s+/g, '-');
    var cx = box.x + box.w / 2, by = box.y + box.h;
    switch (base) {
      case 'valle-corte':
        C.valleCorte(ctx, { x: box.x, y: box.y + box.h * 0.35, w: box.w, h: box.h * 0.55 }, {
          fill: variant === 'corregimiento-bands' ? { corregimientos: 'stripes' } : variant === 'rural-band' ? { rural: 'stripes' } : variant === 'edge' ? { borde: 'stripes' } : (sl && /^(2\.2|5\.2|5\.3)$/.test(sl.id) ? { ladera: 'dots' } : {})
        });
        break;
      case 'valle-planta':
        S.mapPanel(ctx, box, { draw: function (inner) { C.vallePlanta(ctx, inner, {}); } });
        break;
      case 'clasificador-coberturas':
        S.mapPanel(ctx, box, { draw: function (inner) { C.clasificador(ctx, { x: inner.x + inner.w * 0.35, y: inner.y + inner.h * 0.62, size: inner.h * 0.5, cards: [1, 2, 3], cells: [], cellsP: 0 }); } });
        break;
      case 'muestreo': if (C.muestreo) C.muestreo(ctx, box, { p: 1 }); break;
      case 'the-lamp-beside-a-lupa': C.stampSigns['lampara-lupa'](ctx, cx, by - 20, box.h * 0.7); break;
      case 'corredor':
        var hb = { x: box.x, y: box.y, w: box.w, h: box.h * 0.46 };
        S.mapPanel(ctx, hb, { draw: function (inner) { C.corredorDibujado(ctx, inner, {}); } });
        C.corredorTerritorio(ctx, { x: box.x, y: box.y + box.h * 0.52, w: box.w, h: box.h * 0.48 }, {});
        break;
      case 'the-satellite':
      case 'the-satellite-and-a-pin':
        S.mapPanel(ctx, box, { draw: function (inner) {
          C.sateliteCruce(ctx, inner, { k: 0.45 });
          if (base === 'the-satellite-and-a-pin') S.sign(ctx, 'pin', { x: inner.x + inner.w * 0.6, y: inner.y + inner.h * 0.8, size: 40, role: 'machine-glow-1', hole: 'machine-ground' });
        } });
        break;
      case 'stamp-ia': case 'stamp-insumo': C.stamp(ctx, base, box.x, box.y + box.h * 0.3, { w: box.w }); break;
      case 'arboleda': case 'ave': case 'canasta': case 'carretilla':
        S.sign(ctx, base, { x: cx, y: by - 20, size: Math.min(box.w, box.h) * 0.55 }); break;
      case 'casa-group':
        for (var i = 0; i < 5; i++) S.building(ctx, { x: box.x + 30 + i * 70, y: by - 120 - (i % 2) * 20, w: 60, h: 60 }, { kind: 'casa', roof: i % 2 ? 'accent-5' : 'accent-7' });
        break;
      case 'casa-on-a-slope':
        S.fill(ctx, [[box.x, by], [box.x + box.w, by - box.h * 0.6], [box.x + box.w, by]], { role: 'accent-6' });
        S.patternFill(ctx, [[box.x, by], [box.x + box.w, by - box.h * 0.6], [box.x + box.w, by]], 'dots', {});
        S.building(ctx, { x: box.x + box.w * 0.55, y: by - box.h * 0.5, w: 70, h: 70 }, { kind: 'casa' });
        break;
      case 'casa-with-tags':
        S.building(ctx, { x: cx - 60, y: by - 160, w: 120, h: 120 }, { kind: 'casa' });
        [[-150, -200], [100, -220], [-170, -60], [120, -80]].forEach(function (d) { S.tagCard(ctx, { x: cx + d[0], y: by + d[1], w: 60, h: 40 }, { tilt: 3 }); });
        break;
      case 'people-at-a-table':
        var ex = (EEP.engine.stage.castEntry('extra-5') || {}).people || [];
        ex.forEach(function (lk, k) { S.person(ctx, lk, { pose: 'seated', x: box.x + 60 + k * (box.w - 120) / 3, y: by - 10, height: box.h * 0.6, chair: false }); });
        S.fill(ctx, S.rectPath(box.x + 10, by - box.h * 0.26, box.w - 20, 16, 4), { role: 'accent-7' });
        break;
      case 'a-truck-pictogram': C.signs.camion(ctx, cx, by - 30, box.h * 0.45); break;
      case 'predios': C.predios(ctx, { x: box.x, y: box.y + 20, w: box.w, h: box.h - 60 }, {}); break;
      case 'retiro':
        C.retiro(ctx, box, { scale: { from: 0, to: 30, step: 5, unit: 'm' }, bands: [{ m: 10, pattern: 'dots' }, { m: 15, pattern: 'dots' }, { m: 30, pattern: 'stripes' }] });
        break;
      case 'embalses': C.embalses(ctx, box, { labels: textsMatching('v2', 'm7', ['t2', 't3', 't4']) }); break;
      case 'contradicciones':
        C.contradicciones(ctx, box, { cards: textsMatching('v2', 'm8', ['t2', 't3', 't4', 't5', 't6', 't7']), center: sceneTexts('v2', 'm8').t8, linksP: 1 });
        break;
      case 'escalas': C.escalas(ctx, box, {}); break;
      case 'capas': C.capas(ctx, box, {}); break;
      case 'documento': C.signs.documento(ctx, cx, by - 20, box.h * 0.75); break;
      case 'triada': if (C.triada) C.triada(ctx, box, slideTriada()); break;
      case 'ruta-2040': if (C.ruta2040) C.ruta2040(ctx, box, { labels: textsMatching('v9', 'ruta', ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8']), p: 1, labelSize: 13 }); break;
      case 'subsistemas': if (C.subsistemas) C.subsistemas(ctx, box, { labels: textsMatching('v9', 'subsistemas', ['t1', 't2', 't3', 't4', 't5']), p: 1, core: [0, 1], coreP: 1, coreLabel: sceneTexts('v9', 'subsistemas').t6, labelSize: 14 }); break;
    }
  }
  function slideTriada() {
    // etiquetas del signo `triada` tomadas de la escena de V7 que lo presenta (t1–t4)
    var t = sceneTexts('v7', 'triada');
    return { p: 1, labels: [t.t1, t.t2, t.t3], center: t.t4, centerP: 1, badge: EEP.data.site.ui.esquema };
  }

  // ---------- render ----------
  function renderSlide(ctx, id, t) {
    var S = EEP.style;
    ctx.save();
    ctx.setTransform(ctx.__dpr || 1, 0, 0, ctx.__dpr || 1, 0, 0);
    var m = /^(\d[ABC]?)-(titulo|cierre)$/.exec(id);
    if (m) {
      var d = data().decks[m[1]];
      var p = punto(d.punto);
      var tab = d.tab && p.tabs ? p.tabs.filter(function (x) { return x.id === d.tab; })[0] : null;
      S.background(ctx, 'title', { seed: 21 + d.punto });
      if (m[2] === 'titulo') {
        S.text(ctx, 'Punto ' + d.punto + (tab ? ' · ' + tab.label : ''), { x: M, y: 150, size: 26, face: 'display', role: 'accent-1' });
        S.title(ctx, p.card.title, { x: M, y: 250, size: 72, maxWidth: 1100 });
        S.text(ctx, String.fromCharCode(171) + p.request + String.fromCharCode(187), { x: M, y: 430, size: 26, role: 'on-dark', maxWidth: 1000, italic: true, lineHeight: 1.35 });
        var fac = EEP.data.site.facilitador;
        if (fac) S.text(ctx, EEP.data.views.modoClase.facilita + fac, { x: M, y: 560, size: 24, role: 'on-dark' });
        EEP.course.stamp(ctx, 'stamp-insumo', 860, 560, { w: 360 });
      } else {
        var mt = sceneTexts(d.motto.video, EEP.engine.stage.videoData(d.motto.video).scenes.slice(-1)[0].id)[d.motto.key];
        S.title(ctx, mt, { x: M, y: 220, size: 56, maxWidth: 1100 });
        S.text(ctx, 'Fuente: ' + EEP.data.site.obligatorySource, { x: M, y: 560, size: 18, role: 'on-dark', maxWidth: 1130, lineHeight: 1.35 });
      }
      ctx.restore();
      return;
    }
    var sl = item(id);
    if (!sl) { ctx.restore(); return; }
    var msg = message(sl.punto, sl.message);
    ctx.fillStyle = S.role('ground'); ctx.fillRect(0, 0, W, 720);
    S.labelBar(ctx, sl.title, { x: M, y: 48, size: 30, maxWidth: 1136 });
    var txt = msg ? plainMessage(msg) : '';
    var hasFigs = sl.figs.length > 0;
    var r = S.text(ctx, txt, { x: M, y: 160, size: hasFigs ? 26 : 30, maxWidth: hasFigs ? 600 : 620, lineHeight: 1.35 });
    var y = 160 + r.height;
    if (msg && msg.matiz) {
      S.mark(ctx, 'badge', { x: M, y: y + 4 }, { text: EEP.data.site.ui.conMatiz, variant: 'state', glyph: 'g-matiz', size: 14 });
      S.text(ctx, msg.matiz, { x: M, y: y + 66, size: 18, role: 'ink', maxWidth: 600, lineHeight: 1.3 });
    }
    if (hasFigs) {
      var n = sl.figs.length;
      var cols = n > 2 ? 2 : 1, cw = cols > 1 ? 270 : 520, x0 = 700, top = 120, gap = 12;
      var colY = [top, top], place = [];
      sl.figs.forEach(function (fid) {
        var c = colY[0] <= colY[1] || cols === 1 ? 0 : 1;
        var hh = EEP.engine.cards.measure(ctx, fid, { w: cw, compact: true, maxHead: cols > 1 ? 30 : 44 }).h;
        place.push({ id: fid, x: x0 + c * (cw + 14), y: colY[c] });
        colY[c] += hh + gap;
      });
      var bottom = Math.max(colY[0], cols > 1 ? colY[1] : 0) - gap;
      var k = bottom > 700 ? (700 - top) / (bottom - top) : 1;
      ctx.save();
      ctx.translate(x0, top); ctx.scale(k, k); ctx.translate(-x0, -top);
      place.forEach(function (pl) { EEP.engine.cards.draw(ctx, pl.id, { x: pl.x, y: pl.y, w: cw, compact: true, maxHead: cols > 1 ? 30 : 44 }); });
      ctx.restore();
      diagram(ctx, sl.diagram, { x: M, y: 470, w: 560, h: 220 }, sl);
    } else {
      diagram(ctx, sl.diagram, { x: 720, y: 130, w: 500, h: 460 }, sl);
    }
    ctx.restore();
  }

  // Notas del presentador: cita del mensaje y viñetas de «Para leer bien estas cifras» que mencionan sus cifras.
  function notes(id) {
    var sl = item(id);
    if (!sl) return [];
    var msg = message(sl.punto, sl.message);
    var out = msg ? [msg.fuentes.join(' ')] : [];
    var p = punto(sl.punto);
    var bullets = (p.bullets || []).slice();
    (p.tabs || []).forEach(function (t) { bullets = bullets.concat(t.bullets); });
    bullets.forEach(function (b) {
      if (sl.figs.some(function (f) { return b.indexOf('{fig:' + f + '}') >= 0; })) out.push(EEP.util.plain(b, function (fid) { var f = EEP.engine.cards.fig(fid); return f ? f.partes[0].valor : ''; }));
    });
    return out;
  }

  EEP.slides.renderSlide = renderSlide;
  EEP.slides.deckSlides = deckSlides;
  EEP.slides.notes = notes;
  EEP.slides.item = item;
})(typeof window !== 'undefined' ? window : globalThis);
