import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const signup = async ({ username, email, password, first_name, last_name, birth_date, phone_number }) => {
  try {
    const response = await api.post('/auth/signup', {
      username,
      email,
      password,
      first_name,
      last_name,
      birth_date,
      phone_number
    });
    return response.data;
  } catch (error) {
    console.error('Signup error:', error.response?.data || error);
    throw error;
  }
};

export const login = async (email, password) => {
    try {
        console.log('Login attempt:', email, password);
        const response = await api.post('/auth/login', { email, password });
        const { accessToken, refreshToken } = response.data.data;
        await AsyncStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
            await AsyncStorage.setItem('refreshToken', refreshToken);
        }
        return { accessToken, refreshToken };
    } catch (error) {
        console.log('Login error:', error.response?.data || error);
        throw new Error('Failed to log in');
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
        // Just clear the tokens without calling the API
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        return true;
    } catch (error) {
        console.error('Error logging out:', error);
        throw new Error('Failed to logout');
    }
};

export const forgotPassword = async (email) => {
  try {
    console.log('Requesting password reset link for email:', email);
    const response = await api.post('/auth/forgot-password', { email });
    console.log('Forgot password response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to request password reset link');
  }
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  try {
    console.log('Resetting password with token:', token);
    const response = await api.post('/auth/reset-password', { token, newPassword, confirmPassword });
    console.log('Reset password response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

export const getGoogleLoginUrl = async () => {
  try {
    console.log("Attempting to get Google login URL from backend");
    const response = await api.get('/auth/google');
    console.log("Received response from Google login URL endpoint:", response.data);
    return response.data.url || response.data;
  } catch (error) {
    console.error('Error fetching Google login URL:', error.response?.data || error.message);
    throw new Error('Failed to get Google login URL');
  }
};

export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
