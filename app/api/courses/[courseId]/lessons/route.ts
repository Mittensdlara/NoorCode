import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { getSession } from '@/server/auth/session';
import { requireRole, canManageCourse } from '@/lib/rbac';

const createLessonSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  summary: z.string(),
  order: z.number(),
  durationSec: z.number().default(0),
  resources: z.array(z.string()).default([]),
  videoAssetId: z.string().optional()
});

export async function GET(_: Request, { params }: { params: { courseId: string } }) {
  const lessons = await db.lesson.findMany({
    where: { courseId: params.courseId },
    orderBy: { order: 'asc' }
  });
  return NextResponse.json({ lessons });
}

export async function POST(request: Request, { params }: { params: { courseId: string } }) {
  const session = await getSession();
  requireRole(session?.user?.role as any, ['mentor', 'admin']);

  const course = await db.course.findUnique({ where: { id: params.courseId } });
  if (!course) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Course not found' } }, { status: 404 });
  }

  if (!canManageCourse(session?.user?.role as any, course.mentorId, session?.user?.id as string)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } }, { status: 403 });
  }

  const payload = await request.json();
  const parsed = createLessonSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid payload', details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  const lesson = await db.lesson.create({
    data: {
      ...parsed.data,
      courseId: params.courseId
    }
  });

  return NextResponse.json({ lesson }, { status: 201 });
}
