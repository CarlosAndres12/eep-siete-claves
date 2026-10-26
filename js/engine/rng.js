/* PRNG con semilla (mulberry32) y hash de cadenas. */
(function (root) {
  'use strict';
  var EEP = root.EEP;

  function mulberry32(a) {
    a = a >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hash(str) {
    str = String(str);
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  // rng(seed) acepta número o cadena; devuelve un generador con utilidades.
  function rng(seed) {
    var f = mulberry32(typeof seed === 'number' ? seed : hash(seed));
    f.range = function (a, b) { return a + (b - a) * f(); };
    f.int = function (a, b) { return Math.floor(a + (b - a + 1) * f()); };
    f.pick = function (arr) { return arr[Math.floor(f() * arr.length)]; };
    f.sign = function () { return f() < 0.5 ? -1 : 1; };
    return f;
  }

  EEP.engine.rng = rng;
  EEP.engine.hash = hash;
})(typeof window !== 'undefined' ? window : globalThis);
