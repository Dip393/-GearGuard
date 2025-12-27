import api from './api';
import { Equipment, ApiResponse } from '../types';

export const equipmentService = {
  getAll: async (): Promise<Equipment[]> => {
    const response = await api.get<ApiResponse<Equipment[]>>('/equipment');
    return response.data.data;
  },

  getById: async (id: string): Promise<Equipment> => {
    const response = await api.get<ApiResponse<Equipment>>(`/equipment/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Equipment>): Promise<Equipment> => {
    const response = await api.post<ApiResponse<Equipment>>('/equipment', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Equipment>): Promise<Equipment> => {
    const response = await api.put<ApiResponse<Equipment>>(`/equipment/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/equipment/${id}`);
  },

  getByDepartment: async (department: string): Promise<Equipment[]> => {
    const response = await api.get<ApiResponse<Equipment[]>>(`/equipment/department/${department}`);
    return response.data.data;
  },

  getMaintenanceRequests: async (id: string) => {
    const response = await api.get(`/equipment/${id}/requests`);
    return response.data.data;
  },

  scrapEquipment: async (id: string, reason: string) => {
    const response = await api.post(`/equipment/${id}/scrap`, { reason });
    return response.data.data;
  },
};