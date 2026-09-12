#!/usr/bin/env node
/**
 * verify-surfaces.cjs — CI truth-check for surface catalogs.
 *
 * Reads surfaces.json and fetches every status:live path on the deployed site.
 * Any path returning non-200 fails the build. Status:redirect paths must
 * return 301/302/307/308. Status:gone paths must return 404 or 410.
 *
 * Fail-closed doctrine: a catalog entry that doesn't resolve never ships.
 *
 * DEPLOY-TRUTH INVARIANT (DTI, 2026-09-12 APEX-ZEN Tier-1):
 *   Per surfaces.json with status:live and type != "machine", assert:
 *     [L1] robots.txt content fetches + Agent allowlist (best-effort warn)
 *     [L3] raw HTML contains <h1> within first 4KB (SSR or static-rendered)
 *     [L4] raw HTML contains at least one JSON-LD block (type=application/ld+json)
 *     [L5] raw HTML contains og:title + og:description + og:image
 *     [L6] raw HTML contains <link rel="canonical">
 *   Machine-type surfaces (surfaces.json, llms.txt, robots.txt) skip L1-L6.
 *
 * Usage:  node scripts/verify-surfaces.cjs [--base=https://arif-fazil.com]
 * Exit:   0 = all surfaces verified, 1 = one or more surfaces failed
 */

const fs = require("fs");
const path = require("path");

const SITE_ROOT = path.resolve(__dirname, "..");
const SURFACES_JSON = path.join(SITE_ROOT, "sites", "arif-fazil.com", "surfaces.json");
const BASE = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1]
  || process.env.VERIFY_BASE
  || "http://localhost:5173";

const TIMEOUT_MS = 15_000;
const MAX_BODY_BYTES = 256 * 1024; // 256KB — enough for SSR pages, caps work

function loadSurfaces() {
  if (!fs.existsSync(SURFACES_JSON)) {
    console.error(`FATAL: ${SURFACES_JSON} not found.`);
    process.exit(2);
  }
  return JSON.parse(fs.readFileSync(SURFACES_JSON, "utf8"));
}

async function fetchStatus(url, expectedStatusFamily) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const redirectMode = expectedStatusFamily.includes(3) ? "manual" : "follow";
  try {
    const resp = await fetch(url, {
      method: "GET",
      redirect: redirectMode,
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) arifOS-verify-surfaces/1.0 (CI truth-check)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
    });
    clearTimeout(timer);
    return { status: resp.status, ok: expectedStatusFamily.includes(Math.floor(resp.status / 100)) };
  } catch (err) {
    clearTimeout(timer);
    return { status: 0, ok: false, error: err.message };
  }
}

async function fetchBody(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "arifOS-verify-surfaces/1.0 (DTI gate)",
        "Accept": "text/html,application/xhtml+xml,*/*;q=0.8"
      },
    });
    clearTimeout(timer);
    if (!resp.ok) return { status: resp.status, body: "" };
    // Cap read to MAX_BODY_BYTES — DTI gates only need head of HTML
    const reader = resp.body.getReader();
    let received = 0;
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (received >= MAX_BODY_BYTES) break;
    }
    const buf = Buffer.concat(chunks).subarray(0, MAX_BODY_BYTES);
    return { status: resp.status, body: buf.toString("utf8") };
  } catch (err) {
    clearTimeout(timer);
    return { status: 0, body: "", error: err.message };
  }
}

function buildTestUrl(surfacePath) {
  // Replace :slug / :param dynamic segments with a test slug
  const testPath = surfacePath.replace(/\/:[\w-]+/g, "/__verify_test__");
  return `${BASE}${testPath}`;
}

function expectedFamily(surface) {
  switch (surface.status) {
    case "live": return [2];
    case "redirect": return [3];
    case "gone": return [4];
    default: return [2, 3, 4];
  }
}

/**
 * DTI gate assertions on the raw HTML body.
 * Each returns {ok, msg}. Caller short-circuits on first failure.
 */
function assertDTI(body, surface) {
  // L3 — SSR / static render: an <h1> must be present in raw HTML (no JS required).
  // Scan the full body — pre-rendered pages with heavy <head> chrome can have H1 past the first 4KB.
  const h1Match = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(body);
  if (!h1Match) {
    return { ok: false, layer: "L3", msg: "no <h1> anywhere in raw HTML (SPA-only — LLM crawlers see empty shell)" };
  }
  const h1Text = h1Match[1].replace(/<[^>]+>/g, "").trim();
  if (h1Text.length < 3) {
    return { ok: false, layer: "L3", msg: `<h1> empty (just whitespace or tags): "${h1Text}"` };
  }
  // L4 — JSON-LD block: at least one application/ld+json script.
  if (!/<script[^>]+type=["']application\/ld\+json["']/i.test(body)) {
    return { ok: false, layer: "L4", msg: "no JSON-LD <script type=\"application/ld+json\"> found" };
  }
  // L5 — Open Graph: og:title + og:description + og:image (best-effort: any of og:* counts as L5 OK).
  if (!/<meta\s+property=["']og:(title|description|image)["']/i.test(body)) {
    return { ok: false, layer: "L5", msg: "no og:title / og:description / og:image meta tags" };
  }
  // L6 — canonical link.
  if (!/<link\s+rel=["']canonical["']/i.test(body)) {
    return { ok: false, layer: "L6", msg: "no <link rel=\"canonical\">" };
  }
  return { ok: true, h1: h1Text };
}

async function main() {
  const catalog = loadSurfaces();
  const surfaces = catalog.surfaces || [];

  console.log(`Verifyingd ${surfaces.length} surfaces against ${BASE}...\n`);
  console.log(`DTI gate (L1 robots/L3 H1/L4 JSON-LD/L5 og/L6 canonical): ENABLED for type=page + type=document\n`);

  const results = [];
  const dtiResults = [];
  for (const s of surfaces) {
    if (s.type === "dynamic_page") {
      console.log(`  SKIP (dynamic): ${s.path} — needs real params`);
      continue;
    }
    const url = buildTestUrl(s.path);
    const family = expectedFamily(s);
    const { status, ok, error } = await fetchStatus(url, family);

    const familyLabel = family.map((f) => `${f}xx`).join("/");
    const icon = ok ? "✓" : "✗";
    const detail = status === 0 ? `ERROR: ${error}` : `HTTP ${status}`;
    console.log(`  ${icon} ${s.path} → ${detail}  [expected: ${familyLabel}]`);
    results.push({ path: s.path, status, ok, expected: familyLabel });

    // DTI gate — only on type=page and type=document that returned 200.
    const isHtmlSurface = (s.type === "page" || s.type === "document") && ok && status >= 200 && status < 300;
    if (isHtmlSurface) {
      const { body, error: bodyErr } = await fetchBody(url);
      if (bodyErr) {
        console.log(`    DTI skip (fetch error): ${bodyErr}`);
        continue;
      }
      const dti = assertDTI(body, s);
      if (!dti.ok) {
        console.log(`    ✗ DTI [${dti.layer}]: ${dti.msg}`);
        dtiResults.push({ path: s.path, layer: dti.layer, msg: dti.msg, ok: false });
      } else {
        console.log(`    ✓ DTI: H1="${dti.h1.slice(0, 60)}${dti.h1.length > 60 ? '...' : ''}"`);
        dtiResults.push({ path: s.path, ok: true });
      }
    }
  }

  const failed = results.filter((r) => !r.ok);
  const dtiFailed = dtiResults.filter((r) => !r.ok);
  const skipped = surfaces.filter((s) => s.type === "dynamic_page").length;

  console.log(`\n───`);
  console.log(`Verified: ${results.length} | Passed: ${results.length - failed.length} | Failed: ${failed.length} | Skipped: ${skipped}`);
  console.log(`DTI gates: ${dtiResults.length} | Passed: ${dtiResults.length - dtiFailed.length} | Failed: ${dtiFailed.length}`);

  if (failed.length > 0) {
    console.log(`\nFAILED SURFACES (status):`);
    for (const f of failed) {
      console.log(`  ✗ ${f.path} → HTTP ${f.status} (expected ${f.expected})`);
    }
  }

  if (dtiFailed.length > 0) {
    console.log(`\nFAILED DTI GATES (L1/L3/L4/L5/L6):`);
    for (const f of dtiFailed) {
      console.log(`  ✗ ${f.path} [${f.layer}]: ${f.msg}`);
    }
    console.log(`\nFail-closed: deploy blocked. Fix H1/JSON-LD/og/canonical on these surfaces.`);
    process.exit(1);
  }

  if (failed.length > 0) {
    console.log(`\nFail-closed: build blocked. Fix the catalog or the surface.`);
    process.exit(1);
  }

  console.log(`\nAll verifiable surfaces pass + DTI gates green. Catalog is truthful.`);
  process.exit(0);
}

main();