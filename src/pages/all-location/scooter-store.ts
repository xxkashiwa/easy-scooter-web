import { getScooters } from '@/services/scooter-service';
import { Scooter } from '@/services/types';
import { create } from 'zustand';

interface ScooterStoreProps {
  scooters: Scooter[];
  fetchScooters: () => Promise<void>;
}

const useScooterStore = create<ScooterStoreProps>(set => ({
  scooters: [],
  fetchScooters: async () => {
    const data = await getScooters();
    set({ scooters: data });
  },
}));
export default useScooterStore;
