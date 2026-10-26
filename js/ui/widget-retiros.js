/* Widget «Retiros de ríos y quebradas» (spec §8.3): el signo `retiro` a escala exacta de 0 a 30 m por orilla. */
(function (root) {
  'use strict';
  var EEP = root.EEP, U = EEP.util, el = U.el, UI = EEP.ui;
  UI.widgetRetiros = function (box) {
    var W = EEP.data.widgets.retiros;
    var on = { acuerdo: false, sentencia: false };
    var wrap = el('section', { class: 'widget card card-pad', 'aria-label': W.title });
    wrap.appendChild(el('h2', { text: W.title }));
    var c = el('canvas', { class: 'widget-canvas', width: 1280, height: 560, role: 'img' });
    var ctx = c.getContext('2d');
    function draw() {
      var w = c.clientWidth || 900, dpr = Math.min(2, root.devicePixelRatio || 1);
      var bw = Math.round(w * dpr); if (c.width !== bw) { c.width = bw; c.height = Math.round(bw * 560 / 1280); }
      ctx.setTransform(c.width / 1280, 0, 0, c.width / 1280, 0, 0);
      ctx.fillStyle = EEP.style.role('ground'); ctx.fillRect(0, 0, 1280, 560);
      var bands = [];
      if (on.acuerdo) { bands.push({ m: 10, label: '', pattern: 'dots' }); bands.push({ m: 15, label: W.toggles[0].label, pattern: 'dots' }); }
      if (on.sentencia) bands.push({ m: 30, label: W.toggles[1].label, pattern: 'stripes' });
      EEP.course.retiro(ctx, { x: 40, y: 20, w: 1200, h: 480 }, { scale: W.scale, bands: bands, p: 1, label: W.label });
      var desc = [W.label].concat(W.toggles.filter(function (t) { return on[t.id]; }).map(function (t) { return t.label; }));
      c.setAttribute('aria-label', desc.join('. '));
    }
    var tg = el('div', { class: 'toggles', role: 'group', 'aria-label': W.title });
    W.toggles.forEach(function (t) {
      var b = el('button', { type: 'button', class: 'btn-toggle', 'aria-pressed': 'false', text: t.label });
      b.addEventListener('click', function () { on[t.id] = !on[t.id]; b.setAttribute('aria-pressed', String(on[t.id])); draw(); });
      tg.appendChild(b);
    });
    wrap.appendChild(tg);
    wrap.appendChild(c);
    var cards = el('div', { class: 'fig-grid fig-grid-2' }, W.toggles.map(function (t) { return UI.figCard(t.figure); }));
    wrap.appendChild(el('p', { class: 'widget-note', html: UI.md(W.note) }));
    wrap.appendChild(cards);
    box.appendChild(wrap);
    setTimeout(draw, 0);
    root.addEventListener('resize', draw);
  };
})(window);
