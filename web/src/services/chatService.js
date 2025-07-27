import api from './api';

export const createChatRoom = async (coach_id) => {
    try {
        const response = await api.post('/chat/rooms', { coach_id });
        return response.data;
    } catch (error) {
        console.error('Error creating chat room:', error);
        throw error;
    }
};

export const getAllChatRooms = async () => {
    try {
        const response = await api.get('/chat/rooms');
        return response.data;
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        throw error;
    }
};

export const getAllCoachChatRooms = async () => {
    try {
        const response = await api.get('/chat/rooms/coach');
        return response.data;
    } catch (error) {
        console.error('Error fetching coach chat rooms:', error);
        throw error;
    }
};

export const getChatRoomMessages = async (chatRoomId) => {
    try {
        const response = await api.get(`/chat/rooms/${chatRoomId}/messages`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat room messages:', error);
        throw error;
    }
};

export const endChatRoom = async (chatRoomId) => {
    try {
        const response = await api.post(`/chat/rooms/${chatRoomId}/end`);
        return response.data;
    } catch (error) {
        console.error('Error ending chat room:', error);
        throw error;
    }
};

export const getVideoToken = async (chatRoomId) => {
    try {
        // Add timestamp to ensure fresh token generation
        const timestamp = Date.now();
        const response = await api.post(`/chat/rooms/${chatRoomId}/video-token`, {
            timestamp: timestamp
        });
        return response.data;
    } catch (error) {
        console.error('Error getting video token:', error);
        throw error;
    }
};