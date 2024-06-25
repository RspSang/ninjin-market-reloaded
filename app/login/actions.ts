'use server';

import { z } from 'zod';
import {
  EMAIL_REQUIRED_ERROR,
  EMAIL_TYPE_ERROR,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  PASSWORD_REQUIRED_ERROR,
} from '../lib/constants';

const formScheme = z.object({
  email: z
    .string({ required_error: EMAIL_REQUIRED_ERROR })
    .email({ message: EMAIL_TYPE_ERROR })
    .toLowerCase(),
  password: z
    .string({ required_error: PASSWORD_REQUIRED_ERROR })
    .min(1, PASSWORD_REQUIRED_ERROR),
});

export async function login(prevState: any, formData: FormData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };
  const result = formScheme.safeParse(data);
  if (!result.success) {
    console.log(result.error.flatten());
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
  return {
    errors: ['wrong password', 'password too short'],
  };
}
