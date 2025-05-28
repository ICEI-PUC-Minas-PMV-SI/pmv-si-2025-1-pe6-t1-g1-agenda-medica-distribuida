import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#2196F3',
  secondary: '#03DAC6',
  accent: '#FF2D55',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  error: '#B00020',
  success: '#34C759',
  warning: '#FFCC00',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  border: '#E5E5EA',
} as const;

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
} as const;

export const SIZES = {
  base: 16,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
} as const;

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    error: COLORS.error,
    background: COLORS.background,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    error: COLORS.error,
    background: COLORS.background,
  },
};

const theme = {
  light: lightTheme,
  dark: darkTheme,
};

export default theme; 