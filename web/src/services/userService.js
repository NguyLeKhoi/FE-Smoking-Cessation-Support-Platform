import api from './api';
import { USERS_MESSAGES } from '../constants/serviceMessages';
import { toast } from 'react-toastify';

const toastUserMessage = (messageKey, type = 'error') => {
    const message = USERS_MESSAGES[messageKey];
    if (message) {
        toast[type](message);
    }
};

/**
 * Fetch the current user's profile information
 * @returns {Promise} Promise that resolves to user data
 */
export const fetchCurrentUser = async () => {
    try {
        const response = await api.get('/users/me');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage) {
            // Map common error messages to our constants
            if (errorMessage.includes('user not found')) {
                toastUserMessage('USER_NOT_FOUND');
            } else if (errorMessage.includes('invalid user id')) {
                toastUserMessage('USER_ID_IS_INVALID');
            } else {
                toast.error(errorMessage);
            }
        } else {
            toast.error('Failed to fetch user profile. Please try again.');
        }
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

/**
 * Fetch the current user's posts
 * @returns {Promise} Promise that resolves to array of user posts
 */
export const fetchCurrentUserPosts = async () => {
    try {
        const response = await api.get('/users/me/posts');
        console.log('Current user posts received:', response.data);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage) {
            if (errorMessage.includes('user not found')) {
                toastUserMessage('USER_NOT_FOUND');
            } else if (errorMessage.includes('invalid user id')) {
                toastUserMessage('USER_ID_IS_INVALID');
            } else {
                toast.error(errorMessage);
            }
        } else {
            toast.error('Failed to fetch user posts. Please try again.');
        }
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

/**
 * Fetch all users
 * @returns {Promise} Promise that resolves to array of user data
 */
export const getAllUsers = async () => {
    try {
        const response = await api.get('/users');
        console.log('All users received:', response.data);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage) {
            // For getAllUsers, we might not have specific user validation errors
            // but we can handle general errors
            toast.error(errorMessage);
        } else {
            toast.error('Failed to fetch users. Please try again.');
        }
        console.error('Error fetching all users:', error);
        throw error;
    }
};

/**
 * Get user by ID
 * @param {string} userId - The ID of the user to fetch
 * @returns {Promise} Promise that resolves to user data
 */
export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage) {
            if (errorMessage.includes('user not found')) {
                toastUserMessage('USER_NOT_FOUND');
            } else if (errorMessage.includes('invalid user id')) {
                toastUserMessage('USER_ID_IS_INVALID');
            } else {
                toast.error(errorMessage);
            }
        } else {
            toast.error('Failed to fetch user. Please try again.');
        }
        console.error(`Error fetching user with ID ${userId}:`, error);
        throw error;
    }
};

/**
 * Update the current user's profile information
 * @param {Object} userData - Updated user data
 * @returns {Promise} Promise that resolves to updated user data
 */
export const updateCurrentUser = async (userData) => {
    try {
        const response = await api.patch('/users/me', userData);
        toast.success('Profile updated successfully!');
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage) {
            // Map common validation error messages to our constants
            if (errorMessage.includes('username')) {
                if (errorMessage.includes('required')) {
                    toastUserMessage('USERNAME_IS_REQUIRED');
                } else if (errorMessage.includes('string')) {
                    toastUserMessage('USERNAME_MUST_BE_STRING');
                } else if (errorMessage.includes('between 3 and 50')) {
                    toastUserMessage('USERNAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS');
                }
            } else if (errorMessage.includes('email')) {
                if (errorMessage.includes('required')) {
                    toastUserMessage('EMAIL_IS_REQUIRED');
                } else if (errorMessage.includes('invalid format')) {
                    toastUserMessage('INVALID_EMAIL_FORMAT');
                }
            } else if (errorMessage.includes('first name')) {
                if (errorMessage.includes('required')) {
                    toastUserMessage('FIRST_NAME_IS_REQUIRED');
                } else if (errorMessage.includes('string')) {
                    toastUserMessage('FIRST_NAME_MUST_BE_STRING');
                } else if (errorMessage.includes('between 3 and 50')) {
                    toastUserMessage('FIRST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS');
                }
            } else if (errorMessage.includes('last name')) {
                if (errorMessage.includes('required')) {
                    toastUserMessage('LAST_NAME_IS_REQUIRED');
                } else if (errorMessage.includes('string')) {
                    toastUserMessage('LAST_NAME_MUST_BE_STRING');
                } else if (errorMessage.includes('between 3 and 50')) {
                    toastUserMessage('LAST_NAME_MUST_BE_BETWEEN_3_AND_50_CHARACTERS');
                }
            } else if (errorMessage.includes('phone number')) {
                if (errorMessage.includes('required')) {
                    toastUserMessage('PHONE_NUMBER_IS_REQUIRED');
                } else if (errorMessage.includes('string')) {
                    toastUserMessage('PHONE_NUMBER_MUST_BE_STRING');
                } else if (errorMessage.includes('invalid format')) {
                    toastUserMessage('INVALID_PHONE_NUMBER_FORMAT');
                }
            } else if (errorMessage.includes('birth date')) {
                toastUserMessage('BIRTH_DATE_MUST_BE_VALID_FORMAT');
            } else if (errorMessage.includes('avatar')) {
                toastUserMessage('AVATAR_IS_INVALID_URL');
            } else {
                toast.error(errorMessage);
            }
        } else {
            toast.error('Failed to update profile. Please try again.');
        }
        console.error('Error updating user profile:', error);
        throw error;
    }
};

