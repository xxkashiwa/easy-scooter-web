import {
  deleteZone,
  getNoParkingZones,
  postZone,
} from '@/services/no-parking-zone-service';
import { create } from 'zustand';

// Define the shape of a bound object
export interface Bound {
  id: number;
  name: string;
  coordinates: [number, number][]; // Array of [lat, lng] coordinates that define the bound

  color?: string;
  description?: string;
}

// Define the bound store interface
interface BoundStoreProps {
  bounds: Bound[];

  // Actions
  fetchBounds: () => Promise<void>; // Fetch bounds from the server (not implemented in this snippet)
  addBound: (bound: Bound) => void;
  deleteBound: (id: number) => void;
  getBoundById: (id: number) => Bound | undefined;
  clearBounds: () => void;
}

const useBoundStore = create<BoundStoreProps>((set, get) => ({
  bounds: [],

  fetchBounds: async () => {
    const data = await getNoParkingZones(); // Fetch bounds from the server

    console.log('Fetched bounds:', data); // Log the fetched bounds
    set({ bounds: data }); // Update the state with the fetched bounds
  },
  addBound: async bound => {
    await postZone(bound); // Save the bound to the server
    set(state => {
      return {
        bounds: [...state.bounds, bound],
      };
    });
  },

  deleteBound: async id => {
    await deleteZone(id);
    set(state => ({
      bounds: state.bounds.filter(bound => bound.id !== id),
    }));
  },

  getBoundById: id => {
    return get().bounds.find(bound => bound.id === id);
  },

  clearBounds: () => {
    // Clear all bounds from the store
    get().bounds.forEach(bound => {
      deleteZone(bound.id); // Delete each bound from the server
    });

    set({ bounds: [] });
  },
}));

export default useBoundStore;
