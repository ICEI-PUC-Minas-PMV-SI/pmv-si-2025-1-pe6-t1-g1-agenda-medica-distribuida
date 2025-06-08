import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#1F2937',
  secondary: '#3B82F6',
  accent: '#10B981',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6B7280',
  border: '#E5E7EB',
  cardBackground: '#FFFFFF',
  headerBackground: '#1F2937',
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