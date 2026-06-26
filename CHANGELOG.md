# Changelog

## 2026-06-16

- Added case-study pages for ERP, Viber, and Lottery in the new style; retired the stale portfolio and practice-lab case pages.
- Rewrote `quality.html` and `docs/QUALITY.md` to reflect the real checks (CI smoke + build-sync + accessibility) instead of the removed in-page widget.
- Cleaned up unused image assets and obsolete screenshot tooling; regenerated the Open Graph preview for the new design; updated the sitemap and README.
- Redesigned the site in an editorial "ryazhenka" (baked-milk) palette with a paired warm-dark theme and a theme toggle (light default).
- New homepage: type-led hero, an animated project carousel (Voltage / ERP / Viber / Lottery) with per-project scene tints, keyboard + swipe control, a condensed about/skills strip, and a focused contact block.
- Restyled the case pages to match the new system; fixed cross-page anchors after section removal.
- Switched fonts to Fraunces (display) + Inter + IBM Plex Mono; dropped the old glow/glass/noise/spotlight/parallax/typing chrome.
- Rebuilt `js/main.js` around the new interactions (theme, carousel, reveal, copy, Berlin clock) and updated the CSP hash for the new inline theme script.

## 2026-06-11

- Removed dead contact-form validation code and fixed the misleading "contact form wiring" check label.
- Added a blocking inline theme script to remove the light-theme flash (FOUC) on all pages.
- Optimized images (`tools/optimize_images.py`): assets dropped from ~6.6 MB to ~0.5 MB; added `loading`, `width`, and `height` to `<img>` tags.
- Added SEO/sharing essentials: canonical URLs, absolute Open Graph image, `robots.txt`, `sitemap.xml`, SVG favicon, apple-touch-icon, and a web manifest.
- Added a headless Playwright smoke check (`tools/smoke_check.js`) and a GitHub Actions workflow that runs it on push and pull requests.
- Added a Content-Security-Policy to the Netlify, Vercel, and Cloudflare header configs.
- Trimmed an unused font weight, deduplicated clipboard/toast helpers in `js/main.js`.
- Split the `index.html` monolith into `src/index.template.html` + `src/partials/` section files, assembled by `tools/build_html.py`; CI verifies the generated `index.html` stays in sync.

## 2026-06-03

- Removed overbuilt portfolio signals and unused experimental planning docs.
- Renamed public wording to calmer project cases and site checks language.
- Cleaned case pages, footer labels, roadmap, and public docs so the repository reads like a straightforward static portfolio.

## 2026-05-31

- Added dedicated case-study pages for Voltage, Portfolio Website, and Frontend Practice Lab.
- Added public `quality.html`, custom `404.html`, case screenshots, source links, and GitHub Pages status links.
- Added repository documentation: README, changelog, roadmap, deployment notes, and quality notes.
- Verified portfolio page locally: no console errors, no horizontal overflow, all images loaded, 7/7 checks.

## Earlier Iteration

- Added quick navigation with project, skills, checks, and contact actions.
- Added visitor route selector for recruiter, client, and mentor paths.
- Added site checks section.
- Added contact message builder and Telegram/Email contact route.
- Added German language context to the Voltage preview.
- Replaced generic project preview with a real portfolio screenshot.
