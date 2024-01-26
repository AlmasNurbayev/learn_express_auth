import { z } from 'zod';
import { LoginTypeEnum } from '../../../shared/interfaces';

export const AuthConfirmSchema = z.object({
  query: z.object({
    code: z.string(),
    address: z.string(),
    type: z.nativeEnum(LoginTypeEnum),
  }),
});
