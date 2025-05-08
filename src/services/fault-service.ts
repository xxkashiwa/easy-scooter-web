/* eslint-disable @typescript-eslint/no-explicit-any */
import request from '@/lib/request';
import { Fault } from './types';

const endPoint = '/feedbacks/admin';

const mapToFaultType = (data: any): Fault => ({
  id: data.id,
  type: data.feedback_type,
  detail: data.feedback_detail,
  scooterId: data.scooter_id,
  rentalId: data.rental_id,
  userId: data.user_id,
  priority: data.priority,
  status: data.status,
  createdAt: data.created_at,
  userName: data.user_name,
  image: data.image,
});

const getFaults = async (): Promise<Fault[]> => {
  const response = await request({
    url: `${endPoint}/all`,
    method: 'get',
  });
  if (Array.isArray(response.data)) {
    return response.data.map(mapToFaultType);
  }
  return [];
};

const resolveFault = async (id: number, notes = 'admin resolved') => {
  await request({
    url: `${endPoint}/${id}/resolve?resolution_notes=${notes}`,
    method: 'post',
  });
};

const deleteFault = async (id: number) => {
  await request({
    url: `${endPoint}/${id}`,
    method: 'delete',
  });
};

const putFault = async (id: number, priority: string) => {
  await request({
    url: `${endPoint}/${id}`,
    method: 'put',
    data: {
      priority,
    },
  });
};
export { deleteFault, getFaults, putFault, resolveFault };
