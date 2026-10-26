// Aislamiento del estilo y paleta (base §8.3). Debe pasar con cero errores.
// Uso: node tools/check-style.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { chromium } from 'playwright-core';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const errors = [], warnings = [];
const rel = (f) => path.relative(root, f);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.cache', 'review', 'content', '.git', 'assets'].includes(e.name)) walk(f, out); }
    else out.push(f);
  }
  return out;
}

// ---------- 1. literales de color ----------
const allowed = new Set(['js/style/tokens.js', 'js/style/primitives.js', 'js/style/signs.js', 'js/style/marks.js', 'js/style/people.js',
  'js/style/machine.js', 'js/style/backgrounds.js', 'js/style/lettering.js', 'js/style/testsheet.js', 'css/tokens.css', 'css/style.css', 'js/engine/legend.js']);
const NAMED = ['aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black','blanchedalmond','blue','blueviolet','brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue','cornsilk','crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgray','darkgreen','darkgrey','darkkhaki','darkmagenta','darkolivegreen','darkorange','darkorchid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkturquoise','darkviolet','deeppink','deepskyblue','dimgray','dodgerblue','firebrick','floralwhite','forestgreen','fuchsia','gainsboro','ghostwhite','gold','goldenrod','gray','green','greenyellow','grey','honeydew','hotpink','indianred','indigo','ivory','khaki','lavender','lavenderblush','lawngreen','lemonchiffon','lightblue','lightcoral','lightcyan','lightgray','lightgreen','lightpink','lightsalmon','lightseagreen','lightskyblue','lightslategray','lightsteelblue','lightyellow','lime','limegreen','linen','magenta','maroon','mediumblue','mintcream','navy','oldlace','olive','orange','orangered','orchid','pink','plum','purple','rebeccapurple','red','salmon','seagreen','sienna','silver','skyblue','slateblue','slategray','snow','springgreen','steelblue','tan','teal','thistle','tomato','turquoise','violet','wheat','white','whitesmoke','yellow','yellowgreen'];
const files = walk(root).filter((f) => /\.(js|css|html)$/.test(f) && !rel(f).startsWith('tools/'));
for (const f of files) {
  const r = rel(f);
  if (allowed.has(r) || r.startsWith('js/style/')) continue;
  const src = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const lines = src.split('\n');
  lines.forEach((ln, i) => {
    const hex = ln.match(/(^|[^&\w])#[0-9a-fA-F]{3,8}\b/);
    if (hex && !/#\/|href=|url\(#|'#'|"#"/.test(ln)) errors.push(`${r}:${i + 1}: literal de color ${hex[0].trim()}`);
    if (/\b(rgba?|hsla?)\s*\(/.test(ln)) errors.push(`${r}:${i + 1}: literal de color rgb()/hsl()`);
    if (r.endsWith('.css')) {
      const m = ln.match(/:\s*([^;{}]+)/);
      if (m) for (const n of NAMED) if (new RegExp(`(^|[\\s,(])${n}([\\s,;)]|$)`, 'i').test(m[1]) && !/font|content|grid-area|animation-name/.test(ln)) errors.push(`${r}:${i + 1}: color con nombre «${n}»`);
    } else {
      const strs = ln.match(/(['"])([a-z]+)\1/g) || [];
      for (const s of strs) { const v = s.slice(1, -1); if (NAMED.includes(v)) errors.push(`${r}:${i + 1}: color con nombre «${v}»`); }
    }
  });
}

// ---------- 2. tokens.js = tokens.css = style S3 ----------
const styleFiles = fs.readdirSync(path.join(root, 'content')).filter((f) => /^estilo-.*\.md$/.test(f));
if (styleFiles.length !== 1) errors.push(`content/ debe tener exactamente un estilo-*.md (hay ${styleFiles.length})`);
const styleMd = fs.readFileSync(path.join(root, 'content', styleFiles[0]), 'utf8');
const s3 = {};
for (const m of styleMd.matchAll(/^\|\s*`([a-z0-9-]+)`\s*\|[^|]*\|\s*`(#[0-9A-Fa-f]{6})`\s*\|/gm)) s3[m[1]] = m[2].toUpperCase();
const sandbox = { window: { EEP: { data: {}, engine: {}, style: {}, course: {}, videos: {}, slides: {}, ui: {} } } };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'js/style/tokens.js'), 'utf8'), sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'js/engine/legend.js'), 'utf8'), sandbox);
const tokens = sandbox.window.EEP.style.tokens;
const jsRoles = Object.fromEntries(Object.entries(tokens.roles).map(([k, v]) => [k, v.toUpperCase()]));
const css = fs.readFileSync(path.join(root, 'css/tokens.css'), 'utf8');
const cssRoles = {};
for (const m of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})\s*;/g)) if (!m[1].startsWith('legend-')) cssRoles[m[1]] = m[2].toUpperCase();
for (const [k, v] of Object.entries(s3)) {
  if (jsRoles[k] !== v) errors.push(`tokens.js: el rol ${k} es ${jsRoles[k]} y la tabla S3 dice ${v}`);
  if (cssRoles[k] !== v) errors.push(`tokens.css: el rol ${k} es ${cssRoles[k]} y la tabla S3 dice ${v}`);
}
for (const k of Object.keys(jsRoles)) if (!(k in s3)) errors.push(`tokens.js define ${k}, que no está en S3`);
for (const k of Object.keys(cssRoles)) if (!(k in s3)) errors.push(`tokens.css define --${k}, que no está en S3`);

// ---------- 3. roles y contrastes ----------
const ROLES = ['ground', 'ground-2', 'ink', 'ink-soft', 'dark', 'on-dark', 'accent-1', 'accent-2', 'accent-3', 'skin-1', 'skin-2', 'skin-3', 'skin-4', 'skin-5', 'machine-ground', 'machine-line', 'machine-grid', 'machine-glow-1', 'machine-glow-2', 'alert'];
for (const r of ROLES) if (!jsRoles[r]) errors.push(`falta el rol ${r}`);
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => { const c = hexRgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const pairs = [['ink', 'ground', 4.5], ['ink-soft', 'ground', 4.5], ['ink', 'ground-2', 4.5], ['on-dark', 'dark', 4.5], ['on-dark', 'machine-ground', 4.5], ['machine-line', 'machine-ground', 3], ['alert', 'ground', 4.5]];
const contrastReport = [];
for (const [a, b, min] of pairs) {
  const c = contrast(jsRoles[a], jsRoles[b]);
  contrastReport.push(`${a}/${b} ${c.toFixed(2)}:1`);
  if (c < min) errors.push(`contraste ${a} sobre ${b} = ${c.toFixed(2)}:1 < ${min}:1`);
}

// ---------- 4. leyenda ----------
const ordM = styleMd.match(/^Legend order:\s*(.+)$/m);
const exM = styleMd.match(/^Legend exclusions:\s*(.+)$/m);
const styleOrder = ordM ? ordM[1].split(',').map((s) => s.trim().toLowerCase()) : [];
const styleEx = exM ? exM[1].split(/,(?![^(]*\))/).map((s) => s.replace(/\(.*\)/, '').trim().toLowerCase()) : [];
if (JSON.stringify(styleOrder) !== JSON.stringify(tokens.legendOrder)) errors.push(`orden de leyenda ${tokens.legendOrder} ≠ estilo ${styleOrder}`);
if (JSON.stringify(styleEx.sort()) !== JSON.stringify([...tokens.legendExclude].sort())) errors.push(`exclusiones ${tokens.legendExclude} ≠ estilo ${styleEx}`);
const CORE = sandbox.window.EEP.engine.legend.CORE;
for (const [n, h] of Object.entries(CORE)) {
  const c = contrast(h, jsRoles.ground);
  if (c < 1.5 && !tokens.legendExclude.includes(n)) errors.push(`el color de leyenda ${n} tiene ${c.toFixed(2)}:1 sobre ground y no está excluido`);
}
// CIEDE2000
function toLab(h) {
  let [r, g, b] = hexRgb(h).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047, y = r * 0.2126 + g * 0.7152 + b * 0.0722, z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
function de2000(h1, h2) {
  const [L1, a1, b1] = toLab(h1), [L2, a2, b2] = toLab(h2);
  const rad = Math.PI / 180, deg = 180 / Math.PI;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cb = (C1 + C2) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));
  const a1p = a1 * (1 + G), a2p = a2 * (1 + G);
  const C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
  const h1p = (Math.atan2(b1, a1p) * deg + 360) % 360, h2p = (Math.atan2(b2, a2p) * deg + 360) % 360;
  const dL = L2 - L1, dC = C2p - C1p;
  let dh = h2p - h1p; if (C1p * C2p === 0) dh = 0; else if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;
  const dH = 2 * Math.sqrt(C1p * C2p) * Math.sin(dh / 2 * rad);
  const Lb = (L1 + L2) / 2, Cbp = (C1p + C2p) / 2;
  let hb = h1p + h2p; if (C1p * C2p !== 0) { if (Math.abs(h1p - h2p) > 180) hb += h1p + h2p < 360 ? 360 : -360; hb /= 2; }
  const T = 1 - 0.17 * Math.cos((hb - 30) * rad) + 0.24 * Math.cos(2 * hb * rad) + 0.32 * Math.cos((3 * hb + 6) * rad) - 0.2 * Math.cos((4 * hb - 63) * rad);
  const dTh = 30 * Math.exp(-(((hb - 275) / 25) ** 2));
  const Rc = 2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7));
  const Sl = 1 + 0.015 * (Lb - 50) ** 2 / Math.sqrt(20 + (Lb - 50) ** 2), Sc = 1 + 0.045 * Cbp, Sh = 1 + 0.015 * Cbp * T;
  const Rt = -Math.sin(2 * dTh * rad) * Rc;
  return Math.sqrt((dL / Sl) ** 2 + (dC / Sc) ** 2 + (dH / Sh) ** 2 + Rt * (dC / Sc) * (dH / Sh));
}
const legendData = (() => { const sb = { window: { EEP: { data: {} } } }; vm.createContext(sb); vm.runInContext(fs.readFileSync(path.join(root, 'js/data/legend.js'), 'utf8'), sb); return sb.window.EEP.data.legend; })();
const usedOrder = tokens.legendOrder.filter((n) => !tokens.legendExclude.includes(n));
const inUse = legendData.map((it) => usedOrder[it.slot - 1]).filter(Boolean);
for (const n of inUse) {
  const h = CORE[n];
  for (const [r, v] of Object.entries(jsRoles)) {
    const d = de2000(h, v);
    if (/^accent-/.test(r) && d < 15) errors.push(`leyenda ${n} a ΔE00 ${d.toFixed(1)} de ${r} (< 15)`);
    else if (/^(skin-|machine-glow|machine-line$|ground-2$|alert$)/.test(r) && d < 15) warnings.push(`leyenda ${n} a ΔE00 ${d.toFixed(1)} de ${r}`);
  }
}
// espejo --legend-k en tokens.css
usedOrder.forEach((n, i) => {
  const m = css.match(new RegExp(`--legend-${i + 1}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!m || m[1].toUpperCase() !== CORE[n].toUpperCase()) errors.push(`tokens.css --legend-${i + 1} no refleja ${n} ${CORE[n]}`);
});

// ---------- 5 y 6. hoja de prueba: contornos ink de la leyenda y consola ----------
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium', args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const consoleErr = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErr.push(m.text()); });
page.on('pageerror', (e) => consoleErr.push(e.message));
await page.goto('file://' + path.join(root, 'index.html') + '?render=estilo&page=1');
await page.waitForFunction(() => window.renderReadyFlag === true, null, { timeout: 20000 });
const outline = await page.evaluate(() => {
  const boxes = window.EEP.style.__legendBoxes || [];
  const ctx = document.querySelector('canvas').getContext('2d');
  const ink = window.EEP.style.hexToRgb(window.EEP.style.tokens.roles.ink);
  const near = (p) => Math.abs(p[0] - ink[0]) + Math.abs(p[1] - ink[1]) + Math.abs(p[2] - ink[2]) < 60;
  const isInk = (x, y) => near(ctx.getImageData(x, y, 1, 1).data);
  return boxes.map((b) => {
    const xm = Math.round(b.x + b.w / 2), ym = Math.round(b.y + b.h / 2);
    const ok = isInk(b.x - 1, ym) && isInk(b.x, ym) && isInk(b.x + b.w - 1, ym) && isInk(b.x + b.w, ym)
      && isInk(xm, b.y - 1) && isInk(xm, b.y) && isInk(xm, b.y + b.h - 1) && isInk(xm, b.y + b.h);
    return { id: b.id, ok };
  });
});
if (!outline.length) errors.push('la hoja de prueba no registró cajas de leyenda (__legendBoxes)');
for (const o of outline) if (!o.ok) errors.push(`la forma de leyenda ${o.id} de la hoja de prueba no tiene contorno ink de 2 px`);
await page.evaluate(() => window.renderPage(2));
for (const e of consoleErr) errors.push(`consola de la hoja de prueba: ${e}`);
await browser.close();

console.log('check-style · aislamiento del estilo y paleta (base §8.3)');
console.log(`  archivos revisados: ${files.length} · roles S3: ${Object.keys(s3).length} · ${contrastReport.join(' · ')}`);
console.log(`  leyenda en uso: ${inUse.join(', ')} · formas de leyenda revisadas en la hoja: ${outline.length}`);
for (const w of warnings) console.log('  AVISO: ' + w);
for (const e of errors) console.log('  ERROR: ' + e);
console.log(`  ${errors.length} errores, ${warnings.length} avisos`);
process.exit(errors.length ? 1 : 0);
