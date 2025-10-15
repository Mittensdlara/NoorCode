import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { getSession } from '@/server/auth/session';

export async function GET(_: Request, { params }: { params: { submissionId: string } }) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: { code: 'UNAUTHORISED', message: 'Sign in required' } }, { status: 401 });
  }

  const submission = await db.submission.findUnique({
    where: { id: params.submissionId },
    include: {
      assignment: true,
      student: true,
      grade: true
    }
  });

  if (!submission) {
    return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Submission not found' } }, { status: 404 });
  }

  return NextResponse.json({ submission });
}
