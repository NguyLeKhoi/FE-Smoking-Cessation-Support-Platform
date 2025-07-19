import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
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
      console.error('Auto refresh token failed:', error);
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
      localStorage.setItem('accessToken', accessToken);
      
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

const handleRefreshFailure = () => {
  // Disconnect socket if it exists
  const socketInstance = window.socketInstance;
  if (socketInstance && socketInstance.connected) {
    socketInstance.disconnect();
  }
  
  // Clear any pending refresh timer
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer);
    refreshTokenTimer = null;
  }
  
  // Clear tokens and redirect to login
  localStorage.removeItem('accessToken');
  
  window.location.href = '/login';
};

// Initialize auto refresh on app start
const initializeAutoRefresh = () => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (accessToken) {
    try {
      // Decode JWT to get expiration time
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
      
      if (expiresIn > 300) { // If token expires in more than 5 minutes
        setRefreshTokenTimer(expiresIn);
      } else if (expiresIn > 0) { // If token expires soon, refresh immediately
        refreshAccessToken().catch(handleRefreshFailure);
      } else { // Token already expired
        handleRefreshFailure();
      }
    } catch (error) {
      handleRefreshFailure();
    }
  }
};

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

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
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        handleRefreshFailure();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Debug function to check token status
export const debugTokenStatus = () => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresIn = payload.exp - Math.floor(Date.now() / 1000);
      console.log('Token expires in:', expiresIn, 'seconds');
    } catch (error) {
      console.log('Error parsing token:', error);
    }
  }
};

// Test refresh token function
export const testRefreshToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
      withCredentials: true // Include cookies
    });
    
    if (response.data.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      return true;
    } else {
      return false;
    }
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

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.debugTokenStatus = debugTokenStatus;
  window.testRefreshToken = testRefreshToken;
  window.startAutoRefresh = startAutoRefresh;
  window.stopAutoRefresh = stopAutoRefresh;
}

export default api; 