import { z } from 'zod';
import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { getSession } from '@/server/auth/session';
import { requireRole } from '@/lib/rbac';

const createCourseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  language: z.string(),
  tags: z.array(z.string()).default([]),
  thumbnailUrl: z.string().optional(),
  published: z.boolean().default(false)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const page = Number(searchParams.get('page') || '1');
  const perPage = Number(searchParams.get('perPage') || '10');

  const courses = await db.course.findMany({
    where: q
      ? {
          OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }]
        }
      : {},
    skip: (page - 1) * perPage,
    take: perPage,
    include: {
      mentor: { select: { id: true, name: true } },
      _count: { select: { lessons: true, enrollments: true } }
    }
  });

  return NextResponse.json({ courses, page, perPage });
}

export async function POST(request: Request) {
  const session = await getSession();
  requireRole(session?.user?.role as any, ['mentor', 'admin']);

  const payload = await request.json();
  const parsed = createCourseSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid payload', details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  const course = await db.course.create({
    data: {
      ...parsed.data,
      mentorId: session?.user?.id as string
    }
  });

  return NextResponse.json({ course }, { status: 201 });
}
