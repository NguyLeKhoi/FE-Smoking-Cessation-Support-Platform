import api from './api';

export const createChatRoom = async (coach_id) => {
    try {
        console.log('Creating chat room with coach_id:', coach_id);
        const response = await api.post('/chat/rooms', { coach_id });
        console.log('Create chat room API response:', response);
        return response.data;
    } catch (error) {
        console.error('Error creating chat room:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

export const getAllChatRooms = async () => {
    try {
        console.log('Fetching all chat rooms...');
        const response = await api.get('/chat/rooms');
        console.log('Get all chat rooms API response:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

export const getAllCoachChatRooms = async () => {
    try {
        console.log('Fetching coach chat rooms...');
        const response = await api.get('/chat/rooms/coach');
        console.log('Get coach chat rooms API response:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching coach chat rooms:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

export const getChatRoomMessages = async (chatRoomId) => {
    try {
        console.log('Fetching messages for chat room:', chatRoomId);
        const response = await api.get(`/chat/rooms/${chatRoomId}/messages`);
        console.log('Get chat room messages API response:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat room messages:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};

export const endChatRoom = async (chatRoomId) => {
    try {
        console.log('Ending chat room:', chatRoomId);
        const response = await api.post(`/chat/rooms/${chatRoomId}/end`);
        console.log('End chat room API response:', response);
        return response.data;
    } catch (error) {
        console.error('Error ending chat room:', error);
        console.error('Error response:', error.response?.data);
        throw error;
    }
};