#!/usr/bin/env node
/**
 * refresh-hand-page-assets.cjs — self-heal stale Vite asset refs in static HTML.
 *
 * Why (2026-10-05): hand-authored pages under public/world/makcikgpt/<slug>/
 * hardcode hashed Vite bundles (e.g. /assets/index-DFZuDSKa.js). Every rebuild
 * renames those bundles, so hand pages (and any dist shells copied from them)
 * silently 404 their JS/CSS and React hydration dies. This script rewrites
 * refs to missing assets with the current build's equivalent (matched by
 * name-without-hash), backing up each touched file first.
 *
 * Scope: every .html file under public/ and dist/ (all depths). Refs to assets that still exist
 * are left untouched. Missing assets with no current counterpart are reported.
 *
 * Run: node scripts/refresh-hand-page-assets.cjs [--dry-run]
 * Wired into the postbuild chain in package.json (after prerender-makcik-slugs).
 */

const fs = require("node:fs");
const path = require("node:path");

const SITE_ROOT = path.resolve(__dirname, "..");
const DIST_ASSETS = path.join(SITE_ROOT, "dist/assets");
const BACKUP_ROOT = path.join(SITE_ROOT, ".backups", "asset-refs-" + new Date().toISOString().slice(0, 10));
const DRY_RUN = process.argv.includes("--dry-run");

const REF_RE = /\/assets\/([A-Za-z0-9_.-]+\.(?:js|css))/g;

function stripHash(filename) {
  // index-DFZuDSKa.js -> index.js ; jsx-runtime-bAis_ILe.js -> jsx-runtime.js
  return filename.replace(/-[A-Za-z0-9_-]{8}(\.(?:js|css))$/, "$1");
}

function walkHtml(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(p, out);
    else if (e.isFile() && e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const have = new Set(fs.existsSync(DIST_ASSETS) ? fs.readdirSync(DIST_ASSETS) : []);
const currentByName = new Map();
for (const f of have) currentByName.set(stripHash(f), f);

let scanned = 0, patched = 0, unrepaired = [];
const files = [...walkHtml(path.join(SITE_ROOT, "public"), []), ...walkHtml(path.join(SITE_ROOT, "dist"), [])];

for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const refs = [...src.matchAll(REF_RE)].map((m) => m[1]);
  const missing = [...new Set(refs.filter((r) => !have.has(r)))];
  if (!missing.length) continue;
  scanned++;

  let out = src;
  const applied = [];
  for (const miss of missing) {
    const replacement = currentByName.get(stripHash(miss));
    if (!replacement) {
      unrepaired.push(`${path.relative(SITE_ROOT, file)} -> /assets/${miss} (no current counterpart)`);
      continue;
    }
    out = out.split(`/assets/${miss}`).join(`/assets/${replacement}`);
    applied.push(`${miss} -> ${replacement}`);
  }
  if (out !== src) {
    if (!DRY_RUN) {
      const backupPath = path.join(BACKUP_ROOT, path.relative(SITE_ROOT, file));
      fs.mkdirSync(path.dirname(backupPath), { recursive: true });
      fs.copyFileSync(file, backupPath);
      fs.writeFileSync(file, out, "utf8");
    }
    patched++;
    console.log(`patched ${path.relative(SITE_ROOT, file)}: ${applied.join(", ")}`);
  }
}

console.log(`scan=${files.length} files_with_stale_refs=${scanned} patched=${patched}${DRY_RUN ? " (dry-run)" : ""}`);
if (unrepaired.length) {
  console.log("UNREPAIRED (review manually):");
  for (const u of unrepaired) console.log("  " + u);
}
