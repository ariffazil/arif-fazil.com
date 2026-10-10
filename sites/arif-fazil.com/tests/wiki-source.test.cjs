/**
 * tests/wiki-source.test.cjs — deterministic parity test for Wiki source of truth.
 *
 * Asserts that:
 * 1. public/data/wiki-index.json is valid and contains exactly 10 entries across 4 categories.
 * 2. Every entry contains required epistemic and governance fields.
 * 3. public/words/wiki/index.html is in exact deterministic sync with wiki-index.json (no drift).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { renderWikiHtml } = require("../scripts/generate-wiki-index.cjs");

const root = path.resolve(__dirname, "..");
const jsonPath = path.join(root, "public/data/wiki-index.json");
const htmlPath = path.join(root, "public/words/wiki/index.html");

test("Wiki data contract and deterministic render test", () => {
  assert.ok(fs.existsSync(jsonPath), "wiki-index.json must exist");
  assert.ok(fs.existsSync(htmlPath), "words/wiki/index.html must exist");

  const rawJson = fs.readFileSync(jsonPath, "utf8");
  const data = JSON.parse(rawJson);

  assert.equal(data.entries.length, 10, "must contain exactly 10 entries");
  assert.equal(data.categories.length, 4, "must contain exactly 4 categories");

  for (const entry of data.entries) {
    assert.ok(entry.title, `entry ${entry.slug} must have title`);
    assert.ok(entry.category, `entry ${entry.slug} must have category`);
    assert.ok(entry.epistemic_class, `entry ${entry.slug} must have epistemic_class`);
    assert.ok(entry.canonical_status, `entry ${entry.slug} must have canonical_status`);
    assert.ok(entry.source, `entry ${entry.slug} must have source`);
    assert.ok(Array.isArray(entry.links), `entry ${entry.slug} must have links array`);
  }

  const generatedHtml = renderWikiHtml(data);
  const currentHtml = fs.readFileSync(htmlPath, "utf8");

  assert.equal(currentHtml.trim(), generatedHtml.trim(), "public/words/wiki/index.html must match generated output from JSON");
});
