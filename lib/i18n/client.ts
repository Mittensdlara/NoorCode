'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { AppLocale, locales } from './locales';

export function useLocaleSwitcher() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchLocale = (locale: AppLocale) => {
    startTransition(() => {
      document.cookie = `locale=${locale}; path=/`;
      router.refresh();
    });
  };

  return { pending, switchLocale, locales };
}
