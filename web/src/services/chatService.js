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
