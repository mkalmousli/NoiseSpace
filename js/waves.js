/* Ocean surf (swell, crash and foam wash, ~10 s period) and a chorus of crickets (pulsed chirps). */
(function (w) {
  var NS = w.NS, G = NS.gen;

  G.ocean = { sec: 30, rate: 11025, fill: function (d, r, n) {
    var f = r * 2, x = new Float32Array(n + f), env = new Float32Array(n), k, i, c, t, y = 0, a;
    for (k = 0; k < 3; k++) {
      c = (k + 0.4 + Math.random() * 0.2) * n / 3;
      for (i = 0; i < n; i++) {
        t = (i - c) / r;
        if (t > 15) t -= 30; else if (t < -15) t += 30;
        if (t > -7 && t < 16) env[i] += t < 0 ? Math.exp(-t * t / 8) : Math.exp(-t / 3.5);
      }
    }
    for (i = 0; i < n + f; i++) {
      a = 0.03 + 0.5 * env[i % n];
      y += a * (Math.random() * 2 - 1 - y);
      x[i] = y * (0.3 + 1.4 * env[i % n]);
    }
    for (i = 0; i < n; i++) d[i] = i < f ? x[i] * (i / f) + x[i + n] * (1 - i / f) : x[i];
    NS.norm(d, 0.7);
  } };

  G.crickets = { sec: 12, rate: 22050, fill: function (d, r, n) {
    var m, j, p, i0, k, c, f0, per, a, o, L = Math.round(0.012 * r);
    for (m = 0; m < 5; m++) {
      f0 = 4200 + Math.random() * 900; per = 24 + Math.floor(Math.random() * 12);
      a = 0.3 + Math.random() * 0.5; o = Math.random() * n;
      for (j = 0; j < per; j++) for (p = 0; p < 3; p++) {
        i0 = Math.floor(o + j * n / per + p * 0.03 * r);
        for (k = 0; k < L; k++) {
          c = Math.sin(Math.PI * k / L);
          d[(i0 + k) % n] += a * c * c * Math.sin(2 * Math.PI * f0 * k / r);
        }
      }
    }
    NS.norm(d, 0.6);
  } };
})(window);
