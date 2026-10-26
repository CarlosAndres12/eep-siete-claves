/* ESTILO · personas planas y viñetas de hablante (style S6).
   Sin contorno en los rellenos, pocos detalles finos en `ink`; cabeza ≈ 1/7 de la altura, piernas algo largas,
   manos grandes, ojos de punto, boca en arco corto (nunca dientes). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var S = EEP.style;
  var role = S.role;
  var D = Math.PI / 180;

  // Ángulos de brazos: [hombro, codo] en grados desde la vertical; positivo = hacia adelante.
  var POSES = {
    standing:        { front: [8, 4],    back: [-8, -4] },
    notebook:        { front: [22, 100], back: [18, 92], prop: 'notebook' },
    asking:          { front: [150, 168], back: [18, 92], prop: 'notebook-back' },
    pointing:        { front: [82, 86],  back: [-6, -2] },
    'pointing-card': { front: [100, 108], back: [-6, -2] },
    'pointing-valley': { front: [104, 96], back: [-6, -2] },
    leaning:         { front: [58, 84],  back: [52, 80], lean: 6 },
    'hat-in-hand':   { front: [24, 70],  back: [-6, -2], prop: 'hat-hand' },
    hose:            { front: [38, 66],  back: [14, 40], prop: 'hose' },
    basket:          { front: [12, 52],  back: [-6, -2], prop: 'basket' },
    walking:         { front: [22, 30],  back: [-22, -12], walk: true },
    seated:          { front: [30, 82],  back: [24, 78], seated: true },
    'seated-talk':   { front: [40, 120], back: [24, 78], seated: true },
    folders:         { front: [30, 88],  back: [24, 84], seated: true, prop: 'folder' },
    bag:             { front: [6, 4],    back: [-8, -4], walk: true, prop: 'bag' },
    backpack:        { front: [18, 26],  back: [-18, -10], walk: true, prop: 'backpack' },
    cane:            { front: [14, 6],   back: [-6, -2], prop: 'cane' }
  };
  S.POSES = Object.keys(POSES);

  function limb(ctx, x1, y1, x2, y2, w, r) {
    ctx.strokeStyle = role(r);
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }
  function thin(ctx, pts, w) {
    ctx.strokeStyle = role('ink');
    ctx.lineWidth = w || 1.3;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
  }

  function look(entry) {
    var l = (entry && (entry.look || (entry.skin && entry))) || {};
    return {
      cane: !!l.cane, backpack: !!l.backpack,
      skin: l.skin || 'skin-3', gender: l.gender || 'f', age: l.age || 'adult', build: l.build || 'medium',
      hair: l.hair || { style: 'short', role: 'ink' }, glasses: !!l.glasses, beard: !!l.beard,
      top: l.top || null, shirt: l.shirt || { role: 'accent-1' }, bottom: l.bottom || { kind: 'trousers', role: 'ink' },
      hat: !!l.hat, apron: l.apron || null, cap: l.cap || null, lanyard: !!l.lanyard
    };
  }

  // Cabeza, pelo y rostro centrados en (0,0) con radio r.
  function head(ctx, L, r, facing) {
    var hr = L.hair.role || 'ink';
    var st = L.hair.style;
    // pelo detrás de la cabeza
    ctx.fillStyle = role(hr);
    if (st === 'long' || st === 'shoulder') {
      ctx.beginPath();
      S.roundRect(ctx, -r * 1.08, -r * 0.9, r * 2.16, r * (st === 'long' ? 2.6 : 2.0), r * 0.9);
      ctx.fill();
    } else if (st === 'curly-tied' || st === 'bun') {
      ctx.beginPath(); ctx.arc(-r * 0.95 * facing, -r * 0.15, r * 0.48, 0, Math.PI * 2); ctx.fill();
    }
    // cara
    ctx.fillStyle = role(L.skin);
    ctx.beginPath(); ctx.ellipse(0, 0, r * 0.92, r, 0, 0, Math.PI * 2); ctx.fill();
    // oreja
    ctx.beginPath(); ctx.ellipse(-r * 0.86 * facing, r * 0.05, r * 0.16, r * 0.22, 0, 0, Math.PI * 2); ctx.fill();
    // pelo superior
    ctx.fillStyle = role(hr);
    ctx.beginPath();
    if (st === 'curly-tied') {
      for (var i = 0; i < 6; i++) {
        var a = Math.PI + i / 5 * Math.PI;
        ctx.moveTo(Math.cos(a) * r * 0.82 + r * 0.3, Math.sin(a) * r * 0.82 - r * 0.15);
        ctx.arc(Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82 - r * 0.15, r * 0.3, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.45, r * 0.95, r * 0.6, 0, Math.PI, 0); ctx.fill();
    } else if (st === 'bald') {
      ctx.ellipse(-r * 0.6 * facing, -r * 0.05, r * 0.32, r * 0.42, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.ellipse(0, -r * 0.38, r * 0.98, r * 0.66, 0, Math.PI, 0);
      ctx.lineTo(r * 0.98, -r * 0.2);
      ctx.quadraticCurveTo(r * 0.2 * facing, -r * 0.55, -r * 0.98, -r * 0.1);
      ctx.closePath();
      ctx.fill();
      if (st === 'long' || st === 'shoulder') {
        ctx.beginPath(); S.roundRect(ctx, -r * 1.06 * facing - (facing > 0 ? 0 : -r * 0.0), -r * 0.4, r * 0.3, r * 1.2, r * 0.15); ctx.fill();
      }
    }
    // raya del pelo
    if (st !== 'bald') thin(ctx, [[r * 0.15 * facing, -r * 0.98], [r * 0.32 * facing, -r * 0.62]], 1.2);
    // barba
    if (L.beard) {
      ctx.fillStyle = role(hr);
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, r * 0.2);
      ctx.quadraticCurveTo(0, r * 1.35, r * 0.7, r * 0.2);
      ctx.quadraticCurveTo(r * 0.2 * facing + 0, r * 0.62, -r * 0.7, r * 0.2);
      ctx.fill();
    }
    // rostro: ojos de punto, nariz, boca en arco
    var ex = r * 0.34 * facing;
    ctx.fillStyle = role('ink');
    ctx.beginPath(); ctx.arc(ex - r * 0.16 * facing, -r * 0.02, Math.max(1.2, r * 0.075), 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ex + r * 0.3 * facing, -r * 0.02, Math.max(1.2, r * 0.075), 0, Math.PI * 2); ctx.fill();
    thin(ctx, [[ex + r * 0.1 * facing, r * 0.05], [ex + r * 0.18 * facing, r * 0.25], [ex + r * 0.08 * facing, r * 0.27]], Math.max(1, r * 0.06));
    ctx.strokeStyle = role('ink');
    ctx.lineWidth = Math.max(1, r * 0.07);
    ctx.beginPath(); ctx.arc(ex + r * 0.06 * facing, r * 0.36, r * 0.18, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
    if (L.glasses) {
      ctx.lineWidth = Math.max(1, r * 0.06);
      ctx.beginPath(); ctx.arc(ex - r * 0.16 * facing, -r * 0.02, r * 0.2, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(ex + r * 0.3 * facing, -r * 0.02, r * 0.2, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex + r * 0.04 * facing, -r * 0.04); ctx.lineTo(ex + r * 0.1 * facing, -r * 0.04); ctx.stroke();
    }
  }

  function hatShape(ctx, x, y, r, tilt) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt || 0);
    ctx.fillStyle = role('accent-4');
    ctx.beginPath(); ctx.ellipse(0, 0, r * 1.7, r * 0.32, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); S.roundRect(ctx, -r * 0.85, -r * 0.8, r * 1.7, r * 0.85, [r * 0.5, r * 0.5, 0, 0]); ctx.fill();
    ctx.fillStyle = role('accent-7');
    ctx.fillRect(-r * 0.85, -r * 0.22, r * 1.7, r * 0.18);
    ctx.restore();
  }

  function drawProp(ctx, kind, hand, H, facing) {
    var u = H / 100;
    if (kind === 'notebook') {
      ctx.save(); ctx.translate(hand[0], hand[1]);
      ctx.fillStyle = role('accent-4'); ctx.fillRect(-u * 4, -u * 7, u * 8, u * 10);
      thin(ctx, [[-u * 2.5, -u * 4], [u * 2.5, -u * 4]], 1.1); thin(ctx, [[-u * 2.5, -u * 1.5], [u * 2.5, -u * 1.5]], 1.1);
      ctx.restore();
    } else if (kind === 'hat-hand') {
      hatShape(ctx, hand[0] + u * 2 * facing, hand[1] + u * 2, u * 4.5, 0.9 * facing);
    } else if (kind === 'basket') {
      S.sign(ctx, 'canasta', { x: hand[0], y: hand[1] + u * 14, size: u * 13 });
    } else if (kind === 'hose') {
      ctx.save();
      ctx.strokeStyle = role('accent-7'); ctx.lineWidth = u * 1.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(hand[0], hand[1]);
      ctx.bezierCurveTo(hand[0] - u * 10 * facing, hand[1] + u * 25, hand[0] - u * 20 * facing, hand[1] + u * 40, hand[0] - u * 28 * facing, H * 0.0 - u * 1);
      ctx.stroke();
      ctx.strokeStyle = role('ink'); ctx.lineWidth = u * 2;
      ctx.beginPath(); ctx.moveTo(hand[0], hand[1]); ctx.lineTo(hand[0] + u * 5 * facing, hand[1] - u * 2); ctx.stroke();
      ctx.strokeStyle = role('accent-2', 0.7); ctx.lineWidth = 1.4;
      for (var i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(hand[0] + u * 6 * facing, hand[1] - u * 2.5 + i * u); ctx.lineTo(hand[0] + u * 14 * facing, hand[1] + u * 2 + i * u * 2.5); ctx.stroke(); }
      ctx.restore();
    } else if (kind === 'folder') {
      ctx.fillStyle = role('accent-9'); ctx.fillRect(hand[0] - u * 6, hand[1] - u * 2, u * 12, u * 3);
    } else if (kind === 'bag') {
      ctx.fillStyle = role('accent-4'); ctx.fillRect(hand[0] - u * 4, hand[1] + u * 2, u * 8, u * 9);
      thin(ctx, [[hand[0] - u * 2, hand[1] + u * 2], [hand[0], hand[1] - u * 1], [hand[0] + u * 2, hand[1] + u * 2]], 1.2);
    } else if (kind === 'cane') {
      thin(ctx, [[hand[0], hand[1]], [hand[0] + u * 3 * facing, 0]], u * 1.3);
    }
  }

  // style.person(ctx, entry, { pose, x, y, scale, p, vignette, speaking, facing, bust, height, chair })
  S.person = function (ctx, entry, opts) {
    opts = opts || {};
    var L = look(entry);
    if (opts.look) for (var k in opts.look) L[k] = opts.look[k];
    var p = opts.p == null ? 1 : opts.p;
    if (p <= 0) return;
    if (opts.vignette) return vignette(ctx, entry, L, opts);
    var H = (opts.height || 260) * (opts.scale || 1);
    var facing = opts.facing === 'left' ? -1 : 1;
    var pose = POSES[opts.pose] || POSES.standing;
    var a = S.appear('illus', p);
    var u = H / 100;
    var bw = { slim: 21, medium: 24, broad: 29 }[L.build] || 24;
    var senior = L.age === 'senior';
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate(opts.x || 0, (opts.y || 0) + a.dy);
    var seated = !!pose.seated;
    var hipY = seated ? -u * 30 : -u * 47;
    var shY = seated ? -u * 62 : -u * 80;
    var lean = ((pose.lean || 0) + (senior ? 3 : 0)) * D * facing;
    var legW = u * 7.4, armW = u * 6.2;
    var top = L.top, shirtR = L.shirt.role, sleeveR = top && top.sleeves !== false ? top.role : shirtR;
    var botR = L.bottom.role || 'ink';

    if (opts.bust) {
      // solo cabeza y hombros (paneles, públicos lejanos)
      ctx.fillStyle = role(top ? top.role : shirtR);
      ctx.beginPath(); S.roundRect(ctx, -u * bw / 2 - u * 2, -u * 22, u * bw + u * 4, u * 24, [u * 10, u * 10, 0, 0]); ctx.fill();
      ctx.save(); ctx.translate(0, -u * 32); head(ctx, L, u * 7.2, facing); ctx.restore();
      ctx.restore();
      return;
    }

    // silla
    if (seated && opts.chair !== false) {
      ctx.save();
      ctx.strokeStyle = role('ink-soft'); ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-u * 12 * facing, hipY + u * 3); ctx.lineTo(u * 14 * facing, hipY + u * 3);
      ctx.moveTo(-u * 10 * facing, hipY + u * 3); ctx.lineTo(-u * 10 * facing, 0);
      ctx.moveTo(u * 12 * facing, hipY + u * 3); ctx.lineTo(u * 12 * facing, 0);
      ctx.moveTo(-u * 12 * facing, hipY + u * 3); ctx.lineTo(-u * 14 * facing, hipY - u * 22);
      ctx.stroke(); ctx.restore();
    }

    // piernas
    function leg(dx, swing) {
      if (seated) {
        var kx = dx + u * 18 * facing, ky = hipY;
        limb(ctx, dx, hipY, kx, ky, legW, botR);
        limb(ctx, kx, ky, kx + u * 1 * facing, -u * 3, legW * 0.92, botR);
        ctx.fillStyle = role('ink');
        ctx.beginPath(); ctx.ellipse(kx + u * 3 * facing, -u * 1.6, u * 5, u * 2.2, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        var fx = dx + Math.sin(swing) * u * 18;
        limb(ctx, dx, hipY, fx, -u * 3, legW, botR);
        ctx.fillStyle = role('ink');
        ctx.beginPath(); ctx.ellipse(fx + u * 2.4 * facing, -u * 1.8, u * 5, u * 2.3, 0, 0, Math.PI * 2); ctx.fill();
      }
    }
    var walkA = pose.walk ? 16 * D : 0;
    var skirt = L.bottom.kind === 'skirt';
    leg(-u * 4 * facing, -walkA * facing);
    leg(u * 4 * facing, walkA * facing);
    if (skirt && !seated) {
      ctx.fillStyle = role(botR);
      ctx.beginPath();
      ctx.moveTo(-u * bw / 2 + u * 1, hipY - u * 4); ctx.lineTo(u * bw / 2 - u * 1, hipY - u * 4);
      ctx.lineTo(u * bw / 2 + u * 3, hipY + u * 20); ctx.lineTo(-u * bw / 2 - u * 3, hipY + u * 20);
      ctx.closePath(); ctx.fill();
    }

    ctx.save();
    ctx.translate(0, hipY);
    ctx.rotate(lean);
    ctx.translate(0, -hipY);
    var sx = u * (bw / 2 - 3);

    function arm(side, ang) {
      var shx = side * sx * facing * 0.6, shy = shY + u * 3;
      var a1 = ang[0] * D, a2 = ang[1] * D;
      var ex = shx + Math.sin(a1) * u * 17 * facing, ey = shy + Math.cos(a1) * u * 17;
      var hx = ex + Math.sin(a2) * u * 15 * facing, hy = ey + Math.cos(a2) * u * 15;
      limb(ctx, shx, shy, ex, ey, armW, sleeveR);
      limb(ctx, ex, ey, hx, hy, armW * 0.92, sleeveR);
      ctx.fillStyle = role(L.skin);
      ctx.beginPath(); ctx.arc(hx + Math.sin(a2) * u * 1.5 * facing, hy + Math.cos(a2) * u * 1.5, u * 3.4, 0, Math.PI * 2); ctx.fill();
      // puño
      thin(ctx, [[hx - Math.cos(a2) * u * 2.6 * facing, hy + Math.sin(a2) * u * 2.6], [hx + Math.cos(a2) * u * 2.6 * facing, hy - Math.sin(a2) * u * 2.6]], 1.2);
      return [hx + Math.sin(a2) * u * 3 * facing, hy + Math.cos(a2) * u * 3];
    }

    var backHand = arm(-1, pose.back);

    // torso (camisa)
    ctx.fillStyle = role(shirtR);
    ctx.beginPath();
    S.roundRect(ctx, -u * bw / 2, shY, u * bw, hipY - shY + u * 4, [u * 7, u * 7, u * 3, u * 3]);
    ctx.fill();
    // prenda superior (chaqueta, chaleco, delantal)
    if (top) {
      ctx.fillStyle = role(top.role);
      var open = u * (top.kind === 'vest' ? 4.5 : 3.5);
      ctx.beginPath();
      S.roundRect(ctx, -u * bw / 2, shY, u * bw / 2 - open / 2, hipY - shY + u * (top.kind === 'cardigan' ? 8 : 4), [u * 7, 0, 0, u * 3]);
      ctx.fill();
      ctx.beginPath();
      S.roundRect(ctx, open / 2, shY, u * bw / 2 - open / 2, hipY - shY + u * (top.kind === 'cardigan' ? 8 : 4), [0, u * 7, u * 3, 0]);
      ctx.fill();
      thin(ctx, [[-open / 2, shY + u * 4], [-open / 2, hipY + u * 2]], 1.2);
      thin(ctx, [[open / 2, shY + u * 4], [open / 2, hipY + u * 2]], 1.2);
    }
    if (L.apron) {
      ctx.fillStyle = role(L.apron);
      ctx.beginPath(); S.roundRect(ctx, -u * bw * 0.36, shY + u * 8, u * bw * 0.72, hipY - shY + u * 10, u * 2); ctx.fill();
    }
    // cuello de la camisa
    thin(ctx, [[-u * 3, shY + u * 0.6], [0, shY + u * 3.6], [u * 3, shY + u * 0.6]], 1.3);
    // pliegue y cinturón
    thin(ctx, [[-u * bw * 0.25, hipY - u * 8], [-u * bw * 0.12, hipY - u * 4]], 1.2);
    if (!top || top.kind === 'vest') {
      ctx.fillStyle = role('ink'); ctx.fillRect(-u * bw / 2, hipY + u * 1, u * bw, u * 2);
    }
    if (L.lanyard) {
      thin(ctx, [[-u * 3.5, shY + u * 1], [0, shY + u * 12], [u * 3.5, shY + u * 1]], 1.2);
      ctx.fillStyle = role('accent-4'); ctx.fillRect(-u * 2.6, shY + u * 12, u * 5.2, u * 4);
    }
    if (pose.prop === 'backpack') {
      ctx.fillStyle = role('accent-7');
      ctx.beginPath(); S.roundRect(ctx, -u * bw / 2 - u * 7 * facing - (facing > 0 ? 0 : -u * bw + u * 0), shY + u * 4, u * 8, u * 20, u * 3); ctx.fill();
    }

    // cabeza
    var r = u * 7.2;
    ctx.fillStyle = role(L.skin);
    ctx.fillRect(-u * 2.6, shY - u * 5, u * 5.2, u * 6);
    ctx.save();
    ctx.translate(u * 0.8 * facing, shY - u * 5 - r * 0.92);
    head(ctx, L, r, facing);
    if (L.hat && pose.prop !== 'hat-hand') hatShape(ctx, 0, -r * 0.62, r, 0);
    if (L.cap) {
      ctx.fillStyle = role(L.cap);
      ctx.beginPath(); ctx.ellipse(0, -r * 0.55, r * 0.98, r * 0.62, 0, Math.PI, 0); ctx.fill();
      ctx.fillRect(r * 0.2 * facing - (facing < 0 ? r * 1.1 : 0), -r * 0.62, r * 1.1, r * 0.2);
    }
    ctx.restore();

    var frontHand = arm(1, pose.front);
    ctx.restore();

    if (pose.prop === 'notebook') drawProp(ctx, 'notebook', [(frontHand[0] + backHand[0]) / 2, (frontHand[1] + backHand[1]) / 2], H, facing);
    else if (pose.prop === 'notebook-back') drawProp(ctx, 'notebook', backHand, H, facing);
    else if (pose.prop) drawProp(ctx, pose.prop, frontHand, H, facing);
    if (senior && L.cane && pose.prop !== 'cane') drawProp(ctx, 'cane', backHand, H, facing);
    ctx.restore();
    return { frontHand: frontHand, backHand: backHand, height: H };
  };

  // Viñeta de hablante: círculo de 120 px en accent-8 con anillo ink de 2 px; cabeza y hombros.
  function vignette(ctx, entry, L, opts) {
    var R = (opts.size || 120) / 2;
    var p = opts.p == null ? 1 : opts.p;
    var a = S.appear('bar', p);
    ctx.save();
    ctx.globalAlpha *= a.alpha;
    ctx.translate((opts.x || 0) + a.dx, opts.y || 0);
    ctx.fillStyle = role('accent-8');
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
    ctx.save();
    ctx.beginPath(); ctx.arc(0, 0, R - 1, 0, Math.PI * 2); ctx.clip();
    var u = R / 22;
    var bw = 30;
    var top = L.top, shirtR = L.shirt.role;
    ctx.fillStyle = role(shirtR);
    ctx.beginPath(); S.roundRect(ctx, -u * bw / 2, R * 0.42, u * bw, R, [u * 9, u * 9, 0, 0]); ctx.fill();
    if (top) {
      ctx.fillStyle = role(top.role);
      ctx.beginPath(); S.roundRect(ctx, -u * bw / 2, R * 0.42, u * bw / 2 - u * 2.5, R, [u * 9, 0, 0, 0]); ctx.fill();
      ctx.beginPath(); S.roundRect(ctx, u * 2.5, R * 0.42, u * bw / 2 - u * 2.5, R, [0, u * 9, 0, 0]); ctx.fill();
    }
    ctx.fillStyle = role(L.skin);
    ctx.fillRect(-u * 3, R * 0.2, u * 6, R * 0.3);
    thin(ctx, [[-u * 3.5, R * 0.43], [0, R * 0.6], [u * 3.5, R * 0.43]], 1.4);
    ctx.save();
    ctx.translate(0, -R * 0.12);
    head(ctx, L, u * 8.6, 1);
    if (L.hat) hatShape(ctx, 0, -u * 8.6 * 0.62, u * 8.6, 0);
    ctx.restore();
    ctx.restore();
    ctx.lineWidth = 2;
    ctx.strokeStyle = role('ink');
    ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    if (opts.speaking !== false && opts.label) {
      S.mark(ctx, 'speaking', { x: (opts.x || 0) + R + 10, y: (opts.y || 0) - 18 }, { text: opts.label, p: p });
    }
  }

  S.hat = hatShape;
})(typeof window !== 'undefined' ? window : globalThis);
