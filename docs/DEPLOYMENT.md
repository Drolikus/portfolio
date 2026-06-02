# Deployment Notes

## Static Site

The main portfolio is a static site:

- Entry: `index.html`
- Styles: `css/styles.css`
- Scripts: `js/main.js`
- Assets: `assets/`

## Recommended Hosts

- GitHub Pages: current live host at `https://drolikus.github.io/portfolio/`.
- Netlify: simplest static deploy and form handling path.
- Vercel: strong preview workflow, headers, and performance tooling.
- Cloudflare Pages: CDN-first production option with security headers and caching.

## Required Before Production

- Pick canonical domain.
- Add security headers.
- Add caching policy for images and static CSS/JS.
- Add redirect from secondary host to canonical host.
- Verify mobile and desktop after deploy.
- Confirm `404.html`, `quality.html`, and all `projects/*.html` routes resolve.

## Suggested Headers

```text
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Use a Content Security Policy only after checking external assets and any future analytics scripts.

## Added Config Files

- `netlify.toml` for Netlify static publishing and headers.
- `vercel.json` for Vercel headers and cache rules.
- `_headers` for Cloudflare Pages compatible headers.
