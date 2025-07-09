// blogService.js
// Service cho các chức năng blog trên mobile 

import api from './api';

const blogService = {
  // Lấy tất cả bài viết
  getAllPosts: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // Lấy chi tiết bài viết theo id
  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Tạo bài viết mới
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Cập nhật bài viết
  updatePost: async (id, postData) => {
    const response = await api.patch(`/posts/${id}`, postData);
    return response.data;
  },

  // Xóa bài viết
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

export default blogService; 