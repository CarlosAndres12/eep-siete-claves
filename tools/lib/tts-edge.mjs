// Adaptador de voces de Microsoft Edge (base §4.7): mismo contrato que el adaptador de Azure.
// Edge no admite marcadores en SSML, así que se sintetiza un trozo de subtítulo por petición: el inicio de cada
// trozo dentro de la línea es la suma de las duraciones de los trozos anteriores (tiempos exactos).
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const run = promisify(execFile);

// "-4%" → "-4Hz" aproximado (Edge expresa el tono en Hz).
export function pitchHz(p) {
  const m = String(p || '+0%').match(/^([+-]?\d+(?:\.\d+)?)(%|Hz)?$/);
  if (!m) return '+0Hz';
  const v = m[2] === 'Hz' ? +m[1] : Math.round(+m[1] * 1.2);
  return (v >= 0 ? '+' : '') + v + 'Hz';
}

// synthChunk({ text, voice, rate, pitch, out }) → escribe un mp3 de 24 kHz mono
export async function synthChunk({ text, voice, rate, pitch, out }, retries = 4) {
  let last;
  for (let i = 0; i <= retries; i++) {
    try {
      await run('edge-tts', ['--voice', voice, `--rate=${rate || '+0%'}`, `--pitch=${pitchHz(pitch)}`, '--text', text, '--write-media', out], { timeout: 60000 });
      return;
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 800 * 2 ** i + Math.random() * 400));
    }
  }
  throw last;
}

export async function listVoices() {
  const { stdout } = await run('edge-tts', ['--list-voices'], { maxBuffer: 4e6 });
  return stdout.split('\n').map((l) => l.split(/\s+/)[0]).filter((n) => /Neural$/.test(n));
}
