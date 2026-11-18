/* AddAudio Unified Service Worker: COOP/COEP Cross-Origin Isolation + 100% Offline PWA */
const CACHE_VERSION = '__ADDAUDIO_CACHE_VERSION__';
const APP_CACHE = `addaudio-app-${CACHE_VERSION}`;
const FFMPEG_CACHE = 'addaudio-ffmpeg-0.12.10';

const DEFAULT_APP_SHELL = [
  '/',
  '/how-to-use/',
  '/privacy/',
  '/hire-me/',
  '/manifest.webmanifest',
  '/coi-serviceworker.js',
  '/favicon.svg',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png',
  '/icons/apple-touch-icon.png',
];

const FFMPEG_CORE_ASSETS = {
  mt: [
    '/ffmpeg/mt/ffmpeg-core.js',
    '/ffmpeg/mt/ffmpeg-core.wasm',
    '/ffmpeg/mt/ffmpeg-core.worker.js',
  ],
  st: [
    '/ffmpeg/st/ffmpeg-core.js',
    '/ffmpeg/st/ffmpeg-core.wasm',
  ],
};

let coepCredentialless = false;

function withIsolationHeaders(response) {
  if (!response || response.status === 0 || response.type === 'opaque') {
    return response;
  }
  // Status codes 101, 204, 205, 304 must not receive a body in new Response()
  const nullBodyStatus = response.status === 101 || response.status === 204 || response.status === 205 || response.status === 304;
  const headers = new Headers(response.headers);
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Embedder-Policy', coepCredentialless ? 'credentialless' : 'require-corp');
  if (!coepCredentialless) {
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }

  return new Response(nullBodyStatus ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function loadPrecacheManifest() {
  try {
    const resp = await fetch('/precache-manifest.json', { cache: 'no-store' });
    if (resp.ok) {
      const json = await resp.json();
      if (Array.isArray(json.appShell) && json.appShell.length > 0) {
        return json.appShell;
      }
    }
  } catch {
    // Fall back to default static routes
  }
  return DEFAULT_APP_SHELL;
}

async function cacheUrls(cacheName, urls) {
  const cache = await caches.open(cacheName);
  await Promise.allSettled(
    urls.map(async (url) => {
      const existing = await cache.match(url);
      if (existing) return;
      const resp = await fetch(url, { cache: 'no-cache' });
      if (resp && resp.status === 200) {
        await cache.put(url, resp);
      }
    })
  );
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    (async () => {
      const appUrls = await loadPrecacheManifest();
      const cache = await caches.open(APP_CACHE);
      await Promise.allSettled(
        appUrls.map(async (url) => {
          try {
            const resp = await fetch(url, { cache: 'reload' });
            if (resp && resp.status === 200) {
              await cache.put(url, resp);
            }
          } catch {
            // Skip transient errors during install
          }
        })
      );
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key.startsWith('addaudio-app-') && key !== APP_CACHE) {
            return caches.delete(key);
          }
          if (key.startsWith('addaudio-ffmpeg-') && key !== FFMPEG_CACHE) {
            return caches.delete(key);
          }
          return Promise.resolve(false);
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'coepCredentialless') {
    coepCredentialless = Boolean(data.value);
    return;
  }

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (data.type === 'deregister') {
    self.registration
      .unregister()
      .then(() => self.clients.matchAll())
      .then((clients) => clients.forEach((client) => client.navigate(client.url)));
    return;
  }

  if (data.type === 'CACHE_FFMPEG') {
    const mode = data.mode === 'st' ? 'st' : 'mt';
    const urls = FFMPEG_CORE_ASSETS[mode];
    event.waitUntil(
      cacheUrls(FFMPEG_CACHE, urls)
        .then(async () => {
          const clients = await self.clients.matchAll();
          clients.forEach((client) => {
            client.postMessage({ type: 'FFMPEG_CACHED', mode, ok: true });
          });
        })
        .catch(() => {})
    );
  }
});

async function handleNavigationRequest(request) {
  const cache = await caches.open(APP_CACHE);
  try {
    const networkResp = await fetch(request);
    if (networkResp && networkResp.status === 200) {
      await cache.put(request, networkResp.clone());
    }
    return withIsolationHeaders(networkResp);
  } catch {
    const url = new URL(request.url);
    const candidates = [
      request,
      url.pathname,
      url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`,
      '/',
    ];
    for (const candidate of candidates) {
      const cached = await cache.match(candidate);
      if (cached) return withIsolationHeaders(cached);
    }
    return new Response('Offline — AddAudio app shell is not cached yet.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

async function handleCacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: false });
  if (cached) {
    return withIsolationHeaders(cached);
  }
  const networkResp = await fetch(request);
  if (networkResp && networkResp.status === 200) {
    await cache.put(request, networkResp.clone());
  }
  return withIsolationHeaders(networkResp);
}

async function handleNetworkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const networkResp = await fetch(request);
    if (networkResp && networkResp.status === 200) {
      await cache.put(request, networkResp.clone());
    }
    return withIsolationHeaders(networkResp);
  } catch {
    const cached = await cache.match(request);
    if (cached) return withIsolationHeaders(cached);
    throw new Error('Network unavailable and asset not cached');
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return;

  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Cross-origin requests: apply COI credentialless handling if needed; fail quietly if offline
  if (url.origin !== self.location.origin) {
    const crossReq =
      coepCredentialless && request.mode === 'no-cors'
        ? new Request(request, { credentials: 'omit' })
        : request;
    event.respondWith(
      fetch(crossReq)
        .then((resp) => withIsolationHeaders(resp))
        .catch(() => {
          if (request.destination === 'script') {
            return new Response('', {
              status: 200,
              headers: {
                'Content-Type': 'application/javascript; charset=utf-8',
                'Cross-Origin-Resource-Policy': 'cross-origin',
              },
            });
          }
          return new Response('', { status: 204 });
        })
    );
    return;
  }

  // HTML page navigations: network-first with offline cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // FFmpeg core WASM/JS/Worker files: cache-first in dedicated FFmpeg cache
  if (url.pathname.startsWith('/ffmpeg/')) {
    event.respondWith(handleCacheFirst(request, FFMPEG_CACHE));
    return;
  }

  // Immutable Vite/Astro chunks, icons, and manifest: cache-first
  if (
    url.pathname.startsWith('/_astro/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/manifest.webmanifest' ||
    url.pathname === '/favicon.svg'
  ) {
    event.respondWith(handleCacheFirst(request, APP_CACHE));
    return;
  }

  // Remaining same-origin static assets (e.g., coi-serviceworker.js, precache-manifest.json)
  event.respondWith(handleNetworkFirst(request, APP_CACHE));
});
