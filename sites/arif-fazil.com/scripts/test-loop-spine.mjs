#!/usr/bin/env node
/**
 * Reality-loop spine unit test — runs the SHIPPED spine code (extracted from
 * public/_shared/observatory.js) against a minimal DOM shim and the real
 * observatory snapshot. No browser required (Chrome cannot run as root here).
 *
 * Verifies: 8 phase chips with labels + live verdicts + SOT pointers,
 * 4 apex-zen anchors, and that each phase's anchor section carries
 * data-loop-phase (one hierarchy, no second legend).
 *
 * Usage: node scripts/test-loop-spine.mjs [snapshot.json]
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const RENDERER = path.join(ROOT, "public/_shared/observatory.js");
const SNAPSHOT = process.argv[2] || path.join(ROOT, "public/.well-known/observatory-snapshot-latest.json");

const src = fs.readFileSync(RENDERER, "utf8");
const start = src.indexOf("  const LOOP_PHASES = [");
const end = src.indexOf("  const renderers = [");
if (start < 0 || end < 0 || end <= start) {
  console.error("FAIL — spine block not found in observatory.js");
  process.exit(1);
}
const block = src.slice(start, end);

function makeEl(tag) {
  const el = {
    tagName: tag, id: "", className: "", title: "", innerHTML: "", children: [],
    attrs: {},
    setAttribute(k, v) { this.attrs[k] = v; },
    getAttribute(k) { return this.attrs[k]; },
    appendChild(c) { this.children.push(c); return c; },
    insertBefore(c) { this.children.push(c); return c; },
    get parentNode() { return { insertBefore() {} }; },
  };
  return el;
}
const created = [];
const sections = {};
const doc = {
  head: makeEl("head"),
  body: makeEl("body"),
  getElementById(id) {
    if (id === "now-strip") return { parentNode: { insertBefore() {} } };
    if (sections[id]) return sections[id];
    return null;
  },
  createElement(tag) { const e = makeEl(tag); created.push(e); return e; },
};
global.document = doc;
global.window = { location: { hash: "" } };

const snap = JSON.parse(fs.readFileSync(SNAPSHOT, "utf8"));
// provide the anchor sections so phase badges can be asserted
["sec-identity", "sec-governance", "sec-p1-receipt-federation", "sec-drift",
 "sec-flow-plane", "sec-vault", "sec-next-mutation-gate", "sec-metabolism"]
  .forEach((id) => { sections[id] = makeEl("section"); sections[id].id = id; });

const render = new Function("document", "window", `${block}\nreturn renderRealityLoop;`);
const fn = render(doc, global.window);
fn(snap);

const nav = doc.getElementById("reality-loop") || created.find((e) => e.id === "reality-loop");
const errors = [];
if (!nav) errors.push("nav #reality-loop was not created");
const phaseChips = (nav?.children?.[0]?.children) || [];
const apexChips = (nav?.children?.[1]?.children) || [];
const EXPECT = ["OBSERVE", "REASON", "PLAN", "EXECUTE", "VERIFY", "SEAL", "DEPLOY", "IMPROVE"];
if (phaseChips.length !== 8) errors.push(`expected 8 phase chips, got ${phaseChips.length}`);
phaseChips.forEach((c, i) => {
  const label = EXPECT[i];
  if (!c.innerHTML.includes(label)) errors.push(`chip ${i} missing label ${label}`);
  if (!c.innerHTML.includes("SOT ·")) errors.push(`chip ${i} missing SOT pointer`);
  if (!c.innerHTML.includes("lp-value")) errors.push(`chip ${i} missing verdict value`);
  if (c.innerHTML.includes("[object Object]")) errors.push(`chip ${i} renders an object as [object Object]`);
  if (/lp-value"><\/span>/.test(c.innerHTML)) errors.push(`chip ${i} has an empty verdict`);
});
if (apexChips.length !== 4) errors.push(`expected 4 apex anchors, got ${apexChips.length}`);
const badged = Object.values(sections).filter((s) => s.getAttribute("data-loop-phase")).length;
if (badged !== 8) errors.push(`expected 8 sections badged with data-loop-phase, got ${badged}`);

if (errors.length) {
  console.log("loop-spine test FAILED:");
  errors.forEach((e) => console.log("  -", e));
  process.exit(1);
}
console.log("loop-spine test PASS — 8 phases, live verdicts, SOT pointers, 4 apex anchors, 8 phase badges");
console.log("  sample chip:", phaseChips[4].innerHTML.replace(/\s+/g, " ").slice(0, 150));
