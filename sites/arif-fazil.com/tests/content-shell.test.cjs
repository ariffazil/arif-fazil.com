// tests/content-shell.test.cjs — content-first shell renderer (T12)
// Contract: renderContentFirstShell(route, meta) → complete static HTML with
// real content BEFORE any JS: title, dateModified, article body, fed-nav,
// and a hydration slot. "200 SPA-shell bukan bukti" (UPGRADE-PLAN).
const test = require('node:test');
const assert = require('node:assert/strict');
const { renderContentFirstShell } = require('../scripts/lib/content-shell.cjs');

const META = {
  title: 'Ujian Dossier',
  description: 'Dengan isi sebenar, bukan shell kosong.',
  canonical: 'https://arif-fazil.com/world/makcikgpt/ujian/',
  breadcrumbTrail: 'Arif Fazil / World / MakcikGPT',
  dateModified: '2026-11-04',
  bodyHtml: '<p>Isi artikel sebenar di sini. <strong>Bold</strong> dan fakta.</p>',
};

test('renders a complete content-first shell', () => {
  const html = renderContentFirstShell('world/makcikgpt/ujian', META);
  assert.match(html, /<title>Ujian Dossier<\/title>/);
  assert.match(html, /2026-11-04/, 'dateModified must appear');
  assert.match(html, /Isi artikel sebenar di sini/, 'article body must be embedded');
  assert.match(html, /fed-nav\.css/, 'fed-nav stylesheet included');
  assert.match(html, /fed-nav\.js/, 'fed-nav script included');
  assert.match(html, /id="fed-nav-root"/, 'fed-nav mount present');
  assert.match(html, /rel="canonical" href="https:\/\/arif-fazil\.com\/world\/makcikgpt\/ujian\/"/);
  assert.match(html, /name="viewport"/, 'mobile viewport meta present');
});

test('no JavaScript required to read the content', () => {
  const html = renderContentFirstShell('world/makcikgpt/ujian', META);
  // the body must live OUTSIDE any script/JSON payload
  const stripped = html.replace(/<script[\s\S]*?<\/script>/g, '');
  assert.match(stripped, /Isi artikel sebenar di sini/);
});

test('escapes hostile meta values (title/description)', () => {
  const evil = renderContentFirstShell('x/y', {
    ...META,
    title: 'Ujian <script>alert(1)</script>',
    description: '"><img onerror=x>',
  });
  assert.ok(!/<script>alert/.test(evil), 'title must be escaped');
  assert.ok(!/"><img onerror/.test(evil), 'description attr must be escaped');
});

test('refuses empty bodies (a 200 with no content is a lie — F2)', () => {
  const out = renderContentFirstShell('x/y', { ...META, bodyHtml: '   ' });
  assert.equal(out, null);
});
