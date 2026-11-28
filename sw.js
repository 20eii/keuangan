/* Keuanganku v2.02 — Service Worker (PWA)
   Bikin aplikasi bisa dibuka OFFLINE setelah pertama kali dibuka online.
   CARA UPDATE VERSI: tiap rilis baru, naikkan angka di CACHE di bawah
   (mis. ke "keuanganku-v2.03") supaya HP pengunjung mengambil file baru,
   lalu upload ulang sw.js + index.html ke GitHub. */
const CACHE = 'keuanganku-v2.02';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

/* Install: simpan semua file aplikasi ke cache, lalu langsung aktif. */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

/* Activate: hapus cache versi lama, ambil alih halaman yang sedang terbuka. */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Fetch: halaman (navigasi) = online dulu, kalau gagal pakai cache.
   File lain (ikon, manifest) = cache dulu, kalau belum ada ambil online. */
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res.ok && new URL(req.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
