// coachService.js
// Service cho các chức năng coach trên mobile 

import api from './api';

const coachService = {
  getAllCoaches: async () => {
    const response = await api.get('/coaches');
    return response.data;
  },
};

export default coachService; 