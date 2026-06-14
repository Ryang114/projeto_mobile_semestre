Coloque arquivos de som nesta pasta (`src/assets/sounds/`). Exemplo de nomes aceitos no app:

- beep.wav (padrão)
- ring1.mp3
- ring2.wav

Depois de adicionar os arquivos desejados, rode:

```bash
npm run copy-sounds
npx cap sync android
npx cap open android
```

O script `copy-sounds` copia todos os arquivos `*.wav`, `*.mp3` e `*.ogg` desta pasta para `android/app/src/main/res/raw/` — necessário para que notificações nativas possam usar esses sons em canais do Android.

OBS: para que um som empacotado seja usado por notificações no Android, é necessário recriar/atualizar o canal de notificações (desinstalar/reinstalar o app ou alterar manualmente nas configurações do app) para que o novo arquivo seja reconhecido.
