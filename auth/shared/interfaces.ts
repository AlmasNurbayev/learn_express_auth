export enum LoginTypeEnum {
  email = 'email',
  phone = 'phone',
}

export interface IJwtPayload {
  id: number;
  email?: string;
  phone?: string;
}
