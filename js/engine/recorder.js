/* Descarga de video grabando una pasada lineal en tiempo real (base §3, «Descargar video»). */
(function (root) {
  'use strict';
  var EEP = root.EEP;

  function pickType() {
    var MR = root.MediaRecorder;
    if (!MR) return null;
    var types = ['video/mp4;codecs=avc1,mp4a', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm'];
    for (var i = 0; i < types.length; i++) if (MR.isTypeSupported && MR.isTypeSupported(types[i])) return types[i];
    return '';
  }

  // record({ canvas, audioEl, from, to, slug, onProgress, drawAt(t), withAudio }) → Promise
  function record(o) {
    return new Promise(function (resolve, reject) {
      var type = pickType();
      if (type === null) { reject(new Error('Este navegador no permite grabar video.')); return; }
      var stream = o.canvas.captureStream(24);
      var actx = null;
      if (o.withAudio && o.audioEl) {
        try {
          actx = new (root.AudioContext || root.webkitAudioContext)();
          var srcNode = actx.createMediaElementSource(o.audioEl);
          var dest = actx.createMediaStreamDestination();
          srcNode.connect(dest);
          srcNode.connect(actx.destination);
          dest.stream.getAudioTracks().forEach(function (tr) { stream.addTrack(tr); });
        } catch (e) { /* sin voz */ }
      }
      var chunks = [];
      var rec = new root.MediaRecorder(stream, type ? { mimeType: type, videoBitsPerSecond: 6e6 } : undefined);
      rec.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = function () {
        var mime = rec.mimeType || type || 'video/webm';
        var ext = /mp4/.test(mime) ? 'mp4' : 'webm';
        var blob = new Blob(chunks, { type: mime });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = o.slug + '.' + ext;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
        if (actx) try { actx.close(); } catch (e) {}
        resolve(ext);
      };
      var t0 = performance.now() / 1000;
      var dur = o.to - o.from;
      if (o.audioEl && o.withAudio) { o.audioEl.currentTime = o.from; o.audioEl.play().catch(function () {}); }
      rec.start(1000);
      var stopped = false;
      function frame() {
        if (stopped) return;
        var el = o.audioEl && o.withAudio ? o.audioEl.currentTime - o.from : performance.now() / 1000 - t0;
        var t = o.from + Math.min(dur, el);
        o.drawAt(t);
        if (o.onProgress) o.onProgress(Math.min(1, el / dur));
        if (el >= dur) { stopped = true; if (o.audioEl) o.audioEl.pause(); rec.stop(); return; }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
      o.cancel = function () { stopped = true; try { rec.stop(); } catch (e) {} };
    });
  }

  EEP.engine.recorder = { record: record, pickType: pickType };
})(window);
