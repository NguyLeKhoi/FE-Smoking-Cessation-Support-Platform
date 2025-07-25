// achievementsService.js
// Service cho các chức năng achievements trên mobile 

import api from './api';

const achievementsService = {
  getAchievements: async () => {
    const response = await api.get('/achievements');
    return response.data;
  },
  getAllAchievements: async () => {
    const response = await api.get('/achievements');
    return response.data;
  },
  getUserAchievementsById: async (userId) => {
    const response = await api.get(`/user-achievements/${userId}`);
    return response.data;
  },
};

export default achievementsService; 