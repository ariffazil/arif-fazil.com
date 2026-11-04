// tests/spa-inject-policy.test.cjs — copy-static 2b clobber guard (M1, final review)
// Contract: hand-authored allowlisted static pages and content-first shells are
// NEVER overwritten by the per-slug SPA shell injection.
const test = require('node:test');
const assert = require('node:assert/strict');
const { shouldInjectSpaShell } = require('../scripts/lib/spa-inject-policy.cjs');
const ALLOW = new Set([
  "world/makcikgpt/petronas-leadership-1974-2026/index.html",
  "world/makcikgpt/petronas-full-reality-rakyat-dossier/index.html",
]);

test('content-first shells are never overwritten', () => {
  assert.equal(shouldInjectSpaShell('<html><article id="content-first-body">x</article></html>', 'world/makcikgpt/anything/index.html', ALLOW), false);
});

test('STATIC_INDEX_ALLOWLIST hand-authored pages are never overwritten', () => {
  // sealed dossiers are allowlisted (copy-static-html.js STATIC_INDEX_ALLOWLIST)
  assert.equal(shouldInjectSpaShell('<html><title>Petronas Leadership 1974 2026</title></html>', 'world/makcikgpt/petronas-leadership-1974-2026/index.html', ALLOW), false);
  assert.equal(shouldInjectSpaShell('<html>old</html>', 'world/makcikgpt/petronas-full-reality-rakyat-dossier/index.html', ALLOW), false);
});

test('ordinary generated/missing slugs still get the SPA shell', () => {
  assert.equal(shouldInjectSpaShell('<html>generic</html>', 'world/makcikgpt/some-regular-slug/index.html', ALLOW), true);
  assert.equal(shouldInjectSpaShell(null, 'world/makcikgpt/new-slug/index.html', ALLOW), true);
});
