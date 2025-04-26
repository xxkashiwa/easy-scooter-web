import { MarkerData } from '@/components/map/marker-layer';
import { getScooters, getTypeAndPrice } from '@/services/scooter-service';
import { Scooter } from '@/services/types';
import { create } from 'zustand';
import { convertScooterToMarker } from './scooter-utils/scooter-map-utils';

interface ScooterStoreProps {
  scooters: Scooter[];
  scooterAndPrice: { id: number; type: string; pricePerHour: number }[];
  markers: MarkerData[];
  mapCenter?: [number, number];
  fetchScooters: () => Promise<void>;
  fetchPrice: () => Promise<void>;
  updateMarkers: () => void;
  addMarker: (marker: MarkerData) => void;
  removeMarker: (markerId: number) => void;
  clearMarkers: () => void;
}

const useScooterStore = create<ScooterStoreProps>((set, get) => ({
  scooters: [],
  scooterAndPrice: [],
  markers: [],
  mapCenter: undefined,

  fetchScooters: async () => {
    const data = await getScooters();
    set({ scooters: data });
    get().updateMarkers();
  },

  fetchPrice: async () => {
    await get().fetchScooters();
    const scooterAndPrice = await Promise.all(
      get().scooters.map(async scooter => await getTypeAndPrice(scooter.type))
    );
    console.log('scooterAndPrice', scooterAndPrice);
    set({ scooterAndPrice });
    get().updateMarkers();
  },

  updateMarkers: () => {
    const { scooters, scooterAndPrice } = get();

    // Convert scooter data to marker data
    const newMarkers = scooters.map(scooter => {
      const priceInfo = scooterAndPrice.find(
        item => item.type === scooter.type
      );
      const price = priceInfo?.pricePerHour || 0;
      return convertScooterToMarker(scooter, price);
    });

    // Calculate map center based on available markers
    let newMapCenter: [number, number] | undefined = undefined;

    if (newMarkers.length > 0) {
      // Find the average position of all markers
      const totalLat = newMarkers.reduce(
        (sum, marker) => sum + marker.position[0],
        0
      );
      const totalLng = newMarkers.reduce(
        (sum, marker) => sum + marker.position[1],
        0
      );

      newMapCenter = [
        totalLat / newMarkers.length,
        totalLng / newMarkers.length,
      ] as [number, number];
    }

    set({
      markers: newMarkers,
      mapCenter: newMapCenter,
    });
  },

  addMarker: (marker: MarkerData) => {
    set(state => ({
      markers: [...state.markers, marker],
    }));
  },

  removeMarker: (markerId: number) => {
    set(state => ({
      markers: state.markers.filter(marker => marker.id !== markerId),
    }));
  },

  clearMarkers: () => {
    set({ markers: [] });
  },
}));

export default useScooterStore;
