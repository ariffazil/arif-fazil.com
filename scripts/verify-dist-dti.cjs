#!/usr/bin/env node
/**
 * verify-dist-dti.cjs — pre-deploy content attestation (DTI L3/L4/L5/L6) against dist/.
 *
 * WHY THIS EXISTS: verify-surfaces.cjs applies the DTI content gates to the LIVE
 * site. That makes a content fix structurally unshippable: the deploy is blocked
 * until the gate passes, and the gate cannot pass until the fix is live. This tool
 * closes that loop by asserting the same four gates on the BUILT artifact, so the
 * fix can be proven before it is deployed.
 *
 * Scope, stated honestly:
 *   PROVES   — the raw HTML in dist/ carries <h1>, JSON-LD, og:* and canonical.
 *   DOES NOT — routing/status (301/308/404), Caddy behaviour, Cloudflare edge
 *              transformation. Those remain live-only checks in verify-surfaces.cjs.
 *
 * Usage: node scripts/verify-dist-dti.cjs [distDir]
 * Exit:  0 = all in-scope surfaces pass · 1 = one or more fail
 */
const fs = require("fs");
const path = require("path");

const SITE_ROOT = path.resolve(__dirname, "..");
const DIST = process.argv[2] || path.join(SITE_ROOT, "sites", "arif-fazil.com", "dist");
const SURFACES = path.join(SITE_ROOT, "sites", "arif-fazil.com", "surfaces.json");

function assertDTI(body) {
  if (!/<h1\b[^>]*>([\s\S]*?)<\/h1>/i.test(body)) return "L3 no <h1>";
  if (!/<script[^>]+type=["']application\/ld\+json["']/i.test(body)) return "L4 no JSON-LD";
  if (!/<meta\s+property=["']og:(title|description|image)["']/i.test(body)) return "L5 no og:*";
  if (!/<link\s+rel=["']canonical["']/i.test(body)) return "L6 no canonical";
  return null;
}

if (!fs.existsSync(DIST)) { console.error(`FATAL: dist not found: ${DIST}`); process.exit(2); }
const catalog = JSON.parse(fs.readFileSync(SURFACES, "utf8"));
const inScope = (catalog.surfaces || []).filter(
  (s) => s.status === "live" && s.type !== "machine" && s.type !== "dynamic_page" && !s.path.includes(":")
);

let pass = 0, fail = 0, absent = 0;
const failures = [];

for (const s of inScope) {
  const rel = s.path.replace(/^\//, "").replace(/\/$/, "");
  const file = path.join(DIST, rel, "index.html");
  if (!fs.existsSync(file)) { absent++; continue; }
  const body = fs.readFileSync(file, "utf8");
  const err = assertDTI(body);
  if (err) { fail++; failures.push(`${s.path} — ${err}`); } else { pass++; }
}

console.log(`\nDIST DTI ATTESTATION  (${DIST})`);
console.log(`surfaces in scope: ${inScope.length} · pass ${pass} · fail ${fail} · no dist file ${absent}`);
if (failures.length) {
  console.log("\nFAILING:");
  failures.forEach((f) => console.log("  ✗ " + f));
  console.log("\nVERDICT: FAIL — content gates not satisfied by the built artifact.");
  process.exit(1);
}
console.log("\nVERDICT: PASS — every in-scope surface in dist/ carries h1 + JSON-LD + og + canonical.");
console.log("Routing/status is NOT covered here; verify-surfaces.cjs remains the live gate.");
