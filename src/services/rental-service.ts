/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '@/lib/request';
import { Rental } from '@/services/types';
const endPoint = '/rentals';

const mapToRentalType = (data: any): Rental => {
  return {
    id: data.id,
    userId: data.user_id,
    startTime: data.start_time,
    endTime: data.end_time,
    scooterId: data.scooter_id,
    status: data.status,
    period: data.rental_period,
    cost: data.cost,
  };
};
const getRentals = async (): Promise<Rental[]> => {
  const response = await request({
    url: `${endPoint}/`,
    method: 'get',
  });
  if (Array.isArray(response.data)) {
    return response.data.map(mapToRentalType);
  }

  return [];
};

const postRental = async (
  scooterId: number,
  startTime: string,
  period: '1hr' | '4hrs' | '1day' | '1week'
) => {
  await request({
    url: `${endPoint}/`,
    method: 'post',
    data: {
      scooter_id: scooterId,
      start_time: startTime,
      rental_period: period,
    },
  });
};

const deleteRental = async (id: number) => {
  await request({
    url: `${endPoint}/${id}`,
    method: 'delete',
  });
};

export { deleteRental, getRentals, postRental };
