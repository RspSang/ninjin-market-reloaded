import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">こんにちは！</h1>
        <h2 className="text-xl">フォームを作成して会員登録しましょう</h2>
      </div>
      <form className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <input
            className="bg-transparent rounded-md w-full h-10 ring-1 ring-neutral-200 border-none focus:outline-none focus:ring-2 focus:ring-orange-500  placeholder:text-neutral-400"
            type="text"
            placeholder="ユーザーネーム"
            required
          />
          <span className="text-red-500 font-medium">エラー</span>
        </div>
        <button className="primary-btn h-10">アカウント作成</button>
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
