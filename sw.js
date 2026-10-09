/* =========================================================
   sw.js — Service Worker (نسخة مبسطة)
   ========================================================= */

const CACHE_VERSION = 'v22.0.0';
const CACHE_NAME = `collect-app-${CACHE_VERSION}`;

/* الملفات الأساسية فقط */
const PRECACHE_URLS = [
  './',
  './index.html',
  './admin.html',
  './manifest.json'
];

/* ============ Install ============ */
self.addEventListener('install', event => {
  console.log('📦 SW: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.allSettled(
          PRECACHE_URLS.map(url => {
            return cache.add(url)
              .then(() => console.log('✅ تم تخزين:', url))
              .catch(err => console.warn('⚠️ فشل تخزين:', url, err.message));
          })
        );
      })
      .then(() => {
        console.log('✅ SW: Installed');
        return self.skipWaiting();
      })
  );
});

/* ============ Activate ============ */
self.addEventListener('activate', event => {
  console.log('🔄 SW: Activating...');
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => {
            console.log('🗑️ حذف كاش قديم:', k);
            return caches.delete(k);
          })
      ))
      .then(() => {
        console.log('✅ SW: Activated');
        return self.clients.claim();
      })
  );
});

/* ============ Fetch ============ */
self.addEventListener('fetch', event => {
  const { request } = event;

  if(request.method !== 'GET') return;

  event.respondWith(
    caches.match(request)
      .then(cached => {
        if(cached) return cached;

        return fetch(request)
          .then(response => {
            if(response.ok && response.type === 'basic'){
              const clone = response.clone();
              caches.open(CACHE_NAME).then(c => c.put(request, clone));
            }
            return response;
          })
          .catch(() => {
            if(request.mode === 'navigate'){
              return caches.match('./index.html');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

console.log('✅ sw.js loaded');
