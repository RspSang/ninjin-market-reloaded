'use server';

import { z } from 'zod';
import {
  EMAIL_FORMAT_ERROR,
  EMAIL_REQUIRED_ERROR,
  PASSWORD_CHECK_ERROR,
  PASSWORD_INVALID_TYPE_ERROR,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MAX_LENGTH_ERROR,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MIN_LENGTH_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
  PASSWORD_REQUIRED_ERROR,
  USERNAME_INVALID_CHARACTER_ERROR,
  USERNAME_INVALID_TYPE_ERROR,
  USERNAME_MAX_LENGTH,
  USERNAME_MAX_LENGTH_ERROR,
  USERNAME_MIN_LENGTH,
  USERNAME_MIN_LENGTH_ERROR,
  USERNAME_REQUIRED_ERROR,
} from '../lib/constants';

const passwordRegex = new RegExp(PASSWORD_REGEX);
const checkUsername = (username: string) => !username.includes('potato');
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
      .refine(checkUsername, { error: USERNAME_INVALID_CHARACTER_ERROR })
      .trim(),
    email: z.email({
      error: issue =>
        issue.input === '' ? EMAIL_REQUIRED_ERROR : EMAIL_FORMAT_ERROR,
    }),
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
  const result = formScheme.safeParse(data);
  if (!result.success) {
    return z.flattenError(result.error);
  } else {
    console.log(result.data);
  }
}
