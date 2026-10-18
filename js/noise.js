/* Noise colors by spectral slope: white (flat), pink (1/f, Kellet filter), brown (1/f^2, integrated). */
(function (w) {
  var NS = w.NS = w.NS || {}, bufs = {}, G = NS.gen = {};

  /* Render a texture once per kind; generators fill a Float32Array at their own sample rate. */
  NS.noiseBuf = function (ctx, kind) {
    if (bufs[kind]) return bufs[kind];
    var g = G[kind], r = g.rate || ctx.sampleRate, n = Math.round(r * g.sec);
    var b = ctx.createBuffer(1, n, r);
    g.fill(b.getChannelData(0), r, n);
    return (bufs[kind] = b);
  };

  /* Fixed peak level keeps every texture predictably loud. */
  NS.norm = function (d, peak) {
    var i, m = 1e-9, k;
    for (i = 0; i < d.length; i++) if (Math.abs(d[i]) > m) m = Math.abs(d[i]);
    for (k = peak / m, i = 0; i < d.length; i++) d[i] *= k;
  };

  G.white = { sec: 4, fill: function (d, r, n) {
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * 0.4;
  } };

  G.pink = { sec: 4, fill: function (d, r, n) {
    var i, x, p = [0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < n; i++) {
      x = Math.random() * 2 - 1;
      p[0] = 0.99886 * p[0] + x * 0.0555179; p[1] = 0.99332 * p[1] + x * 0.0750759;
      p[2] = 0.96900 * p[2] + x * 0.1538520; p[3] = 0.86650 * p[3] + x * 0.3104856;
      p[4] = 0.55000 * p[4] + x * 0.5329522; p[5] = -0.7616 * p[5] - x * 0.0168980;
      d[i] = (p[0] + p[1] + p[2] + p[3] + p[4] + p[5] + p[6] + x * 0.5362) * 0.11;
      p[6] = x * 0.115926;
    }
  } };

  G.brown = { sec: 4, fill: function (d, r, n) {
    for (var i = 0, last = 0; i < n; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      d[i] = last * 3.5;
    }
  } };
})(window);
