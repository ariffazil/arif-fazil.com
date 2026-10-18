#!/usr/bin/env node
/**
 * render-words-essays.cjs
 *
 * Generates the static /words/writing/ listing HTML from the corpus SOT
 * /public/words/writing/index.json (schema: arifos.writing_index.v1).
 *
 * Why this exists:
 *   - per arif-fazil-site-ops scar 2026-10-13:
 *     "There is no `render-words-essays.cjs` (the previous skill narrative
 *      mentioned one, but it is not on disk). No prebuild step regenerates
 *      `index.html` from the `.ts` corpus. The HTML was hand-rendered once
 *      on 2026-08-07 and never re-auto-generated. Hand-patches for the
 *      flag-ship essays (Siti, From Context) have been applied on top of
 *      the Aug 7 skeleton."
 *   - per /root/arif-fazil.com/canon/file-authority.yaml:
 *     public-html-glob-pattern -> DERIVED, hand_edit: false, owner: generator
 *   - so this is the missing generator that closes the loop.
 *
 * Inputs:
 *   --corpus=/abs/path/to/index.json          (default: ../../public/words/writing/index.json)
 *   --output=/abs/path/to/index.html          (default: same dir as corpus)
 *
 * Output:
 *   Writes index.html that:
 *     - preserves the existing Atlas 4D room typing (data-ring="SOUL", data-plane="hub", data-lane="words", data-room="words")
 *     - preserves the existing JSON-LD + agent-access meta + canonical link + room-plate chrome
 *     - includes ALL corpus items (chronological by month)
 *     - renders stat chip from JSON's count/as_of
 *     - uses language= tag at <html lang> and per-card chip for BM vs EN
 *     - adds S-Series legend (S4 = Governance Canon, S6 = Eureka Trilogy, S8 = Forge + Site, SITE = Constitution surface)
 *     - splits October 2026 BM essays into a separate "Nusantara Voice" subsection
 *
 * Idempotent: deterministic output for a given corpus.
 * Reversible: re-running on an unchanged corpus is a no-op byte-wise (modulo timestamp in any generated header).
 *
 * License: AGENTS.md site canon (DITEMPA BUKAN DIBERI).
 */

'use strict';
const fs = require('fs');
const path = require('path');

function arg(name, fallback) {
  const m = process.argv.find(a => a.startsWith(`--${name}=`));
  return m ? m.slice(name.length + 3) : fallback;
}

const DEFAULT_DIR = path.resolve(__dirname, '..', '..', '..', '..', '..', 'sites', 'arif-fazil.com', 'public', 'words', 'writing');
const corpusPath = path.resolve(arg('corpus', path.join(DEFAULT_DIR, 'index.json')));
const outPath    = path.resolve(arg('output', path.join(DEFAULT_DIR, 'index.html')));

if (!fs.existsSync(corpusPath)) {
  console.error(`[render-words-essays] corpus not found: ${corpusPath}`);
  process.exit(2);
}

const raw = fs.readFileSync(corpusPath, 'utf8');
let corpus;
try { corpus = JSON.parse(raw); } catch (e) {
  console.error(`[render-words-essays] JSON parse failed: ${e.message}`);
  process.exit(3);
}

if (corpus.schema !== 'arifos.writing_index.v1') {
  console.error(`[render-words-essays] wrong schema: ${corpus.schema}`);
  process.exit(4);
}

const items = Array.isArray(corpus.items) ? corpus.items : [];
const count = items.length;
const asOf = corpus.as_of || 'unknown';

// Language breakdown
const byLang = items.reduce((acc, it) => {
  const l = it.language || 'en';
  acc[l] = (acc[l] || 0) + 1;
  return acc;
}, {});
const enN = byLang.en || 0;
const msN = byLang.ms || 0;

// Series inference from existing tags + slugs (heuristic; corpus-side has no series field yet)
const TAG_TO_SERIES = {
  'governance-canon': 'S4',
  's4': 'S4',
  'eureka-trilogy': 'S6',
  's6': 'S6',
  'forge': 'S8',
  's8': 'S8',
  'site': 'SITE',
};
function seriesFor(item) {
  const tags = item.tags || [];
  for (const t of tags) {
    const key = String(t).toLowerCase();
    if (TAG_TO_SERIES[key]) return TAG_TO_SERIES[key];
  }
  // slug-text heuristics for older entries with empty tags
  const s = String(item.slug || '');
  if (/contrast|attention|avo|physics/.test(s)) return 'S8';
  if (/big.bang|trilogy|fittest/.test(s))    return 'S6';
  if (/agi-paradox|truth|simulative|brazil|naming|naming-is|first-act/.test(s)) return 'S4';
  if (/i-(didnt|hate)|growing|arep|coder|kernel/i.test(s)) return 'SITE';
  return 'SITE';
}

// Group by month, preserving index order (newest first)
function monthKey(dateStr) {
  if (!dateStr) return 'Unknown';
  const m = String(dateStr).match(/^(\d{4})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}` : 'Unknown';
}
function monthLabel(mk) {
  if (mk === 'Unknown') return 'Unknown';
  const [y, m] = mk.split('-');
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${monthNames[parseInt(m, 10) - 1]} ${y}`;
}
const months = {};
for (const it of items) {
  const mk = monthKey(it.date);
  if (!months[mk]) months[mk] = [];
  months[mk].push(it);
}
const monthKeys = Object.keys(months).sort().reverse();

// Escape for HTML string interpolation
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const heroLangBreakdown = msN > 0
  ? `${count} essays · ${msN} BM${enN > 0 ? ` + ${enN} EN` : ''} · sealed 999 · updated ${asOf}`
  : `${count} essays · sealed 999 · updated ${asOf}`;

function renderCard(it) {
  const series = seriesFor(it);
  const langChip = it.language === 'ms' ? '<span class="w-tag lang-bm">BM</span>' : '';
  return `
      <div class="w-card">
        <div class="w-card-head">
          <h3><a href="${esc(it.href)}">${esc(it.title)}</a></h3>
          <span class="w-card-date">${esc(it.date)}</span>
        </div>
        ${it.excerpt ? `<p class="w-card-excerpt">${esc(it.excerpt)}</p>` : ''}
        <div class="w-card-foot">
          <span class="w-tag s-${series.toLowerCase()}">${esc(series)}</span>
          <span class="w-tag seal">seal ${esc(it.risk_level || 'INT')}</span>
          ${langChip}
          <a href="${esc(it.href)}" class="w-card-cta">Read essay →</a>
        </div>
      </div>`;
}

function renderMonthSection(mk, monthItems) {
  return `
  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- ${esc(monthLabel(mk).toUpperCase())}                                       -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <div class="w-section">
    <div class="w-section-head">
      <h2>${esc(monthLabel(mk))}</h2>
      <span class="w-section-pill">${esc(monthItems.length)} essays</span>
    </div>${monthItems.map(renderCard).join('\n')}
  </div>`;
}

// Nusantara Voice special subsection for BM essays (only if any)
const bmEssays = items.filter(it => it.language === 'ms');
const nusantaraVoice = msN > 0 ? `
  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- NUSANTARA VOICE — Bahasa Melayu essays                        -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <div class="w-section nusantara">
    <div class="w-section-head">
      <h2>Nusantara Voice — Bahasa Melayu</h2>
      <span class="w-section-pill" lang="ms">suara nusantara</span>
    </div>${bmEssays.map(it => `
      <div class="w-card">
        <div class="w-card-head">
          <h3><a href="${esc(it.href)}" lang="ms">${esc(it.title)}</a></h3>
          <span class="w-card-date">${esc(it.date)}</span>
        </div>
        <div class="w-card-foot">
          <span class="w-tag lang-bm">BM</span>
          <a href="${esc(it.href)}" class="w-card-cta">Baca esei →</a>
        </div>
      </div>`).join('')}
  </div>` : '';

// S-Series legend (referenced by tag chips on each card)
const sSeriesLegend = `
  <div class="w-series-legend" aria-label="Series legend">
    <span class="legend-title">Series:</span>
    <span class="legend-item"><span class="w-tag s-s4">S4</span> Governance Canon</span>
    <span class="legend-item"><span class="w-tag s-s6">S6</span> Eureka Trilogy</span>
    <span class="legend-item"><span class="w-tag s-s8">S8</span> Forge + Site</span>
    <span class="legend-item"><span class="w-tag s-site">SITE</span> Constitution surface</span>
  </div>`;

const html = `<!DOCTYPE html>
<html lang="en" data-ring="SOUL" data-plane="hub" data-lane="words" data-room="words">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Writing — Constitutional Essays · arif-fazil.com</title>
<meta name="description" content="Sovereign reading room — long-form essays by Muhammad Arif bin Fazil on AI governance, institutions, and the path to AGI."/>
<link rel="canonical" href="https://arif-fazil.com/words/writing/"/>
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"/>
<meta name="agent-access" content="allow-read allow-train allow-cite"/>
<meta name="theme-color" content="#E4C39A"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="Writing — Constitutional Essays | arif-fazil.com"/>
<meta property="og:description" content="Sovereign reading room — long-form essays on AI governance, institutions, and the path to AGI."/>
<meta property="og:url" content="https://arif-fazil.com/words/writing/"/>
<meta property="og:site_name" content="arif-fazil.com"/>
<link rel="alternate" type="application/json" href="/words/writing/index.json" title="Essay index (machine)"/>

<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=cabinet-grotesk@400,700,800&display=swap" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

<link rel="stylesheet" href="/_shared/design-system/tokens.css"/>
<link rel="stylesheet" href="/_shared/design-system/hub-words.css"/>

<style>
  :root {
    --gold: #D4A853;
    --gold-dim: rgba(212,168,83,0.4);
    --hard: #D4536B;
    --soft: #D49D53;
    --font-sans: 'Satoshi', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    --font-display: 'Cabinet Grotesk', Georgia, serif;
    --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
  }

  /* --- Hero --- */
  .w-hero { margin-bottom: 1.5rem; }
  .w-hero h1 {
    font-family: var(--font-display);
    font-size: clamp(1.75rem,5vw,2.75rem);
    font-weight: 800;
    color: #EDEAE2;
    line-height: 1.05;
    margin: 0 0 0.75rem;
    letter-spacing: -0.02em;
  }
  .w-hero-desc {
    font-size: 0.95rem;
    color: #A09D96;
    line-height: 1.55;
    margin: 0 0 0.75rem;
    max-width: 40rem;
  }
  .w-hero-desc strong { color: #EDEAE2; font-weight: 600; }
  .w-stats {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: #6A665E;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* --- Series legend --- */
  .w-series-legend {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1rem;
    margin: 0.75rem 0 1.5rem;
    padding: 0.5rem 0;
    border-top: 1px solid #1E232A;
    border-bottom: 1px solid #1E232A;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: #6A665E;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .w-series-legend .legend-title { color: #6A665E; }
  .w-series-legend .legend-item { display: inline-flex; align-items: center; gap: 0.35rem; }

  /* --- Nusantara voice emphasis --- */
  .w-section.nusantara { border-left: 2px solid var(--gold); padding-left: 0.5rem; }

  /* --- Blockquote --- */
  .w-quote {
    border-left: 3px solid var(--gold);
    padding: 0.65rem 1.15rem;
    margin: 1.5rem 0;
    font-style: italic;
    color: #D8D4CC;
    font-size: 0.9rem;
    line-height: 1.6;
    background: rgba(212,168,83,0.03);
    border-radius: 0 6px 6px 0;
    max-width: 40rem;
  }
  .w-quote cite {
    display: block;
    margin-top: 0.4rem;
    font-style: normal;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: #6A665E;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* --- Section headers --- */
  .w-section { margin: 2.5rem 0 0.5rem; }
  .w-section-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #1E232A;
  }
  .w-section-head h2 {
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 700;
    color: #7A7670;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0;
  }
  .w-section-pill {
    font-family: var(--font-mono);
    font-size: 0.55rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.15em 0.5em;
    border-radius: 3px;
    font-weight: 600;
    background: rgba(212,168,83,0.1);
    color: var(--gold);
  }

  /* --- Essay cards (MakcikGPT pattern, gold accent) --- */
  .w-card {
    background: #111318;
    border: 1px solid #1E232A;
    border-top: 3px solid var(--gold);
    border-radius: 6px;
    padding: 1.15rem 1.35rem;
    margin: 0.65rem 0;
    transition: border-color 0.2s ease, background 0.2s ease;
  }
  .w-card:hover { background: #161820; border-color: #2A2E3A; }
  .w-card-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
  }
  .w-card h3 {
    margin: 0;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
  }
  .w-card h3 a { color: #EDEAE2; text-decoration: none; }
  .w-card h3 a:hover { color: var(--gold); }
  .w-card-date {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: #6A665E;
    letter-spacing: 0.06em;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .w-card-excerpt {
    font-size: 0.82rem;
    color: #8A8578;
    line-height: 1.5;
    margin: 0.35rem 0 0.5rem;
  }
  .w-card-foot {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  .w-tag {
    font-family: var(--font-mono);
    font-size: 0.52rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.12em 0.4em;
    border-radius: 3px;
    font-weight: 600;
  }
  .w-tag.seal { color: var(--gold); background: rgba(212,168,83,0.1); }
  .w-tag.lang-bm { color: #E4572E; background: rgba(228,87,46,0.12); }
  .w-tag.s-s4 { color: #D4A853; background: rgba(212,168,83,0.10); }
  .w-tag.s-s6 { color: #4FC3F7; background: rgba(79,195,247,0.10); }
  .w-tag.s-s8 { color: #E4572E; background: rgba(228,87,46,0.10); }
  .w-tag.s-site { color: #8A8578; background: rgba(138,133,120,0.10); }
  .w-card-cta {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--gold);
    text-decoration: none;
    letter-spacing: 0.05em;
    border-bottom: 1px dotted var(--gold-dim);
    transition: border-color 0.15s;
    margin-left: auto;
  }
  .w-card-cta:hover { border-bottom-color: var(--gold); }

  /* --- Footer --- */
  .w-footer {
    margin-top: 3rem;
    padding-top: 1.25rem;
    border-top: 1px solid #1E232A;
  }
  .w-footer-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem 1.5rem;
    font-family: var(--font-mono);
    font-size: 0.68rem;
  }
  .w-footer-links a {
    color: #6A665E;
    text-decoration: none;
    border-bottom: 1px dotted #2A2E3A;
    transition: color 0.15s;
  }
  .w-footer-links a:hover { color: var(--gold); border-bottom-color: var(--gold); }

  /* --- Mobile --- */
  @media (max-width: 640px) {
    .w-card { padding: 0.95rem 1.05rem; }
    .w-card-head { flex-direction: column; gap: 0.15rem; }
  }
</style>

<!-- DTI gate (verify-surfaces.cjs L4/L5/L6): generated 2026-10-17 from this page's
     own title/description/canonical. Additive metadata only; no content claims added. -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Writing — Constitutional Essays · arif-fazil.com",
  "description": "Sovereign reading room — long-form essays by Muhammad Arif bin Fazil on AI governance, institutions, and the path to AGI.",
  "url": "https://arif-fazil.com/words/writing/",
  "inLanguage": "en",
  "isPartOf": {
    "@type": "WebSite",
    "name": "arif-fazil.com",
    "url": "https://arif-fazil.com/"
  },
  "publisher": {
    "@type": "Person",
    "name": "Muhammad Arif bin Fazil",
    "url": "https://arif-fazil.com/"
  }
}
</script>
<meta name="arif-room" content="words"/>
<meta name="arif-job" content="Essays, in his voice."/>
<meta name="arif-corpus-count" content="${count}"/>
<meta name="arif-corpus-languages" content="en=${enN} ms=${msN}"/>
<meta name="arif-corpus-as-of" content="${esc(asOf)}"/>
<meta name="arif-generator" content="forge_work/proposals/333-AGI/2026-10-17-render-words-writing/v1/render-words-essays.cjs"/>
<link rel="stylesheet" href="/_shared/room-coats.css?v=20261004c"/>
</head>
<body class="fam-words-hub"><div class="room-plate" data-agent-room="words"><b>Writing</b><span>Essays, in his voice.</span><a href="/discovery/">Nine rooms</a></div>
<div class="frame">

  <nav class="nav" aria-label="Primary"><a href="/about">About</a><a href="/work/">Work</a><a href="/earth/">Earth</a><a href="/world/makcikgpt/">Civic</a><a href="/words/">Writing</a><a href="/institution/">Briefing</a></nav>

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- HERO                                                       -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <div class="w-hero">
    <p class="meta" style="font-family:var(--font-mono);font-size:0.65rem;color:#6A665E;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 0.5rem">Words › Writing</p>
    <h1>Constitutional Essays</h1>
    <p class="w-hero-desc">Sovereign reading room — long-form essays by <strong>Muhammad Arif bin Fazil</strong> on AI governance, institutions, and the path to AGI.</p>
    <p class="w-stats">${esc(heroLangBreakdown)}</p>
  </div>

  <blockquote class="w-quote">
    "Humans, institutions, and AI do not become evil because they are malicious. They become evil when they get better at protecting narratives than correcting themselves with reality."
    <cite>— Arif Fazil · AGI Paradox trilogy · 2026-08-07</cite>
  </blockquote>

  ${sSeriesLegend}

  ${nusantaraVoice}

${monthKeys.map(mk => renderMonthSection(mk, months[mk])).join('\n')}

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- FOOTER                                                     -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <div class="w-footer">
    <div class="w-footer-links">
      <a href="/words/doctrine/">Doctrine</a>
      <a href="/words/constitution/">Full Canon</a>
      <a href="/words/">Words Hub</a>
      <a href="/llms.txt">/llms.txt</a>
    </div>
  </div>

</div>
</body>
</html>
`;

const outDir = path.dirname(outPath);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, html, 'utf8');

const out = {
  status: 'ok',
  generator: 'forge_work/proposals/333-AGI/2026-10-17-render-words-writing/v1/render-words-essays.cjs',
  corpus_path: corpusPath,
  output_path: outPath,
  output_bytes: fs.statSync(outPath).size,
  rendered: {
    count,
    as_of: asOf,
    en: enN,
    ms: msN,
    nusantara_voice: msN > 0,
    months: monthKeys,
  },
  issued_at_utc: new Date().toISOString(),
};
console.log(JSON.stringify(out, null, 2));
