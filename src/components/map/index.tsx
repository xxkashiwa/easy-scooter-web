import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FC, useEffect, useRef } from 'react';

interface MapProps {
  center?: [number, number]; // [latitude, longitude]
  zoom?: number;
  className?: string;
}

const Map: FC<MapProps> = ({
  center = [30.76309138557076, 103.98528926875007], // Default center at Shanghai
  zoom = 15,
  className = 'h-full w-full',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // Add AutoNavi tile layer
      L.tileLayer(
        'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
        {
          attribution: '© Easy Scooter',
          maxZoom: 18,
        }
      ).addTo(mapInstanceRef.current);
    } else {
      // Update view if map already exists
      mapInstanceRef.current.setView(center, zoom);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  // Ensure the map resizes when the component resizes
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

  return <div ref={mapRef} className={className}></div>;
};

export default Map;
