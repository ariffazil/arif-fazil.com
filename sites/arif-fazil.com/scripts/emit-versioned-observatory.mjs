#!/usr/bin/env node
/**
 * Emit a content-addressed copy of the observatory renderer and point the
 * page at it.
 *
 * Usage: node scripts/emit-versioned-observatory.mjs
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
// point the page at the content-addressed copy; replace either bare observatory.js or prior observatory-<hash>.js
page = page.replace(/\/_shared\/observatory(?:-[a-f0-9]{10})?\.js(\?v=[a-z0-9-]+)?/g, `/_shared/${versionedName}`);
fs.writeFileSync(PAGE, page);
console.log(`emit-versioned-observatory: ${versionedName} (sha256-10 ${hash}) → /arifos/ reference updated`);
