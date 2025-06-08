# Configuração do Cloudinary para Upload de Imagens

Este documento explica como configurar e usar o sistema de upload de imagens com Cloudinary no aplicativo MedAgenda Mobile.

## 📋 Pré-requisitos

- Conta no Cloudinary (gratuita disponível)
- React Native com Expo
- Dependências instaladas

## 🔧 Configuração Inicial

### 1. Configuração do Cloudinary

As configurações já foram aplicadas no arquivo `config/upload.ts`:

```typescript
cloudinary: {
  cloudName: 'dmwhqs5ak',
  uploadPreset: 'SEU_UPLOAD_PRESET', // ⚠️ PRECISA CONFIGURAR
  apiKey: '194188398449739',
  apiSecret: 'QLywGbHzrRSGUNx0848PnaABRgc',
}
```

### 2. Criar Upload Preset no Cloudinary

**IMPORTANTE**: Você precisa criar um Upload Preset no painel do Cloudinary:

1. Acesse [Cloudinary Console](https://console.cloudinary.com/)
2. Vá em **Settings** → **Upload**
3. Clique em **Add upload preset**
4. Configure:
   - **Preset name**: `medagenda_doctors` (ou outro nome de sua escolha)
   - **Signing Mode**: `Unsigned` (para uploads diretos do app)
   - **Folder**: `doctors` (opcional, para organizar)
   - **Transformation**: Configure redimensionamento se necessário
5. Salve o preset

### 3. Atualizar a Configuração

Após criar o preset, atualize o arquivo `config/upload.ts`:

```typescript
uploadPreset: 'medagenda_doctors', // Substitua pelo nome do seu preset
```

## 📦 Dependências Instaladas

As seguintes dependências foram instaladas automaticamente:

```bash
npm install cloudinary-react-native expo-image-picker expo-media-library
```

## 🚀 Como Usar

### 1. Hook useImageUpload

O hook `useImageUpload` fornece toda a funcionalidade necessária:

```typescript
import { useImageUpload } from '../hooks/useImageUpload';

const {
  isUploading,
  uploadProgress,
  selectedImage,
  uploadedImageUrl,
  error,
  selectImage,
  selectImageFromCamera,
  uploadImage,
  clearImage,
  clearError,
} = useImageUpload();
```

### 2. Componente AddDoctorForm

Exemplo completo de uso no componente `AddDoctorForm.tsx`:

```typescript
import { AddDoctorForm } from '../components/AddDoctorForm';

// No seu componente pai
const handleAddDoctor = async (doctor) => {
  // Salvar médico no backend
  console.log('Novo médico:', doctor);
};

<AddDoctorForm
  onSubmit={handleAddDoctor}
  onCancel={() => navigation.goBack()}
/>
```

### 3. Uso Básico do Upload

```typescript
// Selecionar imagem
await selectImage(); // Da galeria
await selectImageFromCamera(); // Da câmera

// Fazer upload
const result = await uploadImage('doctors'); // Pasta no Cloudinary
console.log('URL da imagem:', result?.secure_url);
```

## 🔒 Segurança

### Upload Não Assinado (Atual)
- Mais simples de implementar
- Adequado para desenvolvimento
- Usa Upload Preset público

### Upload Assinado (Recomendado para Produção)
- Mais seguro
- Requer endpoint no backend para gerar assinatura
- Mantém API Secret no servidor

Para implementar upload assinado:

1. Crie endpoint no backend:
```javascript
// Backend endpoint
app.post('/api/cloudinary/signature', (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: 'doctors' },
    process.env.CLOUDINARY_API_SECRET
  );
  
  res.json({ timestamp, signature });
});
```

2. Use `uploadImageSigned()` no app

## 📁 Estrutura de Arquivos

```
src/MedAgenda_mobile/
├── config/
│   └── upload.ts              # Configurações do Cloudinary
├── services/
│   └── cloudinaryService.ts   # Serviço de upload
├── hooks/
│   └── useImageUpload.ts      # Hook personalizado
├── components/
│   └── AddDoctorForm.tsx      # Componente de exemplo
└── README_CLOUDINARY.md       # Este arquivo
```

## 🎨 Funcionalidades

### ✅ Implementadas
- [x] Seleção de imagem da galeria
- [x] Captura de foto da câmera
- [x] Upload para Cloudinary
- [x] Redimensionamento automático
- [x] Indicador de progresso
- [x] Tratamento de erros
- [x] Preview da imagem
- [x] Validação de tipos de arquivo

### 🔄 Configurações Aplicadas
- Tamanho máximo: 5MB
- Tipos permitidos: JPEG, PNG, WebP
- Dimensões máximas: 800x800px
- Qualidade: 80%
- Pasta no Cloudinary: `doctors/`

## 🐛 Solução de Problemas

### Erro: "Upload Preset not found"
- Verifique se o preset foi criado no Cloudinary
- Confirme o nome do preset no arquivo de configuração

### Erro: "Invalid API credentials"
- Verifique as credenciais no arquivo `config/upload.ts`
- Confirme se o Cloud Name está correto

### Erro de Permissões
- O app solicita permissões automaticamente
- Verifique as configurações de privacidade do dispositivo

### Upload Lento
- Verifique a conexão de internet
- Considere reduzir a qualidade da imagem

## 📱 Testando

1. Execute o app: `npm start`
2. Navegue até a tela de adicionar médico
3. Toque em "Selecionar Foto"
4. Escolha uma imagem
5. Preencha os dados do médico
6. Toque em "Adicionar"

## 🔗 Links Úteis

- [Cloudinary Console](https://console.cloudinary.com/)
- [Documentação Cloudinary](https://cloudinary.com/documentation)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console
2. Confirme as configurações do Cloudinary
3. Teste com imagens menores primeiro
4. Verifique a conexão de internet

---

**Próximos Passos:**
1. ⚠️ **IMPORTANTE**: Criar o Upload Preset no Cloudinary
2. Testar o upload de imagens
3. Integrar com o backend da aplicação
4. Implementar upload assinado para produção 