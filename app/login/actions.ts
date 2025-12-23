'use server';

import { z } from 'zod';
import {
  EMAIL_FORMAT_ERROR,
  EMAIL_REQUIRED_ERROR,
  PASSWORD_REQUIRED_ERROR,
} from '../lib/constants';

const formScheme = z.object({
  email: z
    .string({
      error: (issue) =>
        issue.input === undefined ? EMAIL_REQUIRED_ERROR : 'Invalid type',
    })
    .email({ error: EMAIL_FORMAT_ERROR })
    .toLowerCase(),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined ? PASSWORD_REQUIRED_ERROR : 'Invalid type',
    })
    .min(1, { error: PASSWORD_REQUIRED_ERROR }),
});

export async function login(prevState: any, formData: FormData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };
  const result = formScheme.safeParse(data);
  if (!result.success) {
    return z.flattenError(result.error);
  } else {
    console.log(result.data);
  }
}
