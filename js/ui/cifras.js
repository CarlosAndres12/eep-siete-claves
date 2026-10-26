/* Vista #/cifras (spec §7.5): el widget «¿Qué mide esta cifra?» y el banco con filtros y búsqueda. */
(function (root) {
  'use strict';
  var EEP = root.EEP, U = EEP.util, el = U.el, UI = EEP.ui;
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  UI.cifras = function (main, focusId) {
    var V = EEP.data.views.cifras;
    UI.setTitle(V.h1);
    var wrap = el('div', { class: 'container' });
    wrap.appendChild(el('h1', { text: V.h1 }));
    wrap.appendChild(el('p', { class: 'dek', text: V.dek }));
    wrap.appendChild(el('p', { class: 'lead', text: V.text }));
    wrap.appendChild(el('p', { class: 'note', text: V.note }));
    var wbox = el('div');
    wrap.appendChild(wbox);
    UI.widgetQueMide(wbox);
    var F = V.filters;
    function select(label, opts) {
      var s = el('select', { 'aria-label': label });
      s.appendChild(el('option', { value: '', text: F.all }));
      opts.forEach(function (o) { s.appendChild(el('option', { value: o[0], text: o[1] })); });
      return el('label', { class: 'filter' }, [el('span', { text: label }), s]);
    }
    var figs = EEP.data.figures;
    var tipos = []; figs.forEach(function (f) { if (tipos.indexOf(f.tipo) < 0) tipos.push(f.tipo); });
    var fP = select(F.punto, EEP.data.puntos.map(function (p) { return [String(p.n), 'Punto ' + p.n]; }));
    var fE = select(F.escala, EEP.data.legend.map(function (l) { return [l.id, l.short]; }));
    var fT = select(F.tipo, tipos.map(function (t) { return [t, t]; }));
    var q = el('input', { type: 'search', 'aria-label': F.search, placeholder: F.search });
    var count = el('p', { class: 'filter-count', 'aria-live': 'polite' });
    wrap.appendChild(el('div', { class: 'filters', role: 'search' }, [fP, fE, fT, el('label', { class: 'filter' }, [el('span', { text: F.search }), q])]));
    wrap.appendChild(count);
    var grid = el('div', { class: 'fig-grid' });
    var cards = figs.map(function (f) { var c = UI.figCard(f.id, { usedIn: true, anchor: true }); grid.appendChild(c); return { f: f, c: c }; });
    wrap.appendChild(grid);
    function apply() {
      var p = fP.lastChild.value, e = fE.lastChild.value, t = fT.lastChild.value, s = norm(q.value.trim());
      var n = 0;
      cards.forEach(function (x) {
        var ok = (!p || String(x.f.punto) === p) && (!e || x.f.escala === e) && (!t || x.f.tipo === t) &&
          (!s || norm(x.f.cifra + ' ' + x.f.alcance + ' ' + x.f.tema + ' ' + x.f.id).indexOf(s) >= 0);
        x.c.hidden = !ok; if (ok) n++;
      });
      count.textContent = n + ' de ' + cards.length;
    }
    [fP, fE, fT].forEach(function (l) { l.lastChild.addEventListener('change', apply); });
    q.addEventListener('input', apply);
    apply();
    main.appendChild(wrap);
    if (focusId) setTimeout(function () { var c = document.getElementById('fig-' + focusId); if (c) { c.scrollIntoView({ block: 'center' }); c.classList.add('is-focus'); c.setAttribute('tabindex', '-1'); c.focus({ preventScroll: true }); } }, 50);
  };
})(window);
