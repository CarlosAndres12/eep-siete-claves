/* ESTILO · un fondo por tipo de escena (style S8). Se dibujan bajo cada escena. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var S = EEP.style;
  var role = S.role;
  var W = 1280, H = 720;

  function full(ctx, r) { ctx.fillStyle = role(r); ctx.fillRect(0, 0, W, H); }

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
    hero: function (ctx, o) {
      full(ctx, 'dark');
      var p = o.p == null ? 1 : o.p;
      S.contourLine(ctx, { x: -160, y: -240, w: 1200, h: 720 }, { seed: o.seed || 21, role: 'on-dark', alpha: 0.6, p: p, width: 1.6 });
      S.clouds(ctx, { x: 0, y: 60, w: W, h: 200 }, { seed: 8, count: 2, t: o.t, role: 'on-dark', alpha: 0.18, size: 150 });
      S.hills(ctx, { x: 0, y: H - 210, w: W, h: 210 }, { seed: 12, layers: 2, roles: [['accent-6', 'accent-7'], ['accent-7', 'accent-6']] });
    },
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
