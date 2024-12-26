'use client';

import Input from '../components/input';
import Button from '../components/button';
import SocialLogin from '../components/social-login';
import { login } from './actions';
import { useFormState } from 'react-dom';

export default function Login() {
  const [state, action] = useFormState(login, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">こんにちは！</h1>
        <h2 className="text-xl">
          Eメールとパスワードを入力しログインしましょう
        </h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="email"
          type="email"
          placeholder="Eメール"
          errors={state?.fieldErrors?.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="パスワード"
          errors={state?.fieldErrors?.password}
        />
        <Button text="ログイン" />
      </form>
      <SocialLogin />
    </div>
  );
}
