// scripts/generate-wiki-index.cjs
// Deterministic generator: public/data/wiki-index.json -> public/words/wiki/index.html
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const jsonPath = path.join(root, 'public/data/wiki-index.json');
const htmlPath = path.join(root, 'public/words/wiki/index.html');

function renderWikiHtml(data) {
  const EPISTEMIC_COLORS = {
    OBSERVED: '#10B981',
    DERIVED: '#38BDF8',
    HISTORICAL: '#9AA0A8',
    INTERPRETATION: '#F59E0B',
  };

  const STATUS_COLORS = {
    CANONICAL: '#C9A227',
    PROVISIONAL: '#9AA0A8',
  };

  // Group entries by category preserving defined category order
  const categories = data.categories || [];
  const entriesByCategory = {};
  for (const cat of categories) {
    entriesByCategory[cat] = [];
  }
  for (const entry of data.entries || []) {
    if (!entriesByCategory[entry.category]) {
      entriesByCategory[entry.category] = [];
    }
    entriesByCategory[entry.category].push(entry);
  }

  let sectionsHtml = '';
  for (const cat of categories) {
    const items = entriesByCategory[cat] || [];
    if (items.length === 0) continue;

    let itemsHtml = '';
    for (const item of items) {
      const epColor = EPISTEMIC_COLORS[item.epistemic_class] || '#9AA0A8';
      const stColor = STATUS_COLORS[item.canonical_status] || '#9AA0A8';

      const lineageLinks = (item.links || [])
        .map(l => `<a href="${l}" style="color:#C9A227;text-decoration:underline;">${l}</a>`)
        .join(' · ');

      itemsHtml += `
        <div class="wiki-card" style="background:#11151C;border:1px solid #1F2733;border-radius:6px;padding:1.25rem;margin-bottom:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:0.5rem;">
            <h3 style="margin:0;font-size:1.1rem;color:#EDEAE2;">${item.title}</h3>
            <div style="font-size:0.75rem;">
              <span style="color:${epColor};border:1px solid ${epColor}44;padding:2px 6px;border-radius:3px;">${item.epistemic_class}</span>
              <span style="color:${stColor};border:1px solid ${stColor}44;padding:2px 6px;border-radius:3px;margin-left:4px;">${item.canonical_status}</span>
            </div>
          </div>
          <p style="color:#9AA0A8;font-size:0.875rem;line-height:1.5;margin:0 0 0.75rem;">${item.desc}</p>
          <div style="font-size:0.75rem;color:#6B7280;border-top:1px solid #1F2733;padding-top:0.5rem;">
            <div><strong>Source:</strong> ${item.source}</div>
            <div><strong>Updated:</strong> ${item.updated_at} | <strong>Lineage:</strong> ${lineageLinks}</div>
          </div>
        </div>`;
    }

    sectionsHtml += `
    <section style="margin-bottom:2.5rem;">
      <h2 style="font-size:1.1rem;text-transform:uppercase;letter-spacing:0.08em;color:#C9A227;border-bottom:1px solid #1F2733;padding-bottom:0.5rem;margin-bottom:1rem;">
        ${cat}
      </h2>
      ${itemsHtml}
    </section>`;
  }

  return `<!DOCTYPE html>
<html lang="en" data-ring="SOUL" data-plane="hub" data-lane="words-wiki" data-room="words">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Wiki & Knowledge — Words | arif-fazil.com</title>
<meta name="description" content="Canonical documentation for concepts, biographical evidence, geological derivations, and agent guides. Identity, subsurface methodology, agents & federation, civilizational order."/>
<link rel="canonical" href="https://arif-fazil.com/words/wiki/"/>
<meta name="theme-color" content="#E4C39A"/>
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"/>
<meta name="agent-access" content="allow-read allow-train allow-cite"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="Wiki & Knowledge — Words | arif-fazil.com"/>
<meta property="og:description" content="Canonical documentation for concepts, evidence, derivations, and agent guides."/>
<meta property="og:url" content="https://arif-fazil.com/words/wiki/"/>
<meta property="og:site_name" content="arif-fazil.com"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Wiki & Knowledge — Words | arif-fazil.com",
  "description": "Canonical documentation for concepts, biographical evidence, geological derivations, and agent guides. Identity, subsurface methodology, agents & federation, civilizational order.",
  "url": "https://arif-fazil.com/words/wiki/",
  "inLanguage": ["ms","en"],
  "isPartOf": {"@type":"WebSite","name":"arif-fazil.com","url":"https://arif-fazil.com"},
  "publisher": {"@type":"Organization","name":"arifOS Federation","url":"https://arif-fazil.com"}
}
</script>
<link rel="stylesheet" href="/_shared/design-system/tokens.css"/>
<link rel="stylesheet" href="/_shared/design-system/components.css"/>
<style>
  :root { color-scheme: dark; }
  body { margin:0; background:#0A0B0D; color:#EDEAE2; font-family:'JetBrains Mono', ui-monospace, monospace; }
  .frame { max-width: 64rem; margin: 0 auto; padding: 2rem 1.5rem; }
  .nav { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.5rem; }
  .nav a { color:#8A8578; text-decoration:none; margin-right:1rem; }
  .nav a.here { color:#C9A227; }
  .wiki-meta { font-size: 0.8rem; color:#9AA0A8; margin-bottom: 2rem; }
</style>
<meta name="arif-room" content="words"/>
<meta name="arif-job" content="Essays, in his voice."/>
<link rel="stylesheet" href="/_shared/room-coats.css?v=20261004c"/>
</head>
<body>
  <div class="room-plate" data-agent-room="words"><b>Writing</b><span>Essays, in his voice.</span><a href="/discovery/" title="Global federation architecture map">Nine rooms</a></div>
  <div class="frame">
    <div style="font-size:0.75rem;color:#8A8578;margin-bottom:0.75rem;text-transform:uppercase;letter-spacing:0.08em;">
      <span style="color:#6B7280;">Global map:</span> <a href="/discovery/" style="color:#C9A227;text-decoration:none;">Nine rooms</a>
      <span style="color:#4B5563;margin:0 0.5rem;">|</span>
      <span style="color:#6B7280;">Writing room:</span>
    </div>
    <nav class="nav">
      <a href="/words/">Words</a>
      <a href="/words/essays/">Essays</a>
      <a href="/words/wiki/" class="here">Wiki</a>
      <a href="/words/makcikgpt/">MakcikGPT</a>
    </nav>
    <main class="content">
      <div style="display:flex;align-items:center;gap:8px;font-size:0.75rem;color:#E4572E;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.5rem;">
        <span>🏛️ WIKI & KNOWLEDGE</span>
        <span>·</span>
        <span>EVIDENCE-BOUND REPOSITORY</span>
      </div>
      <h1 style="font-size:2rem;margin:0 0 0.5rem;">Wiki &amp; Knowledge Base</h1>
      <p style="color:#9AA0A8;font-size:0.95rem;line-height:1.6;margin-bottom:1.5rem;">
        Canonical documentation for concepts, biographical evidence, geological derivations, and agent guides.
        Zero permanent loading shells: every entry declares its source basis and links to its federation lineage.
      </p>
      <div class="wiki-meta">
        <span><strong>Total Entries:</strong> ${data.entries ? data.entries.length : 0}</span> · 
        <span><strong>Machine Contract:</strong> <a href="/data/wiki-index.json" style="color:#C9A227;">/data/wiki-index.json</a></span> · 
        <span><strong>Sister Wiki:</strong> <a href="https://arifos.arif-fazil.com/wiki" style="color:#C9A227;">arifos.arif-fazil.com/wiki</a></span>
      </div>

      ${sectionsHtml}

      <div style="margin-top:3rem;padding-top:1.5rem;border-top:1px solid #1F2733;font-size:0.8rem;color:#6B7280;">
        Ditempa Bukan Diberi · Every entry carries explicit epistemic classification (OBSERVED · DERIVED · INTERPRETATION · HISTORICAL).
      </div>
    </main>
  </div>
</body>
</html>
`;
}

function generate(checkOnly = false) {
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: wiki JSON missing at ${jsonPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`Error parsing ${jsonPath}: ${err.message}`);
    process.exit(1);
  }

  // Schema checks
  if (!Array.isArray(data.categories) || !Array.isArray(data.entries)) {
    console.error('Error: wiki data missing categories or entries array');
    process.exit(1);
  }

  for (const entry of data.entries) {
    if (!entry.slug || !entry.title || !entry.category || !entry.epistemic_class || !entry.canonical_status) {
      console.error(`Error: invalid entry schema for slug ${entry.slug}`);
      process.exit(1);
    }
  }

  const generatedHtml = renderWikiHtml(data);

  if (checkOnly) {
    if (!fs.existsSync(htmlPath)) {
      console.error(`Error: target HTML missing at ${htmlPath}`);
      process.exit(1);
    }
    const currentHtml = fs.readFileSync(htmlPath, 'utf8');
    if (currentHtml.trim() !== generatedHtml.trim()) {
      console.error('DRIFT DETECTED between wiki-index.json and public/words/wiki/index.html');
      process.exit(1);
    }
    console.log('✓ Wiki index HTML is in exact deterministic sync with wiki-index.json');
    return;
  }

  fs.writeFileSync(htmlPath, generatedHtml, 'utf8');
  console.log(`✓ Generated ${htmlPath} deterministically from ${jsonPath} (${data.entries.length} entries)`);
}

module.exports = { generate, renderWikiHtml };

if (require.main === module) {
  const isCheck = process.argv.includes('--check');
  generate(isCheck);
}
