/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '@/lib/request';
import { Bound } from '@/stores/bound-store';

const endPoint = '/no-parking-zones';

const mapToBound = (data: any): Bound => ({
  id: data.id,
  name: data.name,
  coordinates: data.coordinates.map((coord: any) => [coord.lat, coord.lng]),
  description: data.description || '',
});

const getNoParkingZones = async (): Promise<Bound[]> => {
  const response = await request({
    url: `${endPoint}/`,
    method: 'get',
  });
  if (Array.isArray(response.data)) {
    return response.data.map((item: any) => mapToBound(item));
  }

  return [];
};

const postZone = async (zone: Bound): Promise<void> => {
  await request({
    url: `${endPoint}/`,
    method: 'post',
    data: {
      name: zone.name,
      coordinates: zone.coordinates.map(coord => ({
        lat: coord[0],
        lng: coord[1],
      })),
      description: zone.description,
    },
  });
};

const deleteZone = async (id: number): Promise<void> => {
  await request({
    url: `${endPoint}/${id}`,
    method: 'delete',
  });
};
export { deleteZone, getNoParkingZones, postZone };
