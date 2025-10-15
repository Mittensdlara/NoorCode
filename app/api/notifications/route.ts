import { NextResponse } from 'next/server';
import { getSession } from '@/server/auth/session';
import { db } from '@/server/db';

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: 'UNAUTHORISED', message: 'Sign in required' } }, { status: 401 });
  }

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id, readAt: null },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ notifications });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: 'UNAUTHORISED', message: 'Sign in required' } }, { status: 401 });
  }

  const body = await request.json();
  const ids: string[] = body?.ids || [];

  await db.notification.updateMany({
    where: {
      userId: session.user.id,
      id: { in: ids }
    },
    data: { readAt: new Date() }
  });

  return NextResponse.json({ success: true });
}
