#!/usr/bin/env node
/**
 * generate-agent-shells.cjs
 * Content-first HTML for SPA routes so agents/crawlers get real text without JS.
 * Writes under public/<route>/index.html (copied to dist on build).
 * Doctrine: agentic web — pages are for humans AND agents (F2 TRUTH).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

function readJson(p, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtNum(v, digits = 2) {
  if (v == null || v === '' || v === '—') return '—';
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  return n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}



function shell({ title, description, canonical, body, ring = 'SOUL', ogImage = 'https://arif-fazil.com/og-identity.png', extraStyle = '', breadcrumb = '' }) {
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": canonical
  }, null, 2);

  return `<!DOCTYPE html>
<html lang="en" data-ring="${esc(ring)}" data-agent-surface="content-first">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${esc(ogImage)}" />
  <meta property="og:type" content="website" />
  <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
  <meta name="agent-access" content="allow-read allow-train allow-cite" />
  <link rel="ard" type="application/json" href="/.well-known/ard.json" />
  <link rel="ai-catalog" type="application/json" href="/.well-known/ai-catalog.json" />
  <script type="application/ld+json">
${jsonLd}
  </script>
  <link rel="stylesheet" href="/_shared/design-system/tokens.css" />
  <link rel="alternate" type="text/plain" href="/llms.txt" title="Machine overview" />
  <link rel="alternate" type="application/json" href="/missions.json" title="Missions catalog" />
  <style>
    body{margin:0;background:var(--bg-narrative,#0B0B0F);color:var(--text-primary,#F5F5F7);
      font-family:var(--font-sans,system-ui,sans-serif);line-height:1.55}
    .frame{max-width:54rem;margin:0 auto;padding:2rem 1.25rem 4rem}
    a{color:var(--gold-sovereign,#E8B84B)} a:hover{color:#fff}
    h1{font-family:var(--font-display,serif);font-size:clamp(1.75rem,5vw,2.5rem);line-height:1.1;margin:0 0 1rem}
    h2{font-size:1.15rem;margin:2rem 0 .75rem;text-transform:uppercase;letter-spacing:.06em}
    .meta{font-family:var(--font-mono,monospace);font-size:.7rem;color:#8a8378;text-transform:uppercase;letter-spacing:.1em;margin-bottom:1rem}
    .card{border:1px solid #2a2a3a;border-radius:8px;padding:1rem 1.15rem;margin:.75rem 0;background:rgba(255,255,255,.02)}
    .nav{display:flex;flex-wrap:wrap;gap:.75rem 1.25rem;margin:1.5rem 0;font-family:var(--font-mono,monospace);font-size:.72rem;text-transform:uppercase}
    ul{padding-left:1.2rem} li{margin:.35rem 0}
    .note{font-size:.85rem;color:#9a958c;border-left:2px solid #2a2a3a;padding-left:.85rem;margin-top:2rem}
${extraStyle}
  </style>
</head>
<body>
  <div class="frame">
${breadcrumb ? `    ${breadcrumb}\n` : ''}    <nav class="nav" aria-label="Primary">
      <a href="/">Home</a>
      <a href="/earth">Earth</a>
      <a href="/economics">Economics</a>
      <a href="/world">World</a>
      <a href="/writing">Writing</a>
      <a href="/doctrine">Doctrine</a>
      <a href="/missions">Missions</a>
      <a href="/999/">999</a>
      <a href="/vitals/">VITALS</a>
      <a href="/llms.txt">llms.txt</a>
    </nav>
${body}
    <p class="note">Content-first surface for humans and agents (no JavaScript required).
      Machine catalog: <a href="/missions.json">/missions.json</a> ·
      Overview: <a href="/llms.txt">/llms.txt</a> ·
      MCP: <a href="https://mcp.arif-fazil.com/mcp">mcp.arif-fazil.com/mcp</a>.
      Training and citation permitted with attribution (see <a href="/rsl.xml">/rsl.xml</a>).</p>
  </div>
</body>
</html>
`;
}

// Routes whose index.html is HAND-AUTHORED and must never be regenerated.
// The generator is not the owner of these pages; it only fills the ones nobody
// curated. Second half of the same law as STATIC_INDEX_ALLOWLIST in
// copy-static-html.js — both answer "who owns this file?".
//
// /world/ — the curation hub. A generator shell was overwriting it on EVERY
// build (3.8 KB shell replacing a 148 KB curated page). dist/ is gitignored, so
// the overwrite left no diff and the hub appeared to vanish on its own. That is
// why "world feel not singular": the singularity was being rebuilt away
// (diagnosed 2026-09-18, commit 68aafb5 authored the hub, next build erased it).
const PRESERVED_ROUTES = new Set([
  'world',
]);

function writeRoute(route, html) {
  const dir = path.join(PUBLIC, route);
  const out = path.join(dir, 'index.html');
  if (PRESERVED_ROUTES.has(route)) {
    const existing = fs.existsSync(out) ? fs.readFileSync(out, 'utf8').length : 0;
    console.log(`preserved (hand-authored, not regenerated): /${route} — ${existing} bytes kept`);
    return;
  }
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(out, html);
  console.log('wrote', out, html.length, 'bytes');
}

// ── Missions ──────────────────────────────────────────────
const missionsDoc = readJson(path.join(PUBLIC, 'missions.json'), {});
const missionList = missionsDoc.missions || [];
const doctrine = missionsDoc.doctrine || {};
writeRoute(
  'missions',
  shell({
    title: 'Missions — Six verbs · Arif Fazil',
    description: doctrine.title || 'Six missions. Not 128 tools.',
    canonical: 'https://arif-fazil.com/missions/',
    ring: 'MIND',
    body: `
    <p class="meta">Cockpit · agent-readable</p>
    <h1>${esc(doctrine.title || 'Six missions. Not 128 tools.')}</h1>
    <p>${esc(doctrine.thesis || '')}</p>
    <p><strong>Metric:</strong> ${esc(doctrine.metric || '')}</p>
    <h2>What only the human does</h2>
    <ul>${(doctrine.human_only || []).map((x) => `<li>${esc(x)}</li>`).join('\n')}</ul>
    <h2>The six missions</h2>
    ${missionList
      .map(
        (m) => `<article class="card" id="${esc(m.id)}">
      <h2>${esc(m.verb)} — ${esc(m.one_line)}</h2>
      <p><strong>You ask:</strong> ${esc(m.human_says)}</p>
      <p><strong>Organs:</strong> ${(m.organs || []).map(esc).join(' · ')}</p>
    </article>`,
      )
      .join('\n')}
    <p class="meta">Machine twin: <a href="/missions.json">/missions.json</a></p>
`,
  }),
);

// ── Doctrine ──────────────────────────────────────────────
const floorsDoc = readJson(path.join(PUBLIC, 'floors.json')) ||
  readJson(path.join('/var/www/html/arif', 'floors.json'), { floors: [] });
const floors = floorsDoc.floors || [];
writeRoute(
  'doctrine',
  shell({
    title: 'Doctrine — F1–F13 · Federation · Arif Fazil',
    description:
      'Constitutional floors and federation organs. Hard violation → VOID. F13 human veto is final.',
    canonical: 'https://arif-fazil.com/doctrine/',
    ring: 'SOUL',
    body: `
    <p class="meta">Constitution · agent-readable</p>
    <h1>Doctrine</h1>
    <p>arifOS is a constitutional governance kernel. AI executes under floors; humans decide.
      <strong>Ditempa bukan diberi</strong> — forged, not given.</p>
    <h2>F1–F13 floors</h2>
    ${floors
      .map(
        (f) => `<div class="card"><strong>${esc(f.id)} ${esc(f.name)}</strong>
      <span class="meta"> · ${esc(f.type)}</span>
      <p>${esc(f.one_liner || f.desc || '')}</p></div>`,
      )
      .join('\n')}
    <h2>Federation organs</h2>
    <ul>
      <li><a href="https://arifos.arif-fazil.com">arifOS</a> — governance kernel</li>
      <li><a href="https://geox.arif-fazil.com">GEOX</a> — earth intelligence</li>
      <li><a href="/economics">WEALTH surface</a> — capital briefing</li>
      <li><a href="https://well.arif-fazil.com">WELL</a> — vitality reflection</li>
      <li><a href="https://mcp.arif-fazil.com">MCP</a> — agent door</li>
    </ul>
    <p>Deep docs: <a href="https://github.com/ariffazil/arifOS/tree/main/docs">GitHub docs</a> ·
      live floors: <a href="/floors.json">/floors.json</a></p>
`,
  }),
);

// ── Economics ─────────────────────────────────────────────
const wealth =
  readJson(path.join(PUBLIC, 'data/wealth/latest.json')) ||
  readJson('/var/www/html/arif/data/wealth/latest.json', {});
const meta = wealth.meta || {};
const bursa = wealth.bursa || {};
const ringgit = wealth.ringgit || {};
const oil = wealth.oil_energy || {};
const soWhat = wealth.so_what || [];
writeRoute(
  'economics',
  shell({
    title: 'Economics — Capital briefing · Arif Fazil',
    description:
      'Daily Malaysia capital briefing — KLCI, ringgit, oil. Evidence-gated. WEALTH computes; human decides.',
    canonical: 'https://arif-fazil.com/economics/',
    ring: 'BODY',
    body: `
    <p class="meta">WEALTH · agent-readable · as of ${esc(meta.date || meta.generated_at || 'unknown')}</p>
    <h1>Economics</h1>
    <p>Capital intelligence for Malaysia — markets and transmission, not vibes.
      Source: ${esc(meta.source || 'WEALTH')}</p>
    <div class="card">
      <h2>Live snapshot</h2>
      <ul>
        <li>KLCI: ${fmtNum(bursa.klci_close ?? bursa.klci_quote?.value)}
          ${bursa.klci_change_pct != null ? `(${fmtNum(bursa.klci_change_pct, 2)}%)` : ''}</li>
        <li>USD/MYR: ${fmtNum(ringgit.usd_myr, 4)} · ${esc(ringgit.trend || '')}</li>
        <li>Brent: ${oil.brent_price != null ? '$' + fmtNum(oil.brent_price, 2) : '—'}</li>
      </ul>
    </div>
    <h2>So what</h2>
    ${
      soWhat.length
        ? soWhat
            .slice(0, 8)
            .map(
              (s) => `<div class="card"><strong>${esc(s.domain || s.tone || 'signal')}</strong>
        <p>${esc(s.signal || '')}</p></div>`,
            )
            .join('\n')
        : '<p>See machine feed: <a href="/data/wealth/latest.json">/data/wealth/latest.json</a></p>'
    }
    <h2>Related terminals</h2>
    <ul>
      <li><a href="/oil/">Oil</a> · <a href="/gas/">Gas</a> · <a href="/gold/">Gold</a></li>
      <li><a href="/klci/">KLCI</a> · <a href="/usdmyr/">USD/MYR</a></li>
      <li><a href="/vitals/">PETRONAS VITALS</a></li>
    </ul>
    <p class="meta">Machine: <a href="/data/wealth/latest.json">latest.json</a></p>
`,
  }),
);

// ── World ─────────────────────────────────────────────────
writeRoute(
  'world',
  shell({
    title: 'World — MakcikGPT · Commodities · Arif Fazil',
    description:
      'Civic journalism in Bahasa Makcik plus commodity dashboards (oil, gas, gold).',
    canonical: 'https://arif-fazil.com/world/',
    ring: 'BODY',
    body: `
    <p class="meta">Civic + commodities · agent-readable</p>
    <h1>World</h1>
    <p>What is actually happening — MakcikGPT civic journalism and commodity terminals.</p>
    <div class="card">
      <h2>MakcikGPT</h2>
      <p>Bahasa civic intelligence on sovereignty, resources, and power.</p>
      <p><a href="/world/makcikgpt/">Browse articles →</a></p>
    </div>
    <div class="card">
      <h2>Commodity dashboards</h2>
      <ul>
        <li><a href="/oil/">Oil (Brent)</a></li>
        <li><a href="/gas/">Natural gas</a></li>
        <li><a href="/gold/">Gold</a></li>
        <li><a href="/klci/">FBM KLCI</a></li>
        <li><a href="/usdmyr/">USD/MYR</a></li>
      </ul>
    </div>
    <div class="card">
      <h2>Politics (secondary)</h2>
      <ul>
        <li><a href="/politics/">Geopolitics hub</a></li>
        <li><a href="/politics/ns-election/">NS election map</a></li>
        <li><a href="/politics/shadow/">Shadow PMs</a></li>
      </ul>
    </div>
`,
  }),
);

// ── World MakcikGPT ───────────────────────────────────────
const { getMakcikSource } = require('./lib/makcik-source.cjs');
let makcikPieces = [];
try {
  makcikPieces = getMakcikSource().pieces;
} catch {
  makcikPieces = [];
}

const makcikList = makcikPieces
  .map(
    (p, idx) => {
      const colors = [
        { border: '#38BDF8', badge: 'rgba(56,189,248,0.15)', text: '#38BDF8' },
        { border: '#EF4444', badge: 'rgba(239,68,68,0.15)', text: '#EF4444' },
        { border: '#EAB308', badge: 'rgba(234,179,8,0.15)', text: '#EAB308' },
      ];
      const theme = colors[idx % 3];
      return `<article class="card" style="border: 1px solid ${theme.border}66; border-left: 4px solid ${theme.border}; background: #0F172A; margin-bottom: 1.5rem; padding: 1.5rem; border-radius: 4px;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-family: monospace; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; background: ${theme.badge}; color: ${theme.text}; padding: 2px 6px; border-radius: 2px;">
            ${esc(p.domain || 'CIVIC')}
          </span>
          <span style="font-family: monospace; font-size: 0.7rem; color: #94A3B8;">
            ${esc(p.date || '')} ${p.seal ? `· seal ${esc(p.seal)}` : ''}
          </span>
        </div>
        <h2 style="margin: 0.25rem 0 0.5rem 0; font-size: 1.35rem; font-weight: 900; text-transform: uppercase;">
          <a href="${esc(p.dest.path)}" style="color: #FFFFFF; text-decoration: none;">${esc(p.title)}</a>
        </h2>
        <p style="color: #94A3B8; font-size: 0.9rem; line-height: 1.5; margin: 0 0 1rem 0;">${esc(p.subtitle || p.excerpt || '')}</p>
        <a href="${esc(p.dest.path)}" style="font-family: monospace; font-size: 0.8rem; font-weight: bold; color: ${theme.text}; text-decoration: none;">Read article →</a>
      </article>`;
    }
  )
  .join('\n');

writeRoute(
  'world/makcikgpt',
  shell({
    title: 'MakcikGPT — Civic Intelligence in Bahasa Makcik · Arif Fazil',
    description:
      'Investigative journalism for jiran-jiran. When RM70 billion moves and nobody asks questions, MakcikGPT asks in Bahasa Makcik.',
    canonical: 'https://arif-fazil.com/world/makcikgpt/',
    ring: 'BODY',
    ogImage: 'https://arif-fazil.com/images/makcikgpt/makcikgpt-hero.jpg',
    breadcrumb: `<nav style="display:flex; align-items:center; gap:0.5rem; font-family:var(--font-mono, monospace); font-size:0.75rem; text-transform:uppercase; letter-spacing:0.08em; margin:0 0 1rem 0;" aria-label="Breadcrumb">
      <a href="/" style="color:#9CA3AF; text-decoration:none;">Arif Fazil</a>
      <span style="color:#4B5563;">/</span>
      <a href="/world" style="color:#9CA3AF; text-decoration:none;">World</a>
      <span style="color:#4B5563;">/</span>
      <span style="color:#E8B84B; font-weight:600;">MakcikGPT</span>
    </nav>`,
    extraStyle: `    .hero-container{margin-bottom:2.5rem;padding:2rem;background:linear-gradient(135deg, #0F172A 0%, #111827 100%);border:1px solid #1F2937;border-bottom:3px solid #E8B84B;border-radius:12px;overflow:hidden}
    .hero-grid{display:grid;grid-template-columns:1fr;gap:2rem;align-items:center}
    @media(min-width:768px){.hero-grid{grid-template-columns:1.2fr 1fr}}
    .hero-img{width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:8px;border:1px solid rgba(232,184,75,0.3);box-shadow:0 10px 25px -5px rgba(0,0,0,0.5)}
    .ladder{display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin:1.25rem 0;border-top:1px solid #1F2937;padding-top:1rem}
    .ladder-card{background:rgba(255,255,255,0.03);border:1px solid #1F2937;border-radius:6px;padding:0.6rem 0.75rem;text-decoration:none;display:block}
    .ladder-card.active{background:rgba(232,184,75,0.08);border-color:rgba(232,184,75,0.4)}
    .ladder-lvl{font-family:monospace;font-size:0.65rem;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em}
    .ladder-name{font-size:0.85rem;font-weight:bold;color:#F3F4F6;margin:2px 0}
    .ladder-sub{font-size:0.7rem;color:#9CA3AF}`,
    body: `
    <!-- Visual Hero: Attention Preservation & Information Architecture -->
    <div class="hero-container">
      <div class="hero-grid">
        <div>
          <div style="display:flex; flex-wrap:wrap; gap:0.5rem; align-items:center; margin-bottom:0.75rem;">
            <span style="font-family:monospace; font-size:0.7rem; font-weight:bold; padding:3px 8px; background:rgba(232,184,75,0.15); border:1px solid rgba(232,184,75,0.4); color:#E8B84B; border-radius:9999px;">
              MakcikGPT · Public Interface of World
            </span>
            <span style="font-family:monospace; font-size:0.7rem; padding:3px 8px; background:#1F2937; color:#9CA3AF; border-radius:9999px;">
              Civic Intelligence Layer
            </span>
          </div>

          <h1 style="font-size:2.5rem; font-weight:900; font-style:italic; text-transform:uppercase; margin:0 0 0.5rem 0; color:#FFFFFF; line-height:1.05;">
            Makcik<span style="color:#E8B84B;">GPT</span>
          </h1>

          <p style="font-style:italic; font-family:serif; color:#E8B84B; margin:0 0 0.75rem 0; font-size:1.05rem;">
            "Kewartawanan penyiasatan sivik untuk jiran-jiran."
          </p>

          <p style="font-size:0.92rem; color:#9CA3AF; margin:0 0 1rem 0; line-height:1.6;">
            Bila puluhan bilion ringgit dana negara beralih tangan, konsesi tenaga dipersoal, dan dasar ekonomi menyentuh poket rakyat tanpa penjelasan telus — MakcikGPT menyiasat dan merungkainya dalam Bahasa Makcik: mudah difahami, tajam berasaskan angka primer, sifar pintu tengah.
          </p>

          <!-- Semantic Ladder -->
          <div class="ladder">
            <a href="/" class="ladder-card">
              <div class="ladder-lvl">Level 1 · WHO</div>
              <div class="ladder-name">Arif Fazil</div>
              <div class="ladder-sub">Sovereign Identity</div>
            </a>
            <a href="/world" class="ladder-card">
              <div class="ladder-lvl">Level 2 · WHY</div>
              <div class="ladder-name">World</div>
              <div class="ladder-sub">Civic Intelligence</div>
            </a>
            <div class="ladder-card active">
              <div class="ladder-lvl" style="color:#E8B84B;">Level 3 · HOW</div>
              <div class="ladder-name" style="color:#E8B84B;">MakcikGPT</div>
              <div class="ladder-sub" style="color:#D1D5DB;">Citizen Interface</div>
            </div>
          </div>

          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; font-family:monospace; font-size:0.7rem;">
            <span style="padding:3px 8px; background:#111827; border:1px solid #1F2937; color:#9CA3AF; border-radius:4px;">⚡ ${makcikPieces.length} Artikel</span>
            <span style="padding:3px 8px; background:#111827; border:1px solid #1F2937; color:#9CA3AF; border-radius:4px;">🛡️ F1–F13 Berperlembagaan</span>
            <span style="padding:3px 8px; background:#111827; border:1px solid #1F2937; color:#9CA3AF; border-radius:4px;">📊 Data Primer Sahih</span>
            <span style="padding:3px 8px; background:#111827; border:1px solid #1F2937; color:#9CA3AF; border-radius:4px;">🔓 Sifar Paywall</span>
          </div>
        </div>

        <div>
          <img src="/images/makcikgpt/makcikgpt-hero.jpg" alt="MakcikGPT — Kecerdasan Sivik Rakyat dan Kewartawanan Data Awam" class="hero-img" loading="eager" />
        </div>
      </div>
    </div>
    ${makcikList}
`,
  }),
);

// ── Read ──────────────────────────────────────────────────
const essays = readJson(path.join(ROOT, 'src/data/essays.json'), []);
const essayLinks = Array.isArray(essays)
  ? essays
      .slice(0, 40)
      .map((e) => {
        const href = (e.dest && e.dest.path) || `/writing/${e.id || e.slug || ''}`;
        return `<li><a href="${esc(href)}">${esc(e.title)}</a>${e.date ? ` <span class="meta">· ${esc(e.date)}</span>` : ''}</li>`;
      })
      .join('\n')
  : '';
writeRoute(
  'read',
  shell({
    title: 'Read — Essays · Arif Fazil',
    description:
      'Sovereign reading room — essays on geology, AI governance, and building under uncertainty.',
    canonical: 'https://arif-fazil.com/read/',
    ring: 'SOUL',
    body: `
    <p class="meta">Reading room · agent-readable</p>
    <h1>Read</h1>
    <p>Essays and long-form notes. Full list also on <a href="/feed.xml">/feed.xml</a>.</p>
    <h2>Essays</h2>
    <ul>
${essayLinks}
    </ul>
    <p>Also: <a href="/world/makcikgpt/">MakcikGPT</a> · <a href="/doctrine">Doctrine</a></p>
`,
  }),
);

console.log('generate-agent-shells: done');
