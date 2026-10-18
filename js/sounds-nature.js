/* Nature sounds, each built from a physical model rendered by drops.js / waves.js. */
(function (w) {
  var NS = w.NS = w.NS || {}, S = NS.sounds = NS.sounds || [];

  /* Layer a second copy at another speed and random start so the loop never repeats audibly. */
  function layer(H, kind, rate, level, dest) {
    var s = H.noise(kind), g = H.gain(level);
    s.playbackRate.value = rate; s.connect(g); g.connect(dest);
  }

  S.push(
    { id: 'rain', name: 'Rain', desc: 'Modelled raindrops', vol: 0.5, file: 'audio/rain.mp3', build: function (H, o) {
      H.noise('rain').connect(o); layer(H, 'rain', 0.7, 0.5, o);
    } },
    { id: 'ocean', name: 'Ocean', desc: 'Swell, crash and foam', vol: 0.55, file: 'audio/ocean.mp3', build: function (H, o) {
      H.noise('ocean').connect(o); layer(H, 'ocean', 0.85, 0.6, o);
    } },
    { id: 'wind', name: 'Wind', desc: 'Gusting breeze', vol: 0.45, file: 'audio/wind.mp3', build: function (H, o) {
      var n = H.filt('bandpass', 600, 1.2), g = H.gain(0.6);
      H.noise('pink').connect(n); n.connect(g); g.connect(o);
      H.lfo(0.07, 350, n.frequency); H.lfo(0.07, 0.3, g.gain);
      H.lfo(0.19, 150, n.frequency); H.lfo(0.19, 0.15, g.gain);
    } },
    { id: 'stream', name: 'Stream', desc: 'Babbling bubbles', vol: 0.45, file: 'audio/stream.mp3', build: function (H, o) {
      H.noise('stream').connect(o); layer(H, 'stream', 1.12, 0.6, o);
    } },
    { id: 'fire', name: 'Fireplace', desc: 'Roar and crackle', vol: 0.5, file: 'audio/fire.mp3', build: function (H, o) {
      H.noise('crackle').connect(o); layer(H, 'crackle', 0.9, 0.6, o);
    } },
    { id: 'crickets', name: 'Crickets', desc: 'Night chirp chorus', vol: 0.3, file: 'audio/crickets.mp3', build: function (H, o) {
      var f = H.filt('lowpass', 7000, 0.5); f.connect(o);
      H.noise('crickets').connect(f); layer(H, 'crickets', 0.93, 0.7, f);
    } }
  );
})(window);
