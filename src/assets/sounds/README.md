Coloque o arquivo de som `beep.wav` nesta pasta (`src/assets/sounds/beep.wav`).

Depois de adicionar o arquivo, rode:

```bash
npm run copy-sounds
npx cap sync android
npx cap open android
```

Isso copia o arquivo para `android/app/src/main/res/raw/beep.wav`, que é onde o Android espera sons nativos para notificações locais.
