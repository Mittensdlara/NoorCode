import { NextResponse } from 'next/server';
import { getSession } from '@/server/auth/session';
import { requireRole } from '@/lib/rbac';
import { getStorage } from '@/server/storage';
import { db } from '@/server/db';
import { videoQueue } from '@/server/queues/video-queue';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await getSession();
  requireRole(session?.user?.role as any, ['mentor', 'admin']);

  const formData = await request.formData();
  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: { code: 'INVALID_FILE', message: 'Missing video file' } }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const storage = getStorage();
  const stored = await storage.save(buffer, file.name, file.type || 'video/mp4');

  const asset = await db.videoAsset.create({
    data: {
      path: stored.path,
      size: stored.size,
      mimeType: stored.mimeType,
      durationSec: 0,
      thumbnailUrl: '',
      status: 'processing'
    }
  });

  videoQueue.enqueue(asset.id);

  return NextResponse.json({ asset }, { status: 201 });
}
