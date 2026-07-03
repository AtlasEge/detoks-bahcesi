/* Detoks Bahçesi — service worker: ağ öncelikli, çevrimdışıysa önbellekten */
const CACHE = 'detoks-bahcesi-v2';
const ASSETS = ['./', './index.html', './durtu.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png', './icon-durtu-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() =>
      caches.match(e.request, { ignoreSearch: true }).then(m => m || caches.match('./index.html'))
    )
  );
});
