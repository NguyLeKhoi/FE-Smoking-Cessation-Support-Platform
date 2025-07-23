import api from './api';
import { toast } from 'react-toastify';

const commentsService = {
    /**
     * Create a new comment
     * @param {object} commentData - The data for the new comment
     * @returns {Promise} - The created comment data
     */
    createComment: async (commentData) => {
        try {
            const response = await api.post('/comments', commentData);
            toast('Comment posted successfully!');
            return response.data;
        } catch (error) {
            toast(`Error posting comment: ${error.response?.data?.message || error.message}`);
            throw error;
        }
    },
};

export default commentsService;
