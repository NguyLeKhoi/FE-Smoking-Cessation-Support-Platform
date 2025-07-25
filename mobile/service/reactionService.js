import api from './api';
import { Alert } from 'react-native';

/**
 * Reaction service for handling post and comment reactions
 * Matches the web implementation's API structure exactly
 */
const reactionService = {
  /**
   * Get reactions for a specific post
   * @param {string} postId - ID of the post
   * @returns {Promise<Array>} - Array of reactions
   */
  getReactionsByPostId: async (postId) => {
    try {
      if (!postId) {
        throw new Error('Post ID is required');
      }
      
      const response = await api.get(`/posts/${postId}/reactions`);
      
      // Handle different response formats
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data; // Return the array of reactions
      } else if (Array.isArray(response.data)) {
        return response.data; // Direct array response
      } else if (response.data && Array.isArray(response.data.reactions)) {
        return response.data.reactions; // Handle reactions property
      }
      
      return []; // Return empty array if no reactions
    } catch (error) {
      console.error('Error fetching reactions:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load reactions';
      throw new Error(errorMessage);
    }
  },

  /**
   * Add a reaction to a post or comment
   * @param {object} reactionData - The reaction data
   * @param {string} reactionData.type - Type of reaction (e.g., 'LIKE', 'LOVE')
   * @param {string} [reactionData.postId] - The post ID (required if not a comment reaction)
   * @param {string} [reactionData.commentId] - The comment ID (required if not a post reaction)
   * @returns {Promise<object>} The created reaction
   */
  createReaction: async (reactionData) => {
    console.log('Creating reaction with data:', JSON.stringify(reactionData, null, 2));
    
    try {
      if (!reactionData.type) {
        const error = new Error('Reaction type is required');
        console.error('Reaction creation failed:', error.message);
        throw error;
      }
      
      // Prepare the payload with the required fields
      const payload = {
        type: reactionData.type.toUpperCase()
      };
      
      // Add ref_id based on what's provided (matching web implementation)
      if (reactionData.post_id || reactionData.postId) {
        payload.ref_id = reactionData.post_id || reactionData.postId;
      } else if (reactionData.comment_id || reactionData.commentId) {
        payload.ref_id = reactionData.comment_id || reactionData.commentId;
      } else {
        const error = new Error('Either post_id or comment_id must be provided');
        console.error('Reaction creation failed:', error.message);
        throw error;
      }
      
      console.log('Sending reaction payload:', JSON.stringify(payload, null, 2));
      const response = await api.post('/reactions', payload);
      console.log('Reaction created successfully:', response.data);
      
      // Return the full response data
      return response.data;
    } catch (error) {
      console.error('Error creating reaction:', error);
      throw error;
    }
  },

  /**
   * Remove a reaction
   * @param {string} reactionId - The ID of the reaction to remove
   * @returns {Promise<boolean>} True if removal was successful
   */
  deleteReaction: async (reactionId) => {
    console.log(`Deleting reaction with ID: ${reactionId}`);
    try {
      const response = await api.delete(`/reactions/${reactionId}`);
      console.log('Reaction deleted successfully:', response.data);
      return true;
    } catch (error) {
      console.error('Error removing reaction:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      throw error; // Re-throw to be handled by the caller
    }
  },

  /**
   * Toggle a reaction on a post or comment
   * This is a convenience method that handles both adding and removing reactions
   * @param {object} options - The reaction options
   * @param {string} options.type - Type of reaction (e.g., 'LIKE', 'LOVE')
   * @param {string} [options.postId] - The post ID (required if not a comment reaction)
   * @param {string} [options.commentId] - The comment ID (required if not a post reaction)
   * @param {string} [options.currentReactionId] - The current reaction ID if one exists
   * @returns {Promise<object>} The updated reaction state
   */
  toggleReaction: async ({ type, postId, commentId, currentReactionId }) => {
    try {
      // Validate input
      if (!type) {
        throw new Error('Reaction type is required');
      }
      
      // If user already has a reaction, remove it
      if (currentReactionId) {
        await reactionService.deleteReaction(currentReactionId);
        return { reaction: null, action: 'removed' };
      }
      
      // Create a new reaction with the correct payload format
      const reactionData = { 
        type: type.toUpperCase()
      };
      
      // Set the reference based on what's provided
      if (postId) {
        reactionData.ref_id = postId;
      } else if (commentId) {
        reactionData.ref_id = commentId;
      } else {
        throw new Error('Either postId or commentId must be provided');
      }
      
      const newReaction = await reactionService.createReaction(reactionData);
      return { 
        reaction: newReaction, 
        action: 'added',
        id: newReaction.id,
        type: newReaction.type
      };
      
    } catch (error) {
      console.error('Error toggling reaction:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update reaction';
      throw new Error(errorMessage);
    }
  }
};

export default reactionService;
