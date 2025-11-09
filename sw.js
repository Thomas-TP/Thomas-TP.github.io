// Service Worker - Thomas P. Portfolio
// Version 2.5.0 - Build optimisé avec Vite

const CACHE_VERSION = 'v2.5.0';
const CACHE_NAME = `thomas-portfolio-${CACHE_VERSION}`;

// Ressources essentielles à mettre en cache immédiatement
// Note: Avec Vite, les noms de fichiers incluent des hashes dynamiques
// Nous utilisons donc une stratégie de cache runtime au lieu de pré-caching
const ESSENTIAL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Patterns pour les ressources à cacher au runtime
const CACHE_PATTERNS = {
  css: /\.css$/,
  js: /\.js$/,
  images: /\.(png|jpg|jpeg|webp|svg|gif)$/,
  fonts: /\.(woff|woff2|ttf|eot)$/,
  static: /\.(ico|xml|txt|pdf)$/
};

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Mise en cache des ressources essentielles');
        return cache.addAll(ESSENTIAL_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation terminée - ressources seront cachées au runtime');
        return self.skipWaiting(); // Active immédiatement le nouveau SW
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // Supprimer les anciens caches
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('thomas-portfolio-') && name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Suppression de l\'ancien cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation terminée');
        return self.clients.claim(); // Prend le contrôle immédiatement
      })
  );
});

// Stratégie de cache pour les requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET et les requêtes vers d'autres domaines (sauf CDN)
  if (request.method !== 'GET') return;

  // Ignorer les requêtes vers des domaines externes (analytics, APIs, etc.)
  if (url.origin !== location.origin &&
      !url.hostname.includes('cdn.jsdelivr.net') &&
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com') &&
      !url.hostname.includes('cdnjs.cloudflare.com')) {
    return;
  }

  // Stratégie Cache-First pour les assets statiques
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stratégie Network-First pour le HTML et les données dynamiques
  event.respondWith(networkFirst(request));
});

// Stratégie Cache-First (assets statiques)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    console.log('[SW] Réponse depuis le cache:', request.url);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('[SW] Ressource ajoutée au cache:', request.url);
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Erreur réseau:', error);

    // Page offline de secours
    if (request.destination === 'document') {
      return new Response(
        `<!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hors ligne - Thomas P.</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              padding: 20px;
            }
            .container {
              max-width: 600px;
            }
            h1 { font-size: 3rem; margin: 0 0 1rem; }
            p { font-size: 1.2rem; opacity: 0.9; }
            .icon { font-size: 5rem; margin-bottom: 2rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">📡</div>
            <h1>Vous êtes hors ligne</h1>
            <p>Il semblerait que vous n'ayez pas de connexion internet.</p>
            <p>Veuillez vérifier votre connexion et réessayer.</p>
          </div>
        </body>
        </html>`,
        {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    throw error;
  }
}

// Stratégie Network-First (contenu dynamique)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Réseau indisponible, tentative depuis le cache');

    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Vérifier si la ressource est un asset statique
function isStaticAsset(url) {
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.woff', '.woff2', '.ttf', '.ico'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

// Écouter les messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(event.data.urls))
    );
  }
});
