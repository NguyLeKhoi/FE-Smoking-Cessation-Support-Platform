import api from './api';

const smokingService = {
    // Create user's smoking habits
    createSmokingHabit: async (habitData) => {
        try {
            // Format data for API, converting smoking_years to an integer
            const formattedData = {
                cigarettes_per_pack: Number(habitData.cigarettes_per_pack),
                price_per_pack: Number(habitData.price_per_pack),
                cigarettes_per_day: Number(habitData.cigarettes_per_day),
                smoking_years: Math.round(Number(habitData.smoking_years)), // Convert to integer
                triggers: Array.isArray(habitData.triggers) ? habitData.triggers : [],
                health_issues: habitData.health_issues || ''
            };

            console.log('Formatted data being sent to API:', formattedData);

            // Check for NaN values that might cause validation errors
            for (const [key, value] of Object.entries(formattedData)) {
                if (typeof value === 'number' && isNaN(value)) {
                    console.error(`Warning: ${key} is NaN`);
                    formattedData[key] = 0; // Default to zero if NaN
                }
            }

            const response = await api.post('/smoking-habits', formattedData);
            return response.data;
        } catch (error) {
            console.error('Error creating smoking habit:', error);

            // Log the entire response for debugging
            if (error.response) {
                console.error('Full error response:', JSON.stringify(error.response.data, null, 2));

                // Try to extract useful error information
                const errorData = error.response.data;

                if (Array.isArray(errorData)) {
                    console.error('Error array:', errorData);
                } else if (typeof errorData === 'object') {
                    // Check various possible error formats
                    if (errorData.errors) {
                        console.error('Validation errors:', errorData.errors);
                    }
                    if (errorData.message) {
                        console.error('Error message:', errorData.message);
                        // If message is an array, show its contents
                        if (Array.isArray(errorData.message)) {
                            errorData.message.forEach((msg, idx) => {
                                console.error(`Message ${idx}:`, msg);
                            });
                        }
                    }
                    // Log all properties in the error object
                    Object.keys(errorData).forEach(key => {
                        console.error(`${key}:`, errorData[key]);
                    });
                }
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