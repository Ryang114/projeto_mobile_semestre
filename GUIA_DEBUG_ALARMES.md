# 📊 Guia de Diagnóstico de Alarmes - Debug Logs

## O que foi adicionado

Criei um sistema de **diagnóstico em tempo real** que registra cada ação relacionada a notificações/alarmes em `localStorage`. Você pode visualizar todos os logs através de uma página de debug.

### Arquivos criados:
- `src/app/core/debug.service.ts` - Serviço que registra logs em localStorage
- `src/app/debug-logs/` - Página com interface para visualizar os logs
- Integração em `app.component.ts` e `alarm.page.ts` com logs detalhados

## Como usar o Debug

### 1. Acessar os Logs (no App)

Depois de instalar o app:
1. Abra o app
2. Vá em **Configurações** (⚙️ ícone em baixo)
3. Clique em **📊 Debug Logs**
4. Você verá todos os eventos registrados com:
   - ⏰ Timestamp (hora)
   - 📍 Fonte (qual componente gerou o log)
   - 📊 Tipo (Info ℹ️, Warning ⚠️, Error ❌, Success ✅)
   - 💬 Mensagem descritiva
   - 📋 Dados JSON (quando aplicável)

### 2. Interpretar os Logs

**Fluxo esperado de um alarme bem-sucedido:**

```
[AppComponent] Canal de alarmes criado com sucesso ✅
  → Alarme disparar...
[AppComponent] Listeners: Notificação acionada pelo usuário
[AppComponent] Navegando para /alarm com alarmeId: xxx
[AlarmPage] ngOnInit - Página de alarme inicializada
[AlarmPage] queryParamMap atualizado
[AlarmPage] Alarme encontrado no serviço ✅
[AlarmPage] Tendando iniciar som do alarme
[AlarmPage] Tentando carregar áudio de: ./assets/sounds/beep.wav
[AlarmPage] Som tocando com sucesso ✅
```

**Se vir um dos erros abaixo, significa:**

| Erro na página Debug | Problema | Solução |
|-------------------|----------|---------|
| ❌ `Não foi possível criar elemento de áudio` | Arquivo beep.wav não encontrado | Verificar se `src/assets/sounds/beep.wav` existe |
| ⚠️ `Falha ao carregar/tocar de` (todos os caminhos) | Caminho incorreto ou som corrompido | Regenerar beep.wav |
| ❌ `Erro criando channel` | Android < 8 ou permissão | Verificar versão Android / permissões |
| `Navegando para /alarm` não aparece | Cold start issue | Notificação abriu mas listener não disparou |

### 3. Exportar Logs (para compartilhar comigo)

Na página **Debug Logs**:
1. Clique em **Exportar**
2. Os logs serão copiados para clipboard
3. Cole em um arquivo `.txt` e compartilhe comigo para análise profunda

### 4. Limpar Logs

Na página **Debug Logs**:
1. Clique em **Limpar Logs**
2. Todos os registros serão apagados
3. Use isso antes de cada novo teste para ter um log "limpo"

## Passos de Teste Completo com Debug

### Fase 1: Preparação

```powershell
# No seu terminal (PowerShell) - na pasta do projeto
cd C:\Users\w10\projeto_mobile_semestre

# 1. Desinstalar app antigo do telefone
#    (Configurações > Apps > [Seu app] > Desinstalar)

# 2. Limpar logs anteriores (opcional mas recomendado)
#    Abrir app > Configurações > Debug Logs > Limpar Logs

# 3. Build e sincronizar
npm run build
node .\scripts\copy-sounds.js
npx cap sync android
npx cap open android
```

### Fase 2: Android Studio

No Android Studio que abrir:
1. Menu: **Build** → **Clean Build Folder**
2. Menu: **Run** → **Run app** (ou pressionar Shift+F10)
3. Selecionar seu Poco X6 Pro
4. Aguardar instalação e abertura

### Fase 3: Teste no Dispositivo

1. **App abre com sucesso** ✓
2. Vai para página **Home**
3. Clique em **Alarmes** (ou crie um novo)
4. Defina um alarme para **2 minutos daqui a pouco**
5. Exemplo: Se for 14:50, coloque para 14:52

### Fase 4: Aguardar Disparo

1. Mantenha o app ABERTO na Home (não mingue nem feche)
2. Aguarde chegar a hora
3. **Resultado esperado:**
   - App muda automaticamente para página `/alarm`
   - Ícone do alarme começa a piscar (animação)
   - Texto diz "🔊 Tocando em loop..."
   - Som toca continuamente (beep.wav)

### Fase 5: Verificar Logs

Se não deu certo:
1. Abra **Configurações** > **Debug Logs**
2. Procure pelos logs que devem aparecer **no final da lista**
3. Procure por mensagens como:
   - `Som tocando com sucesso` = som carregado ✅
   - `Navegando para /alarm` = notificação abriu página ✅
   - Qualquer ❌ red flag = aqui está o problema

### Fase 6: Teste de Som Parado

Se o som não tocar **automaticamente** mas você conseguir tocar manualmente:
1. Na página de alarme, clique **🔔 Tocar Som**
2. Som deve tocar
3. Se tocar = arquivo está ok, é um problema de autoplay
4. Se não tocar = arquivo não encontrado ou corrompido

## Cenários Esperados

### ✅ Sucesso Completo
- Alarme dispara
- App abre automaticamente em `/alarm`
- Som toca em loop
- Ícone pisca
- Botões funcionam (Parar, Soneca)
- Debug Logs mostram fluxo completo com ✅

### ⚠️ Falha Parcial 1: Som não toca automaticamente
- Alarme dispara
- App abre em `/alarm` ✓
- Texto diz "Som parado"
- Você clica "🔔 Tocar Som"
- Som toca normalmente ✓
- **Motivo:** Autoplay bloqueado em WebView Android

### ⚠️ Falha Parcial 2: App não abre automaticamente
- Notificação aparece na bandeja de notificações
- Som toca (do canal)
- Você clica na notificação manualmente
- App abre em `/alarm` ✓
- **Motivo:** Cold start listener não disparou (raro)

### ❌ Falha Completa
- Nada de acima acontece
- Veja Debug Logs para entender exatamente onde falhou

## Próximas Ações (Baseado em Resultados)

### Se tudo funciona:
- 🎉 Problema resolvido!
- Próximas:  melhorar UI/UX ou adicionar mais features

### Se som não toca automático (mas você consegue manual):
- Isso é aceitável em alguns devices Android
- Opção: aumentar volume do device
- Opção: usar som do sistema em vez de arquivo custom

### Se notificação não abre app automático:
- Pode ser relacionado ao Poco X6 Pro (MIUI)
- Verificar em: Configurações do app > Permissões > Notificações

### Se nada funciona:
- Export logs e compartilhe screenshot comigo
- Vamos analisar o erro específico

