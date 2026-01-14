import db from '@/lib/db';
import { saveSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

const getUniqueUsername = async (baseUsername: string) => {
  const existingUser = await db.user.findUnique({
    where: { username: baseUsername },
    select: { id: true },
  });
  return existingUser
    ? `${baseUsername}_${Math.floor(Math.random() * 10000)}`
    : baseUsername;
};

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return new Response(null, { status: 400 });
  }

  // 1. Access Token 요청
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenResponse = await fetch(
    `https://github.com/login/oauth/access_token?${accessTokenParams}`,
    {
      method: 'POST',
      headers: { Accept: 'application/json' },
    }
  );
  const { error, access_token } = await accessTokenResponse.json();
  if (error) {
    return new Response(null, { status: 400 });
  }

  // 2. GitHub 프로필 & 이메일 조회
  const userProfileResponse = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const { id, avatar_url, login } = await userProfileResponse.json();

  const userEmailResponse = await fetch('https://api.github.com/user/emails', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const emails = await userEmailResponse.json();
  const primaryEmail = emails.find(
    (email: { primary: boolean }) => email.primary
  )?.email;

  const githubId = id + '';

  // 3. github_id로 기존 유저 찾기
  const userByGithubId = await db.user.findUnique({
    where: { github_id: githubId },
    select: { id: true },
  });
  if (userByGithubId) {
    await saveSession(userByGithubId.id);
    return redirect('/profile');
  }

  // 4. email로 기존 계정 찾기 → github_id 연동
  if (primaryEmail) {
    const userByEmail = await db.user.findUnique({
      where: { email: primaryEmail },
      select: { id: true },
    });
    if (userByEmail) {
      await db.user.update({
        where: { id: userByEmail.id },
        data: { github_id: githubId, avatar: avatar_url },
      });
      await saveSession(userByEmail.id);
      return redirect('/profile');
    }
  }

  // 5. 새 계정 생성
  const username = await getUniqueUsername(login);
  const newUser = await db.user.create({
    data: {
      username,
      github_id: githubId,
      avatar: avatar_url,
      email: primaryEmail,
    },
    select: { id: true },
  });
  await saveSession(newUser.id);
  return redirect('/profile');
}
