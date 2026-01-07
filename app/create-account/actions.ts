'use server';

import { z } from 'zod';
import {
  EMAIL_FORMAT_ERROR,
  EMAIL_REQUIRED_ERROR,
  EMAIL_UNIQUE_ERROR,
  PASSWORD_CHECK_ERROR,
  PASSWORD_INVALID_TYPE_ERROR,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MAX_LENGTH_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  PASSWORD_REQUIRED_ERROR,
  USERNAME_INVALID_TYPE_ERROR,
  USERNAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH_ERROR,
  USERNAME_MIN_LENGTH,
  USERNAME_MIN_LENGTH_ERROR,
  USERNAME_REQUIRED_ERROR,
  USERNAME_UNIQUE_ERROR,
} from '../lib/constants';
import db from '../lib/db';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import getSession from '../lib/session';

const passwordRegex = new RegExp(PASSWORD_REGEX);

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formScheme = z
  .object({
    username: z
      .string({
        error: issue =>
          issue.input === undefined
            ? USERNAME_REQUIRED_ERROR
            : USERNAME_INVALID_TYPE_ERROR,
      })
      .min(USERNAME_MIN_LENGTH, { error: USERNAME_MIN_LENGTH_ERROR })
      .max(USERNAME_MAX_LENGTH, { error: USERNAME_MAX_LENGTH_ERROR })
      .refine(checkUniqueUsername, { error: USERNAME_UNIQUE_ERROR })
      .trim(),
    email: z
      .email({
        error: issue =>
          issue.input === '' ? EMAIL_REQUIRED_ERROR : EMAIL_FORMAT_ERROR,
      })
      .refine(checkUniqueEmail, { error: EMAIL_UNIQUE_ERROR }),
    password: z
      .string({
        error: issue =>
          issue.input === undefined
            ? PASSWORD_REQUIRED_ERROR
            : PASSWORD_INVALID_TYPE_ERROR,
      })
      .min(PASSWORD_MIN_LENGTH, { error: PASSWORD_MIN_LENGTH_ERROR })
      .max(PASSWORD_MAX_LENGTH, { error: PASSWORD_MAX_LENGTH_ERROR })
      .regex(passwordRegex, { error: PASSWORD_REGEX_ERROR }),
    confirm_password: z
      .string({
        error: issue =>
          issue.input === undefined
            ? PASSWORD_REQUIRED_ERROR
            : PASSWORD_INVALID_TYPE_ERROR,
      })
      .min(PASSWORD_MIN_LENGTH, { error: PASSWORD_MIN_LENGTH_ERROR })
      .max(PASSWORD_MAX_LENGTH, { error: PASSWORD_MAX_LENGTH_ERROR }),
  })
  .refine(checkPassword, {
    error: PASSWORD_CHECK_ERROR,
    path: ['confirm_password'],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  };
  const result = await formScheme.safeParseAsync(data);
  if (!result.success) {
    return z.flattenError(result.error);
  } else {
    // hash the password
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    // save the user to db
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    // log the user in
    const session = await getSession();
    session.id = user.id;
    await session.save();
    // redirect "/home"
    redirect('/profile');
  }
}
