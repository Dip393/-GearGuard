import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRequests, updateRequestStatus } from '../../services/requestService';
import { MaintenanceRequest } from '../../types';
import KanbanBoard from '../../components/KanbanBoard';

const RequestList: React.FC = () => {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    team: '',
    priority: '',
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter.status) params.status = filter.status;
      if (filter.team) params.team = filter.team;
      if (filter.priority) params.priority = filter.priority;
      
      const data = await getRequests(params);
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, status: MaintenanceRequest['status']) => {
    try {
      await updateRequestStatus(requestId, status);
      fetchRequests();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleAssignToMe = async (requestId: string) => {
    if (user) {
      try {
        // Implementation for self-assignment
        fetchRequests();
      } catch (error) {
        console.error('Failed to assign request:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Maintenance Requests
              </h1>
              <p className="text-gray-600 mt-2">
                Track and manage all maintenance activities
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setView('kanban')}
                  className={`px-4 py-2 ${
                    view === 'kanban'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 ${
                    view === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  List
                </button>
              </div>
              
              <button
                onClick={() => navigate('/requests/new')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                New Request
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="scrap">Scrap</option>
            </select>

            <select
              value={filter.priority}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={filter.team}
              onChange={(e) => setFilter({ ...filter, team: e.target.value })}
              className="border rounded-lg px-4 py-2"
            >
              <option value="">All Teams</option>
              <option value="mechanics">Mechanics</option>
              <option value="electricians">Electricians</option>
              <option value="it">IT Support</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {view === 'kanban' ? (
          <KanbanBoard requests={requests} onUpdate={fetchRequests} />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {request.equipment.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.equipment.serialNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {request.issueTitle}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {request.issueDescription}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                        {request.maintenanceTeam.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${
                        request.priority === 'high' ? 'bg-red-100 text-red-800' :
                        request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {request.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusUpdate(
                          request._id,
                          e.target.value as MaintenanceRequest['status']
                        )}
                        className="border rounded px-2 py-1 text-sm"
                        disabled={user?.role === 'user'}
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="scrap">Scrap</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/requests/${request._id}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        {!request.assignedTo && (
                          <button
                            onClick={() => handleAssignToMe(request._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Assign to me
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {requests.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No requests found matching your criteria
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestList;