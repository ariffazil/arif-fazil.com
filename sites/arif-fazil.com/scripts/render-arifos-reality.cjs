#!/usr/bin/env node
/**
 * render-arifos-reality.cjs — build-time server-render of the /arifos/ reality block.
 *
 * WEBSITE-REALITY-COMPILER v1 (2026-10-02, kimi-code/FI-008).
 *
 * WHY: the /arifos/ Observatory page ships "unavailable / source: missing"
 * placeholders that only the client JS fills after hydration. A crawler, LLM,
 * or text browser therefore saw an EMPTY-SHELL reality while the JSON snapshot
 * was rich — browser-with-JS and crawler realities disagreed.
 *
 * WHAT: fetches the live signed Observatory snapshot, then server-renders a
 * static HTML block into public/arifos/index.html (between REALITY:BEGIN/END
 * markers) carrying: observed_at, source_commit, deployed_commit,
 * artifact_drift, capabilities proven/declared, highest_unknown (highest-
 * severity OPEN finding), and receipt verification state. The existing
 * hydrating dashboard is untouched and wraps around it.
 *
 * STALE PATH: if the snapshot endpoint is unreachable at build time, the block
 * is emitted from the last cached values (public/arifos/.reality-cache.json)
 * with a STALE marker + timestamp — never blank, never "unavailable".
 *
 * Run: node scripts/render-arifos-reality.cjs   (wired as the first prebuild step)
 * Exit: 0 always (stale path keeps the build alive); inspect stdout for state.
 */

const fs = require("fs");
const path = require("path");

const SITE_DIR = path.resolve(__dirname, "..");
const TARGET = path.join(SITE_DIR, "public/arifos/index.html");
const CACHE = path.join(SITE_DIR, "public/arifos/.reality-cache.json");
const SNAPSHOT_URL =
  process.env.ARIFOS_SNAPSHOT_URL || "https://arifos.arif-fazil.com/api/observatory/v1/snapshot";
const FETCH_TIMEOUT_MS = 10_000;

const BEGIN = "<!-- REALITY:BEGIN rendered by scripts/render-arifos-reality.cjs — do not edit by hand -->";
const END = "<!-- REALITY:END -->";

// severity order for "highest unknown / most severe OPEN finding"
const SEVERITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function val(f) {
  // Observatory fields are {value, state, source, observed_at, confidence}
  if (f == null || typeof f !== "object") return { value: f ?? null, state: "unknown" };
  return f;
}

function extract(snap) {
  const ri = snap.runtime_identity || {};
  const drift = val(ri.drift).value || {};
  const cap = snap.capabilities || {};
  const rec = snap.receipts || {};

  // highest-severity OPEN finding = the honest "highest_unknown"
  const findings = (snap.findings && Array.isArray(snap.findings.findings) ? snap.findings.findings : [])
    .filter((f) => (f.status || "").toUpperCase() === "OPEN")
    .sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9));
  const top = findings[0] || null;
  const highestUnknown = top
    ? `${top.id || "?"} (${top.severity}, OPEN) — ${top.description || top.category || "no description"}`
    : "none declared in snapshot";

  return {
    observed_at: snap.observed_at || null,
    snapshot_id: snap.snapshot_id || null,
    signature_state: (snap.signature && snap.signature.state) || null,
    source_commit: val(ri.source_commit).value,
    deployed_commit: val(ri.deployed_commit).value,
    artifact_drift: typeof drift === "object" && drift !== null ? drift.artifact ?? JSON.stringify(drift) : String(drift),
    capabilities_declared: cap.declared_count ?? null,
    capabilities_proven_live: cap.proven_live_count ?? null,
    capabilities_invocable: cap.invocable_count ?? null,
    highest_unknown: highestUnknown,
    receipt_state: {
      snapshot_receipt: val(rec.snapshot_receipt).value,
      issuer_claim: val(rec.issuer_claim).value,
      head_seq: val(rec.head_seq).value,
      signature_verified: val(rec.signature_verified).value,
      chain_verified: val(rec.chain_verified).value,
      replay_verified: val(rec.replay_verified).value,
    },
  };
}

async function fetchSnapshot() {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
  try {
    const r = await fetch(SNAPSHOT_URL, {
      signal: ctl.signal,
      headers: { "User-Agent": "arifOS-render-arifos-reality/1.0 (build-time server-render)" },
    });
    clearTimeout(t);
    if (!r.ok) return { ok: false, error: `HTTP ${r.status}` };
    return { ok: true, snap: await r.json() };
  } catch (e) {
    clearTimeout(t);
    return { ok: false, error: e.message };
  }
}

function renderBlock(d, meta) {
  const drift = typeof d.artifact_drift === "string" ? d.artifact_drift : JSON.stringify(d.artifact_drift);
  const rows = [
    ["observed_at", d.observed_at ?? "NOT_MEASURED"],
    ["snapshot", d.snapshot_id ?? "NOT_MEASURED"],
    ["signature", d.signature_state ?? "NOT_MEASURED"],
    ["source_commit", d.source_commit ?? "NOT_MEASURED"],
    ["deployed_commit", d.deployed_commit ?? "NOT_MEASURED"],
    ["artifact_drift", drift],
    [
      "capabilities",
      `${d.capabilities_proven_live ?? "?"}/${d.capabilities_declared ?? "?"} proven live · ${d.capabilities_invocable ?? "?"} invocable`,
    ],
    ["highest_unknown", d.highest_unknown ?? "NOT_MEASURED"],
    [
      "receipts",
      `snapshot=${d.receipt_state?.snapshot_receipt ?? "?"} · issuer=${d.receipt_state?.issuer_claim ?? "?"} · head_seq=${d.receipt_state?.head_seq ?? "?"} · signature_verified=${d.receipt_state?.signature_verified ?? "unknown"} · chain_verified=${d.receipt_state?.chain_verified ?? "?"} · replay_verified=${d.receipt_state?.replay_verified ?? "?"}`,
    ],
  ];
  const staleBanner = meta.stale
    ? `<p class="observatory-meta" data-stale="true">⚠ STALE — build could not reach ${esc(meta.source)} at ${esc(meta.generated_at)}; showing last-known values from ${esc(meta.fetched_at || "unknown cache time")}. No JavaScript required to read this.</p>`
    : `<p class="observatory-meta">Server-rendered at build time from ${esc(meta.source)} · fetched ${esc(meta.generated_at)} · no JavaScript required to read this. Hydrating dashboard below refreshes it live.</p>`;

  const html = `
${BEGIN}
<section id="build-reality" aria-label="Server-rendered reality block (no JavaScript required)" data-stale="${meta.stale ? "true" : "false"}" style="margin:1rem auto 1.5rem;max-width:1080px;padding:0 1.5rem;">
  <div class="observatory-meta" style="font:600 .68rem/1.4 var(--font-mono);letter-spacing:.08em;text-transform:uppercase;">BUILD-TIME REALITY — crawler-visible, zero JS</div>
  ${staleBanner}
  <div class="observatory-upgrade-grid">
${rows
  .map(
    ([k, v]) =>
      `    <div class="observatory-field"><span class="k">${esc(k)}</span><div class="v">${esc(v)}</div></div>`,
  )
  .join("\n")}
  </div>
  <script type="application/json" id="reality-block-json">${JSON.stringify({ ...d, _meta: meta })}</script>
</section>
${END}`;
  return html;
}

async function main() {
  let html;
  try {
    html = fs.readFileSync(TARGET, "utf8");
  } catch (e) {
    console.error(`[arifos-reality] FATAL: cannot read ${TARGET}: ${e.message}`);
    process.exit(2);
  }

  const res = await fetchSnapshot();
  let data;
  let meta;

  if (res.ok) {
    data = extract(res.snap);
    meta = {
      stale: false,
      source: SNAPSHOT_URL,
      generated_at: new Date().toISOString(),
      fetched_at: new Date().toISOString(),
      snapshot_id: data.snapshot_id,
    };
    try {
      fs.writeFileSync(CACHE, JSON.stringify({ ...data, _meta: meta }, null, 2) + "\n");
    } catch (e) {
      console.warn(`[arifos-reality] WARN: cache write failed: ${e.message}`);
    }
    console.log(`[arifos-reality] snapshot OK (${data.snapshot_id}, observed_at=${data.observed_at})`);
  } else {
    let cached = null;
    try {
      cached = JSON.parse(fs.readFileSync(CACHE, "utf8"));
    } catch {
      /* no cache */
    }
    if (cached) {
      const { _meta, ...fields } = cached;
      data = fields;
      meta = {
        stale: true,
        source: SNAPSHOT_URL,
        generated_at: new Date().toISOString(),
        fetched_at: _meta && _meta.fetched_at,
        error: res.error,
      };
      console.warn(`[arifos-reality] fetch FAILED (${res.error}) — using last-known cache from ${_meta && _meta.fetched_at} with STALE marker`);
    } else {
      data = {
        observed_at: null,
        snapshot_id: null,
        signature_state: null,
        source_commit: null,
        deployed_commit: null,
        artifact_drift: "NOT_MEASURED_THIS_BUILD",
        capabilities_declared: null,
        capabilities_proven_live: null,
        capabilities_invocable: null,
        highest_unknown: "NOT_MEASURED_THIS_BUILD (snapshot unreachable, no cache present)",
        receipt_state: null,
      };
      meta = {
        stale: true,
        source: SNAPSHOT_URL,
        generated_at: new Date().toISOString(),
        fetched_at: null,
        error: res.error,
      };
      console.warn(`[arifos-reality] fetch FAILED (${res.error}) and NO CACHE — emitting NOT_MEASURED block with STALE marker (never blank)`);
    }
  }

  const block = renderBlock(data, meta);
  let out;
  if (html.includes(BEGIN) && html.includes(END)) {
    const start = html.indexOf(BEGIN);
    const end = html.indexOf(END) + END.length;
    out = html.slice(0, start) + block + html.slice(end);
  } else {
    // first injection — right after the opening <body> tag so it is the first
    // crawler-visible content, ahead of the JS-driven shell
    const m = /<body[^>]*>/i.exec(html);
    if (!m) {
      console.error("[arifos-reality] FATAL: no <body> tag found");
      process.exit(2);
    }
    out = html.slice(0, m.index + m[0].length) + "\n" + block + html.slice(m.index + m[0].length);
  }

  fs.writeFileSync(TARGET, out, "utf8");
  console.log(`[arifos-reality] reality block ${res.ok ? "rendered fresh" : "rendered STALE"} → ${path.relative(SITE_DIR, TARGET)}`);
}

main();
