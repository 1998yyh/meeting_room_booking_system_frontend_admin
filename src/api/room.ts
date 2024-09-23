import request from '../utils/request'
import { baseResponse } from './base';


export interface CreateMeetingRoom {
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
}


export interface UpdateMeetingRoom extends CreateMeetingRoom {
  id: number
}



export async function roomSearch(
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
  return await request.post('/meeting-room/delete/' + id)
}

export async function createRoom(data: CreateMeetingRoom): Promise<baseResponse> {
  return await request.post('/meeting-room/create/', data)
}


export async function getRoom(id: number): Promise<baseResponse> {
  return await request.get('/meeting-room/room/' + id)
}


export async function renewalRoom(data: UpdateMeetingRoom): Promise<baseResponse> {
  return await request.post('/meeting-room/update/', data)
}

