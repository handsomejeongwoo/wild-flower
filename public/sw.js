const CACHE_NAME = 'wildflower-v1'

self.addEventListener('install', (e) => {
  e.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    caches.match(e.request).then((cached) =>
      cached || fetch(e.request).then((res) => {
        if (res.ok && e.request.url.startsWith(self.location.origin)) {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone))
        }
        return res
      })
    ).catch(() => caches.match('/'))
  )
})
