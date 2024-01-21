import { RegisterRequest, loginRequest, loginTypeEnum, requestConfirmT } from '../interfaces/login.';
import { loginUrl, registerUrl, requestConfirmUrl, sendConfirmUrl } from '../config/config';
import { requestHandler } from './request.handler';


export async function apiAuthLogin(data: loginRequest) {
  return await requestHandler('post', data, loginUrl, undefined);
}

export async function apiAuthRegister(data: RegisterRequest) {
  return await requestHandler('post', data, registerUrl, undefined);
}

export async function apiAuthRequestConfirm(address: string, type: loginTypeEnum) {
  return await requestHandler('get', undefined, requestConfirmUrl, {address: address, type : type});
}

export async function apiAuthSendConfirm(address: string, type: loginTypeEnum, code: string) {
  return await requestHandler('get', undefined, sendConfirmUrl, {address, type, code});
}
