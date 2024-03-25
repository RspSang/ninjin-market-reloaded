import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import FormInput from '../components/form-input';
import FormButton from '../components/form-btn';

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
      <div className="w-full h-px bg-neutral-500" />
      <div>
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-3"
          href="/sms"
        >
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="size-6" />
          </span>
          <span>SMSを利用し会員登録</span>
        </Link>
      </div>
    </div>
  );
}
