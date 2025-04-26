import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FC, useEffect, useRef, useState } from 'react';
import MarkerLayer, { MarkerData } from './marker-layer';
import './marker-styles.css';

interface MapProps {
  center?: [number, number]; // [latitude, longitude]
  zoom?: number;
  className?: string;
  markers?: MarkerData[];
  onMarkerClick?: (marker: MarkerData) => void;
  onMapClick?: (coordinates: { lat: number; lng: number }) => void;
}

const Map: FC<MapProps> = ({
  center = [30.76309138557076, 103.98528926875007], // Default center
  zoom = 15,
  className = 'h-full w-full',
  markers = [],
  onMarkerClick,
  onMapClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const onMapClickRef = useRef(onMapClick);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up any existing map to prevent issues
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      // Initialize the map
      const mapInstance = L.map(mapRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        attributionControl: true,
      });

      // Add tile layer
      L.tileLayer(
        'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
        {
          attribution: '© Easy Scooter',
          maxZoom: 18,
        }
      ).addTo(mapInstance);

      // Add click event handler if needed
      mapInstance.on('click', (e: L.LeafletMouseEvent) => {
        if (onMapClickRef.current) {
          const { lat, lng } = e.latlng;
          onMapClickRef.current({ lat, lng });
        }
      });

      // Store the map instance
      mapInstanceRef.current = mapInstance;

      // Mark the map as ready
      setMapReady(true);

      // Force a resize after a short delay to ensure the map renders correctly
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 100);
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setMapReady(false);
      }
    };
  }, []); // Remove onMapClick from dependencies

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div ref={mapRef} className={className}></div>
      {mapReady && mapInstanceRef.current && (
        <MarkerLayer
          map={mapInstanceRef.current}
          markers={markers}
          onMarkerClick={onMarkerClick}
        />
      )}
    </>
  );
};

export default Map;
