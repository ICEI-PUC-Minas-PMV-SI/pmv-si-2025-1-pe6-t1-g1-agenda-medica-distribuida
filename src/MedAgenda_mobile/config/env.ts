interface Environment {
  API_URL: string;
  API_TIMEOUT: number;
  IMAGE_BASE_URL: string;
  FALLBACK_API_URL?: string;
}

const ENV: { [key: string]: Environment } = {
  development: {
    API_URL: 'https://med-agenda-backend.vercel.app/api',
    FALLBACK_API_URL: 'http://localhost:3000/api',
    API_TIMEOUT: 15000,
    IMAGE_BASE_URL: 'https://med-agenda-backend.vercel.app/uploads'
  },
  staging: {
    API_URL: 'https://med-agenda-backend.vercel.app/api',
    FALLBACK_API_URL: 'http://localhost:3000/api',
    API_TIMEOUT: 15000,
    IMAGE_BASE_URL: 'https://med-agenda-backend.vercel.app/uploads'
  },
  production: {
    API_URL: 'https://med-agenda-backend.vercel.app/api',
    API_TIMEOUT: 15000,
    IMAGE_BASE_URL: 'https://med-agenda-backend.vercel.app/uploads'
  }
};

const getEnvVars = (preset: string = 'development'): Environment => {
  if (__DEV__) {
    return ENV.development;
  }
  return ENV[preset] || ENV.production;
};

export default getEnvVars; 