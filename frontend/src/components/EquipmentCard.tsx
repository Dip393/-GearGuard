import React from 'react';
import { Equipment } from '../types';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface EquipmentCardProps {
  equipment: Equipment;
  showActions?: boolean;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, showActions = true }) => {
  const navigate = useNavigate();

  const statusColors = {
    working: 'bg-green-100 text-green-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    scrap: 'bg-red-100 text-red-800',
  };

  const handleViewDetails = () => {
    navigate(`/equipment/${equipment._id}`);
  };

  const handleMaintenance = () => {
    navigate(`/requests/new?equipment=${equipment._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {equipment.name}
          </h3>
          <p className="text-gray-600 text-sm">{equipment.serialNumber}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[equipment.status]}`}>
            {equipment.status.toUpperCase()}
          </span>
          
          {equipment.status === 'scrap' && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">
              SCRAPPED
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Department</p>
          <p className="font-medium">{equipment.department}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Category</p>
          <p className="font-medium">{equipment.category}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Location</p>
          <p className="font-medium">{equipment.location}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Maintenance Team</p>
          <p className="font-medium">{equipment.maintenanceTeam.name}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between text-sm text-gray-600">
          <div>
            <p>Purchased: {format(new Date(equipment.purchaseDate), 'MMM d, yyyy')}</p>
            <p>Warranty: {format(new Date(equipment.warrantyExpiry), 'MMM d, yyyy')}</p>
          </div>
          
          {equipment.assignedTo && (
            <div className="text-right">
              <p className="text-gray-500">Assigned to</p>
              <p className="font-medium">{equipment.assignedTo.name}</p>
            </div>
          )}
        </div>
      </div>

      {showActions && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleViewDetails}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            View Details
          </button>
          
          {equipment.status !== 'scrap' && (
            <button
              onClick={handleMaintenance}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Request Maintenance
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EquipmentCard;