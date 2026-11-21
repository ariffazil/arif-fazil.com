#!/usr/bin/env node
/**
 * Refresh stale /assets/ references in the AAA cockpit (and its subtree).
 *
 * WHY (2026-11-21): the cockpit is a STATIC page that referenced an old
 * hashed build (/assets/index-DL_C9EwE.css). Two failure modes followed:
 *   a) the build's copy-static step treated "aaa" as an SPA route and
 *      REPLACED the cockpit with the apex SPA shell (which references the
 *      apex bundle — 404 on the aaa host, because that host has no
 *      /assets/ tree) → a blank/broken page on mobile;
 *   b) even the cockpit's own stale refs pointed at assets that no longer
 *      existed after a rebuild.
 *
 * This step rewrites stale refs to the CURRENT build's assets and keeps the
 * cockpit body intact — so restamp-shell-assets.cjs sees a healthy shell and
 * does not replace it with a minimal SPA shell.
 *
 * Scope: dist/aaa/** only (the cockpit subtree). The apex SPA keeps its own
 * asset pipeline untouched.
 *
 * Usage: node scripts/refresh-asset-refs.cjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DIST = path.join(ROOT, "dist");
const ASSETS = path.join(DIST, "assets");

if (!fs.existsSync(ASSETS)) {
  console.error("refresh-asset-refs: dist/assets missing — build first");
  process.exit(1);
}
const emitted = fs.readdirSync(ASSETS);
const currentCss = emitted.find((f) => /^index-[A-Za-z0-9_-]+\.css$/.test(f));
const currentJs = emitted.find((f) => /^index-[A-Za-z0-9_-]+\.js$/.test(f));
if (!currentCss || !currentJs) {
  console.error("refresh-asset-refs: cannot identify the current index css/js in dist/assets");
  process.exit(1);
}

const targets = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "index.html") targets.push(p);
  }
})(path.join(DIST, "aaa"));

// VERIFIED 2026-11-21: the AAA cockpit is a STATIC surface — none of its 16 CSS
// classes exist in the apex bundle CSS and the bundle JS carries no cockpit code.
// The /assets/ refs were leftovers from an older shell: they 404 on the aaa host
// (no /assets/ tree there) and the bundle JS could mount the apex app over the
// cockpit content. Strip them; the cockpit styles itself with its inline <style>
// plus /_shared/design-system/tokens.css.
let rewritten = 0;
for (const f of targets) {
  let html = fs.readFileSync(f, "utf8");
  const before = html;
  html = html.replace(/[ \t]*<link[^>]+href="\/assets\/index-[A-Za-z0-9_-]+\.css"[^>]*>\n?/g, "");
  html = html.replace(/[ \t]*<script[^>]+src="\/assets\/index-[A-Za-z0-9_-]+\.js"[^>]*><\/script>\n?/g, "");
  if (html !== before) {
    fs.writeFileSync(f, html);
    rewritten++;
  }
}
console.log(`refresh-asset-refs: ${rewritten}/${targets.length} AAA pages — vestigial apex-bundle refs stripped`);
