import api from './api';

const motivationService = {
  sendMessage: async (message) => {
    try {
      const response = await api.post('/motivation/chat', { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message to motivation AI:', error);
      throw error;
    }
  },
  getMotivationMessage: async () => {
    try {
      const response = await api.get('/motivation/message');
      return response.data;
    } catch (error) {
      console.error('Error fetching motivation message:', error);
      throw error;
    }
  },
};

export default motivationService; 