import { db } from '@/server/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await db.course.findUnique({
    where: { slug: params.slug },
    include: {
      mentor: true,
      lessons: { orderBy: { order: 'asc' } },
      assignments: { orderBy: { dueAt: 'asc' } },
      schedule: { orderBy: { startsAt: 'asc' } }
    }
  });

  if (!course) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6">
        <header className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-500">{course.level}</span>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{course.title}</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{course.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>Mentor: {course.mentor.name}</span>
            <span>Language: {course.language}</span>
            <span>Tags: {course.tags.join(', ')}</span>
          </div>
          <Link
            href={`/courses/${course.slug}/enroll`}
            className="mt-6 inline-flex w-fit items-center rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-600"
          >
            Enroll now
          </Link>
        </header>
        <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Syllabus</h2>
              <ul className="mt-4 space-y-3">
                {course.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex items-center justify-between rounded-xl bg-slate-100/80 p-4 text-sm dark:bg-slate-800/70">
                    <span>
                      <strong className="text-slate-900 dark:text-white">{lesson.order}. {lesson.title}</strong>
                      <span className="ml-2 text-slate-500">{lesson.durationSec / 60} min</span>
                    </span>
                    <Link href={`/lessons/${lesson.id}`} className="text-brand-500">
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Assignments</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {course.assignments.map((assignment) => (
                  <li key={assignment.id} className="rounded-xl bg-slate-100/80 p-4 dark:bg-slate-800/70">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{assignment.title}</p>
                        <p className="text-xs text-slate-500">Due {assignment.dueAt.toDateString()}</p>
                      </div>
                      <Link href={`/assignments/${assignment.id}`} className="text-brand-500">
                        Open
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Schedule</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {course.schedule.map((item) => (
                  <li key={item.id} className="rounded-xl bg-slate-100/80 p-4 dark:bg-slate-800/70">
                    <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-slate-500">
                      {item.startsAt.toDateString()} • {item.type}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
