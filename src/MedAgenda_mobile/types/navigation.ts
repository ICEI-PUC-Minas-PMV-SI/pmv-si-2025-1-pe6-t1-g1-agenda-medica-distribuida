export type RootStackParamList = {
  '/(tabs)': undefined;
  '/(tabs)/home': undefined;
  '/(tabs)/doctors': undefined;
  '/(tabs)/appointments': undefined;
  '/(tabs)/profile': undefined;
  '/booking/[doctorId]': { doctorId: string };
  '/login': undefined;
  '/register': undefined;
  '/forgot-password': undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 