import { z } from 'zod';
import { LoginTypeEnum } from '../../../shared/login_type.enum';

export const AuthConfirmSchema = z.object({
  query: z.object({
    code: z.string(),
    address: z.string(),
    type: z.nativeEnum(LoginTypeEnum),
  }),
});
