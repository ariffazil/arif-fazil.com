#!/usr/bin/env node
/**
 * primer-shells.cjs — PRIMER FAMILY static shells (SCAR 2026-08-15).
 *
 * F13 DIRECTIVE (Arif, 2026-08-15): "Yes I want like this. If possible all the
 * other main sites should follow this except main arif-fazil.com and /earth.
 * Subpages as well follow same template. Senang. Save resources on design."
 *
 * "Like this" = the Primer Dark MakcikGPT landing (git 767596c):
 *   hero headline "Makcik Tanya. Kuasa Jawab." (white→blue→red→yellow),
 *   stats strip, pull-quote, series chips, article cards, footer sig.
 *
 * ONE template, primer trio palette, zero agent chrome, zero sacred geometry.
 * Scope: /words/, /work/, /world/ (family) — NOT /, NOT /earth/, NOT
 * /world/makcikgpt/ (that one is owned by generate-agent-shells.cjs with the
 * full archive-faithful hero).
 *
 * Data binding (never hardcode — Banda Haram):
 *   words: src/data/essays.json (onsite /writing/* + /world/makcikgpt/* essays)
 *   work : public/missions.json (missions + doctrine)
 *
 * DESIGN CONTRACT: see skill makcikgpt-archived-designs + DESIGN_INVARIANTS.md.
 * Geometry ban: web-canon verify-design-canon.cjs check 7 (fail-closed).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function readJson(p, fallback = null) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}

/* ── Primer Dark tokens (archive 767596c — the approved design) ── */
const T = {
  bg: '#0a0a0a', bgAlt: '#111111', bgCard: '#1a1a1a', bgHover: '#242424',
  border: '#2a2a2a', fg: '#f0f0f0', fgMuted: '#9a9a9a', fgSubtle: '#666666',
  red: '#e0301e', blue: '#1f3fd4', yellow: '#f2b705',
};

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
body{background:${T.bg};color:${T.fg};font-family:'Inter',system-ui,sans-serif;line-height:1.55}
a{color:inherit;text-decoration:none}
.wrap{max-width:1080px;margin:0 auto;padding:0 1.5rem}
.mono{font-family:'JetBrains Mono',ui-monospace,monospace}
.topbar{display:flex;justify-content:space-between;align-items:center;padding:.9rem 0;border-bottom:1px solid ${T.border}}
.topbar .brand{font-family:'JetBrains Mono',monospace;font-size:.8rem;letter-spacing:.14em;color:${T.fgMuted}}
.topbar .brand b{color:${T.fg}}
.trio{display:inline-flex;gap:.3rem;align-items:center;font-family:'JetBrains Mono',monospace;font-size:.72rem;letter-spacing:.12em;color:${T.fgMuted};text-transform:uppercase}
.dot{width:8px;height:8px;border-radius:50%;display:inline-block}
.d-r{background:${T.red}} .d-b{background:${T.blue}} .d-y{background:${T.yellow}}
.crumb{font-family:'JetBrains Mono',monospace;font-size:.72rem;letter-spacing:.1em;color:${T.fgSubtle};text-transform:uppercase;padding:1.1rem 0 .2rem}
.crumb a{color:${T.fgMuted}} .crumb b{color:${T.yellow}}
.hero{padding:3.5rem 0 2.5rem;max-width:820px}
.hero h1{font-size:clamp(2.6rem,7vw,4.6rem);font-weight:900;line-height:.98;letter-spacing:-.02em;text-transform:uppercase}
.hero .sub{margin-top:1.1rem;font-size:.95rem;color:${T.fgMuted};max-width:560px;line-height:1.6}
.c-b{color:${T.blue}} .c-r{color:${T.red}} .c-y{color:${T.yellow}}
.tags{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1.3rem}
.tags span{font-family:'JetBrains Mono',monospace;font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;border:1px solid ${T.border};color:${T.fgMuted};padding:.3rem .7rem;border-radius:999px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid ${T.border};border-radius:10px;overflow:hidden;margin:1.5rem 0}
.stats>div{padding:1rem 1.1rem;border-right:1px solid ${T.border};background:${T.bgAlt}}
.stats>div:last-child{border-right:0}
.stats b{display:block;font-size:1.7rem;font-weight:900;line-height:1.1}
.stats span{font-family:'JetBrains Mono',monospace;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:${T.fgSubtle}}
.quote{border-left:3px solid ${T.yellow};background:${T.bgAlt};padding:1.3rem 1.5rem;border-radius:0 10px 10px 0;margin:2rem 0;max-width:760px}
.quote p{font-size:1.05rem;line-height:1.65;color:${T.fg}}
.quote .who{margin-top:.6rem;font-family:'JetBrains Mono',monospace;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:${T.fgSubtle}}
.section-h{display:flex;align-items:center;gap:.6rem;margin:2.6rem 0 1.1rem;font-family:'JetBrains Mono',monospace;font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:${T.fgMuted}}
.section-h .dot{width:7px;height:7px}
.cards{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.card{border:1px solid ${T.border};background:${T.bgCard};border-radius:10px;padding:1.25rem 1.35rem;transition:border-color .15s}
.card:hover{border-color:${T.fgSubtle}}
.card .k{display:flex;gap:.5rem;align-items:center;font-family:'JetBrains Mono',monospace;font-size:.66rem;letter-spacing:.1em;text-transform:uppercase;color:${T.fgSubtle};margin-bottom:.5rem}
.card h3{font-size:1.06rem;font-weight:800;line-height:1.3}
.card p{margin-top:.45rem;font-size:.86rem;color:${T.fgMuted}}
.card a.go{display:inline-block;margin-top:.7rem;font-family:'JetBrains Mono',monospace;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:${T.yellow}}
.bignum{display:flex;gap:.9rem;align-items:flex-start}
.bignum i{font-style:normal;font-family:'JetBrains Mono',monospace;font-size:.75rem;color:${T.fgSubtle};padding-top:.2rem}
footer{margin-top:3.5rem;border-top:1px solid ${T.border};padding:1.4rem 0 2.5rem}
.foot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:.6rem;font-family:'JetBrains Mono',monospace;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:${T.fgSubtle}}
.foot b{color:${T.fgMuted}}
@media(max-width:720px){.cards{grid-template-columns:1fr}.stats{grid-template-columns:repeat(2,1fr)}.stats>div{border-bottom:1px solid ${T.border}}}
`;

function shell({ trail, trioWord, body, title, description, canonical }) {
  return `<!DOCTYPE html>
<html lang="ms" data-ring="BODY" data-agent-surface="primer-family">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<meta name="agent-access" content="allow-read allow-train allow-cite">
<link rel="stylesheet" href="/_shared/design-system/tokens.css">
<link rel="alternate" type="text/plain" href="/llms.txt" title="Machine overview">
<link rel="alternate" type="application/json" href="/missions.json" title="Missions catalog">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
<div class="wrap">
  <link rel="stylesheet" href="/_shared/fed-nav.css">
  <div id="fed-nav-root"></div>
  <script src="/_shared/fed-nav.js" defer></script>
  <div class="crumb">${trail}${trioWord ? ` · <b>${esc(trioWord)}</b>` : ''}</div>
${body}
  <footer>
    <div class="foot">
      <span><b>${esc(trioWord)}</b> · ARIF-FAZIL.COM</span>
      <span>● ● ● DITEMPA BUKAN DIBERI 🇲🇾</span>
    </div>
  </footer>
</div>
</body>
</html>`;
}

function writeRoute(route, html) {
  const dir = path.join(PUBLIC, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('wrote', path.join(route, 'index.html'), html.length, 'bytes');
}

/* ══ WORDS — essay index, primer family ══════════════════ */
const essaysRaw = readJson(path.join(ROOT, 'src/data/essays.json'), []);
const essays = Array.isArray(essaysRaw) ? essaysRaw : [];
const onsite = essays.filter((e) => e.dest && e.dest.type === 'onsite');
const englishEssays = onsite.filter((e) => (e.lang || e.language || 'en') !== 'ms' && !(e.dest.path || '').startsWith('/world/makcikgpt'));
const bmCount = onsite.length - englishEssays.length;

const essayCards = englishEssays
  .slice(0, 12)
  .map((e, i) => {
    const theme = [T.blue, T.red, T.yellow][i % 3];
    const href = (e.dest && e.dest.path) || `/writing/${e.id || e.slug || ''}`;
    return `    <div class="card">
      <div class="k"><span class="dot" style="background:${theme}"></span>ESSAY · ${esc(e.date || '')}</div>
      <h3><a href="${esc(href)}">${esc(e.title)}</a></h3>
      ${e.subtitle || e.excerpt ? `<p>${esc((e.subtitle || e.excerpt || '').slice(0, 140))}</p>` : ''}
      <a class="go" href="${esc(href)}">Baca →</a>
    </div>`;
  })
  .join('\n');

writeRoute(
  'words',
  shell({
    title: 'Words — Essays · Arif Fazil',
    description: 'Essays on geology, risk, honesty in AI, and the North. Written to be read.',
    canonical: 'https://arif-fazil.com/words/',
    trioWord: 'WORDS',
    trail: `<a href="/">HOME</a> / <b>WORDS</b>`,
    body: `
  <section class="hero">
    <h1>Tulis<br><span class="c-b">Jujur.</span><br><span class="c-r">Baca</span> <span class="c-y">Perlahan.</span></h1>
    <p class="sub">Esei Bahasa Inggeris — geologi, risiko, kejujuran dalam AI, dan Loghat Utara.
      ${englishEssays.length} esei penuh, ditulis untuk dibaca, bukan untuk discan.</p>
    <div class="tags"><span>GEOLOGY</span><span>RISK</span><span>AI HONESTY</span><span>LOGHAT UTARA</span></div>
  </section>
  <div class="stats">
    <div><b class="c-r">${englishEssays.length}</b><span>Esei</span></div>
    <div><b class="c-b">${bmCount}</b><span>Artikel BM</span></div>
    <div><b class="c-y">∞</b><span>Baca Percuma</span></div>
    <div><b class="c-r">EN</b><span>Bahasa</span></div>
  </div>
  <div class="quote">
    <p>"A well teaches you what a forecast cannot — that the ground does not negotiate."</p>
    <div class="who">— DARI ESEI · WHAT A WELL TEACHES YOU ABOUT RISK</div>
  </div>
  <div class="section-h"><span class="dot" style="background:${T.red}"></span>TERBARU</div>
  <div class="cards">
${essayCards || '<div class="card"><h3>Essays loading…</h3></div>'}
  </div>
  <div class="section-h"><span class="dot" style="background:${T.blue}"></span>JUGAK</div>
  <div class="cards">
    <div class="card">
      <div class="k"><span class="dot d-y"></span>MAKCIKGPT</div>
      <h3><a href="/world/makcikgpt/">Makcik Tanya. Kuasa Jawab.</a></h3>
      <p>Kewartawanan sivik dalam Bahasa Makcik — ${bmCount} artikel.</p>
      <a class="go" href="/world/makcikgpt/">Lihat →</a>
    </div>
    <div class="card">
      <div class="k"><span class="dot d-b"></span>RSS</div>
      <h3><a href="/feed.xml">Feed penuh</a></h3>
      <p>Senarai mesin untuk semua tulisan.</p>
      <a class="go" href="/feed.xml">Feed →</a>
    </div>
  </div>`,
  }),
);

/* ══ WORK — missions catalog, primer family ═══════════════ */
const missionsDoc = readJson(path.join(PUBLIC, 'missions.json'), {});
const missions = missionsDoc.missions || [];
const doctrine = missionsDoc.doctrine || {};
const missionCards = missions
  .slice(0, 6)
  .map((m, i) => {
    const theme = [T.red, T.blue, T.yellow][i % 3];
    return `    <div class="card">
      <div class="k"><span class="dot" style="background:${theme}"></span>MISI ${String(i + 1).padStart(2, '0')} · ${esc((m.organs || [])[0] || '')}</div>
      <h3>${esc(m.verb)} — ${esc(m.one_line || '')}</h3>
      <p>"${esc(m.human_says || '')}"</p>
    </div>`;
  })
  .join('\n');

writeRoute(
  'work',
  shell({
    title: 'Work — Missions & Wells · Arif Fazil',
    description: 'Kerja sebenar — missions, wells, proof. Bukan portfolio, tapi receipts.',
    canonical: 'https://arif-fazil.com/work/',
    trioWord: 'WORK',
    trail: `<a href="/">HOME</a> / <b>WORK</b>`,
    body: `
  <section class="hero">
    <h1>Kerja<br><span class="c-b">Buktinya</span><br><span class="c-r">Ada.</span> <span class="c-y">Baca.</span></h1>
    <p class="sub">${esc(doctrine.thesis || 'Kerja yang membina telaga penerokaan, misi, dan proof. Bukan hiasan.')}</p>
    <div class="tags"><span>MISSIONS</span><span>WELLS</span><span>PROOF</span><span>VAULT</span></div>
  </section>
  <div class="stats">
    <div><b class="c-r">${missions.length}</b><span>Misi</span></div>
    <div><b class="c-b">2</b><span>Telaga Dalam</span></div>
    <div><b class="c-y">999</b><span>Seal Standard</span></div>
    <div><b class="c-r">1</b><span>Geologist</span></div>
  </div>
  <div class="quote">
    <p>"${esc((doctrine.human_only || ['Human decides. Machine computes.'])[0])}"</p>
    <div class="who">— HANYA MANUSIA BUAT · ${esc(doctrine.metric || 'F13')}</div>
  </div>
  <div class="section-h"><span class="dot" style="background:${T.blue}"></span>MISI</div>
  <div class="cards">
${missionCards || '<div class="card"><h3>Missions loading…</h3></div>'}
  </div>
  <div class="section-h"><span class="dot" style="background:${T.yellow}"></span>PROOF</div>
  <div class="cards">
    <div class="card">
      <div class="k"><span class="dot d-r"></span>VAULT</div>
      <h3><a href="/999/">999 Vault</a></h3>
      <p>Resit immutable untuk setiap keputusan.</p>
      <a class="go" href="/999/">Buka →</a>
    </div>
    <div class="card">
      <div class="k"><span class="dot d-b"></span>MESIN</div>
      <h3><a href="/missions.json">missions.json</a></h3>
      <p>Katalog mesin untuk ejen.</p>
      <a class="go" href="/missions.json">JSON →</a>
    </div>
  </div>`,
  }),
);

/* ══ WORLD — hub, primer family ═══════════════════════════ */
writeRoute(
  'world',
  shell({
    title: 'World — MakcikGPT & Terminals · Arif Fazil',
    description: 'Dunia sebenar — kewartawanan sivik BM dan terminal komoditi.',
    canonical: 'https://arif-fazil.com/world/',
    trioWord: 'WORLD',
    trail: `<a href="/">HOME</a> / <b>WORLD</b>`,
    body: `
  <section class="hero">
    <h1>Dunia<br><span class="c-b">Tanya.</span><br><span class="c-r">Jawab</span> <span class="c-y">Berani.</span></h1>
    <p class="sub">Apa yang sebenarnya berlaku — MakcikGPT kewartawanan sivik dan terminal komoditi langsung.</p>
    <div class="tags"><span>SIVIK</span><span>KOMODITI</span><span>POLITIK</span><span>KEDAULATAN</span></div>
  </section>
  <div class="stats">
    <div><b class="c-r">●</b><span>MakcikGPT</span></div>
    <div><b class="c-b">5</b><span>Terminal</span></div>
    <div><b class="c-y">24/7</b><span>Live</span></div>
    <div><b class="c-r">BM</b><span>Bahasa</span></div>
  </div>
  <div class="section-h"><span class="dot" style="background:${T.red}"></span>UTAMA</div>
  <div class="cards">
    <div class="card">
      <div class="k"><span class="dot d-r"></span>MAKCIKGPT · KIVILIK</div>
      <h3><a href="/world/makcikgpt/">Makcik Tanya. Kuasa Jawab.</a></h3>
      <p>Kewartawanan siasatan sivik dalam Bahasa Makcik.</p>
      <a class="go" href="/world/makcikgpt/">Baca →</a>
    </div>
    <div class="card">
      <div class="k"><span class="dot d-y"></span>ECONOMICS · WEALTH</div>
      <h3><a href="/economics/">Briefing modal harian</a></h3>
      <p>KLCI, ringgit, Brent — bukan vibes.</p>
      <a class="go" href="/economics/">Buka →</a>
    </div>
  </div>
  <div class="section-h"><span class="dot" style="background:${T.blue}"></span>TERMINAL KOMODITI</div>
  <div class="cards">
    <div class="card">
      <div class="k"><span class="dot d-b"></span>OIL · GAS · GOLD</div>
      <h3><a href="/oil/">Minyak</a> · <a href="/gas/">Gas</a> · <a href="/gold/">Emas</a></h3>
      <p>Harga langsung, tarikh segar.</p>
    </div>
    <div class="card">
      <div class="k"><span class="dot d-r"></span>KLCI · USD/MYR</div>
      <h3><a href="/klci/">KLCI</a> · <a href="/usdmyr/">Ringgit</a></h3>
      <p>Pasaran Malaysia, pantas.</p>
    </div>
  </div>`,
  }),
);

console.log('primer-shells: done');
