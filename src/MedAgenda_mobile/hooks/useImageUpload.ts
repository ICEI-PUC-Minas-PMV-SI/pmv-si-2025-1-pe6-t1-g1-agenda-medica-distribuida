import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import CloudinaryService, { CloudinaryUploadResponse } from '../services/cloudinaryService';
import { UPLOAD_CONFIG } from '../config/upload';

export interface UseImageUploadReturn {
  isUploading: boolean;
  uploadProgress: number;
  selectedImage: string | null;
  uploadedImageUrl: string | null;
  error: string | null;
  selectImage: () => Promise<void>;
  selectImageFromCamera: () => Promise<void>;
  uploadImage: (folder?: string) => Promise<CloudinaryUploadResponse | null>;
  clearImage: () => void;
  clearError: () => void;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermissions = async () => {
    console.log('🔐 [useImageUpload] Solicitando permissões...');
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    console.log('🔐 [useImageUpload] Status das permissões:', { cameraStatus, mediaStatus });
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      const errorMsg = 'Permissões de câmera e galeria são necessárias para selecionar imagens.';
      console.error('❌ [useImageUpload] Permissões negadas:', errorMsg);
      setError(errorMsg);
      return false;
    }
    console.log('✅ [useImageUpload] Permissões concedidas');
    return true;
  };

  const getImageTypeFromUri = (uri: string): string => {
    console.log('🔍 [useImageUpload] Analisando URI para tipo MIME:', uri);
    
    // Extrair extensão da URI
    const extension = uri.split('.').pop()?.toLowerCase();
    console.log('📄 [useImageUpload] Extensão detectada:', extension);
    
    // Verificar se a URI contém parâmetros de query que podem afetar a extensão
    const cleanExtension = extension?.split('?')[0]?.split('#')[0];
    console.log('🧹 [useImageUpload] Extensão limpa:', cleanExtension);
    
    switch (cleanExtension) {
      case 'jpg':
      case 'jpeg':
        console.log('✅ [useImageUpload] Tipo detectado: JPEG');
        return 'image/jpeg';
      case 'png':
        console.log('✅ [useImageUpload] Tipo detectado: PNG');
        return 'image/png';
      case 'webp':
        console.log('✅ [useImageUpload] Tipo detectado: WebP');
        return 'image/webp';
      default:
        console.warn('⚠️ [useImageUpload] Extensão não reconhecida, usando JPEG como fallback');
        return 'image/jpeg'; // fallback
    }
  };

  const validateImage = (imageAsset: ImagePicker.ImagePickerAsset): boolean => {
    console.log('🔍 [useImageUpload] === INICIANDO VALIDAÇÃO ===');
    console.log('🔍 [useImageUpload] Asset completo recebido:', JSON.stringify(imageAsset, null, 2));
    
    try {
      console.log('🔍 [useImageUpload] Dados do asset:', {
        uri: imageAsset.uri,
        fileSize: imageAsset.fileSize,
        width: imageAsset.width,
        height: imageAsset.height,
        type: imageAsset.type,
        uriType: typeof imageAsset.uri,
        typeType: typeof imageAsset.type
      });

      // Verificar se o asset é válido
      if (!imageAsset || !imageAsset.uri) {
        const errorMsg = 'Asset de imagem inválido ou URI ausente';
        console.error('❌ [useImageUpload] Asset inválido:', errorMsg);
        setError(errorMsg);
        return false;
      }

      // Verificar tamanho do arquivo
      if (imageAsset.fileSize && imageAsset.fileSize > UPLOAD_CONFIG.maxFileSize) {
        const maxSizeMB = Math.round(UPLOAD_CONFIG.maxFileSize / (1024 * 1024));
        const fileSizeMB = Math.round(imageAsset.fileSize / (1024 * 1024));
        const errorMsg = `Arquivo muito grande (${fileSizeMB}MB). Tamanho máximo: ${maxSizeMB}MB`;
        console.error('❌ [useImageUpload] Arquivo muito grande:', errorMsg);
        setError(errorMsg);
        return false;
      }

      console.log('📊 [useImageUpload] Configuração de upload:', UPLOAD_CONFIG);

      // NOVA LÓGICA: Priorizar asset.type quando disponível e válido
      let detectedMimeType: string;
      let validationSource: string;

      console.log('🎯 [useImageUpload] Verificando asset.type...');
      console.log('🎯 [useImageUpload] asset.type valor:', imageAsset.type);
      console.log('🎯 [useImageUpload] asset.type é string?', typeof imageAsset.type === 'string');
      console.log('🎯 [useImageUpload] asset.type é truthy?', !!imageAsset.type);
      
      if (imageAsset.type && typeof imageAsset.type === 'string' && imageAsset.type.startsWith('image/')) {
        // Usar asset.type se disponível e válido
        detectedMimeType = imageAsset.type;
        validationSource = 'asset.type';
        console.log('🎯 [useImageUpload] Usando asset.type:', detectedMimeType);
      } else {
        // Fallback para detecção por URI
        console.log('🎯 [useImageUpload] asset.type não é válido, usando detecção por URI');
        console.log('🎯 [useImageUpload] Motivo:', {
          hasType: !!imageAsset.type,
          isString: typeof imageAsset.type === 'string',
          startsWithImage: imageAsset.type && typeof imageAsset.type === 'string' ? imageAsset.type.startsWith('image/') : false
        });
        
        detectedMimeType = getImageTypeFromUri(imageAsset.uri);
        validationSource = 'URI extension';
        console.log('🎯 [useImageUpload] Usando detecção por URI:', detectedMimeType);
      }

      console.log('📋 [useImageUpload] Tipos permitidos:', UPLOAD_CONFIG.allowedTypes);
      console.log('🔍 [useImageUpload] Fonte da validação:', validationSource);
      console.log('🎯 [useImageUpload] Tipo MIME detectado:', detectedMimeType);
      
      // Verificar se o tipo detectado é permitido
      let isValidType = UPLOAD_CONFIG.allowedTypes.includes(detectedMimeType);
      console.log('📊 [useImageUpload] Validação inicial:', isValidType);
      
      // Se não passou na validação inicial, tentar estratégias alternativas
      if (!isValidType) {
        console.log('🔄 [useImageUpload] Validação inicial falhou, tentando estratégias alternativas...');
        
        // Estratégia 1: URIs especiais sempre aceitas (ImagePicker, content://, ph://)
        const specialUriPatterns = [
          'ImagePicker',
          'expo',
          'content://',
          'ph://',
          '/DCIM/',
          '/Camera/',
          'media/external'
        ];
        
        console.log('🔄 [useImageUpload] Verificando padrões de URI especiais:', specialUriPatterns);
        
        const isSpecialUri = specialUriPatterns.some(pattern => {
          const matches = imageAsset.uri.includes(pattern);
          console.log(`🔄 [useImageUpload] Padrão "${pattern}": ${matches ? 'ENCONTRADO' : 'não encontrado'}`);
          return matches;
        });
        
        if (isSpecialUri) {
          console.log('✅ [useImageUpload] URI especial detectada, assumindo tipo válido');
          isValidType = true;
        }
        
        // Estratégia 2: Se asset.type não foi usado, tentar usá-lo agora
        if (!isValidType && imageAsset.type && validationSource !== 'asset.type') {
          console.log('🔄 [useImageUpload] Tentando com asset.type como fallback:', imageAsset.type);
          const assetTypeValid = UPLOAD_CONFIG.allowedTypes.includes(imageAsset.type);
          console.log('🔄 [useImageUpload] asset.type é válido?', assetTypeValid);
          
          if (assetTypeValid) {
            detectedMimeType = imageAsset.type;
            isValidType = true;
            console.log('✅ [useImageUpload] Validação bem-sucedida com asset.type');
          }
        }
        
        // Estratégia 3: Para URIs sem extensão clara, assumir JPEG se vier de fonte confiável
        if (!isValidType && !imageAsset.uri.includes('.')) {
          console.log('🔄 [useImageUpload] URI sem extensão detectada, assumindo JPEG');
          detectedMimeType = 'image/jpeg';
          isValidType = true;
        }
      }
      
      console.log('📊 [useImageUpload] Resultado final da validação:', isValidType);
      console.log('📊 [useImageUpload] Tipo MIME final:', detectedMimeType);
      
      if (!isValidType) {
        const errorMsg = 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.';
        console.error('❌ [useImageUpload] Tipo não permitido após todas as tentativas:', { 
          detectedMimeType, 
          assetType: imageAsset.type,
          uri: imageAsset.uri,
          allowedTypes: UPLOAD_CONFIG.allowedTypes
        });
        console.error('❌ [useImageUpload] ERRO FINAL:', errorMsg);
        setError(errorMsg);
        return false;
      }

      console.log('✅ [useImageUpload] Imagem validada com sucesso');
      console.log('📊 [useImageUpload] Tipo final aceito:', detectedMimeType);
      console.log('🔍 [useImageUpload] === VALIDAÇÃO CONCLUÍDA COM SUCESSO ===');
      return true;
    } catch (error) {
      console.error('❌ [useImageUpload] Erro na validação da imagem:', error);
      console.error('❌ [useImageUpload] Stack trace:', error instanceof Error ? error.stack : 'N/A');
      setError('Erro ao validar a imagem selecionada.');
      return false;
    }
  };

  const selectImage = async () => {
    console.log('📱 [useImageUpload] === INICIANDO SELEÇÃO DE IMAGEM ===');
    
    try {
      setError(null);
      console.log('🧹 [useImageUpload] Erro limpo');
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.error('❌ [useImageUpload] Permissões não concedidas, abortando');
        return;
      }

      console.log('📱 [useImageUpload] Abrindo galeria de imagens...');
      console.log('📱 [useImageUpload] Configurações do ImagePicker:', {
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: UPLOAD_CONFIG.imageQuality,
        allowsMultipleSelection: false,
        exif: false
      });
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: UPLOAD_CONFIG.imageQuality,
        allowsMultipleSelection: false,
        exif: false, // Não incluir dados EXIF para reduzir tamanho
      });

      console.log('📱 [useImageUpload] Resultado da seleção:', {
        canceled: result.canceled,
        assetsCount: result.assets?.length || 0
      });

      if (result.canceled) {
        console.log('📱 [useImageUpload] Seleção cancelada pelo usuário');
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        console.error('❌ [useImageUpload] Nenhum asset retornado');
        setError('Nenhuma imagem foi selecionada.');
        return;
      }

      const imageAsset = result.assets[0];
      console.log('🖼️ [useImageUpload] Asset selecionado (completo):', JSON.stringify(imageAsset, null, 2));
      
      console.log('🔍 [useImageUpload] Iniciando validação do asset...');
      if (validateImage(imageAsset)) {
        console.log('✅ [useImageUpload] Validação passou, definindo imagem selecionada');
        setSelectedImage(imageAsset.uri);
        setUploadedImageUrl(null);
        console.log('✅ [useImageUpload] Imagem selecionada com sucesso:', imageAsset.uri);
      } else {
        console.error('❌ [useImageUpload] Validação falhou');
      }
    } catch (err) {
      const errorMessage = 'Erro ao selecionar imagem da galeria.';
      console.error('❌ [useImageUpload] Erro na seleção:', err);
      console.error('❌ [useImageUpload] Stack trace:', err instanceof Error ? err.stack : 'N/A');
      setError(errorMessage);
    }
    
    console.log('📱 [useImageUpload] === SELEÇÃO DE IMAGEM FINALIZADA ===');
  };

  const selectImageFromCamera = async () => {
    console.log('📷 [useImageUpload] === INICIANDO CAPTURA DA CÂMERA ===');
    
    try {
      setError(null);
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      console.log('📷 [useImageUpload] Abrindo câmera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: UPLOAD_CONFIG.imageQuality,
        exif: false, // Não incluir dados EXIF para reduzir tamanho
      });

      console.log('📷 [useImageUpload] Resultado da câmera:', {
        canceled: result.canceled,
        assetsCount: result.assets?.length || 0
      });

      if (!result.canceled && result.assets[0]) {
        const imageAsset = result.assets[0];
        console.log('🖼️ [useImageUpload] Asset capturado:', imageAsset);
        
        if (validateImage(imageAsset)) {
          setSelectedImage(imageAsset.uri);
          setUploadedImageUrl(null);
          console.log('✅ [useImageUpload] Imagem capturada com sucesso');
        }
      }
    } catch (err) {
      const errorMessage = 'Erro ao capturar imagem da câmera.';
      setError(errorMessage);
      console.error('❌ [useImageUpload] Erro ao capturar imagem:', err);
    }
  };

  const uploadImage = async (folder?: string): Promise<CloudinaryUploadResponse | null> => {
    console.log('🚀 [useImageUpload] === INICIANDO UPLOAD ===');
    
    if (!selectedImage) {
      const errorMsg = 'Nenhuma imagem selecionada para upload.';
      console.error('❌ [useImageUpload] Erro:', errorMsg);
      setError(errorMsg);
      return null;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      console.log('🚀 [useImageUpload] Iniciando upload da imagem:', selectedImage);
      console.log('🚀 [useImageUpload] Pasta de destino:', folder || 'raiz');

      // Simula progresso do upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      console.log('🌐 [useImageUpload] Chamando CloudinaryService.uploadImage...');
      const response = await CloudinaryService.uploadImage(selectedImage, folder);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedImageUrl(response.secure_url);
      
      console.log('✅ [useImageUpload] Upload concluído com sucesso:', response.secure_url);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido no upload';
      console.error('❌ [useImageUpload] Erro no upload:', err);
      console.error('❌ [useImageUpload] Stack trace:', err instanceof Error ? err.stack : 'N/A');
      setError(`Erro no upload: ${errorMessage}`);
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
      console.log('🚀 [useImageUpload] === UPLOAD FINALIZADO ===');
    }
  };

  const clearImage = () => {
    console.log('🗑️ [useImageUpload] Limpando imagem');
    setSelectedImage(null);
    setUploadedImageUrl(null);
    setUploadProgress(0);
    setError(null);
  };

  const clearError = () => {
    console.log('🧹 [useImageUpload] Limpando erro');
    setError(null);
  };

  return {
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
  };
}; 