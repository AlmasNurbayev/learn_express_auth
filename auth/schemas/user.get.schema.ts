import { z } from 'zod';

export const UserGetSchema = z.object({
  query: z.object({
    id: z
      .string()
      .transform((val) => Number(val))
      .pipe(z.number().min(1))
      .optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
    order: z
      .string()
      .transform((val) => JSON.parse(val))
      .pipe(z.record(z.string()))
      .optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    page: z
      .string()
      .transform((val) => Number(val))
      .pipe(z.number().min(1))
      .optional(),
  }),
});
