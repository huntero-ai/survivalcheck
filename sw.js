/* SurvivalCheck service worker - precache semua aset, cache-first, path relatif. */
const CACHE = 'survivalcheck-v11';

// Wajib ada: bila salah satu gagal, instalasi gagal (aset milik E1 + data + i18n).
const CORE = [
  './', 'index.html', 'manifest.webmanifest',
  'styles/main.css',
  'src/app.js', 'src/storage.js', 'src/i18n.js',
  'src/engine.js', 'src/power.js', 'src/forms.js', 'src/results.js', 'src/shopping.js', 'src/icons.js', 'src/a11y.js',
  'styles/forms.css', 'styles/results.css', 'styles/print.css',
  'fonts/rubik-latin-wght-normal.woff2', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
  'data/items.json', 'data/rules.json', 'data/power.json', 'data/bnpb_family_indicators.json', 'data/sources-to-buy.json', 'data/province_risks.json',
  'i18n/id.json', 'i18n/en.json',
  'docs/sources.md',
];
// Aset opsional tambahan (tidak menggagalkan instalasi).
const OPTIONAL = [];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await Promise.allSettled(OPTIONAL.map(async (u) => {
      const res = await fetch(u, { cache: 'reload' });
      if (res.ok) await cache.put(u, res);
    }));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('survivalcheck-') && k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok && res.type === 'basic') cache.put(req, res.clone());
      return res;
    } catch (e) {
      if (req.mode === 'navigate') {
        const shell = await cache.match('index.html');
        if (shell) return shell;
      }
      return new Response('', { status: 503, statusText: 'Offline' });
    }
  })());
});
