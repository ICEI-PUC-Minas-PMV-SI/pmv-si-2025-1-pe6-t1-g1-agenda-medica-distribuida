import * as ImagePicker from 'expo-image-picker';
import { UPLOAD_CONFIG } from '../config/upload';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class UploadService {
  
  /**
   * Upload para Cloudinary (Recomendado)
   */
  static async uploadToCloudinary(asset: ImagePicker.ImagePickerAsset): Promise<UploadResult> {
    try {
      const { cloudName, uploadPreset } = UPLOAD_CONFIG.cloudinary;
      
      if (!cloudName || !uploadPreset || cloudName === 'SEU_CLOUD_NAME') {
        throw new Error('Cloudinary não configurado. Verifique config/upload.ts');
      }

      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: 'image/jpeg',
        name: 'doctor-image.jpg',
      } as any);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'medagenda/doctors'); // Organizar em pastas

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      return {
        success: true,
        url: data.secure_url,
      };
    } catch (error: any) {
      console.error('Erro no upload Cloudinary:', error);
      return {
        success: false,
        error: error.message || 'Erro no upload para Cloudinary',
      };
    }
  }

  /**
   * Upload para o backend próprio
   */
  static async uploadToBackend(asset: ImagePicker.ImagePickerAsset): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: asset.uri,
        type: 'image/jpeg',
        name: 'doctor-image.jpg',
      } as any);

      const response = await fetch('/api/upload/doctor-image', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        url: data.url,
      };
    } catch (error: any) {
      console.error('Erro no upload backend:', error);
      return {
        success: false,
        error: error.message || 'Erro no upload para o servidor',
      };
    }
  }

  /**
   * Upload simulado para demonstração
   */
  static async uploadDemo(asset: ImagePicker.ImagePickerAsset): Promise<UploadResult> {
    try {
      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Gerar URL de demonstração baseada no timestamp
      const timestamp = Date.now();
      const demoUrl = `https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Médico+${timestamp}`;
      
      return {
        success: true,
        url: demoUrl,
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'Erro na demonstração de upload',
      };
    }
  }

  /**
   * Método principal que escolhe o provedor baseado na configuração
   */
  static async uploadImage(asset: ImagePicker.ImagePickerAsset): Promise<UploadResult> {
    // Validar arquivo
    const validation = this.validateImage(asset);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Escolher provedor baseado na configuração
    const { cloudName } = UPLOAD_CONFIG.cloudinary;
    
    if (cloudName && cloudName !== 'SEU_CLOUD_NAME') {
      // Cloudinary configurado
      return this.uploadToCloudinary(asset);
    } else {
      // Usar demonstração
      console.warn('⚠️ Usando upload de demonstração. Configure Cloudinary para produção.');
      return this.uploadDemo(asset);
    }
  }

  /**
   * Validar imagem antes do upload
   */
  static validateImage(asset: ImagePicker.ImagePickerAsset): { valid: boolean; error?: string } {
    // Verificar tamanho
    if (asset.fileSize && asset.fileSize > UPLOAD_CONFIG.maxFileSize) {
      return {
        valid: false,
        error: `Arquivo muito grande. Máximo: ${UPLOAD_CONFIG.maxFileSize / 1024 / 1024}MB`,
      };
    }

    // Verificar tipo
    if (asset.type && !UPLOAD_CONFIG.allowedTypes.includes(asset.type)) {
      return {
        valid: false,
        error: 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.',
      };
    }

    // Verificar dimensões
    if (asset.width && asset.height) {
      const { maxDimensions } = UPLOAD_CONFIG;
      if (asset.width > maxDimensions.width || asset.height > maxDimensions.height) {
        return {
          valid: false,
          error: `Imagem muito grande. Máximo: ${maxDimensions.width}x${maxDimensions.height}px`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Redimensionar imagem se necessário
   */
  static async resizeImage(asset: ImagePicker.ImagePickerAsset): Promise<ImagePicker.ImagePickerAsset> {
    // Implementar redimensionamento se necessário
    // Por enquanto, retorna a imagem original
    return asset;
  }
} 