// Recorre todas las rutas del sitio en Chromium sin red: errores de consola, peticiones externas y capturas.
// Uso: node tools/check-site.mjs [--shots] [--width 1280]
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const shots = args.includes('--shots');
const width = +(args[args.indexOf('--width') + 1] || 1280) || 1280;
const routes = ['/inicio', '/punto-1', '/punto-2', '/punto-3/a', '/punto-3/b', '/punto-3/c', '/punto-4', '/punto-5', '/punto-6', '/punto-7', '/escalas', '/cifras', '/precauciones', '/glosario', '/fuentes', '/modo-clase', '/acerca'];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/usr/bin/chromium', args: ['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width, height: 900 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${page.url().split('#')[1]}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[${page.url().split('#')[1]}] ${e.message}`));
page.on('request', (r) => { const u = r.url(); if (!u.startsWith('file://') && !u.startsWith('data:') && !u.startsWith('blob:')) errors.push(`petición externa: ${u}`); });
const out = path.join(root, 'review', 'site-' + width);
if (shots) fs.mkdirSync(out, { recursive: true });
await page.goto('file://' + path.join(root, 'index.html') + '#/inicio');
await page.waitForSelector('main h1', { timeout: 20000 });
for (const r of routes) {
  await page.evaluate((h) => { location.hash = '#' + h; }, r);
  await page.waitForTimeout(700);
  const h1 = await page.evaluate(() => (document.querySelector('main h1') || {}).textContent || '');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (!h1) errors.push(`[${r}] sin H1`);
  if (overflow) errors.push(`[${r}] desplazamiento horizontal a ${width} px`);
  if (shots) await page.screenshot({ path: path.join(out, r.replace(/\//g, '_').slice(1) + '.png'), fullPage: true });
  console.log(`${r}: ${h1}`);
}
await browser.close();
for (const e of errors) console.log('ERROR: ' + e);
console.log(`${routes.length} rutas · ${errors.length} errores`);
process.exit(errors.length ? 1 : 0);
