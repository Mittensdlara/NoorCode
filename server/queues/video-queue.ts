import EventEmitter from 'events';
import { db } from '../db';

class VideoQueue extends EventEmitter {
  enqueue(videoId: string) {
    setTimeout(async () => {
      await db.videoAsset.update({
        where: { id: videoId },
        data: { status: 'ready' }
      });
      this.emit('processed', videoId);
    }, 3000);
  }
}

export const videoQueue = new VideoQueue();
