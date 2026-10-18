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

  /* Poisson-timed drops; radius in mm follows an exponential spread (Marshall-Palmer style). */
  function drops(d, r, rate, rMin, rMean, rMax, q, rise) {
    var t, R;
    for (t = expo(rate); t < d.length / r; t += expo(rate)) {
      R = Math.min(rMax, rMin + expo(1 / rMean));
      bubble(d, r, Math.floor(t * r), 3260 / R, 0.05 * R, q, rise);
    }
  }

  function hiss(d, k) {
    for (var i = 0, lp = 0, x; i < d.length; i++) {
      x = Math.random() * 2 - 1; lp += 0.3 * (x - lp); d[i] = (x - lp) * k;
    }
  }

  G.rain = { sec: 6, rate: 22050, fill: function (d, r) {
    hiss(d, 0.06);
    drops(d, r, 380, 0.4, 0.5, 3, 14, 10);
    NS.norm(d, 0.6);
  } };

  G.stream = { sec: 6, rate: 22050, fill: function (d, r, n) {
    for (var i = 0, last = 0; i < n; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 0.6;
    }
    drops(d, r, 160, 1.5, 2.5, 9, 8, 80);
    NS.norm(d, 0.6);
  } };

  /* Fire: low combustion roar plus Poisson crackles with heavy-tailed (power-law) pop sizes. */
  G.crackle = { sec: 8, rate: 22050, fill: function (d, r, n) {
    var i, last = 0, t, k, i0, len, a, tau;
    for (i = 0; i < n; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 0.9; }
    for (t = expo(16); t < n / r; t += expo(16)) {
      a = Math.min(2, 0.15 * Math.pow(1 - Math.random(), -0.67));
      tau = 0.002 + Math.random() * 0.01; i0 = Math.floor(t * r); len = Math.round(5 * tau * r);
      for (k = 0; k < len; k++) d[(i0 + k) % n] += a * (Math.random() * 2 - 1) * Math.exp(-k / (tau * r));
    }
    NS.norm(d, 0.7);
  } };
})(window);
