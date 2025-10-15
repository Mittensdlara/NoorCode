import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { getSession } from '@/server/auth/session';
import { requireRole } from '@/lib/rbac';

const createSchema = z.object({
  courseId: z.string(),
  title: z.string(),
  description: z.string(),
  dueAt: z.string(),
  maxPoints: z.number().default(100),
  rubric: z.any().optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  const where = courseId ? { courseId } : {};
  const assignments = await db.assignment.findMany({
    where,
    orderBy: { dueAt: 'asc' }
  });
  return NextResponse.json({ assignments });
}

export async function POST(request: Request) {
  const session = await getSession();
  requireRole(session?.user?.role as any, ['mentor', 'admin']);

  const payload = await request.json();
  const parsed = createSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid payload', details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  const assignment = await db.assignment.create({
    data: {
      ...parsed.data,
      dueAt: new Date(parsed.data.dueAt)
    }
  });

  return NextResponse.json({ assignment }, { status: 201 });
}
