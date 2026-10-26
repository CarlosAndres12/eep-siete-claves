/* Vista #/precauciones (spec §7.6): «Usa» con la marca `correct`, «No uses» con el rol `alert` y sus palabras. */
(function (root) {
  'use strict';
  var EEP = root.EEP, el = EEP.util.el, UI = EEP.ui;
  UI.precauciones = function (main) {
    var V = EEP.data.views.precauciones;
    UI.setTitle(V.h1);
    var wrap = el('div', { class: 'container container-wide' });
    wrap.appendChild(el('h1', { text: V.h1 }));
    wrap.appendChild(el('p', { class: 'dek', text: V.dek }));
    wrap.appendChild(el('p', { class: 'lead', text: V.text }));
    var table = el('table', { class: 'tabla precauciones' });
    table.appendChild(el('thead', {}, [el('tr', {}, [V.cols.tema, V.cols.usa, V.cols.noUses, V.cols.porque].map(function (c) { return el('th', { scope: 'col', text: c }); }))]));
    var tb = el('tbody');
    EEP.data.corrections.forEach(function (r) {
      var codes = r.codigos.length ? ' ' + (r.codigos.length > 1 ? V.codeN : V.code1) : '';
      var ref = r.ref ? ' (' + r.ref.join('; ') + ')' : '';
      tb.appendChild(el('tr', {}, [
        el('th', { scope: 'row', text: r.tema }),
        el('td', { class: 'td-usa' }, [el('span', { class: 'mark-correct', 'aria-hidden': 'true', text: '✓' }), el('span', { class: 'visually-hidden', text: V.cols.usa + ': ' }), r.usa]),
        el('td', { class: 'td-nouses alert-border' }, [el('strong', { class: 'alert-text', text: V.cols.noUses + ': ' })].concat(r.noUses.map(function (x, i) { return el('span', { class: 'nouses-item', text: (i ? ' · ' : '') + x }); }))),
        el('td', { text: r.porque + ref + codes })
      ]));
    });
    table.appendChild(tb);
    wrap.appendChild(el('div', { class: 'table-scroll', tabindex: '0', role: 'region', 'aria-label': V.h1 }, [table]));
    wrap.appendChild(UI.stampEl('stamp-base'));
    main.appendChild(wrap);
  };
})(window);
