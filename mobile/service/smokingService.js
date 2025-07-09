// smokingService.js
// Service cho các chức năng quiz trên mobile 

import api from './api';

const smokingService = {
  getQuizQuestions: async () => {
    const response = await api.get('/smoking-quiz/questions');
    return response.data;
  },
  submitQuiz: async (answers) => {
    const response = await api.post('/smoking-quiz/submit', answers);
    return response.data;
  },
};

export default smokingService; 