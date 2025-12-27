import api from './api';
import { MaintenanceRequest, ApiResponse } from '../types';

export const requestService = {
  getAll: async (params?: {
    status?: string;
    team?: string;
    equipment?: string;
  }): Promise<MaintenanceRequest[]> => {
    const response = await api.get<ApiResponse<MaintenanceRequest[]>>('/requests', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<MaintenanceRequest> => {
    const response = await api.get<ApiResponse<MaintenanceRequest>>(`/requests/${id}`);
    return response.data.data;
  },

  create: async (data: {
    equipmentId: string;
    issueTitle: string;
    issueDescription: string;
    type: 'corrective' | 'preventive';
    priority: 'low' | 'medium' | 'high';
    scheduledDate?: string;
  }): Promise<MaintenanceRequest> => {
    const response = await api.post<ApiResponse<MaintenanceRequest>>('/requests', data);
    return response.data.data;
  },

  updateStatus: async (
    id: string,
    status: MaintenanceRequest['status'],
    hoursSpent?: number,
    notes?: string
  ): Promise<MaintenanceRequest> => {
    const response = await api.patch<ApiResponse<MaintenanceRequest>>(`/requests/${id}/status`, {
      status,
      hoursSpent,
      notes,
      completedDate: status === 'completed' ? new Date().toISOString() : undefined,
    });
    return response.data.data;
  },

  assign: async (id: string, userId: string): Promise<MaintenanceRequest> => {
    const response = await api.patch<ApiResponse<MaintenanceRequest>>(`/requests/${id}/assign`, { userId });
    return response.data.data;
  },

  getOverdue: async (): Promise<MaintenanceRequest[]> => {
    const response = await api.get<ApiResponse<MaintenanceRequest[]>>('/requests/overdue');
    return response.data.data;
  },

  getCalendarEvents: async (month?: number, year?: number) => {
    const response = await api.get('/requests/calendar', { params: { month, year } });
    return response.data.data;
  },
};