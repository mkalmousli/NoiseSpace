/* Web Audio engine: shared noise buffers, per-sound gain, master gain, fades. */
(function (w) {
  var NS = w.NS = w.NS || {}, AC = w.AudioContext || w.webkitAudioContext;
  var ctx, master, live = {}, H = NS.H;
  NS.supported = !!AC;

  function ramp(p, v, t) {
    try { p.setTargetAtTime(v, ctx.currentTime, t || 0.12); } catch (e) { p.value = v; }
  }

  function init() {
    if (!ctx) {
      ctx = H.c = new AC();
      master = ctx.createGain();
      master.gain.value = NS.state.master;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
  }

  NS.isOn = function (id) { return !!live[id]; };
  NS.count = function () { return NS.stopAll.ids().length; };

  NS.toggle = function (id, on) {
    if (!NS.supported) return;
    init();
    var h = live[id];
    if (on && !h) {
      var g = H.gain(0);
      g.connect(master);
      H.cur = [];
      live[id] = { g: g, stop: NS.byId[id].build(H, g) };
      live[id].srcs = H.cur;
      ramp(g.gain, NS.volume(id), 0.3);
    } else if (!on && h) {
      delete live[id];
      if (h.stop) h.stop();
      ramp(h.g.gain, 0, 0.1);
      setTimeout(function () {
        for (var i = 0; i < h.srcs.length; i++) { try { h.srcs[i].stop(0); } catch (e) {} }
        h.g.disconnect();
      }, 700);
    }
  };

  NS.stopAll = function () {
    var ids = NS.stopAll.ids(), k;
    for (k = 0; k < ids.length; k++) NS.toggle(ids[k], false);
    return ids;
  };
  NS.stopAll.ids = function () {
    var k, ids = [];
    for (k in live) if (live.hasOwnProperty(k)) ids.push(k);
    return ids;
  };

  NS.setVol = function (id, v) {
    NS.state.vol[id] = v;
    if (live[id]) ramp(live[id].g.gain, v);
  };

  NS.setMaster = function (v) {
    NS.state.master = v;
    if (master) ramp(master.gain, v);
  };

  NS.fadeOut = function (done) {
    if (!master) return done && done();
    ramp(master.gain, 0, 2);
    setTimeout(function () {
      NS.stopAll();
      ramp(master.gain, NS.state.master, 0.05);
      if (done) done();
    }, 7000);
  };
})(window);
