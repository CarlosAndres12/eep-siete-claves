/* Caché de capas fuera de pantalla (base §1.4): LRU de la escena actual y la siguiente, con precarga en reposo. */
(function (root) {
  'use strict';
  var EEP = root.EEP;

  function create(build, size) {
    var max = size || 2;
    var map = new Map();
    function get(key) {
      if (map.has(key)) { var v = map.get(key); map.delete(key); map.set(key, v); return v; }
      var made = build(key);
      map.set(key, made);
      while (map.size > max) map.delete(map.keys().next().value);
      return made;
    }
    function prefetch(key) {
      if (map.has(key)) return;
      var idle = root.requestIdleCallback || function (f) { return setTimeout(f, 30); };
      idle(function () { if (!map.has(key)) get(key); });
    }
    return { get: get, prefetch: prefetch, clear: function () { map.clear(); }, size: function () { return map.size; } };
  }

  EEP.engine.layers = { create: create };
})(typeof window !== 'undefined' ? window : globalThis);
