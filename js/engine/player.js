/* Reproductor de video (base §3): lienzo + controles HTML fuera del lienzo, capítulos, preguntas, transcripción,
   reanudación, teclado, vista previa en la barra y descarga. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var U = EEP.util, el = U.el;
  var players = [];

  function hasAudio(id) {
    var m = EEP.audioManifest && EEP.audioManifest[id];
    return !!(m && m.file);
  }

  // ---------- transcripción ----------
  function figSources(figs) {
    var cards = EEP.engine.cards;
    var keys = [], scales = [];
    (figs || []).forEach(function (id) {
      var f = cards.fig(id);
      if (!f) return;
      f.fuentes.forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); });
      var it = EEP.engine.legend.item(f.escala);
      if (it && scales.indexOf(it.short) < 0) scales.push(it.short);
    });
    return { keys: keys, scales: scales };
  }

  function transcriptHtml(video, opts) {
    opts = opts || {};
    var md = opts.markup || function (s) { return U.escapeHtml(s); };
    var cast = EEP.engine.stage.castEntry;
    var html = '';
    var chapters = video.chapters || [];
    var chIndex = 0;
    video.scenes.forEach(function (sc) {
      if (chIndex < chapters.length && chapters[chIndex].from === sc.id) {
        html += '<h4 class="tr-chapter">' + U.escapeHtml(chapters[chIndex].title) + '</h4>';
        chIndex++;
      }
      html += '<div class="tr-scene">';
      html += '<p class="tr-seve"><span class="tr-label">Se ve:</span> ' + U.escapeHtml(sc.seVe) + '</p>';
      if (sc.ficcion) html += '<p class="tr-note"><span class="badge badge-state">Personajes inventados</span></p>';
      (sc.lines || []).forEach(function (l) {
        var ce = cast(l.voice);
        var who = l.voice === 'narrador' ? 'Narrador' : (ce ? ce.name : l.voice);
        html += '<p class="tr-line' + (l.misreading ? ' tr-misreading' : '') + '"><span class="tr-who">' + U.escapeHtml(who) + ':</span> ' + md(l.text, sc) + '</p>';
        if (l.misreading) html += '<p class="tr-misreading-mark"><span class="tilde-rule" aria-hidden="true">~~~~~~</span> <em>Error de lectura, corregido a continuación</em></p>';
      });
      var fs = figSources(sc.figs);
      if (fs.keys.length) {
        html += '<p class="tr-sources">Fuentes de las cifras de esta escena: ' + fs.keys.map(function (k) {
          var s = EEP.engine.cards.source(k); return U.escapeHtml(s ? s.cita : k);
        }).join(' ') + ' Escala: ' + U.escapeHtml(fs.scales.join(', ')) + '.</p>';
      }
      html += '</div>';
      (video.checkpoints || []).forEach(function (c) {
        if (c.after !== sc.id) return;
        html += '<div class="tr-check"><p><span class="tr-label">Pregunta:</span> ' + U.escapeHtml(c.question) + '</p><ul>' +
          c.options.map(function (o, i) { return '<li>' + U.escapeHtml(o) + (i === c.answer ? ' <span class="visually-hidden">(respuesta correcta)</span><span aria-hidden="true">✓</span>' : '') + '</li>'; }).join('') +
          '</ul><p>' + U.escapeHtml(c.explain) + '</p></div>';
      });
      (video.pauses || []).forEach(function (c) {
        if (c.after !== sc.id) return;
        html += '<div class="tr-check"><p><span class="tr-label">Pausa para conversar:</span> ' + U.escapeHtml(c.prompt) + '</p></div>';
      });
    });
    return html;
  }

  function videoFigs(video) {
    var ids = [];
    video.scenes.forEach(function (sc) { (sc.figs || []).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); }); });
    return ids;
  }

  // ---------- reproductor ----------
  // mount(container, id, { chapterPause, classMode, markup, figCard(id) -> element, onReady })
  function mount(container, id, opts) {
    opts = opts || {};
    var video = EEP.engine.stage.videoData(id);
    if (!video) return null;
    var state = {
      stage: null, clock: null, playing: false, t: 0, captions: true, voice: true, rate: 1,
      interactive: true, chapterPause: !!opts.chapterPause, held: null, raf: 0, lastT: 0, ended: false, recording: false
    };
    var P = { id: id, video: video, state: state };

    var canvas = el('canvas', { class: 'player-canvas', width: 1280, height: 720, role: 'img', 'aria-label': 'Video: ' + video.title + '. La transcripción completa está debajo del reproductor.' });
    var poster = el('div', { class: 'player-poster' });
    var overlay = el('div', { class: 'player-overlay overlay-wrap', hidden: true, role: 'dialog', 'aria-modal': 'false', 'aria-live': 'polite' });
    var note = el('div', { class: 'player-note', hidden: true, text: 'Voz del navegador' });
    var stageBox = el('div', { class: 'player-stage' }, [canvas, poster, overlay, note]);
    var live = el('div', { class: 'visually-hidden', 'aria-live': 'polite' });

    var chapBar = el('div', { class: 'player-chapters', role: 'group', 'aria-label': 'Capítulos de «' + video.title + '»' });
    (video.chapters || []).forEach(function (ch, i) {
      chapBar.appendChild(el('button', { type: 'button', class: 'chip-chapter', 'data-ch': i, text: ch.title, 'aria-label': 'Ir al capítulo ' + ch.title, onclick: function () { ensure(); seek(state.stage.chapters[i].start); play(); } }));
    });

    var btnPlay = el('button', { type: 'button', class: 'ctl-play', 'aria-label': 'Reproducir', text: '▶' });
    var scrub = el('div', { class: 'scrubber', role: 'slider', tabindex: '0', 'aria-label': 'Posición del video', 'aria-valuemin': '0', 'aria-valuemax': '0', 'aria-valuenow': '0', 'aria-valuetext': '0:00' });
    var fill = el('div', { class: 'fill' });
    var ticks = el('div', { class: 'ticks' });
    var preview = el('div', { class: 'scrub-preview', hidden: true }, [el('canvas', { width: 192, height: 108 }), el('span', { class: 'scrub-preview-label' })]);
    scrub.appendChild(ticks); scrub.appendChild(fill); scrub.appendChild(preview);
    var time = el('span', { class: 'ctl-time', 'aria-live': 'off', text: '0:00 / 0:00' });
    var chapSel = el('select', { class: 'ctl-chapter', 'aria-label': 'Menú de capítulos' });
    (video.chapters || []).forEach(function (ch, i) { chapSel.appendChild(el('option', { value: String(i), text: ch.title })); });
    chapSel.addEventListener('change', function () { ensure(); seek(state.stage.chapters[+chapSel.value].start); });

    function toggle(label, key, aria) {
      var b = el('button', { type: 'button', class: 'ctl-toggle', 'aria-pressed': String(!!state[key]), text: label, 'aria-label': aria || label });
      b.addEventListener('click', function () {
        state[key] = !state[key];
        b.setAttribute('aria-pressed', String(state[key]));
        if (key === 'voice' && state.clock) state.clock.setVoice(state.voice);
        draw();
      });
      return b;
    }
    var tCaps = toggle('Subtítulos', 'captions');
    var tVoice = toggle('Voz', 'voice');
    var tInter = toggle('Preguntas interactivas', 'interactive');
    var tChap = toggle('Pausar al final de cada capítulo', 'chapterPause');
    var rateSel = el('select', { class: 'ctl-rate', 'aria-label': 'Velocidad' }, [el('option', { value: '1', text: 'Velocidad 1×' }), el('option', { value: '0.75', text: 'Velocidad 0,75×' })]);
    rateSel.addEventListener('change', function () { state.rate = parseFloat(rateSel.value); if (state.clock) state.clock.setRate(state.rate); });
    var btnFull = el('button', { type: 'button', class: 'ctl-full', text: 'Pantalla completa', 'aria-label': 'Pantalla completa' });
    btnFull.addEventListener('click', fullscreen);
    var btnDown = el('button', { type: 'button', class: 'ctl-down', text: 'Descargar video', 'aria-label': 'Descargar video' });
    var btnDownCh = el('button', { type: 'button', class: 'ctl-down-ch', text: 'Descargar este capítulo', 'aria-label': 'Descargar este capítulo' });
    var downPanel = el('div', { class: 'player-download', hidden: true, 'aria-live': 'polite' });
    btnDown.addEventListener('click', function () { download(false); });
    btnDownCh.addEventListener('click', function () { download(true); });

    var controls = el('div', { class: 'player-controls', role: 'group', 'aria-label': 'Controles del video' }, [
      el('div', { class: 'ctl-row' }, [btnPlay, scrub, time]),
      el('div', { class: 'ctl-row ctl-row-2' }, [chapSel, tCaps, tVoice, rateSel, tInter, tChap, btnFull, btnDown, btnDownCh])
    ]);

    var tr = el('details', { class: 'player-transcript' }, [el('summary', { text: 'Transcripción' }), el('div', { class: 'tr-body', html: transcriptHtml(video, { markup: opts.markup }) })]);
    var figsBox = el('details', { class: 'player-figs' }, [el('summary', { text: 'Cifras de este video' })]);
    var figsBody = el('div', { class: 'player-figs-body' });
    videoFigs(video).forEach(function (fid) { if (opts.figCard) figsBody.appendChild(opts.figCard(fid)); });
    figsBox.appendChild(figsBody);

    var wrap = el('section', { class: 'player', 'aria-label': 'Video: ' + video.title, tabindex: '-1' }, [
      el('h3', { class: 'player-title', text: video.title }), chapBar, stageBox, controls, downPanel, live, tr, figsBox
    ]);
    container.appendChild(wrap);
    P.el = wrap;

    // ---------- inicialización perezosa ----------
    function ensure() {
      if (state.stage) return;
      state.stage = EEP.engine.stage.create(id);
      var d = state.stage.duration;
      scrub.setAttribute('aria-valuemax', String(Math.round(d)));
      ticks.innerHTML = '';
      state.stage.timeline.scenes.forEach(function (s) { ticks.appendChild(el('span', { class: 'tick scene', style: 'left:' + (s.start / d * 100) + '%' })); });
      state.stage.chapters.forEach(function (c) { ticks.appendChild(el('span', { class: 'tick chapter', style: 'left:' + (c.start / d * 100) + '%', title: c.title })); });
      state.stage.timeline.checkpoints.forEach(function (c) { ticks.appendChild(el('span', { class: 'tick check', style: 'left:' + (c.start / d * 100) + '%', title: 'Pregunta' })); });
      state.stage.timeline.pauses.forEach(function (c) { ticks.appendChild(el('span', { class: 'tick pause', style: 'left:' + (c.start / d * 100) + '%', title: 'Pausa' })); });
      if (hasAudio(id)) state.clock = EEP.engine.narrator.audioClock('assets/audio/' + EEP.audioManifest[id].file, d);
      else {
        state.clock = EEP.engine.narrator.browserClock(d, EEP.engine.narrator.chunksOf(state.stage.timeline));
        note.hidden = false;
        if (!state.clock.hasVoice) note.textContent = 'Sin voz: este navegador no tiene voces; los subtítulos siguen activos.';
      }
      state.clock.onEnded = function () { finish(); };
      state.clock.setVoice(state.voice);
      state.clock.setRate(state.rate);
      resize();
      var resumeAt = EEP.store.get('pos:' + id, 0);
      var posterT = posterTime();
      state.t = 0;
      drawAt(posterT);
      buildPoster(resumeAt);
    }

    function posterTime() {
      var pst = video.poster || {};
      var sc = state.stage.timeline.scenes.filter(function (s) { return s.id === pst.scene; })[0] || state.stage.timeline.scenes[0];
      return sc.start + sc.dur * (pst.p == null ? 0.6 : pst.p);
    }

    function buildPoster(resumeAt) {
      poster.innerHTML = '';
      poster.hidden = false;
      var bPlay = el('button', { type: 'button', class: 'btn btn-big', html: '<span aria-hidden="true">→ </span>Reproducir', 'aria-label': 'Reproducir «' + video.title + '»' });
      bPlay.addEventListener('click', function () { seek(0); play(); });
      poster.appendChild(bPlay);
      if (resumeAt > 5 && resumeAt < state.stage.duration - 5) {
        bPlay.innerHTML = '<span aria-hidden="true">→ </span>Desde el inicio';
        bPlay.setAttribute('aria-label', 'Ver «' + video.title + '» desde el inicio');
        var bRes = el('button', { type: 'button', class: 'btn btn-big', html: '<span aria-hidden="true">→ </span>Continuar donde ibas (' + U.fmtTime(resumeAt) + ')' });
        bRes.addEventListener('click', function () { seek(resumeAt); play(); });
        poster.insertBefore(bRes, bPlay);
      }
    }

    function resize() {
      var w = canvas.clientWidth || 1280;
      var dpr = Math.min(2, root.devicePixelRatio || 1);
      var bw = Math.max(640, Math.min(2560, Math.round(w * dpr)));
      if (canvas.width !== bw) { canvas.width = bw; canvas.height = Math.round(bw * 9 / 16); }
      draw();
    }

    var ctx = canvas.getContext('2d');
    function drawAt(t) {
      if (!state.stage) return;
      ctx.__dpr = canvas.width / 1280;
      state.stage.renderFrame(ctx, t, { captions: state.captions, interactive: state.interactive && !state.recording });
      var d = state.stage.duration;
      fill.style.width = (t / d * 100) + '%';
      time.textContent = U.fmtTime(t) + ' / ' + U.fmtTime(d);
      scrub.setAttribute('aria-valuenow', String(Math.round(t)));
      scrub.setAttribute('aria-valuetext', U.fmtTime(t) + ' de ' + U.fmtTime(d));
      var ch = EEP.engine.timeline.chapterAt(state.stage.timeline, t);
      if (ch) {
        var ci = state.stage.chapters.indexOf(ch);
        if (chapSel.value !== String(ci)) chapSel.value = String(ci);
        Array.prototype.forEach.call(chapBar.children, function (b, i) { b.setAttribute('aria-current', i === ci ? 'true' : 'false'); });
      }
    }
    function draw() { drawAt(state.t); }

    // ---------- reproducción ----------
    function play() {
      ensure();
      players.forEach(function (o) { if (o !== P) o.pause(); });
      if (state.ended || state.t >= state.stage.duration - 0.05) { seek(0); state.ended = false; }
      hideOverlay();
      poster.hidden = true;
      state.playing = true;
      state.clock.seek(state.t);
      state.clock.play();
      btnPlay.textContent = '❚❚'; btnPlay.setAttribute('aria-label', 'Pausar');
      state.lastT = state.t;
      loop();
    }
    function pause() {
      if (!state.playing) return;
      state.playing = false;
      state.clock.pause();
      state.t = state.clock.time();
      cancelAnimationFrame(state.raf);
      btnPlay.textContent = '▶'; btnPlay.setAttribute('aria-label', 'Reproducir');
      EEP.store.set('pos:' + id, state.t);
      draw();
    }
    P.pause = pause;
    function seek(t) {
      ensure();
      state.t = Math.max(0, Math.min(state.stage.duration - 0.01, t));
      state.clock.seek(state.t);
      state.lastT = state.t;
      state.ended = false;
      hideOverlay();
      draw();
    }
    var lastSave = 0;
    function loop() {
      if (!state.playing) return;
      state.clock.tick();
      var t = state.clock.time();
      var prev = state.lastT;
      // preguntas interactivas: detener al cruzar el inicio de un segmento de pregunta o pausa
      if (state.interactive) {
        var segs = state.stage.timeline.checkpoints.concat(state.stage.timeline.pauses);
        for (var i = 0; i < segs.length; i++) {
          if (prev < segs[i].start && t >= segs[i].start) { state.t = segs[i].start; pause(); showCheck(segs[i]); return; }
        }
      }
      if (state.chapterPause) {
        var chs = state.stage.chapters;
        for (var k = 0; k < chs.length - 1; k++) {
          var end = chs[k].end;
          if (prev < end - 0.05 && t >= end - 0.05) { state.t = end - 0.05; pause(); showChapterEnd(chs[k + 1]); return; }
        }
      }
      state.t = t;
      state.lastT = t;
      draw();
      state.stage.prefetch(t);
      if (t - lastSave > 5) { lastSave = t; EEP.store.set('pos:' + id, t); }
      if (t >= state.stage.duration - 0.02) { finish(); return; }
      state.raf = requestAnimationFrame(loop);
    }
    function finish() {
      state.playing = false;
      state.ended = true;
      cancelAnimationFrame(state.raf);
      try { state.clock.pause(); } catch (e) {}
      btnPlay.textContent = '▶'; btnPlay.setAttribute('aria-label', 'Reproducir');
      EEP.store.remove('pos:' + id);
      state.t = state.stage.duration - 0.01;
      draw();
      overlay.innerHTML = '';
      var again = el('button', { type: 'button', class: 'btn btn-big', html: '<span aria-hidden="true">→ </span>Ver de nuevo' });
      again.addEventListener('click', function () { seek(0); play(); });
      overlay.appendChild(el('div', { class: 'overlay-center' }, [again]));
      overlay.hidden = false;
      overlay.classList.add('overlay-clear');
      again.focus();
    }

    // ---------- tarjetas interactivas ----------
    function hideOverlay() { overlay.hidden = true; overlay.innerHTML = ''; overlay.classList.remove('overlay-clear'); }
    function showCheck(seg) {
      overlay.innerHTML = '';
      overlay.classList.remove('overlay-clear');
      var c = seg.data;
      var card = el('div', { class: 'overlay-card' });
      var cont = el('button', { type: 'button', class: 'btn', html: '<span aria-hidden="true">→ </span>Continuar' });
      cont.addEventListener('click', function () { seek(seg.end); play(); });
      if (seg.kind === 'pause') {
        card.appendChild(el('p', { class: 'overlay-kicker', text: 'Pausa para conversar' }));
        card.appendChild(el('p', { class: 'overlay-q', text: c.prompt }));
        var left = c.seconds || 60;
        var cd = el('p', { class: 'overlay-count', text: 'Tiempo sugerido: ' + U.fmtTime(left) });
        card.appendChild(cd);
        var iv = setInterval(function () { left = Math.max(0, left - 1); cd.textContent = 'Tiempo sugerido: ' + U.fmtTime(left); if (!left || overlay.hidden) clearInterval(iv); }, 1000);
        card.appendChild(cont);
      } else {
        card.appendChild(el('p', { class: 'overlay-kicker', text: '¡Pausa! Piensa y responde' }));
        card.appendChild(el('p', { class: 'overlay-q', text: c.question }));
        var fb = el('div', { class: 'overlay-feedback', 'aria-live': 'assertive' });
        var opts2 = el('div', { class: 'overlay-options', role: 'group', 'aria-label': 'Opciones' });
        c.options.forEach(function (o, i) {
          var b = el('button', { type: 'button', class: 'btn-option', text: o });
          b.addEventListener('click', function () {
            fb.innerHTML = '';
            if (i === c.answer) {
              b.classList.add('is-correct');
              fb.appendChild(el('p', { class: 'feedback-correct', html: '<span class="pill" aria-hidden="true">✓</span> <strong>¡Muy bien!</strong> ' + U.escapeHtml(c.explain) }));
              Array.prototype.forEach.call(opts2.children, function (x) { x.disabled = true; });
              cont.hidden = false; cont.focus();
            } else {
              b.classList.add('is-wrong'); b.disabled = true;
              fb.appendChild(el('p', { class: 'feedback-retry', html: '<span class="pill" aria-hidden="true">↺</span> Casi. Pista: ' + U.escapeHtml(c.hint) }));
            }
          });
          opts2.appendChild(b);
        });
        card.appendChild(opts2);
        card.appendChild(fb);
        cont.hidden = true;
        card.appendChild(el('div', { class: 'overlay-actions' }, [cont]));
      }
      overlay.appendChild(card);
      overlay.hidden = false;
      var first = card.querySelector('button');
      if (first) first.focus();
    }
    function showChapterEnd(next) {
      overlay.innerHTML = '';
      overlay.classList.add('overlay-clear');
      var b = el('button', { type: 'button', class: 'btn btn-big', html: '<span aria-hidden="true">→ </span>Continuar con: ' + U.escapeHtml(next.title) });
      b.addEventListener('click', function () { seek(next.start); play(); });
      overlay.appendChild(el('div', { class: 'overlay-center' }, [b]));
      overlay.hidden = false;
      b.focus();
    }

    // ---------- barra de posición ----------
    function posFromEvent(e) {
      var r = scrub.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      return U.clamp(x / r.width, 0, 1) * state.stage.duration;
    }
    var dragging = false;
    scrub.addEventListener('pointerdown', function (e) { ensure(); dragging = true; scrub.setPointerCapture(e.pointerId); var was = state.playing; pause(); seek(posFromEvent(e)); scrub._was = was; });
    scrub.addEventListener('pointermove', function (e) {
      if (!state.stage) return;
      var t = posFromEvent(e);
      if (dragging) { seek(t); return; }
      showPreview(e, t);
    });
    scrub.addEventListener('pointerup', function () { if (dragging) { dragging = false; if (scrub._was) play(); } });
    scrub.addEventListener('pointerleave', function () { preview.hidden = true; });
    scrub.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { seek(state.t + 5); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { seek(state.t - 5); e.preventDefault(); }
    });
    var prevStage = null, prevPending = 0;
    function showPreview(e, t) {
      var r = scrub.getBoundingClientRect();
      preview.hidden = false;
      preview.style.left = U.clamp((t / state.stage.duration) * r.width - 96, 0, Math.max(0, r.width - 192)) + 'px';
      var ch = EEP.engine.timeline.chapterAt(state.stage.timeline, t);
      preview.lastChild.textContent = (ch ? ch.title + ' · ' : '') + U.fmtTime(t);
      var nowMs = performance.now();
      if (nowMs - prevPending < 120) return;
      prevPending = nowMs;
      if (!prevStage) prevStage = EEP.engine.stage.create(id); // caché de capas propia: no desaloja la escena que suena
      var pc = preview.firstChild.getContext('2d');
      pc.__dpr = 192 / 1280;
      prevStage.renderFrame(pc, t, { captions: false, interactive: true });
    }

    // ---------- pantalla completa y teclado ----------
    function fullscreen() {
      var target = stageBox;
      try {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (target.requestFullscreen) target.requestFullscreen();
      } catch (e) {}
    }
    document.addEventListener('fullscreenchange', function () { setTimeout(resize, 50); });
    wrap.addEventListener('keydown', function (e) {
      if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      var k = e.key;
      if ((k === ' ' && e.target.tagName !== 'BUTTON') || k === 'k' || k === 'K') { e.preventDefault(); state.playing ? pause() : play(); }
      else if (k === 'ArrowRight' && e.target !== scrub) { ensure(); if (e.shiftKey) jumpChapter(1); else seek(state.t + 5); e.preventDefault(); }
      else if (k === 'ArrowLeft' && e.target !== scrub) { ensure(); if (e.shiftKey) jumpChapter(-1); else seek(state.t - 5); e.preventDefault(); }
      else if (k === 'c' || k === 'C') { tCaps.click(); }
      else if (k === 'f' || k === 'F') { fullscreen(); }
    });
    function jumpChapter(d) {
      var chs = state.stage.chapters;
      var cur = EEP.engine.timeline.chapterAt(state.stage.timeline, state.t);
      var i = Math.max(0, Math.min(chs.length - 1, chs.indexOf(cur) + d));
      seek(chs[i].start);
    }
    btnPlay.addEventListener('click', function () { state.playing ? pause() : play(); });
    canvas.addEventListener('click', function () { if (state.stage) { state.playing ? pause() : play(); } });

    // ---------- descarga ----------
    function download(chapterOnly) {
      ensure();
      var exp = EEP.videoExports && EEP.videoExports[id];
      downPanel.innerHTML = '';
      downPanel.hidden = false;
      if (exp && !chapterOnly) {
        downPanel.appendChild(el('p', {}, [el('a', { class: 'btn', href: 'assets/video/' + exp.file, download: exp.file, html: '<span aria-hidden="true">→ </span>Descargar MP4' })]));
        return;
      }
      var from = 0, to = state.stage.duration;
      if (chapterOnly) { var ch = EEP.engine.timeline.chapterAt(state.stage.timeline, state.t) || state.stage.chapters[0]; from = ch.start; to = ch.end; }
      var voiceOk = hasAudio(id) && root.location.protocol !== 'file:';
      var msg = 'La grabación se hace en tiempo real y tarda ' + U.fmtTime(to - from) + '. La pestaña debe permanecer visible mientras tanto.';
      if (!voiceOk) msg += ' La voz no se puede grabar desde un archivo abierto directamente o con la voz del navegador: el video se grabará sin voz. El archivo LÉAME explica cómo servir la carpeta para grabar con voz.';
      downPanel.appendChild(el('p', { text: msg }));
      var go = el('button', { type: 'button', class: 'btn', html: '<span aria-hidden="true">→ </span>Empezar la grabación' });
      var cancel = el('button', { type: 'button', class: 'btn btn-outline', text: 'Cancelar' });
      var prog = el('p', { class: 'download-progress', 'aria-live': 'polite' });
      cancel.addEventListener('click', function () { downPanel.hidden = true; if (P._rec) P._rec.cancel && P._rec.cancel(); });
      go.addEventListener('click', function () {
        pause();
        go.disabled = true;
        state.recording = true;
        var rc = { canvas: canvas, audioEl: state.clock.el, withAudio: voiceOk, from: from, to: to, slug: video.slug + (chapterOnly ? '-capitulo' : ''),
          drawAt: function (t) { state.t = t; drawAt(t); },
          onProgress: function (f) { prog.textContent = 'Grabando: ' + Math.round(f * 100) + ' %'; } };
        P._rec = rc;
        EEP.engine.recorder.record(rc).then(function (ext) {
          state.recording = false; prog.textContent = 'Listo: se descargó el archivo ' + rc.slug + '.' + ext + '.'; go.disabled = false;
        }).catch(function (e) { state.recording = false; prog.textContent = e.message; go.disabled = false; });
      });
      downPanel.appendChild(el('div', { class: 'overlay-actions' }, [go, cancel]));
      downPanel.appendChild(prog);
    }

    // ---------- visibilidad ----------
    if ('IntersectionObserver' in root) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) ensure();
          else if (state.playing) pause();
        });
      }, { rootMargin: '200px' });
      io.observe(wrap);
      P.disconnect = function () { io.disconnect(); };
    } else ensure();
    root.addEventListener('resize', function () { if (state.stage) resize(); });

    P.play = play; P.seek = seek; P.ensure = ensure;
    P.setChapterPause = function (on) { state.chapterPause = on; tChap.setAttribute('aria-pressed', String(on)); };
    P.destroy = function () {
      pause();
      if (state.clock) state.clock.destroy();
      if (P.disconnect) P.disconnect();
      players.splice(players.indexOf(P), 1);
      wrap.remove();
    };
    players.push(P);
    return P;
  }

  function pauseAll() { players.forEach(function (p) { p.pause(); }); }
  function destroyAll() { players.slice().forEach(function (p) { p.destroy(); }); }

  EEP.engine.player = { mount: mount, pauseAll: pauseAll, destroyAll: destroyAll, transcriptHtml: transcriptHtml, videoFigs: videoFigs };
})(window);
