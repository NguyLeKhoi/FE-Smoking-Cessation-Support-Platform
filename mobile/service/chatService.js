// chatService.js
// Service cho các chức năng chat trên mobile 
import api from './api';

const chatService = {
  createChatRoom: async (coach_id) => {
    const response = await api.post('/chat/rooms', { coach_id });
    return response.data;
  },
  getAllChatRooms: async () => {
    const response = await api.get('/chat/rooms');
    return response.data;
  },
  getAllCoachChatRooms: async () => {
    const response = await api.get('/chat/rooms/coach');
    return response.data;
  },
  getChatRoomMessages: async (chatRoomId) => {
    const response = await api.get(`/chat/rooms/${chatRoomId}/messages`);
    return response.data;
  },
  endChatRoom: async (chatRoomId) => {
    const response = await api.post(`/chat/rooms/${chatRoomId}/end`);
    return response.data;
  },
  getVideoToken: async (chatRoomId) => {
    const response = await api.post(`/chat/rooms/${chatRoomId}/video-token`);
    return response.data;
  },
};

export default chatService; 