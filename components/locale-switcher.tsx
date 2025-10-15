'use client';

import { useLocaleSwitcher } from '@/lib/i18n/client';
import { locales } from '@/lib/i18n/locales';

export function LocaleSwitcher() {
  const { switchLocale, pending } = useLocaleSwitcher();

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchLocale(locale)}
          className="uppercase"
          disabled={pending}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
