import api from './api';

const smokingService = {
    // Create user's smoking habits
    createSmokingHabit: async (habitData) => {
        try {
            const response = await api.post('/smoking-habits', habitData);
            return response.data;
        } catch (error) {
            console.error('Error creating smoking habit:', error);
            throw error;
        }
    },

    // Get current user's smoking habits
    getMySmokingHabits: async () => {
        try {
            const response = await api.get('/smoking-habits/me');
            return response.data;
        } catch (error) {
            console.error('Error fetching current user smoking habits:', error);
            throw error;
        }
    },

    // Delete a specific smoking habit by ID
    deleteSmokingHabit: async (id) => {
        try {
            const response = await api.delete(`/smoking-habits/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting smoking habit with ID ${id}:`, error);
            throw error;
        }
    },
};

export default smokingService;