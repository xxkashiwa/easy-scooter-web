// Return appropriate color classes based on status value
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'available':
      return 'bg-green-500 text-white';
    case 'in_use':
      return 'bg-blue-500 text-white';
    case 'maintenance':
      return 'bg-orange-500 text-white';
    case 'unavailable':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-300 text-gray-700';
  }
};

// Format status text for display in the UI
export const getFormattedStatusText = (status: string): string => {
  switch (status) {
    case 'available':
      return 'Available';
    case 'in_use':
      return 'In Use';
    case 'maintenance':
      return 'Maintenance';
    case 'unavailable':
      return 'Unavailable';
    default:
      return status;
  }
};

// Define type for scooter status
export type ScooterStatus =
  | 'available'
  | 'in_use'
  | 'maintenance'
  | 'unavailable';
