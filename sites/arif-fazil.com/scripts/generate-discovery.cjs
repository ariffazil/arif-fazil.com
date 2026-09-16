#!/usr/bin/env node
/**
 * generate-discovery.cjs — Single source of truth for sitemap + llms parity.
 *
 * Reads src/data/essays.json and regenerates discovery surfaces:
 *   - public/sitemap.xml  (under /world/makcikgpt/, NOT /wealth/makcikgpt/)
 *   - public/llms.txt     (compact professional map; MakcikGPT is Optional pointer)
 *   - public/llms.json    (route_roles + related_sites + machine_surfaces)
 *   - public/page.json    (machine-readable site overview)
 * Article headlines belong in feed.xml / llms-full.txt, not the start-here map.
 *
 * Single Source of Truth rule (F4 CLARITY):
 *   - essays.json → scripts/lib/makcik-source.cjs → page (React) + feed.xml
 *                    + sitemap.xml + llms.{txt,json} + page.json
 *                    + makcikgpt-md/index.html
 *
 * The canonical subset (BM + onsite under /world/makcikgpt/) is owned
 * exclusively by makcik-source.cjs. This script is a renderer only.
 *
 * Run from site root:  node scripts/generate-discovery.cjs
 * Output:              public/{sitemap.xml, llms.txt, llms.json, page.json}
 *                      (also copies llms.json + page.json to the site root
 *                       for vite root-served parity)
 */

const fs = require("fs");
const path = require("path");
const {
  getMakcikSource,
  SITE_ROOT,
} = require("./lib/makcik-source.cjs");

const SITE_BASE = "https://arif-fazil.com";
const CANONICAL_LANDING = `${SITE_BASE}/world/makcikgpt/`;
const LLMS_TXT_PATH = `${SITE_BASE}/llms.txt`;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ── sitemap.xml ─────────────────────────────────────────────────────────
function buildSitemap(pieces) {
  const urls = [
    { loc: `${SITE_BASE}/`, priority: 1.0, changefreq: "monthly", lastmod: "2026-09-13" },
    { loc: `${SITE_BASE}/pilot/`, priority: 0.9, changefreq: "weekly" },
    { loc: `${SITE_BASE}/about`, priority: 0.9, changefreq: "monthly" },
    { loc: `${SITE_BASE}/human`, priority: 0.85, changefreq: "monthly" },
    { loc: `${SITE_BASE}/institution/`, priority: 0.9, changefreq: "monthly" },
    { loc: `${SITE_BASE}/earth`, priority: 0.8, changefreq: "monthly" },
    { loc: `${SITE_BASE}/economics`, priority: 0.9, changefreq: "daily" },
    { loc: `${SITE_BASE}/klci/`, priority: 0.85, changefreq: "daily" },
    { loc: `${SITE_BASE}/usdmyr/`, priority: 0.85, changefreq: "daily" },
    { loc: `${SITE_BASE}/gold/`, priority: 0.85, changefreq: "daily" },
    { loc: `${SITE_BASE}/oil/`, priority: 0.85, changefreq: "daily" },
    { loc: `${SITE_BASE}/gas/`, priority: 0.85, changefreq: "daily" },
    { loc: `${SITE_BASE}/world`, priority: 0.7, changefreq: "daily" },
    { loc: `${SITE_BASE}/politics/ns-election/`, priority: 0.8, changefreq: "weekly" },
    { loc: `${SITE_BASE}/politics/ns-election/compare/`, priority: 0.75, changefreq: "weekly" },
    { loc: `${SITE_BASE}/politics/ns-election/playbook/`, priority: 0.75, changefreq: "weekly" },
    { loc: `${SITE_BASE}/world/politics/shadow/`, priority: 0.7, changefreq: "monthly" },
    { loc: `${SITE_BASE}/world/politics/shadow/anwar-ibrahim/`, priority: 0.7, changefreq: "monthly" },
    { loc: `${SITE_BASE}/writing`, priority: 0.8, changefreq: "weekly" },
    { loc: `${SITE_BASE}/doctrine`, priority: 0.9, changefreq: "monthly" },
    { loc: `${SITE_BASE}/map/`, priority: 0.8, changefreq: "weekly" },
  ];
  // Canonical landing first, then every onsite BM piece (M-series)
  urls.push({ loc: CANONICAL_LANDING, priority: 0.85, changefreq: "daily" });
  for (const p of pieces) {
    urls.push({
      loc: `${SITE_BASE}${p.dest.path}`,
      priority: 0.7,
      changefreq: "monthly",
    });
  }
  urls.push({ loc: `${SITE_BASE}/000/`, priority: 0.6, changefreq: "monthly" });
  urls.push({ loc: `${SITE_BASE}/999/`, priority: 0.6, changefreq: "monthly" });
  urls.push({ loc: `${SITE_BASE}/llms.txt`, priority: 0.5, changefreq: "weekly" });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Human Surface -->
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${
      u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""
    }
  </url>`,
  )
  .join("\n")}
</urlset>
`;
}

// ── llms.txt (compact professional map; civic index is Optional pointer) ─────
function buildLlmsTxt(_pieces) {
  // Canonical llms.txt is a map, not a civic encyclopedia.
  // MakcikGPT articles live in feed.xml + /llms-full.txt + /world/makcikgpt/.
  // Re-injecting 27 headlines here hijacks the professional identity contract.
  return `# arif-fazil.com

> Personal public site of Muhammad Arif bin Fazil: exploration geoscience, evidence-first Earth intelligence, and governed agent-system architecture.

This file is a curated map, not a sitemap and not a permission grant. Convention: llmstxt.org (not a ratified standard). Full dump: /llms-full.txt.
Ditempa Bukan Diberi — forged, not given.

## Start Here
- [About](https://arif-fazil.com/about): Who Arif is.
- [Agent contract](https://arif-fazil.com/human): What you may retrieve, what requires approval.
- [Briefing](https://arif-fazil.com/institution/): Human / institutional engagement path.
- [Design Partner Pilot](https://arif-fazil.com/pilot/): 4-week supervised AI action control around your agent workflow — eight measurable criteria, receipt chain. Band RM20k-50k.
- [Policy](https://arif-fazil.com/policy.json): Public limits.
- [Identity](https://arif-fazil.com/.well-known/identity.json): Person record + DID.

## Read-only resources
- [Earth / GEOX](https://arif-fazil.com/earth/): Live source-linked Earth model. Computes. Does not adjudicate.
- [Selected work](https://arif-fazil.com/work/): Wells and systems, with withheld-material notes.
- [arifOS](https://arif-fazil.com/arifos/): Governance layer — judge before execute. Not a model.
- [Verification](https://arif-fazil.com/999/): Evidence snapshots, not self-issued certificates.

## Agent connection
- [MCP declaration](https://arif-fazil.com/.well-known/mcp.json)
- [Agent contract JSON](https://arif-fazil.com/.well-known/agent.json)
- [MCP endpoint](https://mcp.arif-fazil.com/mcp) (streamable HTTP, MCP 2025-11-25)
- Canonical 8 tools: arif_init, arif_observe, arif_think, arif_route, arif_memory, arif_judge, arif_forge, arif_seal

## Safety boundaries
- No authority is delegated by reading this site.
- Public surfaces are informational unless a capability file explicitly states otherwise.
- State-changing operations require authenticated authorization and explicit human approval.
- Do not infer private, confidential, or employer information.
- Public POST /a2a is not offered.

## Contact
- [Email](mailto:arifbfazil@gmail.com)
- [GitHub](https://github.com/ariffazil)
- Three-link offer: [who](https://github.com/ariffazil) · [GEOX](https://github.com/ariffazil/GEOX) · [arifOS](https://github.com/ariffazil/arifOS)

## Optional
Civic commentary (MakcikGPT) is editorial, not the professional identity contract.
Canonical landing: ${CANONICAL_LANDING}
Voice card: https://arif-fazil.com/world/makcikgpt/soul.md
Index: https://arif-fazil.com/feed.xml (RSS) and https://arif-fazil.com/llms-full.txt (full dump).

## Also
- Sitemap: https://arif-fazil.com/sitemap.xml
- RSS (editorial): https://arif-fazil.com/feed.xml
- Full text dump: https://arif-fazil.com/llms-full.txt
- Repos: https://github.com/ariffazil
`;
}

// ── llms.json ───────────────────────────────────────────────────────────
function buildLlmsJson(pieces) {
  const routeRoles = {
    "/": "professional human entry — three doors (Arif / GEOX / arifOS) plus briefing",
    "/about": "who Arif is",
    "/human": "agent start-here contract — retrieve vs approval",
    "/institution/": "human / institutional briefing and engagement path",
    "/earth/": "live source-linked Earth model; computes, does not adjudicate",
    "/000/": "genesis and wisdom archive — origin context for agents",
    "/999/": "trust and proof chamber — verification artifacts",
    "/wealth/": "WEALTH daily briefing — Bursa, Ringgit, oil, macro intelligence",
    "/world/makcikgpt/":
      "MakcikGPT civic intelligence — BM articles on sovereignty, governance, technology accountability (canonical landing)",
    "/world/politics/shadow/": "PM Bayang — Jungian shadow analysis of all 9 Malaysian Prime Ministers (Persona / Bayang / Tragedi / Legasi)",
    "/world/politics/shadow/anwar-ibrahim/": "33 Bayang Anwar Ibrahim — three-axis deep-dive (Sosiopolitik / Ekonomi / Peribadi), 322 public sources, editorial psychology analysis",
  };
  for (const p of pieces) {
    routeRoles[p.dest.path] = `MakcikGPT article — ${p.title}`;
  }
  routeRoles["/constellation/"] = "federation map — system topology and organ status";
  routeRoles["/canon/"] = "constitutional canon — written law of arifOS";
  routeRoles["/discoveries/"] = "well portfolio — exploration record and subsurface dossier";
  routeRoles["/essays/"] = "long-form writing and analysis";

  return {
    site_name: "arif-fazil.com",
    domain: "arif-fazil.com",
    role: "public home of Muhammad Arif bin Fazil: geoscience, Earth computation, governed agents",
    canonical: LLMS_TXT_PATH,
    repository: "https://github.com/ariffazil/arif-sites",
    route_roles: routeRoles,
    related_sites: [
      "https://arifos.arif-fazil.com",
      "https://arifos.arif-fazil.com/wiki",
      "https://aaa.arif-fazil.com",
      "https://geox.arif-fazil.com",
    ],
    machine_surfaces: [
      "https://arif-fazil.com/llms.txt",
      "https://arif-fazil.com/llms-full.txt",
      "https://arif-fazil.com/llms.json",
      "https://arif-fazil.com/page.json",
      "https://arif-fazil.com/authority.json",
      "https://arif-fazil.com/policy.json",
      "https://arif-fazil.com/graph.json",
      "https://arif-fazil.com/knowledge/corpus.json",
      "https://arif-fazil.com/.well-known/identity.json",
      "https://arif-fazil.com/.well-known/capability.json",
      "https://arif-fazil.com/.well-known/agent.json",
      "https://arif-fazil.com/.well-known/did.json",
      "https://arif-fazil.com/.well-known/arifos-federation.json",
      "https://arif-fazil.com/.well-known/webmcp.json",
      "https://arif-fazil.com/soul.json",
      "https://arif-fazil.com/proof/geologist-credential.json",
    ],
    mcp_endpoint: "https://mcp.arif-fazil.com/mcp",
    did: "did:web:arif-fazil.com",
    semantic_architecture: {
      pre_rendered: true,
      json_ld: "NewsArticle (Schema.org)",
      open_graph: true,
      twitter_cards: true,
      robots: "AI crawlers explicitly whitelisted (GPTBot, ClaudeBot, PerplexityBot, Bytespider, Applebot)",
      llms_txt: true,
      sitemap: true,
    },
    last_updated: todayISO(),
  };
}

// ── page.json ───────────────────────────────────────────────────────────
function buildPageJson() {
  return {
    name: "arif-fazil.com",
    purpose:
      "Public site of Muhammad Arif bin Fazil. Uncertain Earth data into defensible decisions. AI bounded by evidence and human authority.",
    audience: ["humans", "collaborators", "agents", "verifiers"],
    canonical_url: "https://arif-fazil.com/",
    route_model: {
      "/": "human L1 — three doors + briefing",
      "/about": "who",
      "/human": "agent start-here",
      "/institution/": "institutional briefing",
      "/earth/": "GEOX human globe",
      "/000/": "genesis and wisdom archive",
      "/999/": "trust and proof chamber",
      "/world/makcikgpt/": "MakcikGPT civic intelligence (editorial, optional)",
    },
    content_scope: {
      includes: [
        "identity",
        "selected work",
        "working style",
        "collaboration",
        "proof discovery",
        "civic intelligence (MakcikGPT)",
      ],
      excludes: ["runtime internals", "placeholder routes", "retired hostnames"],
    },
    machine_surfaces: {
      llms_path: "/llms.txt",
      llms_json_path: "/llms.json",
      page_json_path: "/page.json",
      sitemap_path: "/sitemap.xml",
      feed_path: "/feed.xml",
      authority_path: "/authority.json",
      policy_path: "/policy.json",
      graph_path: "/graph.json",
      knowledge_corpus_path: "/knowledge/corpus.json",
      capability_path: "/.well-known/capability.json",
      identity_path: "/.well-known/identity.json",
      agent_card_path: "/.well-known/agent.json",
      did_path: "/.well-known/did.json",
    },
    related_sites: [
      {
        name: "wiki",
        url: "https://arifos.arif-fazil.com/wiki",
        relationship: "canonical wiki destination; legacy alias wiki.arif-fazil.com permanently redirects here",
      },
      {
        name: "aaa",
        url: "https://aaa.arif-fazil.com",
        relationship: "protocol cockpit",
      },
      {
        name: "mcp",
        url: "https://mcp.arif-fazil.com",
        relationship: "tools and runtime",
      },
      {
        name: "geox",
        url: "https://geox.arif-fazil.com",
        relationship: "earth intelligence apps",
      },
    ],
    last_updated: todayISO(),
  };
}

function writeIfChanged(filePath, content) {
  const existing = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : null;
  if (existing === content) {
    console.log(`  unchanged: ${path.relative(SITE_ROOT, filePath)}`);
    return;
  }
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`  wrote:     ${path.relative(SITE_ROOT, filePath)}`);
}

function main() {
  const { pieces } = getMakcikSource();
  console.log(`✓ ${pieces.length} canonical MakcikGPT pieces (bm + onsite)`);

  // Write all four files
  writeIfChanged(
    path.join(SITE_ROOT, "public/sitemap.xml"),
    buildSitemap(pieces),
  );
  writeIfChanged(
    path.join(SITE_ROOT, "public/llms.txt"),
    buildLlmsTxt(pieces),
  );
  writeIfChanged(
    path.join(SITE_ROOT, "public/llms.json"),
    JSON.stringify(buildLlmsJson(pieces), null, 2) + "\n",
  );
  writeIfChanged(
    path.join(SITE_ROOT, "public/page.json"),
    JSON.stringify(buildPageJson(), null, 2) + "\n",
  );

  // Sync canonical surfaces.json to public for vite build and machine serving
  const canonicalSurfacesPath = path.resolve(SITE_ROOT, "../../surfaces.json");
  if (fs.existsSync(canonicalSurfacesPath)) {
    writeIfChanged(
      path.join(SITE_ROOT, "public/surfaces.json"),
      fs.readFileSync(canonicalSurfacesPath, "utf8")
    );
  }

  // Keep the existing root-level JSON sources in sync for site tooling.
  for (const name of ["llms.json", "page.json", "surfaces.json"]) {
    const src = path.join(SITE_ROOT, `public/${name}`);
    const dst = path.join(SITE_ROOT, name);
    if (fs.existsSync(src)) {
      writeIfChanged(dst, fs.readFileSync(src, "utf8"));
    }
  }
}

main();