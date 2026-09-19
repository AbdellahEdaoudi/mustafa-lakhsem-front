/* ------------------------------------------------------------------
 * Mustafa Lakhsem — Service Worker
 *
 *  - Pages (navigations)         -> Network-first (4s timeout) + offline fallback
 *  - /_next/static/* (hashed)    -> Cache-first
 *  - Images / fonts / icons ...  -> Stale-while-revalidate
 *  - Everything else             -> NOT intercepted (RSC, JSON, API, admin, auth,
 *                                   cross-origin, video Range requests, non-GET)
 *
 * Bump VERSION on every release that changes precached files.
 * ------------------------------------------------------------------ */

const VERSION = "v4";
const STATIC_CACHE = `mds-static-${VERSION}`; // hashed Next.js build files
const ASSET_CACHE = `mds-assets-${VERSION}`;  // precache + images / fonts / icons
const PAGE_CACHE = `mds-pages-${VERSION}`;    // pages the visitor has opened
const ALL_CACHES = [STATIC_CACHE, ASSET_CACHE, PAGE_CACHE];

const OFFLINE_URL = "/offline.html";

const PRECACHE = [
  OFFLINE_URL,
  "/manifest.json",
  "/favicon.ico",
  "/icons/favicon-16.png",
  "/icons/favicon-32.png",
  "/icons/favicon-48.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/Logo/mds-logo.png",
  "/Logo/mustapha-lakhsem.png",
  "/moroccan-pattern.svg",
];
const PRECACHE_PATHS = new Set(PRECACHE);

const NETWORK_TIMEOUT_MS = 4000; // weak connection: fall back to cached page
const MAX_PAGES = 30;
const MAX_ASSETS = 100;
const MAX_STATIC = 120;

// /api, /admin, /auth — with or without a language prefix (/en/admin, /ar/auth ...)
const EXCLUDED = /^\/(?:[a-z]{2}(?:-[A-Za-z]{2})?\/)?(?:api|admin|auth)(?:\/|$)/;

/* ------------------------------ helpers ------------------------------ */

async function trimCache(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = (await cache.keys()).filter(
    (req) => !PRECACHE_PATHS.has(new URL(req.url).pathname)
  );
  const excess = keys.length - max;
  for (let i = 0; i < excess; i++) await cache.delete(keys[i]); // oldest first
}

const isCacheableAsset = (res) => res.ok && res.type === "basic";
const isCacheablePage = (res) =>
  res.ok && res.type === "basic" && !res.redirected;

/**
 * Fetch from the network and store a copy in the cache.
 * The clone is taken synchronously (before the body can be consumed) and the
 * cache write is registered with waitUntil so the worker isn't killed mid-write.
 */
function fetchAndCache(event, cacheName, max, isCacheable) {
  let pending = Promise.resolve();
  const request = event.request;
  const promise = fetch(request).then((res) => {
    if (isCacheable(res)) {
      const copy = res.clone();
      pending = caches
        .open(cacheName)
        .then((cache) => cache.put(request, copy))
        .then(() => trimCache(cacheName, max))
        .catch(() => {});
    }
    return res;
  });
  event.waitUntil(promise.then(() => pending, () => {}));
  return promise;
}

/* ---------------------------- strategies ----------------------------- */

async function networkFirstPage(event) {
  const request = event.request;
  const cache = await caches.open(PAGE_CACHE);

  const networkPromise = fetchAndCache(event, PAGE_CACHE, MAX_PAGES, isCacheablePage);
  networkPromise.catch(() => {}); // avoid unhandled rejection if we answered from cache

  const timeout = new Promise((resolve) =>
    setTimeout(() => resolve(null), NETWORK_TIMEOUT_MS)
  );

  try {
    const first = await Promise.race([networkPromise, timeout]);
    if (first) return first;

    // Network is slow: serve the cached copy if we have one,
    // otherwise keep waiting for the network.
    const cached = await cache.match(request, { ignoreSearch: true });
    return cached || (await networkPromise);
  } catch (err) {
    const cached = await cache.match(request, { ignoreSearch: true });
    return cached || (await caches.match(OFFLINE_URL)) || Response.error();
  }
}

async function cacheFirst(event, cacheName, max) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(event.request);
  if (cached) return cached;
  return fetchAndCache(event, cacheName, max, isCacheableAsset);
}

async function staleWhileRevalidate(event, cacheName, max) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(event.request);
  const update = fetchAndCache(event, cacheName, max, isCacheableAsset);
  update.catch(() => {}); // offline: ignore, we may already have `cached`
  return cached || update;
}

/* ------------------------------ lifecycle ---------------------------- */

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(ASSET_CACHE);
      // One-by-one (not addAll): a single wrong path must not cancel everything.
      const results = await Promise.allSettled(
        PRECACHE.map((url) => cache.add(new Request(url, { cache: "reload" })))
      );
      results.forEach((r, i) => {
        if (r.status === "rejected") console.warn("[SW] precache failed:", PRECACHE[i]);
      });
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("mds-") && !ALL_CACHES.includes(k))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

/* -------------------------------- fetch ------------------------------ */

const SWR_DESTINATIONS = new Set(["image", "font", "style", "script", "manifest"]);

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;
  if (request.headers.has("range")) return; // video / audio streaming

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // fonts CDN, analytics, extensions...
  if (url.pathname === "/sw.js") return;
  if (EXCLUDED.test(url.pathname)) return;

  // Next.js internal data requests: never cache (would freeze client-side navigation)
  if (
    url.searchParams.has("_rsc") ||
    url.pathname.startsWith("/_next/data/") ||
    request.headers.has("rsc") ||
    request.headers.has("next-router-prefetch")
  ) {
    return;
  }

  // Pages
  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(event));
    return;
  }

  // Hashed build files: content never changes for a given URL
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(event, STATIC_CACHE, MAX_STATIC));
    return;
  }

  // Images, fonts, icons, logos (URLs that can change over time)
  if (SWR_DESTINATIONS.has(request.destination)) {
    event.respondWith(staleWhileRevalidate(event, ASSET_CACHE, MAX_ASSETS));
  }
});