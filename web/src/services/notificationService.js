import api from "./api";

const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get("/notifications");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getNotificationSchedules: async () => {
    try {
      const response = await api.get("/notification-schedules");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  saveNotificationSchedule: async (scheduleData) => {
    try {
      const response = await api.post("/notification-schedules", scheduleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default notificationService;
