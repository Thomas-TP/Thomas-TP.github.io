const CACHE_NAME = "thomas-tp-portfolio-cache-v2.4";
const CRITICAL_CACHE = "thomas-tp-critical-v2.4";
const STATIC_CACHE = "thomas-tp-static-v2.4";

// Ressources critiques (chargées immédiatement)
const criticalResources = [
  "/",
  "/index.html",
  "/styles.css",
  "/image/profile.jpg"
];

// Ressources statiques (chargées progressivement)
const staticResources = [
  "/animations.css",
  "/dark-theme.css",
  "/modern-effects.css",
  "/premium-effects.css",
  "/chatbot.css",
  "/hero-animation.js",
  "/chatbot.js",
  "/image/favicon/favicon.png",
  "/image/icons/icon-192x192.png",
  "/image/icons/icon-512x512.png"
];

// Stratégie: Network First pour HTML, Cache First pour assets
self.addEventListener("install", event => {
  event.waitUntil(
    Promise.all([
      // Cache critique en priorité
      caches.open(CRITICAL_CACHE).then(cache => {
        return cache.addAll(criticalResources.map(url => new Request(url, {cache: 'reload'})));
      }),
      // Cache statique en arrière-plan
      caches.open(STATIC_CACHE).then(cache => {
        return Promise.all(
          staticResources.map(url => 
            cache.add(url).catch(err => console.warn(`Failed to cache ${url}`))
          )
        );
      })
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Network First pour HTML
  if (request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CRITICAL_CACHE).then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  
  // Cache First pour CSS, JS, images
  if (request.destination === 'style' || request.destination === 'script' || 
      request.destination === 'image' || request.destination === 'font') {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        
        return fetch(request).then(response => {
          // Ne pas cacher les ressources externes en erreur
          if (!response || response.status !== 200) return response;
          
          const responseClone = response.clone();
          const cacheName = url.origin === location.origin ? STATIC_CACHE : CACHE_NAME;
          caches.open(cacheName).then(cache => cache.put(request, responseClone));
          
          return response;
        });
      })
    );
    return;
  }
  
  // Stale-While-Revalidate pour le reste
  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        return response;
      });
      return cached || fetchPromise;
    })
  );
});

self.addEventListener("activate", event => {
  const cacheWhitelist = [CRITICAL_CACHE, STATIC_CACHE, CACHE_NAME];
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Prendre le contrôle immédiatement
      self.clients.claim()
    ])
  );
});

