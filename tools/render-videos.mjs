// Exportación opcional a MP4 (base §7, paso 7): renderFrame(t) en Chromium sin interfaz, en modo lineal, a 24 cps,
// enviado por tubería a ffmpeg (sin miles de archivos de cuadros), por capítulos en paralelo y reanudable;
// se une con la pista de narración en assets/video/<slug>.mp4 (H.264 yuv420p + AAC, +faststart).
// Uso: node tools/render-videos.mjs [--only v2,v3] [--jobs 4] [--force]
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { chromium } from 'playwright-core';
import { loadData, root } from './lib/load-data.mjs';

const run = promisify(execFile);
const args = process.argv.slice(2);
const val = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const force = args.includes('--force');
const FPS = 24;
const EEP = loadData({ engine: false });
const ids = (val('--only', null) || EEP.data.videos.map((v) => v.id).join(',')).split(',');
const jobsN = +val('--jobs', 4);
const work = path.join(root, 'tools/.cache/render');
fs.mkdirSync(work, { recursive: true });
fs.mkdirSync(path.join(root, 'assets/video'), { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium', args: ['--allow-file-access-from-files'] });

async function info(id) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('file://' + path.join(root, 'index.html') + '?render=' + id);
  await page.waitForFunction(() => window.renderReadyFlag === true, null, { timeout: 30000 });
  const r = await page.evaluate(() => ({ d: window.videoDuration, ch: window.videoChapters }));
  await page.close();
  return r;
}

// Renderiza [from, to) de un video a un MP4 sin audio.
async function renderPart(id, from, to, out) {
  if (!force && fs.existsSync(out) && fs.statSync(out).size > 1000) return 'cache';
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(root, 'index.html') + '?render=' + id);
  await page.waitForFunction(() => window.renderReadyFlag === true, null, { timeout: 30000 });
  const tmp = out + '.part.mp4';
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-r', String(FPS), tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))));
  const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS);
  for (let f = f0; f < f1; f++) {
    const b64 = await page.evaluate((t) => { window.renderFrame(t); return document.querySelector('canvas').toDataURL('image/jpeg', 0.93).split(',')[1]; }, f / FPS);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
  await page.close();
  fs.renameSync(tmp, out);
  return 'ok';
}

const exportsIdx = {};
for (const id of ids) {
  const v = EEP.data.videos.find((x) => x.id === id);
  const audio = path.join(root, 'assets/audio', id + '.mp3');
  if (!fs.existsSync(audio)) { console.log(`${id}: falta la narración (assets/audio/${id}.mp3); se omite.`); continue; }
  const { d, ch } = await info(id);
  const parts = ch.map((c, i) => ({ from: c.start, to: i + 1 < ch.length ? ch[i + 1].start : d, out: path.join(work, `${id}-${String(i).padStart(2, '0')}.mp4`) }));
  const t0 = Date.now();
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(jobsN, parts.length) }, async () => {
    while (i < parts.length) { const p = parts[i++]; await renderPart(id, p.from, p.to, p.out); }
  }));
  const list = path.join(work, id + '-list.txt');
  fs.writeFileSync(list, parts.map((p) => `file '${p.out}'`).join('\n'));
  const out = path.join(root, 'assets/video', v.slug + '.mp4');
  await run('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-i', audio, '-map', '0:v', '-map', '1:a',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', out]);
  exportsIdx[id] = { file: v.slug + '.mp4' };
  console.log(`${id}: assets/video/${v.slug}.mp4 · ${Math.round(d)} s · ${Math.round((Date.now() - t0) / 1000)} s de render`);
}
await browser.close();
// índice de exportaciones (el reproductor ofrece «Descargar MP4»)
const idxFile = path.join(root, 'assets/video/index.js');
let prev = {};
try { const m = fs.readFileSync(idxFile, 'utf8').match(/=\s*(\{[\s\S]*\});/); if (m) prev = JSON.parse(m[1]); } catch {}
Object.assign(prev, exportsIdx);
fs.writeFileSync(idxFile, '/* GENERADO por tools/render-videos.mjs. */\nwindow.EEP.videoExports = ' + JSON.stringify(prev) + ';\n');
console.log('Índice: assets/video/index.js');
