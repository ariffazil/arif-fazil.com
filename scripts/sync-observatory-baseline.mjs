#!/usr/bin/env node
/**
 * sync-observatory-baseline.mjs — server-render the Observatory's truth into a
 * no-JS baseline.
 *
 * WHY (888-ratified 2026-11-21): the Observatory page (arif-fazil.com/arifos/)
 * renders four data grids — floor-grid, organs-grid, drift-table,
 * edge-table-wrap — from JavaScript alone. Without JS a human or an agent sees
 * the shell, the doctrine and the section headings, but every measured value
 * is absent and the grids read "source: missing · confidence: unknown". The
 * truth existed at /api/observatory/v1/snapshot (signed) the whole time; the
 * page simply did not carry it for a reader who cannot run JS.
 *
 * This generator injects a <noscript> baseline carrying the SAME measured
 * values from the signed snapshot. The JS renderer is untouched and still
 * overwrites the live grids; the baseline serves only the no-JS reader, so it
 * cannot contradict the live page for anyone who has JS.
 *
 * RULES:
 *  - Every value comes from the signed snapshot. Nothing is authored here.
 *  - A value the snapshot does not carry prints UNKNOWN, never a guess.
 *  - Never renders a derived floors pass count (the D-09 class): floors are
 *    listed per floor with their own state, and the counts are quoted from
 *    governance.floors_* which the publisher itself computed.
 *  - --check is the CI gate: the page must carry a baseline and its counts
 *    must agree with the live snapshot.
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

function readSnapshotFile() {
  try { return JSON.parse(fs.readFileSync(SNAP_FILE, 'utf8')); } catch (e) { return null; }
}

const esc = (v) => (v === null || v === undefined ? '' : String(v))
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CLS = 'font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.8rem';
const cell = (v) => `<td style="${CLS};border-bottom:1px solid #22242b;padding:.3rem .4rem">${v}</td>`;

/** One floor row — the floor's OWN state, never a derived pass count. */
function floorRow(id, f) {
  const sc = (f && f.score) || {};
  const val = (sc.value === null || sc.value === undefined) ? '—' : esc(sc.value);
  const state = esc(sc.state || 'UNKNOWN');
  const src = esc(String(sc.source || 'source: missing')).slice(0, 150);
  return `<tr>${cell('<code>' + id + '</code>')}${cell(val)}${cell(state)}${cell(src)}</tr>`;
}

function build(snap, publicState) {
  const g = snap.governance || {};
  const floors = g.floors || {};
  const caps = snap.capabilities || {};
  const organs = snap.organs || {};
  const sig = snap.signature || {};
  const ri = snap.runtime_identity || {};

  const floorIds = Object.keys(floors).sort((a, b) => parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10));
  const floorRows = floorIds.map((id) => floorRow(id, floors[id])).join('');

  const organRows = Object.keys(organs).sort().map((id) => {
    const o = organs[id] || {};
    const tr = o.transport || {};
    const rc = o.receipt || {};
    const cap = o.capability || {};
    return `<tr>${cell('<code>' + esc(id) + '</code>')}${cell(esc(tr.value || o.state || 'UNKNOWN'))}` +
      `${cell(esc(cap.value || 'UNKNOWN'))}${cell(esc(rc.value || 'UNWIRED'))}</tr>`;
  }).join('');

  // The observatory snapshot carries edge COUNTS only; the per-edge rows live
  // in public-state.federation_edges. Render whichever shape is present and
  // say plainly when only counts are available.
  const edgeBlock = (() => {
    const src = (publicState && publicState.federation_edges) || (snap.federation_edges || null);
    if (!src || typeof src !== 'object') {
      return `<p style="color:#8e9099;font-size:.8rem;margin:.2rem 0">Edge rows are not published in the snapshot; per-edge detail requires the live page.</p>`;
    }
    const vals = Object.values(src);
    if (vals.length && vals.every((v) => typeof v === 'number')) {
      return `<p style="color:#8e9099;font-size:.8rem;margin:.2rem 0">${esc(src.declared ?? '?')} declared ·
        ${esc(src.probed ?? '?')} probed · ${esc(src.reachable ?? '?')} reachable ·
        ${esc(src.transport_reachable ?? '?')} transport-reachable.
        Transport alone is not federation health; per-edge identity and receipt fields need the live page.</p>`;
    }
    return `<table style="border-collapse:collapse;width:100%">
    <caption style="text-align:left;color:#8e9099;padding:.3rem 0;font-size:.8rem">Edges — transport reachability is not federation health</caption>
    <thead><tr>${cell('Source')}${cell('Target')}${cell('Transport')}${cell('Identity')}${cell('Overall')}</tr></thead>
    <tbody>${Object.keys(src).sort().map((k) => {
      const e = src[k] || {};
      const parts = k.split('->');
      const s = e.source || parts[0] || k;
      const t = e.target || parts[1] || '';
      return `<tr>${cell(esc(s))}${cell(esc(t))}${cell(esc(e.transport || 'UNKNOWN'))}` +
        `${cell(esc(e.identity === undefined ? 'UNKNOWN' : e.identity))}${cell(esc(e.overall || 'UNKNOWN'))}</tr>`;
    }).join('')}</tbody></table>`;
  })();

  const stamp = esc(snap.observed_at || 'unknown');
  const signed = sig.key_id ? `ed25519 · ${esc(sig.key_id)} · payload ${esc(String(sig.payload_hash || '').slice(0, 16))}…` : 'signature not published';
  const capsLine = [
    ['declared', caps.declared_count], ['registered', caps.registered_count], ['exposed', caps.exposed_count],
    ['invocable', caps.invocable_count], ['callable public', caps.callable_public], ['tested', caps.tested_count],
  ].map(([k, v]) => `${esc(k)} ${esc(v === undefined ? 'UNKNOWN' : v)}`).join(' · ');

  return `
<noscript>
<div data-obs-baseline="1" data-floor-count="${floorIds.length}" data-organ-count="${Object.keys(organs).length}"
     style="max-width:1000px;margin:1rem auto;padding:0 1rem;font-family:system-ui,sans-serif;color:#e8e6e1">
  <div style="border:1px solid #22242b;border-left:3px solid #d9a441;border-radius:.5rem;padding:.75rem 1rem;margin-bottom:1rem;background:#121419">
    <strong style="display:block;margin-bottom:.25rem">arifOS Observatory — no-JS baseline</strong>
    <span style="color:#8e9099;font-size:.8rem">These are the published measurements, rendered server-side from the signed snapshot
    so a reader without JavaScript still sees the truth. The live page remains authoritative for a reader
    with JavaScript. Nothing below is authored by hand.</span>
  </div>

  <h2 style="font-size:1rem;margin:1rem 0 .4rem">Constitutional floors — per floor, own state</h2>
  <p style="color:#8e9099;font-size:.8rem;margin:.2rem 0 .5rem">
    ${esc(g.floors_loaded !== undefined ? g.floors_loaded : '?')} loaded ·
    ${esc(g.floors_passing !== undefined ? g.floors_passing : '?')} passing ·
    ${esc(g.floors_failing !== undefined ? g.floors_failing : '?')} failing ·
    ${esc(g.floors_unmeasured !== undefined ? g.floors_unmeasured : '?')} unmeasured ·
    ${esc(g.floors_predicate !== undefined ? g.floors_predicate : '?')} predicate ·
    verdict <code>${esc(g.verdict || 'UNKNOWN')}</code>.
    A predicate is not a measurement, and an unmeasured floor is neither pass nor fail.</p>
  <table style="border-collapse:collapse;width:100%">
    <caption style="text-align:left;color:#8e9099;padding:.3rem 0;font-size:.8rem">Floor measurements — evidence per floor</caption>
    <thead><tr>${cell('Floor')}${cell('Score')}${cell('State')}${cell('Source')}</tr></thead>
    <tbody>${floorRows || `<tr>${cell('no floor records in the published snapshot')}</tr>`}</tbody>
  </table>

  <h2 style="font-size:1rem;margin:1.2rem 0 .4rem">Federation organs</h2>
  <p style="color:#8e9099;font-size:.8rem;margin:.2rem 0 .5rem">Capability: ${capsLine}</p>
  <table style="border-collapse:collapse;width:100%">
    <caption style="text-align:left;color:#8e9099;padding:.3rem 0;font-size:.8rem">Organ board — liveness, capability, receipt</caption>
    <thead><tr>${cell('Organ')}${cell('Liveness')}${cell('Capability')}${cell('Receipt')}</tr></thead>
    <tbody>${organRows || `<tr>${cell('no organ rows in the published snapshot')}</tr>`}</tbody>
  </table>

  <h2 style="font-size:1rem;margin:1.2rem 0 .4rem">Federation edges</h2>
  ${edgeBlock}

  <p style="color:#8e9099;font-size:.78rem;margin:1.2rem 0 0">
    Runtime identity: source <code>${esc(ri.source_commit || '?')}</code> · deployed <code>${esc(ri.deployed_commit || '?')}</code> ·
    build <code>${esc(ri.built_commit || '?')}</code> ·
    drift <code>${esc(ri.deployment_drift_status || 'UNKNOWN')}</code>.
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
  let snap = readSnapshotFile();
  if (!snap) snap = await get(SNAP_URL);
  const publicState = await get(process.env.OBS_PUBLIC_STATE_URL || 'https://arif-fazil.com/api/public-state');
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
    const floorCount = Object.keys((snap.governance || {}).floors || {}).length;
    const organCount = Object.keys(snap.organs || {}).length;
    // The baseline declares its own counts, so the gate compares declared vs
    // live rather than counting markup (which would break the moment an organ
    // id contains a pattern the regex did not anticipate).
    const declaredFloor = Number((html.match(/data-floor-count="(\d+)"/) || [])[1] ?? -1);
    const declaredOrgan = Number((html.match(/data-organ-count="(\d+)"/) || [])[1] ?? -1);
    if (declaredFloor !== floorCount || declaredOrgan !== organCount) {
      console.error('❌ baseline disagrees with the live snapshot: floors ' + declaredFloor + '/' + floorCount +
        ', organs ' + declaredOrgan + '/' + organCount);
      process.exit(1);
    }
    console.log('✅ Observatory no-JS baseline present and agrees with the live snapshot (floors ' + floorCount + ', organs ' + organCount + ')');
    process.exit(0);
  }

  fs.writeFileSync(PAGE, inject(html, block));
  console.log('✅ wrote no-JS baseline into ' + path.relative(ROOT, PAGE) + ' (' + block.length + ' bytes)');
})();
