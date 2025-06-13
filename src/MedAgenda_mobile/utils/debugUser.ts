import AsyncStorage from '@react-native-async-storage/async-storage';

export const debugUserData = async () => {
  try {
    console.log('🔍 === DEBUG USER DATA ===');
    
    const storedUser = await AsyncStorage.getItem('user');
    const storedToken = await AsyncStorage.getItem('authToken');
    
    console.log('📦 Raw stored user:', storedUser);
    console.log('🔑 Token exists:', !!storedToken);
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('👤 Parsed user object:', parsedUser);
      console.log('🔒 isAdmin value:', parsedUser.isAdmin);
      console.log('🔒 isAdmin type:', typeof parsedUser.isAdmin);
      console.log('🔒 isAdmin === true:', parsedUser.isAdmin === true);
      console.log('🔒 isAdmin == true:', parsedUser.isAdmin == true);
    }
    
    console.log('🔍 === END DEBUG ===');
  } catch (error) {
    console.error('❌ Error debugging user data:', error);
  }
};

export const clearUserCache = async () => {
  try {
    console.log('🧹 Clearing user cache...');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('authToken');
    console.log('✅ User cache cleared');
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
};

export const forceUserRefresh = async () => {
  console.log('🔄 Forcing user refresh...');
  await clearUserCache();
  // Usuário precisará fazer login novamente
}; 