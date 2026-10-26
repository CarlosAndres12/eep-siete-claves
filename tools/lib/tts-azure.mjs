// Adaptador de Azure AI Speech (base §4). Requiere `npm install microsoft-cognitiveservices-speech-sdk` y las variables
// AZURE_SPEECH_KEY y AZURE_SPEECH_REGION (en el entorno o en tools/.env). La clave nunca se escribe en ningún archivo.
export async function synthLine({ ssml, out, key, region }) {
  const sdk = await import('microsoft-cognitiveservices-speech-sdk').catch(() => { throw new Error('Falta el paquete microsoft-cognitiveservices-speech-sdk: ejecute «npm install microsoft-cognitiveservices-speech-sdk» en tools/.'); });
  const fs = await import('node:fs');
  const cfg = sdk.SpeechConfig.fromSubscription(key, region);
  cfg.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm;
  const synth = new sdk.SpeechSynthesizer(cfg, null);
  const marks = [];
  synth.bookmarkReached = (_, e) => marks.push({ mark: e.text, at: e.audioOffset / 1e7 });
  return new Promise((resolve, reject) => {
    synth.speakSsmlAsync(ssml, (r) => {
      synth.close();
      if (r.reason === sdk.ResultReason.SynthesizingAudioCompleted) { fs.writeFileSync(out, Buffer.from(r.audioData)); resolve(marks); }
      else reject(new Error(r.errorDetails || 'Error de síntesis'));
    }, (e) => { synth.close(); reject(e); });
  });
}
