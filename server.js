const h = require('http'), f = require('fs'), p = require('path'), os = require('os');
const root = __dirname;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json'
};
h.createServer((q, s) => {
  let u = decodeURIComponent(q.url.split('?')[0]);
  if (u === '/') u = '/index.html';
  const fp = p.normalize(p.join(root, u));
  if (!fp.startsWith(root)) { s.writeHead(403); s.end(); return; }
  f.readFile(fp, (e, d) => {
    if (e) { s.writeHead(404); s.end('404'); }
    else { s.writeHead(200, { 'Content-Type': MIME[p.extname(u).toLowerCase()] || 'application/octet-stream' }); s.end(d); }
  });
}).listen(4230, () => {
  console.log('Detoks Bahcesi calisiyor:');
  console.log('  Bu bilgisayarda: http://localhost:4230');
  Object.values(os.networkInterfaces()).flat()
    .filter(i => i && i.family === 'IPv4' && !i.internal)
    .forEach(i => console.log('  iPhone icin (ayni Wi-Fi): http://' + i.address + ':4230'));
});
