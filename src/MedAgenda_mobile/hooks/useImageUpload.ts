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
    console.log('🔍 [useImageUpload] === INICIANDO VALIDAÇÃO ULTRA PERMISSIVA ===');
    console.log('🔍 [useImageUpload] Asset completo recebido:', JSON.stringify(imageAsset, null, 2));
    
    try {
      // Verificar se o asset é válido
      if (!imageAsset || !imageAsset.uri) {
        const errorMsg = 'Asset de imagem inválido ou URI ausente';
        console.error('❌ [useImageUpload] Asset inválido:', errorMsg);
        setError(errorMsg);
        return false;
      }

      // Verificar tamanho do arquivo (se disponível)
      if (imageAsset.fileSize && imageAsset.fileSize > UPLOAD_CONFIG.maxFileSize) {
        const maxSizeMB = Math.round(UPLOAD_CONFIG.maxFileSize / (1024 * 1024));
        const fileSizeMB = Math.round(imageAsset.fileSize / (1024 * 1024));
        const errorMsg = `Arquivo muito grande (${fileSizeMB}MB). Tamanho máximo: ${maxSizeMB}MB`;
        console.error('❌ [useImageUpload] Arquivo muito grande:', errorMsg);
        setError(errorMsg);
        return false;
      }

      // VALIDAÇÃO ULTRA PERMISSIVA: Se veio do ImagePicker, é válido!
      console.log('✅ [useImageUpload] VALIDAÇÃO ULTRA PERMISSIVA ATIVADA');
      console.log('✅ [useImageUpload] Imagem do ImagePicker sempre aceita');
      console.log('✅ [useImageUpload] URI da imagem:', imageAsset.uri);
      console.log('✅ [useImageUpload] Tipo original (se disponível):', imageAsset.type);
      console.log('🔍 [useImageUpload] === VALIDAÇÃO CONCLUÍDA COM SUCESSO TOTAL ===');
      
      return true; // SEMPRE ACEITAR!
      
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