/* Indexes the sound list and defines the presets (volume 0-1 per sound id). */
(function (w) {
  var NS = w.NS = w.NS || {};

  NS.byId = {};
  for (var i = 0; i < NS.sounds.length; i++) NS.byId[NS.sounds[i].id] = NS.sounds[i];

  NS.presets = [
    { name: 'Deep focus', mix: { focus: 0.45, brown: 0.35 } },
    { name: 'Study', mix: { rain: 0.45, pink: 0.2 } },
    { name: 'Relax', mix: { ocean: 0.5, bowl: 0.3 } },
    { name: 'Sleep', mix: { brown: 0.5, space: 0.3 } },
    { name: 'Cozy', mix: { fire: 0.5, rain: 0.3 } },
    { name: 'Forest', mix: { stream: 0.5, wind: 0.3 } },
    { name: 'Night', mix: { crickets: 0.35, wind: 0.2 } }
  ];
})(window);
