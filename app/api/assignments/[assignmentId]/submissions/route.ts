import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/server/db';
import { getSession } from '@/server/auth/session';
import { requireRole } from '@/lib/rbac';

const submissionSchema = z.object({
  text: z.string().optional(),
  files: z.array(z.string()).optional()
});

export async function GET(_: Request, { params }: { params: { assignmentId: string } }) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: 'UNAUTHORISED', message: 'Sign in required' } }, { status: 401 });
  }

  const submissions = await db.submission.findMany({
    where: { assignmentId: params.assignmentId },
    include: { student: true, grade: true }
  });

  return NextResponse.json({ submissions });
}

export async function POST(request: Request, { params }: { params: { assignmentId: string } }) {
  const session = await getSession();
  requireRole(session?.user?.role as any, ['student', 'admin']);

  const payload = await request.json();
  const parsed = submissionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid payload', details: parsed.error.flatten() } },
      { status: 400 }
    );
  }

  const submission = await db.submission.create({
    data: {
      assignmentId: params.assignmentId,
      studentId: session?.user?.id as string,
      text: parsed.data.text || '',
      files: parsed.data.files || [],
      submittedAt: new Date()
    }
  });

  return NextResponse.json({ submission }, { status: 201 });
}
