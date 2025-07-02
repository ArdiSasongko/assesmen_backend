import { z, ZodType } from 'zod';

export class ProductValidation {
  static readonly createProduct: ZodType = z.object({
    name: z.string().min(1, 'name is required'),
    description: z.string().min(1, 'description is required').max(300),
    price: z.number().min(1, 'price must greater than 0'),
  });

  static readonly updateProduct: ZodType = z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).max(300).optional(),
    price: z.number().min(1).optional(),
  });
}
