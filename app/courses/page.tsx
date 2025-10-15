import { db } from '@/server/db';
import { CourseCard } from '@/components/course-card';

export default async function CoursesPage({ searchParams }: { searchParams?: { q?: string } }) {
  const q = searchParams?.q || '';
  const courses = await db.course.findMany({
    where: q
      ? {
          OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }],
          published: true
        }
      : { published: true },
    include: {
      mentor: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Courses</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">Explore live cohorts and self-paced learning paths.</p>
          </div>
          <form className="w-full max-w-sm">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search courses"
              className="w-full rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900"
            />
          </form>
        </header>
        <section className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={{
                id: course.id,
                slug: course.slug,
                title: course.title,
                description: course.description,
                mentor: course.mentor.name || 'Mentor',
                tags: course.tags,
                updatedAt: course.updatedAt
              }}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
