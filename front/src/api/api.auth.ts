import {
  RegisterRequest,
  loginRequest,
  loginTypeEnum,
} from '../interfaces/login.';
import {
  backUrl,
  getMeUrl,
  loginUrl,
  registerUrl,
  requestConfirmUrl,
  sendConfirmUrl,
} from '../config/config';
import { requestHandler } from './request.handler';

export async function apiAuthLogin(data: loginRequest) {
  return await requestHandler({
    method: 'post',
    data,
    url: loginUrl,
    withCredentials: true,
  });
}

export async function apiAuthRegister(data: RegisterRequest) {
  return await requestHandler({ method: 'post', data, url: registerUrl });
}

export async function apiAuthRequestConfirm(
  address: string,
  type: loginTypeEnum
) {
  return await requestHandler({
    method: 'get',
    url: requestConfirmUrl,
    params: { address: address, type: type },
  });
}

export async function apiAuthSendConfirm(
  address: string,
  type: loginTypeEnum,
  code: string
) {
  return await requestHandler({
    method: 'get',
    url: sendConfirmUrl,
    params: {
      address,
      type,
      code,
    },
  });
}

export async function apiAuthMe() {
  return await requestHandler({
    method: 'get',
    url: getMeUrl,
  });
}

export async function apiAuthRefresh() {
  return await requestHandler({
    method: 'get',
    url: backUrl + '/auth/refresh',
    withCredentials: true,
  });
}
