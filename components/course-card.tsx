import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  mentor: string;
  tags: string[];
  updatedAt: Date;
};

export function CourseCard({ course }: { course: CourseSummary }) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur transition hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between text-xs text-brand-500">
        <span>{course.tags.join(' • ')}</span>
        <span>Updated {formatDate(course.updatedAt)}</span>
      </div>
      <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{course.title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{course.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>Mentor: {course.mentor}</span>
        <Link href={`/courses/${course.slug}`} className="font-semibold text-brand-500">
          View course
        </Link>
      </div>
    </article>
  );
}
