import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { getSession } from '@/server/auth/session';

const threadSchema = z.object({
  courseId: z.string(),
  mentorId: z.string(),
  studentId: z.string()
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: 'UNAUTHORISED', message: 'Sign in required' } }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = threadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid payload', details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  const existing = await db.messageThread.findFirst({
    where: parsed.data
  });

  if (existing) {
    return NextResponse.json({ thread: existing });
  }

  const thread = await db.messageThread.create({
    data: parsed.data
  });

  return NextResponse.json({ thread }, { status: 201 });
}
