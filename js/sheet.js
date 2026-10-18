/* Bottom sheet (dialog on wide screens) for FAQ, credits and links. */
(function (w, d) {
  var NS = w.NS, $ = NS.$, sheet = $('faq'), back = $('back'), opener = null;

  function open() {
    opener = d.activeElement;
    sheet.hidden = back.hidden = false;
    void sheet.offsetWidth;
    sheet.className = 'sheet in'; back.className = 'back in';
    $('shx').focus();
  }

  function close() {
    sheet.className = 'sheet'; back.className = 'back';
    setTimeout(function () { sheet.hidden = back.hidden = true; }, 220);
    if (opener && opener.focus) opener.focus();
  }

  $('info').innerHTML = NS.icon('info');
  $('info').addEventListener('click', open);
  $('shx').addEventListener('click', close);
  back.addEventListener('click', close);
  d.addEventListener('keydown', function (e) { if (e.keyCode === 27 && !sheet.hidden) close(); });
  if (w.location.hash === '#faq') open();
})(window, document);
(function (d) {
  var tabs = d.getElementById('tabs'), btn = tabs.getElementsByTagName('button'), i;
  function show(n) {
    for (var k = 0; k < btn.length; k++) {
      btn[k].setAttribute('aria-selected', k === n ? 'true' : 'false');
      d.getElementById('p' + k).hidden = k !== n;
    }
  }
  tabs.addEventListener('click', function (e) { var t = e.target.getAttribute('data-t'); if (t !== null) show(+t); });
  d.addEventListener('toggle', function (e) {
    var el = e.target, all = el.parentNode.getElementsByTagName('details');
    if (!el.open) return;
    for (i = 0; i < all.length; i++) if (all[i] !== el) all[i].open = false;
  }, true);
})(document);
