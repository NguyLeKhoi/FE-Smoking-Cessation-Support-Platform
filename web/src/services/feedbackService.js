import api from './api';
import { FEEDBACK_MESSAGES } from '../constants/serviceMessages';
import { toast } from 'react-toastify';

const feedbackService = {
    toastFeedbackMessage: (messageKey, type = 'error') => {
        const message = FEEDBACK_MESSAGES[messageKey];
        if (message) {
            toast[type](message);
        }
    },

    createFeedback: async (feedbackData) => {
        try {
            const response = await api.post('/feedback', feedbackData);
            toast.success('Feedback submitted successfully!');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                // Map common error messages to our constants
                if (errorMessage.includes('coach id')) {
                    feedbackService.toastFeedbackMessage('COACH_ID_IS_REQUIRED');
                } else if (errorMessage.includes('rating star')) {
                    feedbackService.toastFeedbackMessage('RATING_STAR_IS_REQUIRED');
                } else if (errorMessage.includes('between 1 and 5')) {
                    feedbackService.toastFeedbackMessage('RATING_STAR_MUST_BE_BETWEEN_1_AND_5');
                } else if (errorMessage.includes('comment')) {
                    feedbackService.toastFeedbackMessage('COMMENT_IS_STRING');
                } else if (errorMessage.includes('user id')) {
                    feedbackService.toastFeedbackMessage('USER_ID_IS_REQUIRED');
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error('Failed to submit feedback. Please try again.');
            }
            throw error;
        }
    },

    getFeedbackByCoachId: async (coachId) => {
        try {
            const response = await api.get(`/feedback/${coachId}`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                if (errorMessage.includes('coach id')) {
                    feedbackService.toastFeedbackMessage('COACH_ID_IS_INVALID');
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error('Failed to fetch feedback. Please try again.');
            }
            throw error;
        }
    },

    deleteFeedback: async (id) => {
        try {
            const response = await api.delete(`/feedback/${id}`);
            toast.success('Feedback deleted successfully!');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage) {
                if (errorMessage.includes('not found')) {
                    feedbackService.toastFeedbackMessage('FEEDBACK_NOT_FOUND');
                } else if (errorMessage.includes('user id')) {
                    feedbackService.toastFeedbackMessage('USER_ID_IS_INVALID');
                } else {
                    toast.error(errorMessage);
                }
            } else {
                toast.error('Failed to delete feedback. Please try again.');
            }
            throw error;
        }
    },
};

export default feedbackService;
