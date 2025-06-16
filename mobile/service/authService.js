import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

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
    const { accessToken, refreshToken } = response.data.data;
    await AsyncStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      await AsyncStorage.setItem('refreshToken', refreshToken);
    }
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
        const { accessToken } = response.data.data;
        await AsyncStorage.setItem('accessToken', accessToken);
        return accessToken;
    } catch (error) {
        console.error('Error refreshing token:', error.response?.data || error);
        throw new Error('Failed to refresh token');
    }
};

export const logout = async () => {
  try {
    // Attempt to call the backend logout API
    await api.post('/auth/logout');
  } catch (error) {
    // Log the error but continue to clear local tokens
    console.error('Error calling backend logout API:', error);
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
