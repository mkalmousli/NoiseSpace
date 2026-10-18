/* Wiring: clicks, sliders, presets, theme, service worker. */
(function (w, d) {
  var NS = w.NS, $ = NS.$, S = NS.state, last = [], cur = -1;
  NS.timerEnd = function () { last = []; mark(-1); NS.sync(); };

  function mark(i) {
    var b = $('presets').childNodes, k;
    cur = i;
    for (k = 0; k < b.length; k++) {
      b[k].className = k === i ? 'chip sel' : 'chip';
      b[k].setAttribute('aria-pressed', k === i ? 'true' : 'false');
    }
  }

  function setSlider(id, v) {
    var el = $('c-' + id).lastChild;
    el.value = Math.round(v * 100);
  }

  function toggle(id) {
    mark(-1);
    NS.toggle(id, !NS.isOn(id));
    NS.sync();
  }

  function preset(i) {
    var id, p = NS.presets[i];
    if (i === cur) { NS.stopAll(); last = []; mark(-1); NS.sync(); return; }
    NS.stopAll(); mark(i);
    for (id in p.mix) {
      if (!p.mix.hasOwnProperty(id)) continue;
      S.vol[id] = p.mix[id];
      setSlider(id, p.mix[id]);
      NS.toggle(id, true);
    }
    NS.save(); NS.sync();
  }

  function playPause() {
    if (NS.count()) { last = NS.stopAll(); mark(-1); }
    else if (last.length) { for (var i = 0; i < last.length; i++) NS.toggle(last[i], true); }
    else preset(1);
    NS.sync();
  }

  function theme(t) {
    S.theme = t;
    d.documentElement.setAttribute('data-theme', t);
    d.documentElement.style.colorScheme = t;
    $('theme').innerHTML = NS.icon(t === 'dark' ? 'sun' : 'moon');
    $('theme').setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    var m = d.querySelector('meta[name=theme-color]');
    if (m) m.setAttribute('content', t === 'dark' ? '#1e1c17' : '#e4d9bf');
  }

  var sync = NS.sync;
  NS.sync = function () { sync(); if (!NS.count()) cur = -1; mark(cur); };
  NS.render();
  NS.sync();
  theme(d.documentElement.getAttribute('data-theme') || 'light');

  $('grid').addEventListener('click', function (e) {
    var b = NS.closest(e.target, 'tog');
    if (b) toggle(b.getAttribute('data-id'));
  });
  $('grid').addEventListener('input', function (e) {
    var el = e.target, id = el.getAttribute('data-id');
    if (!id) return;
    NS.setVol(id, el.value / 100);
    NS.save();
  });
  $('presets').addEventListener('click', function (e) {
    var b = NS.closest(e.target, 'chip');
    if (b) preset(+b.getAttribute('data-p'));
  });
  $('master').addEventListener('input', function () { NS.setMaster(this.value / 100); NS.save(); });
  $('play').addEventListener('click', playPause);
  $('theme').addEventListener('click', function () {
    theme(d.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    NS.save();
  });

})(window, document);
