import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <span className="text-9xl">🥕</span>
        <h1 className="text-4xl">にんじん</h1>
        <h2 className="text-2xl">にんじんマーケットへようこそ！</h2>
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link href={'/create-account'} className="primary-btn py-2.5 text-lg">
          スタート
        </Link>
        <div className="flex gap-2">
          <span>既にアカウントをお持ちでしょうか？</span>
          <Link href={'/login'} className="hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
