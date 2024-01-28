import { z } from 'zod';

export const AuthRegisterSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: 'необходимо заполнить поле "Имя"',
        })
        .trim()
        .min(3, 'Имя должно быть дилнной не меньше 3-х символов'),
      email: z.string().email('некорректный email').optional(),
      phone: z.string().optional(),
      password: z
        .string({
          required_error: 'пароль обязателен',
        })
        .min(8, 'минимальная длина пароля 8 символов'),
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
