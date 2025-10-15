import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { getSession } from '@/server/auth/session';
import { requireRole, canManageCourse } from '@/lib/rbac';

const updateSchema = z.object({
  title: z.string().optional(),
  summary: z.string().optional(),
  order: z.number().optional(),
  durationSec: z.number().optional(),
  resources: z.array(z.string()).optional()
});

export async function GET(_: Request, { params }: { params: { lessonId: string } }) {
  const lesson = await db.lesson.findUnique({
    where: { id: params.lessonId },
    include: { videoAsset: true }
  });
  if (!lesson) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Lesson not found' } }, { status: 404 });
  }
  return NextResponse.json({ lesson });
}

export async function PATCH(request: Request, { params }: { params: { lessonId: string } }) {
  const session = await getSession();
  requireRole(session?.user?.role as any, ['mentor', 'admin']);

  const lesson = await db.lesson.findUnique({ include: { course: true }, where: { id: params.lessonId } });
  if (!lesson) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Lesson not found' } }, { status: 404 });
  }
  if (!canManageCourse(session?.user?.role as any, lesson.course.mentorId, session?.user?.id as string)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } }, { status: 403 });
  }

  const payload = await request.json();
  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid payload', details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  const updated = await db.lesson.update({ where: { id: params.lessonId }, data: parsed.data });
  return NextResponse.json({ lesson: updated });
}

export async function DELETE(_: Request, { params }: { params: { lessonId: string } }) {
  const session = await getSession();
  requireRole(session?.user?.role as any, ['mentor', 'admin']);

  const lesson = await db.lesson.findUnique({ include: { course: true }, where: { id: params.lessonId } });
  if (!lesson) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Lesson not found' } }, { status: 404 });
  }
  if (!canManageCourse(session?.user?.role as any, lesson.course.mentorId, session?.user?.id as string)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } }, { status: 403 });
  }

  await db.lesson.delete({ where: { id: params.lessonId } });
  return NextResponse.json({ success: true });
}
