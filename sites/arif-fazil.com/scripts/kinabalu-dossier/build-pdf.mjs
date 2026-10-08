// Build public/earth/kinabalu-basin.pdf from the cross-section page's own data.
// 1. Serve public/ locally, screenshot the section for each model with headless Edge/Chrome.
// 2. Extract MODELS / MATRIX / REFS from the page (single source of truth).
// 3. Write a print HTML and print it to PDF.
// Usage: node build-pdf.mjs [--browser "<path to msedge/chrome>"]
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFile, execFileSync } from "node:child_process";
import vm from "node:vm";

const HERE = dirname(fileURLToPath(import.meta.url));
const PUB = join(HERE, "..", "..", "public");
const PAGE = join(PUB, "earth", "kinabalu-cross-section.html");
const OUT_PDF = join(PUB, "earth", "kinabalu-basin.pdf");
const WORK = join(HERE, ".build");
mkdirSync(WORK, { recursive: true });

const argBrowser = process.argv.indexOf("--browser");
const BROWSER = argBrowser > 0 ? process.argv[argBrowser + 1] : [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome", "/usr/bin/chromium", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
].find(existsSync);
if (!BROWSER) throw new Error("No Chromium-family browser found; pass --browser");

// ── 1. extract data from the page ─────────────────────────────────────────────
const html = readFileSync(PAGE, "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(s => /const (XS|MODELS) =/.test(s));
const ctx = {};
vm.createContext(ctx);
vm.runInContext(scripts.join("\n") + "\n;globalThis.__d = {XS, MODELS, MATRIX, REFS, SHARED_EVENTS};", ctx);
const { MODELS, MATRIX, REFS } = ctx.__d;

// ── 2. screenshots ────────────────────────────────────────────────────────────
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".json": "application/json", ".svg": "image/svg+xml" };
const server = createServer((req, res) => {
  const p = join(PUB, decodeURIComponent(new URL(req.url, "http://x").pathname));
  try { res.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" }); res.end(readFileSync(p)); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const port = server.address().port;
// Async exec: a sync exec would block this process's event loop and the local server could not answer the browser.
const run = (args) => new Promise((ok, bad) => execFile(BROWSER, args, { timeout: 120000 }, e => e ? bad(e) : ok()));
const shot = (url, out, size) => run(["--headless=new", "--disable-gpu", "--hide-scrollbars",
  `--user-data-dir=${join(WORK, "profile")}`, "--force-device-scale-factor=1.5", `--window-size=${size}`, "--virtual-time-budget=3000",
  `--screenshot=${out}`, url]);
for (const m of MODELS) await shot(`http://127.0.0.1:${port}/earth/kinabalu-cross-section.html?figure&t=${Date.now()}#model-${m.id}`, join(WORK, `fig_${m.id}.png`), "1480,924");
server.close();


// ── 3. print HTML ─────────────────────────────────────────────────────────────
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fig = (id, cap) => `<figure class="xs"><img src="${pathToFileURL(join(WORK, `fig_${id}.png`)).href}" alt=""><figcaption>${cap}</figcaption></figure>`;
const sym = { y: "✓", n: "✗", u: "○" };
const refs = Object.values(REFS);

const body = `
<section class="cover">
  <div class="kick">Φ GEOX · arif-fazil.com/earth</div>
  <h1>Kinabalu Basin</h1>
  <p class="sub">Offshore NW Sabah, Malaysia — a geological dossier</p>
  <p class="meta">Version 3 · October 2026 · Prepared for Arif Fazil<br>Public sources only. No proprietary well, seismic or company data.</p>
  <div class="box"><b>What changed in v3.</b> The regional section now runs from the Dangerous Grounds to East Sabah and the Sulu Sea (~830 km) and carries four competing working models of the tectonic driver, including a new, untested hypothesis: a basaltic ridge along the Sabah Trough. Errors in v2 are corrected (Section 10).</div>
</section>

<h2>1. What is the Kinabalu Basin?</h2>
<p>In Malaysian petroleum usage the Kinabalu Basin is the offshore sedimentary basin along the north-west Sabah margin, from the waters off Labuan north toward the Malaysia–Philippines boundary. It is one of three producing basins in Malaysia, with the Malay and Sarawak basins (PETRONAS MPM 2025). It spans the NW Sabah shelf (&lt;100 m water) and the deepwater fold-thrust belt (&gt;1,000 m). Its outboard, north-western limit is the <b>Sabah Trough</b> (~2.9 km deep), beyond which lie the Layang-Layang Basin and the Dangerous Grounds.</p>
<p>Fields include Kinabalu (~500 MMstb oil in place; Bait 2003), Samarang, Kebabangan, Sumandak and Malikai. Recent wells have found oil beneath gas in deeper intervals (Ab Ghani et al. 2026).</p>

<h2>2. Tectonic evolution</h2>
<p>Sabah sits where the South China Sea, Sulu Sea and Celebes Sea basins meet. Its Cenozoic history runs from subduction, through collision, to post-subduction uplift and gravity-driven deformation.</p>
<table class="t"><tr><th>Age</th><th>Event</th><th>Record</th></tr>
<tr><td>Eocene–Oligocene</td><td>Proto-South China Sea subducts SE beneath NW Borneo</td><td>Rajang–Crocker deep-marine turbidites accreted into the prism that forms the Crocker Range (Hutchison 2005)</td></tr>
<tr><td>~37 Ma</td><td>Sarawak Orogeny</td><td>Uplift and erosion of the Rajang Group (Hutchison 1996)</td></tr>
<tr><td>~32–16 Ma</td><td>South China Sea spreading</td><td>Dangerous Grounds blocks rifted and drifted south; carbonate platforms on block crests (Briais et al. 1993; Li et al. 2014)</td></tr>
<tr><td>~23–20 Ma</td><td>Sabah deformation · BMU</td><td>Uplift, erosion, mélange; deep-water to shallower sedimentation (Balaguru & Hall 2009)</td></tr>
<tr><td>~20–15 Ma</td><td>Sulu Sea back-arc opening</td><td>Extension and subsidence in East Sabah (Rangin & Silver 1991)</td></tr>
<tr><td>~16–15.5 Ma</td><td>End of spreading (RU/MMU) · DRU</td><td>Platforms drown in the Dangerous Grounds; Deep Regional Unconformity offshore Sabah (Hazebroek & Tan 1993)</td></tr>
<tr><td>Middle Miocene</td><td>North Sabah–Pagasa Wedge loaded; mud canopy</td><td>Mini-basins and ~1,900 km² of mud canopy (Morley et al. 2023)</td></tr>
<tr><td>~9.5–8.5 Ma</td><td>SRU · Late Miocene inversion</td><td>Shallow Regional Unconformity; published ages vary with biostratigraphic calibration</td></tr>
<tr><td>7.85–7.22 Ma</td><td>Kinabalu granite</td><td>U-Pb zircon (Cottam et al. 2010); rapid exhumation afterwards (Cottam et al. 2013)</td></tr>
<tr><td>Late Miocene–present</td><td>Delta progradation, toe-thrusts, inversion</td><td>Stage IV deltas; deepwater fold-thrust belt; 2015 Mw 6.0 Ranau earthquake shows ongoing deformation</td></tr></table>
<p class="note">What drives the deformation is disputed. Section 8 sets out four working models.</p>

<h2>3. Stratigraphy</h2>
<p>The producing interval is the post-DRU Stage IV succession, subdivided into IVA–IVG (Levell 1987). On the shelf it is a coastal to shallow-marine clastic system thickening into growth faults; outboard it passes into deepwater turbidites and mud, folded above an overpressured shale. Stage IVC records coastal progradation with mouth-bar and channel sands; IVD stacked coarsening-upward shoal complexes; IVE gradual transgression; IVF widespread transgression with laterally extensive sand sheets; IVG renewed shallowing (Bait 2003).</p>

<h2>4. Kinabalu Field</h2>
<p>Discovered in 1989 by KN-1, 55 km WNW of Labuan in ~54 m of water; oil in place ~500 MMstb; first oil December 1997, peak ~48,000 bbl/d. The trap is a dip closure against the SW–NE Kinabalu growth fault (8° WNW dip; spill to the NE). Main, Deep and East accumulations; best reservoir facies are poorly stratified sandstones (23% porosity, ~630 mD). A water-injection scheme from shallow aquifer sands raised recovery from ~21% to ~43% (Bait 2003).</p>

<h2>5. Petroleum system</h2>
<table class="t"><tr><th>Element</th><th>Summary</th></tr>
<tr><td>Source</td><td>Not penetrated. Type III and II/III deltaic organic matter inferred from migrated hydrocarbons; generation from Late Miocene–Pliocene to present.</td></tr>
<tr><td>Reservoir</td><td>Post-DRU Stage IV coastal to shallow-marine sandstones (porosity 20–30%); deepwater turbidites outboard; Oligo–Miocene carbonates in the neighbouring Layang-Layang Basin (Tepat-1; Choi 2026).</td></tr>
<tr><td>Seal</td><td>Intraformational and transgressive marine shales (IVF, IVG).</td></tr>
<tr><td>Trap</td><td>Growth-fault dip closures on the shelf; thrust anticlines outboard; stratigraphic traps under-explored.</td></tr>
<tr><td>Key risk</td><td>Trap timing versus charge; Late Miocene–Pliocene inversion can breach or re-migrate.</td></tr></table>

<h2>6. Recent discoveries</h2>
<p>Deeper oil beneath gas at Well A (2025), a deeper pool at Zoisit Deep-1, and reprocessed-seismic targets at Well B (Ab Ghani et al. 2026) have shifted the basin from gas-dominant to oil-prone. In the Layang-Layang Basin next door, carbonate discoveries (Tepat-1, Megah-1) prove an Oligo–Miocene carbonate play (Choi 2026). Receiver functions image a slab remnant 45–55 km beneath Sabah (Cornwell et al. 2025).</p>

<h2>7. Regional section: Dangerous Grounds → East Sabah</h2>
<p>An ~830-km dog-leg section from the Dangerous Grounds (NW) across the Sabah Trough, the outboard fold-thrust belt, the Kinabalu shelf, the Crocker Range and Mt Kinabalu, Central Sabah and the Sandakan Basin to the Sulu Sea (SE). The upper 15 km is drawn at ~17× vertical exaggeration and the lithosphere at ~3×. Shallow geometry is shared by all models; the region beneath the DRU and everything below 15 km depend on the model. All bodies are schematic interpretations, not seismic picks. Interactive version: arif-fazil.com/earth/kinabalu-cross-section.html.</p>

<section class="provenance">
  <h2>Provenance — sources behind this dossier</h2>
  <p>This dossier is built from peer-reviewed and publicly released sources only. Key references by section:</p>
  <ul class="refs">
    <li><b>Section 2 (Tectonic evolution):</b> Balaguru &amp; Hall 2009; Hutchison 2005; Briais et al. 1993; Rangin &amp; Silver 1991.</li>
    <li><b>Section 4 (Kinabalu field):</b> Bait 2003 (GSM Bulletin 47).</li>
    <li><b>Section 6 (Recent discoveries):</b> Ab Ghani et al. EAGE 2026; Choi et al. EAGE 2026; Cornwell et al. JGR 2025.</li>
    <li><b>Section 8 (Model A — magmatic ridge):</b> Author's untested hypothesis; no public support yet.</li>
    <li><b>Section 8 (Model B — mud canopy):</b> Morley et al. 2023, <i>Geosphere</i> 19(1): 291–326.</li>
    <li><b>Section 8 (Model C — underthrust):</b> Hinz et al. 1989; Hazebroek &amp; Tan 1993; Hutchison 2005.</li>
    <li><b>Section 8 (Model D — slab + gravity):</b> Hall 2013; Cottam et al. 2010, 2013; King et al. 2010; Cornwell et al. 2025.</li>
    <li><b>Background:</b> PETRONAS MPM 2025; Geological Survey of Malaysia Memoir 19.</li>
  </ul>
  <p class="note">No proprietary well, seismic or company data. No picks. No internal chronostratigraphy. Public sources only.</p>
</section>

<h2>8. Four working models</h2>
${MODELS.map(m => `
<div class="model">
  <h3><span class="dot" style="background:${m.color}"></span>${esc(m.key)} — ${esc(m.title)} <span class="st" style="color:${m.color};border-color:${m.color}">${esc(m.status)}</span></h3>
  <p class="who">${esc(m.who)}</p>
  ${fig(m.id, `Section A–A′ under ${esc(m.key)}.`)}
  <p>${esc(m.thesis)}</p>
  <table class="kv"><tr><th>Mechanism</th><td>${esc(m.mechanism)}</td></tr><tr><th>Timing</th><td>${esc(m.timing)}</td></tr>
  <tr><th>Strengths</th><td>${esc(m.strengths)}</td></tr><tr><th>Problems</th><td>${esc(m.problems)}</td></tr><tr><th>Kill test</th><td><b>${esc(m.kill)}</b></td></tr></table>
</div>`).join("")}

<h2>9. What would decide it</h2>
<table class="t mx"><tr><th>Observation</th>${MODELS.map(m => `<th style="color:${m.color}">${m.id}</th>`).join("")}<th>Status</th></tr>
${MATRIX.map(r => `<tr><td>${esc(r.q)}</td>${MODELS.map(m => `<td class="c ${r.p[m.id]}">${sym[r.p[m.id]]}</td>`).join("")}<td>${r.obs === "done" ? "observed" : "open"}${r.src ? `<br><span class="src">${esc(r.src)}</span>` : ""}</td></tr>`).join("")}</table>
<p class="note">✓ predicted · ✗ contradicted or not expected · ○ silent. The four observations that would test Model A exist in industry data but are not public. Model A is drawn at the same weight as the published models so it can be argued with, not because it is established.</p>

<h2>10. Corrections from v2 (July 2026)</h2>
<ul>
<li>Kinabalu granite: v2 gave ~10–8 Ma. The U-Pb age is <b>7.85–7.22 Ma</b> (Cottam et al. 2010). The unsourced "~1,000 km² at depth" is removed.</li>
<li>Sabah Trough: v2 called it the basin's eastern boundary. It is the <b>outboard, north-western</b> limit.</li>
<li>SRU: v2 gave a single 8.6 Ma. Published ages range ~8.5–9.5 Ma depending on biostratigraphic calibration; it is shown as a range.</li>
<li>The regional section is extended from ~600 km to ~830 km to reach the Sulu Sea, and now carries four models instead of one picture.</li>
</ul>

<h2>11. References</h2>
<ol class="refs">${refs.map(r => `<li>${esc(r)}</li>`).join("")}
<li>Ab Ghani, A.F. et al. (2026). Unravelling deeper play opportunities in Kinabalu Basin of Sabah: case study from recent Well B results. 2nd EAGE Workshop on New Discoveries in Mature Basins.</li>
<li>Bait, B. (2003). Geology of Kinabalu field and its water injection scheme. Bulletin of the Geological Society of Malaysia 47: 165–179.</li>
<li>Hutchison, C.S. (1996). The 'Rajang accretionary prism' and 'Lupar Line' problem of Borneo. Geological Society of London Special Publication 106.</li>
<li>Levell, B.K. (1987). The nature and significance of regional unconformities in the hydrocarbon-bearing Neogene sequence offshore West Sabah. Bulletin of the Geological Society of Malaysia 21: 55–90.</li>
<li>PETRONAS Malaysia Petroleum Management (2025). Exploration: overview of Malaysia's basins. petronas.com/mpm.</li>
</ol>
<p class="foot">Kinabalu Basin dossier v3 · arif-fazil.com/earth/kinabalu-basin/ · Φ GEOX · DITEMPA BUKAN DIBERI</p>`;

const css = `
@page { size: A4; margin: 16mm 15mm 16mm 15mm; }
* { box-sizing: border-box; }
body { font: 10pt/1.45 "Segoe UI", Inter, Arial, sans-serif; color: #1c2128; margin: 0; }
h1 { font-size: 34pt; margin: 0 0 4mm; letter-spacing: -.01em; }
h2 { font-size: 14pt; margin: 8mm 0 2.5mm; padding-bottom: 1.2mm; border-bottom: 1.5px solid #1c2128; break-after: avoid; }
h3 { font-size: 11.5pt; margin: 0 0 1mm; break-after: avoid; }
p { margin: 0 0 2.5mm; } .note { color: #5b6470; font-size: 9pt; }
.cover { height: 250mm; display: flex; flex-direction: column; justify-content: center; break-after: page; }
.cover .kick { font: 600 9pt/1 "Consolas", monospace; letter-spacing: .15em; color: #b45309; text-transform: uppercase; margin-bottom: 6mm; }
.cover .sub { font-size: 15pt; color: #3d4652; } .cover .meta { color: #5b6470; margin-top: 8mm; }
.box { margin-top: 10mm; padding: 4mm 5mm; border-left: 3px solid #b45309; background: #fdf6ec; font-size: 10pt; }
table.t { width: 100%; border-collapse: collapse; font-size: 9pt; margin: 1mm 0 3mm; }
table.t th, table.t td { text-align: left; vertical-align: top; padding: 1.4mm 2mm; border-bottom: .5px solid #d5d9de; }
table.t th { background: #f1f3f5; font-weight: 600; }
table.mx { break-inside: avoid; } table.mx td.c { text-align: center; font-weight: 700; } td.y { color: #15803d; } td.n { color: #b91c1c; } td.u { color: #9aa1a9; }
section.provenance { break-inside: avoid; margin: 4mm 0 6mm; padding: 3mm 4mm 3mm 5mm; background: #f6f8fa; border-left: 3px solid #6b7380; }
section.provenance h2 { font-size: 11pt; margin: 0 0 2mm; padding-bottom: .5mm; border-bottom: 1px solid #c1c6cd; }
section.provenance ul.refs { font-size: 8.5pt; line-height: 1.5; margin: 0; padding-left: 4mm; }
section.provenance ul.refs li { margin-bottom: .8mm; }
section.provenance ul.refs b { color: #1c2128; }
.src { color: #6b7380; font-size: 8pt; }
.model { break-inside: avoid-page; margin-bottom: 6mm; }
.model .who { color: #5b6470; font-size: 8.8pt; margin-bottom: 2mm; }
.st { font: 600 7.5pt/1 Consolas, monospace; border: 1px solid; border-radius: 8px; padding: .6mm 1.8mm; vertical-align: 1.5pt; margin-left: 1.5mm; }
.dot { display: inline-block; width: 3mm; height: 3mm; border-radius: 50%; margin-right: 2mm; vertical-align: -.2mm; }
figure.xs { margin: 0 0 2.5mm; }
figure.xs img { width: 100%; display: block; border-radius: 2mm; }
figcaption { font-size: 8pt; color: #6b7380; margin-top: 1mm; }
table.kv { width: 100%; border-collapse: collapse; font-size: 9pt; }
table.kv th { width: 24mm; text-align: left; vertical-align: top; font: 600 7.5pt/1.6 Consolas, monospace; color: #6b7380; text-transform: uppercase; padding: 1mm 2mm 1mm 0; }
table.kv td { padding: 1mm 0; border-bottom: .5px solid #eceef0; }
ul, ol { margin: 0 0 3mm 5mm; padding: 0 0 0 3mm; } li { margin-bottom: 1.2mm; }
ol.refs { font-size: 8.6pt; }
.foot { margin-top: 8mm; font-size: 8pt; color: #8a919a; text-align: center; }`;

const printHtml = join(WORK, "dossier.html");
writeFileSync(printHtml, `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Kinabalu Basin — Geological Dossier v3</title><style>${css}</style></head><body>${body}</body></html>`);
execFileSync(BROWSER, ["--headless=new", "--disable-gpu", `--user-data-dir=${join(WORK, "profile")}`, "--no-pdf-header-footer",
  `--print-to-pdf=${OUT_PDF}`, pathToFileURL(printHtml).href], { stdio: "ignore" });
console.log("wrote", OUT_PDF);
