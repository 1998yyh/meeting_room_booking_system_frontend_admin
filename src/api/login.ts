import request from '../utils/request'
import { baseResponse } from './base';



export interface UserInfo {
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}

export async function login(username: string, password: string): Promise<baseResponse> {
  return await request.post('/user/admin/login', {
    username, password
  });
}


export async function sendRegisterCaptcha(address: string): Promise<baseResponse> {
  return await request.get('/user/register-captcha', {
    params: {
      address
    }
  })
}

export async function sendUpdateCaptcha(address: string): Promise<baseResponse> {
  return await request.get('/user/update_password/captcha', {
    params: {
      address
    }
  })
}

export async function register(data: Record<string, any>): Promise<baseResponse> {
  return await request.post('/user/register', data)
}

export async function updatePassword(data: Record<string, any>): Promise<baseResponse> {
  return await request.post('/user/admin/update_password', data)
}


export async function getUserInfo(): Promise<baseResponse> {
  return await request.get('/user/info');
}

export async function updateInfo(data: UserInfo): Promise<baseResponse> {
  return await request.post('/user/admin/update', data);
}

export async function updateUserInfoCaptcha(): Promise<baseResponse> {
  return await request.get('/user/update/captcha');
}


export async function uploadFile(file: any): Promise<baseResponse> {
  return await request.post('/user/upload', {
    file
  }, {
    headers: {
      "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>"
    }
  });
}
