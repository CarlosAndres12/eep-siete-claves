// Cifras permitidas por video, separación de los videos del Punto 3 y cifras retenidas (spec §10.2, checks 1–3).
// Uso: node tools/check-allowed.mjs
import fs from 'node:fs';
import path from 'node:path';
import { loadData, root } from './lib/load-data.mjs';

const EEP = loadData({ engine: false });
const D = EEP.data;
const errors = [];
const allowed = D.allowed || {};
const A = ['P3-C01', 'P3-C03', 'P3-C04', 'P3-C05', 'P3-C06', 'P3-C12', 'P3-C53', 'P3-C54', 'P3-C55', 'P3-C56'];
const B = ['P3-C21', 'P3-C22', 'P3-C23', 'P3-C27', 'P3-C32'];
const C = ['P3-C36', 'P3-C37', 'P3-C40', 'P3-C41'];
const groupOf = (id) => (A.includes(id) ? 'A' : B.includes(id) ? 'B' : C.includes(id) ? 'C' : null);
const WITHHELD = ['P2-C14', 'P2-C15', 'P2-C17', 'P2-C18', 'P2-C37', 'P2-C38', 'P1-C12', 'P4-C02', 'P5-C12'];

if (!D.allowed) errors.push('falta js/data/allowed.js');
// 1. cifras permitidas por video
let checked = 0;
for (const v of D.videos || []) {
  const list = allowed[v.id];
  if (!list) { errors.push(`allowed.js no tiene la lista de ${v.id}`); continue; }
  for (const sc of v.scenes) for (const id of sc.figs || []) {
    checked++;
    if (!list.includes(id)) errors.push(`${v.id}/${sc.id}: ${id} no está entre las cifras permitidas de ${v.id}`);
  }
}
// 2. separación del Punto 3: cada pieza muestra una sola medición
function idsIn(o) { const s = JSON.stringify(o || ''); return [...new Set([...s.matchAll(/P3-C\d+/g)].map((m) => m[0]))]; }
function oneGroup(ids, where) {
  const gs = [...new Set(ids.map(groupOf).filter(Boolean))];
  if (gs.length > 1) errors.push(`${where}: mezcla mediciones ${gs.join(' y ')} del Punto 3 (${ids.join(', ')})`);
}
for (const v of D.videos || []) oneGroup(idsIn(v.scenes.map((s) => s.figs)), `video ${v.id}`);
const p3 = (D.puntos || []).find((p) => p.n === 3);
if (p3 && p3.tabs) p3.tabs.forEach((t) => oneGroup(idsIn(t), `#/punto-3/${t.id}`));
if (D.messages && D.messages[3]) {
  const m3 = D.messages[3];
  (Array.isArray(m3) ? m3 : []).forEach((m, i) => oneGroup(idsIn(m), `messages Punto 3 MC${i + 1}`));
}
for (const sl of (D.slides && D.slides.items) || []) oneGroup(idsIn(sl), `diapositiva ${sl.id}`);
if (D.slides && D.slides.decks) for (const [k, d] of Object.entries(D.slides.decks)) if (/^3/.test(k)) oneGroup(idsIn(d), `mazo ${k}`);
// 3. cifras retenidas ausentes de todos los datos
for (const f of fs.readdirSync(path.join(root, 'js/data'))) {
  const src = fs.readFileSync(path.join(root, 'js/data', f), 'utf8');
  for (const id of WITHHELD) if (src.includes(id)) errors.push(`js/data/${f} contiene la cifra retenida ${id}`);
}

console.log('check-allowed · cifras permitidas, separación del Punto 3 y cifras retenidas (spec §10.2)');
console.log(`  videos: ${(D.videos || []).length} · usos de cifras revisados: ${checked}`);
for (const e of errors) console.log('  ERROR: ' + e);
console.log(`  ${errors.length} errores`);
process.exit(errors.length ? 1 : 0);
