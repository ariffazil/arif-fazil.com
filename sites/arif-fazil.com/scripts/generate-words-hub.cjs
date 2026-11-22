#!/usr/bin/env node
/**
 * generate-words-hub.cjs — content-first static shell for /words/ (zen E).
 *
 * The /words/ hub lists AUTHORED ESSAYS ONLY (F13 ratification 2026-11-23).
 * The civic column's canonical home is /world/makcikgpt/ — one cross-link,
 * no duplicated archive. essays.json is the single metadata SOT; this shell
 * is regenerated from it on every prebuild so the no-JS/crawler layer can
 * never drift from the SPA layer (WordsEssays applies the same filter).
 *
 * House rule: static content lives INSIDE #root — React replaces it on
 * hydration (humans see one page; crawlers keep the full list).
 */
const fs = require("fs");
const path = require("path");

const SITE_ROOT = path.resolve(__dirname, "..");
const ESSAYS_JSON = path.join(SITE_ROOT, "src/data/essays.json");
const OUT = path.join(SITE_ROOT, "public/words/index.html");

const raw = fs.readFileSync(ESSAYS_JSON, "utf8");
const items = JSON.parse(raw.startsWith("//") ? raw.slice(raw.indexOf("\n") + 1) : raw);

const isMakcikDest = (e) =>
  e.dest && e.dest.type === "onsite" && typeof e.dest.path === "string" &&
  e.dest.path.startsWith("/world/makcikgpt/");

const essays = items
  .filter((e) => !isMakcikDest(e))
  .slice()
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const latest = essays.length ? essays[0].date : new Date().toISOString().slice(0, 10);

const rows = essays
  .map((e) => {
    const series = e.series && e.series.id ? `<span class="series">${esc(e.series.id)}</span> ` : "";
    const onsite = e.dest && e.dest.type === "onsite" && e.dest.path;
    const href = onsite ? e.dest.path : (e.dest && (e.dest.url || e.dest.path)) || "#";
    const ext = onsite ? "" : ' ↗';
    return `      <li><time datetime="${esc(e.date)}">${esc(e.date)}</time> ${series}<a href="${esc(href)}">${esc(e.title)}${ext}</a></li>`;
  })
  .join("\n");

const html = `<!doctype html>
<html lang="en" data-ring="SOUL">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Words — Essays · Arif Fazil</title>
    <meta name="theme-color" content="#0A0B0D" />
    <meta name="description" content="Essays on geology, risk, honesty in AI, and the North. Written to be read." />
    <meta name="dateModified" content="${latest}" />
    <link rel="canonical" href="https://arif-fazil.com/words/" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Words — Essays · Arif Fazil" />
    <meta property="og:description" content="Essays on geology, risk, honesty in AI, and the North. Written to be read." />
    <meta property="og:url" content="https://arif-fazil.com/words/" />
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"Words — Essays · Arif Fazil","description":"Essays on geology, risk, honesty in AI, and the North. Written to be read.","url":"https://arif-fazil.com/words/","dateModified":"${latest}","author":{"@type":"Person","name":"Arif Fazil","url":"https://arif-fazil.com/"}}</script>
    <script type="module"></script>
    <style>
      .words-static{padding:2rem;max-width:48rem;margin:0 auto;font-family:Georgia,serif;color:#EDEAE2;background:#0A0B0D;line-height:1.6}
      .words-static h1{font-size:1.6rem;margin:0 0 .5rem}
      .words-static .crumb{font-family:monospace;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#9AA0A8;margin-bottom:1rem}
      .words-static .crumb a{color:#E4572E;text-decoration:none}
      .words-static .makcik-card{display:block;border:1px solid rgba(217,166,46,.35);border-radius:8px;padding:.9rem 1rem;margin:1.2rem 0;text-decoration:none;color:#EDEAE2;background:#11151C}
      .words-static .makcik-card .k{font-family:monospace;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:#D9A62E}
      .words-static .makcik-card .d{font-size:.85rem;color:#9AA0A8}
      .words-static ul{list-style:none;padding:0;margin:1rem 0}
      .words-static li{padding:.55rem 0;border-bottom:1px solid #1F2733;font-size:.95rem}
      .words-static time{font-family:monospace;font-size:.75rem;color:#9AA0A8;margin-right:.6rem}
      .words-static .series{font-family:monospace;font-size:.7rem;color:#E4572E;margin-right:.4rem}
      .words-static li a{color:#EDEAE2;text-decoration:none}
      .words-static li a:hover{color:#E4572E}
      .words-static .count{font-family:monospace;font-size:.75rem;color:#9AA0A8;text-transform:uppercase;letter-spacing:.08em}
    </style>
  </head>
  <body>
    <div id="root"><main class="words-static">
      <nav class="crumb"><a href="/">Home</a> › Words · <a href="/words/essays/">Essays</a> · <a href="/words/doctrine/">Doctrine</a> · <a href="/words/wiki/">Wiki</a></nav>
      <h1>Words — Essays &amp; Doctrine</h1>
      <p>Essays on geology, risk, honesty in AI, and the North. Written to be read.</p>
      <a class="makcik-card" href="/world/makcikgpt/">
        <span class="k">🌍 MakcikGPT · Civic Column</span><br />
        <span class="d">Kewartawanan sivik dalam Bahasa Makcik — the full archive lives at its own home: /world/makcikgpt/ →</span>
      </a>
      <p class="count">${essays.length} essays · newest first</p>
      <ul>
${rows}
      </ul>
    </main></div>
  </body>
</html>
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`✓ words hub shell: ${essays.length} essays (essays-only, makcik cross-linked), dateModified ${latest}`);
