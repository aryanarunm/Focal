# Focal — Link to QR Code Generator

A small web app that turns any link into a scannable QR code, entirely in the browser. No backend, no build step, no dependencies to install.

**[Live demo →](#)** *(add your GitHub Pages link here after deploying)*

## Why I built this

I wanted a focused project that's simple enough to explain end-to-end in an interview, but still shows real front-end fundamentals: DOM manipulation, form validation, the Canvas API, and clean, intentional UI design — no framework needed.

## Design

A quiet, paper-white interface with a single cobalt accent — headline set in Fraunces, everything else in Inter. The generated code sits inside thin registration marks borrowed from print production, which turn from muted to cobalt once a code resolves.

## Features

- Paste any link and instantly generate a QR code
- Auto-adds `https://` if you forget it, and validates the input before encoding
- Download the generated code as a PNG
- One-click copy of the normalized link
- Fully responsive, keyboard-accessible, and respects reduced-motion preferences
- Zero data leaves the browser — nothing is sent to a server or stored anywhere

## How it works

1. The user submits a link through a plain HTML form.
2. `script.js` validates it with the built-in `URL` constructor.
3. The [qrcode.js](https://github.com/davidshimjs/qrcodejs) library encodes the string into a QR code and draws it onto a `<canvas>`.
4. The canvas can be exported to a PNG via `canvas.toDataURL()` for the download button.

## Tech stack

- **HTML / CSS / vanilla JavaScript** — no framework, no build tools
- **[qrcode.js](https://github.com/davidshimjs/qrcodejs)** — the only external dependency, loaded via CDN, used purely for QR encoding
- **Google Fonts** (Space Grotesk, Inter, JetBrains Mono) for typography

## Running it locally

No installation required — it's static files.

```bash
git clone https://github.com/<your-username>/focal.git
cd focal
# open index.html directly in a browser, or serve it locally:
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Push this project to a GitHub repository.
2. Go to **Settings → Pages** in your repo.
3. Under "Build and deployment", set **Source** to `Deploy from a branch`.
4. Choose the `main` branch and `/ (root)` folder, then save.
5. GitHub will publish it at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## Project structure

```
qr-code-generator/
├── index.html    # markup and structure
├── style.css     # design system + styling
├── script.js     # QR generation, download, and copy logic
└── README.md
```

## Possible next steps

- Let users pick QR color / error-correction level
- Support encoding Wi-Fi credentials or contact cards, not just links
- Add an SVG export option alongside PNG

## License

MIT — free to use, modify, and learn from.
