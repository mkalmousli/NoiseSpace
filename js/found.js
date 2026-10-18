/* Recorded scenes (see Sound credits); the synthesized recipes below only play if a file cannot load. */
(function (w) {
  var NS = w.NS = w.NS || {}, S = NS.sounds = NS.sounds || [];

  function rumble(H, o, hz, level, beat) {
    var f = H.filt('lowpass', hz, 0.7), g = H.gain(level);
    H.noise('brown').connect(f); f.connect(g); g.connect(o);
    if (beat) H.lfo(beat, level * 0.5, g.gain);
  }

  S.push(
    { id: 'storm', name: 'Storm', desc: 'Rain and rolling thunder', vol: 0.5, file: 'audio/storm.mp3', build: function (H, o) {
      H.noise('rain').connect(o); rumble(H, o, 220, 0.9, 0.05);
    } },
    { id: 'birds', name: 'Birds', desc: 'Morning birdsong', vol: 0.4, file: 'audio/birds.mp3', build: function (H, o) {
      var f = H.filt('highpass', 1500, 0.5); f.connect(o); H.noise('crickets').connect(f);
    } },
    { id: 'boat', name: 'Boat', desc: 'Hull creaks on water', vol: 0.5, file: 'audio/boat.mp3', build: function (H, o) {
      rumble(H, o, 380, 0.8, 0.12);
    } },
    { id: 'train', name: 'Train', desc: 'Steady rails', vol: 0.5, file: 'audio/train.mp3', build: function (H, o) {
      rumble(H, o, 500, 0.7, 2.2);
    } },
    { id: 'city', name: 'City', desc: 'Distant traffic hum', vol: 0.45, file: 'audio/city.mp3', build: function (H, o) {
      rumble(H, o, 900, 0.8, 0.08);
    } }
  );
})(window);
