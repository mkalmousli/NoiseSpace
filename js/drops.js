/* Physically based water and fire textures. A bubble rings at the Minnaert resonance f0 = 3.26 / R. */
(function (w) {
  var NS = w.NS, G = NS.gen, TAU = 2 * Math.PI;

  function expo(rate) { return -Math.log(1 - Math.random()) / rate; }

  /* Damped sinusoid with a slight upward chirp: an air bubble ringing after a drop lands.
     Rotating a phasor avoids a sin/exp call per sample, which keeps first play instant on phones. */
  function bubble(d, r, i0, f0, amp, q, rise) {
    var n = d.length, len = Math.round(6 * q * r / (Math.PI * f0)), k, dec, c = amp, s = 0, cw = 0, sw = 0, w, t;
    dec = Math.exp(-Math.PI * f0 / (q * r));
    for (k = 0; k < len; k++) {
      if (!(k & 7)) { w = TAU * f0 * (1 + rise * k / r) / r; cw = Math.cos(w); sw = Math.sin(w); }
      t = c * cw - s * sw; s = (c * sw + s * cw) * dec; c = t * dec;
      d[(i0 + k) % n] += s;
    }
  }

  /* Poisson-timed drops; radius in mm follows an exponential spread (Marshall-Palmer style).
     With mod set, arrivals are thinned by a slow swell so the flow burbles instead of droning. */
  function drops(d, r, rate, rMin, rMean, rMax, q, rise, mod) {
    var t, R, T = d.length / r;
    for (t = expo(rate); t < T; t += expo(rate)) {
      if (mod && Math.random() > 0.55 + 0.45 * Math.sin(t * TAU * 2 / T + rMin)) continue;
      R = Math.min(rMax, rMin + expo(1 / rMean));
      bubble(d, r, Math.floor(t * r), 3260 / R, 0.05 * R, q, rise);
    }
  }

  /* Surface impacts: each a short noise click; a random tilt makes small drops bright, large ones duller. */
  function patter(d, r, rate, amp, len) {
    var n = d.length, t, i0, a, c, k, m, lp, x, e;
    for (t = expo(rate); t < n / r; t += expo(rate)) {
      i0 = Math.floor(t * r); a = amp * expo(1); c = 0.1 + 0.8 * Math.random();
      m = Math.round(len * (0.5 + Math.random())); lp = 0; e = a;
      for (k = 0; k < m; k++) { x = Math.random() * 2 - 1; lp += c * (x - lp); d[(i0 + k) % n] += (x - lp) * e; e *= 1 - 4 / m; }
    }
  }

  /* Low-frequency body (leaky random walk), optionally swelled by whole numbers of cycles so the loop stays seamless. */
  function rumble(d, k, gust) {
    var n = d.length, i, last = 0;
    for (i = 0; i < n; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      d[i] += last * k * (gust ? 0.65 + 0.2 * Math.sin(TAU * 3 * i / n) + 0.15 * Math.sin(TAU * 7 * i / n + 1) : 1);
    }
  }

  /* One fire pop: a decaying differentiated-noise snap, with a low thump when it is large. */
  function pop(d, i0, a, tau) {
    var n = d.length, k, len = Math.round(5 * tau), x, p = 0, f = 0.7 + Math.random() * 0.3;
    for (k = 0; k < len; k++) {
      x = Math.random() * 2 - 1;
      d[(i0 + k) % n] += a * (x - p * f) * Math.exp(-k / tau); p = x;
      if (a > 0.8 && k < 600) d[(i0 + k) % n] += a * 0.5 * Math.sin(k * 0.085) * Math.exp(-k / 250);
    }
  }

  /* Soft saturation lifts the quiet body of a texture relative to its rare loud peaks. */
  function soft(d, k) {
    NS.norm(d, 1);
    for (var i = 0; i < d.length; i++) d[i] = d[i] * k / (1 + Math.abs(d[i] * k));
  }

  G.rain = { sec: 6, rate: 22050, fill: function (d, r) {
    rumble(d, 0.05, 1);
    patter(d, r, 1500, 0.03, 24);
    patter(d, r, 260, 0.07, 55);
    drops(d, r, 45, 0.5, 0.7, 2.6, 14, 10);
    soft(d, 3); NS.norm(d, 0.6);
  } };

  G.stream = { sec: 6, rate: 22050, fill: function (d, r) {
    rumble(d, 0.35, 1);
    drops(d, r, 900, 0.7, 0.9, 3, 6, 120, 1);
    drops(d, r, 260, 1.8, 2.2, 7, 8, 80, 1);
    drops(d, r, 70, 4, 3, 12, 10, 40, 1);
    NS.norm(d, 0.6);
  } };

  /* Fire: gusting roar, hissing sap, and clustered pops with heavy-tailed (power-law) sizes. */
  G.crackle = { sec: 8, rate: 22050, fill: function (d, r, n) {
    var t, a, j, c;
    rumble(d, 0.9, 1);
    patter(d, r, 700, 0.012, 30);
    for (t = expo(9); t < n / r; t += expo(9)) {
      a = Math.min(2, 0.15 * Math.pow(1 - Math.random(), -0.67));
      pop(d, Math.floor(t * r), a, 20 + Math.random() * 120);
      for (j = Math.random() * 3 | 0; j > 0; j--) {
        c = Math.floor((t + 0.005 + Math.random() * 0.06) * r);
        pop(d, c, a * (0.3 + Math.random() * 0.4), 20 + Math.random() * 80);
      }
    }
    soft(d, 3); NS.norm(d, 0.7);
  } };
})(window);
