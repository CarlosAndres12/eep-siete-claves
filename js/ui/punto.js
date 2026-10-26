/* Vistas de punto (spec §7.3). El Punto 3 tiene tres pestañas; una pestaña nunca muestra cifras de otra. */
(function (root) {
  'use strict';
  var EEP = root.EEP, U = EEP.util, el = U.el, UI = EEP.ui;

  function chipsFor(n) { return (EEP.data.glossary.chips || {})[String(n)] || []; }

  function messageList(n, grupo, gctx) {
    var V = EEP.data.views.punto;
    var list = (EEP.data.messages[n] || []).filter(function (m) { return !grupo || m.grupo === grupo || m.grupo === 'comun'; });
    var ol = el('ol', { class: 'messages' });
    list.forEach(function (m) {
      var li = el('li', { class: 'message' }, [el('p', { html: UI.md(m.text, gctx) })]);
      if (m.matiz) {
        var codes = m.codigos && m.codigos.length ? ' ' + (m.codigos.length > 1 ? EEP.data.views.precauciones.codeN : EEP.data.views.precauciones.code1) : '';
        li.appendChild(el('p', { class: 'matiz-note' }, [UI.badge(EEP.data.site.ui.conMatiz, 'state'), ' ' + m.matiz + codes]));
      }
      li.appendChild(el('details', { class: 'message-sources' }, [el('summary', { text: V.sourcesToggle }), el('p', { text: m.fuentes.join(' ') })]));
      ol.appendChild(li);
    });
    return ol;
  }

  function figsOf(videoIds) {
    var ids = [];
    videoIds.forEach(function (vid) { EEP.engine.player.videoFigs(EEP.engine.stage.videoData(vid)).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); }); });
    return ids;
  }

  function mountPlayer(container, vid, gctx) {
    var used = gctx.used;
    EEP.engine.player.mount(container, vid, {
      markup: function (text) { return UI.md(text, { terms: gctx.terms, used: used }); },
      figCard: function (id) { return UI.figCard(id); }
    });
  }

  UI.punto = function (main, n, tab) {
    var V = EEP.data.views.punto;
    var p = EEP.data.puntos.filter(function (x) { return x.n === n; })[0];
    UI.setTitle(p.h1);
    var wrap = el('div', { class: 'container punto-view' });
    var gctx = { terms: chipsFor(n), used: {} };
    wrap.appendChild(el('h1', { text: p.h1 }));
    wrap.appendChild(UI.section(V.requestTitle, [el('blockquote', { class: 'request' }, [el('p', { text: '«' + p.request + '»' })])]));
    var intro = el('div', { class: 'intro' }, [el('p', { class: 'lead', html: UI.md(p.intro, gctx) })]);
    if (p.stamp) intro.appendChild(UI.stampEl(p.stamp));
    if (p.stampNote) intro.appendChild(el('p', { class: 'stamp-note', text: p.stampNote }));
    wrap.appendChild(intro);

    var videos = p.videos, grupo = null, bullets = p.bullets, tabObj = null;
    if (p.tabs) {
      tabObj = p.tabs.filter(function (t) { return t.id === tab; })[0] || p.tabs[0];
      videos = [tabObj.video]; grupo = tabObj.grupo; bullets = tabObj.bullets;
      var tl = el('div', { class: 'tabs', role: 'tablist', 'aria-label': p.h1 });
      p.tabs.forEach(function (t) {
        tl.appendChild(el('a', { role: 'tab', class: 'tab', href: '#/punto-3/' + t.id, 'aria-selected': String(t === tabObj), text: t.label }));
      });
      wrap.appendChild(tl);
    }
    var pv = el('div', { class: 'players', role: p.tabs ? 'tabpanel' : null });
    videos.forEach(function (vid) { mountPlayer(pv, vid, gctx); });
    wrap.appendChild(pv);
    if (p.chapterLinks) {
      var v2 = EEP.engine.stage.videoData('v2');
      var ul = el('ul', { class: 'chapter-links' });
      v2.chapters.forEach(function (ch, i) {
        ul.appendChild(el('li', {}, [el('button', { type: 'button', class: 'linklike', text: ch.title, onclick: function () {
          var btn = pv.querySelector('.chip-chapter[data-ch="' + i + '"]'); if (btn) { btn.click(); pv.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        } })]));
      });
      wrap.appendChild(UI.section(V.chaptersTitle, [ul]));
    }
    wrap.appendChild(UI.section(V.messagesTitle, [messageList(n, grupo, gctx)]));
    var grid = el('div', { class: 'fig-grid' });
    figsOf(videos).forEach(function (id) { grid.appendChild(UI.figCard(id)); });
    wrap.appendChild(UI.section(V.figsTitle, [grid]));
    wrap.appendChild(UI.section(V.readTitle, [el('ul', { class: 'read-well' }, bullets.map(function (b) { return el('li', { html: UI.md(b, gctx) }); }))]));
    var words = el('p', { class: 'keywords' });
    var chipList = chipsFor(n);
    chipList.forEach(function (t) { words.appendChild(el('span', { html: UI.md('{glos:' + t + '}') })); });
    wrap.appendChild(UI.section(V.wordsTitle, [words]));
    if (p.retiros) { var wbox = el('div'); wrap.appendChild(wbox); UI.widgetRetiros(wbox); }
    wrap.appendChild(UI.section(V.sourceTitle, [el('p', { class: 'obligatory', text: EEP.data.site.obligatorySource })]));
    wrap.appendChild(UI.stampEl('stamp-insumo'));
    var nav = el('nav', { class: 'punto-nav', 'aria-label': 'Puntos' });
    var prev = EEP.data.puntos.filter(function (x) { return x.n === n - 1; })[0], next = EEP.data.puntos.filter(function (x) { return x.n === n + 1; })[0];
    if (prev) nav.appendChild(el('a', { href: prev.route, html: '<span aria-hidden="true">← </span>' + U.escapeHtml(V.prev + ': ' + prev.card.title) }));
    if (next) nav.appendChild(el('a', { href: next.route, class: 'next', html: U.escapeHtml(V.next + ': ' + next.card.title) + '<span aria-hidden="true"> →</span>' }));
    wrap.appendChild(nav);
    main.appendChild(wrap);
  };
})(window);
