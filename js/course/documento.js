/* CURSO · signo `documento`: una hoja con cuatro líneas de texto y una esquina doblada (sello `stamp-insumo`). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var C = EEP.course;
  C.signs = C.signs || {};
  // (x, y) = centro de la base; s = alto.
  C.signs.documento = function (ctx, x, y, s, o) {
    var S = EEP.style;
    o = o || {};
    var w = s * 0.74, h = s, fold = s * 0.22;
    var x0 = x - w / 2, y0 = y - h;
    S.fill(ctx, [[x0, y0], [x0 + w - fold, y0], [x0 + w, y0 + fold], [x0 + w, y0 + h], [x0, y0 + h]], { role: o.role || 'ground' });
    S.stroke(ctx, { pts: [[x0, y0], [x0 + w - fold, y0], [x0 + w, y0 + fold], [x0 + w, y0 + h], [x0, y0 + h]], closed: true }, { role: 'ink', width: 1.4 });
    S.stroke(ctx, [[x0 + w - fold, y0], [x0 + w - fold, y0 + fold], [x0 + w, y0 + fold]], { role: 'ink', width: 1.2 });
    for (var i = 0; i < 4; i++) {
      var ly = y0 + h * (0.36 + i * 0.15);
      S.stroke(ctx, [[x0 + w * 0.16, ly], [x0 + w * (i === 3 ? 0.56 : 0.84), ly]], { role: 'ink', width: 1.2 });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
