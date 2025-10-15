import { db } from '@/server/db';
import { notFound } from 'next/navigation';

export default async function LessonPage({ params }: { params: { lessonId: string } }) {
  const lesson = await db.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      course: true,
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: true
        }
      },
      videoAsset: true
    }
  });

  if (!lesson) return notFound();

  const videoPath = lesson.videoAsset?.path
    ? lesson.videoAsset.path.startsWith('http')
      ? lesson.videoAsset.path
      : `/${lesson.videoAsset.path.startsWith('videos/') ? lesson.videoAsset.path : `uploads/${lesson.videoAsset.path}`}`
    : '';

  return (
    <div className="min-h-screen bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6">
        <header className="space-y-3">
          <p className="text-sm text-brand-500">{lesson.course.title}</p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{lesson.title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">{lesson.summary}</p>
        </header>
        <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-900">
            {videoPath ? (
              <video src={videoPath} controls className="h-full w-full" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-300">
                Video processing…
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-slate-500">
            <span>Duration: {Math.round((lesson.durationSec || 0) / 60)} minutes</span>
            <span>Resources: {lesson.resources.length}</span>
          </div>
        </section>
        <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Comments & Q&A</h2>
          <ul className="mt-4 space-y-4 text-sm">
            {lesson.comments.map((comment) => (
              <li key={comment.id} className="rounded-xl bg-slate-100/70 p-4 dark:bg-slate-800/70">
                <p className="font-semibold text-slate-900 dark:text-white">{comment.author.name}</p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{comment.content}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
