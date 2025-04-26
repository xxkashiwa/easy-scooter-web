import React from 'react';

interface ScooterActionsProps {
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ScooterActions: React.FC<ScooterActionsProps> = ({
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={onViewDetails}
        className="text-md rounded-lg bg-blue-100 p-5 font-semibold text-blue-800 transition-colors hover:bg-blue-200"
      >
        Detail
      </button>
      <button
        onClick={onEdit}
        className="text-md rounded-lg bg-green-100 p-5 font-semibold text-green-800 transition-colors hover:bg-green-200"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="text-md rounded-lg bg-red-100 p-5 font-semibold text-red-800 transition-colors hover:bg-red-200"
      >
        Delete
      </button>
    </div>
  );
};

export default ScooterActions;
