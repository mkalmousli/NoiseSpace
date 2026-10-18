/* Persistent settings (volumes, master level, theme) in localStorage. */
(function (w) {
  var NS = w.NS = w.NS || {}, KEY = 'noisespace.v1';
  var S = NS.state = { vol: {}, master: 0.8, theme: null };

  try {
    var r = JSON.parse(w.localStorage.getItem(KEY));
    if (r) {
      S.vol = r.vol || {};
      S.master = typeof r.master === 'number' ? r.master : 0.8;
      S.theme = r.theme || null;
    }
  } catch (e) {}

  var wait;
  NS.save = function () {
    clearTimeout(wait);
    wait = setTimeout(function () {
      try { w.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    }, 300);
  };

  NS.volume = function (id) {
    var v = S.vol[id];
    return typeof v === 'number' ? v : NS.byId[id].vol;
  };
})(window);
