'use server';

import { z } from 'zod';
import {
  EMAIL_FORMAT_ERROR,
  EMAIL_REQUIRED_ERROR,
  EMAIL_UNIQUE_ERROR,
  PASSWORD_INVALID_ERROR,
  PASSWORD_INVALID_TYPE_ERROR,
  PASSWORD_REQUIRED_ERROR,
} from '../lib/constants';
import db from '../lib/db';
import bcrypt from 'bcrypt';
import { saveSession } from '@/lib/session';
import { redirect } from 'next/navigation';

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formScheme = z.object({
  email: z
    .email({
      error: issue =>
        issue.input === '' ? EMAIL_REQUIRED_ERROR : EMAIL_FORMAT_ERROR,
    })
    .refine(checkUniqueEmail, { error: EMAIL_UNIQUE_ERROR }),
  password: z
    .string({ error: PASSWORD_INVALID_TYPE_ERROR })
    .min(1, { error: PASSWORD_REQUIRED_ERROR }),
});

export async function login(prevState: any, formData: FormData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };
  const result = await formScheme.safeParseAsync(data);
  if (!result.success) {
    return z.flattenError(result.error);
  } else {
    // if the user is found, check password hash
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(result.data.password, user!.password ?? '');
    if (ok) {
      await saveSession(user!.id);
      redirect('/profile');
    } else {
      return { fieldErrors: { password: [PASSWORD_INVALID_ERROR], email: [] } };
    }
  }
}
