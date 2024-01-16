import { z } from 'zod';
import { LoginTypeEnum } from '../../../shared/login_type.enum';

export const AuthSendConfirmSchema = z.object({
  query: z.object({
    address: z.string(),
    type: z.nativeEnum(LoginTypeEnum),
  }),
});
