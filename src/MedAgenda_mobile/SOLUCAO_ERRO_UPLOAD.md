# 🔧 Solução: Erro "Tipo de arquivo não suportado"

## 🚨 Problema
```
Erro no upload: Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.
```

## ✅ Soluções Implementadas

### 1. **Validação Melhorada de Tipos de Arquivo**
- ✅ Detecção automática do tipo MIME baseada na extensão
- ✅ Validação antes do upload
- ✅ Mensagens de erro mais específicas

### 2. **Correções no Serviço Cloudinary**
- ✅ Tipo MIME correto enviado para o Cloudinary
- ✅ Nome de arquivo com extensão correta
- ✅ Logs detalhados para debug

### 3. **Configurações Atualizadas**
- ✅ Credenciais do Cloudinary configuradas
- ✅ Upload preset: `medagenda_doctors`
- ✅ Tipos permitidos: JPEG, PNG, WebP

## 🔍 Como Testar a Correção

### Passo 1: Verificar Configuração
```bash
node testCloudinaryConfig.js
```

### Passo 2: Criar Upload Preset no Cloudinary
1. Acesse: https://console.cloudinary.com/
2. Vá em **Settings** → **Upload**
3. Clique em **Add upload preset**
4. Configure:
   - **Preset name**: `medagenda_doctors`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `doctors`
   - **Resource Type**: `Image`
5. Salve o preset

### Passo 3: Testar Upload
```typescript
import { useImageUpload } from './hooks/useImageUpload';

const { selectImage, uploadImage, error } = useImageUpload();

// Selecionar imagem
await selectImage();

// Fazer upload
const result = await uploadImage('doctors');
if (result) {
  console.log('✅ Upload bem-sucedido:', result.secure_url);
} else {
  console.log('❌ Erro:', error);
}
```

## 🐛 Possíveis Causas do Erro

### 1. **Upload Preset Não Configurado**
- **Sintoma**: Erro "Upload preset not found"
- **Solução**: Criar preset no Cloudinary Console

### 2. **Tipo de Arquivo Inválido**
- **Sintoma**: "Tipo de arquivo não suportado"
- **Solução**: Usar apenas JPEG, PNG ou WebP

### 3. **Arquivo Muito Grande**
- **Sintoma**: "Arquivo muito grande"
- **Solução**: Reduzir tamanho (máx: 5MB)

### 4. **Credenciais Incorretas**
- **Sintoma**: "Invalid API credentials"
- **Solução**: Verificar cloudName e uploadPreset

## 📱 Exemplo de Uso Correto

```typescript
// components/ExemploUpload.tsx
import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useImageUpload } from '../hooks/useImageUpload';

export const ExemploUpload = () => {
  const {
    selectedImage,
    uploadedImageUrl,
    isUploading,
    error,
    selectImage,
    uploadImage,
    clearError
  } = useImageUpload();

  const handleUpload = async () => {
    if (selectedImage) {
      const result = await uploadImage('doctors');
      if (result) {
        console.log('✅ Imagem enviada:', result.secure_url);
      }
    }
  };

  return (
    <View>
      {error && (
        <View>
          <Text style={{ color: 'red' }}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <TouchableOpacity onPress={selectImage}>
        <Text>Selecionar Imagem</Text>
      </TouchableOpacity>
      
      {selectedImage && (
        <View>
          <Image source={{ uri: selectedImage }} style={{ width: 100, height: 100 }} />
          <TouchableOpacity onPress={handleUpload} disabled={isUploading}>
            <Text>{isUploading ? 'Enviando...' : 'Enviar'}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {uploadedImageUrl && (
        <Text>✅ Upload concluído: {uploadedImageUrl}</Text>
      )}
    </View>
  );
};
```

## 🔧 Debug Avançado

### Verificar Logs no Console
```javascript
// No hook useImageUpload, os logs mostrarão:
console.log('Tipo MIME detectado:', mimeType);
console.log('Nome do arquivo:', fileName);
console.log('Tamanho do arquivo:', fileSize);
```

### Verificar Resposta do Cloudinary
```javascript
// No cloudinaryService, os logs mostrarão:
console.log('Iniciando upload para Cloudinary:', {
  cloudName,
  uploadPreset,
  mimeType,
  fileName,
  folder
});
```

## 📞 Suporte Adicional

Se o erro persistir:

1. **Verifique o Console**: Procure por logs detalhados
2. **Teste com Imagem Simples**: Use uma foto JPEG pequena primeiro
3. **Verifique Conexão**: Confirme se há internet
4. **Cloudinary Console**: Verifique se o preset foi criado corretamente

## ✅ Checklist de Verificação

- [ ] Upload preset `medagenda_doctors` criado no Cloudinary
- [ ] Arquivo é JPEG, PNG ou WebP
- [ ] Arquivo tem menos de 5MB
- [ ] Permissões de câmera/galeria concedidas
- [ ] Conexão com internet ativa
- [ ] Logs do console verificados

---

**Status**: ✅ Correções implementadas
**Próximo passo**: Criar upload preset no Cloudinary Console 