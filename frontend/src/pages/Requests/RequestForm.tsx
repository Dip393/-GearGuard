import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createRequest } from '../../services/requestService';
import { getEquipment } from '../../services/equipmentService';
import { Equipment } from '../../types';

const RequestForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    equipmentId: '',
    issueTitle: '',
    issueDescription: '',
    type: 'corrective' as 'corrective' | 'preventive',
    priority: 'medium' as 'low' | 'medium' | 'high',
    scheduledDate: '',
  });

  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    fetchEquipment();
    
    // Check for equipment ID in URL params
    const params = new URLSearchParams(location.search);
    const equipmentId = params.get('equipment');
    if (equipmentId) {
      setFormData(prev => ({ ...prev, equipmentId }));
    }
  }, [location]);

  useEffect(() => {
    if (formData.equipmentId && equipmentList.length > 0) {
      const equipment = equipmentList.find(eq => eq._id === formData.equipmentId);
      setSelectedEquipment(equipment || null);
    }
  }, [formData.equipmentId, equipmentList]);

  const fetchEquipment = async () => {
    try {
      const data = await getEquipment();
      setEquipmentList(data);
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.equipmentId || !formData.issueTitle || !formData.issueDescription) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.type === 'preventive' && !formData.scheduledDate) {
      alert('Please select a scheduled date for preventive maintenance');
      return;
    }

    setLoading(true);
    try {
      await createRequest(formData);
      alert('Maintenance request created successfully!');
      navigate('/requests');
    } catch (error: any) {
      console.error('Failed to create request:', error);
      alert(error.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Maintenance Request
          </h1>
          <p className="text-gray-600 mt-2">
            Report equipment issues or schedule preventive maintenance
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Equipment Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipment *
              </label>
              <select
                name="equipmentId"
                value={formData.equipmentId}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Equipment</option>
                {equipmentList.map(equipment => (
                  <option key={equipment._id} value={equipment._id}>
                    {equipment.name} ({equipment.serialNumber}) - {equipment.department}
                  </option>
                ))}
              </select>
              
              {selectedEquipment && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">Selected Equipment Details</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <span className="ml-2 font-medium">{selectedEquipment.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <span className="ml-2 font-medium">{selectedEquipment.department}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Maintenance Team:</span>
                      <span className="ml-2 font-medium">{selectedEquipment.maintenanceTeam.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <span className="ml-2 font-medium">{selectedEquipment.location}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Request Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Type *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="corrective"
                    checked={formData.type === 'corrective'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Corrective (Breakdown Repair)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="preventive"
                    checked={formData.type === 'preventive'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Preventive (Routine Checkup)</span>
                </label>
              </div>
            </div>

            {/* Issue Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                name="issueTitle"
                value={formData.issueTitle}
                onChange={handleChange}
                placeholder="Brief description of the issue"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Description *
              </label>
              <textarea
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleChange}
                rows={4}
                placeholder="Detailed description of the issue, symptoms, and any error messages..."
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Scheduled Date for Preventive Maintenance */}
            {formData.type === 'preventive' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Date *
                </label>
                <input
                  type="datetime-local"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  This request will appear on the calendar for the selected date
                </p>
              </div>
            )}

            {/* Requester Info */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Requested By</h4>
              <p className="text-blue-700">{user?.name} ({user?.email})</p>
              <p className="text-sm text-blue-600 mt-1">
                Request will be automatically assigned to {selectedEquipment?.maintenanceTeam.name} team
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/requests')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;