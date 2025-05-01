import L from 'leaflet';

export interface MarkerData {
  id: number;
  position: [number, number]; // [latitude, longitude]
  status: string;
  type: string;
  popupContent?: string;
  icon?: L.DivIcon | L.Icon; // Added icon property for react-leaflet
}

// This helper function creates marker icons based on status
export const createMarkerIcon = (status: string): L.DivIcon => {
  const iconColor =
    status === 'available'
      ? '#10b981' // green-500
      : status === 'in_use'
        ? '#3b82f6' // blue-500
        : status === 'maintenance'
          ? '#f97316' // orange-500
          : '#6b7280'; // gray-500

  return L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="width:16px;height:16px;border-radius:50%;background-color:${iconColor};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

// Helper function to create default popup content
export const createDefaultPopupContent = (marker: MarkerData): string => {
  const { id, type, status } = marker;
  return `
    <div class="popup-content">
      <div style="font-weight:bold">Scooter #${id}</div>
      <div>Type: ${type}</div>
      <div>Status: ${status}</div>
    </div>
  `;
};

// Prepare markers data with icons
export const prepareMarkers = (markers: MarkerData[]): MarkerData[] => {
  return markers.map(marker => {
    // Create a new object to avoid mutating the original
    const newMarker = { ...marker };

    // Add the icon based on status
    newMarker.icon = createMarkerIcon(marker.status);

    // Add default popup content if none provided
    if (!newMarker.popupContent) {
      newMarker.popupContent = createDefaultPopupContent(marker);
    }

    return newMarker;
  });
};
