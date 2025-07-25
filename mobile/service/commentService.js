import api from './api';
import { Alert } from 'react-native';

/**
 * Comment service for handling comment-related API calls
 * Matches the web implementation's API structure exactly
 */
const commentService = {
  /**
   * Get comments for a specific post
   * @param {string} postId - ID of the post
   * @returns {Promise<Array>} - Array of comments
   */
  getCommentsByPostId: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      // Match web's response format
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  /**
   * Create a new comment
   * @param {object} commentData - The comment data
   * @param {string} commentData.content - The comment content
   * @param {string} commentData.postId - The post ID
   * @param {string} [commentData.parentId] - Optional parent comment ID for replies
   * @returns {Promise<object>} The created comment
   */
  createComment: async (commentData) => {
    try {
      // Validate required fields
      if (!commentData.content || !commentData.content.trim()) {
        throw new Error('Comment content is required');
      }
      if (!commentData.postId) {
        throw new Error('Post ID is required');
      }
      
      // Prepare payload matching web implementation
      const payload = {
        content: commentData.content.trim(),
        post_id: commentData.postId
      };
      
      // Only include parent_comment_id if it exists and is not null/undefined
      if (commentData.parentId) {
        payload.parent_comment_id = commentData.parentId;
      }
      
      const response = await api.post('/comments', payload);
      
      // Handle different response formats
      if (response.data && response.data.data) {
        return response.data.data; // Standard API response format
      }
      return response.data; // Direct data format
    } catch (error) {
      console.error('Error creating comment:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create comment';
      throw new Error(errorMessage);
    }
  },

  /**
   * Delete a comment
   * @param {string} commentId - The ID of the comment to delete
   * @returns {Promise<boolean>} True if deletion was successful
   */
  deleteComment: async (commentId) => {
    console.log(`Attempting to delete comment with ID: ${commentId}`);
    
    if (!commentId) {
      const error = new Error('Comment ID is required');
      console.error('Validation error:', error.message);
      throw error;
    }
    
    try {
      console.log(`Sending DELETE request to /comments/${commentId}`);
      const response = await api.delete(`/comments/${commentId}`);
      
      // Log successful response
      console.log(`Comment ${commentId} deleted successfully`, {
        status: response.status,
        data: response.data
      });
      
      return true;
      
    } catch (error) {
      console.error('Error in deleteComment:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        },
        stack: error.stack
      });
      
      // Handle specific error statuses
      if (error.response?.status === 401) {
        throw new Error('You are not authorized to delete this comment. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to delete this comment.');
      } else if (error.response?.status === 404) {
        throw new Error('Comment not found or already deleted.');
      } else if (error.response?.data?.message) {
        // Use server-provided error message if available
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to delete comment. Please try again later.');
      }
    }
  }
};

export default commentService;
