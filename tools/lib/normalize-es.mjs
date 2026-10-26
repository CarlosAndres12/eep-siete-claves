// Texto en pantalla (español) → texto para decir (base §4.5). Los números siempre se escriben en palabras:
// ninguna cifra en dígitos llega a la voz. El léxico se aplica primero y protege los dígitos que contiene.
import fs from 'node:fs';
import path from 'node:path';

const UNITS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince',
  'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis',
  'veintisiete', 'veintiocho', 'veintinueve'];
const TENS = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const HUNDREDS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

function fem(s) { return s.replace(/ientos\b/g, 'ientas').replace(/\buno$/, 'una').replace(/veintiuno$/, 'veintiuna'); }

function below1000(n) {
  if (n === 0) return '';
  if (n === 100) return 'cien';
  const h = Math.floor(n / 100), r = n % 100;
  let out = h ? HUNDREDS[h] : '';
  if (r) {
    let w;
    if (r < 30) w = UNITS[r];
    else { const t = Math.floor(r / 10), u = r % 10; w = TENS[t] + (u ? ' y ' + UNITS[u] : ''); }
    out += (out ? ' ' : '') + w;
  }
  return out;
}

// Entero → palabras. feminine: «doscientas», «una».
export function intToWords(n, feminine = false) {
  n = Math.floor(n);
  if (n === 0) return 'cero';
  let out = [];
  const millions = Math.floor(n / 1e6), thousands = Math.floor((n % 1e6) / 1000), rest = n % 1000;
  if (millions) out.push(millions === 1 ? 'un millón' : apocope(below1000(millions)) + ' millones');
  if (thousands) {
    let tw = thousands === 1 ? 'mil' : apocope(below1000(thousands), feminine) + ' mil';
    if (feminine && thousands !== 1) tw = fem(tw.replace(/ mil$/, '')).replace(/una$/, 'un') + ' mil';
    out.push(tw);
  }
  if (rest) out.push(feminine ? fem(below1000(rest)) : below1000(rest));
  return out.join(' ');
}
function apocope(s) { return s.replace(/veintiuno$/, 'veintiún').replace(/\buno$/, 'un'); }

const FEM_NOUNS = /^(hectáreas?|ha\b|familias|muestras|personas|toneladas|viviendas|veces|horas|semanas|unidades)/i;

// Número en formato del sitio («1.358,25», «0,4», «36») → palabras.
export function numberToWords(str, feminine = false) {
  const clean = str.replace(/\./g, '');
  const [i, d] = clean.split(',');
  let out = intToWords(parseInt(i, 10), feminine && !d);
  if (d != null) {
    // decimales: «coma» y el número tal cual (sin ceros a la izquierda se lee como número; con ceros, dígito a dígito)
    let dw;
    if (/^0/.test(d) && d.length > 1) dw = d.split('').map((c) => UNITS[+c]).join(' ');
    else dw = intToWords(parseInt(d, 10));
    out = (feminine ? fem(out).replace(/una$/, 'una') : out) + ' coma ' + dw;
  }
  return out;
}

const ORD = { 1: 'primero', 2: 'segundo', 3: 'tercero', 4: 'cuarto', 5: 'quinto', 6: 'sexto', 7: 'séptimo', 8: 'octavo', 9: 'noveno', 10: 'décimo' };
const UNIT_WORDS = [
  [/^km²/, 'kilómetros cuadrados'], [/^m³\/s/, 'metros cúbicos por segundo'], [/^ha\/año/, 'hectáreas por año'],
  [/^ha\b/, 'hectáreas'], [/^m\b/, 'metros'], [/^km\b/, 'kilómetros']
];

export function loadLexicon(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')).entries || []; } catch { return []; }
}

// normalize(text, lexicon) → texto para decir; falla si encuentra «+», «−» o «→».
export function normalize(text, lexicon = []) {
  let s = String(text);
  if (/[+−→]/.test(s)) throw new Error('La línea contiene «+», «−» o «→»: ' + s);
  // léxico primero, protegiendo dígitos
  const prot = [];
  for (const e of lexicon) {
    if (!e.alias) continue;
    const re = new RegExp('(?<![\\wÁÉÍÓÚáéíóúñÑ])' + e.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\wÁÉÍÓÚáéíóúñÑ])', 'g');
    s = s.replace(re, () => { prot.push(e.alias); return '\u0001' + String.fromCharCode(97 + prot.length - 1) + '\u0001'; });
  }
  // comillas y signos que no se dicen
  s = s.replace(/[«»“”"]/g, '').replace(/…/g, ', ');
  s = s.replace(/\bIA\b/g, 'i a');
  // símbolos
  s = s.replace(/≈\s?/g, 'aproximadamente ').replace(/~\s?/g, 'cerca de ').replace(/<\s?(?=\d)/g, 'menos de ').replace(/>\s?(?=\d)/g, 'más de ');
  // fechas con día: «1 de agosto»
  s = s.replace(/\b1 de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)/g, 'primero de $1');
  // ordinales
  s = s.replace(/\b(\d{1,2})\.º/g, (_, n) => ORD[+n] || intToWords(+n));
  // fracciones
  s = s.replace(/\b1\/3\b/g, 'un tercio').replace(/\b2\/3\b/g, 'dos tercios').replace(/\b1\/2\b/g, 'un medio').replace(/\b1\/4\b/g, 'un cuarto');
  // rangos con raya: «14–15 %», «2017–2024», «4.964,54–7.959,62 ha»
  s = s.replace(/(\d[\d.,]*)\s?–\s?(\d[\d.,]*)/g, (_, a, b) => `${a} a ${b}`);
  // números con su unidad o porcentaje
  s = s.replace(/(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)(\s?%)?(\s?)(\S*)/g, (m, num, pct, sp, next) => {
    let unitTxt = '';
    let rest = next;
    for (const [re, w] of UNIT_WORDS) { if (re.test(next)) { unitTxt = w; rest = next.replace(re, ''); break; } }
    const feminine = !pct && (FEM_NOUNS.test(next) || unitTxt.startsWith('hectáreas'));
    let w = numberToWords(num, feminine);
    if (pct) return w + ' por ciento' + sp + next;
    if (unitTxt) return w + ' ' + unitTxt + rest;
    return w + sp + next;
  });
  s = s.replace(/×/g, ' veces');
  s = s.replace(/\u0001([a-z])\u0001/g, (_, c) => prot[c.charCodeAt(0) - 97]);
  return s.replace(/\s{2,}/g, ' ').trim();
}

export default normalize;
