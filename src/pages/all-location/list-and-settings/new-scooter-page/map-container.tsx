import LocationSelector from '@/lib/scooter-utils/location-selector';
import React from 'react';

interface MapContainerProps {
  mapHeight: string;
  onLocationSelect: (coordinates: { lat: number; lng: number }) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  mapHeight,
  onLocationSelect,
}) => {
  return (
    <div className="rounded-md border" style={{ height: mapHeight }}>
      <LocationSelector
        className="h-full w-full rounded-md"
        onLocationSelect={onLocationSelect}
      />
    </div>
  );
};

export default MapContainer;
