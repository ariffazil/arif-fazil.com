// M2.1 LIVE PRODUCTION validation — derived from scripts/m2-browser-validation.mjs
// (candidate commit 51cb49a). Differences: BASE=production, production-correct
// expectations for /proof/ and /999/ (both are STATIC canon surfaces per M1.5/M1.8
// records; the SPA-route equivalence was witnessed on the hash-identical bundle in
// the candidate validation), plus console/pageerror capture.
// Evidence class: CANDIDATE_DEPLOYED / LIVE_ROUTE_OBSERVED.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const BASE = 'https://arif-fazil.com';
const EV = process.env.M2_EV;
const SHOTS = process.env.M2_SHOTS;
const RESULT = `${EV}/M2-LIVE-PRODUCTION-VALIDATION.json`;
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
const consoleErrors = [];
const rec = (id, pass, detail) => { results.push({ id, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'} ${id} :: ${detail}`); };

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--disable-dev-shm-usage', '--disable-gpu'], // sandbox ON (non-root pwval)
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${String(e).slice(0, 200)}`));

// 1. SPA hydration surface: /words live — FED switcher after hydration
await page.goto(`${BASE}/words`, { waitUntil: 'networkidle' });
await page.waitForSelector('details.atlas-fed', { timeout: 10000 });
const fed = page.locator('details.atlas-fed');
rec('live.words.fed-present', (await fed.count()) === 1, 'switcher rendered on live /words after hydration');
rec('live.words.aria', (await fed.locator('summary').getAttribute('aria-label')) === 'Federation domain switcher', 'aria-label exact');
await page.locator('summary[aria-label="Federation domain switcher"]').focus();
await page.keyboard.press('Enter');
await page.waitForTimeout(150);
rec('live.keyboard.enter-opens', (await fed.getAttribute('open')) !== null, 'native Enter toggle');
const links = await fed.locator('.atlas-fed-menu a').evaluateAll((els) => els.map((a) => [a.textContent.trim(), a.getAttribute('href'), a.getAttribute('target'), a.getAttribute('rel')]));
rec('live.fed.links-canonical-8', JSON.stringify(links.map((l) => [l[0], l[1]])) === JSON.stringify(EXPECTED_FED) && links.length === 8, `links=${links.length}`);
rec('live.fed.links-safety', links.every((l) => l[2] === '_blank' && (l[3] || '').includes('noopener')), 'target/rel intact');
const box = await fed.locator('.atlas-fed-menu').boundingBox();
rec('live.desktop.menu-not-clipped', box && box.x >= 0 && box.x + box.width <= 1440, `box=${JSON.stringify(box)}`);
await page.screenshot({ path: `${SHOTS}/m2-live-words-1440.png` });

// 2. static canon surfaces (production reality): /999/ and /proof/
await page.goto(`${BASE}/999/`, { waitUntil: 'networkidle' });
const p999 = await page.content();
rec('live.999.canon-header', /obs-canon-header|atlas-header/.test(p999), 'canon header present (static proof chamber)');
rec('live.999.no-legacy-footer', (await page.locator('footer.border-t.hairline').count()) === 0, 'no legacy chrome');
await page.screenshot({ path: `${SHOTS}/m2-live-999-1440.png` });

const respProof = await page.goto(`${BASE}/proof/`, { waitUntil: 'networkidle' });
rec('live.proof.resolves', respProof.status() === 200 && page.url().includes('/work/proof'), `308→${page.url()} status=${respProof.status()}`);
const pProof = await page.content();
rec('live.proof.canon-header', /obs-canon-header|atlas-header/.test(pProof), 'canon header present (static /work/proof)');
await page.screenshot({ path: `${SHOTS}/m2-live-proof-1440.png` });

// 3. SPA-route /999 inside the app (the M2.1 fix surface): client-side nav
await page.goto(`${BASE}/words`, { waitUntil: 'networkidle' });
const spaNav = await page.evaluate(async () => {
  history.pushState({}, '', '/999');
  window.dispatchEvent(new PopStateEvent('popstate'));
  await new Promise((r) => setTimeout(r, 600));
  return { path: location.pathname, headers: document.querySelectorAll('header.atlas-header').length, fed: document.querySelectorAll('details.atlas-fed').length, legacy: document.querySelectorAll('footer.border-t.hairline').length };
});
rec('live.spa-999.shell-only', spaNav.path === '/999' && spaNav.headers >= 1 && spaNav.fed >= 1 && spaNav.legacy === 0, `pushState /999 → headers=${spaNav.headers} fed=${spaNav.fed} legacy=${spaNav.legacy}`);

// 4. mobile 390
await page.setViewportSize({ width: 390, height: 840 });
await page.goto(`${BASE}/words`, { waitUntil: 'networkidle' });
await page.locator('summary[aria-label="Federation domain switcher"]').click();
await page.waitForTimeout(120);
const boxM = await page.locator('.atlas-fed-menu').boundingBox();
rec('live.mobile.390-in-viewport', boxM && boxM.x >= 0 && boxM.x + boxM.width <= 390, `box=${JSON.stringify(boxM)}`);
await page.screenshot({ path: `${SHOTS}/m2-live-words-mobile-390.png` });

// 5. console cleanliness on visited routes
rec('live.console.no-errors', consoleErrors.length === 0, `console/pageerror count=${consoleErrors.length}${consoleErrors.length ? ' :: ' + consoleErrors.slice(0, 3).join(' | ') : ''}`);

await browser.close();
const passed = results.filter((r) => r.pass).length;
const out = {
  schema: 'aaa.agentic_web.m2_live_production_validation.v1',
  evidence_class: 'CANDIDATE_DEPLOYED / LIVE_ROUTE_OBSERVED',
  as_of: new Date().toISOString(),
  target: BASE,
  browser: 'Google Chrome 155 headless, sandbox ON, non-root pwval, no --no-sandbox',
  passed, total: results.length,
  verdict: passed === results.length ? 'LIVE_VALIDATION_PASS' : 'LIVE_VALIDATION_FAIL',
  console_errors: consoleErrors,
  native_limitations: ['Escape/outside-click do not close native <details> — Batch B polish'],
  results,
};
writeFileSync(RESULT, JSON.stringify(out, null, 2));
console.log(`\nVERDICT: ${out.verdict} — ${passed}/${results.length}`);
