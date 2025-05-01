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

interface RentalConfig {
  id: number;
  isActive: boolean;
  baseHourlyRate: number;
  oneHourRate: number;
  fourHoursRate: number;
  oneDayRate: number;
  oneWeekRate: number;
  description: string;
}

export type { Fault, Rental, RentalConfig, Scooter };
