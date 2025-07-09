// subscriptionService.js
// Service cho các chức năng subscription trên mobile 

import api from './api';

const subscriptionService = {
  getCurrent: async () => {
    const response = await api.get('/subscriptions');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
  },
  createPayment: async (data) => {
    const response = await api.post('/subscriptions/payment', data);
    return response.data;
  },
  paymentCallback: async (data) => {
    const response = await api.post('/subscriptions/payment/callback', data);
    return response.data;
  },
};

export default subscriptionService; 