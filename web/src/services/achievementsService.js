import api from './api';

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
            console.error(`Error fetching achievement with ID ${id}:`, error);
            throw error;
        }
    },
};

export default achievementsService;
