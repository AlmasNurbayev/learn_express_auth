import { z } from 'zod';

export const AuthLoginSchema = z.object({
  body: z
    .object({
      email: z.string().email('некорректный email').optional(),
      phone: z.string().optional(),
      password: z.string({
        required_error: 'пароль обязателен',
      }),
    })
    .partial()
    .superRefine((val, ctx) => {
      if (!val.email && !val.phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'одно из полей должно быть задано',
          path: ['email', 'phone'],
        });
      }
      if (val.email && val.phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'допускается только одно поле - или email или телефон',
          path: ['email', 'phone'],
        });
      }
    }),
});
