const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'assets', 'sounds', 'beep.wav');
const androidRaw = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'raw');

if (!fs.existsSync(src)) {
  console.error('Arquivo src/assets/sounds/beep.wav não encontrado. Coloque seu beep.wav lá antes de rodar este script.');
  process.exit(1);
}

if (!fs.existsSync(androidRaw)) {
  console.log('Pasta android res/raw não existe. Vou criar...');
  fs.mkdirSync(androidRaw, { recursive: true });
}

const dest = path.join(androidRaw, 'beep.wav');
fs.copyFileSync(src, dest);
console.log('beep.wav copiado para', dest);
