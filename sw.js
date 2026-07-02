/*
 * Job Scanner service worker
 * Caches the app shell so it loads instantly on iPhone, even offline.
 * Job results themselves still require network (Adzuna API).
 */

const CACHE_NAME = 'job-scanner-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png'
  // Google Fonts are loaded cross-origin; we let them hit network
  // so users always get the latest glyphs.
];

// Install: pre-cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use addAll with tolerance for individual failures (e.g. favicon-16)
      return Promise.all(
        APP_SHELL.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('SW: failed to cache', url, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy:
// - Same-origin GET: cache-first, then network, then offline fallback
// - Cross-origin (fonts, Adzuna API): network-only (don't cache personal data)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never cache the Adzuna API responses — they contain live, personal results
  if (url.hostname === 'api.adzuna.com') {
    return; // let it go to network
  }

  // Same-origin: try cache first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) {
          // Refresh in background
          fetch(req).then((res) => {
            if (res && res.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(req, res.clone()));
            }
          }).catch(() => {});
          return cached;
        }
        return fetch(req).then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        }).catch(() => caches.match('./index.html'));
      })
    );
  }
  // Cross-origin (Google Fonts etc.): just hit network
});
