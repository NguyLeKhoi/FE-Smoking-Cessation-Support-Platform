import api from './api';

const smokingService = {
    // Create user's smoking habits
    createSmokingHabit: async (habitData) => {
        try {
            const formattedData = {
                cigarettes_per_pack: Number(habitData.cigarettes_per_pack),
                price_per_pack: Number(habitData.price_per_pack),
                cigarettes_per_day: Number(habitData.cigarettes_per_day),
                smoking_years: Math.round(Number(habitData.smoking_years)),
                triggers: Array.isArray(habitData.triggers) ? habitData.triggers : [],
                health_issues: typeof habitData.health_issues === 'string'
                    ? habitData.health_issues
                    : (Array.isArray(habitData.health_issues)
                        ? habitData.health_issues.join(', ')
                        : 'No health issues reported')
            };

            console.log('Formatted data being sent to API:', formattedData);

            for (const [key, value] of Object.entries(formattedData)) {
                if (typeof value === 'number' && isNaN(value)) {
                    console.error(`Warning: ${key} is NaN`);
                    formattedData[key] = 0;
                }
            }

            const response = await api.post('/smoking-habits', formattedData);

            // Important: Return the user's input data if the API response doesn't include it
            if (!response.data) {
                return {
                    ...formattedData,
                    ai_feedback: ''
                };
            }

            // If API response is valid but might have missing fields, merge with submitted data
            return {
                ...formattedData,
                ...response.data,
                // Ensure health_issues remains a string
                health_issues: typeof response.data.health_issues === 'string'
                    ? response.data.health_issues
                    : (typeof formattedData.health_issues === 'string'
                        ? formattedData.health_issues
                        : 'No health issues reported')
            };
        } catch (error) {
            console.error('Error creating smoking habit:', error);

            // Still return the user's input data even if the API call fails
            return {
                ...habitData,
                // Ensure health_issues is a string in the returned data
                health_issues: typeof habitData.health_issues === 'string'
                    ? habitData.health_issues
                    : (Array.isArray(habitData.health_issues)
                        ? habitData.health_issues.join(', ')
                        : 'No health issues reported'),
                ai_feedback: 'API request failed. This is your smoking assessment based on the data you provided.'
            };
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