import { NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  const schedule = await db.scheduleItem.findMany({
    where: courseId ? { courseId } : {},
    orderBy: { startsAt: 'asc' }
  });
  return NextResponse.json({ schedule });
}
