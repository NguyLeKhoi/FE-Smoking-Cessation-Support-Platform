import api from './api';

const subscriptionService = {
  getCurrent: () => api.get('/subscriptions'),
  getById: (id) => api.get(`/subscriptions/${id}`),
  createPayment: (data) => api.post('/subscriptions/payment', data),
  paymentCallback: (data) => api.post('/subscriptions/payment/callback', data),
};

export default subscriptionService; 