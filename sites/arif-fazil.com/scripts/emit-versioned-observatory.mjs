#!/usr/bin/env node
/**
 * Emit a content-addressed copy of the observatory renderer and point the
 * page at it.
 *
 * WHY (2026-11-21): Cloudflare caches /_shared/* for 4h and IGNORES the ?v=
 * query string in the cache key — a query-string bump does NOT bust the edge.
 * A content-addressed PATH is a new cache key, so the new renderer is live
 * immediately and forever (no purge, no 4h wait).
 *
 * Deterministic: the filename embeds the sha256 prefix of the content, so the
 * same content yields the same filename (no dirty-tree churn).
 *
 * Usage: node scripts/emit-versioned-observatory.cjs
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "public/_shared/observatory.js");
const PAGE = path.join(ROOT, "public/arifos/index.html");

if (!fs.existsSync(SRC)) {
  console.error("emit-versioned-observatory: renderer missing — " + SRC);
  process.exit(1);
}
const content = fs.readFileSync(SRC);
const hash = crypto.createHash("sha256").update(content).digest("hex").slice(0, 10);
const versionedName = `observatory-${hash}.js`;
const DEST = path.join(ROOT, "public/_shared", versionedName);
fs.writeFileSync(DEST, content);

if (!fs.existsSync(PAGE)) {
  console.error("emit-versioned-observatory: page missing — " + PAGE);
  process.exit(1);
}
let page = fs.readFileSync(PAGE, "utf8");
// point the page at the content-addressed copy; drop the ineffective ?v= bump
page = page.replace(/\/_shared\/observatory\.js(\?v=[a-z0-9-]+)?/g, `/_shared/${versionedName}`);
fs.writeFileSync(PAGE, page);
console.log(`emit-versioned-observatory: ${versionedName} (sha256-10 ${hash}) → /arifos/ reference updated`);
