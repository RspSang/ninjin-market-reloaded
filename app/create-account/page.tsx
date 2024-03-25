import FormInput from '../components/form-input';
import FormButton from '../components/form-btn';
import SocialLogin from '../components/social-login';

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">こんにちは！</h1>
        <h2 className="text-xl">フォームを作成して会員登録しましょう</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput
          type="text"
          placeholder="ユーザーネーム"
          required
          errors={[]}
        />
        <FormInput type="email" placeholder="Eメール" required errors={[]} />
        <FormInput
          type="password"
          placeholder="パスワード"
          required
          errors={[]}
        />
        <FormInput
          type="password"
          placeholder="パスワードの確認"
          required
          errors={[]}
        />
        <FormButton loading={false} text="アカウント作成" />
      </form>
      <SocialLogin />
    </div>
  );
}
