/* ESTILO · la lámpara y el manejo de máquina (style S7): objetos pequeños de líneas finas en el panel de mapa.
   Nunca ojos, rostro, boca, extremidades, cuerpo, forma humana ni cerebro. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var S = EEP.style;
  var role = S.role;

  function ln(ctx, pts, w, r, alpha) {
    ctx.save();
    ctx.strokeStyle = role(r || 'machine-line', alpha);
    ctx.lineWidth = w || 1.5;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
    ctx.restore();
  }

  // La lámpara: base rectangular, dos brazos con articulación redonda, pantalla trapezoidal y cono de luz.
  // opts: { x, y (base), size (alto total), p, light (0–1), dial (pasos), onPaper }
  function lamp(ctx, o) {
    var s = o.size || 100;
    var x = o.x || 0, y = o.y || 0;
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return {};
    var lineR = o.onPaper ? 'ink' : 'machine-line';
    var a = S.appear('fade', p);
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    var dir = o.facing === 'left' ? -1 : 1;
    var bw = s * 0.5, bh = s * 0.1;
    var j1 = [x - s * 0.08 * dir, y - bh - s * 0.45];
    var j2 = [x + s * 0.28 * dir, y - bh - s * 0.78];
    var shadeC = [x + s * 0.52 * dir, y - bh - s * 0.6];
    // cono de luz (machine-glow-1 al 25 %)
    var light = o.light == null ? 1 : o.light;
    if (light > 0) {
      ctx.fillStyle = role('machine-glow-1', 0.25 * light);
      ctx.beginPath();
      ctx.moveTo(shadeC[0] - s * 0.1 * dir, shadeC[1] + s * 0.08);
      ctx.lineTo(shadeC[0] + s * 0.12 * dir, shadeC[1] + s * 0.02);
      var reach = o.reach || s * 0.75;
      ctx.lineTo(shadeC[0] + s * 0.42 * dir, shadeC[1] + reach);
      ctx.lineTo(shadeC[0] - s * 0.34 * dir, shadeC[1] + reach);
      ctx.closePath();
      ctx.fill();
    }
    // base
    ctx.strokeStyle = role(lineR);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - bw / 2, y - bh, bw, bh);
    // dial en la base (optimizador)
    if (o.dial != null) {
      var dc = [x + bw * 0.28 * dir, y - bh / 2];
      ctx.beginPath(); ctx.arc(dc[0], dc[1], bh * 0.36, 0, Math.PI * 2); ctx.stroke();
      var ang = -Math.PI / 2 + o.dial * Math.PI / 4;
      ln(ctx, [dc, [dc[0] + Math.cos(ang) * bh * 0.32, dc[1] + Math.sin(ang) * bh * 0.32]], 1.4, lineR);
    }
    // brazos
    ln(ctx, [[x, y - bh], j1], 1.6, lineR);
    ln(ctx, [j1, j2], 1.6, lineR);
    ctx.beginPath(); ctx.arc(j1[0], j1[1], s * 0.03, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(j2[0], j2[1], s * 0.03, 0, Math.PI * 2); ctx.stroke();
    // pantalla trapezoidal
    ctx.beginPath();
    ctx.moveTo(j2[0] + s * 0.02 * dir, j2[1] + s * 0.02);
    ctx.lineTo(j2[0] + s * 0.14 * dir, j2[1] - s * 0.04);
    ctx.lineTo(shadeC[0] + s * 0.14 * dir, shadeC[1] + s * 0.02);
    ctx.lineTo(shadeC[0] - s * 0.12 * dir, shadeC[1] + s * 0.1);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    return { light: [shadeC[0], shadeC[1] + (o.reach || s * 0.75)], shade: shadeC };
  }

  // Tarjeta de entrada: rectángulo pequeño de líneas con una etiqueta mono.
  function inputCard(ctx, o) {
    var w = o.w || 120, h = o.h || 70;
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return;
    ctx.save();
    ctx.globalAlpha *= S.appear('fade', p).alpha;
    ctx.translate(o.dx || 0, 0);
    ctx.fillStyle = role('machine-ground');
    ctx.fillRect(o.x, o.y, w, h);
    ctx.strokeStyle = role('machine-line');
    ctx.lineWidth = 1.5;
    ctx.strokeRect(o.x, o.y, w, h);
    if (o.kind === 'tile') {
      ctx.save(); ctx.globalAlpha *= 0.6;
      for (var i = 1; i < 4; i++) ln(ctx, [[o.x + 6, o.y + h * i / 4], [o.x + w - 6, o.y + h * i / 4 + (i % 2 ? 4 : -4)]], 1);
      ctx.restore();
    }
    ctx.restore();
    if (o.label) S.mapLabel(ctx, o.label, o.x + (o.dx || 0) + 6, o.y + h + 16, { size: o.labelSize || 12, maxWidth: o.labelWidth || w + 40, p: p });
  }

  // Tira de salida: fila de celdas pequeñas con etiqueta.
  function outputStrip(ctx, o) {
    var cells = o.cells || [];
    var cw = o.cw || 140, ch = o.ch || 44, gap = o.gap || 8;
    cells.forEach(function (c, i) {
      var pp = o.p == null ? 1 : EEP.engine.ease.clamp(o.p * cells.length - i);
      if (pp <= 0) return;
      var x = o.x + (o.vertical ? 0 : i * (cw + gap)), y = o.y + (o.vertical ? i * (ch + gap) : 0);
      ctx.save();
      ctx.globalAlpha *= S.appear('fade', pp).alpha;
      ctx.fillStyle = role('machine-glow-1', 0.12);
      ctx.fillRect(x, y, cw, ch);
      ctx.strokeStyle = role('machine-line'); ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, cw, ch);
      ctx.restore();
      S.mapLabel(ctx, c, x + 8, y + ch / 2 + 5, { size: o.size || 11, maxWidth: cw - 14, p: pp });
    });
  }

  // Satélite: caja con dos alas de paneles y una línea de barrido discontinua (machine-glow-2).
  function satellite(ctx, o) {
    var s = o.size || 40;
    var x = o.x, y = o.y;
    var p = o.p == null ? 1 : o.p;
    if (p <= 0) return;
    ctx.save();
    ctx.globalAlpha *= S.appear('fade', p).alpha;
    ctx.strokeStyle = role('machine-line'); ctx.lineWidth = 1.5;
    ctx.strokeRect(x - s * 0.2, y - s * 0.2, s * 0.4, s * 0.4);
    [-1, 1].forEach(function (k) {
      ctx.strokeRect(x + k * s * 0.25 - (k < 0 ? s * 0.5 : 0), y - s * 0.12, s * 0.5, s * 0.24);
      ln(ctx, [[x + k * s * 0.25 + k * s * 0.25, y - s * 0.12], [x + k * s * 0.25 + k * s * 0.25, y + s * 0.12]], 1);
      ln(ctx, [[x + k * s * 0.2, y], [x + k * s * 0.25, y]], 1.5);
    });
    if (o.scan) {
      S.stroke(ctx, [[x, y + s * 0.25], [x, y + (o.scanLength || s * 3)]], { role: 'machine-glow-2', width: 1.5, dash: [6, 6], offset: -(o.t || 0) * 12 });
    }
    ctx.restore();
  }

  // style.machine(ctx, kind, opts)
  S.machine = function (ctx, kind, opts) {
    opts = opts || {};
    if (kind === 'lamp') return lamp(ctx, opts);
    if (kind === 'card') return inputCard(ctx, opts);
    if (kind === 'strip') return outputStrip(ctx, opts);
    if (kind === 'satellite') return satellite(ctx, opts);
    if (kind === 'dial') return lamp(ctx, Object.assign({}, opts, { dial: opts.dial || 0 }));
  };
})(typeof window !== 'undefined' ? window : globalThis);
