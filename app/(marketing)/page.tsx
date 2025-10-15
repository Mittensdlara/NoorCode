import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { ThemeToggle } from '@/components/theme-toggle';

const features = [
  {
    title: 'Mentor-led cohorts',
    description: 'Small group learning with senior engineers guiding you every step of the journey.'
  },
  {
    title: 'Persian-first content',
    description: 'Courses and assignments written in fa-IR with RTL friendly layouts and transcripts.'
  },
  {
    title: 'Production tooling',
    description: 'CI-ready workflows, Git best practices and deployment templates so you can ship fast.'
  }
];

export default async function MarketingPage() {
  const t = await getTranslations('marketing');

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-sky-50 to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="absolute inset-x-0 top-0 flex justify-between px-6 py-4 text-sm">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
      <header className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-20 pt-32 text-center lg:text-left">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-brand-600 shadow-soft dark:bg-slate-800/60">
              نورکُد • Empowering Persian devs
            </span>
            <h1 className="hero-text text-4xl font-bold leading-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              {t('heroTitle')}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="rounded-full bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-brand-600"
              >
                {t('ctaPrimary')}
              </Link>
              <Link
                href="/courses"
                className="rounded-full border border-brand-200 bg-white px-6 py-3 text-base font-semibold text-brand-600 transition hover:-translate-y-0.5 hover:border-brand-400"
              >
                {t('ctaSecondary')}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-10 text-left sm:grid-cols-3">
              <div>
                <p className="text-3xl font-bold text-brand-600">900+</p>
                <p className="text-sm text-slate-500">Graduated developers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-600">45</p>
                <p className="text-sm text-slate-500">Mentors from FAANG & startups</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-600">1200h</p>
                <p className="text-sm text-slate-500">Project based content</p>
              </div>
            </div>
          </div>
          <div className="relative w-full max-w-xl rounded-2xl border border-white/40 bg-white/70 p-8 shadow-soft backdrop-blur dark:bg-slate-900/70">
            <div className="grid grid-cols-2 gap-4 text-left text-sm">
              <div className="rounded-xl bg-brand-500/10 p-4">
                <h3 className="font-semibold text-brand-700 dark:text-brand-300">Live Workshops</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Weekly sessions covering frontend, backend and DevOps.</p>
              </div>
              <div className="rounded-xl bg-secondary-500/10 p-4">
                <h3 className="font-semibold text-secondary-500">Project Clinics</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Mentors review your repos and help you ship faster.</p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-4">
                <h3 className="font-semibold text-emerald-600">Career Support</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Resume workshops, interview prep and job referrals.</p>
              </div>
              <div className="rounded-xl bg-indigo-500/10 p-4">
                <h3 className="font-semibold text-indigo-600">Community</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">Daily discussions in Persian and English with peers.</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why learners love Norkode</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card-hover rounded-2xl border border-white/50 bg-white/80 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900/60"
            >
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
