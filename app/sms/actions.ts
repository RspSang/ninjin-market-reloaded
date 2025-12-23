'use server';

import { z } from 'zod';
import validator from 'validator';
import { PHONE_FORMAT_ERROR } from '../lib/constants';
import { redirect } from 'next/navigation';

const phoneSchema = z
  .string()
  .trim()
  .refine(phone => validator.isMobilePhone(phone, 'ja-JP'), PHONE_FORMAT_ERROR)
  .transform(phone => {
    const cleanedPhone = phone.replace(/^0/, '');
    return `+81${cleanedPhone}`;
  });

const tokenScheme = z.coerce.number().min(100000).max(999999);

interface ActionState {
  token: boolean;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get('phone');
  const token = formData.get('token');
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: z.flattenError(result.error),
      };
    } else {
      return {
        token: true,
      };
    }
  } else {
    const result = tokenScheme.safeParse(token);
    if (!result.success) {
      return { token: true, error: z.flattenError(result.error) };
    } else {
      redirect('/');
    }
  }
}
