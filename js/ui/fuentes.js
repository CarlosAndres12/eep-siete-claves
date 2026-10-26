/* Vista #/fuentes (spec §7.8). */
(function (root) {
  'use strict';
  var EEP = root.EEP, el = EEP.util.el, UI = EEP.ui;
  UI.fuentes = function (main) {
    var V = EEP.data.views.fuentes;
    UI.setTitle(V.h1);
    var S = EEP.data.sources;
    var get = function (k) { return S.filter(function (s) { return s.key === k; })[0]; };
    var wrap = el('div', { class: 'container' });
    wrap.appendChild(el('h1', { text: V.h1 }));
    wrap.appendChild(UI.section(V.obligatory, [el('p', {}, [el('strong', { text: get('eep-p5').cita })])]));
    wrap.appendChild(UI.section(V.cited, [el('ul', { class: 'sources' }, S.filter(function (s) { return s.key !== 'eep-p5' && s.key !== 'extraccion'; }).map(function (s) { return el('li', { id: 'ref-' + s.key, text: s.cita }); }))]));
    wrap.appendChild(UI.section(V.base, [el('p', { text: get('extraccion').cita })]));
    wrap.appendChild(UI.section(V.howTitle, [el('p', { class: 'cite-box card card-pad', text: V.how })]));
    main.appendChild(wrap);
  };
})(window);
