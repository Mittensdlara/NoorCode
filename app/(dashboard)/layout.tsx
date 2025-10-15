import { ReactNode } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { LocaleSwitcher } from '@/components/locale-switcher';

const navItems = [
  { href: '/dashboard/student', label: 'Student' },
  { href: '/dashboard/mentor', label: 'Mentor' },
  { href: '/courses', label: 'Courses' }
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100/60 pb-20 dark:bg-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/40 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold">
            نورکُد
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-slate-600 hover:text-brand-500">
                {item.label}
              </Link>
            ))}
            <LocaleSwitcher />
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="mx-auto mt-8 w-full max-w-6xl px-6">{children}</main>
    </div>
  );
}
