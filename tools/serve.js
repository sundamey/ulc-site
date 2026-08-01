#!/usr/bin/env node
/* ==========================================================================
   ULC — Local preview server
   Serves the project folder (or dist/ with --dist) over http://localhost:8080.
   No dependencies — Node's built-in http module only.

   Usage:  node tools/serve.js          preview the working files
           node tools/serve.js --dist   preview the production build
   ========================================================================== */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const useDist = process.argv.includes('--dist');
const ROOT = path.join(__dirname, '..', useDist ? 'dist' : '');
const PORT = Number(process.env.PORT) || 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

if (useDist && !fs.existsSync(ROOT)) {
  console.error('dist/ does not exist yet — run `npm run build` first.');
  process.exit(1);
}

http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);

  // Never serve outside the project root.
  if (!filePath.startsWith(path.resolve(ROOT))) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    fs.readFile(filePath, (err2, data) => {
      if (err2) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 — ' + urlPath);
        return;
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(filePath)] || 'application/octet-stream' });
      res.end(data);
    });
  });
}).listen(PORT, () => {
  console.log('ULC ' + (useDist ? '(production build)' : '(working files)') + ' → http://localhost:' + PORT);
  console.log('Press Ctrl+C to stop.');
});
