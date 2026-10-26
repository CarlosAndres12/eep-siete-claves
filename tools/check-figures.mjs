// Trazabilidad de cifras (base §8.2) y enunciados prohibidos (spec §10.1). Debe pasar con cero errores.
// Uso: node tools/check-figures.mjs
import fs from 'node:fs';
import path from 'node:path';
import { loadData, contentSection, puntoOf, root } from './lib/load-data.mjs';

const EEP = loadData();
const D = EEP.data;
const errors = [], warnings = [], info = [];
const figs = Object.fromEntries((D.figures || []).map((f) => [f.id, f]));
const sources = Object.fromEntries((D.sources || []).map((s) => [s.key, s]));
const used = new Set();

// ---------- 1 y 2. ids y partes ----------
for (const f of D.figures) {
  for (const k of f.fuentes) if (!sources[k]) errors.push(`${f.id}: fuente desconocida «${k}»`);
  for (const p of f.partes) {
    for (const key of ['valor', 'etiqueta']) {
      if (!(f.cifra.includes(p[key]) || f.alcance.includes(p[key]))) errors.push(`${f.id}: partes.${key} «${p[key]}» no es literal de cifra ni alcance`);
    }
  }
}
for (const s of D.sources) if (s.corta && !s.cita.includes(s.corta)) errors.push(`fuente ${s.key}: «corta» no es un fragmento literal de «cita»`);
function useId(id, where) {
  if (!figs[id]) errors.push(`${where}: la cifra ${id} no existe en figures.js`);
  else used.add(id);
}
for (const v of D.videos || []) for (const sc of v.scenes) for (const id of sc.figs || []) useId(id, `${v.id}/${sc.id}`);
// {fig:id} en cualquier dato de texto
function walk(o, fn, p = '') {
  if (typeof o === 'string') fn(o, p);
  else if (Array.isArray(o)) o.forEach((x, i) => walk(x, fn, p + '[' + i + ']'));
  else if (o && typeof o === 'object') for (const k of Object.keys(o)) walk(o[k], fn, p + '.' + k);
}
for (const key of ['puntos', 'messages', 'slides', 'widgets', 'glossary', 'corrections']) {
  walk(D[key], (s, p) => { for (const m of s.matchAll(/\{fig:([^}]+)\}/g)) useId(m[1].trim(), key + p); });
}
for (const sl of (D.slides && D.slides.items) || []) for (const id of sl.figs || []) useId(id, 'slides/' + sl.id);
for (const it of (D.widgets && D.widgets.queMide && D.widgets.queMide.items) || []) useId(it.figure, 'widgets.queMide');
for (const id of (D.widgets && D.widgets.escalas && D.widgets.escalas.items) || []) useId(id, 'widgets.escalas');

// ---------- 3 y 4. cifras en voz, «Se ve» y textos ----------
const tokenRe = /\d+(?:[.,]\d+)*/g;
const isYear = (t) => /^(19|20)\d\d$/.test(t);
for (const v of D.videos || []) {
  const section = contentSection(puntoOf(v));
  for (const sc of v.scenes) {
    const pool = (sc.figs || []).map((id) => figs[id] ? figs[id].cifra + ' ' + figs[id].alcance : '').join(' ');
    const items = [];
    (sc.lines || []).forEach((l, i) => items.push({ s: l.text, where: `línea ${i + 1}`, mis: l.misreading, voice: true }));
    items.push({ s: sc.seVe, where: '«Se ve»' });
    for (const [k, t] of Object.entries(sc.texts || {})) items.push({ s: t, where: `texts.${k}` });
    for (const it of items) {
      if (it.voice && /[+−→]/.test(it.s)) errors.push(`${v.id}/${sc.id} ${it.where}: la voz contiene «+», «−» o «→»`);
      if (it.mis || sc.ejemplo) continue;
      for (const tok of it.s.match(tokenRe) || []) {
        if (isYear(tok)) continue;
        if (pool.includes(tok)) continue;
        if (section.includes(tok) || section.includes(tok.replace(/\./g, ',').replace(/,(?=\d+$)/, '.'))) warnings.push(`${v.id}/${sc.id} ${it.where}: «${tok}» no está en las cifras de la escena, pero sí en la sección del punto (revisar a mano)`);
        else errors.push(`${v.id}/${sc.id} ${it.where}: «${tok}» no está en las cifras de la escena ni en la sección del punto`);
      }
    }
    (sc.lines || []).forEach((l, i) => {
      if (l.misreading && !(sc.lines[i + 1] && sc.lines[i + 1].voice === 'narrador')) errors.push(`${v.id}/${sc.id}: la línea ${i + 1} es error de lectura y no la sigue una corrección del narrador`);
    });
  }
}

// ---------- 5. literales en archivos de video, curso y diapositivas ----------
const codeDirs = ['js/videos', 'js/course', 'js/slides'];
for (const dir of codeDirs) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs).filter((x) => x.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(abs, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/([^:'"])\/\/.*$/gm, '$1');
    src.split('\n').forEach((ln, i) => {
      for (const m of ln.matchAll(/'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"/g)) {
        const s = m[1] != null ? m[1] : m[2];
        if (s === 'use strict') continue;
        if (/%|\d{1,3}\.\d{3}|\d,\d/.test(s)) errors.push(`${dir}/${f}:${i + 1}: literal de cifra «${s}»`);
        if (/[áéíóúñÁÉÍÓÚÑ¿¡«»]/.test(s) || /[A-Za-z]{2,}\s+[A-Za-z]{2,}/.test(s)) errors.push(`${dir}/${f}:${i + 1}: texto en pantalla en el código «${s}»`);
      }
    });
  }
}

// ---------- 6. «Con matiz» muestra su alcance ----------
const cardsSrc = fs.readFileSync(path.join(root, 'js/engine/cards.js'), 'utf8');
if (!/f\.estado === 'Con matiz'/.test(cardsSrc)) errors.push('cards.js no muestra el alcance de las filas «Con matiz»');
const uiCard = path.join(root, 'js/ui/shell.js');
if (fs.existsSync(uiCard) && !/Con matiz/.test(fs.readFileSync(uiCard, 'utf8'))) warnings.push('shell.js: no se encontró el tratamiento «Con matiz» en la tarjeta de página');

// ---------- 7. enunciados prohibidos (spec §10.1) ----------
// Corpus: todo lo que el sitio muestra o dice, salvo los lugares exentos.
const corpus = []; // { text, where, piece }
function add(text, where, piece) { if (text) corpus.push({ text: String(text), where, piece: piece || where }); }
for (const v of D.videos || []) {
  for (const sc of v.scenes) {
    const piece = `${v.id}/${sc.id}`;
    sc.lines.forEach((l, i) => { if (!l.misreading) add(l.text, `${piece} línea ${i + 1}`, v.id); });
    add(sc.seVe, `${piece} «Se ve»`, v.id);
    for (const [k, t] of Object.entries(sc.texts || {})) add(t, `${piece} texts.${k}`, v.id);
    for (const id of sc.figs || []) if (figs[id]) add(figs[id].cifra + '. ' + figs[id].alcance, `${piece} tarjeta ${id}`, v.id);
  }
  for (const c of v.checkpoints || []) {
    add(c.question, `${v.id} pregunta`, v.id);
    add(c.options[c.answer], `${v.id} respuesta`, v.id);
    add(c.explain, `${v.id} explicación`, v.id);
    add(c.hint, `${v.id} pista`, v.id);
  }
}
const exemptKeys = new Set(['noUses', 'distractors']);
for (const key of ['site', 'puntos', 'messages', 'slides', 'glossary', 'widgets', 'corrections', 'legend', 'sources']) {
  if (!D[key]) continue;
  (function rec(o, p) {
    if (typeof o === 'string') { add(o, key + p, key + p.split('.').slice(0, 3).join('.')); return; }
    if (Array.isArray(o)) { o.forEach((x, i) => rec(x, p + '[' + i + ']')); return; }
    if (o && typeof o === 'object') for (const k of Object.keys(o)) if (!exemptKeys.has(k)) rec(o[k], p + '.' + k);
  })(D[key], '');
}
for (const f of D.figures) add(f.cifra + '. ' + f.alcance, `banco ${f.id}`, `banco ${f.id}`);
for (const dir of ['js/ui', 'js/slides', 'js/engine']) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs).filter((x) => x.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(abs, f), 'utf8');
    for (const m of src.matchAll(/'([^'\\\n]{6,})'/g)) add(m[1], `${dir}/${f}`);
  }
}
const readme = path.join(root, 'README.md');
const readmeText = fs.existsSync(readme) ? fs.readFileSync(readme, 'utf8') : '';

const sentences = (t) => t.split(/(?<=[.?!;:])\s+(?=[«¿¡"“A-ZÁÉÍÓÚÑ0-9])/);
const rules = [
  ['1', (s) => /94[,.]7\s?%/.test(s) && /(menos de 1 ha|menores a 1 ha|menor a 1 hectárea|menos de una hectárea|menos de 1 hectárea)/i.test(s)],
  ['2', (s) => /92\s?%/.test(s) && /(consum|gast)/i.test(s) && !/(no es lo mismo|no equivale)/i.test(s)],
  ['3', (s) => /(\b85\s?%|\b90\s?%|más del 90\s?%)/.test(s) && /(agua|caudal|cuenca|embalse)/i.test(s)],
  ['4', (s) => /40,93\s?% del Distrito/.test(s) || /zonificación oficial,? (el )?40,93/.test(s) || /40,93\s?%[^,.;]{0,30}zonificación oficial/.test(s)
    || /37,23\s?% del área urbanizada/.test(s) || /mapa combinado,? (el )?37,23/.test(s) || /37,23\s?%[^,.;]{0,30}mapa combinado/.test(s) || /78,16/.test(s) || /3,70\s?%/.test(s)],
  ['6', (s) => /1\.415,07/.test(s) && /2\.166,58/.test(s)],
  ['7', (s) => /22\.956,09/.test(s) && /(nueva estructura|estructura propuesta|delimitación propuesta|propuesta abarca|tendrá)/i.test(s) && !/(vigente|no es el área|no reporta)/i.test(s)],
  ['8', (s) => /(71,2|49,9|48,6)\s?%/.test(s) || (/en una década/i.test(s) && /enlace/i.test(s))],
  ['9', (s) => (/(\b0,5|\b1,6|\b3|\b97|\b98|\b85)\s?%/.test(s) && /(aliment|producción local|autoabastecimiento|dependencia)/i.test(s)) || /Medellín no produce alimentos/.test(s)
    || (/autosuficien/i.test(s) && !/(no se debe|no debe|sin prometer|no prometer|estructura)/i.test(s))],
  ['10', (s) => /(12\.500 viviendas|1\.200 emergencias|667,20|3\.400 ha|3\.400 hectáreas|355 ha\b|98\.000 viajes|65,2\s?%|79,4\s?%|73,31\s?%|458,21)/.test(s)],
  ['11', (s) => (/\d+\s?(pts|puntos)\b/.test(s) && /factor/i.test(s)) || /unánime/i.test(s)],
  ['12', (s) => /tres estándares/i.test(s) || /mayor parte de las 1\.358,25/.test(s) || /(estructura crece|crece en|aumento neto|incremento neto)[^.]{0,40}(1\.358,25|5\.915,18)/i.test(s)],
  ['13', (s) => /(el POT exige|el POT ya|quedó adoptado)/i.test(s) && /30\s?(m\b|metros)/.test(s)],
  ['14', (s) => /exactitud del 85/.test(s) && /(tiene|alcanza|logró|acierta)/i.test(s)],
  ['15', (s) => (/10\.534,68/.test(s) && /(ilegal|invasi)/i.test(s) && !/no (significa|implica)/i.test(s)) || /conflicto de uso (es|significa) (una )?ilegal/i.test(s)],
  ['16', (s) => /36,77/.test(s) && /(conurba|una sola ciudad)/i.test(s) && !/no equivale/i.test(s)],
  ['17', (s) => /13\.785,68/.test(s) && !/(aves|modelo|flujos ecológicos)/i.test(s)],
  ['19', (s) => /amenaza alta (es|significa) (un )?riesgo alto/i.test(s) && !/^¿/.test(s.trim()) && !/\bno\b/i.test(s) || /amenaza alta equivale a/i.test(s)],
  ['20', (s) => /95,2\s?%/.test(s) || /920 de los 966/.test(s)],
  ['21', (s) => /151,5|191,0/.test(s)],
  ['22', (s) => /\b(invasión|invasiones|urbanización pirata|asentamientos subnormales|minifundismo desordenado|pantanos alimentarios|desiertos alimentarios)\b/i.test(s)],
  ['23', (s) => /(el POT adoptó|ya es norma|se adoptó|quedó aprobado)/i.test(s) && /(delimitación|retiro|conectividad metropolitana|comité de integración|borde urbano-rural)/i.test(s)],
  ['24', (s) => /Ley 2046/.test(s) && /APPA/.test(s)],
  ['25', (s) => /(borrador|por validar|validar con el DAP|validación del DAP|que el DAP valide|debe validarse|deben validarse|por confirmar|pendiente de validación)/i.test(s)]
];
for (const c of corpus) {
  for (const sen of sentences(c.text)) {
    for (const [n, fn] of rules) if (fn(sen)) errors.push(`regla ${n} de spec §10.1 · ${c.where}: «${sen.slice(0, 140)}»`);
  }
}
// README: todas salvo la 25 (sus notas de mantenimiento explican cómo añadir una cifra validada)
for (const sen of sentences(readmeText)) for (const [n, fn] of rules) if (n !== '25' && fn(sen)) errors.push(`regla ${n} de spec §10.1 · README: «${sen.slice(0, 140)}»`);
// Regla 5 (por pieza) y 18 (por escena o tarjeta)
const byPiece = {};
for (const c of corpus) (byPiece[c.piece] = byPiece[c.piece] || []).push(c.text);
for (const [piece, texts] of Object.entries(byPiece)) {
  const all = texts.join(' \n ');
  if (/3\.491,58/.test(all) && /(692,65|\b851\b|2\.720)/.test(all) && !/^corrections/.test(piece)) errors.push(`regla 5 de spec §10.1 · ${piece}: mezcla cifras de dos mediciones de la expansión`);
}
for (const v of D.videos || []) for (const sc of v.scenes) {
  const t = [sc.seVe].concat(sc.lines.map((l) => l.text), Object.values(sc.texts || {}), (sc.figs || []).map((id) => figs[id] ? figs[id].cifra + ' ' + figs[id].alcance : '')).join(' ');
  if (/cuatro de cada diez hectáreas/i.test(t) && !/(40,93|mapa combinado)/.test(t)) errors.push(`regla 18 de spec §10.1 · ${v.id}/${sc.id}: «cuatro de cada diez hectáreas» sin su base`);
}
for (const c of corpus.filter((c) => !/^v\d/.test(c.piece))) {
  if (/cuatro de cada diez hectáreas/i.test(c.text) && !/(40,93|mapa combinado)/.test(c.text) && !/^banco/.test(c.where)) errors.push(`regla 18 de spec §10.1 · ${c.where}: «cuatro de cada diez hectáreas» sin su base`);
}

// ---------- 8. filas sin usar ----------
const unused = D.figures.filter((f) => !used.has(f.id)).map((f) => f.id);
if (unused.length) info.push(`filas del banco sin usar (${unused.length}): ${unused.join(', ')}`);

console.log('check-figures · trazabilidad de cifras (base §8.2) y enunciados prohibidos (spec §10.1)');
console.log(`  cifras en el banco: ${D.figures.length} · usadas: ${used.size} · textos revisados: ${corpus.length}`);
for (const i of info) console.log('  INFO: ' + i);
for (const w of warnings) console.log('  AVISO: ' + w);
for (const e of errors) console.log('  ERROR: ' + e);
console.log(`  ${errors.length} errores, ${warnings.length} avisos`);
process.exit(errors.length ? 1 : 0);
