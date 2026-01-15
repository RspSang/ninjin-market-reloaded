'use server';

import { z } from 'zod';
import validator from 'validator';
import {
  PHONE_FORMAT_ERROR,
  TOKEN_FORMAT_ERROR,
  TOKEN_MAX_LENGTH,
  TOKEN_MIN_LENGTH,
  TOKEN_REQUIRED_ERROR,
} from '../../lib/constants';
import { redirect } from 'next/navigation';

const phoneSchema = z
  .string()
  .trim()
  .refine(phone => validator.isMobilePhone(phone, 'ja-JP'), PHONE_FORMAT_ERROR)
  .transform(phone => {
    const cleanedPhone = phone.replace(/^0/, '');
    return `+81${cleanedPhone}`;
  });

const tokenScheme = z
  .string({ error: TOKEN_REQUIRED_ERROR })
  .min(1, { error: TOKEN_REQUIRED_ERROR })
  .refine(
    val => {
      if (val.length === 0) return true; // min(1)에서 처리
      return /^\d+$/.test(val);
    },
    { error: TOKEN_FORMAT_ERROR }
  )
  .transform(val => parseInt(val, 10))
  .refine(num => num >= TOKEN_MIN_LENGTH && num <= TOKEN_MAX_LENGTH, {
    error: TOKEN_FORMAT_ERROR,
  });

interface ActionState {
  isTokenVerified: boolean;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get('phone');
  const token = formData.get('token');
  if (!prevState.isTokenVerified) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        isTokenVerified: false,
        error: z.flattenError(result.error),
      };
    } else {
      return {
        isTokenVerified: true,
      };
    }
  } else {
    const result = tokenScheme.safeParse(token);
    if (!result.success) {
      return { isTokenVerified: true, error: z.flattenError(result.error) };
    } else {
      redirect('/');
    }
  }
}
