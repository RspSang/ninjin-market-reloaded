import {
  PRODUCT_DESCRIPTION_REQUIRED_ERROR,
  PRODUCT_PHOTO_REQUIRED_ERROR,
  PRODUCT_TITLE_REQUIRED_ERROR,
  PRODUCT_PRICE_REQUIRED_ERROR,
  PRODUCT_PHOTO_INVALID_TYPE_ERROR,
  PRODUCT_PHOTO_INVALID_SIZE_ERROR,
} from '@/lib/constants';
import { z } from 'zod';

export const fileSchema = z.object({
  type: z.string().refine(value => value.includes('image'), {
    message: PRODUCT_PHOTO_INVALID_TYPE_ERROR,
  }),
  size: z.number().max(1024 * 1024 * 2, {
    message: PRODUCT_PHOTO_INVALID_SIZE_ERROR,
  }),
});

export const productSchema = z.object({
  photo: z
    .string({ error: PRODUCT_PHOTO_REQUIRED_ERROR })
    .min(1, { message: PRODUCT_PHOTO_REQUIRED_ERROR }),
  title: z
    .string({ error: PRODUCT_TITLE_REQUIRED_ERROR })
    .min(1, { message: PRODUCT_TITLE_REQUIRED_ERROR }),
  description: z
    .string({ error: PRODUCT_DESCRIPTION_REQUIRED_ERROR })
    .min(1, { message: PRODUCT_DESCRIPTION_REQUIRED_ERROR }),
  price: z.coerce
    .number({ error: PRODUCT_PRICE_REQUIRED_ERROR })
    .min(1, { message: PRODUCT_PRICE_REQUIRED_ERROR }),
});

export type ProductType = z.infer<typeof productSchema>;

export const commentFormSchema = z.object({
  payload: z.string().min(1, { message: 'コメントを入力してください' }),
});

export type CommentFormType = z.infer<typeof commentFormSchema>;
