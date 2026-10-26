/* ESTILO · un fondo por tipo de escena (style S8). Se dibujan bajo cada escena. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var S = EEP.style;
  var role = S.role;
  var W = 1280, H = 720;

  function full(ctx, r) { ctx.fillStyle = role(r); ctx.fillRect(0, 0, W, H); }


  // ---------- héroe de #/inicio: el valle de Aburrá, sin texto ----------
  // Laderas con bosque, quebradas que bajan al río, la ciudad en el fondo del valle, un cable aéreo,
  // aves y nubes. `t` en segundos (continuo), `p` 0…1 para la entrada escalonada.
  var heroCache = null;
  function heroLayout() {
    if (heroCache) return heroCache;
    var r = EEP.engine.rng(77);
    // perfil de las laderas: la izquierda baja de (−20, 250) a (560, 600); la derecha de (1300, 215) a (720, 600)
    function sm(u) { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }
    function leftY(x) { var u = (x + 20) / 580; return 190 + 350 * sm(u) + Math.sin(x / 70) * 14; }
    function rightY(x) { var u = (1300 - x) / 580; return 160 + 380 * sm(u) + Math.sin(x / 63 + 1) * 16; }
    // un solo perfil continuo de ladera a ladera: el más alto de los dos en cada x
    var far = [], near = [];
    for (var x = -20; x <= 1300; x += 20) {
      var y = Math.min(leftY(x), rightY(x));
      near.push([x, y]);
      far.push([x, y - 50 - Math.max(0, 1 - Math.abs(x - 640) / 420) * -30 - Math.sin(x / 39) * 18]);
    }
    var trees = [];
    for (var i = 0; i < 34; i++) {
      var left = i % 2 === 0;
      var u = r.range(0.04, 0.86);
      var tx = left ? -20 + u * 560 : 1300 - u * 560;
      var ty = (left ? leftY(tx) : rightY(tx)) + r.range(8, 46);
      trees.push({ x: tx, y: ty, size: r.range(26, 46) * (1 - u * 0.35), kind: r.pick(['round', 'dense', 'scalloped', 'round']), seed: i + 3, d: r.range(0, 0.6) });
    }
    trees.sort(function (a, b) { return a.y - b.y; });
    var city = [], cx = 470;
    while (cx < 860) {
      var w = r.range(26, 46), h = r.range(44, 128) * (1 - Math.abs(cx - 660) / 520);
      city.push({ x: cx, w: w, h: h, kind: r() < 0.5 ? 'torre' : 'bloque', seed: Math.floor(r() * 99), role: r.pick(['ground-2', 'accent-4', 'ground-2', 'accent-8']), d: r.range(0, 1) });
      cx += w + r.range(2, 10);
    }
    var streams = [
      [[150, 240], [210, 320], [250, 390], [330, 480], [420, 545], [520, 592]],
      [[1150, 205], [1080, 290], [1010, 370], [950, 460], [860, 555], [780, 596]],
      [[380, 410], [430, 480], [470, 540], [560, 588]]
    ];
    var river = [];
    for (var k = 0; k <= 24; k++) { var rx = -20 + k * 55; river.push([rx, 608 + Math.sin(k * 0.7) * 8]); }
    heroCache = { far: far, near: near, trees: trees, city: city, streams: streams, river: river };
    return heroCache;
  }
  function seg(p, a, b) { return Math.max(0, Math.min(1, (p - a) / (b - a))); }
  function slope(ctx, pts, edgeX, roleName, p) {
    var a = S.appear('illus', p);
    if (a.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(0, a.dy);
    ctx.fillStyle = role(roleName);
    ctx.beginPath();
    S.smoothOpen(ctx, pts);
    ctx.lineTo(pts[pts.length - 1][0], H + 30);
    ctx.lineTo(edgeX, H + 30);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  function heroScene(ctx, o) {
    var t = S.reduced ? 12 : (o.t || 0);
    var p = o.p == null ? 1 : o.p;
    var L = heroLayout();
    full(ctx, 'dark');
    // curvas de nivel lentas
    [[21, { x: -160, y: -240, w: 1200, h: 720 }, 0.45], [34, { x: 380, y: -320, w: 1100, h: 640 }, 0.28], [52, { x: -260, y: 40, w: 900, h: 520 }, 0.2]].forEach(function (c, i) {
      S.contourLine(ctx, c[1], { seed: c[0], role: 'on-dark', alpha: c[2], p: seg(p, i * 0.08, 0.5 + i * 0.1), t: t, width: 1.4, dash: i ? [2, 7] : null });
    });
    // sol con un halo que respira
    var sp = S.appear('fade', seg(p, 0.1, 0.4)).alpha;
    if (sp > 0) {
      ctx.save();
      ctx.globalAlpha *= sp;
      var halo = 70 + Math.sin(t * 0.6) * 6;
      ctx.fillStyle = role('accent-9', 0.12);
      ctx.beginPath(); ctx.arc(1010, 190, halo, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = role('accent-9');
      ctx.beginPath(); ctx.arc(1010, 190, 40, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    S.clouds(ctx, { x: 0, y: 70, w: W, h: 210 }, { seed: 8, count: 4, t: t * 1.6, role: 'on-dark', alpha: 0.16, size: 150 });
    // aves en vuelo
    for (var b = 0; b < 4; b++) {
      var bx = ((t * (22 + b * 5) + b * 330) % (W + 200)) - 100;
      var by = 130 + b * 30 + Math.sin(t * 0.9 + b) * 12;
      var flap = 0.55 + 0.45 * Math.abs(Math.sin(t * 4 + b * 1.7));
      ctx.save();
      ctx.globalAlpha *= seg(p, 0.5, 0.8);
      ctx.translate(bx, by); ctx.scale(1, flap);
      S.sign(ctx, 'ave', { x: 0, y: 0, size: 34 - b * 4, role: 'on-dark' });
      ctx.restore();
    }
    // laderas lejanas y cercanas
    slope(ctx, L.far, -20, 'accent-7', seg(p, 0.05, 0.4));
    slope(ctx, L.near, -20, 'accent-6', seg(p, 0.15, 0.5));
    S.fill(ctx, S.rectPath(0, 586, W, H - 586, 0), { role: 'accent-7', p: seg(p, 0.15, 0.5) });
    // quebradas que bajan al río: trazo que avanza y luego corre
    L.streams.forEach(function (s, i) {
      var sp2 = seg(p, 0.45 + i * 0.05, 0.8 + i * 0.05);
      S.stroke(ctx, { pts: s, smooth: true }, { role: 'accent-2', width: 4, p: sp2 });
      if (sp2 >= 1) S.stroke(ctx, { pts: s, smooth: true }, { role: 'paper', alpha: 0.7, width: 1.4, dash: [6, 26], offset: -t * 18 - i * 9 });
    });
    // bosque en las laderas
    L.trees.forEach(function (tr) {
      var tp = seg(p, 0.3 + tr.d * 0.5, 0.45 + tr.d * 0.5);
      if (tp <= 0) return;
      var a = S.appear('illus', tp);
      ctx.save();
      ctx.globalAlpha *= a.alpha;
      S.tree(ctx, { x: tr.x, y: tr.y + a.dy * 0.4, size: tr.size, seed: tr.seed, t: t, kind: tr.kind, stipple: false });
      ctx.restore();
    });
    // cable aéreo con cabinas que suben y bajan
    var cp = seg(p, 0.65, 0.9);
    if (cp > 0) {
      var c0 = [800, 540], c1 = [1170, 262];
      S.stroke(ctx, [c0, c1], { role: 'on-dark', width: 1.3, p: cp });
      [c0, c1].forEach(function (q) { S.fill(ctx, S.rectPath(q[0] - 3, q[1], 6, 26, 1), { role: 'on-dark', p: cp }); });
      if (cp >= 1) {
        for (var g = 0; g < 3; g++) {
          var u = ((t / 14 + g / 3) % 1);
          var gx = c0[0] + (c1[0] - c0[0]) * u, gy = c0[1] + (c1[1] - c0[1]) * u;
          S.stroke(ctx, [[gx, gy], [gx, gy + 10]], { role: 'on-dark', width: 1.2 });
          S.fill(ctx, S.rectPath(gx - 9, gy + 10, 18, 13, 2), { role: 'accent-3' });
        }
      }
    }
    // la ciudad en el fondo del valle
    L.city.forEach(function (bd) {
      var bp = seg(p, 0.35 + bd.d * 0.35, 0.55 + bd.d * 0.35);
      if (bp <= 0) return;
      var hh = bd.h * (S.reduced ? 1 : E().out(bp));
      S.building(ctx, { x: bd.x, y: 600 - hh, w: bd.w, h: hh }, { kind: bd.kind, seed: bd.seed, role: bd.role });
    });
    // río en el fondo del valle y colinas del primer plano
    S.water(ctx, L.river, { width: 12, t: t, p: seg(p, 0.5, 0.85) });
    S.hills(ctx, { x: 0, y: H - 100, w: W, h: 100 }, { seed: 12, layers: 2, roles: [['accent-7', 'accent-6'], ['accent-6', 'accent-7']], p: seg(p, 0.2, 0.5) });
  }
  function E() { return EEP.engine.ease; }

  var BG = {
    title: function (ctx, o) {
      full(ctx, 'dark');
      S.contourLine(ctx, { x: -200, y: -260, w: 1100, h: 700 }, { seed: o.seed || 21, role: 'on-dark', alpha: 0.6, p: o.p == null ? 1 : o.p, t: o.t, width: 1.6 });
      ctx.save(); ctx.strokeStyle = role('on-dark'); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(W - 72 - 220, H - 60.5); ctx.lineTo(W - 72, H - 60.5); ctx.stroke(); ctx.restore();
    },
    explain: function (ctx, o) {
      full(ctx, 'accent-8');
      ctx.save();
      ctx.fillStyle = role('accent-1');
      ctx.beginPath();
      ctx.moveTo(W * 0.58, H);
      ctx.bezierCurveTo(W * 0.7, H - 120, W * 0.8, H - 150, W * 0.88, H - 140);
      ctx.bezierCurveTo(W * 0.95, H - 132, W, H - 100, W + 10, H - 90);
      ctx.lineTo(W + 10, H);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      if (o.plant !== false) {
        S.tree(ctx, { x: 52, y: H - 6, size: 54, seed: 4, t: o.t, kind: 'round' });
        S.sign(ctx, 'flor', { x: 92, y: H - 6, size: 30, role: 'accent-9' });
      }
    },
    figure: function (ctx, o) {
      full(ctx, 'ground');
      if (o.corner !== false) S.sign(ctx, o.corner === 'casa' ? 'casa' : 'arboleda', { x: 64, y: H - 8, size: 40, seed: 3, t: o.t });
    },
    compare: function (ctx, o) {
      full(ctx, 'ground');
      var cols = o.columns || 2;
      ctx.save(); ctx.strokeStyle = role('ink-soft'); ctx.lineWidth = 1;
      for (var i = 1; i < cols; i++) {
        var x = Math.round(W * i / cols) + 0.5;
        ctx.beginPath(); ctx.moveTo(x, 90); ctx.lineTo(x, H - 150); ctx.stroke();
      }
      ctx.restore();
    },
    dialogue: function (ctx, o) {
      full(ctx, 'ground');
      S.clouds(ctx, { x: 0, y: 40, w: W, h: 140 }, { seed: (o.seed || 1) + 5, count: 2, t: o.t, role: 'ground-2', size: 120 });
      // cresta baja de colinas en accent-6 y accent-7
      ctx.save();
      ctx.fillStyle = role('accent-6');
      ctx.beginPath();
      ctx.moveTo(-10, H - 130);
      ctx.bezierCurveTo(W * 0.2, H - 175, W * 0.35, H - 120, W * 0.5, H - 140);
      ctx.bezierCurveTo(W * 0.68, H - 165, W * 0.82, H - 120, W + 10, H - 150);
      ctx.lineTo(W + 10, H); ctx.lineTo(-10, H); ctx.closePath(); ctx.fill();
      ctx.fillStyle = role('accent-7');
      ctx.beginPath();
      ctx.moveTo(W * 0.5, H - 140);
      ctx.bezierCurveTo(W * 0.68, H - 165, W * 0.82, H - 120, W + 10, H - 150);
      ctx.lineTo(W + 10, H - 105);
      ctx.bezierCurveTo(W * 0.85, H - 92, W * 0.7, H - 118, W * 0.55, H - 112);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    },
    case: function (ctx, o) {
      full(ctx, 'ground-2');
      S.sign(ctx, 'pin', { x: W - 96, y: 108, size: 44 });
      S.stroke(ctx, [[W - 300, 70], [W - 230, 98], [W - 170, 78], [W - 120, 100]], { role: 'ink-soft', width: 1.4, dash: [6, 6] });
    },
    recap: function (ctx, o) {
      full(ctx, 'ground');
      ctx.save();
      ctx.fillStyle = role('accent-2');
      ctx.beginPath();
      ctx.moveTo(-10, 170);
      ctx.bezierCurveTo(180, 150, 330, 330, 470, H);
      ctx.lineTo(-10, H);
      ctx.closePath(); ctx.fill();
      ctx.restore();
      S.contourLine(ctx, { x: -120, y: 60, w: 760, h: 620 }, { seed: o.seed || 33, role: 'ink', alpha: 0.5, p: 1, t: o.t, width: 1.4 });
    },
    hero: function (ctx, o) { heroScene(ctx, o); },
    card: function (ctx, o) {
      full(ctx, 'ground');
      ctx.fillStyle = role('accent-8');
      ctx.beginPath(); S.roundRect(ctx, 150, 70, W - 300, H - 140, 9); ctx.fill();
    }
  };

  // style.background(ctx, sceneType, { t, seed, p, columns, plant, corner })
  S.background = function (ctx, sceneType, opts) {
    (BG[sceneType] || BG.figure)(ctx, opts || {});
  };
  S.BACKGROUNDS = Object.keys(BG);
  // Rol de texto adecuado sobre cada fondo.
  S.textRoleOn = function (sceneType) { return (sceneType === 'title' || sceneType === 'hero') ? 'on-dark' : 'ink'; };
})(typeof window !== 'undefined' ? window : globalThis);
