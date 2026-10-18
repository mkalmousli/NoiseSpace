/* Speech-like murmur: each talker is a glottal pulse train through three formant resonators,
   speaking vowel-like syllables in phrases with turn-taking pauses. Layered talkers blur into
   unintelligible café babble. Vowel formants after Peterson & Barney (1952). */
(function (w) {
  var NS = w.NS = w.NS || {}, G = NS.gen, S = NS.sounds = NS.sounds || [], TAU = 2 * Math.PI, R = 16000;
  var V = [[730, 1090, 2440], [660, 1720, 2410], [270, 2290, 3010], [300, 870, 2240],
           [530, 1840, 2480], [570, 840, 2410], [440, 1020, 2240]];
  var BW = [70, 100, 140], GN = [1, 0.7, 0.4], RR = [], G0 = [];
  for (var b = 0; b < 3; b++) { RR[b] = Math.exp(-Math.PI * BW[b] / R); G0[b] = (1 - RR[b]) * GN[b]; }

  function phrases(n, f0) {
    var t = 0.2 + Math.random() * 3, end = n / R - 0.5, syl = [], len, k, dur;
    while (t < end) {
      for (len = 3 + (Math.random() * 6 | 0), k = 0; k < len && t < end; k++) {
        dur = 0.11 + Math.random() * 0.14;
        syl.push({ a: t, b: t + dur, v: V[Math.random() * V.length | 0], p: f0 * (1.1 + 0.2 * Math.random() - 0.05 * k), s: Math.random() < 0.35 });
        t += dur + 0.01 + Math.random() * 0.05;
      }
      t += 1 + Math.random() * 4;
    }
    return syl;
  }

  function talker(d, f0, sc) {
    var n = d.length, syl = phrases(n, f0), j = 0, i, q, tt, s, ph = 0, amp = 0, p = f0, lp = 0, x, y, z;
    var F = [500 * sc, 1500 * sc, 2500 * sc], c1 = [0, 0, 0], c2 = [0, 0, 0], y1 = [0, 0, 0], y2 = [0, 0, 0];
    for (i = 0; i < n; i++) {
      tt = i / R;
      while (j < syl.length && syl[j].b < tt) j++;
      s = j < syl.length && syl[j].a <= tt ? syl[j] : null;
      if (s) { p += 0.002 * (s.p - p); }
      if (!(i & 63)) {
        for (q = 0; q < 3; q++) {
          if (s) F[q] += 0.4 * (s.v[q] * sc - F[q]);
          c1[q] = 2 * RR[q] * Math.cos(TAU * F[q] / R); c2[q] = -RR[q] * RR[q];
        }
      }
      amp += ((s ? 1 : 0) - amp) * 0.004;
      ph += p / R; if (ph >= 1) ph -= 1;
      lp += 0.3 * ((1 - 2 * ph) - lp);
      x = lp * amp + (Math.random() - 0.5) * (0.04 * amp + (s && s.s && tt - s.a < 0.05 ? 0.3 : 0));
      for (z = 0, q = 0; q < 3; q++) {
        y = x + c1[q] * y1[q] + c2[q] * y2[q];
        y2[q] = y1[q]; y1[q] = y; z += G0[q] * y;
      }
      d[i] += z;
    }
  }

  G.talk = { sec: 12, rate: R, fill: function (d) {
    var f0 = [105, 122, 96, 205, 185, 225, 112, 195], sc = [1, 1, 0.96, 1.17, 1.15, 1.2, 1, 1.15], i;
    for (i = 0; i < f0.length; i++) talker(d, f0[i] * (0.95 + 0.1 * Math.random()), sc[i]);
    NS.norm(d, 0.6);
  } };

  S.push({ id: 'talk', name: 'Coffee', desc: 'Distant café murmur', vol: 0.4, file: 'audio/talk.mp3', build: function (H, o) {
    var f = H.filt('lowpass', 3800, 0.5), g = H.gain(0.7), s;
    f.connect(o); H.noise('talk').connect(f);
    s = H.noise('talk'); s.playbackRate.value = 0.84; s.connect(g); g.connect(f);
  } });
})(window);
