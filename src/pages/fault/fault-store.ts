import { getFaults } from '@/services/fault-service';
import { Fault } from '@/services/types';
import { create } from 'zustand/react';

interface FaultStore {
  faults: Fault[];
  fetchFaults: () => Promise<void>;
}

const useFaultStore = create<FaultStore>(set => ({
  faults: [],
  fetchFaults: async () => {
    const data = await getFaults();
    set({ faults: data });
  },
}));
export default useFaultStore;
