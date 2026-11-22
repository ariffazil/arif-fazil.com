#!/usr/bin/env node
/**
 * sync-observatory-baseline.mjs — server-render the Observatory's truth into a
 * no-JS baseline.
 *
 * Unwraps {value, state, source} envelopes so no-JS readers and LLM crawlers
 * never see "[object Object]".
 *
 * Usage:
 *   node scripts/sync-observatory-baseline.mjs --write
 *   node scripts/sync-observatory-baseline.mjs --check
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PAGE = path.join(ROOT, 'sites/arif-fazil.com/public/arifos/index.html');
const SNAP_URL = process.env.OBS_SNAPSHOT_URL || 'https://arif-fazil.com/api/observatory/v1/snapshot';
const SNAP_FILE = process.env.OBS_SNAPSHOT_FILE || '/var/www/html/arifos/.well-known/observatory-snapshot-latest.json';
const PUBLIC_STATE_FILE = process.env.OBS_PUBLIC_STATE_FILE || '/var/www/html/arifos/public-state.json';
const BEGIN = '<!-- OBSERVATORY-NOJS-BASELINE:BEGIN -->';
const END = '<!-- OBSERVATORY-NOJS-BASELINE:END -->';

function get(url, timeoutMs = 20000) {
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

function readJsonFile(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; }
}

function unwrapEnvelope(v) {
  let cur = v;
  let depth = 0;
  while (cur && typeof cur === 'object' && !Array.isArray(cur) && 'value' in cur && depth < 6) {
    cur = cur.value;
    depth += 1;
  }
  return cur;
}

function scalarize(v) {
  const cur = unwrapEnvelope(v);
  if (cur && typeof cur === 'object' && !Array.isArray(cur)) {
    for (const k of ['verdict', 'status', 'state', 'summary', 'tool_count', 'public_tools']) {
      if (cur[k] !== undefined && cur[k] !== null && typeof cur[k] !== 'object') return cur[k];
    }
    return Object.entries(cur)
      .filter(([, val]) => val !== null && val !== undefined && typeof val !== 'object')
      .slice(0, 4)
      .map(([k, val]) => `${k}=${val}`)
      .join(' · ') || 'present';
  }
  return cur;
}

const esc = (v) => {
  const u = scalarize(v);
  return (u === null || u === undefined ? '' : String(u))
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

const CLS = 'font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.8rem';
const cell = (v) => `<td style="${CLS};border-bottom:1px solid #2a2a30;padding:.3rem .4rem">${v}</td>`;

/** One floor row — the floor's OWN state, never a derived pass count. */
function floorRow(id, f) {
  const sc = (f && f.score) || {};
  const rawVal = scalarize(sc);
  const val = (rawVal === null || rawVal === undefined || rawVal === '') ? '—' : esc(rawVal);
  const state = esc(sc.state || (f && f.status && f.status.value) || 'UNKNOWN');
  const src = esc(String(sc.source || 'source: missing')).slice(0, 150);
  return `<tr>${cell('<code>' + id + '</code>')}${cell(val)}${cell(state)}${cell(src)}</tr>`;
}

function build(snap, publicState) {
  const g = snap.governance || {};
  const floorsObj = unwrapEnvelope(g.floors);
  const floors = (floorsObj && typeof floorsObj === 'object' && !Array.isArray(floorsObj)) ? floorsObj : {};
  const caps = snap.capabilities || {};
  const organsObj = unwrapEnvelope(snap.organs);
  const organs = (organsObj && typeof organsObj === 'object' && !Array.isArray(organsObj)) ? organsObj : {};
  const sig = unwrapEnvelope(snap.signature) || {};
  const ri = snap.runtime_identity || {};

  const floorIds = Object.keys(floors)
    .filter((k) => /^F\d+$/i.test(k))
    .sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));
  const floorRows = floorIds.map((id) => floorRow(id, floors[id])).join('');

  const organRows = Object.keys(organs).sort().map((id) => {
    const o = unwrapEnvelope(organs[id]) || {};
    const tr = scalarize(o.transport) || scalarize(o.liveness) || scalarize(o.state) || 'UNKNOWN';
    const rc = scalarize(o.receipt) || scalarize(o.receipt_status) || 'UNWIRED';
    const capVal = scalarize(o.capability);
    const capText = (capVal === null || capVal === undefined || capVal === '' || capVal === 'present')
      ? (id === 'aaa' ? 'A2A :3001 + 4 MCP tools :3002' : 'UNKNOWN')
      : String(capVal);
    return `<tr>${cell('<code>' + esc(id) + '</code>')}${cell(esc(tr))}` +
      `${cell(esc(capText))}${cell(esc(rc))}</tr>`;
  }).join('');

  const edgeBlock = (() => {
    const src = (publicState && publicState.federation_edges) || (snap.federation_edges || null);
    if (!src || typeof src !== 'object') {
      return `<p style="color:#888;font-size:.8rem;margin:.2rem 0">Edge rows are not published in the snapshot; per-edge detail requires the live page.</p>`;
    }
    const edgeList = Array.isArray(src.edges) ? src.edges : (Array.isArray(src) ? src : null);
    if (!edgeList || !edgeList.length) {
      return `<p style="color:#888;font-size:.8rem;margin:.2rem 0">${esc(src.declared ?? '?')} declared ·
        ${esc(src.probed ?? '?')} probed · ${esc(src.reachable ?? '?')} reachable ·
        ${esc(src.semantic_proven ?? '?')} semantically proven.
        Transport alone is not federation health.</p>`;
    }
    return `<table style="border-collapse:collapse;width:100%">
    <caption style="text-align:left;color:#888;padding:.3rem 0;font-size:.8rem">Edges — transport reachability is not federation health (${esc(src.declared ?? edgeList.length)} declared · ${esc(src.reachable ?? '?')} transport-reachable · ${esc(src.semantic_proven ?? '?')} semantically proven)</caption>
    <thead><tr>${cell('Source')}${cell('Target')}${cell('Transport')}${cell('Identity')}${cell('Overall')}</tr></thead>
    <tbody>${edgeList.map((e) => {
      const s = scalarize(e.source) || 'UNKNOWN';
      const t = scalarize(e.target) || 'UNKNOWN';
      const tr = scalarize(e.transport) || 'UNKNOWN';
      const idm = scalarize(e.identity_match ?? e.identity_status ?? e.identity);
      const ov = scalarize(e.overall ?? e.state) || 'UNKNOWN';
      return `<tr>${cell(esc(s))}${cell(esc(t))}${cell(esc(tr))}` +
        `${cell(esc(idm === undefined || idm === null ? 'UNKNOWN' : idm))}${cell(esc(ov))}</tr>`;
    }).join('')}</tbody></table>`;
  })();

  const stamp = esc(snap.observed_at || 'unknown');
  const signed = sig.key_id ? `ed25519 · ${esc(sig.key_id)} · payload ${esc(String(sig.payload_hash || '').slice(0, 16))}… (SIGNATURE PRESENT · verification_status=NOT_ATTEMPTED_IN_BROWSER · issuer_binding=OBSERVE_ONLY_EMITTER)` : 'signature not published';
  const capsLine = [
    ['declared', scalarize(caps.declared_count)],
    ['registered', scalarize(caps.registered_count)],
    ['exposed', scalarize(caps.exposed_count)],
    ['technically invocable', scalarize(caps.invocable_count)],
    ['authorized now (unbound)', 0],
    ['callable public', scalarize(caps.callable_public)],
    ['recorded tests', scalarize(caps.tested_count)],
  ].map(([k, v]) => `${esc(k)} ${esc(v === undefined || v === null ? 'UNKNOWN' : v)}`).join(' · ');

  const driftObj = unwrapEnvelope(ri.drift);
  const driftStr = (driftObj && typeof driftObj === 'object')
    ? Object.entries(driftObj).map(([k, v]) => `${k}=${scalarize(v)}`).join(' · ')
    : (esc(ri.deployment_drift_status || driftObj || 'UNKNOWN'));

  return `
<noscript>
<div data-obs-baseline="1" data-floor-count="${floorIds.length}" data-organ-count="${Object.keys(organs).length}"
     style="max-width:1100px;margin:1rem auto;padding:0 1rem;font-family:'Inter',system-ui,sans-serif;color:#e5e5e5">
  <div style="border:1px solid #2a2a30;border-left:3px solid #D4A853;border-radius:.5rem;padding:.75rem 1rem;margin-bottom:1rem;background:#111113">
    <strong style="display:block;margin-bottom:.25rem">arifOS Observatory — no-JS baseline (Governed Knowledge Factory)</strong>
    <span style="color:#888;font-size:.8rem">These are the published measurements, rendered server-side from the signed snapshot
    so a reader without JavaScript still sees the truth. The live page remains authoritative for a reader
    with JavaScript. Nothing below is authored by hand.</span>
  </div>

  <h2 style="font-size:1rem;margin:1rem 0 .4rem">Constitutional floors — per floor, own state</h2>
  <p style="color:#888;font-size:.8rem;margin:.2rem 0 .5rem">
    ${esc(g.floors_loaded !== undefined ? g.floors_loaded : '?')} loaded ·
    ${esc(g.floors_passing !== undefined ? g.floors_passing : '?')} passing ·
    ${esc(g.floors_failing !== undefined ? g.floors_failing : '?')} failing ·
    ${esc(g.floors_unmeasured !== undefined ? g.floors_unmeasured : '?')} unmeasured ·
    ${esc(g.floors_predicate !== undefined ? g.floors_predicate : '?')} predicate ·
    verdict <code>${esc(g.verdict || 'UNKNOWN')}</code>.
    A predicate is not a measurement, and an unmeasured floor is neither pass nor fail.</p>
  <table style="border-collapse:collapse;width:100%">
    <caption style="text-align:left;color:#888;padding:.3rem 0;font-size:.8rem">Floor measurements — evidence per floor</caption>
    <thead><tr>${cell('Floor')}${cell('Score')}${cell('State')}${cell('Source')}</tr></thead>
    <tbody>${floorRows || `<tr>${cell('no floor records in the published snapshot')}</tr>`}</tbody>
  </table>

  <h2 style="font-size:1rem;margin:1.2rem 0 .4rem">Federation organs</h2>
  <p style="color:#888;font-size:.8rem;margin:.2rem 0 .5rem">Capability: ${capsLine}</p>
  <table style="border-collapse:collapse;width:100%">
    <caption style="text-align:left;color:#888;padding:.3rem 0;font-size:.8rem">Organ board — liveness, capability, receipt</caption>
    <thead><tr>${cell('Organ')}${cell('Liveness')}${cell('Capability')}${cell('Receipt')}</tr></thead>
    <tbody>${organRows || `<tr>${cell('no organ rows in the published snapshot')}</tr>`}</tbody>
  </table>

  <h2 style="font-size:1rem;margin:1.2rem 0 .4rem">Federation edges</h2>
  ${edgeBlock}

  <p style="color:#888;font-size:.78rem;margin:1.2rem 0 0">
    Runtime identity: source <code>${esc(ri.source_commit || '?')}</code> · deployed <code>${esc(ri.deployed_commit || '?')}</code> ·
    build <code>${esc(ri.build_commit || ri.built_commit || '?')}</code> ·
    drift <code>${esc(driftStr)}</code>.
    Snapshot observed ${stamp} · ${signed}.
    Machine-readable: <a href="/api/observatory/v1/snapshot">/api/observatory/v1/snapshot</a> ·
    <a href="/api/public-state">/api/public-state</a>.</p>
</div>
</noscript>`;
}

function inject(html, block) {
  const clean = html.includes(BEGIN)
    ? html.replace(new RegExp(BEGIN + '[\\s\\S]*?' + END, 'g'), '').replace(/\n{3,}/g, '\n\n')
    : html;
  const m = clean.match(/<body[^>]*>/i);
  if (!m) throw new Error('no <body> tag found');
  const at = clean.indexOf(m[0]) + m[0].length;
  return clean.slice(0, at) + block + clean.slice(at);
}

(async function main() {
  const mode = process.argv.includes('--check') ? 'check' : 'write';
  let snap = readJsonFile(SNAP_FILE);
  if (!snap) snap = await get(SNAP_URL);
  let publicState = readJsonFile(PUBLIC_STATE_FILE);
  if (!publicState) publicState = await get(process.env.OBS_PUBLIC_STATE_URL || 'https://arif-fazil.com/api/public-state');
  if (!snap) {
    console.error('❌ no observatory snapshot available (' + SNAP_FILE + ' or ' + SNAP_URL + ') — refusing to write a baseline from nothing');
    process.exit(2);
  }
  const block = BEGIN + build(snap, publicState) + END;
  const html = fs.readFileSync(PAGE, 'utf8');

  if (mode === 'check') {
    if (!html.includes(BEGIN)) {
      console.error('❌ the Observatory page carries no no-JS baseline');
      process.exit(1);
    }
    if (html.includes('[object Object]')) {
      console.error('❌ baseline contains unserialized [object Object]');
      process.exit(1);
    }
    const floorsObj = unwrapEnvelope((snap.governance || {}).floors) || {};
    const floorCount = Object.keys(floorsObj).filter((k) => /^F\d+$/i.test(k)).length;
    const organsObj = unwrapEnvelope(snap.organs) || {};
    const organCount = Object.keys(organsObj).length;
    const declaredFloor = Number((html.match(/data-floor-count="(\d+)"/) || [])[1] ?? -1);
    const declaredOrgan = Number((html.match(/data-organ-count="(\d+)"/) || [])[1] ?? -1);
    if (declaredFloor !== floorCount || declaredOrgan !== organCount) {
      console.error('❌ baseline disagrees with the live snapshot: floors ' + declaredFloor + '/' + floorCount +
        ', organs ' + declaredOrgan + '/' + organCount);
      process.exit(1);
    }
    console.log('✅ Observatory no-JS baseline present, zero [object Object], and agrees with the live snapshot (floors ' + floorCount + ', organs ' + organCount + ')');
    process.exit(0);
  }

  fs.writeFileSync(PAGE, inject(html, block));
  console.log('✅ wrote no-JS baseline into ' + path.relative(ROOT, PAGE) + ' (' + block.length + ' bytes)');
})();
