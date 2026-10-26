/* Vista #/inicio (spec §7.2): héroe silencioso, pregunta, alcance, cómo recorrer el sitio y la ruta de siete puntos. */
(function (root) {
  'use strict';
  var EEP = root.EEP, U = EEP.util, el = U.el, UI = EEP.ui;
  var HOME = function () { return EEP.data.home; };

  // Héroe: lazo silencioso de 20 s sobre el fondo `hero`; sin texto en el lienzo. Movimiento reducido: cuadro fijo.
  function hero() {
    var c = el('canvas', { class: 'hero-canvas', width: 1280, height: 720, 'aria-hidden': 'true' });
    var ctx = c.getContext('2d');
    var raf = 0, t0 = performance.now();
    function frame(now) {
      var t = EEP.style.reduced ? 12 : ((now - t0) / 1000) % 20;
      var w = c.clientWidth || 1280, dpr = Math.min(2, root.devicePixelRatio || 1);
      var bw = Math.round(w * dpr);
      if (c.width !== bw) { c.width = bw; c.height = Math.round(bw * 9 / 16); }
      ctx.setTransform(c.width / 1280, 0, 0, c.width / 1280, 0, 0);
      EEP.style.background(ctx, 'hero', { t: t, p: EEP.style.reduced ? 1 : Math.min(1, t / 14), seed: 21 });
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
      grid.appendChild(el('li', { class: 'card route-card' }, [
        el('p', { class: 'eyebrow', text: 'Punto ' + p.n }),
        el('h3', { text: p.card.title }),
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
