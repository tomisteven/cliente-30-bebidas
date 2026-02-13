import api from './api';

const reportApi = {
    getStats: async () => {
        const response = await api.get('/reports/stats');
        return response.data;
    },

    getSalesHistory: async (days = 30) => {
        const response = await api.get(`/reports/sales-history?days=${days}`);
        return response.data;
    },

    getTopProducts: async () => {
        const response = await api.get('/reports/top-products');
        return response.data;
    }
};

export default reportApi;
