/* Narración en tiempo de ejecución (base §4.6): pista de audio como reloj maestro (suavizado, base §3)
   o voz del navegador por trozos de subtítulo como respaldo. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var now = function () { return root.performance ? root.performance.now() / 1000 : Date.now() / 1000; };

  // ---------- reloj de pista de audio ----------
  function audioClock(src, duration) {
    var a = new Audio();
    a.preload = 'metadata';
    a.src = src;
    try { a.preservesPitch = true; a.mozPreservesPitch = true; a.webkitPreservesPitch = true; } catch (e) {}
    var anchorT = 0, anchorWall = now(), lastSeen = -1, rate = 1, playing = false, muted = false;
    var c = {
      mode: 'audio', el: a, duration: duration,
      play: function () { playing = true; anchorT = a.currentTime; anchorWall = now(); var pr = a.play(); if (pr && pr.catch) pr.catch(function () {}); },
      pause: function () { playing = false; a.pause(); anchorT = a.currentTime; },
      seek: function (t) { try { a.currentTime = Math.max(0, Math.min(duration, t)); } catch (e) {} anchorT = t; anchorWall = now(); lastSeen = -1; },
      setRate: function (r) { rate = r; a.playbackRate = r; anchorT = c.time(); anchorWall = now(); },
      setVoice: function (on) { muted = !on; a.muted = muted; },
      // Tiempo suavizado: performance.now desde el último cambio observado de currentTime, reanclado si se separan más de 40 ms.
      time: function () {
        if (!playing) return a.currentTime || anchorT;
        var ct = a.currentTime;
        if (ct !== lastSeen) {
          var est = anchorT + (now() - anchorWall) * rate;
          if (Math.abs(est - ct) > 0.04 || lastSeen < 0) { anchorT = ct; anchorWall = now(); }
          lastSeen = ct;
        }
        return Math.min(duration, anchorT + (now() - anchorWall) * rate);
      },
      tick: function () {},
      isPlaying: function () { return playing; },
      ended: function () { return a.ended || c.time() >= duration - 0.02; },
      destroy: function () { a.pause(); a.removeAttribute('src'); try { a.load(); } catch (e) {} }
    };
    a.addEventListener('ended', function () { playing = false; if (c.onEnded) c.onEnded(); });
    return c;
  }

  // ---------- voces del navegador ----------
  var voicesReady = null;
  function getVoices() {
    if (voicesReady) return voicesReady;
    voicesReady = new Promise(function (res) {
      var ss = root.speechSynthesis;
      if (!ss) { res([]); return; }
      var v = ss.getVoices();
      if (v && v.length) { res(v); return; }
      var done = false;
      ss.addEventListener('voiceschanged', function () { if (!done) { done = true; res(ss.getVoices()); } });
      setTimeout(function () { if (!done) { done = true; res(ss.getVoices() || []); } }, 2500);
    });
    return voicesReady;
  }

  var FEMALE = /(female|mujer|dalia|salome|andrea|helena|laura|elvira|paloma|sabina|monica|mónica|paulina|camila|ximena|lupe|catalina|elena|isabela|luciana)/i;
  var MALE = /(male|hombre|jorge|gonzalo|alex|gerardo|pablo|raul|raúl|alvaro|álvaro|diego|juan|carlos|jorge|tomas|tomás|andres|andrés|liberto)/i;

  // Elige una voz por rol según spec §5.5; devuelve { voice, rate, pitch }.
  function chooseVoices(voices) {
    var es = voices.filter(function (v) { return /^es/i.test(v.lang); });
    var out = {};
    var cast = (EEP.data.cast || []).filter(function (c) { return c.voice; });
    cast.forEach(function (c) {
      var b = c.browser || {};
      var pick = null;
      if (b.first) pick = es.filter(function (v) { return v.name.indexOf(b.first.name) >= 0 && v.lang.replace('_', '-').toLowerCase().indexOf(b.first.lang.toLowerCase()) === 0; })[0];
      (b.then || []).forEach(function (n) { if (!pick) pick = es.filter(function (v) { return v.name === n; })[0]; });
      if (!pick && b.lang) pick = es.filter(function (v) { return v.lang.indexOf(b.lang) === 0 && (b.gender === 'male' ? MALE : FEMALE).test(v.name); })[0];
      if (!pick) {
        var used = b.notSameAs && out[b.notSameAs] && out[b.notSameAs].voice;
        pick = es.filter(function (v) { return (b.gender === 'male' ? MALE : FEMALE).test(v.name) && v !== used; })[0];
      }
      var rate = 1, pitch = 1;
      if (!pick) {
        if (b.last && b.last.as && out[b.last.as]) pick = out[b.last.as].voice;
        else pick = es[0] || null;
        if (b.last) { rate = b.last.rate || 1; pitch = b.last.pitch || 1; }
      }
      out[c.id] = { voice: pick, rate: rate, pitch: pitch };
    });
    // Si hay menos voces distintas que roles, variar tono y velocidad por rol.
    var seen = [];
    Object.keys(out).forEach(function (k, i) {
      var v = out[k].voice;
      if (v && seen.indexOf(v) >= 0) { out[k].pitch *= (i % 2 ? 0.86 : 1.14); out[k].rate *= (i % 2 ? 0.94 : 1.04); }
      seen.push(v);
    });
    return out;
  }

  // Reloj interno con voz del navegador por trozos. chunks: [{ start, end, text, voice }] en tiempo absoluto.
  function browserClock(duration, chunks) {
    var base = 0, wall = now(), rate = 1, playing = false, voiceOn = true, next = 0, holdUntil = null;
    var ss = root.speechSynthesis;
    var map = null, speaking = null;
    getVoices().then(function (v) { map = chooseVoices(v); });
    function cancel() { try { if (ss) ss.cancel(); } catch (e) {} speaking = null; holdUntil = null; }
    function locate(t) { next = 0; while (next < chunks.length && chunks[next].start < t - 0.05) next++; }
    var c = {
      mode: 'browser', duration: duration, hasVoice: !!ss,
      play: function () { playing = true; wall = now(); },
      pause: function () { base = c.time(); playing = false; cancel(); },
      seek: function (t) { base = Math.max(0, Math.min(duration, t)); wall = now(); cancel(); locate(base); },
      setRate: function (r) { base = c.time(); wall = now(); rate = r; },
      setVoice: function (on) { voiceOn = on; if (!on) cancel(); },
      time: function () {
        if (!playing) return base;
        if (holdUntil != null) return holdUntil;
        return Math.min(duration, base + (now() - wall) * rate);
      },
      tick: function () {
        if (!playing || !ss || !voiceOn) return;
        var t = c.time();
        // retener el cuadro si la locución sigue sonando cuando acaba su espacio
        if (speaking && next < chunks.length && t >= chunks[next].start && holdUntil == null) {
          holdUntil = t; base = t; wall = now();
        }
        if (speaking || !map) return;
        if (holdUntil != null) { base = holdUntil; wall = now(); holdUntil = null; }
        while (next < chunks.length && chunks[next].end < t) next++;
        if (next < chunks.length && t >= chunks[next].start) {
          var ch = chunks[next++];
          var v = map[ch.voice] || {};
          var u = new root.SpeechSynthesisUtterance(ch.say || ch.text);
          if (v.voice) { u.voice = v.voice; u.lang = v.voice.lang; } else u.lang = 'es-CO';
          u.rate = (v.rate || 1) * rate;
          u.pitch = v.pitch || 1;
          speaking = u;
          u.onend = u.onerror = function () { if (speaking === u) speaking = null; };
          try { ss.speak(u); } catch (e) { speaking = null; }
        }
      },
      isPlaying: function () { return playing; },
      ended: function () { return c.time() >= duration - 0.02; },
      destroy: function () { cancel(); }
    };
    return c;
  }

  // Trozos absolutos de una línea de tiempo (para la voz del navegador).
  function chunksOf(tl) {
    var out = [];
    tl.scenes.forEach(function (sc) {
      sc.lines.forEach(function (l) {
        l.chunks.forEach(function (ch) {
          out.push({ start: sc.start + l.start + ch.start, end: sc.start + l.start + ch.end, text: ch.text, voice: l.voice });
        });
      });
    });
    return out;
  }

  EEP.engine.narrator = { audioClock: audioClock, browserClock: browserClock, chunksOf: chunksOf, getVoices: getVoices, chooseVoices: chooseVoices };
})(window);
