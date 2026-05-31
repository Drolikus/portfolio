# Roadmap

## Near Term

- Keep the social preview asset aligned with the live hero after major content changes.
- Document design tokens and component rules as the site grows.
- Decide whether GitHub Pages remains production or whether Netlify/Vercel becomes the primary deploy target.
- Enable Sentry delivery once a project DSN exists.
- Implement AI Portfolio Navigator only after a server-side API route exists.

## Portfolio UX

- Make active navigation deterministic at initial `#home` load.
- Add a compact "watch build tour" entry point for the HyperFrames reel.
- Add final Voltage product screenshots after the rebuild pass.
- Keep homepage project details compact and move deep proof into case pages.

## Engineering Proof

- Add deployment checks and production headers.
- Add lightweight smoke tests for the static page.
- Keep GitHub issues aligned with the public roadmap.

## GitHub Tracker

- [#1](https://github.com/Drolikus/portfolio/issues/1) Final Voltage screenshots after rebuild.
- [#2](https://github.com/Drolikus/portfolio/issues/2) Automated static smoke checks.
- [#3](https://github.com/Drolikus/portfolio/issues/3) Sentry monitoring after DSN setup.
- [#4](https://github.com/Drolikus/portfolio/issues/4) Optional AI portfolio navigator.
- [#5](https://github.com/Drolikus/portfolio/issues/5) Canonical production host and headers.

## Future Product Direction

- Move reusable UI patterns into a React version when the static proof surface stabilizes.
- Explore an AI portfolio navigator only through a backend or edge function, never with a browser-exposed API key.
