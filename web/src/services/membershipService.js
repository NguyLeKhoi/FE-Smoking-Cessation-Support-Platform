import api from './api';

const membershipService = {
  getMembershipPlans: async () => {
    try {
      const response = await api.get('/membership-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching membership plans:', error);
      throw error;
    }
  },
  createMembershipPlan: async (data) => {
    try {
      const response = await api.post('/membership-plans', data);
      return response.data;
    } catch (error) {
      console.error('Error creating membership plan:', error);
      throw error;
    }
  },
  updateMembershipPlan: async (id, data) => {
    try {
      const response = await api.patch(`/membership-plans/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating membership plan:', error);
      throw error;
    }
  },
  deleteMembershipPlan: async (id) => {
    try {
      const response = await api.delete(`/membership-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting membership plan:', error);
      throw error;
    }
  },
};

export default membershipService; 