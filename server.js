const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const host = '127.0.0.1';
const port = Number(process.env.PORT || 3000);
const logFile = path.join(__dirname, 'events.jsonl');

const server = http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
  }

  if (req.method === 'POST' && req.url === '/api/event') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 4096) req.destroy();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const animal = typeof data.animal === 'string' ? data.animal.trim() : '';
        const movie = typeof data.movie === 'string' ? data.movie.trim() : '';
        if (!animal || animal.length > 40 || !movie || movie.length > 80) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Completa ambos campos respetando sus longitudes máximas.' }));
        }
        const record = { animal, movie, at: new Date().toISOString() };
        fs.appendFileSync(logFile, JSON.stringify(record) + '\n', { encoding: 'utf8', mode: 0o600 });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Solicitud inválida.' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(port, host, () => console.log(`Simulación local: http://${host}:${port}`));
