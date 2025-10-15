import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { getSession } from '@/server/auth/session';
import { getIO } from '@/server/realtime/socket';

const messageSchema = z.object({
  content: z.string().min(1)
});

export async function GET(_: Request, { params }: { params: { threadId: string } }) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: 'UNAUTHORISED', message: 'Sign in required' } }, { status: 401 });
  }

  const messages = await db.message.findMany({
    where: { threadId: params.threadId },
    include: { author: true },
    orderBy: { createdAt: 'asc' }
  });

  return NextResponse.json({ messages });
}

export async function POST(request: Request, { params }: { params: { threadId: string } }) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: 'UNAUTHORISED', message: 'Sign in required' } }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = messageSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid payload', details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  const message = await db.message.create({
    data: {
      threadId: params.threadId,
      authorId: session.user.id,
      content: parsed.data.content
    }
  });

  getIO()?.to(params.threadId).emit('message', message);

  return NextResponse.json({ message }, { status: 201 });
}
