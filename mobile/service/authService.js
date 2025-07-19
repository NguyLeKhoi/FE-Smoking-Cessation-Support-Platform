import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { startAutoRefresh, stopAutoRefresh } from './api';

export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error;
    }
    throw new Error('Network error');
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    const { accessToken, refreshToken, expiresIn } = response.data.data;
    
    // Save access token
    await AsyncStorage.setItem('accessToken', accessToken);
    
    // Mobile needs refresh token in AsyncStorage
    if (refreshToken) {
      await AsyncStorage.setItem('refreshToken', refreshToken);
    } else {
      // If backend doesn't return refresh token, we need to handle this
      throw new Error('Backend must return refresh token for mobile');
    }
    
    // Start auto refresh after successful login
    startAutoRefresh();
    
    return response.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Network error');
  }
};

export const refreshToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');
        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken, expiresIn } = response.data.data;
        await AsyncStorage.setItem('accessToken', accessToken);
        
        // Restart auto refresh with new token
        startAutoRefresh();
        
        return accessToken;
    } catch (error) {
        throw new Error('Failed to refresh token');
    }
};

export const logout = async () => {
  try {
    // Stop auto refresh before logout
    stopAutoRefresh();
    
    // Attempt to call the backend logout API
    await api.post('/auth/logout');
  } catch (error) {
    // Continue to clear local tokens regardless of backend call success or failure
  } finally {
    // Clear frontend tokens regardless of backend call success or failure
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  }
};

export const forgotPassword = async (emailData) => {
  try {
    const response = await api.post('/auth/forgot-password', emailData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message || 'Forgot password request failed';
    }
    throw new Error('Network error');
  }
};

export const resetPassword = async (resetData) => {
  try {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data.message || 'Password reset failed';
    }
    throw new Error('Network error');
  }
};

export const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  return !!token;
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error('Failed to get user data');
  }
};
