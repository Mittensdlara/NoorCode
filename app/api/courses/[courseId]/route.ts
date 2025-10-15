import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { getSession } from '@/server/auth/session';
import { requireRole, canManageCourse } from '@/lib/rbac';

const updateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional()
});

export async function GET(_: Request, { params }: { params: { courseId: string } }) {
  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      mentor: true,
      lessons: true,
      assignments: true
    }
  });
  if (!course) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Course not found' } }, { status: 404 });
  }
  return NextResponse.json({ course });
}

export async function PATCH(request: Request, { params }: { params: { courseId: string } }) {
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
  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid payload', details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  const updated = await db.course.update({
    where: { id: params.courseId },
    data: parsed.data
  });

  return NextResponse.json({ course: updated });
}

export async function DELETE(_: Request, { params }: { params: { courseId: string } }) {
  const session = await getSession();
  requireRole(session?.user?.role as any, ['mentor', 'admin']);

  const course = await db.course.findUnique({ where: { id: params.courseId } });
  if (!course) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Course not found' } }, { status: 404 });
  }
  if (!canManageCourse(session?.user?.role as any, course.mentorId, session?.user?.id as string)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } }, { status: 403 });
  }

  await db.course.delete({ where: { id: params.courseId } });
  return NextResponse.json({ success: true });
}
