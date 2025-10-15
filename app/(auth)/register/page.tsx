'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useMemo } from 'react';
import Link from 'next/link';

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    role: z.enum(['student', 'mentor'])
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  });

type RegisterValues = z.infer<typeof registerSchema>;

const passwordHints = ['Weak', 'Fair', 'Strong', 'Elite'];

function getPasswordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordValue = watch('password') || '';
  const passwordScore = useMemo(() => getPasswordScore(passwordValue), [passwordValue]);

  const onSubmit = async (values: RegisterValues) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: { 'Content-Type': 'application/json' }
    });
    setLoading(false);
    if (response.ok) {
      setSuccess(true);
    } else {
      const body = await response.json();
      setError(body?.error?.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-2xl rounded-2xl border border-white/60 bg-white/80 p-10 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Create your Norkode account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Join the community and choose your learning path.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
            <input
              type="text"
              {...register('name')}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900"
            />
            {errors.name && <p className="mt-2 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="md:col-span-1">
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
            <div className="mt-2 flex items-center gap-3 text-xs">
              <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                {Array.from({ length: 4 }).map((_, index) => (
                  <span
                    key={index}
                    className={`flex-1 transition ${index < passwordScore ? 'bg-brand-500' : ''}`}
                  />
                ))}
              </div>
              <span className="font-medium text-slate-500">{passwordHints[Math.max(passwordScore - 1, 0)]}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Use at least 8 characters, a number, uppercase and symbol for best strength.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900"
            />
            {errors.confirmPassword && <p className="mt-2 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Role</label>
            <select
              {...register('role')}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
            </select>
            {errors.role && <p className="mt-2 text-xs text-red-500">{errors.role.message}</p>}
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            {success && <p className="mt-2 text-sm text-emerald-500">Account created! You can now log in.</p>}
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
