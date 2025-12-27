import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MaintenanceRequest } from '../types';

interface KanbanBoardProps {
  requests: MaintenanceRequest[];
  onUpdate: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ requests, onUpdate }) => {
  const columns = [
    { id: 'new', title: 'New', color: 'bg-blue-50', borderColor: 'border-blue-200' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    { id: 'completed', title: 'Completed', color: 'bg-green-50', borderColor: 'border-green-200' },
    { id: 'scrap', title: 'Scrap', color: 'bg-red-50', borderColor: 'border-red-200' },
  ];

  const getRequestsByStatus = (status: string) => {
    return requests.filter(req => req.status === status);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    console.log('Drag ended:', result);
    // Implement status update logic here
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => (
          <div
            key={column.id}
            className={`${column.color} ${column.borderColor} border rounded-lg p-4`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {column.title}
              </h3>
              <span className="bg-white px-2 py-1 rounded-full text-sm font-medium">
                {getRequestsByStatus(column.id).length}
              </span>
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[200px] transition-colors duration-200 ${
                    snapshot.isDraggingOver ? 'bg-gray-100' : ''
                  }`}
                >
                  {getRequestsByStatus(column.id).map((request, index) => (
                    <Draggable
                      key={request._id}
                      draggableId={request._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-3 bg-white rounded-lg shadow-sm border ${
                            snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-500' : ''
                          } ${request.isOverdue ? 'border-l-4 border-l-red-500' : 'border-gray-200'}`}
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900 truncate">
                                {request.issueTitle}
                              </h4>
                              <span className={`px-2 py-1 text-xs rounded ${
                                request.priority === 'high' ? 'bg-red-100 text-red-800' :
                                request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {request.priority}
                              </span>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-3">
                              <div className="mb-1">
                                <span className="font-medium">Equipment:</span>{' '}
                                {request.equipment.name}
                              </div>
                              <div>
                                <span className="font-medium">Team:</span>{' '}
                                {request.maintenanceTeam.name}
                              </div>
                            </div>
                            
                            {request.assignedTo && (
                              <div className="flex items-center mb-3">
                                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-800 text-xs font-medium mr-2">
                                  {request.assignedTo.name.charAt(0)}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {request.assignedTo.name}
                                </span>
                              </div>
                            )}
                            
                            {request.isOverdue && (
                              <div className="text-xs text-red-600 font-medium flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                OVERDUE
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;