import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';
import { DEMO_IMAGES } from '../config/upload';
import { COLORS } from '../constants/theme';

interface DoctorImageProps {
  imageUrl?: string;
  doctorName?: string;
  size?: number;
  index?: number;
  style?: ImageStyle;
}

export default function DoctorImage({ 
  imageUrl, 
  doctorName = 'Médico', 
  size = 60, 
  index = 0,
  style 
}: DoctorImageProps) {
  // Usar imagem do médico ou uma imagem demo como fallback
  const defaultImage = DEMO_IMAGES[index % DEMO_IMAGES.length];
  const finalImageUrl = imageUrl || defaultImage;

  const imageStyle = [
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: COLORS.border,
    },
    style
  ];

  return (
    <Image 
      source={{ uri: finalImageUrl }} 
      style={imageStyle}
      onError={() => {
        console.log('Erro ao carregar imagem do médico:', doctorName);
      }}
    />
  );
} 