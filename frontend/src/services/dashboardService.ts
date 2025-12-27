import api from './api';
import { DashboardStats, ApiResponse } from '../types';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data.data;
  },

  getTrends: async (period: 'week' | 'month' | 'year') => {
    const response = await api.get('/dashboard/trends', { params: { period } });
    return response.data.data;
  },
};