import { z } from 'zod';

export const UserGetSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => Number(val))
      .pipe(z.number().min(1))
      .optional(),
  }),
});
