import request from '../utils/request'
import { baseResponse } from './base';


export async function userSearch(pageNo:number = 1,pageSize:number= 10,username?:string,nickName?:string,email?:string): Promise<baseResponse> {
  return await request.get('/user/list',{
    params:{
      pageNo,
      pageSize,
      username,
      nickName,
      email,
    }
  });
}


export async function freeze(id:number):Promise<baseResponse> {
  return await request.get('/user/freeze',{
    params:{
      id
    }
  })
}