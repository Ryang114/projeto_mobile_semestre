# ========================
# Script Rápido de Teste
# Copie e cole cada seção no PowerShell
# ========================

# PASSO 1: Desinstalar app antigo (MANUAL - fazer no celular)
# Configurações > Apps > [Seu App] > Desinstalar

# PASSO 2: Build + Sync
cd C:\Users\w10\projeto_mobile_semestre
npm run build
node .\scripts\copy-sounds.js
npx cap sync android

# PASSO 3: Abrir Android Studio
npx cap open android

# DEPOIS NO ANDROID STUDIO:
# 1. Build > Clean Build Folder
# 2. Run > Run app (ou Shift + F10)
# 3. Aguardar instalar no Poco X6 Pro

# PASSO 4: No celular - criar alarme
# 1. Home > Create Alarm
# 2. Definir hora para 2 minutos daqui a pouco
# 3. Aguardar disparo

# PASSO 5: Se não funcionar - visualizar logs
# 1. Configurações > Debug Logs
# 2. Procure por "Som tocando com sucesso" (deve estar lá em verde ✅)
# 3. Se não achar, procure por "Falha" ou "Erro" para entender o motivo

# DÚVIDAS? Veja GUIA_DEBUG_ALARMES.md para diagnóstico completo

