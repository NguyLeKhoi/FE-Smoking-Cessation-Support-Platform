import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// Auto refresh token functionality
let refreshTokenTimer = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

const setRefreshTokenTimer = (expiresIn) => {
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer);
  }
  
  // Refresh token 5 minutes before it expires
  const refreshTime = (expiresIn - 300) * 1000; // Convert to milliseconds
  
  refreshTokenTimer = setTimeout(async () => {
    try {
      await refreshAccessToken();
    } catch (error) {
      // Handle failed auto refresh
      handleRefreshFailure();
    }
  }, refreshTime);
};

const refreshAccessToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Mobile uses refresh token in request body
    const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
    const { accessToken, expiresIn } = response.data.data;
    
    if (accessToken) {
      await AsyncStorage.setItem('accessToken', accessToken);
      
      // Set up next auto refresh
      if (expiresIn) {
        setRefreshTokenTimer(expiresIn);
      }
      
      processQueue(null, accessToken);
      return accessToken;
    } else {
      throw new Error('No access token in response');
    }
  } catch (error) {
    processQueue(error, null);
    throw error;
  } finally {
    isRefreshing = false;
  }
};

const handleRefreshFailure = async () => {
  // Clear tokens
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
  
  // Clear any pending refresh timer
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer);
    refreshTokenTimer = null;
  }
  
  // Note: Navigation to login should be handled by the app's navigation logic
  // This function just clears the tokens
};

// Initialize auto refresh on app start
const initializeAutoRefresh = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  
  if (accessToken) {
    try {
      // Decode JWT to get expiration time
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
      
      // For now, mobile will use access token only
      // Auto refresh is disabled until backend supports refresh token for mobile
      console.log('Mobile: Access token expires in', expiresIn, 'seconds');
      
      if (expiresIn <= 0) { // Token already expired
        handleRefreshFailure();
      }
    } catch (error) {
      handleRefreshFailure();
    }
  }
};

// Request interceptor
api.interceptors.request.use(async (config) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // For mobile, don't clear tokens immediately on 401
      // Let the UI handle the error gracefully
      console.log('Mobile: 401 error detected, letting UI handle');
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

// Debug function to check token status
export const debugTokenStatus = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  
  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
      console.log('Mobile: Access token expires in', expiresIn, 'seconds');
    } catch (error) {
      console.log('Mobile: Error parsing token');
    }
  } else {
    console.log('Mobile: No access token found');
  }
};

// Test access token function for mobile
export const testRefreshToken = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (!accessToken) {
      return false;
    }
    
    // For now, just check if access token exists and is valid
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
    
    return expiresIn > 0; // Token is valid if not expired
  } catch (error) {
    return false;
  }
};

// Export functions for manual token management
export const startAutoRefresh = initializeAutoRefresh;
export const stopAutoRefresh = () => {
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer);
    refreshTokenTimer = null;
  }
};

export default api; 