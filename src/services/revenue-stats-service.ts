/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '@/lib/request';
import { DailyStats, PeriodStats, RevenueByPeriod } from './types';

const endPoint = '/revenue-stats';

const mapToRevenueByPeriod = (data: any): RevenueByPeriod => ({
  '1hr': {
    count: data['1hr'].count,
    revenue: data['1hr'].revenue,
    average: data['1hr'].average_daily,
  },
  '4hrs': {
    count: data['4hrs'].count,
    revenue: data['4hrs'].revenue,
    average: data['4hrs'].average_daily,
  },
  '1day': {
    count: data['1day'].count,
    revenue: data['1day'].revenue,
    average: data['1day'].average_daily,
  },
  '1week': {
    count: data['1week'].count,
    revenue: data['1week'].revenue,
    average: data['1week'].average_daily,
  },
});

const mapToDailyStats = (data: any): DailyStats => ({
  data: data.date,
  totalRevenue: data.total_revenue,
  retalCount: data.rental_count,
  revenueByPeriod: mapToRevenueByPeriod(data.revenue_by_period),
});

const mapToPeriodStats = (data: any): PeriodStats => ({
  startDate: data.start_date,
  endDate: data.end_date,
  totalRevenue: data.total_revenue,
  totalRentals: data.total_rentals,
  dailyAverage: data.daily_average,
  revenueByPeriod: mapToRevenueByPeriod(data.revenue_by_period),
  dailyStats: data.daily_stats?.map(mapToDailyStats),
});

const getWeeklyStats = async (): Promise<PeriodStats> => {
  const response = await request({
    url: `${endPoint}/weekly`,
    method: 'get',
  });
  console.log('Weekly stats response:', response.data);
  return mapToPeriodStats(response.data);
};

const getDailyStats = async (statsDate: string): Promise<DailyStats> => {
  const response = await request({
    url: `${endPoint}/daily/${statsDate}`,
    method: 'get',
  });
  return mapToDailyStats(response.data);
};

export { getDailyStats, getWeeklyStats };
