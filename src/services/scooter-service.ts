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
const postScooter = async (
  model: string,
  location: {
    lat: number;
    lng: number;
  },
  pricePerHour: number
) => {
  const newScooter = await request({
    url: `${endPoint}/`,
    method: 'post',
    data: {
      model,
      location,
      battery_level: 100,
      status: 'available',
    },
  });
  await request({
    url: '/scooter-prices/',
    method: 'post',
    data: {
      model: newScooter.data.model,
      price_per_hour: pricePerHour,
    },
  });
};
const getTypeAndPrice = async (type: string) => {
  const response = await request({
    url: `/scooter-prices/${type}`,
    method: 'get',
  });
  return {
    type: response.data.model,
    pricePerHour: response.data.price_per_hour,
    id: response.data.id,
  };
};
const putScooterAndPrice = async (
  id: number,
  type: string,
  pricePerHour: number
) => {
  await request({
    url: `/scooter-prices/${id}`,
    method: 'put',
    data: {
      model: type,
      price_per_hour: pricePerHour,
    },
  });
};
const putScooter = async (
  id: number,
  type?: string,
  status?: string,
  location?: { lat: number; lng: number },
  battery?: number
) => {
  await request({
    url: `${endPoint}/${id}`,
    method: 'put',
    data: {
      model: type,
      status,
      location,
      battery_level: battery,
    },
  });
};

const deleteScooter = async (id: number) => {
  const response = await request({
    url: `${endPoint}/${id}`,
    method: 'delete',
  });
  const model = response.data.model;
  const priceId = (await getTypeAndPrice(model)).id;
  await request({
    url: `/scooter-prices/${priceId}`,
    method: 'delete',
  });
};
export {
  deleteScooter,
  getScooters,
  getTypeAndPrice,
  postScooter,
  putScooter,
  putScooterAndPrice,
};
