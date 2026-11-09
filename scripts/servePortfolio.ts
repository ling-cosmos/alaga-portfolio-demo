import { createServer, request as proxyRequest } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { createAppServer } from '../server/src/app';

// Local verification of the same Expo export and Node API used on Vercel.
const api = createAppServer();
api.listen(4005, '127.0.0.1');
const root = resolve('dist');
const types: Record<string, string> = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.gif':'image/gif', '.ttf':'font/ttf', '.ico':'image/x-icon' };
createServer(async (req, res) => {
  if (req.url?.startsWith('/api/')) {
    const upstream = proxyRequest({ hostname:'127.0.0.1', port:4005, path:req.url.slice(4), method:req.method, headers:req.headers }, response => {
      res.writeHead(response.statusCode || 502, response.headers); response.pipe(res);
    });
    upstream.on('error', () => { res.writeHead(502); res.end('Service unavailable'); });
    req.pipe(upstream); return;
  }
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;
  const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + '/')) { res.writeHead(404); res.end(); return; }
  try { const body = await readFile(file); res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream'); res.end(body); }
  catch { res.writeHead(404); res.end('Not found'); }
}).listen(4186, '127.0.0.1', () => console.log('Original Alaga web app: http://127.0.0.1:4186'));
