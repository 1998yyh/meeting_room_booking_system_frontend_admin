import request from '../utils/request'
import { baseResponse } from './base';



export async function bookingSearch(
  pageNo: number = 1,
  pageSize: number = 10,
  username?: string,
  meetingRoomName?: string,
  meetingRoomPosition?: string,
  bookingTimeRangeStart?: number,
  bookingTimeRangeEnd?: number
): Promise<baseResponse> {
  return await request.get('/booking/list', {
    params: {
      pageNo,
      pageSize,
      username,
      meetingRoomName,
      meetingRoomPosition,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
    }
  });
}

export async function applyBooking(id: number): Promise<baseResponse> {
  return await request.get('/booking/apply/' + id)
}

export async function rejectBooking(id: number): Promise<baseResponse> {
  return await request.get('/booking/reject/' + id)
}

export async function unbindBooking(id: number): Promise<baseResponse> {
  return await request.get('/booking/unbind/' + id)
}

