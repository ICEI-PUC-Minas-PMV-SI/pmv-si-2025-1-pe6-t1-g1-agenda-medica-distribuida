interface Environment {
  API_URL: string;
  API_TIMEOUT: number;
  IMAGE_BASE_URL: string;
}

const ENV: { [key: string]: Environment } = {
  development: {
    API_URL: 'http://localhost:3000/api',
    API_TIMEOUT: 10000,
    IMAGE_BASE_URL: 'http://localhost:3000/uploads'
  },
  staging: {
    API_URL: 'https://staging-api.medagenda.com/api',
    API_TIMEOUT: 10000,
    IMAGE_BASE_URL: 'https://staging-api.medagenda.com/uploads'
  },
  production: {
    API_URL: 'https://api.medagenda.com/api',
    API_TIMEOUT: 10000,
    IMAGE_BASE_URL: 'https://api.medagenda.com/uploads'
  }
};

const getEnvVars = (preset: string = 'development'): Environment => {
  if (__DEV__) {
    return ENV.development;
  }
  return ENV[preset] || ENV.production;
};

export default getEnvVars; 