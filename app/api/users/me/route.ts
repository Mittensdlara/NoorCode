import { getSession } from '@/server/auth/session';
import { db } from '@/server/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: { code: 'UNAUTHORISED', message: 'Sign in required' } }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true
    }
  });

  return NextResponse.json({ user });
}
