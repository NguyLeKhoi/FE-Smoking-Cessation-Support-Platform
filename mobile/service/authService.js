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
    console.log('Attempting login with:', credentials.email);
    
    // Configure the request to include credentials (cookies)
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    }, {
      withCredentials: true // This is important for sending/receiving cookies
    });
    
    console.log('Login response:', response.status, response.data);
    
    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format from server');
    }
    
    const { user, accessToken } = response.data.data;
    
    // Store the access token if it's in the response
    if (accessToken) {
      await AsyncStorage.setItem('accessToken', accessToken);
      console.log('Access token stored');
    }
    
    // The refresh token should be in an HTTP-only cookie
    // Fetch complete user profile including permissions
    let userProfile = user;
    try {
      const profileResponse = await api.get('/users/me', { withCredentials: true });
      if (profileResponse.data && profileResponse.data.data) {
        userProfile = { ...user, ...profileResponse.data.data };
        console.log('User profile with permissions:', userProfile);
      }
    } catch (profileError) {
      console.warn('Could not fetch complete user profile, using basic info:', profileError);
    }
    
    // Save user data (without tokens)
    await AsyncStorage.setItem('user', JSON.stringify(userProfile));
    
    console.log('Login successful, user data saved');
    return { user: userProfile };
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Clear any partial data on login failure
    await AsyncStorage.removeItem('user');
    
    if (error.response) {
      throw new Error(error.response.data?.message || 'Login failed');
    }
    throw new Error(error.message || 'Network error');
  }
};

export const refreshToken = async () => {
    try {
        // Since we're using HTTP-only cookies, we don't need to handle the refresh token manually
        // The cookie will be sent automatically with withCredentials: true
        const response = await api.post('/auth/refresh', {}, { 
            withCredentials: true 
        });
        
        // The new access token should be in the response
        if (!response.data || !response.data.data) {
            throw new Error('Invalid response format from server');
        }
        
        const { accessToken } = response.data.data;
        
        if (!accessToken) {
            throw new Error('No access token received');
        }
        
        // Store the new access token
        await AsyncStorage.setItem('accessToken', accessToken);
        
        // Restart auto refresh with new token
        startAutoRefresh();
        
        return accessToken;
    } catch (error) {
        console.error('Token refresh failed:', error);
        // Clear user data on refresh failure
        await AsyncStorage.removeItem('user');
        throw new Error('Session expired. Please log in again.');
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

// Simple JWT decode function (client-side only, doesn't verify signature)
export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Configure axios to send credentials with all requests
api.defaults.withCredentials = true;

export const isAuthenticated = async () => {
  try {
    // First check if we have a user in AsyncStorage
    const userString = await AsyncStorage.getItem('user');
    if (!userString) {
      console.log('No user data found in storage');
      return false;
    }

    // Check if we have an access token
    let token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      console.log('No access token found');
      return false;
    }
    
    // Parse the JWT to check expiration
    const decoded = parseJwt(token);
    if (!decoded) {
      console.log('Invalid token format');
      await Promise.all([
        AsyncStorage.removeItem('accessToken'),
        AsyncStorage.removeItem('user')
      ]);
      return false;
    }
    
    // Check if token is expired or about to expire (within 5 minutes)
    const currentTime = Date.now() / 1000;
    const bufferTime = 300; // 5 minutes buffer
    
    if (decoded.exp < (currentTime + bufferTime)) {
      console.log('Token expired or about to expire, attempting refresh...');
      try {
        // Try to refresh the token using the HTTP-only cookie
        const response = await api.post('/auth/refresh', {}, { withCredentials: true });
        
        if (response.data && response.data.data && response.data.data.accessToken) {
          // Save new token
          const newToken = response.data.data.accessToken;
          await AsyncStorage.setItem('accessToken', newToken);
          console.log('Token refreshed successfully');
          return true;
        } else {
          throw new Error('No access token in refresh response');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        await Promise.all([
          AsyncStorage.removeItem('accessToken'),
          AsyncStorage.removeItem('user')
        ]);
        return false;
      }
    }
    
    // If we get here, the token is valid and not expired
    try {
      // Verify user data is valid
      const userData = JSON.parse(userString);
      if (!userData || !userData.id) {
        throw new Error('Invalid user data');
      }
      
      return true;
    } catch (e) {
      console.error('Invalid user data in storage:', e);
      await AsyncStorage.removeItem('user');
      return false;
    }
    
  } catch (error) {
    console.error('Authentication check failed:', error);
    await Promise.all([
      AsyncStorage.removeItem('accessToken'),
      AsyncStorage.removeItem('user')
    ]);
    return false;
  }
};

/**
 * Get the current user's complete profile including permissions
 * Fetches fresh data from the server to ensure we have the latest permissions
 * @returns {Promise<Object>} The complete user profile
 */
export const getCurrentUser = async () => {
  try {
    // First try to get the latest user data from the server
    try {
      const response = await api.get('/users/me');
      if (response.data && response.data.data) {
        // Update stored user data with fresh data from server
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
        console.log('Fetched fresh user profile:', response.data.data);
        return response.data.data;
      }
    } catch (serverError) {
      console.warn('Could not fetch fresh user profile, using cached data:', serverError);
    }
    
    // Fall back to cached user data if server fetch fails
    const userString = await AsyncStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    
    throw new Error('No user data available');
  } catch (error) {
    console.error('Error getting current user:', error);
    throw new Error('Failed to get user data: ' + error.message);
  }
};
