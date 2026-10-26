/* Tiempos de escenas, líneas, trozos, preguntas y capítulos (base §2.2). Funciones puras: sin DOM ni lienzo,
   para que el reproductor y las herramientas calculen los mismos tiempos. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var LEAD = 0.6, GAP = 0.5, GAP_TURN = 0.35, TAIL = 1.2, CHECK = 6, PAUSE = 6, XFADE = 0.8;

  // Palabras que se dirán: cada número se cuenta por las palabras que necesita al leerse.
  function spokenWords(text) {
    var s = String(text || '');
    var words = 0;
    s.split(/\s+/).forEach(function (w) {
      if (!w) return;
      var digits = w.replace(/[^\d]/g, '');
      if (!digits) { if (/[A-Za-zÁÉÍÓÚÑáéíóúñü]/.test(w)) words++; return; }
      var groups = w.split(/[.,]/).filter(function (g) { return /\d/.test(g); });
      groups.forEach(function (g) { var n = g.replace(/\D/g, '').length; words += n <= 2 ? 2 : n === 3 ? 3 : 4; });
      if (/,\d/.test(w)) words += 1; // «coma»
      if (/%/.test(w)) words += 2; // «por ciento»
    });
    return Math.max(1, words);
  }

  function lineText(line) { return line.say || line.text || ''; }

  function wpsFor(voice, cast) {
    var list = cast || (EEP.data && EEP.data.cast) || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === voice) return list[i].wordsPerSecond || 2.4;
    return 2.4;
  }

  // Duración estimada de una línea (sin audio).
  function estimateLine(line, cast, rate) {
    var wps = wpsFor(line.voice, cast) * (rate || 1);
    return spokenWords(lineText(line)) / wps;
  }

  function manifestLine(man, sceneId, index) {
    if (!man || !man.lines) return null;
    for (var i = 0; i < man.lines.length; i++) {
      var l = man.lines[i];
      if (l.scene === sceneId && l.index === index) return l;
    }
    return null;
  }

  // build(video, { cast, manifest, chunk }) → timeline
  function build(video, opts) {
    opts = opts || {};
    var cast = opts.cast;
    var man = opts.manifest || null;
    var chunkFn = opts.chunk || (EEP.engine.captions && EEP.engine.captions.chunk) || function (s) { return [s]; };
    var t = 0;
    var scenes = [], segments = [], checkpoints = [], pauses = [];
    var cps = video.checkpoints || [], ps = video.pauses || [];
    (video.scenes || []).forEach(function (sc, si) {
      var lines = [];
      var lt = LEAD;
      var prevVoice = null;
      (sc.lines || []).forEach(function (ln, li) {
        if (li > 0) lt += (ln.voice !== prevVoice ? GAP_TURN : GAP);
        var ml = manifestLine(man, sc.id, li);
        var dur = ml ? ml.dur : estimateLine(ln, cast, opts.rate);
        var chunksText = chunkFn(ln.text || '');
        var chunks;
        if (ml && ml.chunks && ml.chunks.length === chunksText.length) {
          chunks = ml.chunks.map(function (c, ci) {
            return { text: chunksText[ci], start: c.at, end: (ci + 1 < ml.chunks.length ? ml.chunks[ci + 1].at : dur) };
          });
        } else {
          var total = chunksText.reduce(function (a, c) { return a + c.length; }, 0) || 1;
          var acc = 0;
          chunks = chunksText.map(function (c) {
            var st = acc / total * dur; acc += c.length;
            return { text: c, start: st, end: acc / total * dur };
          });
        }
        lines.push({ index: li, voice: ln.voice, text: ln.text, start: lt, end: lt + dur, dur: dur, chunks: chunks, misreading: !!ln.misreading });
        lt += dur + (ln.pause || 0);
        prevVoice = ln.voice;
      });
      var need = lines.length ? lt + TAIL : 0;
      var dur = Math.max(sc.min || 0, need);
      var scene = { id: sc.id, index: si, type: sc.type, start: t, end: t + dur, dur: dur, lines: lines, data: sc };
      scenes.push(scene);
      segments.push({ kind: 'scene', start: t, end: t + dur, scene: scene });
      t += dur;
      cps.forEach(function (c, ci) {
        if (c.after !== sc.id) return;
        var cp = { kind: 'checkpoint', index: ci, start: t, end: t + CHECK, data: c, after: sc.id };
        checkpoints.push(cp); segments.push(cp); t += CHECK;
      });
      ps.forEach(function (c, ci) {
        if (c.after !== sc.id) return;
        var pp = { kind: 'pause', index: ci, start: t, end: t + PAUSE, data: c, after: sc.id };
        pauses.push(pp); segments.push(pp); t += PAUSE;
      });
    });
    var chapters = (video.chapters || []).map(function (ch) {
      var sc = scenes.filter(function (s) { return s.id === ch.from; })[0];
      return { title: ch.title, from: ch.from, start: sc ? sc.start : 0 };
    });
    chapters.forEach(function (ch, i) { ch.end = i + 1 < chapters.length ? chapters[i + 1].start : t; });
    return { id: video.id, duration: t, scenes: scenes, segments: segments, checkpoints: checkpoints, pauses: pauses, chapters: chapters };
  }

  // Segmento activo en t (búsqueda binaria).
  function segmentAt(tl, t) {
    var a = tl.segments, lo = 0, hi = a.length - 1;
    if (!a.length) return null;
    if (t <= a[0].start) return a[0];
    if (t >= a[hi].end) return a[hi];
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      if (t < a[mid].start) hi = mid - 1;
      else if (t >= a[mid].end) lo = mid + 1;
      else return a[mid];
    }
    return a[Math.max(0, Math.min(a.length - 1, lo))];
  }

  function chapterAt(tl, t) {
    var c = null;
    for (var i = 0; i < tl.chapters.length; i++) if (tl.chapters[i].start <= t + 1e-6) c = tl.chapters[i];
    return c;
  }

  // Estado `s` de la escena para las funciones de dibujo (base §1.4).
  function sceneState(scene, t) {
    var lt = t - scene.start;
    var dur = scene.dur;
    var lines = scene.lines;
    var line = -1;
    for (var i = 0; i < lines.length; i++) if (lt >= lines[i].start) line = i;
    var cur = line >= 0 ? lines[line] : null;
    var speaking = cur && lt <= cur.end ? cur.voice : null;
    function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
    return {
      t: lt,
      p: clamp(lt / dur),
      dur: dur,
      intro: clamp(lt / 1),
      outro: clamp((lt - (dur - 1)) / 1),
      lines: lines.map(function (l) { return { start: l.start, end: l.end, voice: l.voice }; }),
      line: line,
      lineP: cur ? clamp((lt - cur.start) / Math.max(0.01, cur.dur)) : 0,
      at: function (k) {
        if (k < 0) return clamp(lt / 0.8);
        if (k >= lines.length) return 0;
        var l = lines[k];
        // la transición visual de cada beat dura lo que dure la línea, como máximo 1,2 s
        return clamp((lt - l.start) / Math.min(1.2, Math.max(0.4, l.dur)));
      },
      speaker: speaking
    };
  }

  // Trozo de subtítulo activo en t.
  function chunkAt(scene, t) {
    var lt = t - scene.start;
    for (var i = 0; i < scene.lines.length; i++) {
      var l = scene.lines[i];
      if (lt < l.start - 0.05 || lt > l.end + 0.25) continue;
      var rel = lt - l.start;
      for (var j = 0; j < l.chunks.length; j++) {
        var c = l.chunks[j];
        var end = j + 1 < l.chunks.length ? l.chunks[j + 1].start : l.dur + 0.25;
        if (rel >= c.start - 0.05 && rel < end) {
          var fadeIn = Math.min(1, (rel - c.start + 0.05) / 0.15);
          var fadeOut = Math.min(1, (end - rel) / 0.15);
          return { line: l, chunk: c, index: j, alpha: Math.max(0, Math.min(fadeIn, fadeOut)) };
        }
      }
    }
    return null;
  }

  EEP.engine.timeline = {
    LEAD: LEAD, GAP: GAP, GAP_TURN: GAP_TURN, TAIL: TAIL, CHECK: CHECK, PAUSE: PAUSE, XFADE: XFADE,
    spokenWords: spokenWords, estimateLine: estimateLine, build: build,
    segmentAt: segmentAt, chapterAt: chapterAt, sceneState: sceneState, chunkAt: chunkAt
  };
})(typeof window !== 'undefined' ? window : globalThis);
