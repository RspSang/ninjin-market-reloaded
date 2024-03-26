import Input from '../components/input';
import FormButton from '../components/button';
import { useFormState } from 'react-dom';
import { smsVerification } from './actions';

export default function SMSLogin() {
  const [state, action] = useFormState(smsVerification, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMSログイン</h1>
        <h2 className="text-xl">携帯番号を認証しましょう</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input name="phone" type="number" placeholder="携帯番号" required />
        <Input name="token" type="number" placeholder="認証番号" required />
        <FormButton text="認証" />
      </form>
    </div>
  );
}
