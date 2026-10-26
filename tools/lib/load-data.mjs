// Evalúa js/data/*.js y los archivos puros del motor (timeline, captions) en un sandbox vm,
// para que las herramientas usen los mismos datos, trozos y tiempos que el reproductor.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

export const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');

export function loadData({ engine = true } = {}) {
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  const run = (rel) => vm.runInContext(fs.readFileSync(path.join(root, rel), 'utf8'), sandbox, { filename: rel });
  run('js/core/namespace.js');
  const dataDir = path.join(root, 'js/data');
  for (const f of fs.readdirSync(dataDir).filter((f) => f.endsWith('.js')).sort()) run('js/data/' + f);
  const man = path.join(root, 'assets/audio/manifest.js');
  if (fs.existsSync(man)) run('assets/audio/manifest.js');
  if (engine) {
    run('js/engine/easing.js');
    run('js/engine/timeline.js');
    run('js/engine/captions.js');
  }
  return sandbox.EEP;
}

// Sección del archivo de contenido para un punto («## Punto N.» hasta el siguiente «## »).
export function contentSection(n) {
  const txt = fs.readFileSync(path.join(root, 'content/extraccion_7_puntos_EEP_P5.md'), 'utf8');
  const start = txt.indexOf(`\n## Punto ${n}.`);
  if (start < 0) return '';
  const next = txt.indexOf('\n## ', start + 5);
  return txt.slice(start, next < 0 ? undefined : next);
}

export function puntoOf(video) {
  const m = String(video.unit || '').match(/Punto (\d)/);
  return m ? +m[1] : null;
}
