# Check Notes

## Automated checks (CI)

`.github/workflows/checks.yml` runs on every push and pull request:

- **Build-sync** (`npm run check:build`) — fails if the committed `index.html`
  does not match the partials in `src/`.
- **Smoke** (`npm run check:smoke`) — a headless Playwright run on the homepage
  asserting: no console errors, no horizontal overflow, all images resolve, and
  every in-page nav target exists.

## Accessibility

- Text colours meet WCAG AA contrast in both the light and dark themes.
- Focus is always visible (`:focus-visible` outlines on interactive elements).
- Motion respects `prefers-reduced-motion` (reveal, carousel parallax, smooth
  scroll, and CSS transitions all stand down).
- The project carousel is operable by pointer, keyboard (←/→), and swipe.

## Public surface

- Public checks page: `quality.html`.
- Custom GitHub Pages fallback: `404.html`.
- Case-study pages live in `projects/` (Voltage, ERP, Viber, Lottery).

## Guardrails

- Keep claims tied to visible, real work — planned projects are labelled as
  planned, and abstract placeholders are used until real screenshots exist.
- Avoid decorative features that do not improve reading, navigation, or contact.
- Test both themes, desktop, and mobile after layout changes.
- Keep production credentials out of static files.
