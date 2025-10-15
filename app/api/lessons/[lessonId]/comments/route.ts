import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { getSession } from '@/server/auth/session';

const commentSchema = z.object({
  content: z.string().min(2)
});

export async function GET(_: Request, { params }: { params: { lessonId: string } }) {
  const comments = await db.comment.findMany({
    where: { lessonId: params.lessonId },
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ comments });
}

export async function POST(request: Request, { params }: { params: { lessonId: string } }) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: 'UNAUTHORISED', message: 'Sign in required' } }, { status: 401 });
  }
  const payload = await request.json();
  const parsed = commentSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid payload', details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  const comment = await db.comment.create({
    data: {
      lessonId: params.lessonId,
      authorId: session.user.id,
      content: parsed.data.content
    }
  });

  return NextResponse.json({ comment }, { status: 201 });
}
