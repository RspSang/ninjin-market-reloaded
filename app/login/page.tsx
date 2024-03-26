'use client';

import Input from '../components/input';
import Button from '../components/button';
import SocialLogin from '../components/social-login';
import { handleForm } from './actions';
import { useFormState } from 'react-dom';

export default function Login() {
  const [state, action] = useFormState(handleForm, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">こんにちは！</h1>
        <h2 className="text-xl">
          Eメールとパスワードを入力しログインしましょう
        </h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input name="email" type="email" placeholder="Eメール" required />
        <Input
          name="password"
          type="password"
          placeholder="パスワード"
          required
        />
        <Button text="ログイン" />
      </form>
      <SocialLogin />
    </div>
  );
}
