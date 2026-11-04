// tests/primer-shells.test.cjs — PRESERVED_ROUTES guard for primer-shells generator
// 2026-11-04 (T11): /world/ hub is hand-curated (148KB); running primer-shells must
// never clobber it. Mirror of generate-agent-shells.cjs PRESERVED_ROUTES pattern.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const Mod = require('../scripts/primer-shells.cjs');

test('module exports the guard contract', () => {
  assert.equal(typeof Mod.writeRoute, 'function', 'writeRoute must be exported for test');
  assert.ok(Mod.PRESERVED_ROUTES && Mod.PRESERVED_ROUTES.has('world'),
    "PRESERVED_ROUTES must contain 'world'");
});

test('writeRoute SKIPS preserved routes and leaves curated files untouched', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'primer-guard-'));
  Mod.setPublicRoot(tmp);
  const curated = '<html><!-- curated 148KB world hub --></html>';
  fs.mkdirSync(path.join(tmp, 'world'), { recursive: true });
  fs.writeFileSync(path.join(tmp, 'world', 'index.html'), curated);

  const result = Mod.writeRoute('world', '<html>clobber attempt</html>');

  assert.equal(result.skipped, true, 'world must be skipped');
  assert.equal(fs.readFileSync(path.join(tmp, 'world', 'index.html'), 'utf8'), curated,
    'curated /world/ hub must be byte-identical after a run');

  // non-preserved route still writes
  const r2 = Mod.writeRoute('guard-test-route', '<html>ok</html>');
  assert.equal(r2.skipped, false);
  assert.equal(fs.readFileSync(path.join(tmp, 'guard-test-route', 'index.html'), 'utf8'), '<html>ok</html>');
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('requiring the module does NOT execute writes (main guarded)', () => {
  // If main ran on require, public/ mtimes would change and this test file's own
  // require above would already have mutated the repo. Assert the guard flag.
  assert.equal(Mod.__mainGuarded, true, 'script body must run only under require.main');
});
