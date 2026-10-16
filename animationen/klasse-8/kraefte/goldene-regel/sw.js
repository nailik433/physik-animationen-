/* Service Worker – Goldene Regel der Mechanik
   Strategie: Cache-first für App-Shell + Fonts; Network-first für alles andere.
   Versionsnummer erhöhen → erzwingt Update aller Clients.
*/
const CACHE = 'goldene-regel-v1';

const PRECACHE = [
  './goldene_regel.html',
  './manifest.json',
  './icon.svg',
  './icon-maskable.svg',
];

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

/* ---- Install: App-Shell vorabladen ---- */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

/* ---- Activate: alte Cache-Versionen löschen ---- */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ---- Fetch: Cache-first für App + Fonts ---- */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isFont = FONT_HOSTS.includes(url.hostname);
  const isApp  = url.pathname.endsWith('.html') || url.pathname.endsWith('.json')
              || url.pathname.endsWith('.svg');

  if (!isFont && !isApp) return; // Alle anderen Requests normal durchleiten

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        /* Offline-Fallback: bei Navigations-Requests die gecachte App zurückgeben */
        if (e.request.mode === 'navigate') {
          return caches.match('./goldene_regel.html');
        }
      });
    })
  );
});
