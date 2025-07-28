import { jwtDecode } from "jwt-decode";
import api from "./api";
import { toast } from "react-toastify";

// Helper function to show toast
const showPostToast = (message, isError = false) => {
  if (isError) {
    toast.error(message);
  } else {
    toast.success(message);
  }
};

// Extract error message from response
const extractErrorMessage = (error) => {
  const errorData = error.response?.data;
  if (Array.isArray(errorData?.message) && errorData.message.length > 0) {
    return errorData.message[0].message;
  }
  if (typeof errorData?.message === "string") return errorData.message;
  if (typeof errorData?.message === "object") {
    return errorData.message.message || errorData.message.msg || "Validation error";
  }
  return error.message || "An unexpected error occurred";
};

const postService = {
  createPost: async (postData) => {
    try {
      const response = await api.post("/posts", postData);
      showPostToast("Post created successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showPostToast(`Error creating post: ${errorMessage}`, true);
      throw error;
    }
  },

  getAllPosts: async (params = {}) => {
    try {
      const response = await api.get("/posts", { params });
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showPostToast(`Error fetching posts: ${errorMessage}`, true);
      throw error;
    }
  },

  getPostById: async (id) => {
    try {
      const token = localStorage.getItem("accessToken");

      let currentUserId = null;
      let currentUserRole = null;

      if (token) {
        try {
          const decoded = jwtDecode(token);
          currentUserId = decoded.userId || decoded.id || decoded.sub;
          currentUserRole = decoded.role;
        } catch (decodeErr) {
          console.warn("Invalid token:", decodeErr);
        }
      }

      const response = await api.get(`/posts/${id}`);
      const postData = response.data?.data || response.data;

      if (!postData) {
        throw new Error("Post not found.");
      }

      const isPending = postData.status === "PENDING" || postData.status === "UPDATING";
      const isOwner = currentUserId && postData.user_id === currentUserId;
      const isAdmin = currentUserRole === "admin";

      if (isPending && !isOwner && !isAdmin) {
        throw new Error("This post is pending approval and not visible to you.");
      }

      return postData;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showPostToast(`Error fetching post: ${errorMessage}`, true);
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    try {
      const response = await api.patch(`/posts/${id}`, postData);
      showPostToast("Post updated successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showPostToast(`Error updating post: ${errorMessage}`, true);
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      showPostToast("Post deleted successfully!");
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showPostToast(`Error deleting post: ${errorMessage}`, true);
      throw error;
    }
  },

  approvePost: async (id, data) => {
    try {
      const response = await api.post(`/posts/${id}/verify`, data);
      const statusMsg = data.status === "APPROVED" ? "approved" : "rejected";
      showPostToast(`Post ${statusMsg} successfully!`);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showPostToast(`Error approving post: ${errorMessage}`, true);
      throw error;
    }
  },

  getCommentsByPostId: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showPostToast(`Error fetching comments: ${errorMessage}`, true);
      throw error;
    }
  },

  getReactionsByPostId: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}/reactions`);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showPostToast(`Error fetching reactions: ${errorMessage}`, true);
      throw error;
    }
  },
};

export default postService;
