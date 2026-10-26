/* Vista #/inicio (spec §7.2): héroe silencioso, pregunta, alcance, cómo recorrer el sitio y la ruta de siete puntos. */
(function (root) {
  'use strict';
  var EEP = root.EEP, U = EEP.util, el = U.el, UI = EEP.ui;
  var HOME = function () { return EEP.data.home; };

  // Héroe: escena silenciosa sobre el fondo `hero` (entrada de 6 s y luego vida continua); sin texto en el lienzo. Movimiento reducido: cuadro fijo.
  function hero() {
    var c = el('canvas', { class: 'hero-canvas', width: 1280, height: 720, 'aria-hidden': 'true' });
    var ctx = c.getContext('2d');
    var raf = 0, t0 = performance.now();
    function frame(now) {
      var t = EEP.style.reduced ? 12 : (now - t0) / 1000;
      var w = c.clientWidth || 1280, dpr = Math.min(2, root.devicePixelRatio || 1);
      var bw = Math.round(w * dpr);
      if (c.width !== bw) { c.width = bw; c.height = Math.round(bw * 9 / 16); }
      ctx.setTransform(c.width / 1280, 0, 0, c.width / 1280, 0, 0);
      EEP.style.background(ctx, 'hero', { t: t, p: EEP.style.reduced ? 1 : Math.min(1, t / 6), seed: 21 });
      if (!EEP.style.reduced) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    var io = 'IntersectionObserver' in root ? new IntersectionObserver(function (en) {
      if (EEP.style.reduced) return;
      if (en[0].isIntersecting) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } else cancelAnimationFrame(raf);
    }) : null;
    if (io) io.observe(c);
    UI.cleanup = function () { cancelAnimationFrame(raf); if (io) io.disconnect(); };
    return c;
  }

  // Signo de cada punto en la tarjeta del recorrido, sobre un disco menta. (ctx, x, y, s) con base centrada en (x, y).
  var ROUTE_SIGNS = {
    1: function (ctx, x, y, s) { EEP.course.stampSigns['satelite-mancha'](ctx, x, y + s * 0.04, s * 1.1); },
    2: function (ctx, x, y, s) { EEP.course.stampSigns.documento(ctx, x, y - s * 0.02, s * 0.95); },
    3: function (ctx, x, y, s) {
      EEP.style.building(ctx, { x: x - s * 0.5, y: y - s * 0.62, w: s * 0.36, h: s * 0.62 }, { kind: 'torre', seed: 3 });
      EEP.style.sign(ctx, 'grua', { x: x + s * 0.1, y: y, size: s * 0.95 });
    },
    4: function (ctx, x, y, s) { EEP.course.stampSigns.corredor(ctx, x, y, s * 1.05); },
    5: function (ctx, x, y, s) {
      EEP.style.sign(ctx, 'colina', { x: x, y: y, size: s * 0.62 });
      EEP.course.stampSigns.triada(ctx, x, y - s * 0.32, s * 0.6);
    },
    6: function (ctx, x, y, s) {
      EEP.style.sign(ctx, 'canasta', { x: x - s * 0.12, y: y, size: s * 0.72 });
      EEP.style.sign(ctx, 'gota', { x: x + s * 0.34, y: y - s * 0.38, size: s * 0.5 });
    },
    7: function (ctx, x, y, s) {
      EEP.style.sign(ctx, 'flecha', { x: x - s * 0.05, y: y, size: s * 0.85, role: 'ink' });
      EEP.style.sign(ctx, 'pin', { x: x + s * 0.32, y: y - s * 0.56, size: s * 0.42, hole: 'accent-8' });
    }
  };
  function routeIcon(n) {
    var draw = ROUTE_SIGNS[n];
    return UI.canvasIcon(72, 72, function (ctx) {
      EEP.style.fill(ctx, EEP.style.circlePath(36, 36, 34), { role: 'accent-8' });
      EEP.style.stroke(ctx, EEP.style.circlePath(36, 36, 34), { role: 'ink', width: 1.2 });
      if (draw) draw(ctx, 36, 58, 42);
    });
  }

  function videoLength(ids) {
    var total = 0, all = true;
    ids.forEach(function (id) {
      var m = EEP.audioManifest && EEP.audioManifest[id];
      if (m && m.duration) total += m.duration;
      else { all = false; var v = EEP.engine.stage.videoData(id); total += EEP.engine.timeline.build(v, { cast: EEP.data.cast }).duration; }
    });
    return (all ? '' : '≈ ') + U.fmtTime(total);
  }

  UI.home = function (main) {
    UI.setTitle('');
    main.appendChild(el('div', { class: 'hero band-dark' }, [hero()]));
    var wrap = el('div', { class: 'container' });
    wrap.appendChild(el('p', { class: 'eyebrow', text: HOME().eyebrow }));
    wrap.appendChild(el('h1', { text: HOME().h1 }));
    wrap.appendChild(el('p', { class: 'dek', text: HOME().dek }));
    wrap.appendChild(el('div', { class: 'card card-pad question-card' }, [el('h2', { text: HOME().questionTitle }), el('p', { class: 'big', text: HOME().question })]));
    wrap.appendChild(el('div', { class: 'scope-note' }, [UI.stampEl('stamp-insumo'), el('p', { text: HOME().scope })]));
    wrap.appendChild(UI.section(HOME().howTitle, [el('ul', {}, HOME().how.map(function (t) { return el('li', { text: t }); }))]));
    var grid = el('ol', { class: 'route-grid' });
    EEP.data.puntos.forEach(function (p) {
      grid.appendChild(el('li', { class: 'card card-pad route-card' }, [
        el('div', { class: 'route-head' }, [routeIcon(p.n), el('div', {}, [
          el('p', { class: 'eyebrow', text: 'Punto ' + p.n }),
          el('h3', { text: p.card.title })])]),
        el('p', { text: p.card.line }),
        el('p', { class: 'route-len', text: (p.videos.length > 1 ? p.videos.length + ' videos · ' : 'Video · ') + videoLength(p.videos) }),
        el('a', { class: 'btn', href: p.route, html: '<span aria-hidden="true">→ </span>Ver el punto', 'aria-label': 'Ver el punto ' + p.n + ': ' + p.card.title })
      ]));
    });
    wrap.appendChild(UI.section(HOME().routeTitle, [grid]));
    var more = el('p', { class: 'more-links' });
    HOME().more.forEach(function (m, i) { more.appendChild(el('a', { href: m[0], text: m[1] })); if (i < HOME().more.length - 1) more.appendChild(document.createTextNode(' · ')); });
    wrap.appendChild(more);
    main.appendChild(wrap);
  };
})(window);
