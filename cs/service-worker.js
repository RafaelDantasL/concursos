const CACHE_NAME = 'site-static-v1';
const ASSETS = [
  '/menu.html',
  '/footer.html',
  '/styles.css',
  '/script.js',
];

// Instalar o Service Worker e fazer o cache dos recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Fazendo cache dos assets');
      return cache.addAll(ASSETS);
    })
  );
});

// Interceptar as requisições e responder com cache se disponível
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retornar o recurso do cache, se disponível
      return cachedResponse || fetch(event.request).then((networkResponse) => {
        // Atualizar o cache com a nova resposta
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
      // Retornar um fallback se necessário
      return caches.match('/offline.html');
    })
  );
});

// Remover caches antigos quando o SW for atualizado
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
