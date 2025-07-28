import api from './api';
import { toast } from 'react-toastify';
import { POSTS_MESSAGES } from '../constants/serviceMessages';
import { jwtDecode } from 'jwt-decode';

// Helper function to handle post-related toast messages
const showPostToast = (message, isError = false) => {
    if (isError) {
        toast.error(message);
    } else {
        toast.success(message);
    }
};

const extractErrorMessage = (error) => {
    const errorData = error.response?.data;
    if (Array.isArray(errorData?.message)) {
        const validationErrors = errorData.message;
        if (validationErrors.length > 0) {
            return validationErrors[0].message;
        }
    }
    if (errorData?.message && typeof errorData.message === 'string') {
        return errorData.message;
    }

    if (errorData?.message && typeof errorData.message === 'object') {
        return errorData.message.message || errorData.message.msg || 'Validation error';
    }
    return error.message || 'An unexpected error occurred';
};

const postService = {
    /**
     * Create a new post
     * @param {object} postData - The data for the new post
     * @returns {Promise} - The created post data
     */
    createPost: async (postData) => {
        try {
            const response = await api.post('/posts', postData);
            showPostToast('Post created successfully!');
            return response.data;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            showPostToast(`Error creating post: ${errorMessage}`, true);
            throw error;
        }
    },

    /**
     * Get all posts
     * @param {object} params - Query parameters for filtering, pagination, etc.
     * @returns {Promise} - Array of posts
     */
    getAllPosts: async (params = {}) => {
        try {
            console.log('Fetching all posts with params:', params);
            const response = await api.get('/posts', { params });
            console.log('Posts API response:', response);
            return response.data;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            showPostToast(`Error fetching posts: ${errorMessage}`, true);
            console.error('Error in getAllPosts:', error);
            toast(` Error fetching posts: ${error.response?.data?.message || error.message}`);
            throw error;
        }
    },

    /**
     * Get post by ID
     * @param {string} id - Post ID
     * @returns {Promise} - Post details
     */
    getPostById: async (id) => {
        try {
            const token = localStorage.getItem("accessToken");

            let currentUserId = null;
            let currentUserRole = null;

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    currentUserId = decoded.userId || decoded.id || decoded.sub;
                    currentUserRole = decoded.role;
                } catch (decodeErr) {
                    console.warn("Invalid token:", decodeErr);
                }
            }

            const response = await api.get(`/posts/${id}`);
            const postData = response.data?.data || response.data;

            if (!postData) {
                throw new Error("Post not found.");
            }

            const isPending = postData.status === "PENDING" || postData.status === "UPDATING";
            const isOwner = currentUserId && postData.user_id === currentUserId;
            const isAdmin = currentUserRole === "admin";

            if (isPending && !isOwner && !isAdmin) {
                throw new Error("This post is pending approval and not visible to you.");
            }

            return postData;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            showPostToast(`Error fetching post: ${errorMessage}`, true);
            throw error;
        }
    },

    /**
     * Update an existing post
     * @param {string} id - Post ID
     * @param {object} postData - Updated post data
     * @returns {Promise} - Updated post data
     */
    updatePost: async (id, postData) => {
        try {
            const response = await api.patch(`/posts/${id}`, postData);
            showPostToast('Post updated successfully!');
            return response.data;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            showPostToast(`Error updating post: ${errorMessage}`, true);
            throw error;
        }
    },

    /**
     * Delete a post
     * @param {string} id - Post ID
     * @returns {Promise} - Result of deletion
     */
    deletePost: async (id) => {
        try {
            const response = await api.delete(`/posts/${id}`);
            showPostToast('Post deleted successfully!');
            return response.data;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            showPostToast(`Error deleting post: ${errorMessage}`, true);
            throw error;
        }
    },

    /**
     * Approve or reject a post (admin)
     * @param {string} id - Post ID
     * @param {object} data - { approved: true/false, ... }
     * @returns {Promise} - Result of approval
     */
    approvePost: async (id, data) => {
        try {
            const response = await api.post(`/posts/${id}/verify`, data);
            const statusMessage = data.status === 'APPROVED' ? 'approved' : 'rejected';
            showPostToast(`Post ${statusMessage} successfully!`);
            return response.data;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            showPostToast(`Error approving post: ${errorMessage}`, true);
            throw error;
        }
    },

    /**
     * Get comments for a post
     * @param {string} postId - Post ID
     * @returns {Promise} - Array of comments
     */
    getCommentsByPostId: async (postId) => {
        try {
            const response = await api.get(`/posts/${postId}/comments`);
            return response.data;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            showPostToast(`Error fetching comments: ${errorMessage}`, true);
            throw error;
        }
    },

    /**
     * Get reactions for a post
     * @param {string} postId - Post ID
     * @returns {Promise} - Array of reactions
     */
    getReactionsByPostId: async (postId) => {
        try {
            const response = await api.get(`/posts/${postId}/reactions`);
            return response.data;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            showPostToast(`Error fetching reactions: ${errorMessage}`, true);
            throw error;
        }
    }
};

export default postService;