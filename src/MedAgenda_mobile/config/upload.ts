// Configurações para upload de imagens
export const UPLOAD_CONFIG = {
  // Cloudinary (Recomendado para produção)
  cloudinary: {
    cloudName: 'dmwhqs5ak', // Substituir pela sua configuração
    uploadPreset: 'medagenda_doctors', // Substituir pela sua configuração
    apiKey: '194188398449739', // Opcional, para uploads assinados
    apiSecret: 'QLywGbHzrRSGUNx0848PnaABRgc', // API Secret para uploads assinados
  },
  
  // AWS S3 (Alternativa)
  aws: {
    region: 'us-east-1',
    bucket: 'seu-bucket-name',
    accessKeyId: 'SUA_ACCESS_KEY',
    secretAccessKey: 'SUA_SECRET_KEY',
  },
  
  // Firebase Storage (Alternativa)
  firebase: {
    storageBucket: 'seu-projeto.appspot.com',
  },
  
  // Configurações gerais
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  imageQuality: 0.8,
  maxDimensions: {
    width: 800,
    height: 800,
  },
};

// URLs de exemplo para demonstração
export const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1594824475317-8b6e5b6b1b1a?w=300&h=300&fit=crop&crop=face',
]; 