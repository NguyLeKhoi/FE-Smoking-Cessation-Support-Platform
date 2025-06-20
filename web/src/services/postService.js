import api from './api';
import { toast } from 'react-toastify';


const postService = {
    /**
     * Create a new post
     * @param {object} postData - The data for the new post
     * @returns {Promise} - The created post data
     */
    createPost: async (postData) => {
        try {
            const response = await api.post('/posts', postData);
            toast(` Post created successfully!`);
            return response.data;
        } catch (error) {
            toast(` Error creating post: ${error.response?.data?.message || error.message}`);
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
            const response = await api.get('/posts', { params });
            return response.data;
        } catch (error) {
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
            const response = await api.get(`/posts/${id}`);
            return response.data;
        } catch (error) {
            toast(` Error fetching post details: ${error.response?.data?.message || error.message}`);
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
            toast(` Post updated successfully!`);
            return response.data;
        } catch (error) {
            toast(` Error updating post: ${error.response?.data?.message || error.message}`);
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
            toast(` Post deleted successfully!`);
            return response.data;
        } catch (error) {
            toast(` Error deleting post: ${error.response?.data?.message || error.message}`);
            throw error;
        }
    }
};

export default postService;