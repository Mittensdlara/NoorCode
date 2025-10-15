import { db } from '@/server/db';
import { notFound } from 'next/navigation';
import { getSession } from '@/server/auth/session';
import { requireRole } from '@/lib/rbac';
import { AssignmentSubmissionForm } from '@/components/assignment-submission-form';

export default async function AssignmentPage({ params }: { params: { assignmentId: string } }) {
  const session = await getSession();
  requireRole(session?.user?.role as any, ['student', 'mentor', 'admin']);

  const assignment = await db.assignment.findUnique({
    where: { id: params.assignmentId },
    include: {
      course: true,
      submissions: {
        where: { studentId: session?.user?.id || '' },
        include: {
          grade: true
        }
      }
    }
  });

  if (!assignment) return notFound();

  const submission = assignment.submissions[0];

  return (
    <div className="min-h-screen bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6">
        <header className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-sm text-brand-500">{assignment.course.title}</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{assignment.title}</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{assignment.description}</p>
          <p className="mt-3 text-xs text-slate-500">Due {assignment.dueAt.toDateString()}</p>
        </header>
        <section className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Submit your work</h2>
          <AssignmentSubmissionForm assignmentId={assignment.id} />
          {submission && (
            <div className="mt-6 rounded-xl bg-slate-100/80 p-4 text-sm dark:bg-slate-800/70">
              <p className="font-semibold text-slate-900 dark:text-white">Latest submission</p>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Submitted {submission.submittedAt.toDateString()}</p>
              {submission.grade ? (
                <p className="mt-2 text-emerald-500">Graded: {submission.grade.points} points • {submission.grade.feedback}</p>
              ) : (
                <p className="mt-2 text-slate-500">Awaiting grading</p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
