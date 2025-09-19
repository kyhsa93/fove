const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 5173;
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = path.resolve(__dirname);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.jsx': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

function isPathInside(parent, child) {
  const rel = path.relative(parent, child);
  return !!rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function send(res, code, headers, body) {
  res.writeHead(code, headers);
  if (body) res.end(body); else res.end();
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(ROOT, url);

  // If directory, serve index.html
  try {
    const stat = fs.existsSync(filePath) && fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch {}

  // Path traversal guard
  const resolved = path.resolve(filePath);
  if (!isPathInside(ROOT, resolved) && resolved !== ROOT + '/index.html') {
    return send(res, 403, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Forbidden');
  }

  fs.readFile(resolved, (err, data) => {
    if (err) {
      if (url !== '/' && !path.extname(url)) {
        // SPA fallback to index.html for non-file routes without extension
        const indexPath = path.join(ROOT, 'index.html');
        return fs.readFile(indexPath, (e2, html) => {
          if (e2) return send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not Found');
          return send(res, 200, { 'Content-Type': mime['.html'] }, html);
        });
      }
      return send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not Found');
    }
    const ext = path.extname(resolved).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    send(res, 200, {
      'Content-Type': type,
      'Cache-Control': 'no-cache'
    }, data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`➡  Serving on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});

