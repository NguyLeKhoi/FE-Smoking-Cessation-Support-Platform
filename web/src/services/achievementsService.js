import api from './api';
import { toast } from 'react-toastify';
import { ACHIEVEMENTS_MESSAGES } from '../constants/serviceMessages';

const showAchievementError = (error) => {
    const data = error?.response?.data;

    if (Array.isArray(data?.message)) {
        // Show a toast for each error message
        data.message.forEach(m => {
            if (Object.values(ACHIEVEMENTS_MESSAGES).includes(m.message)) {
                toast.error(m.message);
            } else {
                toast.error(m.message || 'An unexpected error occurred.');
            }
        });
    } else {
        const msg = data?.message || error.message;
        if (Object.values(ACHIEVEMENTS_MESSAGES).includes(msg)) {
            toast.error(msg);
        } else {
            toast.error(msg || 'An unexpected error occurred.');
        }
    }
};

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
            showAchievementError(error);
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
            showAchievementError(error);
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
            showAchievementError(error);
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
            showAchievementError(error);
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
            toast.success('Achievement created successfully!');
            return response.data;
        } catch (error) {
            showAchievementError(error);
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
            toast.success('Achievement updated successfully!');
            return response.data;
        } catch (error) {
            showAchievementError(error);
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
            toast.success('Achievement deleted successfully!');
            return response.data;
        } catch (error) {
            showAchievementError(error);
            console.error(`Error deleting achievement with ID ${id}:`, error);
            throw error;
        }
    },
};

export default achievementsService;
