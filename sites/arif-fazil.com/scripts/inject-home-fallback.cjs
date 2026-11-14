// inject-home-fallback.cjs — SSR-lite for non-JS agents (HERMES audit P0, 2026-11-14)
// Injects a <noscript> block with the real homepage content (mirror of index.md)
// into dist/index.html. React replaces #root on mount; noscript is inert for JS clients.
const fs = require('fs')
const path = require('path')
const file = path.join(__dirname, '..', 'dist', 'index.html')
const mdPath = path.join(__dirname, '..', '..', '..', '..', 'var', 'www', 'html', 'arif', 'index.md')
let html = fs.readFileSync(file, 'utf8')
if (html.includes('<!-- SSR-FALLBACK -->')) { console.log('ssr-fallback: already present'); process.exit(0) }
// Static content — kept in sync with homepage: hero, wells record, evidence, connect.
const block = `<!-- SSR-FALLBACK -->
<noscript>
<main>
<h1>Arif Fazil — exploration geoscientist, Kuala Lumpur</h1>
<p>I turn uncertain ground into defensible decisions. I read incomplete Earth data and refuse fake certainty — and I build AI systems that stay bounded by evidence and human authority. Ditempa bukan diberi — forged, not given.</p>
<h2>The wells record</h2>
<p>BEKANTAN-1 (2024, Central Malay Basin) — shallowest flowing oil discovery recorded in the Malay Basin. PUTERI BASEMENT-1 (2017) — basement charge-risk calibration, commercial K-5 sands. LEBAH EMAS-1 (2025) — 11 hydrocarbon-bearing intervals, new hinge play fairway. BUNGA TASBIH-1 (2020) — commercial oil in post-rift Group I and J sands. Full records: <a href="/work">/work</a>. Personal professional contribution, not on behalf of PETRONAS.</p>
<h2>Evidence over assertion</h2>
<p>Material claims link to evidence, or are marked as interpretation. Where evidence is incomplete, the system returns UNKNOWN or HOLD — it does not invent an answer. Verification: <a href="/999/">/999/</a>.</p>
<h2>Connect</h2>
<p>Email: <a href="mailto:[REDACTED:EMAIL]">[REDACTED:EMAIL]</a> · Telegram: <a href="https://t.me/ariffazil">@ariffazil</a> · LinkedIn: <a href="https://linkedin.com/in/ariffazil">ariffazil</a> · GitHub: <a href="https://github.com/ariffazil">ariffazil</a> · Contact: <a href="/contact/">/contact/</a></p>
</main>
</noscript>`
html = html.replace('</body>', block + '\n</body>')
fs.writeFileSync(file, html)
console.log('ssr-fallback: injected, dist index.html now', html.length, 'bytes')
