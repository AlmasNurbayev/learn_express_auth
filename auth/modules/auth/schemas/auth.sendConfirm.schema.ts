import { z } from 'zod';
import { LoginTypeEnum } from '../../../shared/interfaces';

export const AuthSendConfirmSchema = z.object({
  query: z.object({
    address: z.string(),
    type: z.nativeEnum(LoginTypeEnum),
  }),
});
