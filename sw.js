/* Cache-first service worker so the app loads instantly and works offline. */
var CACHE = 'noisespace-v2';
var FILES = [
  './', 'index.html', 'logo.svg', 'manifest.json',
  'css/base.css', 'css/layout.css', 'css/aero.css',
  'js/store.js', 'js/icons.js', 'js/noise.js', 'js/drops.js', 'js/waves.js', 'js/helpers.js',
  'js/sounds-nature.js', 'js/sounds-tone.js', 'js/catalog.js', 'js/engine.js', 'js/ui.js', 'js/app.js', 'faq.html'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function (hit) {
    var net = fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    });
    return hit || net;
  }));
});
