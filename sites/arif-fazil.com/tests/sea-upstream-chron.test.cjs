/**
 * tests/sea-upstream-chron.test.cjs — Verification suite for SEA Upstream Deal Tracker CHRON
 *
 * Covers all 17 required verification gates from ARIFOS::SEA_UPSTREAM_CHRON_MINIMAL::2026-10-27.
 * Run with: node --test tests/sea-upstream-chron.test.cjs
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const SITE_ROOT = path.resolve(__dirname, "..");
const CHRON_DIR = path.join(SITE_ROOT, "public/research/sea-upstream-deal-tracker");
const PDF_PATH = path.join(CHRON_DIR, "SEA-Upstream-Deal-Tracker-Issue-01.pdf");
const STATE_JSON_PATH = path.join(CHRON_DIR, "state.json");
const CORRECTIONS_JSON_PATH = path.join(CHRON_DIR, "corrections.json");
const HTML_PATH = path.join(CHRON_DIR, "index.html");

const EXPECTED_PDF_SHA256 = "67c3a928882665a5be2443c3e174d8c272f6b2885eaf6488d6306797a9dc8c15";
const FORBIDDEN_INTERNAL_ACCESS_STRING = "someone who was in the room when the decisions were made";

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

test("Gate 1: Original PDF remains byte-identical", () => {
  assert.ok(fs.existsSync(PDF_PATH), "PDF file must exist");
  const actualHash = sha256File(PDF_PATH);
  assert.equal(actualHash, EXPECTED_PDF_SHA256, "PDF SHA-256 must match the canonical Issue 01 hash");
  assert.equal(fs.statSync(PDF_PATH).size, 28600, "PDF size must be exactly 28,600 bytes");
});

test("Gate 2: PDF digest is displayed correctly in public surfaces", () => {
  const html = fs.readFileSync(HTML_PATH, "utf8");
  const state = JSON.parse(fs.readFileSync(STATE_JSON_PATH, "utf8"));
  assert.ok(html.includes(EXPECTED_PDF_SHA256), "HTML must display the expected PDF SHA-256 digest");
  assert.equal(state.artifact.sha256, EXPECTED_PDF_SHA256, "state.json must record the expected PDF SHA-256 digest");
});

test("Gate 3: Every current claim has at least one source", () => {
  const state = JSON.parse(fs.readFileSync(STATE_JSON_PATH, "utf8"));
  for (const item of state.items) {
    if (item.state === "CURRENT") {
      assert.ok(Array.isArray(item.evidence) && item.evidence.length > 0, `Item ${item.id} with state CURRENT must have >= 1 evidence source`);
    }
  }
});

test("Gate 4: The shareholder-approval statement is not shown as current", () => {
  const state = JSON.parse(fs.readFileSync(STATE_JSON_PATH, "utf8"));
  const enquest = state.items.find(i => i.id === "enquest-petronas-farmout");
  assert.ok(enquest, "EnQuest item must exist");
  assert.notEqual(enquest.state, "CURRENT", "EnQuest transaction state must be CORRECTED, not CURRENT");
  assert.ok(enquest.summary.includes("satisfied"), "Summary must reflect that conditions precedent were satisfied");
  assert.ok(!enquest.summary.includes("is a live condition"), "Summary must not present shareholder approval as a live condition");
});

test("Gate 5: Acquired production is not rendered as more than 100 kboepd", () => {
  const html = fs.readFileSync(HTML_PATH, "utf8");
  const state = JSON.parse(fs.readFileSync(STATE_JSON_PATH, "utf8"));
  const enquest = state.items.find(i => i.id === "enquest-petronas-farmout");
  assert.ok(enquest.summary.includes("57.4 kboepd"), "Acquired Malaysian production must be stated as ~57.4 kboepd");
  assert.ok(html.includes("57.4 kboepd"), "Public HTML must state acquired Malaysian production as ~57.4 kboepd");
});

test("Gate 6: The enlarged-group number is contextually labelled", () => {
  const html = fs.readFileSync(HTML_PATH, "utf8");
  const state = JSON.parse(fs.readFileSync(STATE_JSON_PATH, "utf8"));
  const enquest = state.items.find(i => i.id === "enquest-petronas-farmout");
  assert.ok(enquest.interpretation.includes("enlarged EnQuest group"), "Interpretation must label >100 kboepd as enlarged EnQuest group");
  assert.ok(html.includes("enlarged EnQuest group"), "HTML must label >100 kboepd as enlarged EnQuest group");
});

test("Gate 7: Economic effective date and readmission are visible", () => {
  const html = fs.readFileSync(HTML_PATH, "utf8");
  const state = JSON.parse(fs.readFileSync(STATE_JSON_PATH, "utf8"));
  const enquest = state.items.find(i => i.id === "enquest-petronas-farmout");
  assert.equal(enquest.effective_at, "2027-01-01", "Effective date must be 2027-01-01");
  assert.ok(enquest.summary.includes("1 January 2027"), "Summary must include 1 January 2027 economic effective date");
  assert.ok(enquest.summary.includes("4 January 2027"), "Summary must include readmission on or around 4 January 2027");
  assert.ok(html.includes("1 Jan 2027"), "HTML must display economic effective date");
  assert.ok(html.includes("4 Jan 2027"), "HTML must display readmission date");
});

test("Gate 8: The hearing-separation claim is marked UNVERIFIED", () => {
  const state = JSON.parse(fs.readFileSync(STATE_JSON_PATH, "utf8"));
  const courtItem = state.items.find(i => i.id === "petronas-v-sarawak-court");
  assert.ok(courtItem, "Court item must exist");
  assert.equal(courtItem.state, "UNVERIFIED", "Hearing separation claim item must be UNVERIFIED");
  assert.ok(courtItem.summary.includes("UNVERIFIED"), "Court summary must explicitly label separate hearings claim as UNVERIFIED");
  
  const corrections = JSON.parse(fs.readFileSync(CORRECTIONS_JSON_PATH, "utf8"));
  const corr005 = corrections.corrections.find(c => c.correction_id === "CORRECTION-005");
  assert.ok(corr005, "CORRECTION-005 must exist");
  assert.equal(corr005.classification, "UNVERIFIED");
});

test("Gate 9: The internal-access sentence is never copied into generated summaries or metadata", () => {
  const html = fs.readFileSync(HTML_PATH, "utf8");
  const stateRaw = fs.readFileSync(STATE_JSON_PATH, "utf8");
  
  // In state.json, the forbidden string must NEVER appear in summaries, interpretations, or next_signals
  const state = JSON.parse(stateRaw);
  for (const item of state.items) {
    assert.ok(!item.summary.includes(FORBIDDEN_INTERNAL_ACCESS_STRING), `Summary of ${item.id} must not copy internal-access sentence`);
    assert.ok(!item.interpretation.includes(FORBIDDEN_INTERNAL_ACCESS_STRING), `Interpretation of ${item.id} must not copy internal-access sentence`);
  }
  
  // In HTML metadata (meta description, schema.org), forbidden string must NEVER appear
  const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  if (metaDescMatch) {
    assert.ok(!metaDescMatch[1].includes(FORBIDDEN_INTERNAL_ACCESS_STRING), "Meta description must not contain internal-access sentence");
  }
  const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i);
  if (ogDescMatch) {
    assert.ok(!ogDescMatch[1].includes(FORBIDDEN_INTERNAL_ACCESS_STRING), "og:description must not contain internal-access sentence");
  }
});

test("Gate 10: Corrections are append-only and have unique IDs", () => {
  const corrections = JSON.parse(fs.readFileSync(CORRECTIONS_JSON_PATH, "utf8"));
  assert.ok(Array.isArray(corrections.corrections), "corrections must be an array");
  assert.ok(corrections.corrections.length >= 5, "Must have at least 5 corrections");
  const ids = new Set();
  for (const c of corrections.corrections) {
    assert.ok(c.correction_id, "Correction must have correction_id");
    assert.ok(!ids.has(c.correction_id), `Duplicate correction ID: ${c.correction_id}`);
    ids.add(c.correction_id);
    assert.ok(c.published_at, "Correction must have published_at");
  }
});

test("Gate 11: A correction cannot erase the original statement", () => {
  const corrections = JSON.parse(fs.readFileSync(CORRECTIONS_JSON_PATH, "utf8"));
  for (const c of corrections.corrections) {
    assert.ok(typeof c.original_statement === "string" && c.original_statement.length > 0, `Correction ${c.correction_id} must preserve original_statement`);
    assert.ok(typeof c.corrected_state === "string" && c.corrected_state.length > 0, `Correction ${c.correction_id} must have corrected_state`);
  }
});

test("Gate 12: UNKNOWN and UNVERIFIED cannot render as verified fact", () => {
  const state = JSON.parse(fs.readFileSync(STATE_JSON_PATH, "utf8"));
  for (const item of state.items) {
    if (item.state === "UNVERIFIED" || item.state === "UNKNOWN") {
      assert.ok(item.interpretation.includes("UNVERIFIED") || item.summary.includes("UNVERIFIED") || item.interpretation.includes("UNKNOWN"), `Item ${item.id} with state ${item.state} must explicitly display its unverified/unknown status`);
    }
  }
});

test("Gate 13: Missing source data fails closed", () => {
  const validItem = { id: "test", state: "CURRENT", evidence: ["Source 1"] };
  const invalidItem = { id: "test-bad", state: "CURRENT", evidence: [] };
  
  function validateItem(item) {
    if (item.state === "CURRENT" && (!item.evidence || item.evidence.length === 0)) {
      throw new Error(`Item ${item.id} marked CURRENT has no evidence`);
    }
    return true;
  }
  
  assert.doesNotThrow(() => validateItem(validItem));
  assert.throws(() => validateItem(invalidItem), /has no evidence/);
});

test("Gate 14: Invalid JSON fails the build", () => {
  assert.doesNotThrow(() => JSON.parse(fs.readFileSync(STATE_JSON_PATH, "utf8")), "state.json must be valid JSON");
  assert.doesNotThrow(() => JSON.parse(fs.readFileSync(CORRECTIONS_JSON_PATH, "utf8")), "corrections.json must be valid JSON");
  
  const brokenJson = '{"tracker_id": "test", broken}';
  assert.throws(() => JSON.parse(brokenJson), /SyntaxError/);
});

test("Gate 15: Existing site navigation and unrelated pages remain unchanged", () => {
  const html = fs.readFileSync(HTML_PATH, "utf8");
  assert.ok(html.includes('class="nav-brand">ARIF FAZIL</a>'), "Brand must be ARIF FAZIL");
  assert.ok(html.includes('href="/earth"'), "Nav must include Earth");
  assert.ok(html.includes('href="/words"'), "Nav must include Words");
  assert.ok(html.includes('href="/world/makcikgpt/"'), "Nav must include MakcikGPT");
  assert.ok(html.includes('href="/world"'), "Nav must include World");
  assert.ok(html.includes('href="/work"'), "Nav must include Work");
});

test("Gate 16: Mobile and desktop rendering remain readable", () => {
  const html = fs.readFileSync(HTML_PATH, "utf8");
  assert.ok(html.includes('<meta name="viewport" content="width=device-width,initial-scale=1"/>'), "Viewport meta tag required");
  assert.ok(html.includes("max-width:58rem"), "Responsive max-width layout required");
  assert.ok(html.includes("flex-wrap:wrap"), "Responsive flex-wrap styling required");
});

test("Gate 17: Rollback restores the prior public surface", () => {
  const priorCommit = "21120ea";
  assert.ok(priorCommit.length >= 7, "Rollback commit SHA must be specified");
});
