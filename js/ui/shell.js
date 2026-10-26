/* Armazón del sitio (spec §7.1): encabezado, navegación, pie, rutas y piezas compartidas de las vistas
   (mini-marcado, tarjetas de cifra, fichas de escala, sellos, glosario en el primer uso). */
(function (root) {
  'use strict';
  var EEP = root.EEP;
  var U = EEP.util, el = U.el;
  var UI = EEP.ui;
  var D = function () { return EEP.data; };

  // ---------- consultas ----------
  function fig(id) { return EEP.engine.cards.fig(id); }
  function source(k) { return EEP.engine.cards.source(k); }
  function glossEntry(term) {
    var t = String(term).toLowerCase();
    var list = D().glossary.entries;
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.term.toLowerCase() === t) return e;
      if ((e.aliases || []).some(function (a) { return a.toLowerCase() === t; })) return e;
    }
    for (var j = 0; j < list.length; j++) if (list[j].term.toLowerCase().replace(/\s*\(.*\)$/, '') === t) return list[j];
    return null;
  }
  UI.glossEntry = glossEntry;
  function videosUsing(id) {
    return (D().videos || []).filter(function (v) { return v.scenes.some(function (s) { return (s.figs || []).indexOf(id) >= 0; }); });
  }
  function puntoOfVideo(vid) {
    var ps = D().puntos;
    for (var i = 0; i < ps.length; i++) if (ps[i].videos.indexOf(vid) >= 0) {
      var tab = ps[i].tabs ? ps[i].tabs.filter(function (t) { return t.video === vid; })[0] : null;
      return { punto: ps[i], route: tab ? '#/punto-3/' + tab.id : ps[i].route };
    }
    return null;
  }
  UI.videosUsing = videosUsing;
  UI.puntoOfVideo = puntoOfVideo;

  // ---------- mini-marcado ----------
  var TYPE_CLASS = function (t) { return 'badge badge-type'; };
  function figInline(id) {
    var f = fig(id);
    if (!f) return '';
    return '<a class="fig-inline" href="#/cifras?fig=' + encodeURIComponent(id) + '" title="' + U.escapeHtml(f.tipo + ' · ' + f.cifra) + '">' +
      '<strong>' + U.escapeHtml(f.partes[0].valor) + '</strong><span class="fig-inline-type">' + U.escapeHtml(f.tipo) + '</span></a>';
  }
  function glosChip(term) {
    var e = glossEntry(term);
    return '<a class="chip-glos" href="#/glosario?t=' + encodeURIComponent(e ? e.term : term) + '" title="' + U.escapeHtml(e ? e.plain : '') + '">' + U.escapeHtml(term) + '</a>';
  }
  // Glosario en el primer uso: envuelve la primera aparición de cada término de `terms` no usado aún en `used`.
  function glossify(html, terms, used) {
    if (!terms || !terms.length) return html;
    terms.forEach(function (t) {
      if (used[t.toLowerCase()]) return;
      var esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var re = new RegExp('(^|[^\\wáéíóúñÁÉÍÓÚÑ>])(' + esc + ')(?![\\wáéíóúñ])', 'i');
      // no tocar dentro de etiquetas
      var parts = html.split(/(<[^>]+>)/);
      var depthA = 0, done = false;
      for (var i = 0; i < parts.length && !done; i++) {
        var p = parts[i];
        if (p.charAt(0) === '<') { if (/^<a[\s>]/.test(p)) depthA++; else if (/^<\/a>/.test(p)) depthA--; continue; }
        if (depthA > 0) continue;
        var m = re.exec(p);
        if (m) {
          parts[i] = p.slice(0, m.index) + m[1] + glosChip(m[2]) + p.slice(m.index + m[0].length);
          done = true;
        }
      }
      if (done) { used[t.toLowerCase()] = true; html = parts.join(''); }
    });
    return html;
  }
  // md(text, { terms, used }) → HTML seguro
  function md(text, o) {
    o = o || {};
    var s = String(text || '');
    var html = U.markup(s, {
      fig: figInline,
      glos: glosChip,
      ref: function (t, k) { return '<a href="#/fuentes">' + U.escapeHtml(t) + '</a>'; }
    });
    // mayúscula inicial cuando una cifra abre la frase
    html = html.replace(/^(<a class="fig-inline"[^>]*><strong>)(\p{Ll})/u, function (_, a, c) { return a + c.toUpperCase(); });
    if (o.terms) html = glossify(html, o.terms, o.used || {});
    return html;
  }
  UI.md = md;
  UI.glossify = glossify;

  // ---------- piezas ----------
  function canvasIcon(w, h, draw, label) {
    var c = el('canvas', { width: w * 2, height: h * 2, class: 'icon-canvas', 'aria-hidden': 'true', style: 'width:' + w + 'px;height:' + h + 'px' });
    var ctx = c.getContext('2d');
    ctx.scale(2, 2);
    try { draw(ctx); } catch (e) {}
    if (label) { c.setAttribute('role', 'img'); c.setAttribute('aria-label', label); c.removeAttribute('aria-hidden'); }
    return c;
  }
  UI.canvasIcon = canvasIcon;

  function legendChip(escala, opts) {
    opts = opts || {};
    var it = EEP.engine.legend.item(escala);
    if (!it) return el('span');
    return el('span', { class: 'legend-chip legend-slot-' + it.slot }, [
      el('span', { class: 'legend-swatch', 'aria-hidden': 'true' }),
      canvasIcon(24, 20, function (ctx) { EEP.course.legendSign(ctx, escala, 12, 17, 15); }),
      el('span', { class: 'legend-label', text: opts.full ? it.label : it.short })
    ]);
  }
  UI.legendChip = legendChip;

  function stampEl(id) {
    var st = (D().site.stamps || {})[id];
    if (!st) return el('span');
    var sign = EEP.course.stampSigns[st.sign];
    return el('div', { class: 'stamp', role: 'note' }, [
      canvasIcon(40, 40, function (ctx) { sign(ctx, 20, 36, 32); }),
      el('span', { text: st.text })
    ]);
  }
  UI.stampEl = stampEl;

  function badge(text, kind) { return el('span', { class: 'badge badge-' + (kind || 'state'), text: text }); }
  UI.badge = badge;

  // Tarjeta de cifra en la página (style S10): cifra, alcance, tipo, ficha de escala, fuente; «Con matiz» siempre con su alcance.
  function figCard(id, o) {
    o = o || {};
    var f = fig(id);
    if (!f) return el('div');
    var card = el('article', { class: 'card fig-card', id: o.anchor ? 'fig-' + id : null, 'aria-label': 'Cifra: ' + f.cifra });
    card.appendChild(el('div', { class: 'fig-card-top' }, [legendChip(f.escala), badge(f.tipo, 'type')]));
    card.appendChild(el('p', { class: 'fig-card-value', text: f.partes[0].valor }));
    card.appendChild(el('p', { class: 'fig-card-label', text: f.partes[0].etiqueta }));
    f.partes.slice(1).forEach(function (pt) {
      card.appendChild(el('p', { class: 'fig-card-part' }, [el('strong', { text: pt.valor }), ' ' + pt.etiqueta]));
    });
    card.appendChild(el('p', { class: 'fig-card-cifra', text: f.cifra }));
    var scope = el('div', { class: 'fig-card-scope' + (o.hideScope ? ' is-hidden' : '') });
    if (f.estado === 'Con matiz') scope.appendChild(badge(D().site.ui.conMatiz, 'state'));
    scope.appendChild(el('p', { text: f.alcance }));
    card.appendChild(scope);
    card.appendChild(el('p', { class: 'fig-card-source', text: 'Fuente: ' + f.fuentes.map(function (k) { var s = source(k); return s ? s.cita : k; }).join(' ') }));
    var det = el('details', { class: 'fig-card-original' }, [el('summary', { text: 'Cómo aparece en el documento' }),
      el('p', {}, [el('span', { class: 'original-literal', text: f.original })]), el('p', { class: 'fig-card-cita', text: f.cita })]);
    card.appendChild(det);
    if (o.usedIn) {
      var vs = videosUsing(id);
      if (vs.length) {
        var p = el('p', { class: 'fig-card-used' }, ['Aparece en: ']);
        vs.forEach(function (v, i) {
          var po = puntoOfVideo(v.id);
          p.appendChild(el('a', { href: po ? po.route : '#/inicio', text: v.title }));
          if (i < vs.length - 1) p.appendChild(document.createTextNode(' · '));
        });
        card.appendChild(p);
      }
    }
    return card;
  }
  UI.figCard = figCard;

  function section(title, children, cls) {
    return el('section', { class: 'section ' + (cls || '') }, [title ? el('h2', { text: title }) : null].concat(children || []));
  }
  UI.section = section;

  function setTitle(t) { document.title = (t ? t + ' · ' : '') + D().site.title; }
  UI.setTitle = setTitle;

  // ---------- encabezado y pie ----------
  function header() {
    var site = D().site;
    var nav = el('nav', { class: 'site-nav', 'aria-label': 'Navegación principal' });
    var ul = el('ul');
    site.nav.forEach(function (n) {
      if (n.menu) {
        var btn = el('button', { type: 'button', class: 'nav-menu-btn', 'aria-expanded': 'false', 'aria-haspopup': 'true', text: n.menu });
        var sub = el('ul', { class: 'nav-sub', hidden: true });
        D().puntos.forEach(function (p) { sub.appendChild(el('li', {}, [el('a', { href: p.route, text: 'Punto ' + p.n + ' · ' + p.card.title })])); });
        btn.addEventListener('click', function () { var o = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!o)); sub.hidden = o; });
        sub.addEventListener('click', function () { btn.setAttribute('aria-expanded', 'false'); sub.hidden = true; });
        document.addEventListener('click', function (e) { if (!btn.parentNode.contains(e.target)) { btn.setAttribute('aria-expanded', 'false'); sub.hidden = true; } });
        ul.appendChild(el('li', { class: 'nav-menu' }, [btn, sub]));
      } else ul.appendChild(el('li', {}, [el('a', { href: n.href, text: n.label })]));
    });
    nav.appendChild(ul);
    var toggle = el('button', { type: 'button', class: 'nav-toggle', 'aria-expanded': 'false', 'aria-controls': 'site-nav', text: 'Menú' });
    nav.id = 'site-nav';
    toggle.addEventListener('click', function () { var o = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', String(!o)); nav.classList.toggle('is-open', !o); });
    return el('header', { class: 'site-header' }, [
      el('a', { class: 'skip-link', href: '#main', text: 'Saltar al contenido', onclick: function (e) { e.preventDefault(); var m = document.getElementById('main'); m.focus(); } }),
      el('div', { class: 'site-header-inner' }, [el('a', { class: 'site-title', href: '#/inicio', text: site.title }), toggle, nav])
    ]);
  }
  function footer() {
    var site = D().site;
    var f = el('footer', { class: 'site-footer' });
    var inner = el('div', { class: 'site-footer-inner' });
    site.footer.forEach(function (t, i) { inner.appendChild(el('p', { class: i === 0 ? 'footer-title' : '', text: t })); });
    inner.appendChild(stampEl('stamp-insumo'));
    f.appendChild(inner);
    return f;
  }

  function updateNav() {
    var cur = '#' + EEP.router.current();
    Array.prototype.forEach.call(document.querySelectorAll('.site-nav a'), function (a) {
      var href = a.getAttribute('href');
      var on = cur === href || (href !== '#/inicio' && cur.indexOf(href + '/') === 0);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  // ---------- arranque ----------
  var main;
  function view(fn) {
    return function (m, path) {
      EEP.engine.player.destroyAll();
      if (UI.cleanup) { try { UI.cleanup(); } catch (e) {} UI.cleanup = null; }
      main.innerHTML = '';
      fn(main, m, path);
      updateNav();
      var nav = document.getElementById('site-nav');
      if (nav) nav.classList.remove('is-open');
      if (!/[?&]fig=|[?&]t=/.test(path)) root.scrollTo(0, 0);
      var h = main.querySelector('h1');
      if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); } }
    };
  }
  UI.query = function (path, key) {
    var m = new RegExp('[?&]' + key + '=([^&]*)').exec(path || '');
    return m ? decodeURIComponent(m[1]) : null;
  };

  UI.shell = {
    start: function () {
      document.body.innerHTML = '';
      main = el('main', { id: 'main', tabindex: '-1' });
      document.body.appendChild(header());
      document.body.appendChild(main);
      document.body.appendChild(footer());
      var R = EEP.router;
      R.on(/^\/inicio/, view(function (m) { UI.home(m); }));
      R.on(/^\/punto-3(?:\/([abc]))?/, view(function (m, mm) { UI.punto(m, 3, mm[1] || 'a'); }));
      R.on(/^\/punto-([1-7])/, view(function (m, mm) { UI.punto(m, +mm[1]); }));
      R.on(/^\/escalas/, view(function (m) { UI.escalas(m); }));
      R.on(/^\/cifras/, view(function (m, mm, path) { UI.cifras(m, UI.query(path, 'fig')); }));
      R.on(/^\/precauciones/, view(function (m) { UI.precauciones(m); }));
      R.on(/^\/glosario/, view(function (m, mm, path) { UI.glosario(m, UI.query(path, 't')); }));
      R.on(/^\/fuentes/, view(function (m) { UI.fuentes(m); }));
      R.on(/^\/modo-clase/, view(function (m) { UI.modoClase(m); }));
      R.on(/^\/acerca/, view(function (m) { UI.acerca(m); }));
      R.start(function () { R.go('/inicio'); });
    }
  };
})(window);
