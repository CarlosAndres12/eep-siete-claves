/* Espacio de nombres global, formato de números y mini-marcado. */
(function (root) {
  'use strict';
  var EEP = root.EEP = root.EEP || {};
  ['data', 'engine', 'style', 'course', 'videos', 'slides', 'ui'].forEach(function (k) {
    EEP[k] = EEP[k] || {};
  });

  // Formato de números del sitio (spec §0.2 NUMBER_FORMAT): coma decimal, punto de miles.
  var NUMBER_FORMAT = { decimal: ',', thousands: '.', spaceBeforeUnit: true };

  function formatNumber(n, decimals) {
    if (typeof n !== 'number' || !isFinite(n)) return String(n);
    var d = decimals == null ? (Math.round(n) === n ? 0 : 2) : decimals;
    var neg = n < 0;
    var s = Math.abs(n).toFixed(d);
    var parts = s.split('.');
    var int = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, NUMBER_FORMAT.thousands);
    var out = int + (parts[1] ? NUMBER_FORMAT.decimal + parts[1] : '');
    return (neg ? '−' : '') + out;
  }

  function withUnit(n, unit, decimals) {
    return formatNumber(n, decimals) + (unit ? (NUMBER_FORMAT.spaceBeforeUnit ? ' ' : '') + unit : '');
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Mini-marcado (base §1.1): **negrita**, [texto](ref:clave), {fig:id}, {glos:término}.
  // hooks: { fig(id) -> html, glos(term) -> html, ref(text, key) -> html }
  function markup(text, hooks) {
    hooks = hooks || {};
    var src = String(text == null ? '' : text);
    var out = '';
    var re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(ref:([^)]+)\)|\{fig:([^}]+)\}|\{glos:([^}]+)\}/g;
    var last = 0, m;
    while ((m = re.exec(src))) {
      out += escapeHtml(src.slice(last, m.index));
      if (m[1] != null) out += '<strong>' + escapeHtml(m[1]) + '</strong>';
      else if (m[2] != null) out += hooks.ref ? hooks.ref(m[2], m[3]) : escapeHtml(m[2]);
      else if (m[4] != null) out += hooks.fig ? hooks.fig(m[4].trim()) : '';
      else if (m[5] != null) out += hooks.glos ? hooks.glos(m[5].trim()) : escapeHtml(m[5]);
      last = re.lastIndex;
    }
    out += escapeHtml(src.slice(last));
    return out;
  }

  // Texto plano del mini-marcado (para lectores, transcripciones y lienzo).
  function plain(text, figText) {
    return String(text == null ? '' : text)
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\[([^\]]+)\]\(ref:[^)]+\)/g, '$1')
      .replace(/\{fig:([^}]+)\}/g, function (_, id) { return figText ? figText(id.trim()) : ''; })
      .replace(/\{glos:([^}]+)\}/g, '$1')
      .replace(/\s+([,.;:])/g, '$1').replace(/\s{2,}/g, ' ').trim();
  }

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') n.className = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k === 'text') n.textContent = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    });
    (children || []).forEach(function (c) {
      if (c == null) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }

  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  EEP.util = {
    NUMBER_FORMAT: NUMBER_FORMAT,
    formatNumber: formatNumber,
    withUnit: withUnit,
    escapeHtml: escapeHtml,
    markup: markup,
    plain: plain,
    el: el,
    clamp: clamp,
    fmtTime: fmtTime,
    reducedMotion: function () {
      try { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }
      catch (e) { return false; }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
