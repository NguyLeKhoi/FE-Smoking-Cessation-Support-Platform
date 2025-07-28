import api from './api';
import { SMOKING_HABITS_MESSAGES } from '../constants/serviceMessages';
import { toast } from 'react-toastify';

const showSmokingHabitError = (error) => {
    const data = error?.response?.data;
    const skipMsg = SMOKING_HABITS_MESSAGES.USER_HABIT_NOT_FOUND;
    if (Array.isArray(data?.message)) {
        data.message.forEach(m => {
            if (m.message === skipMsg) return;
            if (Object.values(SMOKING_HABITS_MESSAGES).includes(m.message)) {
                toast.error(m.message);
            } else {
                toast.error(m.message || 'An unexpected error occurred.');
            }
        });
    } else {
        const msg = data?.message || error.message;
        if (msg === skipMsg) return;
        if (Object.values(SMOKING_HABITS_MESSAGES).includes(msg)) {
            toast.error(msg);
        } else {
            toast.error(msg || 'An unexpected error occurred.');
        }
    }
};

const smokingService = {
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
                        : SMOKING_HABITS_MESSAGES.HABIT_NOT_FOUND)
            };

            console.log('Formatted data being sent to API:', formattedData);

            for (const [key, value] of Object.entries(formattedData)) {
                if (typeof value === 'number' && isNaN(value)) {
                    console.error(`Warning: ${key} is NaN`);
                    formattedData[key] = 0;
                }
            }

            const response = await api.post('/smoking-habits', formattedData);
            toast.success('Smoking habit profile created successfully!');

            if (!response.data) {
                return {
                    ...formattedData,
                    ai_feedback: ''
                };
            }
            return {
                ...formattedData,
                ...response.data,
                // Ensure health_issues remains a string
                health_issues: typeof response.data.health_issues === 'string'
                    ? response.data.health_issues
                    : (typeof formattedData.health_issues === 'string'
                        ? formattedData.health_issues
                        : SMOKING_HABITS_MESSAGES.HABIT_NOT_FOUND)
            };
        } catch (error) {
            showSmokingHabitError(error);
            console.error('Error creating smoking habit:', error);
            // Still return the user's input data even if the API call fails
            return {
                ...habitData,
                health_issues: typeof habitData.health_issues === 'string'
                    ? habitData.health_issues
                    : (Array.isArray(habitData.health_issues)
                        ? habitData.health_issues.join(', ')
                        : SMOKING_HABITS_MESSAGES.HABIT_NOT_FOUND),
                ai_feedback: SMOKING_HABITS_MESSAGES.HABIT_NOT_FOUND
            };
        }
    },

    getMySmokingHabits: async () => {
        try {
            const response = await api.get('/smoking-habits/me');
            console.log("Raw API response in smokingService:", response);
            console.log("Response data:", response.data);
            console.log("AI feedback in response:", response.data?.ai_feedback);
            return response.data;
        } catch (error) {
            showSmokingHabitError(error);
            console.error('Error fetching current user smoking habits:', error);
            throw new Error(SMOKING_HABITS_MESSAGES.HABIT_NOT_FOUND);
        }
    },

    getHasActiveQuitPlan: async () => {
        try {
            const response = await api.get('/smoking-habits/me/has-active-quitplan');
            return response.data;
        } catch (error) {
            showSmokingHabitError(error);
            console.error('Error fetching has-active-quitplan:', error);
            throw error;
        }
    },
};

export default smokingService;