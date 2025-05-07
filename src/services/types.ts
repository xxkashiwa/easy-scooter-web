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
  image?: string;
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
  studentDiscount: number;
  oldDiscount: number;
  description: string;
}

interface RevenueByPeriod {
  '1hr': {
    count: number;
    revenue: number;
    average?: number;
  };
  '4hrs': {
    count: number;
    revenue: number;
    average?: number;
  };
  '1day': {
    count: number;
    revenue: number;
    average?: number;
  };
  '1week': {
    count: number;
    revenue: number;
    average?: number;
  };
}

interface DailyStats {
  data: string;
  totalRevenue: number;
  retalCount: number;
  revenueByPeriod: RevenueByPeriod;
}

interface PeriodStats {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalRentals: number;
  dailyAverage: number;
  revenueByPeriod: RevenueByPeriod;
  dailyStats: DailyStats[];
}

export type {
  DailyStats,
  Fault,
  PeriodStats,
  Rental,
  RentalConfig,
  RevenueByPeriod,
  Scooter,
};
