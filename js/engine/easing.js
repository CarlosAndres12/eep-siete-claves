/* Curvas de suavizado y utilidades de progreso. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  function clamp(x, a, b) { if (a == null) { a = 0; b = 1; } return x < a ? a : x > b ? b : x; }
  var ease = {
    clamp: clamp,
    lerp: function (a, b, t) { return a + (b - a) * t; },
    linear: function (t) { return clamp(t); },
    inOut: function (t) { t = clamp(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; },
    out: function (t) { t = clamp(t); return 1 - Math.pow(1 - t, 3); },
    in: function (t) { t = clamp(t); return t * t * t; },
    back: function (t) { t = clamp(t); var c1 = 1.2, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    // Progreso 0→1 de t entre a y b.
    segment: function (p, a, b) { return b <= a ? (p >= b ? 1 : 0) : clamp((p - a) / (b - a)); },
    smooth: function (t) { t = clamp(t); return t * t * (3 - 2 * t); }
  };
  EEP.engine.ease = ease;
})(typeof window !== 'undefined' ? window : globalThis);
