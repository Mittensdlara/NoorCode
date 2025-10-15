import { createServer } from 'http';
import { createSocketServer } from '../server/realtime/socket';

const server = createServer();
createSocketServer(server);

const port = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 3001;
server.listen(port, () => {
  console.log(`Socket server listening on ${port}`);
});
