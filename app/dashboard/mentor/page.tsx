import { db } from '@/server/db';
import { getSession } from '@/server/auth/session';
import { requireRole } from '@/lib/rbac';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { MessagesCard } from '@/components/dashboard/messages-card';
import Link from 'next/link';

export default async function MentorDashboardPage() {
  const session = await getSession();
  requireRole(session?.user?.role as any, ['mentor', 'admin']);

  const courses = await db.course.findMany({
    where: { mentorId: session?.user?.id },
    include: {
      _count: {
        select: {
          lessons: true,
          enrollments: true
        }
      },
      assignments: {
        take: 3,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  const pendingSubmissions = await db.submission.findMany({
    where: {
      assignment: {
        course: {
          mentorId: session?.user?.id
        }
      },
      grade: null
    },
    include: {
      student: true,
      assignment: true
    },
    take: 5
  });

  const questionThreads = await db.comment.findMany({
    where: {
      assignment: {
        course: { mentorId: session?.user?.id }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      author: true,
      lesson: true,
      assignment: true
    }
  });

  const chartData = courses.map((course) => ({
    label: course.title.slice(0, 10),
    value: course._count.enrollments
  }));

  const messageThreads = await db.messageThread.findMany({
    where: { mentorId: session?.user?.id },
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      student: true
    }
  });

  return (
    <div className="space-y-10 pb-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Hello {session?.user?.name}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Manage your cohorts, review submissions and keep the learning momentum.
          </p>
        </div>
        <Link
          href="/courses/new"
          className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-600"
        >
          Create course
        </Link>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => (
          <div key={course.id} className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{course.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {course._count.enrollments} learners • {course._count.lessons} lessons
                </p>
              </div>
              <Link href={`/courses/${course.slug}/manage`} className="text-sm font-semibold text-brand-500">
                Manage
              </Link>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {course.assignments.map((assignment) => (
                <li key={assignment.id} className="rounded-lg bg-slate-100/80 p-3 dark:bg-slate-800/60">
                  <p className="font-medium text-slate-900 dark:text-white">{assignment.title}</p>
                  <p className="text-xs text-slate-500">Due {assignment.dueAt.toDateString()}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Submissions to grade</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {pendingSubmissions.map((submission) => (
              <li key={submission.id} className="rounded-xl border border-slate-200/60 p-3 dark:border-slate-700">
                <p className="font-medium text-slate-900 dark:text-white">
                  {submission.student.name} → {submission.assignment.title}
                </p>
                <p className="text-xs text-slate-500">Submitted {submission.submittedAt.toDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
        <MessagesCard
          title="Student messages"
          messages={messageThreads.map((thread) => ({
            id: thread.id,
            title: thread.student.name || 'Student',
            snippet: thread.messages[0]?.content || 'No messages yet',
            unread: thread.messages.some((msg) => !msg.readAt)
          }))}
        />
      </section>
      <AnalyticsChart
        title="Enrollment trends"
        data={chartData.length ? chartData : [{ label: 'No courses', value: 0 }]}
      />
      <section className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Q&A</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          {questionThreads.map((comment) => (
            <li key={comment.id} className="rounded-xl bg-slate-100/80 p-4 dark:bg-slate-800/70">
              <p className="font-medium text-slate-900 dark:text-white">{comment.author.name}</p>
              <p className="mt-1 text-sm">{comment.content}</p>
              <p className="mt-1 text-xs text-slate-500">
                {comment.lesson ? `Lesson: ${comment.lesson.title}` : `Assignment: ${comment.assignment?.title}`}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
