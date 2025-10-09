const CACHE_NAME = "thomas-tp-portfolio-cache-v2.4";
const CRITICAL_CACHE = "thomas-tp-critical-v2.4";
const STATIC_CACHE = "thomas-tp-static-v2.4";

// Ressources critiques (chargées immédiatement)
const criticalResources = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/assets/images/profile.jpg"
];

// Ressources statiques (chargées progressivement)
const staticResources = [
  "/css/animations.css",
  "/css/dark-theme.css",
  "/css/modern-effects.css",
  "/css/premium-effects.css",
  "/css/chatbot.css",
  "/js/hero-animation.js",
  "/js/chatbot.js",
  "/assets/images/favicon/favicon.png",
  "/assets/images/icons/icon-192x192.png",
  "/assets/images/icons/icon-512x512.png"
];

// ===== SÉCURITÉ - LISTES BLANCHES =====
const ALLOWED_DOMAINS = [
  'thomas-tp.github.io',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com',
  'smtpjs.com',
  'cdn.botpress.cloud',
  'files.bpcontent.cloud',
  'webchat.botpress.cloud',
  'formspree.io',
  'streak-stats.demolab.com',
  'git.io'
];

const BLOCKED_PATTERNS = [
  /\.(exe|bat|cmd|scr|com|pif|jar|vb|vbs|wsf|wsh|hta|ps1|sh)$/i,
  /\.(php|asp|jsp|cfm|pl|cgi)$/i,
  /\/wp-admin\//i,
  /\/admin\//i,
  /\/administrator\//i,
  /\/phpmyadmin\//i,
  /\/\.env/i,
  /\/config\.php/i,
  /\/wp-config\.php/i,
  /\/\.git\//i,
  /\/\.svn\//i,
  /\/\.DS_Store/i,
  /\/backup/i,
  /\/temp/i,
  /\/tmp/i
];

const SUSPICIOUS_HEADERS = [
  'x-forwarded-for',
  'x-real-ip',
  'x-client-ip',
  'x-forwarded-host',
  'x-forwarded-proto',
  'x-forwarded-scheme',
  'x-original-url',
  'x-rewrite-url',
  'x-original-host'
];

// ===== FONCTIONS DE SÉCURITÉ =====
function isDomainAllowed(url) {
  const domain = new URL(url).hostname;
  return ALLOWED_DOMAINS.some(allowed => domain === allowed || domain.endsWith('.' + allowed));
}

function isRequestBlocked(url) {
  return BLOCKED_PATTERNS.some(pattern => pattern.test(url));
}

function detectSuspiciousHeaders(request) {
  const headers = {};
  for (let [key, value] of request.headers.entries()) {
    headers[key.toLowerCase()] = value;
  }

  return SUSPICIOUS_HEADERS.some(header => headers[header]);
}

function detectSQLInjection(payload) {
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
    /('|(\\x27)|(\\x2D\\x2D)|(\-\-)|(#)|(\%23)|(\%27)|(\%22)|(\%3B)|(\%3A)|(\%2F\*))/i,
    /(\bor\b.*\=.*\bor\b)/i,
    /(\band\b.*\=.*\band\b)/i
  ];

  return sqlPatterns.some(pattern => pattern.test(payload));
}

function detectXSS(payload) {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<form[^>]*>/gi,
    /<input[^>]*>/gi,
    /<meta[^>]*>/gi,
    /<link[^>]*>/gi,
    /<style[^>]*>.*?<\/style>/gi
  ];

  return xssPatterns.some(pattern => pattern.test(payload));
}

function logSecurityEvent(type, details) {
  console.warn(`[SECURITY] ${type}:`, details);
  // En production, envoyer à un service de monitoring
}

// ===== GESTION DES REQUÊTES AVEC SÉCURITÉ =====
self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);

  // ===== CONTRÔLES DE SÉCURITÉ =====

  // 1. Vérifier les domaines autorisés
  if (!isDomainAllowed(request.url)) {
    logSecurityEvent('BLOCKED_DOMAIN', { url: request.url, domain: url.hostname });
    event.respondWith(new Response('Domain not allowed', { status: 403 }));
    return;
  }

  // 2. Bloquer les patterns dangereux
  if (isRequestBlocked(request.url)) {
    logSecurityEvent('BLOCKED_PATTERN', { url: request.url });
    event.respondWith(new Response('Request blocked', { status: 403 }));
    return;
  }

  // 3. Détecter les headers suspects (indiquant un proxy malveillant)
  if (detectSuspiciousHeaders(request)) {
    logSecurityEvent('SUSPICIOUS_HEADERS', { url: request.url, headers: Object.fromEntries(request.headers) });
    event.respondWith(new Response('Suspicious request', { status: 403 }));
    return;
  }

  // 4. Analyser les paramètres d'URL pour les attaques
  if (url.search) {
    const params = new URLSearchParams(url.search);
    for (let [key, value] of params) {
      if (detectSQLInjection(value) || detectXSS(value)) {
        logSecurityEvent('MALICIOUS_PAYLOAD', { url: request.url, param: key, value: value });
        event.respondWith(new Response('Malicious payload detected', { status: 403 }));
        return;
      }
    }
  }

  // ===== TRAITEMENT NORMAL DES REQUÊTES =====

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

