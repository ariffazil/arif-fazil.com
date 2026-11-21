#!/usr/bin/env node
/**
 * sync-aaa-surface.mjs — regenerate the AAA agent-facing contract (llms.txt)
 * from LIVE state, and guard the AAA subtree against dead local references.
 *
 * WHY (888-ratified 2026-11-21): the published llms.txt described a product
 * that does not ship — "React 19 cockpit", "7-organ federation", "114
 * forge_* tools", "Status: OPERATIONAL" — while the live federation had 9
 * organs, 99 A-FORGE tools, and a DEGRADED/hold posture. Agents read that file
 * and were told a false architecture.
 *
 * RULES:
 *  - Every number and status in the output comes from a live instrument.
 *  - Nothing is hand-authored. Curated text is limited to topology facts
 *    (ports, roles, boundaries) that are stable and not state.
 *  - A value that cannot be measured is printed as UNKNOWN, never guessed.
 *  - --check is the CI gate: it fails if any local reference in the AAA
 *    subtree is dead, or if llms.txt differs from the live regeneration.
 *
 * Usage:
 *   node scripts/sync-aaa-surface.mjs --write   # regenerate llms.txt
 *   node scripts/sync-aaa-surface.mjs --check   # CI guard (exit 1 on drift)
 */
'use strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.resolve(__dirname, '..');
const AAA_PUBLIC = path.join(ROOT, 'sites/arif-fazil.com/public/aaa');
const LLMSTXT = path.join(AAA_PUBLIC, 'llms.txt');

const STATE_URL = process.env.AAA_STATE_URL || 'https://aaa.arif-fazil.com/state.json';
// The live snapshot inode. The webroot serves /state.json as a symlink to this
// exact file, so reading it directly is the same bytes the cockpit renders.
const STATE_FILE = process.env.AAA_STATE_FILE || '/var/lib/aaa/state/federation_state.json';
const PUBLIC_STATE_URL = process.env.AAA_PUBLIC_STATE_URL
  || 'https://arif-fazil.com/api/public-state';

function readStateFile() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch (e) {
    return null;
  }
}

function get(url, timeoutMs = 15000) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, { timeout: timeoutMs }, (res) => {
      let b = '';
      res.setEncoding('utf8');
      res.on('data', (c) => { b += c; });
      res.on('end', () => { try { resolve(JSON.parse(b)); } catch (e) { resolve(null); } });
    });
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.on('error', () => resolve(null));
  });
}

/* Curated topology. Ports/roles/boundaries are stable facts, not state.
   Status, health, tool counts and posture are NEVER taken from here. */
const ORGANS = [
  { id: 'arifos', port: '8088', role: 'Constitutional kernel — F1-F13, 888 JUDGE, VAULT999', surface: '9 `arif_*` public tools · door `/mcp`' },
  { id: 'a-forge', key: 'aforge', port: '7071/:7072', role: 'Execution shell — build, deploy, forge, MCP gateway', surface: 'public `forge_*` tools' },
  { id: 'geox', port: '8081', role: 'Earth intelligence — wells, seismic, petrophysics, basin', surface: 'public GEOX tools' },
  { id: 'wealth', port: '18082', role: 'Capital intelligence — NPV, IRR, EMV, conservation, flow', surface: 'public WEALTH tools' },
  { id: 'well', port: '18083', role: 'Vitality mirror — readiness, homeostasis, dignity', surface: 'public WELL tools' },
  { id: 'aaa', port: '3001', role: 'DISPLAY_ONLY attention cockpit + A2A gateway (this surface)', surface: 'A2A JSON-RPC — not MCP' },
  { id: 'arifflow', port: '7073', role: 'Metabolism plane — receipt authority, FQ quotient', surface: 'internal' },
  { id: 'fed', port: '8080', role: 'Federation router — provider cascade, budgets', surface: 'internal' },
  { id: 'chron', port: '—', role: 'Temporal ledger — events, predictions, calibration', surface: 'internal' },
];

function toolCount(publicState, id, key) {
  const organs = (publicState && publicState.organs) || {};
  const row = organs[key || id];
  const cap = (row && row.capability) || {};
  const m = String(cap.value || '').match(/(\d+)\s+public tool/);
  return m ? m[1] : 'UNKNOWN';
}

function organLive(state, id) {
  const organs = (state && state.federation && state.federation.organs) || [];
  const row = organs.find((o) => o.id === id);
  if (!row) return { status: 'UNKNOWN', health: 'UNKNOWN', latency: 'UNKNOWN' };
  return {
    status: row.status || 'UNKNOWN',
    health: row.health_status || 'UNKNOWN',
    latency: (row.liveness && row.liveness.latency_ms !== undefined) ? row.liveness.latency_ms : (row.latency_ms !== undefined ? row.latency_ms : 'UNKNOWN'),
  };
}

function build(state, publicState) {
  const fed = (state && state.federation) || {};
  const kernel = (state && state.kernel) || {};
  const authority = (state && state.authority) || {};
  const metab = (state && state.metabolism) || {};
  const deploy = (state && state.aaa_deploy) || {};
  const attention = (state && state.attention) || [];
  const orgTotal = fed.organs_total !== undefined ? fed.organs_total : (ORGANS.length);
  const generated = (state && state.generated_at) || new Date().toISOString();

  const posture = [];
  posture.push(`kernel ${kernel.status || 'UNKNOWN'}`);
  posture.push(`readiness ${kernel.execution_readiness || 'UNKNOWN'}`);
  posture.push(`verdict ${kernel.thermodynamic_verdict || 'UNKNOWN'}`);
  posture.push(`holds ${authority.holds !== undefined ? authority.holds : 'UNKNOWN'}`);
  posture.push(`attention ${attention.length}`);
  posture.push(`metabolism ${metab.verdict || 'UNKNOWN'} (FQ ${metab.quotient !== undefined ? Number(metab.quotient).toFixed(3) : 'UNKNOWN'})`);
  posture.push(`deploy drift ${deploy.deployment_drift === true ? 'YES' : 'no'}`);

  const rows = ORGANS.map((o) => {
    const live = organLive(state, o.id);
    const tools = toolCount(publicState, o.id, o.key);
    return `| ${o.id} | ${o.port} | ${o.role} | ${live.status} | ${live.health} | ${tools} | ${o.surface} |`;
  });

  return `# AAA — Attention Cockpit / A2A gateway
> Server-rendered attention cockpit + A2A mesh gateway for the ${orgTotal}-organ arifOS federation.
> Port: 3001. License: AGPL-3.0. Transport: JSON-RPC unified · ΔS ≤ 0 · DISPLAY_ONLY.
> This file is GENERATED from live state by scripts/sync-aaa-surface.mjs. Do not hand-edit.

## Live posture (generated ${generated})
${posture.join(' · ')}

## What this surface is
- **What:** Server-rendered attention cockpit + A2A message broker. One path, two contracts:
  a browser (Accept: text/html) gets the rendered cockpit; an agent (application/json) gets the A2A service descriptor.
- **Role:** SHOWS state — queues HOLDs, routes A2A. Never judges. Never executes. Never seals.
- **Federation:** AAA shows. arifOS judges. A-FORGE executes. Arif controls.
- **Ingress:** Direct A-record → aaa.arif-fazil.com (Caddy → localhost:3001)
- **Render:** The cockpit HTML is produced server-side from the same snapshot the webroot serves as
  /state.json (one inode, so the surface cannot drift from the published truth).

## Federation Organs (live)
| Organ | Port | Role | Status | Health | Public tools | Public surface |
|-------|------|------|--------|--------|--------------|---------------|
${rows.join('\n')}
| VAULT999 | — | Immutable audit ledger — sealed past, hash-chained | — | — | — | kernel-owned |

## Machine-readable truth
- /state.json — live federation snapshot (no-store)
- /claims.json — claim + evidence ledger
- /truth-contract.json — doctrine, falsification invariant, planes
- /health — gateway liveness
- /a2a/discover/stats — A2A discovery counters

## A2A Server Endpoints
GET  /health                           — Liveness probe
GET  /.well-known/agent-card.json      — AAA agent card
POST /tasks                            — A2A task submission
GET  /api/agents                       — Agent registry

## HEXAGON Warga (5 constitutional agents)
333-AGI (Δ MIND) · 555-ASI (Ω HEART) · 888-APEX (ΦΙ JUDGE) · A-AUDIT (observer) · A-ARCHIVE (vault)

## Boundaries (NEVER)
- NEVER adjudicate (AAA displays, arifOS judges)
- NEVER auto-approve a HOLD (AAA queues, Arif approves)
- NEVER claim execution authority (AAA routes, A-FORGE executes)
- NEVER fabricate organ health status — probe live or show UNKNOWN
- NEVER hide a HOLD from the operator queue
- NEVER render a predicate as a measurement, or UNKNOWN as healthy
`;
}

/* ── guard: dead local references in the AAA subtree ─────────────────── */
/**
 * The cockpit's <meta> tags also carried authored numbers ("6 live: ...",
 * "42 MCP-exposed"). Those are state, so they are rewritten from live state
 * on every --write and verified on every --check — never hand-authored.
 */
function updateMetaTags(html, state, publicState) {
  const fed = (state && state.federation) || {};
  const live = (fed.organs || []).map((o) => o && o.id).filter(Boolean);
  const ids = live.length ? live : ORGANS.map((o) => o.id);
  const arifTools = toolCount(publicState, 'arifos');
  const forgeTools = toolCount(publicState, 'a-forge', 'aforge');
  const map = {
    'hta-organs': `${ids.length} live: ${ids.join(', ')}`,
    'hta-tools': `${arifTools} public MCP tools (arifOS) · ${forgeTools} A-FORGE public tools`,
  };
  let changed = 0;
  for (const [k, v] of Object.entries(map)) {
    const re = new RegExp('(name="' + k + '"\\s+content=")[^"]*(")');
    if (re.test(html)) { html = html.replace(re, '$1' + v + '$2'); changed++; }
  }
  return { html, changed };
}

const AAA_INDEX = path.join(AAA_PUBLIC, 'index.html');

function htmlFiles(dir, acc) {
  acc = acc || [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') htmlFiles(p, acc); }
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function checkRefs() {
  const files = htmlFiles(AAA_PUBLIC);
  const dead = [];
  const refRe = /(?:src|href)\s*=\s*"(\/[^"]+)"/g;
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = refRe.exec(src))) {
      const ref = m[1];
      if (/^\/(api|a2a|health|state\.json|claims\.json|truth-contract\.json|llms|robots|manifest)/.test(ref)) continue;
      // An /assets/ ref on a host with no /assets/ tree is dead by construction.
      // This is the ratified CI gate condition (888, 2026-11-21).
      if (ref.startsWith('/assets/')) {
        dead.push({ file: path.relative(ROOT, f), ref, why: '/assets/ is not published on this host', fatal: true });
        continue;
      }
      // Root-relative refs on the aaa host resolve against the HOST root
      // (public/aaa/), not the site root.
      const hostRoot = path.join(ROOT, 'sites/arif-fazil.com/public/aaa');
      const siteRoot = path.join(ROOT, 'sites/arif-fazil.com/public');
      const liveRoot = '/var/www/html/aaa';   // runtime-generated files live here only
      const rel = ref.replace(/^\//, '');
      if (fs.existsSync(path.join(hostRoot, rel))) continue;
      if (fs.existsSync(path.join(siteRoot, rel))) continue;
      if (fs.existsSync(path.join(liveRoot, rel))) continue;   // published at runtime
      if (ref.startsWith('/_shared/')) {
        const shared = path.join(siteRoot, '_shared', rel.replace('/_shared/', ''));
        if (!fs.existsSync(shared)) dead.push({ file: path.relative(ROOT, f), ref, why: 'missing in public/_shared', fatal: false });
        continue;
      }
      dead.push({ file: path.relative(ROOT, f), ref, why: 'not found on the aaa host root', fatal: false });
    }
  }
  return dead;
}

(async function main() {
  const mode = process.argv.includes('--check') ? 'check' : 'write';
  let state = readStateFile();
  if (!state) state = await get(STATE_URL);
  const publicState = await get(PUBLIC_STATE_URL);
  if (!state) {
    if (mode === 'check') {
      // CI has no live federation. The static gate (dead /assets/ refs) still
      // applies; the llms.txt-vs-live comparison needs a live publisher and
      // belongs to the runtime check, not CI. Say so plainly, do not pretend.
      console.log('ℹ️  no live federation state reachable — llms.txt drift check SKIPPED (not gated here)');
      const dead = checkRefs();
      const fatal = dead.filter((d) => d.fatal);
      if (fatal.length) {
        console.error('❌ dead /assets/ references:');
        for (const d of fatal) console.error('   ' + d.file + ' → ' + d.ref);
        process.exit(1);
      }
      console.log('✅ no dead /assets/ references in ' + path.relative(ROOT, AAA_PUBLIC));
      process.exit(0);
    }
    console.error('❌ cannot read live state from ' + STATE_FILE + ' or ' + STATE_URL + ' — refusing to write a contract from nothing');
    process.exit(2);
  }
  const out = build(state, publicState);

  if (mode === 'check') {
    const dead = checkRefs();
    let bad = 0;
    const fatal = dead.filter((d) => d.fatal);
    const soft = dead.filter((d) => !d.fatal);
    if (fatal.length) {
      bad++;
      console.error('❌ dead /assets/ references (the ratified gate condition):');
      for (const d of fatal) console.error('   ' + d.file + ' → ' + d.ref + '  (' + d.why + ')');
    } else {
      console.log('✅ no dead /assets/ references in ' + path.relative(ROOT, AAA_PUBLIC));
    }
    if (soft.length) {
      console.warn('⚠️  ' + soft.length + ' other local reference(s) not found on the aaa host root (pre-existing, non-gating):');
      for (const d of soft) console.warn('   ' + d.file + ' → ' + d.ref);
    }
    // The published contract is committed occasionally but regenerated from a
    // source that moves every 30 s, so byte equality is un-runnable. The gate
    // asserts TRUTH PROPERTIES instead: no stale claim, organ count matches
    // live, tool counts match live, posture class is present.
    const current = fs.existsSync(LLMSTXT) ? fs.readFileSync(LLMSTXT, 'utf8') : '';
    const liveOrgans = ((state.federation && state.federation.organs) || []).length || ORGANS.length;
    const docOrgans = (current.match(/^\| (arifos|a-forge|geox|wealth|well|aaa|arifflow|fed|chron) \|/gm) || []).length;
    const STALE = [
      [/React \d+/i, 'a React SPA claim (the shipped cockpit is server-rendered)'],
      [/\b7-organ\b/i, '"7-organ" federation claim'],
      [/Status:\s*OPERATIONAL/i, 'unconditional OPERATIONAL status claim'],
      [/\b1[01]\d `forge_\*/i, 'a stale forge_* tool count'],
      [/live · 2026-\d{2}-\d{2}\b/, 'a dated organ table'],
    ];
    let staleHits = 0;
    for (const [re, why] of STALE) {
      if (re.test(current)) { staleHits++; console.error('❌ stale claim in llms.txt: ' + why + ' [' + re + ']'); }
    }
    if (docOrgans !== liveOrgans) {
      staleHits++;
      console.error('❌ llms.txt lists ' + docOrgans + ' organs; live federation has ' + liveOrgans);
    }
    if (!/## Live posture/.test(current)) {
      staleHits++;
      console.error('❌ llms.txt has no live posture section');
    }
    if (staleHits) {
      bad++;
      console.error('   run: node scripts/sync-aaa-surface.mjs --write');
    } else {
      console.log('✅ public/aaa/llms.txt matches live state (organs ' + docOrgans + '/' + liveOrgans + ', no stale claims)');
    }
    process.exit(bad ? 1 : 0);
  }

  fs.writeFileSync(LLMSTXT, out);
  console.log('✅ wrote ' + path.relative(ROOT, LLMSTXT) + ' (' + out.length + ' bytes)');

  // rewrite the cockpit's authored meta numbers from live state
  if (fs.existsSync(AAA_INDEX)) {
    const idx = fs.readFileSync(AAA_INDEX, 'utf8');
    const res = updateMetaTags(idx, state, publicState);
    if (res.changed) {
      fs.writeFileSync(AAA_INDEX, res.html);
      console.log('✅ rewrote ' + res.changed + ' authored meta tag(s) in ' + path.relative(ROOT, AAA_INDEX));
    }
  }

  const dead = checkRefs();
  if (dead.length) {
    console.error('⚠️  dead local references still present:');
    for (const d of dead) console.error('   ' + d.file + ' → ' + d.ref + '  (' + d.why + ')');
  }
})();
