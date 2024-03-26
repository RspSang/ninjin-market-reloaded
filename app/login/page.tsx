'use client';

import FormInput from '../components/form-input';
import FormButton from '../components/form-btn';
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
        <FormInput name="email" type="email" placeholder="Eメール" required />
        <FormInput
          name="password"
          type="password"
          placeholder="パスワード"
          required
        />
        <FormButton text="ログイン" />
      </form>
      <SocialLogin />
    </div>
  );
}
