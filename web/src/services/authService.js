import api from './api';
import { getUserById } from './userService';

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', { email: credentials.email, password: credentials.password });
    const { accessToken, refreshToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    // Fetch user info after login and store userId
    let userId = null;
    try {
      // Decode JWT to get userId if available, otherwise fetch from /users/me or /users/{id}
      // Here, we assume you have a way to get the userId, e.g., from /users/me or /users/{id}
      // If you have a /users/me endpoint, you can use it here instead of getUserById
      // For now, let's assume you have to fetch it from /users/me
      const userInfo = await api.get('/users/me');
      userId = userInfo.data?.id;
      if (userId) {
        localStorage.setItem('userId', userId);
      }
    } catch (e) {
      // fallback or log error
      console.error('Failed to fetch user info after login:', e);
    }
    return response.data.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Network error');
  }
};

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

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await api.post('/auth/refresh', { refreshToken });
    const { accessToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw new Error('Failed to refresh token');
  }
};

export const logout = async () => {
  try {
    // Call the backend logout API
    await api.post('/auth/logout');
    console.log('Backend logout successful.');
  } catch (error) {
    console.error('Error calling backend logout API:', error);
    // Continue with frontend logout even if backend call fails
    // This might happen if the token is already invalid
  }
  // Clear frontend tokens regardless of backend call success
  localStorage.removeItem('accessToken');
  console.log('Frontend tokens cleared.');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error('Failed to get user data');
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

// Coach Service
export const sendCoachCode = async ({ email, callbackUrl }) => {
  try {
    const response = await api.post('/coach/send-code', { email, callbackUrl });
    return response.data;
  } catch (error) {
    if (error.response) throw error.response.data.message || 'Send code failed';
    throw new Error('Network error');
  }
};

export const registerCoach = async (coachData) => {
  try {
    const response = await api.post('/coach/coach-register', coachData);
    return response.data;
  } catch (error) {
    if (error.response) throw error.response.data.message || 'Register coach failed';
    throw new Error('Network error');
  }
}; 