import { Server } from 'socket.io';

let io: Server | null = null;

export function createSocketServer(httpServer: any): Server {
  if (io) return io;
  io = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  });

  io.on('connection', (socket) => {
    socket.on('join-thread', (threadId: string) => {
      socket.join(threadId);
    });

    socket.on('message', ({ threadId, message }) => {
      socket.to(threadId).emit('message', message);
    });
  });

  return io;
}

export function getIO(): Server | null {
  return io;
}
