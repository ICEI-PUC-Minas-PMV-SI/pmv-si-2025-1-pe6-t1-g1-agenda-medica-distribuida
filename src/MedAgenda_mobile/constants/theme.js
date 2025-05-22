import { MD3LightTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF2D55',
  background: '#F2F2F7',
  text: '#000000',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FFCC00',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
};

// ... existing FONTS, SHADOWS, SIZES definitions ...

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    accent: COLORS.accent,
    background: COLORS.background,
    error: COLORS.error,
    text: COLORS.text,
  },
  fonts: {
    regular: FONTS.regular,
    medium: FONTS.medium,
    light: FONTS.regular,
    thin: FONTS.regular,
  },
};