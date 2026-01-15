'use client';

import Input from '../../components/Input';
import { useActionState } from 'react';
import { smsLogin } from './actions';
import Button from '../../components/Button';

const initialState = { isTokenVerified: false, error: undefined };

export default function SMSLogin() {
  const [state, action] = useActionState(smsLogin, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMSログイン</h1>
        <h2 className="text-xl">携帯番号を認証しましょう</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        {state?.isTokenVerified ? (
          <Input
            key="token"
            name="token"
            type="number"
            placeholder="認証番号"
            errors={state?.error?.formErrors}
          />
        ) : (
          <Input
            key="phone"
            name="phone"
            type="text"
            placeholder="携帯番号"
            errors={state?.error?.formErrors}
          />
        )}
        <Button
          text={state?.isTokenVerified ? 'トークン認証' : 'SMSを送って認証'}
        />
      </form>
    </div>
  );
}
