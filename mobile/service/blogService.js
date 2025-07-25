// blogService.js
// Service for blog functionality on mobile 

import api from './api';
import { isAuthenticated } from './authService';

const blogService = {
  /**
   * Get all blog posts
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Response data
   */
  getAllPosts: async (params = {}) => {
    try {
      const response = await api.get('/posts', { 
        params,
        withCredentials: true // Ensure cookies are sent
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  /**
   * Get post by ID
   * @param {string} id - Post ID
   * @returns {Promise<Object>} Post data
   */
  getPostById: async (id) => {
    try {
      // First check if user is authenticated
      const authenticated = await isAuthenticated();
      
      const response = await api.get(`/posts/${id}`, {
        withCredentials: true // Ensure cookies are sent
      });
      
      // Handle different response formats
      if (response.data && response.data.data) {
        return response.data.data; // Standard API response format
      }
      return response.data; // Direct data format
    } catch (error) {
      console.error('Error fetching post:', error);
      // Return a consistent structure even on error
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('You need to log in to view this content');
        }
        throw new Error(error.response.data?.message || 'Failed to load post');
      }
      throw new Error('Network error. Please check your connection.');
    }
  },

  /**
   * Create a new post
   * @param {Object} postData - Post data
   * @returns {Promise<Object>} Created post data
   */
  createPost: async (postData) => {
    try {
      const response = await api.post('/posts', postData, {
        withCredentials: true // Ensure cookies are sent
      });
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  /**
   * Update a post
   * @param {string} id - Post ID
   * @param {Object} postData - Updated post data
   * @returns {Promise<Object>} Updated post data
   */
  updatePost: async (id, postData) => {
    try {
      const response = await api.patch(`/posts/${id}`, postData, {
        withCredentials: true // Ensure cookies are sent
      });
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  /**
   * Delete a post
   * @param {string} id - Post ID to delete
   * @returns {Promise<boolean>} True if successful
   */
  deletePost: async (id) => {
    try {
      const response = await api.delete(`/posts/${id}`, {
        withCredentials: true // Ensure cookies are sent
      });
      return response.status === 200 || response.status === 204;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },
};

export default blogService;