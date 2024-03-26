'use client';

import Input from '../components/input';
import Button from '../components/button';
import SocialLogin from '../components/social-login';
import { useFormState } from 'react-dom';
import { createAccount } from './actions';

export default function CreateAccount() {
  const [state, action] = useFormState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">こんにちは！</h1>
        <h2 className="text-xl">フォームを作成して会員登録しましょう</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="username"
          type="text"
          placeholder="ユーザーネーム"
          required
          minLength={3}
          maxLength={10}
          errors={state?.fieldErrors.username}
        />
        <Input
          name="email"
          type="email"
          placeholder="Eメール"
          required
          errors={state?.fieldErrors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="パスワード"
          required
          minLength={10}
          maxLength={64}
          errors={state?.fieldErrors.password}
        />
        <Input
          name="confirm_password"
          type="password"
          placeholder="パスワードの確認"
          required
          minLength={10}
          maxLength={64}
          errors={state?.fieldErrors.confirm_password}
        />
        <Button text="アカウント作成" />
      </form>
      <SocialLogin />
    </div>
  );
}
