// Service Worker for MMadTrack360 Security PWA
// Handles offline functionality, caching, and push notifications

const CACHE_NAME = 'mmadtrack360-v1.0.0';
const STATIC_CACHE = 'mmadtrack360-static-v1.0.0';
const DYNAMIC_CACHE = 'mmadtrack360-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // Add your CSS and JS files here
  // '/assets/index.css',
  // '/assets/index.js',
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/staff/,
  /\/api\/tasks/,
  /\/api\/analytics/,
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Serve cached version or offline page
          return caches.match(request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      handleApiRequest(request)
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => cache.put(request, responseClone));
            }
            return response;
          })
          .catch(() => {
            // Return offline fallback for images
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Offline</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
            
            // Return generic offline response
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Handle API requests with caching strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Check if this API endpoint should be cached
  const shouldCache = API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
  
  if (request.method === 'GET' && shouldCache) {
    // Cache-first strategy for GET requests
    try {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        // Serve cached version and update in background
        fetchAndCache(request);
        return cachedResponse;
      }
      
      // No cache, fetch from network
      return await fetchAndCache(request);
    } catch (error) {
      // Network failed, try cache
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // No cache available, return error
      return new Response(
        JSON.stringify({ error: 'Offline', message: 'No cached data available' }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } else {
    // Network-first strategy for POST/PUT/DELETE requests
    try {
      const response = await fetch(request);
      return response;
    } catch (error) {
      // Store failed requests for retry when online
      if (request.method !== 'GET') {
        await storeFailedRequest(request);
      }
      
      return new Response(
        JSON.stringify({ error: 'Offline', message: 'Request queued for retry' }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
}

// Fetch and cache helper function
async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      const responseClone = response.clone();
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, responseClone);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}

// Store failed requests for retry
async function storeFailedRequest(request) {
  try {
    const requestData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: await request.text(),
      timestamp: Date.now()
    };
    
    // Store in IndexedDB or localStorage
    const failedRequests = JSON.parse(localStorage.getItem('mmadtrack_failed_requests') || '[]');
    failedRequests.push(requestData);
    localStorage.setItem('mmadtrack_failed_requests', JSON.stringify(failedRequests));
  } catch (error) {
    console.error('Failed to store failed request:', error);
  }
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  let notificationData = {
    title: 'MMadTrack360 Security',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'default',
    requireInteraction: false,
    actions: []
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      console.error('Failed to parse push notification data:', error);
    }
  }

  // Customize notification based on type
  if (notificationData.type === 'emergency') {
    notificationData.requireInteraction = true;
    notificationData.tag = 'emergency';
    notificationData.actions = [
      {
        action: 'respond',
        title: 'Respond',
        icon: '/icons/respond-24x24.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-24x24.png'
      }
    ];
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data || {};

  if (action === 'respond') {
    // Open app to emergency response page
    event.waitUntil(
      clients.openWindow('/emergency/respond?id=' + notificationData.id)
    );
  } else if (action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Focus existing window if available
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// Background sync event for retrying failed requests
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'retry-failed-requests') {
    event.waitUntil(retryFailedRequests());
  }
});

// Retry failed requests when back online
async function retryFailedRequests() {
  try {
    const failedRequests = JSON.parse(localStorage.getItem('mmadtrack_failed_requests') || '[]');
    const successfulRequests = [];

    for (const requestData of failedRequests) {
      try {
        const response = await fetch(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body || undefined
        });

        if (response.ok) {
          successfulRequests.push(requestData);
        }
      } catch (error) {
        console.error('Failed to retry request:', error);
      }
    }

    // Remove successful requests from storage
    const remainingRequests = failedRequests.filter(
      req => !successfulRequests.includes(req)
    );
    localStorage.setItem('mmadtrack_failed_requests', JSON.stringify(remainingRequests));

    console.log(`Retried ${successfulRequests.length} failed requests`);
  } catch (error) {
    console.error('Failed to retry failed requests:', error);
  }
}

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(DYNAMIC_CACHE)
      .then(() => {
        event.ports[0].postMessage({ success: true });
      })
      .catch((error) => {
        event.ports[0].postMessage({ success: false, error: error.message });
      });
  }
});

// Periodic background sync for data updates
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync triggered');
  
  if (event.tag === 'update-data') {
    event.waitUntil(updateCachedData());
  }
});

// Update cached data in background
async function updateCachedData() {
  try {
    // Update critical data like staff locations, alerts, etc.
    const criticalEndpoints = [
      '/api/staff/locations',
      '/api/alerts/active',
      '/api/tasks/urgent'
    ];

    for (const endpoint of criticalEndpoints) {
      try {
        await fetchAndCache(new Request(endpoint));
      } catch (error) {
        console.error(`Failed to update ${endpoint}:`, error);
      }
    }
  } catch (error) {
    console.error('Failed to update cached data:', error);
  }
}

console.log('Service Worker: Loaded and ready');