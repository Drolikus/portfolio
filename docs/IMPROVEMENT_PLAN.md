# Improvement Plan — Weak Points & Next Steps

A prioritized review of the portfolio's current weak points with concrete
actions. Priorities: **P0** (correctness / ship-blockers), **P1** (high impact,
low-to-medium effort), **P2** (polish and longer-term).

## Status (updated 2026-06-11)

Implemented in this pass:

- **Done #1, #3** — removed dead contact-form code; fixed the FOUC theme flash
  with a blocking inline script on every page.
- **Done #4, #5** — images optimized (~6.6 MB → ~0.5 MB) via
  `tools/optimize_images.py`; added `loading`/`width`/`height` to images.
- **Done #6** — canonical URLs, absolute OG image, `robots.txt`, `sitemap.xml`,
  SVG favicon, apple-touch-icon, and `site.webmanifest`.
- **Done #7** — Playwright smoke check + GitHub Actions workflow.
- **Done #10 (partial), #11 (partial)** — deduplicated clipboard/toast helpers;
  trimmed an unused font weight.
- **Done #12** — Content-Security-Policy added to all three header configs
  (note: GitHub Pages does not apply custom headers, so CSP is active only on
  Netlify/Vercel/Cloudflare).

Still open: **#2** (real backend if a typed form is reintroduced), **#8**
(verify contact details), **#9** (add real case studies — content work),
**#10/#11** (split the `index.html` monolith, add a minify/font-subset build),
**#13** (theme model is now consistent — verify after deploy).

---

## P0 — Correctness

### 1. Dead contact-form code in `js/main.js`
`initContactForm()` (≈ lines 967–1025) targets `#contactForm`, `#name`,
`#email`, `#subject`, `#message`, `#submitBtn`, `#formSuccess`. **None of these
elements exist in `index.html`** — the function returns early and the whole
validation block is dead code. The live contact path is the brief builder +
Telegram QR.

- Action: either **remove** `initContactForm()` entirely, or **restore a real
  `<form>`** if a typed contact form is wanted.
- Note: `index.html:297` still claims checks cover "contact form wiring" — that
  copy is now misleading. Align the wording (or the feature) either way.

### 2. Simulated form submit (only relevant if a form is restored)
The old submit handler just ran `setTimeout` and showed a success state — it
never delivered a message. If a form comes back, wire it to a real backend
(Formspree, Netlify Forms, or Web3Forms) so submissions actually arrive.

### 3. Theme flash (FOUC) on `index.html`
`<html lang="en">` has **no `data-theme`** and the theme is only applied inside
`DOMContentLoaded`. A visitor who saved the light theme sees a dark flash on
every load. (Case pages hardcode `data-theme="dark"`, which is the opposite
problem — they ignore the saved theme.)

- Action: add a tiny **blocking inline script in `<head>`** that reads
  `localStorage.theme` and sets `data-theme` before first paint. Apply the same
  approach consistently to `index.html` and all `projects/*.html`.

---

## P1 — High impact, low/medium effort

### 4. Image weight (~7 MB of PNGs)
`assets/` ships large unoptimized PNGs:

| File | Size |
| --- | --- |
| `studio-headshot.png` | 1.75 MB |
| `case-lab-board.png` | 1.25 MB |
| `case-site-checks.png` | 1.19 MB |
| `case-portfolio-home.png` | 0.97 MB |
| `case-voltage-preview.png` | 0.77 MB |
| `telegram-qr.png` | 0.57 MB |

- Convert to **WebP/AVIF**, resize to actual display size, and compress. The
  headshot and QR especially should drop to tens of KB.
- A QR code can be a small SVG/PNG (~5–15 KB); 0.57 MB is unnecessary.
- Expected result: first-load payload down from ~7 MB toward <1 MB.

### 5. Missing `loading="lazy"`, `width`, and `height` on images
None of the homepage or case-page images set `loading="lazy"` or intrinsic
`width`/`height`. This causes layout shift (CLS) and eager loading of
below-the-fold images.

- Action: add `width`/`height` (or `aspect-ratio`) to every `<img>`, and
  `loading="lazy"` + `decoding="async"` to everything below the fold.

### 6. SEO / sharing gaps
- **No `<link rel="canonical">`.** With three documented hosts (GitHub Pages,
  Netlify, Vercel) this is a real duplicate-content risk. Pick the canonical
  host (ROADMAP already flags this) and set canonical on every page.
- **OG/Twitter image uses a relative path** (`assets/social-preview.png`).
  Social scrapers need an **absolute URL** to render previews reliably.
- **No `robots.txt` and no `sitemap.xml`.** Add both.
- **No favicon, `apple-touch-icon`, or `site.webmanifest`.** Add at least a
  favicon + apple-touch-icon; a minimal manifest enables installability.

### 7. No CI despite a "checks 7/7" badge
The README badge implies automated checks, but the Playwright checks are run
manually/locally and there is no `.github/workflows`. (ROADMAP #2 already wants
automated smoke checks.)

- Action: add a **GitHub Actions workflow** that serves the static site and runs
  the existing Playwright checks on every push/PR, plus optional HTML validation
  and link checking. Then the badge reflects reality.

### 8. Honest, minimal contact surface
The contact section is solid (Telegram + brief builder), but confirm the
**email and Telegram handle are current** and that the brief-builder copy reads
the way you want for recruiters. Low effort, high trust.

---

## P2 — Polish & longer-term

### 9. Front-load real project depth over decorative features
The site carries a lot of interactive chrome — command palette, visitor routes,
spotlight, parallax, typing effect, an in-page "site checks" widget — against a
thin base of *real* projects (Voltage is still being rebuilt; the others are the
portfolio itself and a "practice lab"). ROADMAP already says: *"Add new real
project case studies instead of expanding decorative sections."*

- Action: prioritize **one or two finished, real case studies** (problem →
  approach → result, with live links and code) over more UI gadgets. For a
  junior hire this is the single biggest signal.
- Consider whether the in-page "site checks" widget helps recruiters or reads as
  filler; it may be better as a quiet quality note.

### 10. Code structure & duplication
- `index.html` is **1456 lines / 89 KB** — a monolith that's hard to edit.
  Consider splitting shared chunks (nav, footer, head) via a tiny build step or
  templating if iteration continues.
- `showToast` and `fallbackCopy` are **duplicated** in `initCommandPalette` and
  `initContactActions`. Extract shared `clipboard`/`toast` helpers.

### 11. Asset/build pipeline
No minification for CSS (1067 lines) or JS (1218 lines), and Google Fonts loads
**6 Inter weights + 3 JetBrains Mono weights**. Trim to the weights actually
used and add a light minify step (esbuild/Lightning CSS) to cut transfer size.

### 12. Security headers (CSP)
Security headers are configured for all three hosts (good), but there's **no
Content-Security-Policy**. DEPLOYMENT.md acknowledges this. Once the external
asset list is stable (Google Fonts, any future analytics), add a CSP. The
inline `ld+json` and the proposed anti-FOUC inline script will need a nonce or
hash.

### 13. Theme consistency across pages
Decide one model: either all pages respect the saved theme (preferred) or all
lock to one theme. Today `index.html` is JS-driven (FOUC) while `projects/*` are
hardcoded dark — inconsistent.

---

## Suggested order of work

1. **P0**: remove/replace dead form code, fix the FOUC theme script (quick wins,
   correctness).
2. **P1**: compress + lazy-load images, add favicon/canonical/robots/sitemap,
   stand up CI. Biggest measurable gains (performance + SEO + credibility).
3. **P2**: add a real case study, dedupe JS helpers, add a minify/font-subset
   step, then CSP.
