/* Tonal and noise-color sounds: singing bowl, 1/f^n noise, binaural beat, drone. */
(function (w) {
  var NS = w.NS = w.NS || {}, S = NS.sounds = NS.sounds || [];

  S.push(
    { id: 'bowl', name: 'Singing bowl', desc: 'Inharmonic overtones', vol: 0.4, file: 'audio/bowl.mp3', build: function (H, o) {
      var c = H.ctx(), timer, notes = [196, 220, 261.6, 293.7, 329.6];
      var ratio = [1, 2.71, 5.15, 8.46], amp = [0.5, 0.3, 0.15, 0.08];
      (function strike() {
        var t = c.currentTime, f = notes[Math.floor(Math.random() * notes.length)], i, j, os, g;
        for (i = 0; i < ratio.length; i++) for (j = 0; j < 2; j++) {
          os = c.createOscillator(); g = c.createGain();
          os.frequency.value = f * ratio[i] * (1 + j * 0.0025 * (i + 1));
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(amp[i] * 0.5, t + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 12 / (1 + i * 0.6));
          os.connect(g); g.connect(o); os.start(t); os.stop(t + 13);
        }
        timer = setTimeout(strike, 7000 + Math.random() * 5000);
      })();
      return function () { clearTimeout(timer); };
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
      H.chain('brown', 'lowpass', 400, 0.5, 0.3, o);
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
  );
})(window);
