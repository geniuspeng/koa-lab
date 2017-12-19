let cacheName = 'almanacPWA';
let dataCacheName = 'almanacData';

let filesToCache = [
  '/almanac',
  '/pwa_static/scripts/almanac.js',
  '/pwa_static/styles/almanac.css',
  '/static/common/mobiscroll/mobiscroll.min.js',
  '/static/common/mobiscroll/mobiscroll.min.css',
  '//static.yidianzixun.com/modules/koa/common/zepto_full_1.2.0.min.js',
  '//static.yidianzixun.com/modules/koa/common/ejs.min.js',
  '/images/client/almanac/almanac_fit.png',
  '/images/client/almanac/almanac_taboo.png',
  '/images/client/almanac/back.png',
  '/images/client/almanac/iconfont.ttf',
  '/images/client/almanac/line.png',
  '/images/client/common/error.png',
  '/images/client/common/load_failed.png',
  '/images/client/common/loading_logo.png',
  '/images/client/common/loading_logo_nt.png',
  '/images/client/common/yidian_logo.png'
];

self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  )
});

self.addEventListener('activate', (e) => {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  console.log('[Service Worker] Fetch', e.request.url);
  let dataUrl = '//hub.go2yd.com';
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then((cache) => {
        return fetch(e.request).then((response) => {
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } 
  else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});

self.addEventListener('sync', (e) => {
  self.registration.showNotification("Sync event fired!");
  e.source.postMessage('Service worker attached');
});

self.addEventListener('message', (e) => {
  console.log(e.data);
  // console.log(e.source)
  e.source.postMessage('Service worker attached');
  // self.clients.matchAll().then(function(clientList) {
  //   clientList.forEach(function(client) {
  //     client.postMessage('Service worker attached.');
  //   })
  // });
});

self.addEventListener("push", function (e) {
  console.log('push了一下');
});
