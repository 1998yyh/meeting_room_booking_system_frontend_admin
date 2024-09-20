import request from '../utils/request'
import { baseResponse } from './base';


export async function userSearch(
  pageNo: number = 1,
  pageSize: number = 10,
  name?: string,
  capacity?: number,
  equipment?: string
): Promise<baseResponse> {
  return await request.get('/meeting-room/list', {
    params: {
      pageNo,
      pageSize,
      name,
      capacity,
      equipment,
    }
  });
}


export async function deleteRoom(id: number): Promise<baseResponse> {
  return await request.post('/meeting-room/delete/'+id)
}