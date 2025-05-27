import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
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
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Implement your refresh token logic here
        // Example: const refreshToken = await AsyncStorage.getItem('refreshToken');
        // const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        // if (response.data.accessToken) {
        //   await AsyncStorage.setItem('token', response.data.accessToken);
        //   originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        //   return api(originalRequest);
        // }
      } catch (refreshError) {
        await AsyncStorage.removeItem('token');
        // Optionally navigate to login screen
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 