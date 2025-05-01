/* eslint-disable @typescript-eslint/no-unused-vars */
import useBoundStore from '@/stores/bound-store';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  Rectangle,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { MarkerData } from './marker-layer';
import './marker-styles.css';

interface MapProps {
  center?: [number, number]; // [latitude, longitude]
  zoom?: number;
  className?: string;
  markers?: MarkerData[];
  onMarkerClick?: (marker: MarkerData) => void;
  onMapClick?: (coordinates: { lat: number; lng: number }) => void;
  onMouseMove?: (coordinates: { lat: number; lng: number }) => void;
  bounds?: L.LatLngBoundsExpression[];
  onBoundClick?: (bounds: L.LatLngBoundsExpression) => void;
  getBoundStyle?: (bound: L.LatLngBoundsExpression) => L.PathOptions;
}

// Map event handler component for clicks and mouse movements
const MapEventHandler: FC<{
  onMapClick?: (coordinates: { lat: number; lng: number }) => void;
  onMouseMove?: (coordinates: { lat: number; lng: number }) => void;
}> = ({ onMapClick, onMouseMove }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        const { lat, lng } = e.latlng;
        onMapClick({ lat, lng });
      }
    },
    mousemove(e) {
      if (onMouseMove) {
        const { lat, lng } = e.latlng;
        onMouseMove({ lat, lng });
      }
    },
  });

  return null;
};

// Marker component to handle click events
const MarkerComponent: FC<{
  marker: MarkerData;
  onMarkerClick?: (marker: MarkerData) => void;
}> = ({ marker, onMarkerClick }) => {
  const { position, icon, popupContent, id, type, status } = marker;

  const handleMarkerClick = () => {
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{ click: handleMarkerClick }}
    >
      {popupContent && (
        <Popup>
          <div className="popup-content">
            <div className="mb-1 text-lg font-bold">Scooter {id}</div>
            <div className="mb-1">
              <strong>Type:</strong> {type}
              <br />
              <strong>Status:</strong> {status}
            </div>
          </div>
        </Popup>
      )}
    </Marker>
  );
};

// Bounds component to handle rectangle bounds
const BoundsLayer: FC<{
  bounds: L.LatLngBoundsExpression[];
  onBoundClick?: (bounds: L.LatLngBoundsExpression) => void;
  getBoundStyle?: (bound: L.LatLngBoundsExpression) => L.PathOptions;
}> = ({ bounds, onBoundClick, getBoundStyle }) => {
  const [activeBounds, setActiveBounds] =
    useState<L.LatLngBoundsExpression | null>(null);
  const map = useMap();

  const activeStyle = useMemo(() => ({ color: 'red', weight: 2 }), []);
  const inactiveStyle = useMemo(
    () => ({ color: 'blue', weight: 1, opacity: 0.7 }),
    []
  );

  const handleBoundClick = (bound: L.LatLngBoundsExpression) => {
    setActiveBounds(bound);
    if (map && bound) {
      map.fitBounds(bound);
    }
    if (onBoundClick) {
      onBoundClick(bound);
    }
  };

  return (
    <>
      {bounds.map((bound, index) => (
        <Rectangle
          key={`bound-${index}`}
          bounds={bound}
          pathOptions={
            getBoundStyle
              ? getBoundStyle(bound)
              : activeBounds === bound
                ? activeStyle
                : inactiveStyle
          }
          eventHandlers={{
            click: () => handleBoundClick(bound),
          }}
        />
      ))}
    </>
  );
};

const Map: FC<MapProps> = ({
  center = [30.76309138557076, 103.98528926875007], // Default center
  zoom = 15,
  className = 'h-full w-full',
  markers = [],
  onMarkerClick,
  onMapClick,
  onMouseMove,
  bounds = [],
  onBoundClick,
  getBoundStyle,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { fetchBounds } = useBoundStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchBounds();
      } catch (error) {
        console.error('Failed to fetch bounds:', error);
      }
    };

    fetchData();
  }, []);

  // Force resize on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapContainerRef.current) {
        window.dispatchEvent(new Event('resize'));
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={className} ref={mapContainerRef}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution="© Easy Scooter"
          url="https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
          maxZoom={18}
        />

        <MapEventHandler onMapClick={onMapClick} onMouseMove={onMouseMove} />

        {markers.map((marker, index) => (
          <MarkerComponent
            key={`marker-${index}`}
            marker={marker}
            onMarkerClick={onMarkerClick}
          />
        ))}

        {bounds.length > 0 && (
          <BoundsLayer
            bounds={bounds}
            onBoundClick={onBoundClick}
            getBoundStyle={getBoundStyle}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
