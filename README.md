# Vladyslav Kikhtenko Portfolio

[![Live site](https://img.shields.io/badge/GitHub%20Pages-live-22c55e?style=flat-square)](https://drolikus.github.io/portfolio/)
[![Site checks](https://img.shields.io/badge/checks-7%20%2F%207-0891b2?style=flat-square)](https://drolikus.github.io/portfolio/quality.html)

Frontend portfolio for Vladyslav Kikhtenko, a junior web developer in Germany building responsive interfaces, e-commerce UI, and practical frontend projects.

## What This Site Includes

- Project cards with clear current status.
- Dedicated case-study pages for Voltage, the portfolio site, and the UI practice lab.
- Quick navigation, visitor routes, site checks, and contact message helpers.
- Static HTML, CSS, and vanilla JavaScript with responsive behavior and browser-tested interactions.

## Live Links

- Live site: https://drolikus.github.io/portfolio/
- Site checks: https://drolikus.github.io/portfolio/quality.html
- Case studies: [Voltage](https://drolikus.github.io/portfolio/projects/voltage.html), [Portfolio](https://drolikus.github.io/portfolio/projects/portfolio.html), [Practice Lab](https://drolikus.github.io/portfolio/projects/lab.html)

## Project Structure

```text
.
|-- index.html              # generated — do not edit by hand
|-- src/
|   |-- index.template.html # homepage shell with include markers
|   `-- partials/           # one section per file (head, nav, hero, ...)
|-- css/styles.css
|-- js/main.js
|-- assets/
|-- docs/
|-- projects/
`-- tools/
```

## Editing the Homepage

`index.html` is assembled from `src/index.template.html` and the section
partials in `src/partials/`. Edit the partials, then rebuild:

```bash
npm run build        # regenerate index.html
npm run check:build  # verify index.html matches its source (also runs in CI)
```

CI fails if `index.html` drifts from its partials, so commit the rebuilt file.

## Local Preview

The portfolio is a static site. Open it through a local static server:

```bash
http://127.0.0.1:8123/index.html
```

## Site Checks

- Browser checks cover console errors, image loading, horizontal overflow, section targets, case links, quick links, and message builder wiring.
- The homepage includes a small site checks section with a 7/7 local pass.
- Case-study screenshots are captured with Playwright.

```bash
npm install
npm run capture:screenshots   # capture + optimize case screenshots
npm run optimize:images       # recompress/resize assets in place
npm run check:smoke           # headless smoke checks (serve the site first)
```

Smoke checks also run automatically on push and pull requests via
`.github/workflows/checks.yml`.

## Optional Tooling

Generated social previews and document briefs are built from scripts in `tools/`:

```bash
python -m pip install -r requirements.txt
python tools/build_social_preview.py
python tools/build_portfolio_brief.py
```

## Current Status

This is an actively improving portfolio, not a frozen showcase. See [CHANGELOG.md](CHANGELOG.md), [ROADMAP.md](ROADMAP.md), and [docs/QUALITY.md](docs/QUALITY.md).
