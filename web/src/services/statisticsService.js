import api from './api';

const statisticsService = {
    /**
     * Fetch statistics overview data
     * @returns {Promise} Resolves to statistics overview data
     */
    getOverview: async () => {
        try {
            const response = await api.get('/statistics/overview');
            return response.data;
        } catch (error) {
            console.error('Error fetching statistics overview:', error);
            throw error;
        }
    },
};

export default statisticsService;
