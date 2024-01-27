import { constants } from '../constants';
import { IJwtPayload } from './interfaces';
import jwt from 'jsonwebtoken';

export function generateAccessToken(payload: IJwtPayload) {
  return jwt.sign(payload, constants.secret_jwt, { expiresIn: '1h' });
}

export function generateRefreshToken(payload: IJwtPayload) {
  return jwt.sign(payload, constants.secret_jwt, { expiresIn: '30d' });
}

export async function verifyToken(token: string) {
  return jwt.verify(token, constants.secret_jwt) as IJwtPayload;
}
