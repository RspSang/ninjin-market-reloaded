import FormInput from '../components/form-input';
import FormButton from '../components/form-btn';
import SocialLogin from '../components/social-login';

export default function Login() {
  const handleForm = async (formData: FormData) => {
    'use server';
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('logged in!');
  };
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">こんにちは！</h1>
        <h2 className="text-xl">
          Eメールとパスワードを入力しログインしましょう
        </h2>
      </div>
      <form action={handleForm} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder="Eメール"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="パスワード"
          required
          errors={[]}
        />
        <FormButton text="ログイン" />
      </form>
      <SocialLogin />
    </div>
  );
}
