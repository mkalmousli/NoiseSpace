/* Sound catalog. Every sound is synthesized live, so there are no audio files to download. */
(function (w) {
  var NS = w.NS = w.NS || {};

  function lp(H, kind, type, f, q, level, o) {
    var n = H.filt(type, f, q), g = H.gain(level);
    H.noise(kind).connect(n); n.connect(g); g.connect(o);
    return g;
  }

  NS.sounds = [
    { id: 'rain', name: 'Rain', desc: 'Steady shower', vol: 0.5, build: function (H, o) {
      lp(H, 'white', 'highpass', 900, 0.7, 0.8, o);
      lp(H, 'pink', 'bandpass', 350, 0.6, 0.7, o);
    } },
    { id: 'ocean', name: 'Ocean', desc: 'Slow rolling waves', vol: 0.55, build: function (H, o) {
      var g = lp(H, 'brown', 'lowpass', 500, 0.5, 0.55, o);
      H.lfo(0.09, 0.4, g.gain);
    } },
    { id: 'wind', name: 'Wind', desc: 'Soft drifting breeze', vol: 0.45, build: function (H, o) {
      var n = H.filt('bandpass', 600, 1.2), g = H.gain(0.6);
      H.noise('pink').connect(n); n.connect(g); g.connect(o);
      H.lfo(0.05, 300, n.frequency); H.lfo(0.13, 0.3, g.gain);
    } },
    { id: 'stream', name: 'Stream', desc: 'Babbling brook', vol: 0.45, build: function (H, o) {
      var n = H.filt('bandpass', 2200, 0.5), g = H.gain(0.7);
      H.noise('white').connect(n); n.connect(g); g.connect(o);
      H.lfo(2.5, 500, n.frequency);
      lp(H, 'pink', 'highpass', 1200, 0.7, 0.4, o);
    } },
    { id: 'fire', name: 'Fireplace', desc: 'Warm crackle', vol: 0.5, build: function (H, o) {
      lp(H, 'brown', 'lowpass', 260, 0.7, 1, o);
      var c = H.ctx(), alive = true, hp = H.filt('highpass', 1500, 0.7);
      hp.connect(o);
      (function pop() {
        if (!alive) return;
        var s = c.createBufferSource(), e = H.gain(0), t = c.currentTime;
        s.buffer = H.buf('white'); s.connect(e); e.connect(hp);
        e.gain.setValueAtTime(0.9 * Math.random(), t);
        e.gain.exponentialRampToValueAtTime(0.001, t + 0.03 + Math.random() * 0.05);
        s.start(t, Math.random() * 4); s.stop(t + 0.12);
        setTimeout(pop, 40 + Math.random() * 350);
      })();
      return function () { alive = false; };
    } },
    { id: 'brown', name: 'Brown noise', desc: 'Deep, calming rumble', vol: 0.45, build: function (H, o) {
      H.noise('brown').connect(o);
    } },
    { id: 'pink', name: 'Pink noise', desc: 'Balanced, natural hiss', vol: 0.4, build: function (H, o) {
      H.noise('pink').connect(o);
    } },
    { id: 'white', name: 'White noise', desc: 'Masks distractions', vol: 0.3, build: function (H, o) {
      H.noise('white').connect(o);
    } },
    { id: 'focus', name: 'Focus tone', desc: '10 Hz alpha · headphones', vol: 0.4, build: function (H, o) {
      var m = H.ctx().createChannelMerger(2), l = H.gain(0.25), r = H.gain(0.25);
      H.osc('sine', 200).connect(l); H.osc('sine', 210).connect(r);
      l.connect(m, 0, 0); r.connect(m, 0, 1); m.connect(o);
      lp(H, 'brown', 'lowpass', 400, 0.5, 0.3, o);
    } },
    { id: 'space', name: 'Deep space', desc: 'Slow ambient drone', vol: 0.35, build: function (H, o) {
      var f = [55, 82.4, 110.5, 165.2], i, g, n = H.filt('lowpass', 500, 0.5);
      n.connect(o);
      for (i = 0; i < f.length; i++) {
        g = H.gain(0.12);
        H.osc('sine', f[i]).connect(g); g.connect(n);
        H.lfo(0.03 + i * 0.02, 0.08, g.gain);
      }
    } }
  ];

  NS.byId = {};
  for (var i = 0; i < NS.sounds.length; i++) NS.byId[NS.sounds[i].id] = NS.sounds[i];

  NS.presets = [
    { name: 'Deep focus', mix: { focus: 0.45, brown: 0.35 } },
    { name: 'Study', mix: { rain: 0.45, pink: 0.2 } },
    { name: 'Relax', mix: { ocean: 0.5, wind: 0.25 } },
    { name: 'Sleep', mix: { brown: 0.5, space: 0.3 } },
    { name: 'Cozy', mix: { fire: 0.5, rain: 0.3 } },
    { name: 'Forest', mix: { stream: 0.5, wind: 0.3 } }
  ];
})(window);
