'use server';

import { z } from 'zod';
import {
  EMAIL_REQUIRED_ERROR,
  PASSWORD_CHECK_ERROR,
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
        invalid_type_error: USERNAME_INVALID_TYPE_ERROR,
        required_error: USERNAME_REQUIRED_ERROR,
      })
      .min(USERNAME_MIN_LENGTH, USERNAME_MIN_LENGTH_ERROR)
      .max(USERNAME_MAX_LENGTH, USERNAME_MAX_LENGTH_ERROR)
      .toLowerCase()
      .trim(),
    email: z
      .string({ required_error: EMAIL_REQUIRED_ERROR })
      .email()
      .toLowerCase(),
    password: z
      .string({ required_error: PASSWORD_REQUIRED_ERROR })
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR)
      .max(PASSWORD_MAX_LENGTH, PASSWORD_MAX_LENGTH_ERROR)
      .regex(passwordRegex, PASSWORD_REGEX_ERROR),
    confirm_password: z
      .string({ required_error: PASSWORD_REQUIRED_ERROR })
      .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR)
      .max(PASSWORD_MAX_LENGTH, PASSWORD_MAX_LENGTH_ERROR),
  })
  .refine(checkPassword, {
    message: PASSWORD_CHECK_ERROR,
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
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}
