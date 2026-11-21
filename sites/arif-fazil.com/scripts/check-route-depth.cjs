#!/usr/bin/env node
/**
 * check-route-depth.cjs — 5-Layer Route Depth & Visual Architecture CI Gate
 * 
 * Enforces the constitutional ceiling:
 *   Max URL depth <= 5 segments from root.
 * Checks:
 *   1. public/surfaces.json (every registered surface)
 *   2. All .html files in public/ (physical on-disk SSG/clean-URL leaves)
 * 
 * Negative test:
 *   node scripts/check-route-depth.cjs --negative-test
 */

const fs = require('fs');
const path = require('path');

const SITE_ROOT = path.resolve(__dirname, '..');
const SURFACES_PATH = path.join(SITE_ROOT, 'public/surfaces.json');
const PUBLIC_DIR = path.join(SITE_ROOT, 'public');
const MAX_ALLOWED_DEPTH = 5;

function computeDepth(routePath) {
  const clean = routePath.split('?')[0].split('#')[0].trim();
  const segs = clean.split('/').filter(Boolean);
  return segs.length;
}

function runDepthAudit(options = {}) {
  const { injectNegative = false } = options;
  const violations = [];
  let checkedSurfaces = 0;
  let checkedHtmlFiles = 0;
  let maxDepthObserved = 0;

  // 1. Audit surfaces.json
  if (fs.existsSync(SURFACES_PATH)) {
    const raw = fs.readFileSync(SURFACES_PATH, 'utf8');
    const data = JSON.parse(raw);
    const surfaces = Array.isArray(data.surfaces) ? data.surfaces : [];

    for (const s of surfaces) {
      if (!s.path) continue;
      checkedSurfaces++;
      const depth = computeDepth(s.path);
      if (depth > maxDepthObserved) maxDepthObserved = depth;

      // Validate visual architecture alignment if declared
      if (s.layer !== undefined && s.layer !== depth) {
        violations.push({
          source: 'surfaces.json (layer mismatch)',
          path: s.path,
          depth,
          declaredLayer: s.layer,
          error: `Declared layer (${s.layer}) does not match path depth (${depth})`
        });
      }

      if (depth > MAX_ALLOWED_DEPTH) {
        violations.push({
          source: 'surfaces.json',
          path: s.path,
          depth,
          error: `Depth ${depth} exceeds MAX_ALLOWED_DEPTH (${MAX_ALLOWED_DEPTH})`
        });
      }
    }
  }

  // 2. Audit all .html files on disk
  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walkDir(full);
      } else if (ent.isFile() && ent.name.endsWith('.html')) {
        checkedHtmlFiles++;
        const rel = path.relative(PUBLIC_DIR, full);
        let url;
        if (rel === 'index.html') {
          url = '/';
        } else if (rel.endsWith('/index.html')) {
          url = '/' + rel.slice(0, -10) + '/';
        } else {
          url = '/' + rel;
        }

        const depth = computeDepth(url);
        if (depth > maxDepthObserved) maxDepthObserved = depth;

        if (depth > MAX_ALLOWED_DEPTH) {
          violations.push({
            source: 'public/' + rel,
            path: url,
            depth,
            error: `Depth ${depth} exceeds MAX_ALLOWED_DEPTH (${MAX_ALLOWED_DEPTH})`
          });
        }
      }
    }
  }

  walkDir(PUBLIC_DIR);

  // Negative test injection
  if (injectNegative) {
    const fakePath = '/world/politics/shadow/deep/layer5/illegal-leaf/';
    const fakeDepth = computeDepth(fakePath);
    if (fakeDepth > MAX_ALLOWED_DEPTH) {
      violations.push({
        source: 'INJECTED_NEGATIVE_TEST',
        path: fakePath,
        depth: fakeDepth,
        error: `Simulated negative test: depth ${fakeDepth} > ${MAX_ALLOWED_DEPTH}`
      });
    }
  }

  return {
    violations,
    checkedSurfaces,
    checkedHtmlFiles,
    maxDepthObserved
  };
}

// CLI Execution
const isNegativeTest = process.argv.includes('--negative-test');

if (isNegativeTest) {
  const result = runDepthAudit({ injectNegative: true });
  if (result.violations.length > 0) {
    console.log('[NEGATIVE TEST PASSED] check-route-depth successfully caught depth > 5 violation:');
    console.log(`   Sample violation: ${result.violations[0].path} (depth=${result.violations[0].depth})`);
    process.exit(0);
  } else {
    console.error('[NEGATIVE TEST FAILED] check-route-depth failed to catch injected depth > 5 violation.');
    process.exit(1);
  }
} else {
  const result = runDepthAudit({ injectNegative: false });
  if (result.violations.length > 0) {
    console.error(`[RED] check-route-depth FAILED with ${result.violations.length} violation(s):`);
    for (const v of result.violations) {
      console.error(`  - [${v.source}] ${v.path} (depth=${v.depth}) -> ${v.error}`);
    }
    process.exit(1);
  } else {
    console.log(`[GREEN] check-route-depth: Passed. Surfaces: ${result.checkedSurfaces}, HTML files: ${result.checkedHtmlFiles}, Max depth: ${result.maxDepthObserved} (Ceiling <= ${MAX_ALLOWED_DEPTH}).`);
    process.exit(0);
  }
}
