// Simple PWA service worker
self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('mmadtrack360-cache').then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone())
          return networkResponse
        })
      })
    })
  )
})
