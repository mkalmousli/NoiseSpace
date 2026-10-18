/* Wiring: clicks, sliders, presets, sleep timer, theme, service worker. */
(function (w, d) {
  var NS = w.NS, $ = NS.$, S = NS.state, last = [], endAt = 0, timer = 0;

  function setSlider(id, v) {
    var el = $('c-' + id).lastChild;
    el.value = Math.round(v * 100);
  }

  function toggle(id) {
    NS.toggle(id, !NS.isOn(id));
    NS.sync();
  }

  function preset(p) {
    var id;
    NS.stopAll();
    for (id in p.mix) {
      if (!p.mix.hasOwnProperty(id)) continue;
      S.vol[id] = p.mix[id];
      setSlider(id, p.mix[id]);
      NS.toggle(id, true);
    }
    NS.save(); NS.sync();
  }

  function playPause() {
    if (NS.count()) { last = NS.stopAll(); }
    else if (last.length) { for (var i = 0; i < last.length; i++) NS.toggle(last[i], true); }
    else preset(NS.presets[1]);
    NS.sync();
  }

  function showTimer() {
    var s = Math.max(0, Math.round((endAt - new Date().getTime()) / 1000));
    $('left').firstChild.nodeValue = s ? 'Stops in ' + Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + s % 60 : '';
    if (!s) { clearInterval(timer); NS.fadeOut(function () { last = []; NS.sync(); $('sleep').value = '0'; }); }
  }

  function setTimer(min) {
    clearInterval(timer);
    $('left').firstChild.nodeValue = '';
    if (!min) return;
    endAt = new Date().getTime() + min * 60000;
    timer = setInterval(showTimer, 1000);
    showTimer();
  }

  function theme(t) {
    S.theme = t;
    d.documentElement.setAttribute('data-theme', t);
    $('theme').innerHTML = NS.icon(t === 'dark' ? 'sun' : 'moon');
    $('theme').setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    var m = d.querySelector('meta[name=theme-color]');
    if (m) m.setAttribute('content', t === 'dark' ? '#0e1b22' : '#e9f5f7');
  }

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
    if (b) preset(NS.presets[b.getAttribute('data-p')]);
  });
  $('master').addEventListener('input', function () { NS.setMaster(this.value / 100); NS.save(); });
  $('play').addEventListener('click', playPause);
  $('sleep').addEventListener('change', function () { setTimer(+this.value); });
  $('theme').addEventListener('click', function () {
    theme(S.theme === 'dark' ? 'light' : 'dark');
    NS.save();
  });

})(window, document);
