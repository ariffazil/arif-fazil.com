#!/usr/bin/env node
/**
 * generate-md-mirrors.cjs — Generates agentic markdown mirrors under public/makcikgpt-md/
 *
 * Law 1 & Law 3:
 * Reads typed canon via makcik-source.cjs and emits frontmatter + claim matrix.
 *
 * 2026-08-25 (audit upgrade):
 *   - Emits the FULL article body (converted from the canonical {slug}.html in the
 *     same directory) — previously stubs shipped title+URL only, so the agent lane
 *     was not ingestible (F2: a 200 that carries no content is a lie).
 *   - Sealed pieces render Claim Register + Source Ledger tables from essays.json.
 *   - Legacy numeric-id shells (m1-1, s4-2, …) are emitted as redirect stubs via
 *     lib/makcik-legacy-map.cjs — never again as empty self-linking pages.
 *   - Removes id-named .html/.md files in OUT_DIR that have no mapping (orphans).
 */

const fs = require("fs");
const path = require("path");
const { getMakcikSource, computeCanonicalPayloadHash, SITE_ROOT } = require("./lib/makcik-source.cjs");
const { isLegacyShellId, resolveLegacyTarget } = require("./lib/makcik-legacy-map.cjs");

const OUT_DIR = path.join(SITE_ROOT, "public/makcikgpt-md");
// 2026-09-18: canonical article source. Bodies are read from here, NOT from the
// cached {slug}.html (which was generated pre-provenance-pass and drifted).
const TS_DIR = path.join(SITE_ROOT, "src/data/makcikgpt");
const TS_REGISTRY = path.join(TS_DIR, "index.ts");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// ── HTML → Markdown (template-aware: cover, fact-box, pull-quote, callout) ──

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (m, d) => String.fromCharCode(parseInt(d, 10)));
}

function htmlToMarkdown(html) {
  let h = html.replace(/<!DOCTYPE[^>]*>/i, "");
  h = h.replace(/<head>[\s\S]*?<\/head>/i, "");
  h = h.replace(/<script[\s\S]*?<\/script>/gi, "");
  h = h.replace(/<style[\s\S]*?<\/style>/gi, "");

  // Block templates → markdown carriers
  h = h.replace(/<div class="fact-box">[\s\S]*?<div class="fact-box-title">([\s\S]*?)<\/div>\s*<div class="fact-box-content">([\s\S]*?)<\/div>\s*<\/div>/gi,
    (m, title, content) => `\n\n> **▲ ${title.replace(/<[^>]+>/g, "").trim()}**\n> ${content.replace(/<br\s*\/?>/gi, "\n> ").replace(/<[^>]+>/g, "").trim().replace(/\n+/g, "\n> ")}\n`);
  h = h.replace(/<div class="pull-quote">([\s\S]*?)<\/div>/gi,
    (m, c) => `\n\n> ${c.replace(/<[^>]+>/g, "").trim().replace(/\s+/g, " ")}\n`);
  h = h.replace(/<div class="callout-title">([\s\S]*?)<\/div>\s*<div class="callout-content">([\s\S]*?)<\/div>/gi,
    (m, title, content) => `\n\n**${title.replace(/<[^>]+>/g, "").trim()}** — ${content.replace(/<[^>]+>/g, "").trim().replace(/\s+/g, " ")}\n`);
  h = h.replace(/<\/?(div|span|section|article|main|body|html)[^>]*>/gi, "\n");

  h = h
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (m, c) => `\n\n# ${c.replace(/<[^>]+>/g, "").trim()}\n`)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (m, c) => `\n\n## ${c.replace(/<[^>]+>/g, "").trim()}\n`)
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (m, c) => `\n\n### ${c.replace(/<[^>]+>/g, "").trim()}\n`)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (m, c) => `\n- ${c.replace(/<[^>]+>/g, "").trim()}`)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (m, c) => `\n\n${c.replace(/<[^>]+>/g, "").trim()}\n`)
    .replace(/<a [^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (m, href, c) => {
      const text = c.replace(/<[^>]+>/g, "").trim();
      return text && href && !href.startsWith("#") ? `[${text}](${href})` : text;
    })
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, (m, c) => `**${c.replace(/<[^>]+>/g, "").trim()}**`)
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, (m, c) => `*${c.replace(/<[^>]+>/g, "").trim()}*`)
    .replace(/<hr\s*\/?>/gi, "\n\n---\n")
    .replace(/<[^>]+>/g, "");

  h = decodeEntities(h);

  const lines = h.split("\n").map(l => l.trim());
  const out = [];
  let prevBlank = true;
  for (const l of lines) {
    const isBlank = l === "";
    if (isBlank && prevBlank) continue;
    out.push(l);
    prevBlank = isBlank;
  }
  return out.join("\n").trim();
}

// ── Canonical TypeScript body extraction (2026-09-18) ──────────────
//
// The 2026-09-18 provenance pass patched the CANONICAL bodies in
// src/data/makcikgpt/{slug}.ts (source cites + figure labels). The cached
// public/makcikgpt-md/{slug}.html files are from 2026-08-15 and predate that
// pass, so building the markdown from them silently re-published the
// un-sourced version into the lane that AI crawlers ingest. Bodies must
// therefore be read from the .ts source of truth.
//
// The bodies sit inside backtick template literals in TS source, so they
// carry TS-level backslash escapes. A naive split on the first backtick
// corrupts any literal containing \` or \\; the scanner below consumes a
// backslash TOGETHER WITH the next character as one unit.

const TEMPLATE_ESCAPES = {
  n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", v: "\v", "0": "\0",
  "`": "`", '"': '"', "'": "'", "\\": "\\", "$": "$", "/": "/",
};

function unescapeTemplateChar(ch) {
  // Unknown escape (e.g. \{ ) → drop the backslash, keep the char, which is
  // what a JS template literal evaluates to.
  return Object.prototype.hasOwnProperty.call(TEMPLATE_ESCAPES, ch) ? TEMPLATE_ESCAPES[ch] : ch;
}

/**
 * Scans one backtick template literal starting at `start` (just past the
 * opening backtick). Returns { value, nextIndex } or null if unterminated.
 */
function scanTemplateLiteral(src, start) {
  let i = start;
  const buf = [];
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\\") {
      const nxt = i + 1 < src.length ? src[i + 1] : "";
      if (nxt === "") break; // trailing backslash — malformed, bail to fallback
      buf.push(unescapeTemplateChar(nxt));
      i += 2; // consume backslash + escaped char as a unit
      continue;
    }
    if (ch === "`") return { value: buf.join(""), nextIndex: i + 1 };
    buf.push(ch);
    i += 1;
  }
  return null;
}

/**
 * Extracts every `html:` / `const html =` template literal from TS source.
 * Both shapes are live in src/data/makcikgpt:
 *   const content: ArticleContent = { slug: '…', html: `…` }   (property form)
 *   const html = `…`; const article = { slug: '…', html };     (module-const form)
 * More than one literal is possible; they are returned in source order and
 * concatenated by the caller.
 */
function extractHtmlFromTs(src) {
  const out = [];
  const re = /\bhtml\s*[:=]\s*`/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const parsed = scanTemplateLiteral(src, m.index + m[0].length);
    if (!parsed) break;
    if (parsed.value.trim().length > 0) out.push(parsed.value);
    re.lastIndex = parsed.nextIndex;
  }
  return out;
}

/** Canonical body HTML for a slug, straight from the .ts. null if unavailable. */
function readCanonicalHtml(slug) {
  const tsPath = path.join(TS_DIR, `${slug}.ts`);
  if (!fs.existsSync(tsPath)) return null;
  try {
    const blocks = extractHtmlFromTs(fs.readFileSync(tsPath, "utf8"));
    if (blocks.length === 0) return null;
    const joined = blocks.join("\n").trim();
    return joined.length >= 400 ? joined : null; // refuse near-empty bodies
  } catch {
    return null;
  }
}

/** Legacy cached HTML, kept only as a fallback for slugs with no TS body. */
function readCachedHtml(slug) {
  const htmlPath = path.join(OUT_DIR, `${slug}.html`);
  if (!fs.existsSync(htmlPath)) return null;
  try {
    return fs.readFileSync(htmlPath, "utf8");
  } catch {
    return null;
  }
}

// Body provenance counters, reported at the end of the run.
const bodySource = { canonicalTs: [], cachedHtml: [], placeholder: [] };

function convertBody(slug) {
  // 1. CANONICAL: src/data/makcikgpt/{slug}.ts template literal.
  const tsHtml = readCanonicalHtml(slug);
  if (tsHtml) {
    const md = htmlToMarkdown(tsHtml);
    if (md.length >= 400) {
      bodySource.canonicalTs.push(slug);
      return md;
    }
  }
  // 2. FALLBACK: cached {slug}.html — only reachable when the .ts is missing,
  //    has no html literal, or yields a near-empty conversion. Never crashes.
  const cached = readCachedHtml(slug);
  if (cached) {
    const md = htmlToMarkdown(cached);
    if (md.length >= 400) {
      bodySource.cachedHtml.push(slug);
      return md;
    }
  }
  // 3. PLACEHOLDER: caller emits the explicit "(Badan artikel belum dimuat…)" line.
  bodySource.placeholder.push(slug);
  return null;
}

/** Slugs published in the app registry (src/data/makcikgpt/index.ts). */
function readRegistrySlugs() {
  try {
    const src = fs.readFileSync(TS_REGISTRY, "utf8");
    const out = new Set();
    for (const m of src.matchAll(/\bslug:\s*['"]([^'"]+)['"]/g)) out.add(m[1]);
    return out;
  } catch {
    return new Set();
  }
}

// ── Canonical mirrors ─────────────────────────────────────────────

const { pieces } = getMakcikSource();
let bodyFull = 0;
let bodyMissing = [];

for (const p of pieces) {
  const slug = p.dest.path.replace("/world/makcikgpt/", "");
  const outFile = path.join(OUT_DIR, `${slug}.md`);

  const payloadHash = computeCanonicalPayloadHash(p);
  const claimReg = p.claim_register || [];
  const sourceLedger = p.source_ledger || [];

  const obsCount = claimReg.filter(c => c.tag === "OBS").length;
  const intCount = claimReg.filter(c => c.tag === "INT").length;
  const specCount = claimReg.filter(c => c.tag === "SPEC").length;
  const derCount = claimReg.filter(c => c.tag === "DER").length;

  let claimsTable = "";
  if (claimReg.length > 0) {
    claimsTable = `\n## Claim Register\n\n| claim_id | tag | text | source_id | maruah |\n|---|---|---|---|---|\n` +
      claimReg.map(c => `| ${c.claim_id} | ${c.tag} | ${String(c.text).replace(/\|/g, "\\|")} | ${c.source_id || "-"} | ${c.maruah_review || "n/a"} |`).join("\n") + "\n";
  }

  let sourcesTable = "";
  if (sourceLedger.length > 0) {
    sourcesTable = `\n## Source Ledger\n\n| source_id | type | title | url |\n|---|---|---|---|\n` +
      sourceLedger.map(s => `| ${s.source_id} | ${s.type} | ${String(s.title).replace(/\|/g, "\\|")} | ${s.url} |`).join("\n") + "\n";
  }

  const bodyMd = convertBody(slug);
  if (bodyMd) bodyFull++; else bodyMissing.push(slug);

  const out = `---
article_id: ${p.id}
canonical_url: https://arif-fazil.com${p.dest.path}
seal: ${p.seal || "null"}
provenance_status: ${p.provenance_status || "legacy"}
version: ${p.version_lineage ? p.version_lineage.version : "1.0"}
merkle_leaf: ${payloadHash}
epistemic_summary:
  obs_count: ${obsCount}
  der_count: ${derCount}
  int_count: ${intCount}
  spec_count: ${specCount}
---

# ${p.title}

> ${p.excerpt || p.title}
>
> Canonical URL: https://arif-fazil.com${p.dest.path}
>
> Bahasa: BM (Bahasa Makcik) · Suara: makcik pasar, bukan institusi · Semua nombor bawa sumber.
> Baca versi HTML: https://arif-fazil.com${p.dest.path}
${claimsTable}${sourcesTable}
---

${bodyMd ? bodyMd : `*(Badan artikel belum dimuat dalam lane md — fetch HTML kanonikal di atas.)*`}
`;

  fs.writeFileSync(outFile, out);
}

// ── Cached {slug}.html → regenerated from canonical .ts (2026-09-18) ───
//
// These standalone HTML files are served at /makcikgpt-md/{slug}.html and are
// also the bot lane's try_files fallback when a .md is absent. They were
// generated 2026-08-15 (pre-provenance-pass). Regenerate the body from the
// canonical .ts, preserving the existing shell. Files whose .ts yields no body
// are LEFT UNTOUCHED — never truncated to an empty document.

function escapeHtmlAttr(s) {
  return String(s).replace(/\s+/g, " ").replace(/"/g, "&quot;").trim();
}

let htmlRegenerated = 0;
let htmlSkipped = [];
for (const p of pieces) {
  const slug = p.dest.path.replace("/world/makcikgpt/", "");
  const bodyHtml = readCanonicalHtml(slug);
  if (!bodyHtml) { htmlSkipped.push(slug); continue; }
  const shell = `<!DOCTYPE html>
<html lang="ms">
<head><meta charset="UTF-8"><title>MakcikGPT — ${escapeHtmlAttr(p.title || slug)}</title>
<meta name="description" content="${escapeHtmlAttr(p.excerpt || p.title || slug)} — 999 Meterai seal">
</head>
<body>
${bodyHtml}
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.html`), shell);
  htmlRegenerated++;
}

// ── Unregistered canonical articles (2026-09-18) ───────────────────
//
// Seven articles exist as canonical src/data/makcikgpt/{slug}.ts and are live
// in the app registry (src/data/makcikgpt/index.ts → 200 on the browser lane)
// but have NO essays.json entry, so getMakcikSource() never sees them and the
// bot lane fell through to /index.html — i.e. an AI crawler asking for the
// article received the index page with none of the article. Emit a body-bearing
// mirror for those, labelled as unregistered: canonical body, no seal, no claim
// register (essays.json is the registration authority and is not edited here).

const registeredSlugs = readRegistrySlugs();
const knownSlugs = new Set(pieces.map(p => p.dest.path.replace("/world/makcikgpt/", "")));
const unregisteredEmitted = [];
const unregisteredSkipped = [];

for (const slug of registeredSlugs) {
  if (knownSlugs.has(slug)) continue; // already emitted from essays.json above
  const bodyHtml = readCanonicalHtml(slug);
  if (!bodyHtml) { unregisteredSkipped.push(slug); continue; }
  const bodyMd = htmlToMarkdown(bodyHtml);
  if (bodyMd.length < 400) { unregisteredSkipped.push(slug); continue; }
  const h1 = (bodyHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [null, ""])[1]
    .replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const canonicalUrl = `https://arif-fazil.com/world/makcikgpt/${slug}`;
  const out = `---
article_id: unregistered-${slug}
canonical_url: ${canonicalUrl}
seal: null
provenance_status: unregistered-ts-mirror
registered_in_essays_json: false
mirror_source: src/data/makcikgpt/${slug}.ts
merkle_leaf: null
epistemic_summary:
  obs_count: 0
  der_count: 0
  int_count: 0
  spec_count: 0
---

# ${h1 || slug}

> Badan artikel ini dijana terus dari sumber kanonikal \`src/data/makcikgpt/${slug}.ts\`.
>
> ⚠️ Artikel ini BELUM didaftarkan dalam \`src/data/essays.json\` — tiada seal, tiada Claim Register, tiada Source Ledger di dalam fail ini. Badan artikel adalah kanonikal; metadata provenance belum lengkap.
>
> Canonical URL: ${canonicalUrl}
>
> Bahasa: BM (Bahasa Makcik) · Suara: makcik pasar, bukan institusi.

---

${bodyMd}
`;
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.md`), out);
  unregisteredEmitted.push(slug);
}

// ── Legacy id shells → redirect stubs (never empty self-links) ─────

const byId = new Map(pieces.map(p => [p.id, p]));
let redirects = 0;
for (const f of fs.readdirSync(OUT_DIR)) {
  const m = f.match(/^(m\d+-\d+|s\d+-\d+)\.(html|md)$/);
  if (!m) continue;
  const id = m[1];
  const target = byId.has(id) ? `https://arif-fazil.com${byId.get(id).dest.path}` : resolveLegacyTarget(id);
  if (!target) continue; // unmapped id — leave for orphan cleanup below
  // 2026-08-25 fix: resolveLegacyTarget may return an ABSOLUTE url — don't
  // double-prefix the domain (was emitting https://arif-fazil.com/https://…)
  const abs = /^https?:\/\//.test(target) ? target : `https://arif-fazil.com${target.startsWith("/") ? target : "/" + target}`;
  const filePath = path.join(OUT_DIR, f);
  if (f.endsWith(".html")) {
    fs.writeFileSync(filePath, `<!DOCTYPE html><html lang="ms">
<head><meta charset="utf-8"><title>Perpindahan — MakcikGPT</title>
<meta http-equiv="refresh" content="0; url=${abs}">
<link rel="canonical" href="${abs}">
<meta name="robots" content="index,follow">
<style>body{background:#0d0d0d;color:#ccc;font-family:sans-serif;max-width:640px;margin:3em auto;padding:0 1em}a{color:#d4a843}</style>
</head><body>
<p>Artikel ni dah pindah rumah.</p>
<p><a href="${abs}">Baca artikel penuh →</a></p>
</body></html>`);
  } else {
    fs.writeFileSync(filePath, `---
article_id: ${id}
canonical_url: ${abs}
provenance_status: redirect
---

# Perpindahan

Artikel ni dah pindah rumah.

> Baca penuh: ${abs}
`);
  }
  redirects++;
}

// ── Orphan cleanup: id-named files with no mapping are dead weight ─

let orphans = 0;
for (const f of fs.readdirSync(OUT_DIR)) {
  const m = f.match(/^(m\d+-\d+|s\d+-\d+)\.(html|md)$/);
  if (!m) continue;
  if (byId.has(m[1]) || resolveLegacyTarget(m[1])) continue;
  fs.unlinkSync(path.join(OUT_DIR, f));
  orphans++;
}

console.log(`✓ Generated ${pieces.length} markdown mirrors — ${bodyFull} with full body${bodyMissing.length ? `, body missing: ${bodyMissing.join(", ")}` : ""}`);
console.log(`  body source: canonical .ts ${bodySource.canonicalTs.length} / cached .html ${bodySource.cachedHtml.length} / placeholder ${bodySource.placeholder.length}`);
if (bodySource.cachedHtml.length) console.log(`  ⚠ body still from cached .html (no usable .ts body): ${bodySource.cachedHtml.join(", ")}`);
console.log(`✓ Regenerated ${htmlRegenerated} cached HTML mirrors from canonical .ts${htmlSkipped.length ? `; left untouched (no .ts body): ${htmlSkipped.join(", ")}` : ""}`);
console.log(`✓ Unregistered canonical articles mirrored: ${unregisteredEmitted.length}${unregisteredEmitted.length ? ` (${unregisteredEmitted.join(", ")})` : ""}${unregisteredSkipped.length ? `; unregistered but skipped: ${unregisteredSkipped.join(", ")}` : ""}`);
console.log(`✓ Rewrote ${redirects} legacy id shells as redirect stubs; removed ${orphans} unmapped orphans`);
