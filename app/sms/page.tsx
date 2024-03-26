import Input from '../components/input';
import FormButton from '../components/button';
import SocialLogin from '../components/social-login';

export default function SMSLogin() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMSログイン</h1>
        <h2 className="text-xl">携帯番号を認証しましょう</h2>
      </div>
      <form className="flex flex-col gap-3">
        <Input type="number" placeholder="携帯番号" required errors={[]} />
        <Input type="number" placeholder="認証番号" required errors={[]} />
        <FormButton text="認証" />
      </form>
    </div>
  );
}
