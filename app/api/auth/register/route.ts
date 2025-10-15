import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import { db } from '@/server/db';

const registerSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    role: z.enum(['student', 'mentor', 'admin']).default('student')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  });

export async function POST(request: Request) {
  const json = await request.json();
  const result = registerSchema.safeParse(json);
  if (!result.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid payload', details: result.error.flatten() } },
      { status: 400 }
    );
  }
  const { name, email, password, role } = result.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: { code: 'EMAIL_TAKEN', message: 'Email already registered' } },
      { status: 409 }
    );
  }

  const passwordHash = await hash(password, 10);
  await db.user.create({
    data: {
      name,
      email,
      role,
      passwordHash,
      profile: {
        create: {
          bio: '',
          socials: {},
          timezone: 'Asia/Tehran',
          languages: ['fa']
        }
      }
    }
  });

  return NextResponse.json({ success: true });
}
