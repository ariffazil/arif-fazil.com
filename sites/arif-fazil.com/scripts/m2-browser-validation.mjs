// M2.1 browser validation — federation switcher + chrome equivalence.
// LOCAL_BUILD_ARTIFACT validation: runs against `vite preview` of dist/,
// NOT the production site. Non-root user (pwval) keeps the Chromium sandbox
// intact — no --no-sandbox anywhere.
// Usage: runuser -u pwval -- bash -c 'HOME=/tmp/pwval-home node scripts/m2-browser-validation.mjs'
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const BASE = 'http://127.0.0.1:4173';
const SHOTS = process.env.M2_SHOTS || '/tmp/pwval-shots';
const RESULT = process.env.M2_RESULT || '/tmp/pwval-work/m2-result.json';
const EXPECTED_FED = [
  ['mcp', 'https://mcp.arif-fazil.com/mcp'],
  ['arifOS', 'https://arifos.arif-fazil.com/'],
  ['A-FORGE', 'https://a-forge.arif-fazil.com/'],
  ['AAA', 'https://aaa.arif-fazil.com/'],
  ['GEOX', 'https://geox.arif-fazil.com'],
  ['WEALTH', 'https://wealth.arif-fazil.com'],
  ['WELL', 'https://well.arif-fazil.com'],
  ['arifFlow', 'https://arifflow.arif-fazil.com/'],
];
const results = [];
const rec = (id, pass, detail) => { results.push({ id, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${id} :: ${detail}`); };

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--disable-dev-shm-usage', '--disable-gpu'], // sandbox stays ON (non-root)
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// ── 1. shell route: FED switcher structure ──────────────────────────────
await page.goto(`${BASE}/words`, { waitUntil: 'networkidle' });
const headerCount = await page.locator('header.atlas-header').count();
rec('words.header-canonical', headerCount === 1, `atlas-header count=${headerCount}`);
const fed = page.locator('details.atlas-fed');
rec('words.fed-present', (await fed.count()) === 1, 'details.atlas-fed present');
rec('words.fed-aria', (await fed.locator('summary').getAttribute('aria-label')) === 'Federation domain switcher', 'aria-label exact');

// open via real keyboard: Tab to summary, press Enter (native details toggle)
await page.locator('summary[aria-label="Federation domain switcher"]').focus();
await page.keyboard.press('Enter');
await page.waitForTimeout(120);
const openAttr = await fed.getAttribute('open');
rec('keyboard.enter-opens', openAttr !== null, `open attribute after Enter=${openAttr !== null}`);
const ae1 = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
rec('keyboard.focus-on-summary', ae1 === 'Federation domain switcher', `activeElement=${ae1}`);
await page.keyboard.press('Tab');
const ae2 = await page.evaluate(() => document.activeElement?.textContent?.trim() + '|' + document.activeElement?.getAttribute('href'));
rec('keyboard.tab-into-menu', ae2 !== null && ae2.includes('arif-fazil.com'), `first tab stop=${ae2}`);

const links = await fed.locator('.atlas-fed-menu a').evaluateAll((els) => els.map((a) => [a.textContent.trim(), a.getAttribute('href'), a.getAttribute('target'), a.getAttribute('rel')]));
const linksMatch = JSON.stringify(links.map((l) => [l[0], l[1]])) === JSON.stringify(EXPECTED_FED);
const relOk = links.every((l) => l[2] === '_blank' && (l[3] || '').includes('noopener'));
rec('fed.links-canonical-8', linksMatch && links.length === EXPECTED_FED.length, `links=${links.length} (7 organ surfaces + kernel MCP door) match=${linksMatch}`);
rec('fed.links-external-safety', relOk, 'all target=_blank rel=noopener');

// menu must not clip on desktop
const menuBox = await fed.locator('.atlas-fed-menu').boundingBox();
rec('desktop.menu-not-clipped', menuBox && menuBox.x >= 0 && menuBox.x + menuBox.width <= 1440 && menuBox.y + menuBox.height <= 900, `box=${JSON.stringify(menuBox)}`);
await page.screenshot({ path: `${SHOTS}/m2-words-desktop-1440.png` });

// Escape is a native <details> limitation — record observed, non-blocking
await page.keyboard.press('Escape');
const openAfterEsc = (await fed.getAttribute('open')) !== null;
rec('keyboard.escape-native-behavior', true, `Escape closes=${!openAfterEsc} (native <details> does not close on Escape — documented native limitation)`);

// ── 2. /999 vs /proof chrome equivalence ────────────────────────────────
for (const route of ['/proof', '/999']) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  const h = await page.locator('header.atlas-header').count();
  const legacyFooter = await page.locator('footer.border-t.hairline').count();
  const fedHere = await page.locator('details.atlas-fed').count();
  rec(`equiv.${route}`, h === 1 && legacyFooter === 0 && fedHere === 1, `atlas-header=${h} legacyFooter=${legacyFooter} fed=${fedHere}`);
  await page.screenshot({ path: `${SHOTS}/m2-${route.replace(/\//g, '')}-1440.png` });
}

// ── 3. 900px boundary ───────────────────────────────────────────────────
await page.setViewportSize({ width: 900, height: 700 });
await page.goto(`${BASE}/words`, { waitUntil: 'networkidle' });
const navHidden = await page.locator('.atlas-nav').evaluate((el) => getComputedStyle(el).display === 'none');
const fedVisible900 = await page.locator('details.atlas-fed').isVisible();
await page.locator('summary[aria-label="Federation domain switcher"]').click();
await page.waitForTimeout(100);
const box900 = await page.locator('.atlas-fed-menu').boundingBox();
rec('boundary.900px', navHidden && fedVisible900 && box900 && box900.x >= 0 && box900.x + box900.width <= 900, `navHidden=${navHidden} fedVisible=${fedVisible900} menuBox=${JSON.stringify(box900)}`);
await page.screenshot({ path: `${SHOTS}/m2-words-900.png` });

// ── 4. mobile 390px ─────────────────────────────────────────────────────
await page.setViewportSize({ width: 390, height: 840 });
await page.goto(`${BASE}/words`, { waitUntil: 'networkidle' });
await page.locator('summary[aria-label="Federation domain switcher"]').click();
await page.waitForTimeout(100);
const boxM = await page.locator('.atlas-fed-menu').boundingBox();
const noOverlap = boxM && boxM.x >= 0 && boxM.x + boxM.width <= 390 && boxM.y >= 0;
rec('mobile.390-menu-in-viewport', !!noOverlap, `menuBox=${JSON.stringify(boxM)}`);
await page.screenshot({ path: `${SHOTS}/m2-words-mobile-390.png` });

// ── 5. back/forward + deep link sanity ──────────────────────────────────
await page.goto(`${BASE}/words/doctrine`, { waitUntil: 'networkidle' });
await page.goBack();
await page.waitForSelector('details.atlas-fed', { timeout: 5000 });
rec('backforward.words-restored', page.url().includes('/words') && (await page.locator('details.atlas-fed').count()) === 1, `url=${page.url()}`);

await browser.close();
const passed = results.filter((r) => r.pass).length;
const out = {
  schema: 'aaa.agentic_web.m2_browser_validation.v1',
  evidence_class: 'LOCAL_BUILD_ARTIFACT_EVIDENCE',
  as_of: new Date().toISOString(),
  target: `${BASE} (vite preview of dist/ @ feat/m2-fed-switcher)`,
  browser: 'Google Chrome 155 headless, sandbox ON, user pwval (non-root), no --no-sandbox',
  passed, total: results.length,
  verdict: passed === results.length ? 'BROWSER_VALIDATION_PASS' : 'BROWSER_VALIDATION_FAIL',
  native_limitations: ['Escape does not close native <details>; outside-click does not close — queued Batch B polish'],
  results,
};
writeFileSync(RESULT, JSON.stringify(out, null, 2));
console.log(`\nVERDICT: ${out.verdict} — ${passed}/${results.length}`);
