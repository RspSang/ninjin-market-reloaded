'use server';

import { z } from 'zod';
import {
  EMAIL_FORMAT_ERROR,
  EMAIL_REQUIRED_ERROR,
  PASSWORD_REQUIRED_ERROR,
} from '../lib/constants';

const formScheme = z.object({
  email: z
    .string({ required_error: EMAIL_REQUIRED_ERROR })
    .email({ message: EMAIL_FORMAT_ERROR })
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
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
