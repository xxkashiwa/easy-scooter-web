/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '@/lib/request';
import { RentalConfig } from './types';

const endPoint = '/rental-configs';

const mapToRentalConfig = (data: any): RentalConfig => ({
  id: data.id,
  isActive: data.is_active,
  baseHourlyRate: data.base_hourly_rate,
  oneHourRate: data.period_discounts['1hr'],
  fourHoursRate: data.period_discounts['4hrs'],
  oneDayRate: data.period_discounts['1day'],
  oneWeekRate: data.period_discounts['1week'],
  description: data.description,
});

const getCurrentRentalConfig = async () => {
  const response = await request({
    url: `${endPoint}/active`,
    method: 'get',
  });
  return mapToRentalConfig(response.data);
};

const postRentalConfig = async (data: RentalConfig) => {
  await request({
    url: `${endPoint}/`,
    method: 'post',
    data: {
      base_hourly_rate: data.baseHourlyRate,
      period_discounts: {
        '1hr': data.oneHourRate,
        '4hrs': data.fourHoursRate,
        '1day': data.oneDayRate,
        '1week': data.oneWeekRate,
      },
      description: data.description,
    },
  });
};
export { getCurrentRentalConfig, postRentalConfig };
