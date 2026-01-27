import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionContent {
  id?: number;
}

export default async function getSession() {
  return getIronSession<SessionContent>(await cookies(), {
    cookieName: 'session',
    password: process.env.SESSION_PASSWORD!,
  });
}

export const saveSession = async (userId: number) => {
  const session = await getSession();
  session.id = userId;
  await session.save();
};

export async function checkIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}
