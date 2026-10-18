/* Service worker registration with an in-app "new version" prompt. */
(function (w, d) {
  var $ = w.NS.$;
  /* Register the worker; when a new version is waiting, offer an Update button, then reload. */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    var reloaded = false, had = !!navigator.serviceWorker.controller;
    var offer = function (sw) {
      $('upd').hidden = false;
      $('updgo').onclick = function () { sw.postMessage('skip'); };
    };
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (had && !reloaded) { reloaded = true; location.reload(); }
    });
    w.addEventListener('load', function () { setTimeout(function () {
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
        reg.addEventListener('updatefound', function () {
          var n = reg.installing;
          n.addEventListener('statechange', function () {
            if (n.state === 'installed' && navigator.serviceWorker.controller) offer(n);
          });
        });
        d.addEventListener('visibilitychange', function () { if (!d.hidden) reg.update(); });
      });
    }, 2000); });
  }
})(window, document);
