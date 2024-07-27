self.addEventListener("install", (event) => {
  self.skipWaiting(); // Yeni service worker'ın hemen aktif olmasını sağlar.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== "cache-v1") {
              // Eski önbellekleri temizleyin
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return clients.claim(); // Uygulamanın hemen yeni service worker'ı kullanmasını sağlar.
      })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          return caches.open("cache-v1").then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    })
  );
});
