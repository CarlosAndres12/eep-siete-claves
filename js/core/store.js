/* Estado local (posiciones del reproductor, preferencias). Todo acceso va en try/catch. */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var PREFIX = 'eep-siete-claves:';
  var mem = {};
  function get(key, def) {
    try {
      var v = root.localStorage.getItem(PREFIX + key);
      return v == null ? (key in mem ? mem[key] : def) : JSON.parse(v);
    } catch (e) { return key in mem ? mem[key] : def; }
  }
  function set(key, val) {
    mem[key] = val;
    try { root.localStorage.setItem(PREFIX + key, JSON.stringify(val)); } catch (e) { /* almacenamiento no disponible */ }
  }
  function remove(key) {
    delete mem[key];
    try { root.localStorage.removeItem(PREFIX + key); } catch (e) {}
  }
  EEP.store = { get: get, set: set, remove: remove };
})(window);
