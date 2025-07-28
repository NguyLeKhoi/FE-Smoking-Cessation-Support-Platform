import { jwtDecode } from "jwt-decode";
import api from "./api";
import { toast } from "react-toastify";

const postService = {
  /**
   * Create a new post
   * @param {object} postData - The data for the new post
   * @returns {Promise} - The created post data
   */
  createPost: async (postData) => {
    try {
      const response = await api.post("/posts", postData);
      toast(` Post created successfully!`);
      return response.data;
    } catch (error) {
      toast(
        ` Error creating post: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    }
  },

  /**
   * Get all posts
   * @param {object} params - Query parameters for filtering, pagination, etc.
   * @returns {Promise} - Array of posts
   */
  getAllPosts: async (params = {}) => {
    try {
      const response = await api.get("/posts", { params });
      return response.data;
    } catch (error) {
      toast(
        ` Error fetching posts: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    }
  },

  /**
   * Get post by ID
   * @param {string} id - Post ID
   * @returns {Promise} - Post details
   */
  getPostById: async (id) => {
    try {
      // Lấy access token từ localStorage (nếu có)
      const token = localStorage.getItem("accessToken");

      let currentUserId = null;
      let currentUserRole = null;

      // Nếu có token thì decode
      if (token) {
        const decoded = jwtDecode(token);
        currentUserId = decoded.userId || decoded.id || decoded.sub;
        currentUserRole = decoded.role;
      }

      // Gọi API lấy bài viết
      const response = await api.get(`/posts/${id}`);
      const postData = response.data?.data || response.data;

      if (!postData) {
        throw new Error("Post not found.");
      }

      const isPending =
        postData.status === "PENDING" || postData.status === "UPDATING";
      const isOwner = currentUserId && postData.user_id === currentUserId;
      const isAdmin = currentUserRole === "admin";

      // Nếu bài đang pending mà user không phải admin/owner thì chặn
      if (isPending && !isOwner && !isAdmin) {
        throw new Error(
          "Failed to load post details. The post may have been removed or is unavailable."
        );
      }

      return postData;
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  },

  /**
   * Update an existing post
   * @param {string} id - Post ID
   * @param {object} postData - Updated post data
   * @returns {Promise} - Updated post data
   */
  updatePost: async (id, postData) => {
    try {
      const response = await api.patch(`/posts/${id}`, postData);
      toast(` Post updated successfully!`);
      return response.data;
    } catch (error) {
      toast(
        ` Error updating post: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    }
  },

  /**
   * Delete a post
   * @param {string} id - Post ID
   * @returns {Promise} - Result of deletion
   */
  deletePost: async (id) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      toast(` Post deleted successfully!`);
      return response.data;
    } catch (error) {
      toast(
        ` Error deleting post: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    }
  },

  /**
   * Approve or reject a post (admin)
   * @param {string} id - Post ID
   * @param {object} data - { approved: true/false, ... }
   * @returns {Promise} - Result of approval
   */
  approvePost: async (id, data) => {
    try {
      const response = await api.post(`/posts/${id}/verify`, data);
      toast(
        ` Post ${
          data.status === "APPROVED" ? "approved" : "rejected"
        } successfully!`
      );
      return response.data;
    } catch (error) {
      toast(
        ` Error approving post: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    }
  },

  /**
   * Get comments for a post
   * @param {string} postId - Post ID
   * @returns {Promise} - Array of comments
   */
  getCommentsByPostId: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      toast(
        ` Error fetching comments: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    }
  },

  /**
   * Get reactions for a post
   * @param {string} postId - Post ID
   * @returns {Promise} - Array of reactions
   */
  getReactionsByPostId: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/reactions`);
      return response.data;
    } catch (error) {
      toast(
        ` Error fetching reactions: ${
          error.response?.data?.message || error.message
        }`
      );
      throw error;
    }
  },
};

export default postService;
