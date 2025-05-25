const CACHE_NAME = 'taskflow-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Yükleniyor...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Dosyalar önbelleğe alınıyor.');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Aktif ediliyor...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Eski önbellek temizleniyor:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith('http://localhost:8000/api')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetch(event.request);
          if (response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        } catch (error) {
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          console.error('API isteği başarısız oldu ve önbellekte bulunamadı:', event.request.url);
          throw error; 
        }
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request)
        .then((res) => {
          if (res.status === 200 && res.type === 'basic') {
            const responseToCache = res.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return res;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {}
          console.log('[Service Worker] Ağ veya önbellek hatası:', event.request.url);
          return new Response('Uygulama çevrimdışı ve kaynak bulunamadı.', { status: 503 });
        });
    })
  );
});