/**
 * tests/makcik-parity.test.cjs — zen D2 SPA-store parity gate (F13 2026-11-23).
 *
 * Run with:  node --test tests/makcik-parity.test.cjs
 * Wired into prebuild alongside content-contract.test.cjs.
 *
 * Extends makcik-source.test.cjs (machine-lane parity) to the SPA store:
 *   essays.json (SOT) ↔ meta.presentation.json ↔ meta.generated.ts ↔ body imports
 * All four slug sets must be identical, and every canonical field in the
 * generated meta must equal essays.json. Drift = build failure, not an audit
 * finding. Fails closed; touches no deploy or dirty working-tree file.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { getMakcikSource, SITE_ROOT } = require("../scripts/lib/makcik-source.cjs");

const DATA_DIR = path.join(SITE_ROOT, "src/data/makcikgpt");

function readUtf8(p) {
  return fs.readFileSync(p, "utf8");
}

// String-aware extraction of the array literal assigned to makcikArticlesMeta.
function extractMetaArray(src) {
  const ms = src.indexOf("export const makcikArticlesMeta");
  assert.ok(ms >= 0, "makcikArticlesMeta declaration not found");
  const eq = src.indexOf("=", ms);
  const as = src.indexOf("[", eq);
  let depth = 0, q = null, end = -1;
  for (let i = as; i < src.length; i++) {
    const c = src[i];
    if (q) { if (c === "\\") { i++; continue; } if (c === q) q = null; continue; }
    if (c === "'" || c === '"' || c === "`") { q = c; continue; }
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  assert.ok(end > as, "meta array literal not balanced");
  return eval(src.slice(as, end + 1));
}

function bodyImportSlugs() {
  const src = readUtf8(path.join(DATA_DIR, "index.ts"));
  const slugs = new Set();
  const re = /from '\.\/([a-z0-9-]+)'/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m[1] !== "types" && m[1] !== "meta.generated") slugs.add(m[1]);
  }
  return slugs;
}

const slugOf = (p) => p.dest.path.replace(/\/$/, "").split("/").pop();

// Mirror of the generator's null→omission projection (essays.json null = absent).
function stripNulls(v) {
  if (Array.isArray(v)) return v.map(stripNulls);
  if (v && typeof v === "object") {
    const out = {};
    for (const [k, val] of Object.entries(v)) {
      if (val !== null) out[k] = stripNulls(val);
    }
    return out;
  }
  return v;
}

test("SPA store parity: essays.json ↔ presentation ↔ generated meta ↔ body imports", () => {
  const { pieces } = getMakcikSource();
  const essaySlugs = new Set(pieces.map(slugOf));
  const presentation = JSON.parse(readUtf8(path.join(DATA_DIR, "meta.presentation.json")));
  const presSlugs = new Set(Object.keys(presentation));
  const generated = extractMetaArray(readUtf8(path.join(DATA_DIR, "meta.generated.ts")));
  const genSlugs = new Set(generated.map((m) => m.slug));
  const bodySlugs = bodyImportSlugs();

  const sets = { essaySlugs, presSlugs, genSlugs, bodySlugs };
  for (const [name, set] of Object.entries(sets)) {
    assert.deepEqual(
      [...set].sort(),
      [...essaySlugs].sort(),
      `${name} differs from essays.json slug set`
    );
  }
});

test("generated meta canonical fields equal essays.json (title/date/tags/seal/provenance/claims)", () => {
  const { pieces } = getMakcikSource();
  const bySlug = new Map(pieces.map((p) => [slugOf(p), p]));
  const generated = extractMetaArray(readUtf8(path.join(DATA_DIR, "meta.generated.ts")));
  for (const m of generated) {
    const p = bySlug.get(m.slug);
    assert.ok(p, `generated meta has no essays.json source: ${m.slug}`);
    assert.equal(m.title, p.title, `title drift: ${m.slug}`);
    assert.equal(m.date, p.date, `date drift: ${m.slug}`);
    assert.deepEqual(m.tags, p.tags, `tags drift: ${m.slug}`);
    assert.equal(m.seal, p.seal, `seal drift: ${m.slug}`);
    assert.equal(m.provenance_status, p.provenance_status || "legacy", `provenance drift: ${m.slug}`);
    assert.deepEqual(m.claim_register, stripNulls(p.claim_register || []), `claim_register drift: ${m.slug}`);
    assert.ok(typeof m.merkle_leaf === "string" && m.merkle_leaf.length > 0, `missing merkle_leaf: ${m.slug}`);
  }
});

test("retired dossiers stay retired (F13 ruling 2026-11-23)", () => {
  const retired = ["petronas-full-reality-rakyat-dossier"];
  const { pieces } = getMakcikSource();
  const presentation = JSON.parse(readUtf8(path.join(DATA_DIR, "meta.presentation.json")));
  const generated = extractMetaArray(readUtf8(path.join(DATA_DIR, "meta.generated.ts")));
  for (const slug of retired) {
    assert.ok(!pieces.some((p) => slugOf(p) === slug), `retired slug back in essays.json: ${slug}`);
    assert.ok(!(slug in presentation), `retired slug back in presentation: ${slug}`);
    assert.ok(!generated.some((m) => m.slug === slug), `retired slug back in generated meta: ${slug}`);
  }
  // leadership dossier re-pointed to /world/petronas/shadow/ — out of makcik scope
  const lead = pieces.find((p) => slugOf(p) === "petronas-leadership-1974-2026");
  assert.equal(lead, undefined, "leadership dossier must stay out of the makcik lane");
});
