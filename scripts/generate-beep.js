const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'src', 'assets', 'sounds');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'beep.wav');

const sampleRate = 44100;
const durationSeconds = 0.6;
const freq = 1000; // 1kHz beep
const numSamples = Math.floor(sampleRate * durationSeconds);
const amplitude = 0.5 * 32767;

const samples = new Int16Array(numSamples);
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  // envelope to avoid clicks
  const env = Math.min(1, i / 100, (numSamples - i) / 100);
  samples[i] = Math.floor(amplitude * Math.sin(2 * Math.PI * freq * t) * env);
}

function writeWav(filePath, samples, sampleRate) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = samples.length * numChannels * bitsPerSample / 8;
  const buffer = Buffer.alloc(44 + dataSize);

  let offset = 0;
  buffer.write('RIFF', offset); offset += 4;
  buffer.writeUInt32LE(36 + dataSize, offset); offset += 4; // file size - 8
  buffer.write('WAVE', offset); offset += 4;
  buffer.write('fmt ', offset); offset += 4;
  buffer.writeUInt32LE(16, offset); offset += 4; // PCM chunk size
  buffer.writeUInt16LE(1, offset); offset += 2; // audio format PCM
  buffer.writeUInt16LE(numChannels, offset); offset += 2;
  buffer.writeUInt32LE(sampleRate, offset); offset += 4;
  buffer.writeUInt32LE(byteRate, offset); offset += 4;
  buffer.writeUInt16LE(blockAlign, offset); offset += 2;
  buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;
  buffer.write('data', offset); offset += 4;
  buffer.writeUInt32LE(dataSize, offset); offset += 4;

  // write samples little endian
  for (let i = 0; i < samples.length; i++) {
    buffer.writeInt16LE(samples[i], offset);
    offset += 2;
  }

  fs.writeFileSync(filePath, buffer);
}

writeWav(outPath, samples, sampleRate);
console.log('Gerado beep em', outPath);
