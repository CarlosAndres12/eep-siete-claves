/* ESTILO · rotulación de títulos (style S9): mono en mayúsculas, alineado a la izquierda desde el margen,
   de 40 a 96 px; los títulos largos se parten por palabras y nunca bajan de 40 px. Nunca números. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var S = EEP.style;

  // opts: { x, y (línea base de la primera línea), size, maxWidth, role, p, second, secondRole, secondSize, anchor:'bottom' }
  S.title = function (ctx, text, opts) {
    opts = opts || {};
    var size = Math.max(40, Math.min(96, opts.size || 64));
    var maxW = opts.maxWidth || (1280 - 144);
    var f = S.font('display', size, 700);
    var lines = S.wrap(ctx, String(text).toLocaleUpperCase('es-CO'), f, maxW);
    while (lines.length > 3 && size > 40) {
      size -= 4; f = S.font('display', size, 700);
      lines = S.wrap(ctx, String(text).toLocaleUpperCase('es-CO'), f, maxW);
    }
    var lh = size * 1.02;
    var second = opts.second ? String(opts.second) : '';
    var secondSize = opts.secondSize || Math.round(size * 0.45);
    var totalH = lines.length * lh + (second ? secondSize * 1.6 : 0);
    var x = opts.x == null ? 72 : opts.x;
    var y = opts.anchor === 'bottom' ? opts.y - totalH + size * 0.8 : opts.y;
    var p = opts.p == null ? 1 : opts.p;
    lines.forEach(function (l, i) {
      var li = EEP.engine.ease.clamp(p * (lines.length + (second ? 1 : 0)) - i);
      S.text(ctx, l, { x: x, y: y + i * lh, size: size, face: 'display', role: opts.role || 'on-dark', p: li, upper: true });
    });
    if (second) {
      var sp = EEP.engine.ease.clamp(p * (lines.length + 1) - lines.length);
      S.text(ctx, second, { x: x, y: y + lines.length * lh + secondSize * 0.55, size: secondSize, role: opts.secondRole || 'accent-1', p: sp, maxWidth: maxW });
    }
    return { height: totalH, lines: lines.length, size: size };
  };
})(typeof window !== 'undefined' ? window : globalThis);
