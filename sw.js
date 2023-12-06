const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
  '/',
  '/static/js/app.js',
  '/static/js/chat.js',
  '/static/css/chat.css',
  '/static/css/bootstrap.min.css',
  '/static/js/bootstrap.min.js',
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
  self.skipWaiting();
});

// fetch events
self.addEventListener('fetch', evt => {
  if(evt.request.url.indexOf('/api/chat') === -1 ){
    if (evt.request.url.indexOf('chrome-extension') === -1) {
      
      evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
          return cacheRes || fetch(evt.request).then(fetchRes => {
            return caches.open(dynamicCacheName).then(cache => {
              console.log(`page to add to cache ${evt.request.url}`)
              cache.put(evt.request.url, fetchRes.clone());
              // check cached items size
              limitCacheSize(dynamicCacheName, 15);
              return fetchRes;
            })
          });
        }).catch(() => {
          if(evt.request.url.indexOf('.html') > -1){
            return caches.match('/pages/fallback.html');
          } 
        })
        );
      }
  }
});
// Check for updates in the background
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_FOR_UPDATES') {
    self.skipWaiting(); // Activate the new service worker
    console.log('checking for updates')
    // Respond to the message

    // Send a message back to the client page
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'NEW_UPDATE_IS_AVAILABLE' });
      });
    });

  }
});