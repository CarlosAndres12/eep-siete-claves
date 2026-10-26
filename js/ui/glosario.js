/* Vista #/glosario (spec §7.7): búsqueda, filtro por punto, explicación sencilla y definición en el documento. */
(function (root) {
  'use strict';
  var EEP = root.EEP, U = EEP.util, el = U.el, UI = EEP.ui;
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  UI.glosario = function (main, focusTerm) {
    var V = EEP.data.views.glosario;
    UI.setTitle(V.h1);
    var wrap = el('div', { class: 'container' });
    wrap.appendChild(el('h1', { text: V.h1 }));
    wrap.appendChild(el('p', { class: 'dek', text: V.dek }));
    var q = el('input', { type: 'search', 'aria-label': V.search, placeholder: V.search });
    var sel = el('select', { 'aria-label': V.punto }, [el('option', { value: '', text: V.all })].concat([1, 2, 3, 4, 5, 6, 7].map(function (n) { return el('option', { value: String(n), text: 'Punto ' + n }); })));
    var count = el('p', { class: 'filter-count', 'aria-live': 'polite' });
    wrap.appendChild(el('div', { class: 'filters', role: 'search' }, [el('label', { class: 'filter' }, [el('span', { text: V.search }), q]), el('label', { class: 'filter' }, [el('span', { text: V.punto }), sel])]));
    wrap.appendChild(count);
    var dl = el('div', { class: 'glossary' });
    var items = EEP.data.glossary.entries.map(function (e) {
      var id = 'glos-' + norm(e.term).replace(/[^a-z0-9]+/g, '-');
      var art = el('article', { class: 'gloss-entry', id: id }, [
        el('h2', { class: 'gloss-term', text: e.term }),
        el('p', { class: 'gloss-plain', text: e.plain }),
        e.note ? el('p', { class: 'gloss-note', text: e.note }) : null,
        e.source ? el('details', {}, [el('summary', { text: V.definition }), el('p', { text: e.source }), e.cita ? el('p', { class: 'gloss-cita', text: e.cita }) : null]) : null,
        el('p', { class: 'gloss-points', text: V.points + e.points.join(', ') })
      ]);
      dl.appendChild(art);
      return { e: e, el: art };
    });
    wrap.appendChild(dl);
    function apply() {
      var s = norm(q.value.trim()), p = sel.value, n = 0;
      items.forEach(function (x) {
        var ok = (!s || norm(x.e.term + ' ' + (x.e.aliases || []).join(' ') + ' ' + x.e.plain).indexOf(s) >= 0) && (!p || x.e.points.indexOf(+p) >= 0);
        x.el.hidden = !ok; if (ok) n++;
      });
      count.textContent = n + ' de ' + items.length;
    }
    q.addEventListener('input', apply); sel.addEventListener('change', apply);
    apply();
    main.appendChild(wrap);
    if (focusTerm) setTimeout(function () {
      var e = UI.glossEntry(focusTerm);
      var x = e && items.filter(function (i) { return i.e === e; })[0];
      if (x) { x.el.scrollIntoView({ block: 'center' }); x.el.classList.add('is-focus'); x.el.setAttribute('tabindex', '-1'); x.el.focus({ preventScroll: true }); }
    }, 50);
  };
})(window);
