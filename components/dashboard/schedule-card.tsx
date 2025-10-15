import { format } from 'date-fns';

export type ScheduleItem = {
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  type: string;
};

export function ScheduleCard({ title, items }: { title: string; items: ScheduleItem[] }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/90 p-6 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <ul className="mt-6 space-y-4 text-sm">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col rounded-xl bg-slate-100/70 p-4 dark:bg-slate-800/70">
            <span className="text-xs font-semibold uppercase text-brand-500">{item.type}</span>
            <span className="text-base font-medium text-slate-900 dark:text-white">{item.title}</span>
            <span className="text-xs text-slate-500 dark:text-slate-300">
              {format(item.startsAt, 'MMM d, HH:mm')} → {format(item.endsAt, 'HH:mm')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
