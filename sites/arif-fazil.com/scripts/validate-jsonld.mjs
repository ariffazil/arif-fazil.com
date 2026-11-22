#!/usr/bin/env node
/**
 * JSON-LD validator — DOM-shaped, zero-dependency (no cheerio/ajv).
 *
 * Why zero-dep: the site's build must not gain a dependency for a check.
 * We parse the <script type="application/ld+json"> blocks with a tolerant
 * scanner (any attribute order / extra attributes), JSON.parse each body,
 * then validate a minimal schema.org contract ourselves.
 *
 * Usage: node scripts/validate-jsonld.mjs [publicDir]
 * Exit 0 = every block valid; 1 = failures (build stops).
 */
import fs from "node:fs";
import path from "node:path";

const PUBLIC = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "public");
const DECLARED_EXCEPTIONS = new Set([]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.includes(".bak")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === "index.html") out.push(p);
  }
  return out;
}

// Tolerant scanner: any tag whose attributes include type="application/ld+json"
const TAG = /<script\b([^>]*)\btype\s*=\s*["']application\/ld\+json["']([^>]*)>([\s\S]*?)<\/script>/gi;

function validateBlock(obj, where, errs) {
  if (typeof obj !== "object" || obj === null) { errs.push(`${where}: not a JSON object`); return; }
  const graph = obj["@graph"] ?? [obj];
  if (!Array.isArray(graph)) { errs.push(`${where}: @graph is not an array`); return; }
  if (!obj["@context"]) errs.push(`${where}: missing @context`);
  for (const node of graph) {
    if (!node || typeof node !== "object") { errs.push(`${where}: non-object node in @graph`); continue; }
    if (!node["@type"]) { errs.push(`${where}: node without @type`); continue; }
    const t = node["@type"];
    const types = Array.isArray(t) ? t : [t];
    for (const ty of types) {
      switch (ty) {
        case "Article":
          for (const req of ["headline", "url", "author"]) {
            if (!node[req]) errs.push(`${where}: Article missing ${req}`);
          }
          if (node.author && !node.author["@type"]) errs.push(`${where}: Article.author missing @type`);
          break;
        case "WebPage":
          for (const req of ["name", "url"]) if (!node[req]) errs.push(`${where}: WebPage missing ${req}`);
          break;
        case "BreadcrumbList":
          if (!Array.isArray(node.itemListElement) || !node.itemListElement.length)
            errs.push(`${where}: BreadcrumbList has no itemListElement`);
          else {
            node.itemListElement.forEach((it, i) => {
              if (!it["@type"] || it["@type"] !== "ListItem") errs.push(`${where}: breadcrumb[${i}] not ListItem`);
              if (!it.position) errs.push(`${where}: breadcrumb[${i}] missing position`);
              if (!it.name) errs.push(`${where}: breadcrumb[${i}] missing name`);
            });
          }
          break;
        default:
          break; // custom types (Evidence, Claim, Dataset…) accepted; their shape is organ-owned
      }
    }
  }
}

const pages = walk(PUBLIC);
const errs = [];
let blocks = 0, pagesWith = 0;
const uncovered = [];
for (const p of pages) {
  const rel = path.relative(PUBLIC, p);
  const html = fs.readFileSync(p, "utf8");
  const found = [...html.matchAll(TAG)];
  if (!found.length) {
    uncovered.push(rel);
    continue;
  }
  pagesWith++;
  for (const m of found) {
    blocks++;
    try {
      validateBlock(JSON.parse(m[3].trim()), rel, errs);
    } catch (e) {
      errs.push(`${rel}: invalid JSON — ${e.message}`);
    }
  }
}
const unexpected = uncovered.filter((r) => !DECLARED_EXCEPTIONS.has(r));
console.log(`jsonld validator: ${pages.length} pages · ${pagesWith} with blocks · ${blocks} blocks`);
console.log(`  uncovered (${uncovered.length}): ${uncovered.join(", ") || "none"}`);
if (unexpected.length) {
  console.log(`  UNDECLARED uncovered (${unexpected.length}): ${unexpected.join(", ")}`);
}
if (errs.length) {
  console.log(`\nFAIL (${errs.length}):`);
  errs.slice(0, 40).forEach((e) => console.log("  -", e));
  process.exit(1);
}
if (unexpected.length) {
  console.log("\nFAIL — uncovered pages are not in the declared exception list");
  process.exit(1);
}
console.log("\nPASS — all blocks parse and satisfy the schema.org contract");
