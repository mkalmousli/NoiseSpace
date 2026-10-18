/* Real recordings (CC0, see credits in the FAQ): fetched on first use, decoded once, looped.
   If a file cannot be loaded (e.g. offline on first visit) the sound falls back to its synthesized model. */
(function (w) {
  var NS = w.NS = w.NS || {}, H = NS.H, bufs = {}, wait = {};
  NS.busy = {};

  function load(ctx, url, cb) {
    var x;
    if (bufs[url]) return cb(bufs[url]);
    if (wait[url]) return wait[url].push(cb);
    wait[url] = [cb];
    function done(b) { var q = wait[url], i; delete wait[url]; bufs[url] = b; for (i = 0; i < q.length; i++) q[i](b); }
    x = new XMLHttpRequest();
    x.open('GET', url); x.responseType = 'arraybuffer';
    x.onload = function () {
      if (x.status !== 200) return done(null);
      try { ctx.decodeAudioData(x.response, done, function () { done(null); }); } catch (e) { done(null); }
    };
    x.onerror = function () { done(null); };
    x.send();
  }

  /* Starts a sound's recording into dest; src list is H.cur at call time so stopping cancels a pending start. */
  H.play = function (s, dest) {
    var list = H.cur, ctx = H.c;
    NS.busy[s.id] = true;
    load(ctx, s.file, function (buf) {
      var src;
      delete NS.busy[s.id];
      if (list.dead) return;
      if (!buf) { H.cur = list; s.build(H, dest); }
      else {
        src = ctx.createBufferSource();
        src.buffer = buf; src.loop = true; src.connect(dest);
        src.start(0, Math.random() * buf.duration); list.push(src);
      }
      NS.sync();
    });
    return function () { list.dead = true; delete NS.busy[s.id]; };
  };
})(window);
