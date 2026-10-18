<p align="center">
  <img src="logo.svg" width="120" alt="NoiseSpace logo">
</p>

<h1 align="center">NoiseSpace</h1>

<p align="center">
  <b>Free focus, study &amp; relaxation sounds in your browser.</b><br>
  Mix rain, ocean, fire, wind and white / pink / brown noise. No ads, no tracking, works offline.
</p>

<p align="center">
  <a href="https://mkalmousli.github.io/NoiseSpace/"><b>▶ Open the app</b></a>
</p>

<p align="center">
  <img src="img/screenshot-desktop.png" width="640" alt="NoiseSpace on desktop, light mode">
  <img src="img/screenshot-mobile.png" width="200" alt="NoiseSpace on mobile, dark mode">
</p>

## Features

- **10 synthesized sounds**: rain, ocean, wind, stream, fireplace, white / pink / brown noise,
  a 10 Hz binaural focus tone and a deep-space drone. Generated live with the Web Audio API,
  so there are no audio files to download.
- **Layer and mix** any sounds with per-sound volume and a master fader.
- **Presets**: Deep focus, Study, Relax, Sleep, Cozy, Forest.
- **Sleep timer** with a gentle fade-out.
- **Light and dark** themes (follows your system, remembers your choice).
- **Frutiger Aero** glass UI, calm colors, responsive from phones to desktops.
- **Installable and offline** (PWA + service worker), settings saved locally.

## Under the hood

Pure HTML, CSS and ES5 JavaScript. No build step, no dependencies, and every file stays
under 100 lines.

| File | Role |
| --- | --- |
| `index.html` | Markup, SEO metadata, JSON-LD |
| `css/base.css` · `layout.css` · `aero.css` | Tokens and backdrop · structure · glass components |
| `js/noise.js` · `helpers.js` · `engine.js` | Noise buffers · builder helpers · audio engine |
| `js/sounds.js` | Sound and preset catalog |
| `js/store.js` · `icons.js` · `ui.js` · `app.js` | Settings · icons · rendering · wiring |
| `sw.js` · `manifest.json` | Offline cache and PWA manifest |

## Run locally

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy

Pushing to `main` publishes the site to GitHub Pages through `.github/workflows/pages.yml`.

## License

MIT
