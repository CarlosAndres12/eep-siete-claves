// Escribe en index.html la lista de <script defer> en el orden de base §1.2:
// core, data, manifiestos de assets, engine, style, course, videos, slides, ui, main.
// Herramienta de desarrollo: el sitio no la necesita para funcionar.
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const order = [
  ['js/core', ['namespace.js', 'router.js', 'store.js']],
  ['js/data', null],
  ['assets/audio', ['manifest.js']],
  ['assets/video', ['index.js']],
  ['js/engine', ['rng.js', 'easing.js', 'legend.js', 'layers.js', 'timeline.js', 'captions.js', 'charts.js', 'cards.js', 'stage.js', 'narrator.js', 'player.js', 'recorder.js']],
  ['js/style', ['tokens.js', 'primitives.js', 'signs.js', 'marks.js', 'people.js', 'machine.js', 'backgrounds.js', 'lettering.js', 'testsheet.js']],
  ['js/course', null],
  ['js/videos', null],
  ['js/slides', null],
  ['js/ui', ['shell.js']],
  ['js', ['main.js']]
];
const tags = [];
for (const [dir, files] of order) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) continue;
  let list = files ? files.filter(f => fs.existsSync(path.join(abs, f))) : [];
  const rest = fs.readdirSync(abs).filter(f => f.endsWith('.js') && !list.includes(f) && fs.statSync(path.join(abs, f)).isFile()).sort();
  if (!files || dir === 'js/ui' || dir === 'js/engine' || dir === 'js/style' || dir === 'js/core') list = list.concat(rest.filter(f => !(dir === 'js' && f !== 'main.js')));
  if (dir === 'js') list = ['main.js'].filter(f => fs.existsSync(path.join(abs, f)));
  for (const f of list) tags.push(`<script defer src="${dir}/${f}"></script>`);
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const out = html.replace(/<!-- SCRIPTS:START -->[\s\S]*<!-- SCRIPTS:END -->/, '<!-- SCRIPTS:START -->\n' + tags.join('\n') + '\n<!-- SCRIPTS:END -->');
fs.writeFileSync(path.join(root, 'index.html'), out);
console.log(tags.length + ' scripts');
