import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
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
    const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
      withCredentials: true // Include cookies
    });
    
    const { accessToken } = response.data.data;
    
    if (accessToken) {
      await AsyncStorage.setItem('accessToken', accessToken);
      
      // Set up next auto refresh (5 minutes before expiry)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
      if (expiresIn > 300) {
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          // If no new token, clear auth data
          await Promise.all([
            AsyncStorage.removeItem('accessToken'),
            AsyncStorage.removeItem('user')
          ]);
          return Promise.reject(new Error('Session expired. Please log in again.'));
        }
      } catch (refreshError) {
        // If refresh fails, clear auth data
        await Promise.all([
          AsyncStorage.removeItem('accessToken'),
          AsyncStorage.removeItem('user')
        ]);
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

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
  // Get the access token from storage
  const accessToken = await AsyncStorage.getItem('accessToken');
  
  // If we have an access token, add it to the request
  if (accessToken) {
    // For mobile, we'll send the access token in the Authorization header
    // The refresh token will be sent automatically via cookies (withCredentials: true)
    config.headers.Authorization = `Bearer ${accessToken}`;
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