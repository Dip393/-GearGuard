import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { equipmentService } from '../../services/equipmentService';
import { Equipment } from '../../types';
import { useAuth } from '../../context/AuthContext';

const EquipmentList: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      // Mock data for demo
      const mockEquipment: Equipment[] = [
        {
          _id: '1',
          name: 'CNC Machine #5',
          serialNumber: 'CNC-2023-005',
          category: 'Production',
          department: 'Manufacturing',
          location: 'Production Floor A',
          status: 'working',
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
      setEquipment(mockEquipment);
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment</h1>
          <p className="text-gray-600 mt-2">Manage all company assets and equipment</p>
        </div>
        {user?.role === 'admin' && (
          <Link to="/equipment/new" className="btn-primary">
            Add Equipment
          </Link>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">All Equipment ({equipment.length})</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search equipment..."
                className="input-field w-64"
              />
              <select className="input-field w-32">
                <option value="">All Status</option>
                <option value="working">Working</option>
                <option value="maintenance">Maintenance</option>
                <option value="scrap">Scrap</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maintenance Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {equipment.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.serialNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      item.status === 'working' ? 'bg-green-100 text-green-800' :
                      item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.maintenanceTeam.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/equipment/${item._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to={`/equipment/${item._id}/edit`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </Link>
                      )}
                      <Link
                        to={`/requests/new?equipment=${item._id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Request
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {equipment.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No equipment</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding new equipment.</p>
            {user?.role === 'admin' && (
              <div className="mt-6">
                <Link to="/equipment/new" className="btn-primary">
                  Add Equipment
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentList;