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
  addBound: (bound: Bound) => void;
  deleteBound: (id: number) => void;
  getBoundById: (id: number) => Bound | undefined;
  clearBounds: () => void;
}

const useBoundStore = create<BoundStoreProps>((set, get) => ({
  bounds: [],

  addBound: bound => {
    set(state => {
      return {
        bounds: [...state.bounds, bound],
      };
    });
  },

  deleteBound: id => {
    set(state => ({
      bounds: state.bounds.filter(bound => bound.id !== id),
    }));
  },

  getBoundById: id => {
    return get().bounds.find(bound => bound.id === id);
  },

  clearBounds: () => {
    set({ bounds: [] });
  },
}));

export default useBoundStore;
