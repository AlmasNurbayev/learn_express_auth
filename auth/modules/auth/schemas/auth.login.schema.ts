import { z } from 'zod';

export const AuthLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Not a valid email').optional(),
    phone: z.string().optional(),
    password: z.string({
      required_error: 'password is required',
    }),
  }),
});
