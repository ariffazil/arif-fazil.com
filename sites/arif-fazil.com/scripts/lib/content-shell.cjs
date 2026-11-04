/**
 * content-shell.cjs — content-first static shell renderer (T12, 2026-11-04)
 *
 * Contract: a page built by this module is READABLE WITHOUT JAVASCRIPT —
 * title, dateModified and the full article body live in plain HTML, with
 * fed-nav included and a hydration slot for the SPA. UPGRADE-PLAN P1:
 * "Setiap route ada shell statik content-first… 200 SPA-shell bukan bukti."
 *
 * Also carries the TS article-HTML extractor (same scanner contract as
 * generate-md-mirrors.cjs readCanonicalHtml — kept in lib so shell emission
 * and mirrors cannot drift apart).
 */
const fs = require("fs");
const path = require("path");

const SITE_ROOT = path.join(__dirname, "..", "..");
const TS_DIR = path.join(SITE_ROOT, "src/data/makcikgpt");

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/* ── TS article-HTML extractor (mirrors generate-md-mirrors.cjs) ─────── */
function unescapeTemplateChar(ch) {
  if (ch === "n") return "\n";
  if (ch === "t") return "\t";
  if (ch === "r") return "\r";
  if (ch === "`") return "`";
  return ch; // \\ $ etc.
}

function scanTemplateLiteral(src, startIndex) {
  const buf = [];
  let i = startIndex;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\\") {
      const nxt = i + 1 < src.length ? src[i + 1] : "";
      if (nxt === "") break;
      buf.push(unescapeTemplateChar(nxt));
      i += 2;
      continue;
    }
    if (ch === "`") return { value: buf.join(""), nextIndex: i + 1 };
    buf.push(ch);
    i += 1;
  }
  return null;
}

/** Canonical body HTML for a slug, straight from its .ts source. null if unavailable. */
function readCanonicalHtml(slug) {
  const tsPath = path.join(TS_DIR, `${slug}.ts`);
  if (!fs.existsSync(tsPath)) return null;
  try {
    const src = fs.readFileSync(tsPath, "utf8");
    const out = [];
    const re = /\bhtml\s*[:=]\s*`/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      const parsed = scanTemplateLiteral(src, m.index + m[0].length);
      if (!parsed) break;
      if (parsed.value.trim().length > 0) out.push(parsed.value);
      re.lastIndex = parsed.nextIndex;
    }
    if (out.length === 0) return null;
    const joined = out.join("\n").trim();
    return joined.length >= 400 ? joined : null; // refuse near-empty bodies
  } catch {
    return null;
  }
}

/* ── Content-first shell renderer ─────────────────────────────────────── */
/**
 * renderContentFirstShell(route, meta) → complete HTML string, or null when
 * bodyHtml is empty (F2: refuse to emit a content-free shell).
 */
function renderContentFirstShell(route, meta) {
  const body = (meta.bodyHtml || "").trim();
  if (body.length < 40) return null; // a 200 with no content is a lie

  const title = escapeHtml(meta.title || route);
  const desc = escapeHtml(meta.description || meta.title || "");
  const canonical = escapeHtml(meta.canonical || `https://arif-fazil.com/${route}/`);
  const dateModified = escapeHtml(meta.dateModified || "");
  const crumb = escapeHtml(meta.breadcrumbTrail || "Arif Fazil");

  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${canonical}">
  ${dateModified ? `<meta name="last-modified" content="${dateModified}">` : ""}
  <style>
    :root{--bg:#0A0B0D;--panel:#0F172A;--line:#1F2937;--ink:#EDEAE2;--dim:#9AA0A8;--gold:#E8B84B}
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--ink);font-family:Newsreader,Georgia,serif;line-height:1.7}
    .frame{max-width:760px;margin:0 auto;padding:1.25rem}
    .crumb{font-family:"IBM Plex Mono",monospace;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--dim);margin-bottom:1rem}
    .datechip{font-family:"IBM Plex Mono",monospace;font-size:.7rem;color:var(--dim);border:1px solid var(--line);border-radius:6px;padding:2px 8px;display:inline-block;margin-bottom:1rem}
    article{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:1.5rem}
    article img{max-width:100%;height:auto}
    article pre{overflow-x:auto}
    article table{display:block;overflow-x:auto;max-width:100%}
    a{color:var(--gold)}
    .note{font-size:.82rem;color:var(--dim);border-left:2px solid var(--line);padding-left:.85rem;margin-top:2rem}
    #root{display:none}
  </style>
  <link rel="stylesheet" href="/_shared/fed-nav.css">
</head>
<body>
  <div class="frame">
    <nav class="crumb" aria-label="Breadcrumb">${crumb}</nav>
    <div id="fed-nav-root"></div>
    <script src="/_shared/fed-nav.js" defer></script>
    ${dateModified ? `<span class="datechip">dateModified: ${dateModified}</span>` : ""}
    <article id="content-first-body">
${body}
    </article>
    <p class="note">Content-first surface — kandungan penuh tanpa JavaScript.
      Mesin: <a href="/llms.txt">/llms.txt</a> · <a href="/surfaces.json">/surfaces.json</a></p>
    <div id="root"></div>
  </div>
</body>
</html>`;
}

module.exports = { renderContentFirstShell, readCanonicalHtml };
