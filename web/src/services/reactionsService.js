import api from './api';
import { toast } from 'react-toastify';

const reactionsService = {
    /**
     * Create a new reaction
     * @param {object} reactionData - The data for the new reaction
     * @returns {Promise} - The created reaction data
     */
    createReaction: async (reactionData) => {
        try {
            const response = await api.post('/reactions', reactionData);
            toast('Reaction added!');
            return response.data;
        } catch (error) {
            toast(`Error adding reaction: ${error.response?.data?.message || error.message}`);
            throw error;
        }
    },

    /**
     * Delete a reaction by ID
     * @param {string} reactionId - Reaction ID
     * @returns {Promise} - Result of deletion
     */
    deleteReaction: async (reactionId) => {
        try {
            const response = await api.delete(`/reactions/${reactionId}`);
            toast('Reaction removed!');
            return response.data;
        } catch (error) {
            toast(`Error removing reaction: ${error.response?.data?.message || error.message}`);
            throw error;
        }
    },
};

export default reactionsService;
