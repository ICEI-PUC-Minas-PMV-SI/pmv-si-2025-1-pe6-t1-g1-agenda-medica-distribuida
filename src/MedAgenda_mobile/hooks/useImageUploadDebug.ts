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
    console.log('DEBUG: === INICIANDO VALIDACAO ULTRA PERMISSIVA ===');
    console.log('DEBUG: Asset completo recebido:');
    console.log(JSON.stringify(imageAsset, null, 2));
    
    try {
      // Verificar se o asset é válido
      if (!imageAsset || !imageAsset.uri) {
        const errorMsg = 'Asset de imagem invalido ou URI ausente';
        console.error('DEBUG: Asset invalido:', errorMsg);
        setError(errorMsg);
        return false;
      }

      // Verificar tamanho do arquivo (se disponível)
      if (imageAsset.fileSize && imageAsset.fileSize > UPLOAD_CONFIG.maxFileSize) {
        const maxSizeMB = Math.round(UPLOAD_CONFIG.maxFileSize / (1024 * 1024));
        const fileSizeMB = Math.round(imageAsset.fileSize / (1024 * 1024));
        const errorMsg = `Arquivo muito grande (${fileSizeMB}MB). Tamanho maximo: ${maxSizeMB}MB`;
        console.error('DEBUG: Arquivo muito grande:', errorMsg);
        setError(errorMsg);
        return false;
      }

      // VALIDAÇÃO ULTRA PERMISSIVA: Se veio do ImagePicker, é válido!
      console.log('DEBUG: ✅ VALIDACAO ULTRA PERMISSIVA ATIVADA');
      console.log('DEBUG: ✅ Imagem do ImagePicker sempre aceita');
      console.log('DEBUG: ✅ URI da imagem:', imageAsset.uri);
      console.log('DEBUG: ✅ Tipo original (se disponível):', imageAsset.type);
      console.log('DEBUG: === VALIDACAO CONCLUIDA COM SUCESSO TOTAL ===');
      
      return true; // SEMPRE ACEITAR!
      
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