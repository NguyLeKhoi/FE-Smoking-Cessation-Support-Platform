import api from './api';
import { toast } from 'react-toastify';

const achievementsService = {
    /**
     * Get all achievements
     * @returns {Promise} - Resolves to an array of achievements
     */
    getAllAchievements: async () => {
        try {
            const response = await api.get('/achievements');
            return response.data;
        } catch (error) {
            toast(`Error fetching achievements: ${error.response?.data?.message || error.message}`);
            console.error('Error fetching achievements:', error);
            throw error;
        }
    },

    /**
     * Get a specific achievement by ID
     * @param {string} id - Achievement ID
     * @returns {Promise} - Resolves to achievement details
     */
    getAchievementById: async (id) => {
        try {
            const response = await api.get(`/achievements/${id}`);
            return response.data;
        } catch (error) {
            toast(`Error fetching achievement: ${error.response?.data?.message || error.message}`);
            console.error(`Error fetching achievement with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Get achievements for a specific user by ID
     * @param {string} userId - User ID
     * @returns {Promise} - Resolves to user's achievements
     */
    getUserAchievementsById: async (userId) => {
        try {
            const response = await api.get(`/user-achievements/${userId}`);
            return response.data;
        } catch (error) {
            toast(`Error fetching achievements for user: ${error.response?.data?.message || error.message}`);
            console.error(`Error fetching achievements for user ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Get achievement progress for a specific user by ID
     * @param {string} userId - User ID
     * @returns {Promise} - Resolves to user's achievement progress
     */
    getUserAchievementsProgressById: async (userId) => {
        try {
            const response = await api.get(`/user-achievements/${userId}/progress`);
            return response.data;
        } catch (error) {
            toast(`Error fetching achievement progress: ${error.response?.data?.message || error.message}`);
            console.error(`Error fetching achievement progress for user ${userId}:`, error);
            throw error;
        }
    },

    /**
     * Create a new achievement
     * @param {Object} achievementData - Data for the new achievement
     * @returns {Promise} - Resolves to the created achievement
     */
    createAchievement: async (achievementData) => {
        try {
            const response = await api.post('/achievements', achievementData);
            toast('Achievement created successfully!');
            return response.data;
        } catch (error) {
            toast(`Error creating achievement: ${error.response?.data?.message || error.message}`);
            console.error('Error creating achievement:', error);
            throw error;
        }
    },

    /**
     * Update an achievement by ID
     * @param {string} id - Achievement ID
     * @param {Object} updateData - Data to update
     * @returns {Promise} - Resolves to the updated achievement
     */
    updateAchievement: async (id, updateData) => {
        try {
            const response = await api.patch(`/achievements/${id}`, updateData);
            toast('Achievement updated successfully!');
            return response.data;
        } catch (error) {
            toast(`Error updating achievement: ${error.response?.data?.message || error.message}`);
            console.error(`Error updating achievement with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete an achievement by ID
     * @param {string} id - Achievement ID
     * @returns {Promise} - Resolves to the delete response
     */
    deleteAchievement: async (id) => {
        try {
            const response = await api.delete(`/achievements/${id}`);
            toast('Achievement deleted successfully!');
            return response.data;
        } catch (error) {
            toast(`Error deleting achievement: ${error.response?.data?.message || error.message}`);
            console.error(`Error deleting achievement with ID ${id}:`, error);
            throw error;
        }
    },
};

export default achievementsService;
