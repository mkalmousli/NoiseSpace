/* Builder helpers passed to each sound: tracked sources, filters, gains, LFOs. */
(function (w) {
  var NS = w.NS = w.NS || {};

  /* Helpers handed to each sound's build(H, out). Sources are tracked in H.cur. */
  var H = NS.H = {
    c: null,
    cur: [],
    ctx: function () { return H.c; },
    buf: function (k) { return NS.noiseBuf(H.c, k); },
    noise: function (kind) {
      var s = H.c.createBufferSource();
      s.buffer = H.buf(kind); s.loop = true;
      s.start(0, Math.random() * 4);
      H.cur.push(s);
      return s;
    },
    osc: function (type, freq) {
      var o = H.c.createOscillator();
      o.type = type; o.frequency.value = freq; o.start(0); H.cur.push(o);
      return o;
    },
    filt: function (type, f, q) {
      var n = H.c.createBiquadFilter();
      n.type = type; n.frequency.value = f; n.Q.value = q || 0.7;
      return n;
    },
    gain: function (v) { var g = H.c.createGain(); g.gain.value = v; return g; },
    lfo: function (rate, depth, param) {
      var o = H.osc('sine', rate), g = H.gain(depth);
      o.connect(g); g.connect(param);
    }
  };
})(window);
