interface Rental {
  id: number;
  userId: number;
  startTime: string;
  endTime: string;
  scooterId: number;
  status: 'paid' | 'cancelled' | 'completed' | 'active';
  period: string;
  cost: number;
}
interface Fault {
  id: number;
  type: string;
  detail?: string;
  scooterId?: number;
  rentalId?: number;
  userId?: number;
  priority: string;
  status: string;
  createdAt: string;
  userName?: string;
}

interface Scooter {
  id: number;
  type: string;
  status: 'available' | 'in_use' | 'maintenance' | 'unavailable';
  location: { lat: number; lng: number };
  battery: number;
}
export type { Fault, Rental, Scooter };
