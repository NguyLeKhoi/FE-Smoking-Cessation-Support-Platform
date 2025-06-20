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