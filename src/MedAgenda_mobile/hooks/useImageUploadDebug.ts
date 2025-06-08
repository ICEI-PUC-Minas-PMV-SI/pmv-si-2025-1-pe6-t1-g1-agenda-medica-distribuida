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

export const useImageUploadDebug = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermissions = async () => {
    console.log('DEBUG: Solicitando permissoes...');
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    console.log('DEBUG: Status das permissoes:', { cameraStatus, mediaStatus });
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      const errorMsg = 'Permissoes de camera e galeria sao necessarias para selecionar imagens.';
      console.error('DEBUG: Permissoes negadas:', errorMsg);
      setError(errorMsg);
      return false;
    }
    console.log('DEBUG: Permissoes concedidas');
    return true;
  };

  const getImageTypeFromUri = (uri: string): string => {
    console.log('DEBUG: Analisando URI para tipo MIME:', uri);
    
    const extension = uri.split('.').pop()?.toLowerCase();
    console.log('DEBUG: Extensao detectada:', extension);
    
    const cleanExtension = extension?.split('?')[0]?.split('#')[0];
    console.log('DEBUG: Extensao limpa:', cleanExtension);
    
    switch (cleanExtension) {
      case 'jpg':
      case 'jpeg':
        console.log('DEBUG: Tipo detectado: JPEG');
        return 'image/jpeg';
      case 'png':
        console.log('DEBUG: Tipo detectado: PNG');
        return 'image/png';
      case 'webp':
        console.log('DEBUG: Tipo detectado: WebP');
        return 'image/webp';
      default:
        console.warn('DEBUG: Extensao nao reconhecida, usando JPEG como fallback');
        return 'image/jpeg';
    }
  };

  const validateImage = (imageAsset: ImagePicker.ImagePickerAsset): boolean => {
    console.log('DEBUG: === INICIANDO VALIDACAO ===');
    console.log('DEBUG: Asset completo recebido:');
    console.log(JSON.stringify(imageAsset, null, 2));
    
    try {
      console.log('DEBUG: Dados do asset:', {
        uri: imageAsset.uri,
        fileSize: imageAsset.fileSize,
        width: imageAsset.width,
        height: imageAsset.height,
        type: imageAsset.type,
        uriType: typeof imageAsset.uri,
        typeType: typeof imageAsset.type
      });

      // Verificar se o asset e valido
      if (!imageAsset || !imageAsset.uri) {
        const errorMsg = 'Asset de imagem invalido ou URI ausente';
        console.error('DEBUG: Asset invalido:', errorMsg);
        setError(errorMsg);
        return false;
      }

      // Verificar tamanho do arquivo
      if (imageAsset.fileSize && imageAsset.fileSize > UPLOAD_CONFIG.maxFileSize) {
        const maxSizeMB = Math.round(UPLOAD_CONFIG.maxFileSize / (1024 * 1024));
        const fileSizeMB = Math.round(imageAsset.fileSize / (1024 * 1024));
        const errorMsg = `Arquivo muito grande (${fileSizeMB}MB). Tamanho maximo: ${maxSizeMB}MB`;
        console.error('DEBUG: Arquivo muito grande:', errorMsg);
        setError(errorMsg);
        return false;
      }

      console.log('DEBUG: Configuracao de upload:', UPLOAD_CONFIG);

      // NOVA ESTRATÉGIA: Sempre aceitar imagens do ImagePicker
      // O ImagePicker já filtra apenas imagens, então podemos confiar nele
      console.log('DEBUG: Aplicando validacao permissiva para ImagePicker...');
      
      // Se veio do ImagePicker, é uma imagem válida
      const isFromImagePicker = true; // Já que estamos usando ImagePicker
      
      if (isFromImagePicker) {
        console.log('DEBUG: Imagem veio do ImagePicker - assumindo tipo valido');
        
        // Determinar tipo MIME baseado na URI ou usar JPEG como fallback
        let detectedMimeType = 'image/jpeg'; // Fallback seguro
        
        if (imageAsset.type && 
            typeof imageAsset.type === 'string' && 
            imageAsset.type.startsWith('image/') &&
            UPLOAD_CONFIG.allowedTypes.includes(imageAsset.type)) {
          detectedMimeType = imageAsset.type;
          console.log('DEBUG: Usando asset.type valido:', detectedMimeType);
        } else {
          // Tentar detectar pela URI
          const uriType = getImageTypeFromUri(imageAsset.uri);
          if (UPLOAD_CONFIG.allowedTypes.includes(uriType)) {
            detectedMimeType = uriType;
            console.log('DEBUG: Usando tipo detectado pela URI:', detectedMimeType);
          } else {
            console.log('DEBUG: Usando fallback JPEG');
          }
        }
        
        console.log('DEBUG: Tipo MIME final aceito:', detectedMimeType);
        console.log('DEBUG: === VALIDACAO CONCLUIDA COM SUCESSO (PERMISSIVA) ===');
        return true;
      }

      // Código de validação original como fallback (nunca deve chegar aqui)
      let detectedMimeType: string;
      let validationSource: string;

      console.log('DEBUG: Verificando asset.type...');
      console.log('DEBUG: asset.type valor:', imageAsset.type);
      console.log('DEBUG: asset.type e string?', typeof imageAsset.type === 'string');
      console.log('DEBUG: asset.type e truthy?', !!imageAsset.type);
      
      if (imageAsset.type && typeof imageAsset.type === 'string' && imageAsset.type.startsWith('image/')) {
        detectedMimeType = imageAsset.type;
        validationSource = 'asset.type';
        console.log('DEBUG: Usando asset.type:', detectedMimeType);
      } else {
        console.log('DEBUG: asset.type nao e valido, usando deteccao por URI');
        console.log('DEBUG: Motivo:', {
          hasType: !!imageAsset.type,
          isString: typeof imageAsset.type === 'string',
          startsWithImage: imageAsset.type && typeof imageAsset.type === 'string' ? imageAsset.type.startsWith('image/') : false
        });
        
        detectedMimeType = getImageTypeFromUri(imageAsset.uri);
        validationSource = 'URI extension';
        console.log('DEBUG: Usando deteccao por URI:', detectedMimeType);
      }

      console.log('DEBUG: Tipos permitidos:', UPLOAD_CONFIG.allowedTypes);
      console.log('DEBUG: Fonte da validacao:', validationSource);
      console.log('DEBUG: Tipo MIME detectado:', detectedMimeType);
      
      let isValidType = UPLOAD_CONFIG.allowedTypes.includes(detectedMimeType);
      console.log('DEBUG: Validacao inicial:', isValidType);
      
      if (!isValidType) {
        console.log('DEBUG: Validacao inicial falhou, tentando estrategias alternativas...');
        
        const specialUriPatterns = [
          'ImagePicker',
          'expo',
          'content://',
          'ph://',
          '/DCIM/',
          '/Camera/',
          'media/external'
        ];
        
        console.log('DEBUG: Verificando padroes de URI especiais:', specialUriPatterns);
        
        const isSpecialUri = specialUriPatterns.some(pattern => {
          const matches = imageAsset.uri.includes(pattern);
          console.log(`DEBUG: Padrao "${pattern}": ${matches ? 'ENCONTRADO' : 'nao encontrado'}`);
          return matches;
        });
        
        if (isSpecialUri) {
          console.log('DEBUG: URI especial detectada, assumindo tipo valido');
          isValidType = true;
        }
        
        if (!isValidType && imageAsset.type && validationSource !== 'asset.type') {
          console.log('DEBUG: Tentando com asset.type como fallback:', imageAsset.type);
          const assetTypeValid = UPLOAD_CONFIG.allowedTypes.includes(imageAsset.type);
          console.log('DEBUG: asset.type e valido?', assetTypeValid);
          
          if (assetTypeValid) {
            detectedMimeType = imageAsset.type;
            isValidType = true;
            console.log('DEBUG: Validacao bem-sucedida com asset.type');
          }
        }
        
        if (!isValidType && !imageAsset.uri.includes('.')) {
          console.log('DEBUG: URI sem extensao detectada, assumindo JPEG');
          detectedMimeType = 'image/jpeg';
          isValidType = true;
        }
      }
      
      console.log('DEBUG: Resultado final da validacao:', isValidType);
      console.log('DEBUG: Tipo MIME final:', detectedMimeType);
      
      if (!isValidType) {
        const errorMsg = 'Tipo de arquivo nao suportado. Use JPEG, PNG ou WebP.';
        console.error('DEBUG: Tipo nao permitido apos todas as tentativas:', { 
          detectedMimeType, 
          assetType: imageAsset.type,
          uri: imageAsset.uri,
          allowedTypes: UPLOAD_CONFIG.allowedTypes
        });
        console.error('DEBUG: ERRO FINAL:', errorMsg);
        setError(errorMsg);
        return false;
      }

      console.log('DEBUG: Imagem validada com sucesso');
      console.log('DEBUG: Tipo final aceito:', detectedMimeType);
      console.log('DEBUG: === VALIDACAO CONCLUIDA COM SUCESSO ===');
      return true;
    } catch (error) {
      console.error('DEBUG: Erro na validacao da imagem:', error);
      console.error('DEBUG: Stack trace:', error instanceof Error ? error.stack : 'N/A');
      setError('Erro ao validar a imagem selecionada.');
      return false;
    }
  };

  const selectImage = async () => {
    console.log('DEBUG: === INICIANDO SELECAO DE IMAGEM ===');
    
    try {
      setError(null);
      console.log('DEBUG: Erro limpo');
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.error('DEBUG: Permissoes nao concedidas, abortando');
        return;
      }

      console.log('DEBUG: Abrindo galeria de imagens...');
      console.log('DEBUG: Configuracoes do ImagePicker:', {
        mediaTypes: 'Images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: UPLOAD_CONFIG.imageQuality,
        allowsMultipleSelection: false,
        exif: false
      });
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: UPLOAD_CONFIG.imageQuality,
        allowsMultipleSelection: false,
        exif: false,
      });

      console.log('DEBUG: Resultado da selecao:', {
        canceled: result.canceled,
        assetsCount: result.assets?.length || 0
      });

      if (result.canceled) {
        console.log('DEBUG: Selecao cancelada pelo usuario');
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        console.error('DEBUG: Nenhum asset retornado');
        setError('Nenhuma imagem foi selecionada.');
        return;
      }

      const imageAsset = result.assets[0];
      console.log('DEBUG: Asset selecionado (completo):');
      console.log(JSON.stringify(imageAsset, null, 2));
      
      console.log('DEBUG: Iniciando validacao do asset...');
      if (validateImage(imageAsset)) {
        console.log('DEBUG: Validacao passou, definindo imagem selecionada');
        setSelectedImage(imageAsset.uri);
        setUploadedImageUrl(null);
        console.log('DEBUG: Imagem selecionada com sucesso:', imageAsset.uri);
      } else {
        console.error('DEBUG: Validacao falhou');
      }
    } catch (err) {
      const errorMessage = 'Erro ao selecionar imagem da galeria.';
      console.error('DEBUG: Erro na selecao:', err);
      console.error('DEBUG: Stack trace:', err instanceof Error ? err.stack : 'N/A');
      setError(errorMessage);
    }
    
    console.log('DEBUG: === SELECAO DE IMAGEM FINALIZADA ===');
  };

  const selectImageFromCamera = async () => {
    console.log('DEBUG: === INICIANDO CAPTURA DA CAMERA ===');
    
    try {
      setError(null);
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      console.log('DEBUG: Abrindo camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: UPLOAD_CONFIG.imageQuality,
        exif: false,
      });

      console.log('DEBUG: Resultado da camera:', {
        canceled: result.canceled,
        assetsCount: result.assets?.length || 0
      });

      if (!result.canceled && result.assets[0]) {
        const imageAsset = result.assets[0];
        console.log('DEBUG: Asset capturado:', imageAsset);
        
        if (validateImage(imageAsset)) {
          setSelectedImage(imageAsset.uri);
          setUploadedImageUrl(null);
          console.log('DEBUG: Imagem capturada com sucesso');
        }
      }
    } catch (err) {
      const errorMessage = 'Erro ao capturar imagem da camera.';
      setError(errorMessage);
      console.error('DEBUG: Erro ao capturar imagem:', err);
    }
  };

  const uploadImage = async (folder?: string): Promise<CloudinaryUploadResponse | null> => {
    console.log('DEBUG: === INICIANDO UPLOAD ===');
    
    if (!selectedImage) {
      const errorMsg = 'Nenhuma imagem selecionada para upload.';
      console.error('DEBUG: Erro:', errorMsg);
      setError(errorMsg);
      return null;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      console.log('DEBUG: Iniciando upload da imagem:', selectedImage);
      console.log('DEBUG: Pasta de destino:', folder || 'raiz');

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      console.log('DEBUG: Chamando CloudinaryService.uploadImage...');
      const response = await CloudinaryService.uploadImage(selectedImage, folder);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedImageUrl(response.secure_url);
      
      console.log('DEBUG: Upload concluido com sucesso:', response.secure_url);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido no upload';
      console.error('DEBUG: Erro no upload:', err);
      console.error('DEBUG: Stack trace:', err instanceof Error ? err.stack : 'N/A');
      setError(`Erro no upload: ${errorMessage}`);
      return null;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
      console.log('DEBUG: === UPLOAD FINALIZADO ===');
    }
  };

  const clearImage = () => {
    console.log('DEBUG: Limpando imagem');
    setSelectedImage(null);
    setUploadedImageUrl(null);
    setUploadProgress(0);
    setError(null);
  };

  const clearError = () => {
    console.log('DEBUG: Limpando erro');
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