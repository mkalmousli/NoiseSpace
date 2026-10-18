/* Noise-color and tonal sounds: 1/f^n noise, binaural beat, drone. */
(function (w) {
  var NS = w.NS = w.NS || {}, S = NS.sounds = NS.sounds || [];

  S.push(
    { id: 'brown', name: 'Brown', desc: 'Deep, calming rumble', vol: 0.45, build: function (H, o) {
      H.noise('brown').connect(o);
    } },
    { id: 'pink', name: 'Pink', desc: 'Balanced, natural hiss', vol: 0.4, build: function (H, o) {
      H.noise('pink').connect(o);
    } },
    { id: 'white', name: 'White', desc: 'Masks distractions', vol: 0.3, build: function (H, o) {
      H.noise('white').connect(o);
    } },
    { id: 'focus', name: 'Focus', desc: '10 Hz alpha · headphones', vol: 0.4, build: function (H, o) {
      var m = H.ctx().createChannelMerger(2), l = H.gain(0.25), r = H.gain(0.25);
      H.osc('sine', 200).connect(l); H.osc('sine', 210).connect(r);
      l.connect(m, 0, 0); r.connect(m, 0, 1); m.connect(o);
      H.chain('brown', 'lowpass', 400, 0.5, 0.3, o);
    } },
    { id: 'space', name: 'Space', desc: 'Slow ambient drone', vol: 0.35, build: function (H, o) {
      var f = [55, 82.4, 110.5, 165.2], i, g, n = H.filt('lowpass', 500, 0.5);
      n.connect(o);
      for (i = 0; i < f.length; i++) {
        g = H.gain(0.12);
        H.osc('sine', f[i]).connect(g); g.connect(n);
        H.lfo(0.03 + i * 0.02, 0.08, g.gain);
      }
    } }
  );
})(window);
