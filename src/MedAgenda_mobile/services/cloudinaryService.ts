import { UPLOAD_CONFIG } from '../config/upload';

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
}

export class CloudinaryService {
  private static instance: CloudinaryService;
  private config = UPLOAD_CONFIG.cloudinary;

  public static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService();
    }
    return CloudinaryService.instance;
  }

  /**
   * Detecta o tipo MIME da imagem baseado na URI (versão melhorada)
   */
  private getImageMimeType(imageUri: string): string {
    console.log('🔍 [Cloudinary] Detectando tipo MIME para:', imageUri);
    
    const extension = imageUri.split('.').pop()?.toLowerCase();
    const cleanExtension = extension?.split('?')[0]?.split('#')[0];
    
    console.log('📄 [Cloudinary] Extensão detectada:', cleanExtension);
    
    switch (cleanExtension) {
      case 'jpg':
      case 'jpeg':
        console.log('✅ [Cloudinary] Tipo detectado: JPEG');
        return 'image/jpeg';
      case 'png':
        console.log('✅ [Cloudinary] Tipo detectado: PNG');
        return 'image/png';
      case 'webp':
        console.log('✅ [Cloudinary] Tipo detectado: WebP');
        return 'image/webp';
      default:
        // Para URIs especiais sem extensão clara, assumir JPEG
        const specialUriPatterns = [
          'content://',
          'ph://',
          'ImagePicker',
          'expo',
          '/DCIM/',
          '/Camera/',
          'media/external'
        ];
        
        const isSpecialUri = specialUriPatterns.some(pattern => 
          imageUri.includes(pattern)
        );
        
        if (isSpecialUri) {
          console.log('✅ [Cloudinary] URI especial detectada, assumindo JPEG');
          return 'image/jpeg';
        }
        
        console.log('⚠️ [Cloudinary] Extensão não reconhecida, usando JPEG como fallback');
        return 'image/jpeg'; // fallback seguro
    }
  }

  /**
   * Gera nome do arquivo baseado no tipo e timestamp
   */
  private getFileName(imageUri: string, mimeType?: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    
    // Determinar extensão baseada no tipo MIME ou URI
    let extension = 'jpg'; // fallback
    
    if (mimeType) {
      switch (mimeType) {
        case 'image/jpeg':
          extension = 'jpg';
          break;
        case 'image/png':
          extension = 'png';
          break;
        case 'image/webp':
          extension = 'webp';
          break;
      }
    } else {
      // Fallback para detecção por URI
      const uriExtension = imageUri.split('.').pop()?.toLowerCase();
      if (uriExtension && ['jpg', 'jpeg', 'png', 'webp'].includes(uriExtension)) {
        extension = uriExtension === 'jpeg' ? 'jpg' : uriExtension;
      }
    }
    
    const fileName = `medagenda_${timestamp}_${random}.${extension}`;
    console.log('📝 [Cloudinary] Nome do arquivo gerado:', fileName);
    return fileName;
  }

  /**
   * Upload de imagem para o Cloudinary (versão melhorada)
   * @param imageUri URI da imagem local
   * @param folder Pasta no Cloudinary (opcional)
   * @returns Promise com a resposta do Cloudinary
   */
  async uploadImage(
    imageUri: string,
    folder?: string
  ): Promise<CloudinaryUploadResponse> {
    try {
      console.log('🚀 [Cloudinary] Iniciando upload...');
      
      // Validar se a configuração está completa
      if (!this.config.cloudName || !this.config.uploadPreset) {
        throw new Error('Configuração do Cloudinary incompleta. Verifique cloudName e uploadPreset.');
      }

      const formData = new FormData();
      
      // Detectar tipo MIME e nome do arquivo
      const mimeType = this.getImageMimeType(imageUri);
      const fileName = this.getFileName(imageUri, mimeType);
      
      console.log('📊 [Cloudinary] Dados do upload:', {
        uri: imageUri,
        mimeType,
        fileName,
        folder: folder || 'sem pasta'
      });
      
      // Adiciona a imagem ao FormData com tipo correto
      formData.append('file', {
        uri: imageUri,
        type: mimeType,
        name: fileName,
      } as any);

      // Configurações do upload
      formData.append('upload_preset', this.config.uploadPreset);
      formData.append('cloud_name', this.config.cloudName);
      
      if (folder) {
        formData.append('folder', folder);
      }

      // Configurações de transformação para otimização
      formData.append('transformation', JSON.stringify([
        {
          width: UPLOAD_CONFIG.maxDimensions.width,
          height: UPLOAD_CONFIG.maxDimensions.height,
          crop: 'limit',
          quality: Math.round(UPLOAD_CONFIG.imageQuality * 100),
          format: 'auto', // Permite ao Cloudinary escolher o melhor formato
        }
      ]));

      console.log('🌐 [Cloudinary] Enviando para:', `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          // Remover Content-Type header para deixar o browser definir automaticamente
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // },
        }
      );

      console.log('📡 [Cloudinary] Status da resposta:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [Cloudinary] Erro na resposta:', errorData);
        throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const result: CloudinaryUploadResponse = await response.json();
      console.log('✅ [Cloudinary] Upload bem-sucedido!');
      console.log('🔗 [Cloudinary] URL da imagem:', result.secure_url);
      return result;
    } catch (error) {
      console.error('❌ [Cloudinary] Erro no upload:', error);
      throw error;
    }
  }

  /**
   * Upload de imagem com assinatura (mais seguro)
   * @param imageUri URI da imagem local
   * @param folder Pasta no Cloudinary (opcional)
   * @returns Promise com a resposta do Cloudinary
   */
  async uploadImageSigned(
    imageUri: string,
    folder?: string
  ): Promise<CloudinaryUploadResponse> {
    try {
      // Primeiro, obter a assinatura do seu backend
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = await this.generateSignature(timestamp, folder);

      const formData = new FormData();
      
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      } as any);

      formData.append('api_key', this.config.apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const result: CloudinaryUploadResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Erro no upload assinado para Cloudinary:', error);
      throw error;
    }
  }

  /**
   * Gera assinatura para upload seguro
   * IMPORTANTE: Em produção, esta função deve ser executada no backend
   */
  private async generateSignature(timestamp: number, folder?: string): Promise<string> {
    // ATENÇÃO: Este é apenas um exemplo. Em produção, a assinatura deve ser gerada no backend
    // para manter o API Secret seguro
    
    const crypto = require('crypto');
    let params = `timestamp=${timestamp}`;
    
    if (folder) {
      params += `&folder=${folder}`;
    }
    
    const signature = crypto
      .createHash('sha1')
      .update(params + this.config.apiSecret)
      .digest('hex');
    
    return signature;
  }

  /**
   * Deleta uma imagem do Cloudinary
   * @param publicId ID público da imagem
   * @returns Promise com resultado da deleção
   */
  async deleteImage(publicId: string): Promise<any> {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = await this.generateDeleteSignature(publicId, timestamp);

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', this.config.apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/destroy`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao deletar imagem do Cloudinary:', error);
      throw error;
    }
  }

  private async generateDeleteSignature(publicId: string, timestamp: number): Promise<string> {
    const crypto = require('crypto');
    const params = `public_id=${publicId}&timestamp=${timestamp}`;
    
    const signature = crypto
      .createHash('sha1')
      .update(params + this.config.apiSecret)
      .digest('hex');
    
    return signature;
  }
}

export default CloudinaryService.getInstance(); 