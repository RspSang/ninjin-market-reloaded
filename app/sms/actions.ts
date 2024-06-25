'use server';

import { z } from 'zod';
import validator from 'validator';
import {
  EMAIL_REQUIRED_ERROR,
  PASSWORD_REQUIRED_ERROR,
} from '../lib/constants';

const formScheme = z.object({
  phone: z.string().min(1, EMAIL_REQUIRED_ERROR),
  token: z.string().min(1, PASSWORD_REQUIRED_ERROR),
});

const phoneSchema = z.string().trim().refine(validator.isMobilePhone);

const tokenScheme = z.coerce.number().min(100000).max(999999)

export async function smsVerification(prevState: any, formData: FormData) {
  const data = {
    phone: formData.get('phone'),
    token: formData.parse('token'),
  };
  const result = formScheme.safeParse(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return { success: false, fieldErrors: result.error.flatten().fieldErrors };
  } else {
    console.log(result.data);
  }
  return {
    success: true,
    errors: ['wrong password', 'password too short'],
  };
}
