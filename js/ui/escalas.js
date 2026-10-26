/* Vista #/escalas (spec §7.4): la leyenda de las tres escalas y el widget «¿De qué escala habla?». */
(function (root) {
  'use strict';
  var EEP = root.EEP, el = EEP.util.el, UI = EEP.ui;
  UI.escalas = function (main) {
    var V = EEP.data.views.escalas;
    UI.setTitle(V.h1);
    var wrap = el('div', { class: 'container' });
    wrap.appendChild(el('h1', { text: V.h1 }));
    wrap.appendChild(el('p', { class: 'dek', text: V.dek }));
    wrap.appendChild(el('p', { class: 'lead', text: V.text }));
    var ul = el('ul', { class: 'legend-list' });
    V.items.forEach(function (it) {
      ul.appendChild(el('li', { class: 'legend-item' }, [UI.legendChip(it.id, { full: true }), el('p', { text: it.text })]));
    });
    wrap.appendChild(ul);
    var sign = el('div', { class: 'escalas-sign' }, [UI.canvasIcon(420, 260, function (ctx) { EEP.course.escalas(ctx, { x: 6, y: 6, w: 408, h: 248 }, { p: 1 }); })]);
    sign.firstChild.setAttribute('role', 'img');
    sign.firstChild.setAttribute('aria-label', V.items.map(function (i) { return i.label; }).join(', '));
    sign.firstChild.removeAttribute('aria-hidden');
    wrap.appendChild(sign);
    var box = el('div');
    wrap.appendChild(box);
    UI.widgetEscalas(box);
    main.appendChild(wrap);
  };
})(window);
