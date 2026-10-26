/* Widget «¿Qué mide esta cifra?» (spec §8.1): una tarjeta a la vez, alcance oculto hasta responder, tres opciones
   barajadas con un orden con semilla, pista impersonal y otra oportunidad. */
(function (root) {
  'use strict';
  var EEP = root.EEP, U = EEP.util, el = U.el, UI = EEP.ui;
  function feedback(ok, text) {
    return el('p', { class: ok ? 'feedback-correct' : 'feedback-retry', html: '<span class="pill" aria-hidden="true">' + (ok ? '✓' : '↺') + '</span> ' + (ok ? '<strong>¡Muy bien!</strong> ' : 'Casi. Pista: ') + U.escapeHtml(text) });
  }
  UI.feedback = feedback;
  UI.widgetQueMide = function (box) {
    var W = EEP.data.widgets.queMide;
    var rng = EEP.engine.rng('que-mide');
    var i = 0;
    var wrap = el('section', { class: 'widget card card-pad', 'aria-label': W.title });
    wrap.appendChild(el('h2', { text: W.title }));
    var body = el('div');
    var live = el('div', { 'aria-live': 'polite', class: 'widget-live' });
    wrap.appendChild(body); wrap.appendChild(live);
    function render() {
      body.innerHTML = ''; live.innerHTML = '';
      if (i >= W.items.length) { body.appendChild(el('p', { class: 'widget-end', text: W.end })); return; }
      var it = W.items[i];
      body.appendChild(el('p', { class: 'widget-progress', text: W.progress.replace('{n}', i + 1).replace('{total}', W.items.length) }));
      var card = UI.figCard(it.figure, { hideScope: true });
      body.appendChild(card);
      body.appendChild(el('p', { class: 'widget-q', text: W.question }));
      var opts = [{ t: it.correct, ok: true }].concat(it.distractors.map(function (d) { return { t: d, ok: false }; }));
      for (var k = opts.length - 1; k > 0; k--) { var j = Math.floor(rng() * (k + 1)); var tmp = opts[k]; opts[k] = opts[j]; opts[j] = tmp; }
      var group = el('div', { class: 'options', role: 'group', 'aria-label': W.question });
      var next = el('button', { type: 'button', class: 'btn', hidden: true, html: '<span aria-hidden="true">→ </span>' + U.escapeHtml(W.next) });
      next.addEventListener('click', function () { i++; render(); body.querySelector('button') && body.querySelector('button').focus(); });
      opts.forEach(function (o) {
        var b = el('button', { type: 'button', class: 'btn-option', text: o.t });
        b.addEventListener('click', function () {
          live.innerHTML = '';
          if (o.ok) {
            b.classList.add('is-correct');
            Array.prototype.forEach.call(group.children, function (x) { x.disabled = true; });
            card.querySelector('.fig-card-scope').classList.remove('is-hidden');
            live.appendChild(feedback(true, it.explain));
            next.hidden = false; next.focus();
          } else { b.classList.add('is-wrong'); b.disabled = true; live.appendChild(feedback(false, it.hint.replace(/^La clave/, 'la clave'))); }
        });
        group.appendChild(b);
      });
      body.appendChild(group);
      body.appendChild(next);
    }
    render();
    box.appendChild(wrap);
  };
})(window);
