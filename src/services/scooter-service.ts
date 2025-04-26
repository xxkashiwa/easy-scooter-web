/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '@/lib/request';
import { Scooter } from './types';

const endPoint = '/scooters';

const mapToScooterType = (data: any): Scooter => ({
  id: data.id,
  type: data.model,
  status: data.status,
  location: data.location,
  battery: data.battery,
});
const getScooters = async () => {
  const response = await request({
    url: `${endPoint}/`,
    method: 'get',
  });
  return response.data.map(mapToScooterType);
};
export { getScooters };
