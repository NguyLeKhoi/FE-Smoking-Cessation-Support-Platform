import api from './api';

const quitPlanService = {
  /**
   * Create a new quit plan
   * @param {Object} data - { reason: string, plan_type: string }
   * @returns {Promise}
   */
  createQuitPlan: async (data) => {
    return api.post('/quit-plans', data);
  },

  /**
   * Create a daily record for the active quit plan phase
   * @param {Object} data - { cigarette_smoke: number, craving_level: number, health_status: string, record_date: string }
   * @returns {Promise}
   */
  createDailyRecord: async (data) => {
    return api.post('/quit-plans/records', data);
  },

  /**
   * Get a quit plan by ID
   * @param {string} id
   * @returns {Promise}
   */
  getQuitPlanById: async (id) => {
    return api.get(`/quit-plans/${id}`);
  },

  /**
   * Delete a quit plan by ID
   * @param {string} id
   * @returns {Promise}
   */
  deleteQuitPlan: async (id) => {
    return api.delete(`/quit-plans/${id}`);
  },
};

export default quitPlanService; 