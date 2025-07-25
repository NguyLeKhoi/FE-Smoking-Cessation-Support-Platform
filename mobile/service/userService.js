// userService.js
// Service cho các chức năng user trên mobile 

import api from './api';

const userService = {
  // Lấy thông tin người dùng hiện tại
  fetchCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  // Lấy các bài viết của người dùng hiện tại
  fetchCurrentUserPosts: async () => {
    const response = await api.get('/users/me/posts');
    return response.data;
  },
  // Lấy tất cả user
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  // Lấy user theo id
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  // Cập nhật thông tin người dùng hiện tại
  updateCurrentUser: async (userData) => {
    const response = await api.patch('/users/me', userData);
    return response.data;
  },
};

export default userService; 