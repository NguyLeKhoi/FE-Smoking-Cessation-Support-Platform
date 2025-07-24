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
};

export default notificationService;
