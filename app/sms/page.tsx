import Input from '../components/input';
import { useFormState } from 'react-dom';
import { smsVerification } from './actions';
import Button from '../components/button';

export default function SMSLogin() {
  const [state, action] = useFormState(smsVerification, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMSログイン</h1>
        <h2 className="text-xl">携帯番号を認証しましょう</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input name="phone" type="text" placeholder="携帯番号" />
        <Input name="token" type="number" placeholder="認証番号" />
        <Button text="認証" />
      </form>
    </div>
  );
}
