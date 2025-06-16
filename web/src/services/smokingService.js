import api from './api';

const smokingService = {
    // Create user's smoking habits
    createSmokingHabit: async (habitData) => {
        try {
            const formattedData = {
                cigarettes_per_pack: Number(habitData.cigarettes_per_pack),
                price_per_pack: Number(habitData.price_per_pack),
                cigarettes_per_day: Number(habitData.cigarettes_per_day),
                smoking_years: Number(habitData.smoking_years),
                triggers: Array.isArray(habitData.triggers) ? habitData.triggers : [],
                health_issues: habitData.health_issues || ''
            };

            console.log('Formatted data being sent to API:', formattedData);

            const response = await api.post('/smoking-habits', formattedData);
            return response.data;
        } catch (error) {
            console.error('Error creating smoking habit:', error);

            // Log detailed error information
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }

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