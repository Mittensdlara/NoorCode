import { cn } from '@/lib/utils';

export function ProgressCard({
  title,
  progress,
  action
}: {
  title: string;
  progress: number;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        {action}
      </div>
      <div className="mt-6 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={cn('h-full rounded-full bg-brand-500 transition-all duration-500')}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{progress}% complete</p>
    </div>
  );
}
