const fs = require('fs');
const path = require('path');

const soundsDir = path.join(__dirname, '..', 'src', 'assets', 'sounds');
const androidRaw = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'raw');

if (!fs.existsSync(soundsDir)) {
  console.error('Pasta src/assets/sounds não encontrada. Coloque seus arquivos de som dentro dela antes de rodar este script.');
  process.exit(1);
}

if (!fs.existsSync(androidRaw)) {
  console.log('Pasta android res/raw não existe. Vou criar...');
  fs.mkdirSync(androidRaw, { recursive: true });
}

// Copia todos os arquivos de sons (mantém o nome)
const files = fs.readdirSync(soundsDir).filter(f => /\.(wav|mp3|ogg)$/i.test(f));
if (files.length === 0) {
  console.error('Nenhum arquivo de áudio encontrado em src/assets/sounds. Adicione pelo menos um .wav/.mp3/.ogg.');
  process.exit(1);
}

for (const file of files) {
  const srcFile = path.join(soundsDir, file);
  const dest = path.join(androidRaw, file);
  fs.copyFileSync(srcFile, dest);
  console.log(`${file} copiado para ${dest}`);
}
