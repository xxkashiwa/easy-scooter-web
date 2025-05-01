import HeaderWithDot from '@/components/header-with-dot';
import Map from '@/components/map';
import { MarkerData } from '@/components/map/marker-layer';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import useBoundStore, { Bound } from '../../../stores/bound-store';
import useScooterStore from '../../../stores/scooter-store';

const NoParkingZones: React.FC = () => {
  const { bounds, addBound, deleteBound, clearBounds } = useBoundStore();
  const { markers, mapCenter, fetchScooters, fetchPrice } = useScooterStore();
  const [loading, setLoading] = useState(true);
  const [firstPoint, setFirstPoint] = useState<[number, number] | null>(null);
  const [currentPoint, setCurrentPoint] = useState<[number, number] | null>(
    null
  );
  const [drawMode, setDrawMode] = useState(false);
  const [selectedBoundId, setSelectedBoundId] = useState<number | null>(null);

  // Rectangle style settings
  const defaultStyle = { color: '#ff4136', weight: 2, opacity: 0.7 };
  const selectedStyle = {
    color: '#0074d9',
    weight: 3,
    opacity: 0.8,
    fillOpacity: 0.3,
  };
  const drawingStyle = {
    color: '#2ecc40',
    weight: 2,
    opacity: 0.7,
    dashArray: '5, 10',
  };

  // Load scooter data
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

  // Generate a new unique ID for new bounds
  const getNewId = () => {
    return bounds.length > 0 ? Math.max(...bounds.map(b => b.id)) + 1 : 1;
  };

  // Convert bound coordinates to LatLngBoundsExpression for the Map component
  const convertBoundsToLatLngBounds = (): L.LatLngBoundsExpression[] => {
    const result: L.LatLngBoundsExpression[] = bounds.map(bound => [
      [bound.coordinates[0][0], bound.coordinates[0][1]],
      [bound.coordinates[1][0], bound.coordinates[1][1]],
    ]);

    // Add preview rectangle if in drawing mode with first and current points
    if (firstPoint && currentPoint && drawMode) {
      result.push([
        [firstPoint[0], firstPoint[1]],
        [currentPoint[0], currentPoint[1]],
      ]);
    }

    return result;
  };

  // Handle map click for drawing rectangles
  const handleMapClick = (coords: { lat: number; lng: number }) => {
    if (!drawMode) return;

    const point: [number, number] = [coords.lat, coords.lng];

    if (!firstPoint) {
      // First click - set first corner
      setFirstPoint(point);
      setCurrentPoint(point); // Initialize current point
    } else {
      // Second click - create rectangle
      const newBound: Bound = {
        id: getNewId(),
        name: `Rectangle Area ${getNewId()}`,
        coordinates: [firstPoint, point],
        color: defaultStyle.color,
        description: `Created on ${new Date().toLocaleString()}`,
      };

      addBound(newBound);
      setFirstPoint(null);
      setCurrentPoint(null);
    }
  };

  // Handle map movement (update current point for preview)
  const handleMapMove = (coords: { lat: number; lng: number }) => {
    if (drawMode && firstPoint) {
      setCurrentPoint([coords.lat, coords.lng]);
    }
  };

  // Handle clicking on a specific bound
  const handleBoundClick = (boundExpression: L.LatLngBoundsExpression) => {
    // Don't process selection if in drawing mode
    if (drawMode) return;

    // We need to identify which bound was clicked by matching coordinates
    const clickedBound = bounds.find(bound => {
      const boundAsLatLng = [
        [bound.coordinates[0][0], bound.coordinates[0][1]],
        [bound.coordinates[1][0], bound.coordinates[1][1]],
      ];
      return JSON.stringify(boundAsLatLng) === JSON.stringify(boundExpression);
    });

    if (clickedBound) {
      setSelectedBoundId(
        clickedBound.id === selectedBoundId ? null : clickedBound.id
      );
    }
  };

  // Handle marker click
  const handleMarkerClick = (marker: MarkerData) => {
    console.log('Marker clicked:', marker);
  };

  // Handle deleting the selected bound
  const handleDeleteBound = () => {
    if (selectedBoundId !== null) {
      deleteBound(selectedBoundId);
      setSelectedBoundId(null);
    }
  };

  // Custom style function for rectangles
  const getBoundStyle = (bound: L.LatLngBoundsExpression): L.PathOptions => {
    // If it's a preview rectangle (last item)
    if (firstPoint && currentPoint && drawMode) {
      const previewBound = [
        [firstPoint[0], firstPoint[1]],
        [currentPoint[0], currentPoint[1]],
      ];

      if (JSON.stringify(bound) === JSON.stringify(previewBound)) {
        return drawingStyle;
      }
    }

    // Find the corresponding bound ID
    const boundObj = bounds.find(b => {
      const boundAsLatLng = [
        [b.coordinates[0][0], b.coordinates[0][1]],
        [b.coordinates[1][0], b.coordinates[1][1]],
      ];
      return JSON.stringify(boundAsLatLng) === JSON.stringify(bound);
    });

    // Return different styles based on selection state
    if (boundObj && boundObj.id === selectedBoundId) {
      return selectedStyle;
    }

    return defaultStyle;
  };

  return (
    <div className="container mx-auto flex h-full flex-col p-4">
      <HeaderWithDot className="mb-4">No Parking Zones</HeaderWithDot>

      {/* Controls */}
      <div className="mb-4 flex space-x-2">
        <Button
          onClick={() => {
            setDrawMode(!drawMode);
            setFirstPoint(null);
            setCurrentPoint(null);
            setSelectedBoundId(null);
          }}
          variant={drawMode ? 'destructive' : 'default'}
        >
          {drawMode ? 'Cancel Drawing' : 'Draw Rectangle'}
        </Button>
        <Button
          onClick={handleDeleteBound}
          variant="outline"
          disabled={selectedBoundId === null}
        >
          Delete Selected Area
        </Button>
        <Button
          onClick={() => {
            clearBounds();
            setSelectedBoundId(null);
          }}
          variant="outline"
        >
          Clear All Areas
        </Button>
      </div>

      {/* Instructions */}
      {drawMode && (
        <div className="mb-4 rounded-md bg-yellow-100 p-3">
          <p className="text-sm">
            {!firstPoint
              ? 'Click on the map to place the first corner of the rectangle'
              : 'Click again to place the second corner and complete the rectangle'}
          </p>
        </div>
      )}

      {/* Map Container */}
      <div className="relative min-h-[500px] flex-1 overflow-hidden rounded-lg border border-gray-300">
        {loading && (
          <div className="bg-opacity-75 absolute inset-0 z-10 flex items-center justify-center bg-white">
            <div className="text-blue-600">Loading...</div>
          </div>
        )}
        <Map
          center={mapCenter || [30.76309138557076, 103.98528926875007]}
          zoom={15}
          className="h-full w-full"
          markers={markers}
          onMarkerClick={handleMarkerClick}
          onMapClick={handleMapClick}
          onMouseMove={handleMapMove}
          bounds={convertBoundsToLatLngBounds()}
          onBoundClick={handleBoundClick}
          getBoundStyle={getBoundStyle}
        />
      </div>

      {/* Zones List */}
      <div className="mt-4">
        <h3 className="mb-2 text-lg font-medium">Rectangle Areas List</h3>
        {bounds.length === 0 ? (
          <p className="text-gray-500">
            No rectangle areas defined yet. Use the "Draw Rectangle" button to
            create areas.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {bounds.map(bound => (
              <div
                key={bound.id}
                className={`cursor-pointer rounded-md border p-3 ${bound.id === selectedBoundId ? 'border-blue-300 bg-blue-50' : 'bg-white'}`}
                onClick={() =>
                  setSelectedBoundId(
                    bound.id === selectedBoundId ? null : bound.id
                  )
                }
              >
                <div className="font-medium">{bound.name}</div>
                <div className="truncate text-sm text-gray-600">
                  {bound.description}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Coordinates: [{bound.coordinates[0][0].toFixed(4)},{' '}
                  {bound.coordinates[0][1].toFixed(4)}] - [
                  {bound.coordinates[1][0].toFixed(4)},{' '}
                  {bound.coordinates[1][1].toFixed(4)}]
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoParkingZones;
