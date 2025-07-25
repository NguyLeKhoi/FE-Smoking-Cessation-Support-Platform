import api from './api';

const subscriptionService = {
  getCurrent: async () => {
    try {
      const response = await api.get('/subscriptions/all');
      
      // Return the raw response data
      return response.data || response;
    } catch (error) {
      console.error('Error fetching subscriptions:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
  getById: (id) => api.get(`/subscriptions/${id}`),
  createPayment: (data) => api.post('/subscriptions/payment', data),
  paymentCallback: (data) => api.post('/subscriptions/payment/callback', data),
};

export default subscriptionService;