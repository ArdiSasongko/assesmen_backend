import { z, ZodType } from 'zod';

export class userValidation {
  static readonly registerValidation: ZodType = z.object({
    username: z.string().min(6).max(100),
    password: z.string().min(6).max(100),
  });

  static readonly loginValidation: ZodType = z.object({
    username: z.string().min(6).max(100),
    password: z.string().min(6).max(100),
  });
}
