import { z } from 'zod';

export const AuthSignupSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Full name is required',
      })
      .trim()
      .min(3, 'Name cannot be empty'),
    email: z.string().email('Not a valid email'),
    phone: z.string().optional(),
    password: z.string({
      required_error: 'Full name is required',
    }),
  }),
});
