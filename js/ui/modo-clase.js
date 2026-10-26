/* Vista #/modo-clase (spec §7.9): diapositivas o video por punto (y pestaña del Punto 3), reloj de la sesión,
   pausa al final de cada capítulo activada por defecto, pantalla completa y teclado. */
(function (root) {
  'use strict';
  var EEP = root.EEP, U = EEP.util, el = U.el, UI = EEP.ui;

  UI.modoClase = function (main) {
    var V = EEP.data.views.modoClase;
    UI.setTitle(V.h1);
    var st = EEP.store.get('clase', { key: '1', mode: 'slides', i: 0 });
    var wrap = el('div', { class: 'container container-wide modo-clase' });
    wrap.appendChild(el('h1', { text: V.h1 }));
    wrap.appendChild(el('p', { class: 'lead', text: V.text }));

    // selector de punto (y pestaña del Punto 3)
    var sel = el('select', { 'aria-label': V.choose });
    Object.keys(EEP.data.slides.decks).sort().forEach(function (k) {
      var d = EEP.data.slides.decks[k];
      var p = EEP.data.puntos.filter(function (x) { return x.n === d.punto; })[0];
      var tab = d.tab && p.tabs ? p.tabs.filter(function (t) { return t.id === d.tab; })[0] : null;
      sel.appendChild(el('option', { value: k, text: 'Punto ' + d.punto + ' · ' + (tab ? tab.label : p.card.title) }));
    });
    sel.value = st.key;
    var bSlides = el('button', { type: 'button', class: 'btn-toggle', 'aria-pressed': String(st.mode === 'slides'), text: V.slides });
    var bVideo = el('button', { type: 'button', class: 'btn-toggle', 'aria-pressed': String(st.mode === 'video'), text: V.video });
    var bPrev = el('button', { type: 'button', class: 'btn btn-outline', html: '<span aria-hidden="true">← </span>' + U.escapeHtml(V.prev) });
    var bNext = el('button', { type: 'button', class: 'btn', html: U.escapeHtml(V.next) + '<span aria-hidden="true"> →</span>' });
    var bFull = el('button', { type: 'button', class: 'btn btn-outline', text: V.full });
    var chapPause = el('button', { type: 'button', class: 'btn-toggle', 'aria-pressed': 'true', text: V.chapterPause });

    // reloj de la sesión
    var clock = { start: null, acc: 0, iv: 0 };
    var clockOut = el('output', { class: 'clock', 'aria-live': 'off', text: '00:00' });
    function elapsed() { return clock.acc + (clock.start ? (Date.now() - clock.start) / 1000 : 0); }
    function showClock() { var s = Math.floor(elapsed()); clockOut.textContent = (s / 60 < 10 ? '0' : '') + Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); }
    var cStart = el('button', { type: 'button', class: 'btn-toggle', text: V.start, onclick: function () { if (!clock.start) { clock.start = Date.now(); clock.iv = setInterval(showClock, 500); } } });
    var cPause = el('button', { type: 'button', class: 'btn-toggle', text: V.pause, onclick: function () { if (clock.start) { clock.acc = elapsed(); clock.start = null; clearInterval(clock.iv); showClock(); } } });
    var cReset = el('button', { type: 'button', class: 'btn-toggle', text: V.reset, onclick: function () { clock.acc = 0; if (clock.start) clock.start = Date.now(); showClock(); } });

    var controls = el('div', { class: 'clase-controls', role: 'group', 'aria-label': V.h1 }, [
      el('label', { class: 'filter' }, [el('span', { text: V.choose }), sel]),
      el('div', { class: 'seg' }, [bSlides, bVideo]), bPrev, bNext, bFull, chapPause,
      el('div', { class: 'clock-box', role: 'group', 'aria-label': V.clock }, [el('span', { text: V.clock }), clockOut, cStart, cPause, cReset])
    ]);
    wrap.appendChild(controls);

    var stage = el('div', { class: 'clase-stage' });
    var canvas = el('canvas', { class: 'slide-canvas', width: 1280, height: 720, role: 'img' });
    var notesBox = el('details', { class: 'slide-notes', open: true }, [el('summary', { text: V.notes })]);
    var notesBody = el('div');
    notesBox.appendChild(notesBody);
    var counter = el('p', { class: 'slide-counter', 'aria-live': 'polite' });
    var videoBox = el('div', { class: 'clase-video' });
    stage.appendChild(canvas);
    stage.appendChild(videoBox);
    wrap.appendChild(stage);
    wrap.appendChild(counter);
    wrap.appendChild(notesBox);
    var wbox = el('div');
    wrap.appendChild(wbox);
    UI.widgetQueMide(wbox);
    main.appendChild(wrap);

    var ctx = canvas.getContext('2d');
    var player = null;
    function slides() { return EEP.slides.deckSlides(st.key); }
    function save() { EEP.store.set('clase', st); }
    function drawSlide() {
      var w = canvas.clientWidth || 1280, dpr = Math.min(2, root.devicePixelRatio || 1);
      var bw = Math.max(640, Math.round(w * dpr)); if (canvas.width !== bw) { canvas.width = bw; canvas.height = Math.round(bw * 9 / 16); }
      ctx.__dpr = canvas.width / 1280;
      var list = slides();
      st.i = Math.max(0, Math.min(list.length - 1, st.i));
      var id = list[st.i];
      EEP.slides.renderSlide(ctx, id, 99);
      var sl = EEP.slides.item(id);
      canvas.setAttribute('aria-label', sl ? sl.title + '. ' + U.plain((EEP.data.messages[sl.punto] || []).filter(function (m) { return m.id === sl.message; }).map(function (m) { return m.text; })[0] || '', function (f) { var x = EEP.engine.cards.fig(f); return x ? x.partes[0].valor : ''; }) : sel.options[sel.selectedIndex].text);
      notesBody.innerHTML = '';
      EEP.slides.notes(id).forEach(function (n) { notesBody.appendChild(el('p', { text: n })); });
      counter.textContent = (st.i + 1) + ' / ' + list.length;
    }
    function render() {
      save();
      var isSlides = st.mode === 'slides';
      bSlides.setAttribute('aria-pressed', String(isSlides)); bVideo.setAttribute('aria-pressed', String(!isSlides));
      canvas.hidden = !isSlides; notesBox.hidden = !isSlides; counter.hidden = !isSlides;
      bPrev.hidden = bNext.hidden = !isSlides;
      if (player) { player.destroy(); player = null; }
      videoBox.innerHTML = '';
      if (isSlides) drawSlide();
      else {
        var d = EEP.data.slides.decks[st.key];
        var p = EEP.data.puntos.filter(function (x) { return x.n === d.punto; })[0];
        var vid = d.tab ? p.tabs.filter(function (t) { return t.id === d.tab; })[0].video : p.videos[0];
        player = EEP.engine.player.mount(videoBox, vid, { chapterPause: chapPause.getAttribute('aria-pressed') === 'true', figCard: function (id) { return UI.figCard(id); } });
      }
    }
    sel.addEventListener('change', function () { st.key = sel.value; st.i = 0; render(); });
    bSlides.addEventListener('click', function () { st.mode = 'slides'; render(); });
    bVideo.addEventListener('click', function () { st.mode = 'video'; render(); });
    bPrev.addEventListener('click', function () { st.i--; drawSlide(); save(); });
    bNext.addEventListener('click', function () { st.i++; drawSlide(); save(); });
    chapPause.addEventListener('click', function () {
      var on = chapPause.getAttribute('aria-pressed') !== 'true';
      chapPause.setAttribute('aria-pressed', String(on));
      if (player) player.setChapterPause(on);
    });
    function full() { try { if (document.fullscreenElement) document.exitFullscreen(); else stage.requestFullscreen(); } catch (e) {} }
    bFull.addEventListener('click', full);
    function onKey(e) {
      if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      if (st.mode === 'slides') {
        if (e.key === 'ArrowRight') { st.i++; drawSlide(); save(); e.preventDefault(); }
        else if (e.key === 'ArrowLeft') { st.i--; drawSlide(); save(); e.preventDefault(); }
      } else if (e.key === ' ' && player && e.target.tagName !== 'BUTTON' && !player.el.contains(e.target)) {
        e.preventDefault(); player.state.playing ? player.pause() : player.play();
      }
      if ((e.key === 'f' || e.key === 'F') && (st.mode === 'slides' || !player || !player.el.contains(e.target))) full();
    }
    document.addEventListener('keydown', onKey);
    function onResize() { if (st.mode === 'slides') drawSlide(); }
    root.addEventListener('resize', onResize);
    document.addEventListener('fullscreenchange', onResize);
    UI.cleanup = function () {
      document.removeEventListener('keydown', onKey); root.removeEventListener('resize', onResize);
      document.removeEventListener('fullscreenchange', onResize); clearInterval(clock.iv);
    };
    render();
  };
})(window);
