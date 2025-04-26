import { MarkerData } from '@/components/map/marker-layer';
import { Scooter } from '@/services/types';
import { getFormattedStatusText } from './status-utils';

/**
 * Converts scooter data from the API to map marker data
 */
export const convertScooterToMarker = (
  scooter: Scooter,
  pricePerHour: number
): MarkerData => {
  const { id, type, status, location } = scooter;

  if (
    !location ||
    typeof location.lat !== 'number' ||
    typeof location.lng !== 'number'
  ) {
    // If location is invalid, use a default location
    return {
      id,
      position: [30.76309, 103.98529], // Default position
      status,
      type,
      popupContent: createScooterPopupContent(id, type, status, pricePerHour),
    };
  }

  return {
    id,
    position: [location.lat, location.lng],
    status,
    type,
    popupContent: createScooterPopupContent(id, type, status, pricePerHour),
  };
};

/**
 * Creates HTML content for the scooter marker popup
 */
const createScooterPopupContent = (
  id: number,
  type: string,
  status: string,
  pricePerHour: number
): string => {
  const statusText = getFormattedStatusText(status);
  const statusColorClass = getStatusColorClass(status);

  return `
    <div class="popup-content">
      <div class="font-bold text-lg mb-1">Scooter #${id}</div>
      <div class="mb-1"><strong>Type:</strong> ${type}</div>
      <div class="mb-1"><strong>Price:</strong> ¥${pricePerHour}/hour</div>
      <div>
        <strong>Status:</strong> 
        <span class="${statusColorClass} px-2 py-1 rounded-full text-xs font-medium">
          ${statusText}
        </span>
      </div>
    </div>
  `;
};

/**
 * Returns the appropriate CSS class for a status badge
 */
const getStatusColorClass = (status: string): string => {
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
