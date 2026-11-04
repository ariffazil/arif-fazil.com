// tests/stitch-canon.test.cjs — PRIMER-1 canon skin gate for Stitch components
// Sovereign decision 2026-11-04: PRIMER-1 canon wins. Stitch triad (#38bdf8 cyan,
// #f59e0b amber, #ef4444 red), Stitch surfaces, sharp 0px corners and duplicate
// headers must not ship inside the stitch component family.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'src', 'components', 'stitch');

const FORBIDDEN_HEX = [
  '#38bdf8', '#0284c7', '#7dd3fc', // stitch cyan → institution blue via alias only
  '#f59e0b', '#fbbf24', '#fef087', // stitch amber → human yellow
  '#ef4444', '#dc2626', '#fca5a5', // stitch red → rationed sovereign red
  '#090b10', '#0f141f', '#111722', '#151c2b', '#1e293b', // stitch surfaces → forge neutrals
  '#e2e2e8', '#94a3b8', '#64748b', '#475569', // stitch text → forge ink
  '#34d399', '#10b981', // stitch greens → forge.green
];

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.tsx'));

test('stitch components exist', () => {
  assert.ok(files.length >= 5, `expected >=5 components, found ${files.length}`);
});

test('no forbidden Stitch hex literals', () => {
  for (const f of files) {
    const s = fs.readFileSync(path.join(DIR, f), 'utf8').toLowerCase();
    for (const hex of FORBIDDEN_HEX) {
      assert.ok(!s.includes(hex), `${f} still contains Stitch hex ${hex}`);
    }
  }
});

test('no 0px corners (canon radii {2,12,full})', () => {
  for (const f of files) {
    const s = fs.readFileSync(path.join(DIR, f), 'utf8');
    assert.ok(!/rounded-none/.test(s), `${f} uses rounded-none (0px violates canon radii)`);
  }
});

test('no default-palette amber/slate classes (unregistered hues)', () => {
  for (const f of files) {
    const s = fs.readFileSync(path.join(DIR, f), 'utf8');
    assert.ok(!/text-amber-|bg-amber-|border-amber-/.test(s), `${f} uses amber-* (map to human-* tokens)`);
    assert.ok(!/(?:^|[\s"'])slate-/.test(s), `${f} uses slate-* (map to forge/bone neutrals)`);
  }
});

test('LayoutGrid carries no duplicate header and max one torus', () => {
  const s = fs.readFileSync(path.join(DIR, 'LayoutGrid.tsx'), 'utf8');
  assert.ok(!/<header/.test(s), 'LayoutGrid must not render its own <header> (app shell owns nav)');
  const tori = s.match(/torus/gi) || [];
  assert.ok(tori.length <= 4, `LayoutGrid torus references suspiciously high: ${tori.length} (max 1 rendered torus)`);
});

test('no Google-hosted fonts or material symbols', () => {
  for (const f of files) {
    const s = fs.readFileSync(path.join(DIR, f), 'utf8').toLowerCase();
    assert.ok(!s.includes('fonts.googleapis'), `${f} loads Google fonts (canon: self-hosted IBM Plex stack)`);
    assert.ok(!s.includes('material-symbols'), `${f} uses Material Symbols (app standard: lucide)`);
  }
});

const ALLOWED_HUES = 'sky|human|sovereign|telemetry|forge|surface|on-surface|bone|paper|ink|ember|gold|ledger|brass|civic|graphite|cold|obsidian|basalt|strata|magma|primary|secondary|muted|accent|border|background|foreground|ring|input|white|black|transparent|current';

test('no unregistered default-palette hue classes (canon families only)', () => {
  const re = new RegExp('\\b(?:text|bg|border|ring|from|to|via|fill|stroke|decoration|outline|divide|shadow)-(' + ALLOWED_HUES + ')-', 'g');
  for (const f2 of files) {
    const s2 = fs.readFileSync(path.join(DIR, f2), 'utf8');
    const bad = [];
    for (const m of s2.matchAll(/\b(?:text|bg|border|ring|from|to|via|fill|stroke)-(?:[a-z]+)-\d+(?:\/\d+)?\b/g)) {
      if (!re.test(m[0])) bad.push(m[0]);
      re.lastIndex = 0;
    }
    assert.deepStrictEqual(bad, [], f2 + ' uses unregistered hue classes');
  }
});
