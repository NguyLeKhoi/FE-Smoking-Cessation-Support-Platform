import api from './api';

const leaderBoardService = {
    /**
     * Fetch leaderboard data
     * @returns {Promise} Resolves to leaderboard data
     */
    getLeaderboard: async () => {
        try {
            const response = await api.get('/leaderboard');
            return response.data;
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            throw error;
        }
    },
};

export default leaderBoardService;
