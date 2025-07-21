import api from './api';

const mediaService = {
    uploadImages: async (formData) => {
        try {
            const response = await api.post('/media/upload-images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    },
};

export default mediaService;
