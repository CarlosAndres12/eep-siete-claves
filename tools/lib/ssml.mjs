// SSML escapado para Azure (base §4.4, paso 3): voz, idioma, prosodia, marcadores entre trozos, pausas y alias.
export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
// chunks: textos ya normalizados; devuelve { ssml, billable }
export function buildSsml({ voice, locale, rate, pitch, chunks }) {
  const body = chunks.map((c, i) => (i ? `<bookmark mark="c${i + 1}"/>` : '<bookmark mark="c1"/>') + esc(c).replace(/, ,/g, ',')).join(' ');
  const inner = `<prosody rate="${rate || '+0%'}" pitch="${pitch || '+0%'}">${body}</prosody>`;
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${locale}"><voice name="${voice}">${inner}</voice></speak>`;
  return { ssml, billable: inner.length };
}
