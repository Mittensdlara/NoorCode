import { db } from '@/server/db';
import { getSession } from '@/server/auth/session';
import { ProgressCard } from '@/components/dashboard/progress-card';
import { ScheduleCard } from '@/components/dashboard/schedule-card';
import { MessagesCard } from '@/components/dashboard/messages-card';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { requireRole } from '@/lib/rbac';

export default async function StudentDashboardPage() {
  const session = await getSession();
  requireRole(session?.user?.role as any, ['student', 'admin']);

  const enrollments = await db.enrollment.findMany({
    where: { studentId: session?.user?.id },
    include: {
      course: true
    }
  });

  const scheduleItems = await db.scheduleItem.findMany({
    where: { courseId: { in: enrollments.map((enrollment) => enrollment.courseId) } },
    orderBy: { startsAt: 'asc' },
    take: 4
  });

  const messageThreads = await db.messageThread.findMany({
    where: { studentId: session?.user?.id },
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      mentor: true
    }
  });

  const analyticsData = await db.submission.groupBy({
    by: ['assignmentId'],
    where: { studentId: session?.user?.id },
    _count: { assignmentId: true }
  });

  const chartData = analyticsData.map((entry) => ({
    label: `Assignment ${entry.assignmentId.slice(0, 4)}`,
    value: entry._count.assignmentId
  }));

  return (
    <div className="space-y-8 pb-10">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Welcome back, {session?.user?.name}</h1>
      <section className="grid gap-6 md:grid-cols-2">
        {enrollments.map((enrollment) => (
          <ProgressCard
            key={enrollment.id}
            title={enrollment.course.title}
            progress={enrollment.progress}
            action={<a href={`/courses/${enrollment.course.slug}`} className="text-sm font-semibold text-brand-500">Continue</a>}
          />
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <ScheduleCard
          title="Upcoming schedule"
          items={scheduleItems.map((item) => ({
            id: item.id,
            title: item.title,
            startsAt: item.startsAt,
            endsAt: item.endsAt,
            type: item.type
          }))}
        />
        <MessagesCard
          title="Mentor messages"
          messages={messageThreads.map((thread) => ({
            id: thread.id,
            title: thread.mentor.name || 'Mentor',
            snippet: thread.messages[0]?.content || 'No messages yet',
            unread: thread.messages.some((msg) => !msg.readAt)
          }))}
        />
      </section>
      <AnalyticsChart
        title="Learning activity"
        data={chartData.length > 0 ? chartData : [{ label: 'No data yet', value: 0 }]}
      />
    </div>
  );
}
