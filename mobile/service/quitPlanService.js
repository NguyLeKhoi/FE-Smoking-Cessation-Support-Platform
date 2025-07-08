// quitPlanService.js
// Service cho các chức năng quit plan trên mobile 

import api from './api';

const quitPlanService = {
  // Tạo kế hoạch bỏ thuốc
  createQuitPlan: async (data) => {
    return api.post('/quit-plans', data);
  },
  // Tạo ghi nhận hàng ngày cho phase
  createDailyRecord: async (data) => {
    return api.post('/quit-plans/records', data);
  },
  // Alias
  createPlanRecord: async (data) => {
    return quitPlanService.createDailyRecord(data);
  },
  // Lấy kế hoạch theo id
  getQuitPlanById: async (id) => {
    return api.get(`/quit-plans/${id}`);
  },
  // Xóa kế hoạch
  deleteQuitPlan: async (id) => {
    return api.delete(`/quit-plans/${id}`);
  },
  // Lấy tất cả kế hoạch của user
  getAllQuitPlans: async () => {
    return api.get('/quit-plans');
  },
  // Lấy record của phase
  getPhaseRecords: (planId, phaseId) => {
    return api.get(`/plan-records/${planId}/${phaseId}`);
  },
  // Lấy record của plan
  getPlanRecords: (planId) => {
    return api.get(`/plan-records/${planId}`);
  },
};

export default quitPlanService; 