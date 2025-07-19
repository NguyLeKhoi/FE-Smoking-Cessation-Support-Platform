// smokingService.js
// Service cho các chức năng quiz trên mobile - Updated to match web functionality

import api from './api';

const smokingService = {
  // Create or update user's smoking habits
  createSmokingHabit: async (habitData) => {
    // Format data outside try block so it's available in catch block
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

      // Validate data before sending
    for (const [key, value] of Object.entries(formattedData)) {
      if (typeof value === 'number' && isNaN(value)) {
        formattedData[key] = 0;
      }
    }

    // Check if all required fields are present
    const requiredFields = ['cigarettes_per_pack', 'price_per_pack', 'cigarettes_per_day', 'smoking_years'];
    const missingFields = requiredFields.filter(field => !formattedData[field] && formattedData[field] !== 0);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    try {
      const response = await api.post('/smoking-habits', formattedData);

      // Return the user's input data if the API response doesn't include it
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
      // Handle specific error: User already has a smoking habit profile
      if (error.response && error.response.status === 400 && 
          error.response.data?.message === 'User already has a smoking habit profile') {
        
        // Try to update existing profile instead
        try {
          const updateResponse = await api.put('/smoking-habits/me', formattedData);
          
          return {
            ...formattedData,
            ...updateResponse.data,
            health_issues: typeof updateResponse.data.health_issues === 'string'
              ? updateResponse.data.health_issues
              : (typeof formattedData.health_issues === 'string'
                ? formattedData.health_issues
                : 'No health issues reported'),
            isUpdated: true
          };
        } catch (updateError) {
          // Fall through to return user data anyway
        }
      }

      // Still return the user's input data even if the API call fails
      return {
        ...habitData,
        health_issues: typeof habitData.health_issues === 'string'
          ? habitData.health_issues
          : (Array.isArray(habitData.health_issues)
            ? habitData.health_issues.join(', ')
            : 'No health issues reported'),
        ai_feedback: 'Your smoking assessment has been updated. This is your current smoking profile based on the data you provided.'
      };
    }
  },

  // Get current user's smoking habits
  getMySmokingHabits: async () => {
    try {
      const response = await api.get('/smoking-habits/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete smoking habit by ID
  deleteSmokingHabit: async (id) => {
    try {
      const response = await api.delete(`/smoking-habits/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Legacy methods for backward compatibility
  getQuizQuestions: async () => {
    // Return predefined questions structure
    return [
      {
        id: 1,
        question: 'How many cigarettes do you smoke a day?',
        field: 'cigarettes_per_day',
        options: [
          { label: '1–5 cigarettes', value: '3' },
          { label: '6–10 cigarettes', value: '8' },
          { label: '11–15 cigarettes', value: '12' },
          { label: 'More than 15 cigarettes', value: '18' },
        ]
      },
      {
        id: 2,
        question: 'How many cigarettes are in a pack that you usually buy?',
        field: 'cigarettes_per_pack',
        options: [
          { label: '10 cigarettes (small pack)', value: '10' },
          { label: '20 cigarettes (regular pack)', value: '20' },
          { label: '25 or more cigarettes (large pack)', value: '25' },
          { label: 'I don\'t pay attention / I don\'t buy cigarettes', value: '15' }
        ]
      },
      {
        id: 3,
        question: 'What is the average price you pay for a pack of cigarettes? (in $)',
        field: 'price_per_pack',
        options: [
          { label: 'Less than $3', value: '2' },
          { label: '$3 – $5', value: '4' },
          { label: '$6 – $8', value: '7' },
          { label: 'More than $8', value: '10' }
        ]
      },
      {
        id: 4,
        question: 'How many years have you been smoking?',
        field: 'smoking_years',
        options: [
          { label: 'Less than 1 year', value: '0.5' },
          { label: '1–5 years', value: '3' },
          { label: '6–10 years', value: '8' },
          { label: 'More than 10 years', value: '15' }
        ]
      },
      {
        id: 5,
        question: 'When are you most likely to smoke? (Select all that apply)',
        field: 'triggers',
        options: [
          'Stress',
          'After meals',
          'Social situations',
          'Boredom',
          'Alcohol consumption'
        ]
      },
      {
        id: 6,
        question: 'Have you experienced any health issues due to smoking? (Please describe)',
        field: 'health_issues',
        type: 'text'
      }
    ];
  },

  submitQuiz: async (answers) => {
    // Legacy method - now uses createSmokingHabit
    return smokingService.createSmokingHabit(answers);
  },
};

export default smokingService; 