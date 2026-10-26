// Contador de caracteres facturables y libro mensual (base §4.2). Con Edge no hay cuota, pero se lleva la cuenta
// igual para saber cuánto costaría la misma síntesis en Azure F0.
import fs from 'node:fs';
import path from 'node:path';
export function ledger(cacheDir) {
  const file = path.join(cacheDir, 'usage.json');
  let data = {};
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  const month = new Date().toISOString().slice(0, 7);
  data[month] = data[month] || { characters: 0, requests: 0 };
  return {
    month, get: () => data[month],
    add(chars) { data[month].characters += chars; data[month].requests += 1; },
    save() { fs.mkdirSync(cacheDir, { recursive: true }); fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
  };
}
