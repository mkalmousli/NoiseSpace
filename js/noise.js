/* Noise generators: white, pink (Paul Kellet) and brown, cached per context. */
(function (w) {
  var NS = w.NS = w.NS || {}, bufs = {};

  NS.noiseBuf = function (ctx, kind) {
    if (bufs[kind]) return bufs[kind];
    var n = ctx.sampleRate * 6, b = ctx.createBuffer(1, n, ctx.sampleRate);
    var d = b.getChannelData(0), i, x, last = 0, p = [0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < n; i++) {
      x = Math.random() * 2 - 1;
      if (kind === 'pink') {
        p[0] = 0.99886 * p[0] + x * 0.0555179; p[1] = 0.99332 * p[1] + x * 0.0750759;
        p[2] = 0.96900 * p[2] + x * 0.1538520; p[3] = 0.86650 * p[3] + x * 0.3104856;
        p[4] = 0.55000 * p[4] + x * 0.5329522; p[5] = -0.7616 * p[5] - x * 0.0168980;
        d[i] = (p[0] + p[1] + p[2] + p[3] + p[4] + p[5] + p[6] + x * 0.5362) * 0.11;
        p[6] = x * 0.115926;
      } else if (kind === 'brown') {
        last = (last + 0.02 * x) / 1.02;
        d[i] = last * 3.5;
      } else {
        d[i] = x * 0.4;
      }
    }
    return (bufs[kind] = b);
  }
})(window);
