import api from './api';


export const getAllCoaches = async () => {
    try {
        const response = await api.get('/coach');
        return response.data;
    } catch (error) {
        console.error('Error fetching coaches:', error);
        throw error;
    }
};

