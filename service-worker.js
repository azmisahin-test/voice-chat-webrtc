self.addEventListener("install", (event) => {
  self.skipWaiting(); // Yeni service worker'ın hemen aktif olmasını sağlar.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim()); // Uygulamanın hemen yeni service worker'ı kullanmasını sağlar.
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("cache-v1").then((cache) => {
      return cache.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          })
        );
      });
    })
  );
});
