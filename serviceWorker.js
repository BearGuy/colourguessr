const app_version = "colour-guessr-0.0.7";
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(app_version).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("activate", activateEvent => {
  activateEvent.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== app_version)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(fetchEvent.request).then(response => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const clonedResponse = response.clone();

        caches.open(app_version).then(cache => {
          cache.put(fetchEvent.request, clonedResponse);
        });

        return response;
      });
    })
  );
});
