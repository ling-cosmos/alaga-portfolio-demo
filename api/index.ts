import type { IncomingMessage, ServerResponse } from 'node:http';
import { createAppServer } from '../server/src/app';

// Reuse the original Node API, including its authentication and PostgreSQL RLS.
const app = createAppServer();
export default function handler(request: IncomingMessage, response: ServerResponse) {
  request.url = (request.url || '/').replace(/^\/api(?=\/|$)/, '') || '/';
  app.emit('request', request, response);
}
