/* Vista #/acerca (spec §7.10). */
(function (root) {
  'use strict';
  var EEP = root.EEP, el = EEP.util.el, UI = EEP.ui;
  UI.acerca = function (main) {
    var V = EEP.data.views.acerca;
    UI.setTitle(V.h1);
    var wrap = el('div', { class: 'container' });
    wrap.appendChild(el('h1', { text: V.h1 }));
    V.blocks.forEach(function (b) { wrap.appendChild(UI.section(b.title, [el('p', { text: b.text })])); });
    wrap.appendChild(UI.section(EEP.data.views.punto.sourceTitle, [el('p', { class: 'obligatory', text: EEP.data.site.obligatorySource })]));
    wrap.appendChild(el('p', { class: 'transparency card card-pad', text: EEP.data.site.transparency }));
    main.appendChild(wrap);
  };
})(window);
