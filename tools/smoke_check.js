/**
 * Headless smoke checks for the static portfolio.
 *
 * Loads the homepage in Chromium and asserts the same guardrails the in-page
 * site-checks widget reports: no console errors, no horizontal overflow, all
 * images resolve, and every in-page nav target exists. Exits non-zero on any
 * failure so it can gate CI.
 *
 * Usage:
 *   PORTFOLIO_URL=http://127.0.0.1:8123/index.html node tools/smoke_check.js
 */
const { chromium } = require('@playwright/test');

const baseUrl = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8123/index.html';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const consoleErrors = [];
  // Ignore failed loads of external resources (e.g. Google Fonts when the
  // runner has no outbound access) — those are environmental, not code bugs.
  const isNetworkNoise = (text) => /Failed to load resource|net::ERR_/i.test(text);
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !isNetworkNoise(msg.text())) consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const result = await page.evaluate(() => {
    const brokenImages = [...document.images]
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.getAttribute('src') || img.alt || 'unknown');
    const navHrefs = [...document.querySelectorAll('.nav-links a[href^="#"]')]
      .map((a) => a.getAttribute('href'))
      .filter((href, i, all) => href && all.indexOf(href) === i);
    const missingTargets = navHrefs.filter((href) => !document.querySelector(href));
    const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
    return {
      imageCount: document.images.length,
      brokenImages,
      navCount: navHrefs.length,
      missingTargets,
      overflow,
      pageWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth
    };
  });

  await browser.close();

  const checks = [
    { name: 'No console errors', pass: consoleErrors.length === 0, detail: consoleErrors.join(' | ') || 'none' },
    { name: 'No horizontal overflow', pass: !result.overflow, detail: `${result.pageWidth}px on ${result.viewport}px` },
    { name: 'Images resolve', pass: result.brokenImages.length === 0, detail: result.brokenImages.join(', ') || `${result.imageCount} checked` },
    { name: 'Nav targets exist', pass: result.missingTargets.length === 0, detail: result.missingTargets.join(', ') || `${result.navCount} links` }
  ];

  let failed = false;
  for (const c of checks) {
    console.log(`${c.pass ? 'PASS' : 'FAIL'}  ${c.name} — ${c.detail}`);
    if (!c.pass) failed = true;
  }

  if (failed) {
    console.error('\nSmoke checks failed.');
    process.exit(1);
  }
  console.log('\nAll smoke checks passed.');
})();
