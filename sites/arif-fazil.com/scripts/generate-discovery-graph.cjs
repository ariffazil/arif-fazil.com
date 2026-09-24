#!/usr/bin/env node
/**
 * generate-discovery-graph.cjs — Federation Discovery Layer v2 (F13 direction 2026-09-24).
 *
 * Emits:
 *   public/discovery/index.json — one-traversal graph: identity, authority,
 *     governance, capabilities (dengan why + edges + if_down), relationships,
 *     boundaries, endpoints, surfaces, traversal.
 *   public/discovery/index.html — MUKA MANUSIA. Fetches index.json + /status.json
 *     client-side (live health semasa dilawat, zero backend). No-JS fallback:
 *     kerangka statik tetap terbaca.
 *
 * Doctrine: "Website → Living Registry → Federation Discovery Surface → Reality Model
 * → Constitutional Interface". v2 menambah apa yang v1 tiha: EDGES (hubungan organ),
 * CONSEQUENCE (if_down), WHY (kenapa wujud), dan live map manusia.
 *
 * Metabolism: dipasang dalam prebuild chain — setiap build regenerate.
 * Honesty (F2): keadaan kesihatan TIDAK dibakar; halaman memfetch /status.json.
 * Peranan/hubungan cermin topology yang diratifikasi (AGENTS.md, Caddyfile, doktrin
 * musyawarah, separation of powers). Tiada keupayaan dihebahkan tanpa endpoint boleh diperhati.
 */

const fs = require("fs");
const path = require("path");

const SITE = "https://arif-fazil.com";
const OUT_DIR = path.join(__dirname, "..", "public", "discovery");
const generated_at = new Date().toISOString();

// ── Registry mesin-verified: MCP tools/list semasa build ───────────────
// Kernel = stateless; geox/wealth/well = initialize handshake.
// Timeout pendek + kegagalan direkod jujur ("unreachable at build") — build tak pernah gagal kerana organ down.
async function mcpTools(url) {
  const H = { "Content-Type": "application/json", "Accept": "application/json, text/event-stream" };
  const parse = (raw) => {
    let txt = raw;
    for (const line of raw.split("\n")) if (line.startsWith("data:")) { txt = line.slice(5).trim(); break; }
    return JSON.parse(txt);
  };
  const post = async (body, sid) => {
    const h = { ...H }; if (sid) h["Mcp-Session-Id"] = sid;
    const r = await fetch(url, { method: "POST", headers: h, body: JSON.stringify(body), signal: AbortSignal.timeout(9000) });
    return { json: parse(await r.text()), sid: r.headers.get("mcp-session-id") };
  };
  // cuba stateless dahulu (kernel)
  try {
    const { json } = await post({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} });
    const t = json?.result?.tools;
    if (Array.isArray(t)) return t;
  } catch (_) { /* jatuh ke handshake */ }
  const init = await post({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "discovery-gen", version: "1.0" } } });
  if (!init.sid) throw new Error("no session");
  await post({ jsonrpc: "2.0", method: "notifications/initialized" }, init.sid).catch(() => {});
  const tl = await post({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }, init.sid);
  const tools = tl.json?.result?.tools;
  if (!Array.isArray(tools)) throw new Error("tools/list gagal");
  return tools;
}

async function buildRegistry() {
  const sources = {
    arifos: "https://mcp.arif-fazil.com/mcp",
    geox: "https://geox.arif-fazil.com/mcp",
    wealth: "https://wealth.arif-fazil.com/mcp",
    well: "https://well.arif-fazil.com/mcp",
  };
  const organs = {};
  for (const [id, url] of Object.entries(sources)) {
    try {
      const tools = await mcpTools(url);
      organs[id] = {
        verified: true,
        count: tools.length,
        tools: tools.map(t => ({ name: t.name, desc: (t.description || "").split("\n")[0].slice(0, 90) })),
      };
    } catch (e) {
      organs[id] = { verified: false, note: "unreachable at build: " + String(e.message || e).slice(0, 60) };
    }
  }
  return {
    $schema: "arif-discovery-registry-v1",
    note: "Snapshot MACHINE-VERIFIED melalui MCP tools/list semasa build. Bukan senarai tangan. Organ down = direkod jujur.",
    generated_at,
    source_protocol: "MCP JSON-RPC 2.0 (kernel stateless; domain organs via initialize handshake)",
    organs,
    total_verified: Object.values(organs).filter(o => o.verified).reduce((a, o) => a + o.count, 0),
  };
}

const capabilities = [
  {
    id: "arifos", name: "arifOS Kernel", kind: "kernel",
    role: "Constitutional kernel — governance, sessions, floors, memory, MCP gateway",
    why: "Wujud supaya kuasa mutasi tidak pernah berada tanpa lantai perlembagaan — setiap tindakan boleh diadili, dibatalkan, dan disaksi.",
    depends_on: [],
    if_down: "Federation bertukar READ-ONLY: MCP gateway, /health, judge dan seal gagal — organ domain masih hidup tetapi tiada arbitrase; F13 tetap berdaulat.",
    endpoints: { mcp: "https://mcp.arif-fazil.com/mcp", health: "https://arifos.arif-fazil.com/health", observatory: "https://arifos.arif-fazil.com/" },
  },
  {
    id: "aaa", name: "AAA", kind: "coordination",
    role: "Federation state plane — agent cockpit, registry, A2A gateway, MCP tool explorer",
    why: "Wujud supaya identiti dan laluan ejen berdaftar di satu tempat — bukan tersebar dalam ingatan sesiapa.",
    depends_on: ["arifos"],
    if_down: "Ejen baru tidak dapat berdaftar atau ber-A2A; routing manual menjadi beban Arif semula (attention tax naik).",
    endpoints: { site: "https://aaa.arif-fazil.com/", a2a: "https://aaa.arif-fazil.com/a2a/", health: "https://aaa.arif-fazil.com/health" },
    boundary: "Public A2A 404 di apex; delegasi + pendaftaran perlukan kelulusan manusia",
  },
  {
    id: "a-forge", name: "A-FORGE", kind: "execution",
    role: "Execution shell — governed execution, sandboxes, forge pipeline",
    why: "Wujud supaya 'digital = mudah, irreversible = tahan (hold)' ada tempat kebenaran berlaku — eksekusi selepas SEAL, bukan selepas ghairah.",
    depends_on: ["arifos"],
    if_down: "Tiada eksekusi terkawal baru; kerja ejen berhenti di peringkat cadangan (HOLD selamanya).",
    endpoints: { site: "https://forge.arif-fazil.com/" },
    boundary: "Eksekusi bergated-resit; tindakan irreversible tahan di 888",
  },
  {
    id: "geox", name: "GEOX", kind: "domain-organ",
    role: "Earth intelligence — basin reasoning, seismic interpretation, petrophysics, paleo",
    why: "Wujud kerana realiti fizikal (batuan, kedalaman, fizik gelombang) mesti mengikat naratif — hukum batu & enjin.",
    depends_on: ["arifos"],
    if_down: "Taakulan bumi/seismik berhenti; laman /earth dan laluan geox hilang; keputusan E&P kembali kepada ingatan manusia sahaja.",
    endpoints: { mcp: "https://geox.arif-fazil.com/mcp", site: "https://geox.arif-fazil.com/", surface: `${SITE}/geox/`, health: "https://geox.arif-fazil.com/health" },
    boundary: "GEOX mengira; tidak mengadili",
  },
  {
    id: "well", name: "WELL", kind: "domain-organ",
    role: "Sovereign homeostasis — triadic state (human × machine × governance), vitality substrate",
    why: "Wujud supaya kesediaan (readiness) diukur, bukan dirasa — manusia × mesin × tadbiran dalam satu nadi.",
    depends_on: ["arifos"],
    if_down: "Tiada nadi triadic; drift kesediaan tidak dikesan sehingga menjadi kerosakan.",
    endpoints: { mcp: "https://well.arif-fazil.com/mcp", site: "https://well.arif-fazil.com/", health: "https://well.arif-fazil.com/health" },
    boundary: "WELL mencadang; arifOS mengadili (pemisahan kuasa)",
  },
  {
    id: "wealth", name: "WEALTH", kind: "domain-organ",
    role: "Sovereign capital & market synthesis — deductive computation, power topology",
    why: "Wujud supaya modal dan kuasa dihitung secara deduktif dengan resit — bukan rekaan naratif.",
    depends_on: ["arifos"],
    if_down: "Terminal gold/oil/gas/klci/usdmyr dan taakulan modal berhenti; radar fiskal buta.",
    endpoints: { mcp: "https://wealth.arif-fazil.com/mcp", site: "https://wealth.arif-fazil.com/", health: "https://wealth.arif-fazil.com/health" },
    boundary: "Analyst ≠ Judge — WEALTH menasihat; arifOS berarbitrasi",
  },
  {
    id: "arifflow", name: "arifFlow", kind: "substrate",
    role: "Metabolic ledger — FlowReceipts, FQ (verify/execute) telemetry",
    why: "Wujud supaya setiap langkah meninggalkan resit — kerja tanpa resit ialah longgokan peristiwa, bukan lejar.",
    depends_on: [],
    if_down: "FQ tidak boleh diukur; metabolisme (verify vs execute) hilang kaca mata — burn tak kelihatan.",
    endpoints: { pulse: `${SITE}/999/flow` },
  },
  {
    id: "frame", name: "FRAME", kind: "substrate",
    role: "Independent observer — drift detection, behavioural telemetry",
    why: "Wujud supaya ada mata luar sistem — bukti, bukan kelicinan diri sendiri.",
    depends_on: [],
    if_down: "Drift tidak diperhatikan secara bebas; entropi senyap menang.",
    boundary: "OBSERVATIONAL_ONLY — bukti, bukan verdik; tiada permukaan awam secara reka bentuk",
  },
  {
    id: "hermes", name: "HERMES", kind: "domain-organ",
    role: "Language & social organ — claim validation, contradiction scan, voice law",
    why: "Wujud supaya ayat tentang manusia dan institusi disaring sebelum dihebahkan — maruah sebelum utiliti.",
    depends_on: [],
    if_down: "Tuntutan tidak disahkan silang; kontradaksi bersembunyi dalam naratif.",
    endpoints: { site: "https://hermes.arif-fazil.com/" },
  },
];

const relationships = [
  { type: "proposes→judges", from: ["geox", "wealth", "well"], to: "arifos", note: "Organ domain mencadang; kernel mengadili (separation of powers)" },
  { type: "sealed-execution", from: ["a-forge"], to: "arifos", note: "A-FORGE hanya melaksana selepas SEAL kernel — digital mudah, irreversible tahan" },
  { type: "routes", from: ["aaa"], to: "*", note: "AAA ialah satah routing/registry — pintu koordinasi ejen" },
  { type: "metabolizes", from: ["arifflow"], to: "*", note: "Setiap langkah organ meninggalkan FlowReceipt" },
  { type: "observes", from: ["frame"], to: "*", note: "FRAME memerhati semua — bukti sahaja, tidak pernah verdik" },
  { type: "sovereign-ratifies", from: ["F13 (Arif)"], to: "arifos", note: "Veto manusia mutlak — kuasa terakhir di luar mesin" },
];

const graph = {
  $schema: "arif-discovery-v3",
  note: "Federation discovery graph v3. Satu traversal: identity, authority, governance, capabilities (why + edges + if_down), relationships, boundaries, endpoints, REGISTRY MESIN-VERIFIED (/discovery/registry.json — MCP tools/list semasa build). Kesihatan live dipaut (/status.json), tidak dibakar.",
  generated_at,
  generator: "scripts/generate-discovery-graph.cjs (site build pipeline)",

  identity: {
    site: SITE, name: "arif-fazil.com", symbol: "Ψ SOUL (Human Surface)",
    sovereign: { name: "Muhammad Arif bin Fazil", role: "F13 SOVEREIGN — absolute human veto", contact: "arif@arif-fazil.com", telegram: "@ariffazil" },
    identity_record: `${SITE}/.well-known/identity.json`,
    tagline: "DITEMPA BUKAN DIBERI — Forged, Not Given",
    purpose: "Bukan sekadar laman — lapisan penemuan berperlembagaan federasi. Manusia kekal berdaulat; manusia bukan lapisan pengangkutan.",
  },
  authority: {
    floors: `${SITE}/floors.json`,
    floors_summary: "F1 AMANAH · F2 TRUTH · F4 CLARITY · F6 MARUAH · F9 ANTI-HANTU · F13 SOVEREIGN (senarai penuh /floors.json)",
    veto: "Veto manusia (F13) mutlak dan muktamad",
    mutation_rule: "Permukaan awam baca-sahaja. Mutasi keadaan perlukan kebenaran terauthentikasi + kelulusan manusia eksplisit.",
    file_governance: "FAIL-CLOSED — lihat /AGENTS.md",
  },
  governance: {
    pattern: "Musyawarah — 333 ARCHITECT merancang × 555 AUDITOR mencabar × 888 APEX mengadili; F13 SOVEREIGN meratifikasi",
    kernel: { name: "arifOS", mcp: "https://mcp.arif-fazil.com/mcp", health: "https://arifos.arif-fazil.com/health" },
    witness_ledger: `${SITE}/ledger/`, receipts: `${SITE}/receipts/`, vault_proof: `${SITE}/999`,
    seals: "Permukaan pembuktian immutable di /999. VAULT999 itu sendiri dalaman-sahaja.",
  },
  capabilities,
  relationships,
  boundaries: {
    read_only_public: true,
    writes: "Sebarang penghantaran borang / mutasi / muat naik perlukan kelulusan manusia",
    a2a_public: "404 di apex secara reka bentuk (kanonik: aaa.arif-fazil.com/a2a/)",
    anti_hantu_f9: "Tiada tuntutan metafizik / kesedaran (F9)",
    dignity_f6: "Struktur dinilai, bukan individu; tuntutan sifat-peribadi dikecualikan",
    claims: "Tuntutan awam mesti ada sumber, tarikh, had, atau label interpretation",
  },
  endpoints: {
    mcp: { kernel: "https://mcp.arif-fazil.com/mcp", geox: "https://geox.arif-fazil.com/mcp", wealth: "https://wealth.arif-fazil.com/mcp", well: "https://well.arif-fazil.com/mcp", protocol: "POST JSON-RPC 2.0" },
    health: { snapshot: `${SITE}/status.json`, kernel_direct: `${SITE}/health`, federation: `${SITE}/api/organs` },
    webmcp: `${SITE}/.well-known/webmcp.json`,
  },
  surfaces: {
    llms: `${SITE}/llms.txt`, agent_card: `${SITE}/.well-known/agent.json`, floors: `${SITE}/floors.json`,
    status: `${SITE}/status.json`, sitemap: `${SITE}/sitemap.xml`, page_overview: `${SITE}/page.json`,
    witness_ledger: `${SITE}/ledger/`, receipts: `${SITE}/receipts/`, laws: `${SITE}/laws/`,
    human_contract: `${SITE}/human`, institutional: `${SITE}/institution/`,
  },
  traversal: {
    start: "/discovery/",
    question_answered: "Ekosistem keupayaan apa yang wujud di sini, authority apa yang mentadbirnya, dan bagaimana aku boleh berinteraksi dengannya dengan selamat?",
    depth_2: ["/floors.json", "/status.json", "/discovery/registry.json", "/.well-known/agent.json", "/ledger/", "/receipts/", "/human"],
  },
  capability_registry: {
    snapshot: "/discovery/registry.json",
    method: "MACHINE-VERIFIED — MCP tools/list semasa build (bukan senarai tangan)",
    live_state: "/status.json",
  },
};

// ── Muka manusia: /discovery/ ──────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="ms" data-ring="SOUL" data-plane="discovery">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Discovery — Peta Federasi | arif-fazil.com</title>
<meta name="description" content="Satu traversal: identity, authority, governance, capabilities, boundaries federasi Arif."/>
<link rel="canonical" href="${SITE}/discovery/"/>
<meta name="robots" content="index,follow"/><meta name="theme-color" content="#0A0B0D"/>
<meta property="og:type" content="website"/><meta property="og:title" content="Discovery — Peta Federasi | arif-fazil.com"/>
<meta property="og:url" content="${SITE}/discovery/"/>
<link rel="icon" href="/favicon.ico"/>
<style>
:root{color-scheme:dark}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0A0B0D;color:#EDEAE2;font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;min-height:100vh}
.wrap{max-width:1080px;margin:0 auto;padding:2.5rem 1.25rem 4rem}
.kicker{color:#C9A227;font-size:.7rem;letter-spacing:.25em;text-transform:uppercase;margin-bottom:.6rem}
h1{font-size:clamp(1.7rem,4.5vw,2.6rem);font-weight:800;margin-bottom:.5rem}
.sub{color:#9AA3AF;font-size:.85rem;line-height:1.6;max-width:46rem;margin-bottom:2rem}
.sub a{color:#C9A227;text-decoration:none}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem;margin-bottom:2.5rem}
.card{border:1px solid #1F2733;border-left:3px solid #C9A227;background:#0D1016;border-radius:6px;padding:1.1rem 1.25rem}
.card h2{font-size:1rem;margin-bottom:.2rem}
.card .kind{color:#5B6470;font-size:.65rem;text-transform:uppercase;letter-spacing:.15em;margin-bottom:.5rem}
.card .role{color:#D8D4CC;font-size:.78rem;line-height:1.55;margin-bottom:.6rem}
.card .why,.card .ifdown{color:#9AA3AF;font-size:.72rem;line-height:1.5;margin-top:.45rem}
.card .why b,.card .ifdown b{color:#C9A227;font-weight:600}
.dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#5B6470;margin-right:.45rem;vertical-align:middle}
.dot.up{background:#3FB68B}.dot.down{background:#E4572E}
.health{font-size:.7rem;color:#9AA3AF}
section h2.sec{color:#C9A227;font-size:.8rem;letter-spacing:.2em;text-transform:uppercase;margin:2.2rem 0 1rem;border-bottom:1px solid #1F2733;padding-bottom:.5rem}
.rel{border:1px solid #1F2733;background:#0D1016;border-radius:6px;padding:.8rem 1rem;margin-bottom:.6rem;font-size:.75rem;line-height:1.55;color:#D8D4CC}
.rel .t{color:#C9A227;font-weight:700;margin-right:.5rem}
footer{border-top:1px solid #1F2733;margin-top:3rem;padding-top:1.25rem;color:#5B6470;font-size:.68rem;line-height:1.7}
footer a{color:#9AA3AF;text-decoration:none}
</style>
</head>
<body>
<div class="wrap">
<p class="kicker">Federation Discovery Surface</p>
<h1>Peta Federasi</h1>
<p class="sub">Satu traversal untuk manusia dan agent: siapa berdaulat, apa keupayaan, apa sempadan, apa keadaan semasa.
Kesihatan <span id="live-tag">dimuat live</span> dari <a href="/status.json">/status.json</a>. Graf mesin: <a href="/discovery/index.json">/discovery/index.json</a>.</p>

<section><h2 class="sec">Capabilities × Kesihatan Live</h2><div class="grid" id="organs"></div></section>
<section><h2 class="sec">Relationships — Siapa Berhubung Dengan Siapa</h2><div id="rels"></div></section>
<section><h2 class="sec">Authority & Governance</h2>
<div class="rel"><span class="t">AUTHORITY</span> F1 AMANAH · F2 TRUTH · F4 CLARITY · F6 MARUAH · F9 ANTI-HANTU · F13 SOVEREIGN — <a href="/floors.json" style="color:#C9A227">senarai penuh</a>. Veto manusia mutlak.</div>
<div class="rel"><span class="t">PATTERN</span> Musyawarah — 333 ARCHITECT merancang × 555 AUDITOR mencabar × 888 APEX mengadili; F13 meratifikasi.</div>
<div class="rel"><span class="t">WITNESS</span> <a href="/ledger/" style="color:#C9A227">Ledger</a> · <a href="/receipts/" style="color:#C9A227">Receipts</a> · <a href="/999" style="color:#C9A227">/999 vault proof</a></div>
</section>
<footer>
Graf ini dijana oleh pipeline build (setiap build regenerate) · Kesihatan dipaut, tidak dibakar (F2) ·
<a href="/human">Kontrak agent</a> · <a href="/llms.txt">llms.txt</a> · <a href="/.well-known/agent.json">agent.json</a><br/>
DITEMPA BUKAN DIBERI — Manusia kekal berdaulat; manusia bukan lapisan pengangkutan.
</footer>
</div>
<script>
(async () => {
  const g = await fetch('/discovery/index.json').then(r => r.json()).catch(() => null);
  if (!g) return;
  let st = null, reg = null;
  try { st = await fetch('/status.json').then(r => r.json()); } catch (e) {}
  try { reg = await fetch('/discovery/registry.json').then(r => r.json()); } catch (e) {}
  const healthOf = id => {
    if (!st) return null;
    const key = { arifos:'arifos', aaa:'aaa', geox:'geox', wealth:'wealth', well:'well', 'a-forge':'aforge', arifflow:'arifflow', frame:'frame', hermes:null }[id];
    if (!key) return null;
    const o = (st.federation || {})[key];
    if (!o) return null;
    const s = o.status;
    if (s === 'healthy' || s === 'flowing' || s === 'ok' || s === 200) return 'UP:' + s;
    return 'DOWN:' + (s || '?');
  };
  const organs = document.getElementById('organs');
  organs.innerHTML = g.capabilities.map(c => {
    const h = healthOf(c.id);
    const dot = h === null ? '<span class="dot"></span>' : (h.startsWith('UP') ? '<span class="dot up"></span>' : '<span class="dot down"></span>');
    const label = h === null ? 'tiada probe awam (substrate)' : h.replace(':', ' · ');
    const eps = Object.values(c.endpoints || {}).filter(Boolean);
    const ro = reg ? ((reg.organs || {})[c.id]) : null;
    const toolsBlock = ro && ro.verified
      ? '<details style="margin-top:.55rem"><summary style="cursor:pointer;color:#C9A227;font-size:.72rem">' + ro.count + ' tool MESIN-VERIFIED (MCP) — klik untuk senarai</summary>'
        + '<div style="margin-top:.4rem;font-size:.66rem;color:#9AA3AF;line-height:1.7">'
        + ro.tools.map(t => '<span style="color:#D8D4CC">' + t.name + '</span>' + (t.desc ? ' — ' + t.desc : '')).join('<br/>')
        + '</div></details>'
      : (ro && !ro.verified ? '<div class="ifdown"><b>Registry:</b> ' + (ro.note || 'tidak verified pada build ini') + '</div>' : '');
    return '<div class="card"><h2>' + dot + c.name + '</h2><div class="kind">' + c.kind + ' · <span class="health">' + label + '</span></div>'
      + '<div class="role">' + c.role + '</div>'
      + '<div class="why"><b>Mengapa wujud:</b> ' + c.why + '</div>'
      + (c.if_down ? '<div class="ifdown"><b>Jika mati:</b> ' + c.if_down + '</div>' : '')
      + (c.boundary ? '<div class="ifdown"><b>Sempadan:</b> ' + c.boundary + '</div>' : '')
      + (eps.length ? '<div class="ifdown"><b>Endpoints:</b> ' + eps.join(' · ') + '</div>' : '')
      + toolsBlock
      + '</div>';
  }).join('');
  const rels = document.getElementById('rels');
  rels.innerHTML = g.relationships.map(r =>
    '<div class="rel"><span class="t">' + r.type.toUpperCase() + '</span>' +
    (Array.isArray(r.from) ? r.from.join(', ') : r.from) + ' → ' + r.to +
    ' — ' + r.note + '</div>').join('');
})();
</script>
</body>
</html>
`;

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "index.json"), JSON.stringify(graph, null, 2) + "\n");
  fs.writeFileSync(path.join(OUT_DIR, "index.html"), html + "\n");
  const registry = await buildRegistry();
  fs.writeFileSync(path.join(OUT_DIR, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
  const verified = Object.entries(registry.organs).filter(([, o]) => o.verified);
  console.log(`generate-discovery-graph: v3 — index.json (${capabilities.length} capabilities, ${relationships.length} relationships) + index.html + registry.json MESIN-VERIFIED (${registry.total_verified} tool dari ${verified.length} organ: ${verified.map(([k, o]) => k + ':' + o.count).join(', ')})`);
})();
