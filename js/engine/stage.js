/* Composición de un cuadro de video: fondo del estilo, escena, fundidos, capítulo, viñeta de hablante,
   subtítulos y tarjetas de pregunta en modo lineal. renderFrame(t) es determinista (base §2.1). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var W = 1280, H = 720;

  function videoData(id) {
    var list = EEP.data.videos || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function castEntry(id) {
    var list = EEP.data.cast || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function create(id, opts) {
    opts = opts || {};
    var E = EEP.engine, S = EEP.style;
    var video = videoData(id);
    var mod = EEP.videos[id];
    if (!video || !mod) throw new Error('Video no disponible: ' + id);
    var manifest = opts.manifest !== undefined ? opts.manifest : ((EEP.audioManifest || {})[id] || null);
    var tl = E.timeline.build(video, { cast: EEP.data.cast, manifest: manifest });
    var env = {
      W: W, H: H, rng: E.rng, ease: E.ease, style: S, course: EEP.course, legend: E.legend,
      charts: E.charts, cards: E.cards, data: EEP.data, video: video, util: EEP.util,
      cast: castEntry, cache: null, layers: null, scene: null
    };
    env.cache = E.layers.create(function (sceneId) {
      var f = mod.layers && mod.layers[sceneId];
      return f ? f(env) : {};
    }, 2);
    if (mod.setup) mod.setup(env);

    // Texto de la escena: todo texto en pantalla viene de `texts`.
    function bindScene(scene) {
      env.scene = scene.data;
      env.text = function (k) { var tx = scene.data.texts || {}; return tx[k] == null ? '' : tx[k]; };
      env.layers = env.cache.get(scene.id);
    }

    function drawSceneBody(ctx, scene, t) {
      var s = E.timeline.sceneState(scene, t);
      bindScene(scene);
      ctx.save();
      S.background(ctx, scene.type, { t: t, seed: E.hash(scene.id) % 997, columns: scene.data.columns, corner: scene.data.corner, plant: scene.data.plant });
      var zones = [];
      env.zones = zones;
      S.ambient(ctx, scene.type, t, E.hash(scene.id) % 101, scene.data.zones || null);
      var drift = (scene.type === 'figure' || scene.type === 'compare') ? 0 : 1;
      if (drift && !S.reduced) {
        var k = 1 + 0.012 * E.ease.inOut(s.p);
        ctx.translate(W / 2, H / 2); ctx.scale(k, k); ctx.translate(-W / 2 - 4 * s.p, -H / 2);
      }
      var res = null;
      var f = mod.scenes && mod.scenes[scene.id];
      if (f) res = f(ctx, s, env) || null;
      ctx.restore();
      // Insignias fijas de la escena
      if (scene.data.ficcion) S.mark(ctx, 'badge', { x: W - 72, y: 22 }, { text: EEP.data.site.ui.personajes, variant: 'state', glyph: 'g-personajes', align: 'right', size: 15, p: E.ease.clamp((t - scene.start) / 0.6) });
      if (scene.data.ejemplo) S.mark(ctx, 'badge', { x: W - 72, y: 66 }, { text: EEP.data.site.ui.ejemplo, variant: 'state', glyph: 'g-ejemplo', align: 'right', size: 15 });
      return { s: s, res: res };
    }

    function drawCheckpointCard(ctx, seg, t, interactive) {
      var c = seg.data;
      var lt = t - seg.start;
      S.background(ctx, 'card', {});
      var box = { x: 190, y: 96, w: 900, h: 470 };
      S.mark(ctx, 'card', box, { p: E.ease.clamp(lt / 0.6), hole: true });
      var answer = !interactive && lt >= 4;
      var head = seg.kind === 'pause' ? (interactive ? 'Pausa para conversar' : 'Pausen el video y conversen') : (interactive ? '¡Pausa! Piensa y responde' : 'Pausa el video y respondan en grupo');
      S.text(ctx, head, { x: box.x + 56, y: box.y + 66, size: 22, face: 'display', p: E.ease.clamp((lt - 0.2) / 0.4) });
      var q = seg.kind === 'pause' ? c.prompt : c.question;
      var qr = S.text(ctx, q, { x: box.x + 56, y: box.y + 122, size: 32, weight: 700, maxWidth: box.w - 112, p: E.ease.clamp((lt - 0.3) / 0.4) });
      if (seg.kind === 'checkpoint') {
        var y = box.y + 122 + qr.height + 18;
        c.options.forEach(function (op, i) {
          var isAns = i === c.answer;
          var a = answer ? (isAns ? 1 : 0.38) : 1;
          var letter = String.fromCharCode(65 + i);
          ctx.save(); ctx.globalAlpha *= a;
          S.pill(ctx, { x: box.x + 56, y: y - 4, w: 40, h: 40 }, { role: 'dark' });
          S.text(ctx, letter, { x: box.x + 76, y: y + 16, size: 20, face: 'display', role: 'on-dark', align: 'center', baseline: 'middle' });
          var r = S.text(ctx, op, { x: box.x + 112, y: y + 24, size: 24, maxWidth: box.w - 180, p: E.ease.clamp((lt - 0.5 - i * 0.2) / 0.4) });
          ctx.restore();
          y += Math.max(48, r.height + 18);
        });
        if (answer) {
          var ap = E.ease.clamp((lt - 4) / 0.5);
          S.mark(ctx, 'correct', { x: box.x + 56, y: y + 4, h: 40 }, { p: ap });
          S.text(ctx, c.explain, { x: box.x + 56, y: y + 82, size: 21, maxWidth: box.w - 112, p: ap, lineHeight: 1.3 });
        } else if (!interactive) {
          var n = 3 - Math.floor(Math.max(0, lt - 1));
          if (lt >= 1 && n >= 1) {
            ctx.save();
            ctx.fillStyle = S.role('dark');
            ctx.beginPath(); ctx.arc(box.x + box.w - 70, box.y + 60, 30, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
            S.text(ctx, String(n), { x: box.x + box.w - 70, y: box.y + 60, size: 30, weight: 700, role: 'on-dark', align: 'center', baseline: 'middle' });
          }
        }
      }
    }

    function drawSegment(ctx, seg, t, o) {
      if (seg.kind === 'scene') return drawSceneBody(ctx, seg.scene, t);
      drawCheckpointCard(ctx, seg, t, o.interactive);
      return null;
    }

    // renderFrame(ctx, t, { captions, interactive })
    function renderFrame(ctx, t, o) {
      o = o || {};
      t = Math.max(0, Math.min(tl.duration - 1e-3, t));
      var seg = E.timeline.segmentAt(tl, t);
      if (!seg) return;
      var idx = tl.segments.indexOf(seg);
      ctx.save();
      ctx.setTransform(ctx.__dpr || 1, 0, 0, ctx.__dpr || 1, 0, 0);
      var out = null;
      var into = t - seg.start;
      if (idx > 0 && into < E.timeline.XFADE && !S.reduced) {
        var prev = tl.segments[idx - 1];
        drawSegment(ctx, prev, prev.end - 1e-3, o);
        ctx.save();
        ctx.globalAlpha = E.ease.inOut(into / E.timeline.XFADE);
        out = drawSegment(ctx, seg, t, o);
        ctx.restore();
      } else {
        out = drawSegment(ctx, seg, t, o);
      }
      if (seg.kind === 'scene') {
        var scene = seg.scene;
        var s = out && out.s;
        var on = (out && out.res && out.res.on) || {};
        // Viñeta o etiqueta del hablante
        if (s && s.speaker && s.speaker !== 'narrador') {
          var ce = castEntry(s.speaker);
          var l = scene.lines[s.line];
          var lt = t - scene.start;
          var va = E.ease.clamp((lt - l.start + 0.3) / 0.4) * E.ease.clamp((l.end + 0.3 - lt) / 0.3);
          if (ce && va > 0) {
            var pos = on[s.speaker];
            if (pos) {
              var m = S.labelBar(ctx, ce.label, { x: 0, y: 0, size: 20, measureOnly: true });
              var lx = Math.max(72, Math.min(W - 72 - m.w, pos.x - m.w / 2));
              S.mark(ctx, 'speaking', { x: lx, y: Math.max(24, pos.y - m.h - 14) }, { text: ce.label, size: 20, p: va });
            } else {
              S.person(ctx, ce, { vignette: true, x: 72 + 60, y: 470, label: ce.label, p: va });
            }
          }
        }
        // Pestaña de capítulo durante 2 s al empezar un capítulo
        tl.chapters.forEach(function (ch) {
          var d = t - ch.start;
          if (d < 0 || d > 2.9) return;
          S.mark(ctx, 'chapter', { w: 330, h: 96 }, { text: ch.title, p: E.ease.clamp(d / 0.45), out: E.ease.clamp((d - 2.4) / 0.5) });
        });
        // Subtítulos
        if (o.captions !== false) {
          var ck = E.timeline.chunkAt(scene, t);
          if (ck) {
            var ce2 = castEntry(ck.line.voice);
            var name = ck.line.voice !== 'narrador' && ce2 ? ce2.name : null;
            E.captions.drawBand(ctx, { speaker: name, text: ck.chunk.text, alpha: ck.alpha });
          }
        }
      }
      // Fundido suave al final
      var endFade = E.ease.clamp((t - (tl.duration - 0.8)) / 0.8);
      if (endFade > 0) { ctx.fillStyle = S.role('ground', endFade); ctx.fillRect(0, 0, W, H); }
      ctx.restore();
    }

    function prefetchAround(t) {
      var seg = E.timeline.segmentAt(tl, t);
      if (!seg) return;
      var i = tl.segments.indexOf(seg);
      for (var k = i + 1; k < tl.segments.length; k++) {
        if (tl.segments[k].kind === 'scene') { env.cache.prefetch(tl.segments[k].scene.id); break; }
      }
    }

    return { video: video, timeline: tl, duration: tl.duration, chapters: tl.chapters, renderFrame: renderFrame, prefetch: prefetchAround, env: env, manifest: manifest };
  }

  EEP.engine.stage = { create: create, videoData: videoData, castEntry: castEntry };
})(typeof window !== 'undefined' ? window : globalThis);
