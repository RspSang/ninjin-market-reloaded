'use server';

import { z } from 'zod';
import {
  EMAIL_REQUIRED_ERROR,
  PASSWORD_REQUIRED_ERROR,
} from '../lib/constants';

const formScheme = z.object({
  email: z.string().min(1, EMAIL_REQUIRED_ERROR),
  password: z.string().min(1, PASSWORD_REQUIRED_ERROR),
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
