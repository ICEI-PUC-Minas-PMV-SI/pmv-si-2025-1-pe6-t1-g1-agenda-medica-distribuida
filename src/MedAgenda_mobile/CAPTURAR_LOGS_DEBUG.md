# 🔍 CAPTURAR LOGS DE DEBUG - Instruções Específicas

## 📋 Status

✅ **Hook de debug criado** - `useImageUploadDebug.ts` com logs simplificados  
✅ **AddDoctorForm atualizado** - Agora usa o hook de debug  
✅ **ImagePicker API corrigida** - Removido warning de deprecação  
✅ **Validação permissiva implementada** - Aceita todas as imagens do ImagePicker  
🎯 **Objetivo** - Testar se o erro foi resolvido

## 🚀 COMO EXECUTAR O TESTE

### **1. Iniciar o App em Modo Debug**

```bash
# No terminal, dentro da pasta MedAgenda_mobile
npx expo start

# Ou se estiver usando React Native CLI
npx react-native start
```

### **2. Testar a Funcionalidade**

#### **Teste Rápido:**
1. **Abrir o app** no dispositivo/simulador
2. **Navegar** para o formulário de adicionar médico
3. **Tentar selecionar uma imagem** da galeria
4. **Verificar se funciona** sem erro

#### **Se ainda houver erro:**
Siga as instruções de debug abaixo para capturar logs detalhados.

### **3. Abrir o Console de Debug (Se Necessário)**

#### **Opção A: Expo (Recomendado)**
1. Após `npx expo start`, pressione `j` para abrir o debugger
2. Ou acesse: http://localhost:19002/
3. Clique em "Open in web browser" ou "Open in Expo Go"
4. Abra as ferramentas de desenvolvedor (F12)
5. Vá para a aba "Console"

#### **Opção B: React Native Debugger**
1. Instalar: `npm install -g react-native-debugger`
2. Abrir: `react-native-debugger`
3. Conectar ao app
4. Console estará visível

#### **Opção C: Metro Terminal**
- Os logs também aparecerão no terminal onde você executou `npx expo start`

### **4. Reproduzir o Erro (Se Ainda Existir)**

1. **Abrir o app** no dispositivo/simulador
2. **Navegar** para o formulário de adicionar médico
3. **Tentar selecionar uma imagem** da galeria
4. **OBSERVAR OS LOGS** no console

### **5. Logs Esperados (SUCESSO)**

Você deve ver logs como estes se tudo estiver funcionando:

```
DEBUG: === INICIANDO SELECAO DE IMAGEM ===
DEBUG: Solicitando permissoes...
DEBUG: Status das permissoes: { cameraStatus: "granted", mediaStatus: "granted" }
DEBUG: Permissoes concedidas
DEBUG: Abrindo galeria de imagens...
DEBUG: Resultado da selecao: { canceled: false, assetsCount: 1 }
DEBUG: Asset selecionado (completo): { ... }
DEBUG: === INICIANDO VALIDACAO ===
DEBUG: Aplicando validacao permissiva para ImagePicker...
DEBUG: Imagem veio do ImagePicker - assumindo tipo valido
DEBUG: Tipo MIME final aceito: image/jpeg
DEBUG: === VALIDACAO CONCLUIDA COM SUCESSO (PERMISSIVA) ===
DEBUG: Validacao passou, definindo imagem selecionada
DEBUG: Imagem selecionada com sucesso: [URI]
```

## 📋 MUDANÇAS IMPLEMENTADAS

### **✅ Correções Aplicadas:**

1. **ImagePicker API atualizada**:
   - Removido `MediaTypeOptions` (deprecated)
   - Usando `mediaTypes: ['images']` (formato atual)
   - Warning de deprecação eliminado

2. **Validação permissiva**:
   - Todas as imagens do ImagePicker são aceitas automaticamente
   - Não depende mais de `asset.type` problemático
   - Fallback seguro para `image/jpeg`

3. **Logs detalhados**:
   - Debug completo de todo o processo
   - Identificação clara de onde ocorrem problemas

### **🎯 Resultado Esperado:**
- ✅ Sem warning de deprecação
- ✅ Seleção de imagem funcionando
- ✅ Upload para Cloudinary funcionando
- ✅ Formulário de médico completo

## 🔧 SE AINDA HOUVER PROBLEMAS

### **Cenários para Testar:**

#### **Teste 1: Galeria**
1. Selecionar "Galeria"
2. Escolher uma foto JPEG
3. Verificar se aparece no formulário

#### **Teste 2: Câmera**
1. Selecionar "Câmera"
2. Tirar uma foto
3. Verificar se aparece no formulário

#### **Teste 3: Upload**
1. Selecionar uma imagem
2. Preencher dados do médico
3. Clicar em "Adicionar"
4. Verificar se faz upload para Cloudinary

### **Se Ainda Houver Erro:**

**Copie TODOS os logs do console**, especialmente:
- O JSON completo do asset selecionado
- Qualquer mensagem de erro
- O resultado da validação

### **Exemplo de logs para enviar:**
```
=== LOGS COMPLETOS ===
DEBUG: === INICIANDO SELECAO DE IMAGEM ===
[... todos os logs ...]
DEBUG: Asset selecionado (completo):
{
  "uri": "content://...",
  "type": "image",  
  "fileSize": 2048000,
  ...
}
[... resto dos logs ...]
ERRO (se houver): [mensagem de erro]
=== FIM DOS LOGS ===

Dispositivo: [Android/iOS]
Fonte: [Galeria/Câmera]
```

## 🎯 OBJETIVO FINAL

**Verificar se as correções resolveram o problema** de upload de imagens.

**As mudanças implementadas devem ter resolvido o erro!** ✅

---

## 🔄 PRÓXIMOS PASSOS

1. **Testar** a funcionalidade
2. **Confirmar** se funciona sem erros
3. **Remover** os logs de debug (opcional)
4. **Usar** o hook original `useImageUpload` se tudo estiver funcionando 