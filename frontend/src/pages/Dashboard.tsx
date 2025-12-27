import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { requestService } from '../services/requestService';
import { equipmentService } from '../services/equipmentService';
import { DashboardStats, MaintenanceRequest, Equipment } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<MaintenanceRequest[]>([]);
  const [recentEquipment, setRecentEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In a real app, you would fetch from API
      // For demo, we'll use mock data
      const mockStats: DashboardStats = {
        totalRequests: 24,
        totalEquipment: 156,
        totalTeams: 8,
        overdueRequests: 3,
        statusBreakdown: [
          { _id: 'new', count: 8 },
          { _id: 'in_progress', count: 12 },
          { _id: 'completed', count: 4 },
        ],
        priorityBreakdown: [
          { _id: 'high', count: 6 },
          { _id: 'medium', count: 14 },
          { _id: 'low', count: 4 },
        ],
        teamBreakdown: [
          { _id: '1', name: 'Mechanics', count: 10 },
          { _id: '2', name: 'Electricians', count: 8 },
          { _id: '3', name: 'IT Support', count: 6 },
        ],
        equipmentBreakdown: [
          { _id: '1', name: 'CNC Machines', count: 8 },
          { _id: '2', name: 'Computers', count: 15 },
          { _id: '3', name: 'Vehicles', count: 12 },
        ],
      };

      setStats(mockStats);
      
      // Mock recent requests
      const mockRequests: MaintenanceRequest[] = [
        {
          _id: '1',
          issueTitle: 'Oil Leak in CNC Machine',
          issueDescription: 'Machine leaking hydraulic oil from main cylinder',
          type: 'corrective',
          status: 'in_progress',
          priority: 'high',
          isOverdue: true,
          equipment: { id: '1', name: 'CNC Machine #5', serialNumber: 'CNC-2023-005', category: 'Production' },
          maintenanceTeam: { id: '1', name: 'Mechanics', code: 'MECH' },
          requestedBy: { id: '1', name: 'John Doe', email: 'john@example.com' },
          assignedTo: { id: '2', name: 'Mike Johnson', email: 'mike@example.com' },
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          _id: '2',
          issueTitle: 'Server Room AC Failure',
          issueDescription: 'AC unit not cooling server room properly',
          type: 'corrective',
          status: 'new',
          priority: 'high',
          isOverdue: false,
          equipment: { id: '2', name: 'Server Rack #1', serialNumber: 'SRV-2023-001', category: 'IT' },
          maintenanceTeam: { id: '3', name: 'IT Support', code: 'IT' },
          requestedBy: { id: '1', name: 'John Doe', email: 'john@example.com' },
          createdAt: '2024-01-16T09:15:00Z',
          updatedAt: '2024-01-16T09:15:00Z',
        },
      ];

      setRecentRequests(mockRequests);
      
      // Mock equipment
      const mockEquipment: Equipment[] = [
        {
          _id: '1',
          name: 'CNC Machine #5',
          serialNumber: 'CNC-2023-005',
          category: 'Production',
          department: 'Manufacturing',
          location: 'Production Floor A',
          status: 'maintenance',
          maintenanceTeam: { id: '1', name: 'Mechanics' },
          assignedTo: { id: '3', name: 'Sarah Wilson' },
          purchaseDate: '2023-03-15',
          warrantyExpiry: '2025-03-15',
          lastMaintenanceDate: '2024-01-10',
          nextMaintenanceDate: '2024-02-10',
          createdAt: '2023-03-15T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          _id: '2',
          name: 'Server Rack #1',
          serialNumber: 'SRV-2023-001',
          category: 'IT',
          department: 'IT Department',
          location: 'Server Room',
          status: 'working',
          maintenanceTeam: { id: '3', name: 'IT Support' },
          purchaseDate: '2023-01-10',
          warrantyExpiry: '2025-01-10',
          lastMaintenanceDate: '2024-01-05',
          nextMaintenanceDate: '2024-02-05',
          createdAt: '2023-01-10T00:00:00Z',
          updatedAt: '2024-01-05T14:20:00Z',
        },
      ];

      setRecentEquipment(mockEquipment);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your maintenance operations today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.totalRequests || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue Requests</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {stats?.overdueRequests || 0}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Equipment</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.totalEquipment || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Teams</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.totalTeams || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Requests */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Requests</h3>
              <Link to="/requests" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent requests</p>
            ) : (
              <div className="space-y-4">
                {recentRequests.map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {request.issueTitle}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {request.equipment.name} • {request.maintenanceTeam.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`px-2 py-1 text-xs rounded ${
                        request.priority === 'high' ? 'bg-red-100 text-red-800' :
                        request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {request.priority}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        request.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Equipment */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Equipment Status</h3>
              <Link to="/equipment" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentEquipment.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No equipment found</p>
            ) : (
              <div className="space-y-4">
                {recentEquipment.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.serialNumber} • {item.department}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`px-2 py-1 text-xs rounded ${
                        item.status === 'working' ? 'bg-green-100 text-green-800' :
                        item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                      <Link
                        to={`/equipment/${item._id}`}
                        className="text-primary-600 hover:text-primary-800 text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/requests/new"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 group"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors duration-200">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium text-gray-900">New Request</span>
            <span className="text-sm text-gray-500 mt-1">Report an issue</span>
          </Link>

          <Link
            to="/equipment/new"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 group"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors duration-200">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="font-medium text-gray-900">Add Equipment</span>
            <span className="text-sm text-gray-500 mt-1">Register new asset</span>
          </Link>

          <Link
            to="/calendar"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 group"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors duration-200">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-medium text-gray-900">View Calendar</span>
            <span className="text-sm text-gray-500 mt-1">Schedule maintenance</span>
          </Link>

          <Link
            to="/reports"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors duration-200 group"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors duration-200">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-medium text-gray-900">Reports</span>
            <span className="text-sm text-gray-500 mt-1">View analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;