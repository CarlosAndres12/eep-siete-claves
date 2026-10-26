// Genera la narración de los videos (base §4.4): sintetiza, mide, arma la línea de tiempo, mezcla y escribe
// assets/audio/<id>.mp3, assets/audio/manifest.js y assets/captions/<id>.vtt.
// Uso: node tools/generate-voiceover.mjs [--only v4] [--force] [--dry-run] [--voice-test]
// Motor: voice.config.json «engine» = "edge" (por defecto en este sitio; gratuito, sin clave) o "azure".
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { loadData, root } from './lib/load-data.mjs';
import { normalize, loadLexicon } from './lib/normalize-es.mjs';
import { synthChunk, listVoices } from './lib/tts-edge.mjs';
import { buildSsml } from './lib/ssml.mjs';
import { ledger } from './lib/budget.mjs';

const run = promisify(execFile);
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const toolsDir = path.join(root, 'tools');
const cacheDir = path.join(toolsDir, '.cache');
const clipDir = path.join(cacheDir, 'clips');
const workDir = path.join(cacheDir, 'work');
fs.mkdirSync(clipDir, { recursive: true });
fs.mkdirSync(workDir, { recursive: true });
const cfgPath = path.join(toolsDir, 'voice.config.json');
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const lexicon = loadLexicon(path.join(toolsDir, 'lexicon.es.json'));
const EEP = loadData();
const D = EEP.data;
const chunk = EEP.engine.captions.chunk;
const TL = EEP.engine.timeline;
const SR = 24000;

async function probe(file) {
  const { stdout } = await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]);
  return parseFloat(stdout);
}
function hash(o) { return crypto.createHash('sha1').update(JSON.stringify(o)).digest('hex').slice(0, 20); }
function fmt(s) { s = Math.round(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }

// Cola con concurrencia limitada.
async function pool(items, n, fn) {
  let i = 0;
  const workers = Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; await fn(items[k], k); } });
  await Promise.all(workers);
}

function speakable(line) {
  if (line.say) return { display: chunk(line.text), speak: [line.say], single: true };
  const display = chunk(line.text);
  return { display, speak: display.map((c) => normalize(c, lexicon)), single: false };
}

// ---------- prueba de voces ----------
const PARAGRAPH = 'El estudio técnico revisó cómo cambió el territorio de Medellín en los últimos años. Analizó los bosques, las quebradas, los cultivos y los barrios de ladera, y comparó mapas de distintas fechas. Con esa información propone ideas para la revisión del plan de ordenamiento, pero las decisiones corresponden al Distrito y se toman después de escuchar a la ciudadanía.';
const SAMPLE = 'Según el estudio, cerca del noventa y dos por ciento del caudal concesionado proviene de cuencas externas.';

async function voiceTest() {
  const avail = await listVoices();
  const dir = path.join(cacheDir, 'voice-test');
  fs.mkdirSync(dir, { recursive: true });
  const words = PARAGRAPH.split(/\s+/).length;
  console.log(`Prueba de voces (motor ${cfg.engine}); párrafo de calibración de ${words} palabras.`);
  for (const [role, v] of Object.entries(cfg.voices)) {
    for (const name of [v.name].concat(v.alternatives || [])) {
      if (!avail.includes(name)) { console.log(`  ${role} · ${name}: no disponible en este motor`); continue; }
      const sample = path.join(dir, `${role}-${name}-muestra.mp3`);
      const para = path.join(dir, `${role}-${name}-calibracion.mp3`);
      await synthChunk({ text: SAMPLE, voice: name, rate: v.rate, pitch: v.pitch, out: sample });
      await synthChunk({ text: PARAGRAPH, voice: name, rate: v.rate, pitch: v.pitch, out: para });
      const d = await probe(para);
      const wps = +(words / d).toFixed(2);
      console.log(`  ${role} · ${name}: ${wps} palabras/s · escuchar: tools/.cache/voice-test/${path.basename(sample)}`);
      if (name === v.name) v.wordsPerSecond = wps;
    }
  }
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2) + '\n');
  // también en js/data/cast.js, donde lo lee la página
  const castFile = path.join(root, 'js/data/cast.js');
  let src = fs.readFileSync(castFile, 'utf8');
  for (const [role, v] of Object.entries(cfg.voices)) {
    src = src.replace(new RegExp(`(\\{ id: '${role}',[^}]*?wordsPerSecond: )[\\d.]+`), `$1${v.wordsPerSecond}`);
  }
  fs.writeFileSync(castFile, src);
  console.log('wordsPerSecond escrito en tools/voice.config.json y js/data/cast.js.');
}

// ---------- estimación ----------
function billableFor(video) {
  let chars = 0;
  for (const sc of video.scenes) for (const l of sc.lines) {
    const v = cfg.voices[l.voice];
    const sp = speakable(l);
    chars += buildSsml({ voice: v.name, locale: v.locale, rate: v.rate, pitch: v.pitch, chunks: sp.speak }).billable;
  }
  return chars;
}

function dryRun(videos) {
  const castW = D.cast.map((c) => Object.assign({}, c, { wordsPerSecond: (cfg.voices[c.id] || {}).wordsPerSecond || c.wordsPerSecond }));
  let total = 0, chars = 0;
  console.log('Estimación sin síntesis (--dry-run), con las palabras por segundo calibradas de cada voz:');
  for (const v of videos) {
    // estimación con el texto normalizado (las cifras se cuentan por las palabras que se dicen)
    const vv = JSON.parse(JSON.stringify(v));
    vv.scenes.forEach((sc) => sc.lines.forEach((l) => { l.say = speakable(l).speak.join(' '); }));
    const tl = TL.build(vv, { cast: castW, chunk });
    const c = billableFor(v);
    total += tl.duration; chars += c;
    const ok = tl.duration >= v.target[0] && tl.duration <= v.target[1];
    console.log(`  ${v.id}: ${fmt(tl.duration)} (objetivo ${fmt(v.target[0])}–${fmt(v.target[1])}) ${ok ? 'dentro' : 'FUERA del objetivo'} · ${c.toLocaleString('es-CO')} caracteres facturables en Azure`);
  }
  console.log(`  Total: ${fmt(total)} · ${chars.toLocaleString('es-CO')} caracteres (${(chars / cfg.monthlyBudgetCharacters * 100).toFixed(1)} % de los ${cfg.monthlyBudgetCharacters.toLocaleString('es-CO')} mensuales de F0). Con el motor «edge» no hay cuota.`);
}

// ---------- síntesis y mezcla ----------
async function synthVideo(video, led) {
  const lines = [];
  const jobs = [];
  for (const sc of video.scenes) sc.lines.forEach((l, idx) => {
    const v = cfg.voices[l.voice];
    const sp = speakable(l);
    const clips = sp.speak.map((text) => {
      const key = hash({ engine: cfg.engine, voice: v.name, rate: v.rate, pitch: v.pitch, text });
      const file = path.join(clipDir, key + '.mp3');
      if (flag('--force') || !fs.existsSync(file)) jobs.push({ text, voice: v.name, rate: v.rate, pitch: v.pitch, out: file });
      return file;
    });
    lines.push({ scene: sc.id, index: idx, voice: l.voice, text: l.text, display: sp.display, single: sp.single, clips,
      billable: buildSsml({ voice: v.name, locale: v.locale, rate: v.rate, pitch: v.pitch, chunks: sp.speak }).billable });
  });
  const conc = (cfg.edge && cfg.edge.concurrency) || 4;
  if (jobs.length) console.log(`  ${video.id}: ${jobs.length} trozos por sintetizar (≈ ${Math.ceil(jobs.length * 1.6 / conc / 60)} min con ${conc} en paralelo)`);
  let done = 0;
  await pool(jobs, conc, async (j) => {
    await synthChunk(j, (cfg.edge && cfg.edge.retries) || 4);
    led.add(j.text.length);
    if (++done % 20 === 0) process.stdout.write(`    ${done}/${jobs.length}\n`);
  });
  // medir y unir los trozos de cada línea en un WAV
  const man = { lines: [] };
  for (const l of lines) {
    // Edge deja silencio al principio y al final de cada trozo: se recorta y se deja una pausa breve entre trozos.
    const durs = [], trimmed = [];
    for (let ci = 0; ci < l.clips.length; ci++) {
      const c = l.clips[ci];
      const last = ci === l.clips.length - 1;
      const tw = c.replace(/\.mp3$/, last ? '-t1.wav' : '-t0.wav');
      if (!fs.existsSync(tw) || flag('--force')) {
        await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', c, '-af',
          `silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.04,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.06,areverse,apad=pad_dur=${last ? 0.08 : 0.22}`,
          '-ar', String(SR), '-ac', '1', '-c:a', 'pcm_s16le', tw]);
      }
      trimmed.push(tw);
      durs.push(await probe(tw));
    }
    const wav = path.join(workDir, `${video.id}-${l.scene}-${l.index}.wav`);
    const list = path.join(workDir, 'list.txt');
    fs.writeFileSync(list, trimmed.map((c) => `file '${c}'`).join('\n'));
    await run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-ar', String(SR), '-ac', '1', '-c:a', 'pcm_s16le', wav]);
    const dur = await probe(wav);
    let at = 0;
    let chunks;
    if (l.single) {
      const tot = l.display.reduce((a, c) => a + c.length, 0) || 1;
      let acc = 0;
      chunks = l.display.map((c) => { const x = { at: acc / tot * dur }; acc += c.length; return x; });
    } else chunks = durs.map((d) => { const x = { at }; at += d; return x; });
    l.wav = wav; l.dur = dur;
    man.lines.push({ scene: l.scene, index: l.index, voice: l.voice, dur, chunks });
  }
  // línea de tiempo con las mismas reglas que el reproductor
  const tl = TL.build(video, { cast: D.cast, manifest: man, chunk });
  const placed = [];
  for (const sc of tl.scenes) for (const ln of sc.lines) {
    const l = lines.find((x) => x.scene === sc.id && x.index === ln.index);
    placed.push({ l, start: sc.start + ln.start, ln, sc });
  }
  placed.sort((a, b) => a.start - b.start);
  // concatenación de clips y silencios (más robusta que una mezcla grande)
  const segs = [];
  let cursor = 0, k = 0;
  for (const p of placed) {
    const gap = p.start - cursor;
    if (gap > 0.0005) { const s = path.join(workDir, `${video.id}-sil-${k++}.wav`); await silence(s, gap); segs.push(s); }
    segs.push(p.l.wav);
    cursor = p.start + p.l.dur;
  }
  if (tl.duration - cursor > 0.0005) { const s = path.join(workDir, `${video.id}-sil-${k++}.wav`); await silence(s, tl.duration - cursor); segs.push(s); }
  const list = path.join(workDir, `${video.id}-mix.txt`);
  fs.writeFileSync(list, segs.map((s) => `file '${s}'`).join('\n'));
  const raw = path.join(workDir, `${video.id}-raw.wav`);
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c:a', 'pcm_s16le', raw]);
  // volumen en dos pasadas: −16 LUFS, −1,5 dBTP
  const L = cfg.loudness;
  const { stderr } = await run('ffmpeg', ['-hide_banner', '-i', raw, '-af', `loudnorm=I=${L.integratedLUFS}:TP=${L.truePeakDBTP}:LRA=11:print_format=json`, '-f', 'null', '-'], { maxBuffer: 1e7 });
  const meas = JSON.parse(stderr.slice(stderr.lastIndexOf('{'), stderr.lastIndexOf('}') + 1));
  const outMp3 = path.join(root, 'assets/audio', `${video.id}.mp3`);
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af',
    `loudnorm=I=${L.integratedLUFS}:TP=${L.truePeakDBTP}:LRA=11:measured_I=${meas.input_i}:measured_TP=${meas.input_tp}:measured_LRA=${meas.input_lra}:measured_thresh=${meas.input_thresh}:offset=${meas.target_offset}:linear=true`,
    '-ar', '44100', '-ac', '1', '-b:a', '128k', outMp3]);
  // manifiesto y subtítulos
  const entry = {
    file: `${video.id}.mp3`, duration: +tl.duration.toFixed(3),
    chapters: tl.chapters.map((c) => ({ title: c.title, start: +c.start.toFixed(3) })),
    scenes: tl.scenes.map((s) => ({ id: s.id, start: +s.start.toFixed(3), dur: +s.dur.toFixed(3) })),
    lines: placed.map((p) => ({
      scene: p.l.scene, index: p.l.index, voice: p.l.voice, start: +p.start.toFixed(3), dur: +p.l.dur.toFixed(3),
      chunks: p.ln.chunks.map((c, i) => ({ text: c.text, at: +man.lines.find((m) => m.scene === p.l.scene && m.index === p.l.index).chunks[i].at.toFixed(3), start: +(p.start + c.start).toFixed(3), end: +(p.start + c.end).toFixed(3) }))
    })),
    checkpoints: tl.checkpoints.map((c) => ({ after: c.after, start: +c.start.toFixed(3), end: +c.end.toFixed(3) })),
    pauses: tl.pauses.map((c) => ({ after: c.after, start: +c.start.toFixed(3), end: +c.end.toFixed(3) }))
  };
  writeVtt(video, entry);
  // informe
  const fast = [];
  for (const ln of entry.lines) for (const c of ln.chunks) { const cps = c.text.length / Math.max(0.1, c.end - c.start); if (cps > 17) fast.push(`${ln.scene}#${ln.index + 1} (${cps.toFixed(1)} car/s)`); }
  const longest = tl.scenes.slice().sort((a, b) => b.dur - a.dur).slice(0, 3).map((s) => `${s.id} ${s.dur.toFixed(1)} s`);
  const ok = tl.duration >= video.target[0] && tl.duration <= video.target[1];
  console.log(`  ${video.id}: ${fmt(tl.duration)} (objetivo ${fmt(video.target[0])}–${fmt(video.target[1])}) ${ok ? 'dentro' : 'FUERA del objetivo'} · escenas más largas: ${longest.join(', ')}`);
  if (fast.length) console.log(`    trozos rápidos (> 17 car/s): ${fast.join(', ')}`);
  return entry;
}

async function silence(file, dur) {
  const n = Math.round(dur * SR);
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', `anullsrc=r=${SR}:cl=mono`, '-af', `atrim=end_sample=${n}`, '-c:a', 'pcm_s16le', file]);
}

function vttTime(t) {
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${s.toFixed(3).padStart(6, '0')}`;
}
function writeVtt(video, entry) {
  const name = (id) => { const c = D.cast.find((x) => x.id === id); return c ? c.name : id; };
  let out = 'WEBVTT\n\n';
  let n = 1;
  for (const ln of entry.lines) for (const c of ln.chunks) {
    const txt = ln.voice === 'narrador' ? c.text : `<v ${name(ln.voice)}>${c.text}`;
    out += `${n++}\n${vttTime(c.start)} --> ${vttTime(c.end)}\n${txt}\n\n`;
  }
  fs.mkdirSync(path.join(root, 'assets/captions'), { recursive: true });
  fs.writeFileSync(path.join(root, 'assets/captions', `${video.id}.vtt`), out);
}

function writeManifest(entries) {
  const file = path.join(root, 'assets/audio/manifest.js');
  const prev = (EEP.audioManifest) || {};
  const all = Object.assign({}, prev, entries);
  fs.writeFileSync(file, '/* GENERADO por tools/generate-voiceover.mjs. No editar a mano. */\nwindow.EEP.audioManifest = ' + JSON.stringify(all) + ';\n');
}

// ---------- principal ----------
const only = val('--only');
const videos = D.videos.filter((v) => !only || only.split(',').includes(v.id));
if (flag('--voice-test')) { await voiceTest(); process.exit(0); }
if (flag('--dry-run')) { dryRun(videos); process.exit(0); }
if (cfg.engine !== 'edge') { console.error('Este generador está configurado para el motor «edge». Para Azure, cambie «engine» en voice.config.json y use tools/lib/tts-azure.mjs (vea el LÉAME).'); process.exit(2); }
const avail = await listVoices();
for (const [role, v] of Object.entries(cfg.voices)) if (!avail.includes(v.name)) {
  const alt = (v.alternatives || []).find((a) => avail.includes(a));
  if (!alt) { console.error(`La voz ${v.name} (${role}) no está disponible y no tiene alternativa disponible.`); process.exit(1); }
  console.log(`  ${role}: ${v.name} no disponible; se usa ${alt}`); v.name = alt;
}
const led = ledger(cacheDir);
const entries = {};
console.log(`Síntesis con ${cfg.engine}: ${videos.length} videos.`);
for (const v of videos) entries[v.id] = await synthVideo(v, led);
writeManifest(entries);
led.save();
console.log(`Listo. Caracteres sintetizados en esta corrida: ${led.get().characters.toLocaleString('es-CO')} acumulados este mes (${led.get().requests} peticiones). Manifiesto: assets/audio/manifest.js`);
