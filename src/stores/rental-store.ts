import {
  deleteRental,
  getRentals,
  postRental,
} from '@/services/rental-service';
import { Rental } from '@/services/types';
import { create } from 'zustand';

interface RentalStoreProps {
  rentals: Rental[];
  fetchRentals: () => Promise<void>;
  createRental: (
    scooterId: number,
    startTime: string,
    period: '1hr' | '4hrs' | '1day' | '1week'
  ) => Promise<void>;
  deleteRental: (id: number) => Promise<void>;
}

const rentalStore = create<RentalStoreProps>((set, get) => ({
  rentals: [],
  fetchRentals: async () => {
    const datas = await getRentals();
    set({
      rentals: datas,
    });
  },
  createRental: async (scooterId, startTime, period) => {
    await postRental(scooterId, startTime, period);
    await get().fetchRentals();
  },
  deleteRental: async id => {
    await deleteRental(id);
    await get().fetchRentals();
  },
}));

export default rentalStore;
