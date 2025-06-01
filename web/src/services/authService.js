import api from './api';

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', { email: credentials.email, password: credentials.password });
    const { accessToken, refreshToken } = response.data.data;
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
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