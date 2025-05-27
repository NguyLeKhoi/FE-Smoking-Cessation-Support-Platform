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
    throw new Error(error.response?.data?.message || 'Failed to sign up');
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
        const token = await AsyncStorage.getItem('accessToken');
        console.log('Access token before logout:', token);
        await api.post('/auth/logout');
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        return true;
    } catch (error) {
        console.error('Error logging out:', error.response?.data || error);
        throw new Error(error.response?.data?.message || 'Failed to logout');
    }
};
