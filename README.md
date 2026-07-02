# Vladyslav Kikhtenko Portfolio

[![Live site](https://img.shields.io/badge/GitHub%20Pages-live-22c55e?style=flat-square)](https://drolikus.github.io/portfolio/)
[![Checks](https://img.shields.io/badge/CI-smoke%20%2B%20build--sync-bd6a45?style=flat-square)](https://drolikus.github.io/portfolio/quality.html)

Frontend portfolio for Vladyslav Kikhtenko, a junior frontend developer in Germany building responsive interfaces, e-commerce UI, and practical web projects. Editorial "ryazhenka" design with a light and a warm-dark theme.

## What This Site Includes

- An animated project carousel (Portfolio, Otkrytki, Voltage, ERP, Viber, Lottery) with honest, current statuses and a real desktop screenshot for the live site.
- Dedicated case-study pages per project.
- A light + warm-dark theme toggle, a contact block, and a public checks page.
- Static HTML, CSS, and vanilla JavaScript with responsive behavior and CI-tested interactions.

## Live Links

- Live site: https://drolikus.github.io/portfolio/
- Checks: https://drolikus.github.io/portfolio/quality.html
- Case studies: [Otkrytki](https://drolikus.github.io/portfolio/projects/otkrytki.html), [Voltage](https://drolikus.github.io/portfolio/projects/voltage.html), [ERP](https://drolikus.github.io/portfolio/projects/erp.html), [Viber](https://drolikus.github.io/portfolio/projects/viber.html), [Lottery](https://drolikus.github.io/portfolio/projects/lottery.html)

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

## Checks

A headless Playwright smoke check asserts no console errors, no horizontal
overflow, that images resolve, and that in-page nav targets exist. A build-sync
check verifies the generated `index.html` matches its partials.

```bash
npm install
npm run check:build           # verify index.html matches its source
npm run optimize:images       # recompress/resize assets in place
npm run check:smoke           # headless smoke checks (serve the site first)
```

Both checks run automatically on push and pull requests via
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
