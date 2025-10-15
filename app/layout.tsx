import './globals.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider, useLocale, useMessages } from 'next-intl';
import { Vazirmatn } from 'next/font/google';
import { ReactNode } from 'react';

const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazirmatn'
});

export const metadata: Metadata = {
  title: 'Norkode | Learn with Persian mentors',
  description: 'نورکُد پلتفرم جامع آموزش برنامه‌نویسی'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const messages = useMessages();
  const dir = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${vazir.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
