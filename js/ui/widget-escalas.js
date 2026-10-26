/* Widget «¿De qué escala habla?» (spec §8.2): ocho fichas de cifra y tres casillas; arrastrar o seleccionar y elegir. */
(function (root) {
  'use strict';
  var EEP = root.EEP, U = EEP.util, el = U.el, UI = EEP.ui;
  UI.widgetEscalas = function (box) {
    var W = EEP.data.widgets.escalas;
    var wrap = el('section', { class: 'widget card card-pad', 'aria-label': W.title });
    wrap.appendChild(el('h2', { text: W.title }));
    var pool = el('div', { class: 'chips-pool', role: 'list' });
    var bins = el('div', { class: 'bins' });
    var live = el('div', { 'aria-live': 'polite', class: 'widget-live' });
    var selected = null, placed = 0;
    var binEls = {};
    EEP.data.legend.forEach(function (l) {
      var list = el('div', { class: 'bin-list', role: 'list' });
      var b = el('button', { type: 'button', class: 'bin', 'data-escala': l.id, 'aria-label': 'Colocar en ' + l.label }, [UI.legendChip(l.id, { full: true })]);
      var bw = el('div', { class: 'bin-wrap' }, [b, list]);
      b.addEventListener('click', function () { if (selected) place(selected, l.id); });
      bw.addEventListener('dragover', function (e) { e.preventDefault(); });
      bw.addEventListener('drop', function (e) { e.preventDefault(); var id = e.dataTransfer.getData('text/plain'); var c = pool.querySelector('[data-fig="' + id + '"]'); if (c) place(c, l.id); });
      binEls[l.id] = list;
      bins.appendChild(bw);
    });
    W.items.forEach(function (id) {
      var f = EEP.engine.cards.fig(id);
      var c = el('button', { type: 'button', class: 'fig-chip', draggable: 'true', 'data-fig': id, 'aria-pressed': 'false', role: 'listitem' }, [el('strong', { text: f.partes[0].valor }), ' ' + f.partes[0].etiqueta]);
      c.addEventListener('click', function () {
        if (selected) selected.setAttribute('aria-pressed', 'false');
        selected = selected === c ? null : c;
        if (selected) selected.setAttribute('aria-pressed', 'true');
      });
      c.addEventListener('dragstart', function (e) { e.dataTransfer.setData('text/plain', id); });
      pool.appendChild(c);
    });
    function place(chip, escala) {
      var f = EEP.engine.cards.fig(chip.getAttribute('data-fig'));
      live.innerHTML = '';
      chip.setAttribute('aria-pressed', 'false'); selected = null;
      if (f.escala === escala) {
        chip.disabled = true; chip.setAttribute('draggable', 'false');
        binEls[escala].appendChild(chip);
        placed++;
        live.appendChild(UI.feedback(true, f.alcance));
        if (placed === W.items.length) live.appendChild(el('p', { class: 'widget-end', text: W.end }));
      } else {
        live.appendChild(el('p', { class: 'feedback-retry', html: '<span class="pill" aria-hidden="true">↺</span> ' + U.escapeHtml(W.wrong) }));
        chip.focus();
      }
    }
    wrap.appendChild(pool); wrap.appendChild(bins); wrap.appendChild(live);
    box.appendChild(wrap);
  };
})(window);
