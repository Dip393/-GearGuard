export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'technician' | 'manager';
  department?: string;
  avatar?: string;
  createdAt: string;
}

export interface Equipment {
  _id: string;
  name: string;
  serialNumber: string;
  category: string;
  department: string;
  location: string;
  status: 'working' | 'maintenance' | 'scrap';
  maintenanceTeam: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  purchaseDate: string;
  warrantyExpiry: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTeam {
  _id: string;
  name: string;
  code: string;
  category: string;
  description?: string;
  members: Array<{
    userId: string;
    name: string;
    role: 'technician' | 'lead' | 'manager';
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  _id: string;
  issueTitle: string;
  issueDescription: string;
  type: 'corrective' | 'preventive';
  status: 'new' | 'in_progress' | 'completed' | 'scrap';
  priority: 'low' | 'medium' | 'high';
  isOverdue: boolean;
  equipment: {
    id: string;
    name: string;
    serialNumber: string;
    category: string;
  };
  maintenanceTeam: {
    id: string;
    name: string;
    code: string;
  };
  requestedBy: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  scheduledDate?: string;
  completedDate?: string;
  hoursSpent?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalRequests: number;
  totalEquipment: number;
  totalTeams: number;
  overdueRequests: number;
  statusBreakdown: Array<{ _id: string; count: number }>;
  priorityBreakdown: Array<{ _id: string; count: number }>;
  teamBreakdown: Array<{ _id: string; name: string; count: number }>;
  equipmentBreakdown: Array<{ _id: string; name: string; count: number }>;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'preventive' | 'corrective';
  equipment: string;
  team: string;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}