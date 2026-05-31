# Vladyslav Kikhtenko Portfolio

[![Live site](https://img.shields.io/badge/GitHub%20Pages-live-22c55e?style=flat-square)](https://drolikus.github.io/portfolio/)
[![Quality gate](https://img.shields.io/badge/quality-7%20%2F%207-0891b2?style=flat-square)](https://drolikus.github.io/portfolio/quality.html)

Proof-first frontend portfolio for Vladyslav Kikhtenko, a junior web developer in Germany building responsive interfaces, e-commerce flows, and practical frontend projects.

## What This Site Proves

- Real project storytelling instead of empty portfolio cards.
- Dedicated case-study pages for Voltage, the portfolio system, and the UI practice lab.
- Command palette, proof mode, visitor routes, quality gate, and contact message builder.
- Static HTML, CSS, and vanilla JavaScript with responsive behavior and browser-tested interactions.

## Live Links

- Live site: https://drolikus.github.io/portfolio/
- Public quality gate: https://drolikus.github.io/portfolio/quality.html
- Case studies: [Voltage](https://drolikus.github.io/portfolio/projects/voltage.html), [Portfolio](https://drolikus.github.io/portfolio/projects/portfolio.html), [Practice Lab](https://drolikus.github.io/portfolio/projects/lab.html)

## Project Structure

```text
.
|-- index.html
|-- css/styles.css
|-- js/main.js
|-- assets/
|-- docs/
|-- projects/
|-- tools/
`-- portfolio-walkthrough/
```

## Local Preview

The portfolio is a static site. Open it through a local static server:

```bash
http://127.0.0.1:8123/index.html
```

The motion reel runs separately:

```bash
cd portfolio-walkthrough
npm run dev
```

## Quality Signals

- Browser QA checks console errors, image loading, overflow, section targets, proof targets, command items, and live audit state.
- The page includes its own Quality Gate section with a 7/7 live audit.
- The motion reel passes `npm run check` with zero lint errors and zero lint warnings.
- Guarded monitoring bootstrap exists in `js/monitoring.js`; Sentry can be enabled after project DSN setup.

## Optional Tooling

Generated social previews and document briefs are built from scripts in `tools/`:

```bash
python -m pip install -r requirements.txt
python tools/build_social_preview.py
python tools/build_portfolio_brief.py
```

Case-study screenshots are captured with Playwright:

```bash
npm install
npm run capture:screenshots
```

## Current Status

This is an actively improving portfolio, not a frozen showcase. See [CHANGELOG.md](CHANGELOG.md), [ROADMAP.md](ROADMAP.md), and [docs/QUALITY.md](docs/QUALITY.md).
