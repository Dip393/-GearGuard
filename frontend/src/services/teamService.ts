import api from './api';
import { MaintenanceTeam, ApiResponse } from '../types';

export const teamService = {
  getAll: async (): Promise<MaintenanceTeam[]> => {
    const response = await api.get<ApiResponse<MaintenanceTeam[]>>('/teams');
    return response.data.data;
  },

  getById: async (id: string): Promise<MaintenanceTeam> => {
    const response = await api.get<ApiResponse<MaintenanceTeam>>(`/teams/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<MaintenanceTeam>): Promise<MaintenanceTeam> => {
    const response = await api.post<ApiResponse<MaintenanceTeam>>('/teams', data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<MaintenanceTeam>): Promise<MaintenanceTeam> => {
    const response = await api.put<ApiResponse<MaintenanceTeam>>(`/teams/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/teams/${id}`);
  },

  addMember: async (teamId: string, userId: string, role: string): Promise<MaintenanceTeam> => {
    const response = await api.post<ApiResponse<MaintenanceTeam>>(`/teams/${teamId}/members`, { userId, role });
    return response.data.data;
  },

  removeMember: async (teamId: string, userId: string): Promise<MaintenanceTeam> => {
    const response = await api.delete<ApiResponse<MaintenanceTeam>>(`/teams/${teamId}/members/${userId}`);
    return response.data.data;
  },
};