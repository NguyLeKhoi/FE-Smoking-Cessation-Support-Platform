// achievementsService.js
// Service cho các chức năng achievements trên mobile 

import api from './api';

const achievementsService = {
  getAchievements: async () => {
    const response = await api.get('/achievements');
    return response.data;
  },
};

export default achievementsService; 