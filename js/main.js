/* Arranque: espera las fuentes, luego monta el modo de render (?render=…) o el sitio. */
(function (root) {
  'use strict';
  var EEP = root.EEP;

  // Carga explícita de cada cara y peso que usa el lienzo, con un tope de 3 s (base §1.1).
  function loadFonts() {
    var faces = (EEP.style.tokens.fonts.faces || []);
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var all = Promise.all(faces.map(function (f) {
      return document.fonts.load((f.style === 'italic' ? 'italic ' : '') + f.weight + ' 32px "' + f.family + '"', 'ÁÉÍÓÚáéíóúñ0123456789').catch(function () {});
    }));
    var timeout = new Promise(function (res) { setTimeout(res, 3000); });
    return Promise.race([all, timeout]).then(function () {
      EEP.style.clearMeasureCache();
      if (EEP.engine.captions) EEP.engine.captions.clearCache();
      if (EEP.engine.cards) EEP.engine.cards.clearCache();
    });
  }
  EEP.loadFonts = loadFonts;

  function param(name) {
    var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(root.location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function mountRender(mode) {
    document.documentElement.classList.add('render-mode');
    document.body.innerHTML = '';
    var c = document.createElement('canvas');
    c.width = 1280; c.height = 720;
    c.style.display = 'block';
    document.body.appendChild(c);
    var ctx = c.getContext('2d');
    if (mode === 'estilo') {
      var page = parseInt(param('page') || '1', 10);
      EEP.style.testsheet(c, page);
      root.renderPage = function (n) { EEP.style.testsheet(c, n); };
      root.renderReadyFlag = true;
      return;
    }
    if (mode.indexOf('slide:') === 0) {
      var n = mode.slice(6);
      root.renderFrame = function (t) { EEP.slides.renderSlide(ctx, n, t || 99); };
      root.videoDuration = 1;
      root.renderFrame(99);
      root.renderReadyFlag = true;
      return;
    }
    var withAudio = param('audio') !== '0';
    var stage = EEP.engine.stage.create(mode, withAudio ? {} : { manifest: null });
    root.renderFrame = function (t) { stage.renderFrame(ctx, t, { captions: param('captions') !== '0', interactive: false }); };
    root.videoDuration = stage.duration;
    root.videoChapters = stage.chapters.map(function (ch) { return { title: ch.title, start: ch.start, end: ch.end }; });
    root.videoTimeline = {
      scenes: stage.timeline.scenes.map(function (s) {
        return { id: s.id, start: s.start, end: s.end, lines: s.lines.map(function (l) { return { start: s.start + l.start, end: s.start + l.end, voice: l.voice }; }) };
      }),
      checkpoints: stage.timeline.checkpoints.map(function (c) { return { start: c.start, end: c.end, after: c.after }; }),
      pauses: stage.timeline.pauses.map(function (c) { return { start: c.start, end: c.end, after: c.after }; })
    };
    root.renderFrame(0);
    root.renderReadyFlag = true;
  }

  function boot() {
    loadFonts().then(function () {
      var mode = param('render');
      if (mode) { mountRender(mode); return; }
      EEP.style.reduced = EEP.util.reducedMotion();
      if (EEP.ui.shell && EEP.ui.shell.start) EEP.ui.shell.start();
    }).catch(function (e) { if (root.console) console.error(e); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
