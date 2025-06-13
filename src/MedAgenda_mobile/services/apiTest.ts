import api from './api';

/**
 * Test function to verify API connection
 * This can be called from your app to test if the backend is reachable
 */
export const testApiConnection = async (): Promise<boolean> => {
  try {
    // Test a simple endpoint to check if the API is reachable
    const response = await api.get('/health');
    console.log('API Connection Test - Success:', response.status);
    return true;
  } catch (error) {
    console.error('API Connection Test - Failed:', error);
    return false;
  }
};

/**
 * Test function to check available endpoints
 * This will help verify which endpoints are available on your backend
 */
export const testAvailableEndpoints = async () => {
  const endpoints = [
    '/health',
    '/doctors',
    '/doctors/specialties',
    '/auth/login',
    '/appointments'
  ];

  const results: { [key: string]: boolean } = {};

  for (const endpoint of endpoints) {
    try {
      const response = await api.get(endpoint);
      results[endpoint] = response.status === 200;
      console.log(`✅ ${endpoint}: Available`);
    } catch (error: any) {
      // 401 or 403 means the endpoint exists but requires auth
      if (error.response?.status === 401 || error.response?.status === 403) {
        results[endpoint] = true;
        console.log(`🔒 ${endpoint}: Available (requires auth)`);
      } else {
        results[endpoint] = false;
        console.log(`❌ ${endpoint}: Not available`);
      }
    }
  }

  return results;
};

export default {
  testApiConnection,
  testAvailableEndpoints
}; 