/* ═══════════════════════════════════════════════════════════
   DROPLY — sw.js  (Service Worker)
   Estrategia: Cache-First para assets · Network-First para datos
   v3 — Rutas absolutas, scope raíz, compatibilidad Android Chrome
═══════════════════════════════════════════════════════════ */

const CACHE_VERSION = 'droply-v3';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const MUSIC_CACHE   = `${CACHE_VERSION}-music`;
const IMG_CACHE     = `${CACHE_VERSION}-images`;

/* Assets que se cachean en install (app shell) */
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

/* Límites de caché */
const MAX_IMG_CACHE   = 120;
const MAX_MUSIC_CACHE = 50;
const IMG_MAX_AGE     = 7 * 24 * 60 * 60;  // 7 días (segundos)

/* ── INSTALL ──────────────────────────────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ── ACTIVATE ─────────────────────────────────────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith('droply-') && !key.startsWith(CACHE_VERSION))
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── FETCH ────────────────────────────────────────────────── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  /* Ignorar peticiones no-GET y chrome-extension */
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  /* Ignorar requests de extensiones o devtools */
  if (!url.protocol.startsWith('http')) return;

  /* ── Archivos de música (.mp3) → Cache-First con límite ── */
  if (url.pathname.endsWith('.mp3') || url.pathname.includes('/Music/')) {
    event.respondWith(musicStrategy(request));
    return;
  }

  /* ── Imágenes (covers) → Cache-First con límite + expiración ── */
  if (
    request.destination === 'image' ||
    url.hostname.includes('ytimg.com') ||
    url.hostname.includes('scdn.co') ||
    url.hostname.includes('dzcdn.net') ||
    url.hostname.includes('media-amazon.com') ||
    url.pathname.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)
  ) {
    event.respondWith(imageStrategy(request));
    return;
  }

  /* ── Google Fonts → Cache-First (estático) ── */
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  /* ── App shell (HTML, CSS, JS) → Stale-While-Revalidate ── */
  if (
    url.origin === self.location.origin &&
    (request.destination === 'document' ||
     request.destination === 'script'   ||
     request.destination === 'style')
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  /* ── Resto → Network con fallback a caché ── */
  event.respondWith(networkWithCacheFallback(request));
});

/* ═══════════════════════════════════════════════════════════
   ESTRATEGIAS
═══════════════════════════════════════════════════════════ */

/* Cache-First genérico */
async function cacheFirst(request, cacheName = STATIC_CACHE) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Sin conexión', { status: 503 });
  }
}

/* Stale-While-Revalidate para app shell */
async function staleWhileRevalidate(request) {
  const cache  = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || (await fetchPromise) || offlineFallback();
}

/* Network con fallback a caché */
async function networkWithCacheFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || offlineFallback();
  }
}

/* Estrategia para música: Cache-First + límite de entradas */
async function musicStrategy(request) {
  // Safari/iOS envía peticiones Range para el audio — pasarlas directamente a la red
  const rangeHeader = request.headers.get('range');
  if (rangeHeader) {
    return fetch(request).catch(() =>
      new Response('Archivo de audio no disponible offline', { status: 503 })
    );
  }

  const cache  = await caches.open(MUSIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
      await trimCache(MUSIC_CACHE, MAX_MUSIC_CACHE);
    }
    return response;
  } catch {
    return new Response('Archivo de audio no disponible offline', { status: 503 });
  }
}

/* Estrategia para imágenes: Cache-First + límite + expiración */
async function imageStrategy(request) {
  const cache  = await caches.open(IMG_CACHE);
  const cached = await cache.match(request);
  if (cached) {
    const dateHeader = cached.headers.get('date');
    if (dateHeader) {
      const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;
      if (age > IMG_MAX_AGE) {
        fetch(request).then(r => { if (r.ok) cache.put(request, r); }).catch(() => {});
      }
    }
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
      await trimCache(IMG_CACHE, MAX_IMG_CACHE);
    }
    return response;
  } catch {
    return new Response(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><rect fill="#18181d"/></svg>`,
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

/* Limitar número de entradas en un caché */
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys  = await cache.keys();
  if (keys.length > maxEntries) {
    const toDelete = keys.slice(0, keys.length - maxEntries);
    await Promise.all(toDelete.map(k => cache.delete(k)));
  }
}

/* Página de offline genérica */
function offlineFallback() {
  return new Response(
    `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>DROPLY — Sin conexión</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#080808;color:#f8f8f8;font-family:'Plus Jakarta Sans',system-ui,sans-serif;
         display:flex;flex-direction:column;align-items:center;justify-content:center;
         min-height:100vh;text-align:center;padding:2rem;gap:1.5rem}
    .icon{width:64px;height:64px;background:rgba(139,92,246,.12);border-radius:50%;
          display:flex;align-items:center;justify-content:center;margin:0 auto}
    svg{stroke:#8b5cf6;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
    h1{font-size:1.5rem;font-weight:600;letter-spacing:-.02em}
    p{color:#71717a;font-size:.9rem;max-width:280px;line-height:1.6}
    button{margin-top:.5rem;padding:.7rem 1.8rem;background:#8b5cf6;color:#fff;
           border:none;border-radius:99px;font-size:.85rem;font-weight:600;cursor:pointer;
           transition:background .2s}
    button:hover{background:#a78bfa}
  </style>
</head>
<body>
  <div class="icon">
    <svg width="28" height="28" viewBox="0 0 24 24">
      <path d="M1 6l5 5 3-3 4 4 3-3 5 5"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  </div>
  <h1>Sin conexión</h1>
  <p>No tienes conexión a internet. Los tracks descargados siguen disponibles.</p>
  <button onclick="location.reload()">Reintentar</button>
</body>
</html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

/* ═══════════════════════════════════════════════════════════
   MENSAJES DESDE LA APP
═══════════════════════════════════════════════════════════ */
self.addEventListener('message', event => {
  const { type, payload } = event.data || {};

  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (type === 'CACHE_TRACK' && payload?.url) {
    caches.open(MUSIC_CACHE).then(cache => {
      cache.match(payload.url).then(hit => {
        if (!hit) {
          fetch(payload.url).then(r => {
            if (r.ok) cache.put(payload.url, r);
          }).catch(() => {});
        }
      });
    });
  }

  if (type === 'REMOVE_TRACK' && payload?.url) {
    caches.open(MUSIC_CACHE).then(cache => cache.delete(payload.url));
  }

  if (type === 'CHECK_CACHED' && payload?.url) {
    caches.match(payload.url).then(hit => {
      event.source?.postMessage({ type: 'CACHED_STATUS', url: payload.url, cached: !!hit });
    });
  }

  if (type === 'GET_CACHE_STATS') {
    Promise.all([
      caches.open(MUSIC_CACHE).then(c => c.keys()),
      caches.open(IMG_CACHE).then(c => c.keys()),
      caches.open(STATIC_CACHE).then(c => c.keys())
    ]).then(([music, images, statics]) => {
      event.source?.postMessage({
        type: 'CACHE_STATS',
        music:   music.length,
        images:  images.length,
        statics: statics.length
      });
    });
  }
});