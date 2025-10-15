import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { getSession } from '@/server/auth/session';
import { requireRole } from '@/lib/rbac';

const gradeSchema = z.object({
  points: z.number(),
  feedback: z.string().optional()
});

export async function POST(request: Request, { params }: { params: { submissionId: string } }) {
  const session = await getSession();
  requireRole(session?.user?.role as any, ['mentor', 'admin']);

  const payload = await request.json();
  const parsed = gradeSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid payload', details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  const grade = await db.grade.upsert({
    where: { submissionId: params.submissionId },
    create: {
      submissionId: params.submissionId,
      graderId: session?.user?.id as string,
      points: parsed.data.points,
      feedback: parsed.data.feedback || '',
      gradedAt: new Date()
    },
    update: {
      points: parsed.data.points,
      feedback: parsed.data.feedback || '',
      gradedAt: new Date()
    }
  });

  await db.submission.update({
    where: { id: params.submissionId },
    data: { gradeId: grade.id }
  });

  return NextResponse.json({ grade });
}

export const PATCH = POST;
