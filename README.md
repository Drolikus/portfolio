# Vladyslav Kikhtenko Portfolio

Proof-first frontend portfolio for Vladyslav Kikhtenko, a junior web developer in Germany building responsive interfaces, e-commerce flows, and practical frontend projects.

## What This Site Proves

- Real project storytelling instead of empty portfolio cards.
- Featured case-study structure for Voltage plus room for future frontend projects.
- Command palette, proof mode, visitor routes, quality gate, and contact message builder.
- Static HTML, CSS, and vanilla JavaScript with responsive behavior and browser-tested interactions.

## Project Structure

```text
.
|-- index.html
|-- css/styles.css
|-- js/main.js
|-- assets/
|-- docs/
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

## Current Status

This is an actively improving portfolio, not a frozen showcase. See [CHANGELOG.md](CHANGELOG.md), [ROADMAP.md](ROADMAP.md), and [docs/QUALITY.md](docs/QUALITY.md).
