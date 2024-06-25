'use client';

import Input from '../components/input';
import { useFormState } from 'react-dom';
import { smsLogin } from './actions';
import Button from '../components/button';

const initialState = { token: false, error: undefined };

export default function SMSLogin() {
  const [state, action] = useFormState(smsLogin, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMSログイン</h1>
        <h2 className="text-xl">携帯番号を認証しましょう</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        {state?.token ? (
          <Input name="token" type="number" placeholder="認証番号" />
        ) : (
          <Input
            name="phone"
            type="text"
            placeholder="携帯番号"
            errors={state?.error?.formErrors}
          />
        )}
        <Button text={state?.token ? 'トークン認証' : 'SMSを送って認証'} />
      </form>
    </div>
  );
}
