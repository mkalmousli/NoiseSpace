/* DOM rendering: sound cards, preset chips, and state sync. */
(function (w, d) {
  var NS = w.NS;
  NS.$ = function (id) { return d.getElementById(id); };

  NS.closest = function (n, cls) {
    while (n && n !== d) {
      if ((' ' + n.className + ' ').indexOf(' ' + cls + ' ') > -1) return n;
      n = n.parentNode;
    }
    return null;
  };

  NS.render = function () {
    var grid = NS.$('grid'), box = NS.$('presets'), i, s, li, b;
    for (i = 0; i < NS.sounds.length; i++) {
      s = NS.sounds[i];
      li = d.createElement('li');
      li.id = 'c-' + s.id;
      li.className = 'card'; li.setAttribute('style', '--h:' + s.h);
      li.innerHTML =
        '<button type="button" class="tog" data-id="' + s.id + '" aria-pressed="false">' +
        '<span class="orb">' + NS.icon(s.id) + '</span>' +
        '<span class="nm">' + s.name + '</span><span class="st">ON</span><span class="ds">' + s.desc + '</span></button>' +
        '<input class="vol" type="range" min="0" max="100" data-id="' + s.id + '" value="' +
        Math.round(NS.volume(s.id) * 100) + '" aria-label="' + s.name + ' volume">';
      grid.appendChild(li);
    }
    for (i = 0; i < NS.presets.length; i++) {
      b = d.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.setAttribute('data-p', i);
      b.appendChild(d.createTextNode(NS.presets[i].name));
      box.appendChild(b);
    }
    NS.$('master').value = Math.round(NS.state.master * 100);
  };

  NS.sync = function () {
    var i, id, on, li, n = NS.count();
    for (i = 0; i < NS.sounds.length; i++) {
      id = NS.sounds[i].id;
      on = NS.isOn(id);
      li = NS.$('c-' + id);
      li.className = on ? 'card on' : 'card';
      li.firstChild.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    NS.$('play').innerHTML = NS.icon(n ? 'stop' : 'play');
    NS.$('play').setAttribute('aria-label', n ? 'Pause all sounds' : 'Play');
    NS.$('status').firstChild.nodeValue = !NS.supported ? 'Web Audio is not supported here.' :
      n ? n + (n === 1 ? ' sound playing' : ' sounds playing') : 'Pick a sound to begin';
  };
})(window, document);
