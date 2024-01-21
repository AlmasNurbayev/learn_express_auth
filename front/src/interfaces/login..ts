import { Iuser } from './user';

export type loginResponse = {
  accessToken: string;
  refreshToken: string;
  data: Iuser;
};

export type loginRequest = {
  phone?: string;
  email?: string;
  password: string;
};

export type RegisterRequest = {
  phone?: string;
  email?: string;
  password: string;
  name: string;
};

export enum loginTypeEnum {
  email = 'email',
  phone = 'phone',
}

export type sendConfirmT = {
  address: string;
  type: loginTypeEnum;
  code: string;
};
