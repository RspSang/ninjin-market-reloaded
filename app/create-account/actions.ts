'use server';

import { z } from 'zod';

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);
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
        invalid_type_error: '文字を入力ください',
        required_error: 'ユーザーネームを入力ください',
      })
      .min(3, 'ユーザーネームが短いです')
      .max(10, 'ユーザーネームが長いです')
      .toLowerCase()
      .trim()
      .refine(checkUsername, 'potatoは許容されません'),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(10)
      .max(64)
      .regex(
        passwordRegex,
        'パスワードは英字大小文字、数字、特殊文字が必要です'
      ),
    confirm_password: z.string().min(10).max(64),
  })
  .refine(checkPassword, {
    message: 'パスワードが一致していません',
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
