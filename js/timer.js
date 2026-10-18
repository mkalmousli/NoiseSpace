/* Sleep timer: popover with quick picks and a custom number of minutes; fades everything out at zero. */
(function (w, d) {
  var NS = w.NS, $ = NS.$, pop = $('tpop'), btn = $('sleepbtn'), inp = $('tmin'), endAt = 0, tick = 0;

  function clamp() { var v = Math.round(+inp.value) || 1; inp.value = Math.min(720, Math.max(1, v)); return +inp.value; }
  function label(t) { $('left').firstChild.nodeValue = t; btn.className = t === 'Timer' ? 'sleep' : 'sleep on'; }
  function close() { pop.hidden = true; }

  function show() {
    var s = Math.max(0, Math.round((endAt - new Date().getTime()) / 1000));
    label(Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + s % 60);
    if (s) return;
    clearInterval(tick); label('Timer');
    NS.fadeOut(NS.timerEnd);
  }

  function set(min) {
    clearInterval(tick); close(); label('Timer');
    if (!min) return;
    endAt = new Date().getTime() + min * 60000;
    tick = setInterval(show, 1000); show();
  }

  btn.addEventListener('click', function (e) { e.stopPropagation(); pop.hidden = !pop.hidden; });
  pop.addEventListener('click', function (e) { e.stopPropagation(); });
  d.addEventListener('click', close);
  d.addEventListener('keydown', function (e) { if (e.keyCode === 27) close(); });
  $('tchips').addEventListener('click', function (e) { var m = e.target.getAttribute('data-m'); if (m) set(+m); });
  $('tdn').addEventListener('click', function () { inp.value = Math.max(1, clamp() - 5); });
  $('tup').addEventListener('click', function () { inp.value = Math.min(720, clamp() + 5); });
  inp.addEventListener('change', clamp);
  $('tgo').addEventListener('click', function () { set(clamp()); });
  $('toff').addEventListener('click', function () { set(0); });
})(window, document);
