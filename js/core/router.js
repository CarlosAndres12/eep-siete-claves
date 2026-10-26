/* Rutas con hash (SITE_SCOPE = routed). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var routes = [];
  var notFound = null;
  function on(pattern, handler) { routes.push({ re: pattern, handler: handler }); }
  function current() { return (root.location.hash || '#/inicio').replace(/^#/, ''); }
  function resolve() {
    var path = current();
    for (var i = 0; i < routes.length; i++) {
      var m = routes[i].re.exec(path);
      if (m) { routes[i].handler(m, path); return; }
    }
    if (notFound) notFound(path);
  }
  function go(path) { if (current() === path) resolve(); else root.location.hash = '#' + path; }
  function start(nf) {
    notFound = nf;
    root.addEventListener('hashchange', resolve);
    resolve();
  }
  EEP.router = { on: on, go: go, start: start, current: current, resolve: resolve };
})(window);
