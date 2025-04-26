import Map from '@/components/map';
import { MarkerData } from '@/components/map/marker-layer';
import React, { useCallback, useState } from 'react';
import useScooterStore from '../scooter-store';

interface LocationSelectorProps {
  onLocationSelect: (coordinates: { lat: number; lng: number }) => void;
  className?: string;
  initialCoords?: [number, number];
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelect,
  className = 'h-full w-full',
  initialCoords,
}) => {
  // Get markers from the store but don't modify them directly
  const { markers } = useScooterStore();

  // Maintain temporary selection marker locally
  const [selectionMarker, setSelectionMarker] = useState<MarkerData | null>(
    null
  );

  // Handle map click
  const handleMapClick = useCallback(
    (e: { lat: number; lng: number }) => {
      const { lat, lng } = e;

      // Create marker at clicked location
      const newMarker: MarkerData = {
        id: 999, // Using a fixed ID for the temporary selection marker
        position: [lat, lng],
        type: 'selected',
        status: 'available',
      };

      // Update the local selection marker
      setSelectionMarker(newMarker);

      // Call the callback with coordinates
      onLocationSelect({ lat, lng });
    },
    [onLocationSelect]
  );

  // Combine markers from store with the temporary selection marker if it exists
  const displayMarkers = selectionMarker
    ? [...markers, selectionMarker]
    : markers;

  return (
    <div className={className}>
      <Map
        center={initialCoords}
        zoom={15}
        className="h-full w-full"
        markers={displayMarkers}
        onMapClick={handleMapClick}
      />
    </div>
  );
};

export default LocationSelector;
