import { NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const [courses, lessons, assignments] = await Promise.all([
    db.course.findMany({ where: { title: { contains: q, mode: 'insensitive' } }, take: 5 }),
    db.lesson.findMany({ where: { title: { contains: q, mode: 'insensitive' } }, take: 5 }),
    db.assignment.findMany({ where: { title: { contains: q, mode: 'insensitive' } }, take: 5 })
  ]);

  return NextResponse.json({ results: { courses, lessons, assignments } });
}
