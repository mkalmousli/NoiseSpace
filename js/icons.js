/* Tiny 24x24 stroke icons, one path each. */
(function (w) {
  var NS = w.NS = w.NS || {};
  NS.icons = {
    white: 'M3 12h2M7 8v8M11 5v14M15 8v8M19 10v4',
    pink: 'M3 14c3-8 5 8 9 0s6 6 9-2',
    brown: 'M2 17c5 0 5-10 10-10s5 10 10 10',
    rain: 'M7 14a4 4 0 1 1 1-7.9A5 5 0 0 1 18 8a3 3 0 0 1 0 6H7zM8 17l-1 3M12 17l-1 3M16 17l-1 3',
    ocean: 'M2 10c3-3 5 3 10 0s7 3 10 0M2 15c3-3 5 3 10 0s7 3 10 0',
    wind: 'M3 8h10a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 18h6',
    stream: 'M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z',
    fire: 'M12 3c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z',
    focus: 'M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H4zM17 15h3v5h-3z',
    space: 'M12 3a9 9 0 1 0 9 9 7 7 0 0 1-9-9z',
    talk: 'M4 5h16v11H11l-5 4v-4H4zM8 9.5h8M8 12.5h5',
    crickets: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6',
    play: 'M8 5l11 7-11 7z',
    stop: 'M7 6h3v12H7zM14 6h3v12h-3z',
    sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5',
    moon: 'M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z',
    storm: 'M17 14a4 4 0 0 0-1-7.9A6 6 0 0 0 4.5 9 3.5 3.5 0 0 0 6 15.5M12 11l-3 5h4l-2 5',
    birds: 'M3 14c3 1 7-1 9-5 1 3 4 4 7 4-1 4-5 7-9 6-3 0-5-2-7-5zM17 9h.01',
    boat: 'M3 15h18l-3.5 5h-11zM12 4v11M12 5l6 8h-6',
    train: 'M7 3h10a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2zM5 11h14M8 21l2-3M16 21l-2-3M9 14.5h.01M15 14.5h.01',
    city: 'M4 21V9h6v12M10 21V4h6v17M16 21v-8h4v8M3 21h18M12.5 8h1M12.5 12h1',
    info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8h.01'
  };
  NS.icon = function (id) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + NS.icons[id] + '"/></svg>';
  };
})(window);
