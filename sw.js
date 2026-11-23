const CACHE = "keuanganku-v16";
const STATIC_FILES = ["./", "./index.html", "./manifest.json", "./icon-192-minimal.png", "./icon-512-minimal.png", "./icon-192-minimal-maskable.png", "./icon-512-minimal-maskable.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(STATIC_FILES.map(f => c.add(f)))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
function cacheable(res){ return res && res.ok && (res.type === "basic" || res.type === "default"); }
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== "GET") return;
  const isHTML = e.request.mode === "navigate" || u.pathname.endsWith("index.html") || u.pathname.endsWith("/");
  if (isHTML) {
    e.respondWith(fetch(e.request).then(res => {
      if (cacheable(res)) { const copy = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", copy)); }
      return res;
    }).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => {
    const net = fetch(e.request).then(res => {
      if (cacheable(res)) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
