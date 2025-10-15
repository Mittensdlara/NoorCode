'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: LoginValues) => {
    setLoading(true);
    setError(null);
    const response = await signIn('credentials', {
      ...values,
      redirect: false
    });
    setLoading(false);
    if (response?.error) {
      setError('Invalid email or password');
    } else {
      window.location.href = '/dashboard/student';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Log in to Norkode</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Welcome back! Access your personalised learning space.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
            <input
              type="email"
              {...register('email')}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900"
            />
            {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
            <input
              type="password"
              {...register('password')}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900"
            />
            {errors.password && <p className="mt-2 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          No account yet?{' '}
          <Link href="/register" className="text-brand-500">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
