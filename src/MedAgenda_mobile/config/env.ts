import Constants from 'expo-constants';

interface EnvConfig {
  API_URL: string;
  API_TIMEOUT: number;
  IMAGE_BASE_URL: string;
}

type Environment = EnvConfig;

const ENV: { [key: string]: Environment } = {
  dev: {
    API_URL: 'https://med-agenda-backend.vercel.app/api',
    API_TIMEOUT: 15000,
    IMAGE_BASE_URL: 'https://med-agenda-backend.vercel.app/uploads'
  },
  development: {
    API_URL: 'https://med-agenda-backend.vercel.app/api',
    API_TIMEOUT: 15000,
    IMAGE_BASE_URL: 'https://med-agenda-backend.vercel.app/uploads'
  },
  staging: {
    API_URL: 'https://med-agenda-backend.vercel.app/api',
    API_TIMEOUT: 15000,
    IMAGE_BASE_URL: 'https://med-agenda-backend.vercel.app/uploads'
  },
  production: {
    API_URL: 'https://med-agenda-backend.vercel.app/api',
    API_TIMEOUT: 15000,
    IMAGE_BASE_URL: 'https://med-agenda-backend.vercel.app/uploads'
  }
};

const getEnvVars = (): EnvConfig => {
  const env = Constants.expoConfig?.extra?.env || 'development';
  return ENV[env] || ENV.development;
};

export default getEnvVars; 