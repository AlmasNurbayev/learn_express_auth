export enum LoginTypeEnum {
  email = 'email',
  phone = 'phone',
}

export interface IJwtPayload {
  id: number;
  email?: string;
  phone?: string;
}

export interface IUser {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  external_id?: number;
}
