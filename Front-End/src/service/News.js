import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api`;

const News = {
    getAll: async () => {
        try {
            const response = await axios.get(`${API_URL}/news`);
            return response.data;
        } catch (error) {
            console.error('Error fetching news:', error);
            throw error;
        }
    },

    getById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/news/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching news by id:', error);
            throw error;
        }
    }
};

export default News; 