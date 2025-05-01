import Map from '@/components/map';
import { MarkerData } from '@/components/map/marker-layer';
import useBoundStore from '@/stores/bound-store';
import { useEffect, useState } from 'react';
import useScooterStore from '../../stores/scooter-store';

interface ScooterMapProps {
  className?: string;
  onMarkerClick?: (marker: MarkerData) => void;
}

const ScooterMap = ({
  className = 'h-full w-full',
  onMarkerClick,
}: ScooterMapProps) => {
  const { fetchScooters, fetchPrice, markers, mapCenter } = useScooterStore();
  const [loading, setLoading] = useState(true);
  const { bounds } = useBoundStore();
  // Fetch scooter data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchScooters();
        await fetchPrice();
      } catch (error) {
        console.error('Failed to fetch scooter data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchScooters, fetchPrice]);

  return (
    <div className={className}>
      {loading && (
        <div className="bg-opacity-75 absolute inset-0 z-10 flex items-center justify-center bg-white">
          <div className="text-blue-600">Loading scooter data...</div>
        </div>
      )}
      <Map
        markers={markers}
        center={mapCenter}
        zoom={13}
        bounds={bounds.map(bound => [
          [bound.coordinates[0][0], bound.coordinates[0][1]],
          [bound.coordinates[1][0], bound.coordinates[1][1]],
        ])}
        onMarkerClick={onMarkerClick}
        className="h-full w-full"
      />
    </div>
  );
};

export default ScooterMap;
