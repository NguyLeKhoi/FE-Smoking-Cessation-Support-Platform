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
};

export default membershipService; 