import L from 'leaflet';
import { FC, useEffect } from 'react';

export interface MarkerData {
  id: number;
  position: [number, number]; // [latitude, longitude]
  status: string;
  type: string;
  popupContent?: string;
}

interface MarkerLayerProps {
  map: L.Map | null;
  markers: MarkerData[];
  onMarkerClick?: (marker: MarkerData) => void;
}

const MarkerLayer: FC<MarkerLayerProps> = ({ map, markers, onMarkerClick }) => {
  useEffect(() => {
    // If map isn't ready or no markers, exit early
    if (!map || !markers.length) return;

    // Reference to the marker group to clean up later
    const markerGroup = L.layerGroup().addTo(map);

    // Function to get marker icon based on status
    const getMarkerIcon = (status: string) => {
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

    // Add each marker to the map
    markers.forEach(markerData => {
      const { id, position, status, type, popupContent } = markerData;

      try {
        const marker = L.marker(position, {
          icon: getMarkerIcon(status),
        }).addTo(markerGroup);

        // Add popup if content is provided
        if (popupContent) {
          marker.bindPopup(popupContent);
        } else {
          // Create default popup content
          const defaultContent = `
            <div class="popup-content">
              <div style="font-weight:bold">Scooter #${id}</div>
              <div>Type: ${type}</div>
              <div>Status: ${status}</div>
            </div>
          `;
          marker.bindPopup(defaultContent);
        }

        // Add click handler
        if (onMarkerClick) {
          marker.on('click', () => {
            onMarkerClick(markerData);
          });
        }
      } catch (error) {
        console.error(`Error adding marker for scooter #${id}:`, error);
      }
    });

    // Cleanup function to remove markers when component unmounts
    return () => {
      map.removeLayer(markerGroup);
    };
  }, [map, markers, onMarkerClick]);

  // This is just a utility component, it doesn't render anything
  return null;
};

export default MarkerLayer;
