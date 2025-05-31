// 🔧 Service Worker for Speak EU
// Provides offline functionality and caching

const CACHE_NAME = 'speak-eu-v2.0.0';
const STATIC_CACHE = 'speak-eu-static-v2.0.0';
const DYNAMIC_CACHE = 'speak-eu-dynamic-v2.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/themes.css',
  '/css/animations.css',
  '/js/app.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Dynamic files that will be cached as they're used
const DYNAMIC_FILES = [
  '/data/languages.json',
  '/data/vocabulary/',
  '/images/',
  '/audio/'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('SW: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('SW: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('SW: Installation failed', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE;
            })
            .map(cacheName => {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('SW: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('SW: Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request)
          .then(networkResponse => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }
            
            // Determine which cache to use
            const shouldCache = STATIC_FILES.some(file => 
              request.url.endsWith(file)
            ) || DYNAMIC_FILES.some(pattern => 
              request.url.includes(pattern)
            );
            
            if (shouldCache) {
              const responseClone = networkResponse.clone();
              const cacheToUse = STATIC_FILES.some(file => 
                request.url.endsWith(file)
              ) ? STATIC_CACHE : DYNAMIC_CACHE;
              
              caches.open(cacheToUse)
                .then(cache => {
                  console.log('SW: Caching new resource:', request.url);
                  cache.put(request, responseClone);
                });
            }
            
            return networkResponse;
          })
          .catch(error => {
            console.error('SW: Network request failed:', error);
            
            // Serve offline fallback for HTML pages
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            // For other files, just fail
            throw error;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('SW: Background sync triggered');
  
  if (event.tag === 'progress-sync') {
    event.waitUntil(syncProgress());
  }
});

// Push notifications (future feature)
self.addEventListener('push', event => {
  console.log('SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'নতুন আপডেট উপলব্ধ!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'speak-eu-update',
    actions: [
      {
        action: 'open',
        title: 'খুলুন',
        icon: '/icons/action-open.png'
      },
      {
        action: 'close',
        title: 'বন্ধ করুন',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Speak EU', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('SW: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function to sync progress
async function syncProgress() {
  try {
    const storedProgress = localStorage.getItem('speak_eu_state');
    if (storedProgress) {
      // In a real app, this would sync to a server
      console.log('SW: Progress synced successfully');
    }
  } catch (error) {
    console.error('SW: Progress sync failed:', error);
  }
}

// Cache cleanup utility
async function cleanupCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    !name.includes('v2.0.0')
  );
  
  return Promise.all(
    oldCaches.map(name => caches.delete(name))
  );
}

console.log('SW: Service Worker loaded successfully');
