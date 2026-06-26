const { chromium } = require('@playwright/test');

const baseUrl = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8123/index.html';

async function preparePage(page, width, height) {
  await page.setViewportSize({ width, height });
  await page.addInitScript(() => {
    sessionStorage.setItem('portfolioIntroSeen', 'true');
    localStorage.setItem('theme', 'light');
  });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
}

async function captureSection(page, selector, path, offset = 88) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.evaluate((amount) => window.scrollBy(0, -amount), offset);
  await page.waitForTimeout(450);
  await page.screenshot({ path, fullPage: false });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await preparePage(page, 1440, 900);
  await captureSection(page, '#home', 'assets/case-portfolio-home.png', 0);
  await captureSection(page, '#work', 'assets/case-voltage-preview.png');

  await preparePage(page, 390, 844);
  await captureSection(page, '#home', 'assets/case-portfolio-mobile.png', 0);

  await browser.close();
})();
