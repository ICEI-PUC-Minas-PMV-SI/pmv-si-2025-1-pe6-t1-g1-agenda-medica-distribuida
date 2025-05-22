import Constants from 'expo-constants';

interface EnvConfig {
  API_URL: string;
  API_TIMEOUT: number;
}

const ENV = {
  dev: {
    API_URL: 'http://192.168.2.13:3000/api', // IP da máquina local
    // API_URL: 'http://localhost:3000/api', // Para iOS Simulator
    API_TIMEOUT: 10000,
  },
  prod: {
    API_URL: 'https://med-agenda-backend.vercel.app/api',
    API_TIMEOUT: 10000,
  },
};

const getEnvVars = (): EnvConfig => {
  const env = Constants.expoConfig?.extra?.env || 'dev';
  return ENV[env];
};

export default getEnvVars; 