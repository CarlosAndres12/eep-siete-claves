// Cuadros de revisión y hojas de contacto (base §7, paso 2), y la hoja de prueba del estilo (--estilo).
// Uso: node tools/snapshots.mjs --estilo
//      node tools/snapshots.mjs [--only v2] [--no-audio] [--every 0]
// Escribe review/estilo-1.png, review/estilo-2.png, review/<id>/*.png y review/<id>-contacto.png.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const reviewDir = path.join(root, 'review');
fs.mkdirSync(reviewDir, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium', args: ['--allow-file-access-from-files', '--font-render-hinting=none'] });
const errors = [];

async function openPage(query) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${query}] ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`[${query}] ${e.message}`));
  page.on('request', (r) => { if (!r.url().startsWith('file://') && !r.url().startsWith('data:')) errors.push(`[${query}] petición externa: ${r.url()}`); });
  await page.goto('file://' + path.join(root, 'index.html') + '?' + query);
  await page.waitForFunction(() => window.renderReadyFlag === true, null, { timeout: 20000 });
  return page;
}

async function grab(page, file) {
  const data = await page.evaluate(() => document.querySelector('canvas').toDataURL('image/png'));
  fs.writeFileSync(file, Buffer.from(data.split(',')[1], 'base64'));
}

function contactSheet(files, out, cols = 5) {
  if (!files.length) return;
  const list = path.join(path.dirname(files[0]), '_lista.txt');
  fs.writeFileSync(list, files.map((f) => `file '${f}'`).join('\n'));
  const rows = Math.ceil(files.length / cols);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list,
    '-vf', `scale=384:216,pad=392:224:4:4:color=white,tile=${cols}x${rows}`, '-frames:v', '1', out]);
  fs.unlinkSync(list);
}

if (flag('--estilo')) {
  const page = await openPage('render=estilo&page=1');
  await grab(page, path.join(reviewDir, 'estilo-1.png'));
  await page.evaluate(() => window.renderPage(2));
  await grab(page, path.join(reviewDir, 'estilo-2.png'));
  await page.close();
  console.log('Hoja de prueba: review/estilo-1.png, review/estilo-2.png');
} else {
  const ids = val('--only', null) ? val('--only').split(',') : ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9'];
  for (const id of ids) {
    const page = await openPage(`render=${id}${flag('--no-audio') ? '&audio=0' : ''}`);
    const info = await page.evaluate(() => ({ d: window.videoDuration, tl: window.videoTimeline }));
    const dir = path.join(reviewDir, id);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const shots = [];
    for (const sc of info.tl.scenes) {
      if (!sc.lines.length) shots.push({ t: (sc.start + sc.end) / 2, name: `${sc.id}-0` });
      sc.lines.forEach((l, i) => shots.push({ t: (l.start + l.end) / 2, name: `${sc.id}-${i + 1}` }));
    }
    info.tl.checkpoints.forEach((c, i) => {
      shots.push({ t: c.start + 2.5, name: `${c.after}-pregunta${i + 1}` });
      shots.push({ t: c.start + 5.2, name: `${c.after}-respuesta${i + 1}` });
    });
    info.tl.pauses.forEach((c, i) => shots.push({ t: c.start + 3, name: `${c.after}-pausa${i + 1}` }));
    shots.sort((a, b) => a.t - b.t);
    const files = [];
    let n = 0;
    for (const s of shots) {
      await page.evaluate((t) => window.renderFrame(t), s.t);
      const f = path.join(dir, `${String(++n).padStart(3, '0')}-${s.name}.png`);
      await grab(page, f);
      files.push(f);
    }
    // determinismo: el mismo t dos veces da los mismos píxeles
    const tt = info.d * 0.37;
    const a = await page.evaluate((t) => { window.renderFrame(t); return document.querySelector('canvas').toDataURL(); }, tt);
    const b = await page.evaluate((t) => { window.renderFrame(t); return document.querySelector('canvas').toDataURL(); }, tt);
    if (a !== b) errors.push(`[${id}] renderFrame no es determinista en t=${tt.toFixed(2)}`);
    contactSheet(files, path.join(reviewDir, `${id}-contacto.png`));
    const m = Math.floor(info.d / 60), sec = Math.round(info.d % 60);
    console.log(`${id}: ${files.length} cuadros · duración ${m}:${String(sec).padStart(2, '0')} · review/${id}-contacto.png`);
    await page.close();
  }
}
await browser.close();
if (errors.length) { console.log('Errores:\n' + errors.join('\n')); process.exit(1); }
console.log('Sin errores de consola ni peticiones externas.');
