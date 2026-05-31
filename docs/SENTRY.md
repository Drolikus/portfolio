# Sentry Monitoring

The portfolio now has a guarded monitoring bootstrap in `js/monitoring.js`.

## Current Behavior

- Captures `window.error` and `unhandledrejection` into an in-browser buffer.
- Exposes `window.portfolioMonitoring.getBufferedEvents()` for quick local inspection.
- Does not send anything to Sentry unless a DSN and Sentry browser SDK are explicitly configured.

## Why It Is Guarded

The site is static. A Sentry auth token must never be shipped to the browser. The browser DSN is acceptable to expose, but project setup should still happen in Sentry first.

## To Enable Sentry Later

Add the Sentry browser SDK before `js/monitoring.js`, then define:

```html
<script>
  window.PORTFOLIO_MONITORING = {
    sentryDsn: "https://PUBLIC_DSN_HERE",
    environment: "production",
    release: "portfolio-static@1.0.0"
  };
</script>
```

Then verify:

```js
window.portfolioMonitoring.isSentryActive()
```

## Local Smoke Check

```js
window.portfolioMonitoring.captureMessage("monitoring smoke test", "manual")
window.portfolioMonitoring.getBufferedEvents()
```
