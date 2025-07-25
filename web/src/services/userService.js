import api from './api';
import { toast } from 'react-toastify';

/**
 * Fetch the current user's profile information
 * @returns {Promise} Promise that resolves to user data
 */
export const fetchCurrentUser = async () => {
    try {
        const response = await api.get('/users/me');
        console.log('User data received:', response.data);
        return response.data;
    } catch (error) {
        toast(`Error fetching your profile: ${error.response?.data?.message || error.message}`);
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

/**
 * Fetch the current user's posts
 * @returns {Promise} Promise that resolves to array of user posts
 */
export const fetchCurrentUserPosts = async () => {
    try {
        const response = await api.get('/users/me/posts');
        console.log('Current user posts received:', response.data);
        return response.data;
    } catch (error) {
        toast(`Error fetching your posts: ${error.response?.data?.message || error.message}`);
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

/**
 * Fetch all users
 * @returns {Promise} Promise that resolves to array of user data
 */
export const getAllUsers = async () => {
    try {
        const response = await api.get('/users');
        console.log('All users received:', response.data);
        return response.data;
    } catch (error) {
        toast(`Error fetching users: ${error.response?.data?.message || error.message}`);
        console.error('Error fetching all users:', error);
        throw error;
    }
};

/**
 * Get user by ID
 * @param {string} userId - The ID of the user to fetch
 * @returns {Promise} Promise that resolves to user data
 */
export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        throw error;
    }
};

/**
 * Update the current user's profile information
 * @param {Object} userData - Updated user data
 * @returns {Promise} Promise that resolves to updated user data
 */
export const updateCurrentUser = async (userData) => {
    try {
        const response = await api.patch('/users/me', userData);
        toast(`Profile updated successfully!`);
        return response.data;
    } catch (error) {
        toast(`Error updating your profile: ${error.response?.data?.message || error.message}`);
        console.error('Error updating user profile:', error);
        throw error;
    }
};

