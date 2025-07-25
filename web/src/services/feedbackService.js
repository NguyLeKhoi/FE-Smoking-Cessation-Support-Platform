import api from './api';

const feedbackService = {
    createFeedback: async (feedbackData) => {
        const response = await api.post('/feedback', feedbackData);
        return response.data;
    },
    getFeedbackByCoachId: async (coachId) => {
        const response = await api.get(`/feedback/${coachId}`);
        return response.data;
    },
    deleteFeedback: async (id) => {
        const response = await api.delete(`/feedback/${id}`);
        return response.data;
    },
};

export default feedbackService;
