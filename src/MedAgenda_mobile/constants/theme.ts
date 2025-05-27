import { extendTheme } from 'native-base';

export const THEME = extendTheme({
  colors: {
    primary: {
      50: '#E3F2F9',
      100: '#C5E4F3',
      200: '#A2D4EC',
      300: '#7AC1E4',
      400: '#47A9DA',
      500: '#0088CC',
      600: '#007AB8',
      700: '#006BA1',
      800: '#005885',
      900: '#003F5E',
    },
    secondary: {
      50: '#E5E7EB',
      100: '#D1D5DB',
      200: '#9CA3AF',
      300: '#6B7280',
      400: '#4B5563',
      500: '#374151',
      600: '#1F2937',
      700: '#111827',
      800: '#0F172A',
      900: '#0A0F1A',
    },
    error: {
      500: '#EF4444',
    },
    success: {
      500: '#10B981',
    },
  },
  fontConfig: {
    Roboto: {
      400: {
        normal: 'Roboto_400Regular',
      },
      500: {
        normal: 'Roboto_500Medium',
      },
      700: {
        normal: 'Roboto_700Bold',
      },
    },
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
  },
  config: {
    initialColorMode: 'light',
  },
});

export type CustomThemeType = typeof THEME; 