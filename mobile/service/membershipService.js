// membershipService.js
// Service cho các chức năng membership trên mobile 

import api from './api';

const membershipService = {
  getMembershipPlans: async () => {
    const response = await api.get('/membership-plans');
    return response.data;
  },
  createMembershipPlan: async (data) => {
    const response = await api.post('/membership-plans', data);
    return response.data;
  },
  updateMembershipPlan: async (id, data) => {
    const response = await api.patch(`/membership-plans/${id}`, data);
    return response.data;
  },
  deleteMembershipPlan: async (id) => {
    const response = await api.delete(`/membership-plans/${id}`);
    return response.data;
  },
};

export default membershipService; 