export const API_BASE_URL = "http://localhost:5000/";

// App constants
export const APP_ICON = "/flower.svg";

export const config = {
  API_BASE_URL: 'http://localhost:5000/',
  API_TIMEOUT: 10000,
  
  // Token storage keys
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_ROLE_KEY: 'user.role',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/logout',
    },
    CATEGORY: '/api/category',
    PRODUCT: '/api/product',
    ORDER: '/api/order',
    USER: '/api/user',
  }
};