#!/usr/bin/env node
/**
 * prerender-makcik-slugs.cjs — per-article static HTML for /world/makcikgpt/<slug>/
 *
 * Why this exists (2026-10-04):
 *   The Vite SPA fallback served dist/index.html on every /world/makcikgpt/<slug>/
 *   route, so crawlers / link unfurlers / no-JS readers got the root title and
 *   description on every per-article URL. This script stamps the article's own
 *   title, description, canonical URL, OG / Twitter Card, and JSON-LD onto each
 *   dist/world/makcikgpt/<slug>/index.html (and the legacy dist/makcikgpt/<slug>/
 *   alias), and injects a noscript body fallback built from the already-rendered
 *   public/makcikgpt-md/<slug>.html mirror so search engines and link unfurlers
 *   see real article content immediately. React then hydrates normally.
 *
 * Source-of-truth chain (F4 CLARITY):
 *   src/data/essays.json  →  scripts/lib/makcik-source.cjs  →  this script
 *   public/makcikgpt-md/<slug>.html  →  noscript body fallback
 *
 * Constraints (2026-10-04 subagent brief):
 *   - Do NOT touch the 16 uncommitted files in the working tree
 *   - Do NOT install new heavy deps (no Puppeteer / no chrome)
 *   - Read-only on public/ — writes only to dist/
 *
 * Run:
 *   node scripts/prerender-makcik-slugs.cjs
 *
 * It is chained into the postbuild hook in package.json after copy-static-html.js.
 */

const fs = require("node:fs");
const path = require("node:path");

const { getMakcikSource, CANONICAL_PREFIX } = require("./lib/makcik-source.cjs");

const SITE_ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(SITE_ROOT, "dist");
const PUBLIC_MD_DIR = path.join(SITE_ROOT, "public/makcikgpt-md");
const SITE = "https://arif-fazil.com";

// Two output roots — the canonical /world/makcikgpt/<slug>/ and the legacy
// /makcikgpt/<slug>/ alias (both are in SPA routes and need a stamped shell).
const TARGET_ROOTS = [
  path.join(DIST_ROOT, "world/makcikgpt"),
  path.join(DIST_ROOT, "makcikgpt"),
];

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeFilename(s) {
  return String(s).replace(/[^A-Za-z0-9._-]/g, "_");
}

function buildDescription(piece) {
  // essays.json has empty excerpt/subtitle for some pieces; build a useful
  // description from title + first tags + series when missing.
  const title = (piece.title || "").trim();
  const tags = (piece.tags || []).slice(0, 4);
  const series = piece.series && piece.series.id ? `Series ${piece.series.id}` : null;
  const parts = [];
  if (tags.length) parts.push(tags.join(" · "));
  if (series) parts.push(series);
  if (parts.length) return `${title}. ${parts.join(" — ")}.`;
  return `${title}. MakcikGPT — civic intelligence in Bahasa Makcik.`;
}

function buildJsonLd(piece, slug, description) {
  const url = `${SITE}/world/makcikgpt/${slug}`;
  // No @context here — the parent @graph already carries it (schema.org spec).
  return {
    "@type": "NewsArticle",
    headline: piece.title,
    description,
    inLanguage: piece.lang || "ms",
    datePublished: piece.date,
    dateModified: piece.date,
    mainEntityOfPage: url,
    url,
    isAccessibleForFree: true,
    keywords: (piece.tags || []).join(", "),
    articleSection: "Civic Intelligence",
    author: {
      "@type": "Person",
      name: "Muhammad Arif bin Fazil",
      url: SITE,
    },
    publisher: {
      "@type": "Organization",
      name: "arifOS Federation",
      url: SITE,
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/og-identity.svg`,
      },
    },
    isPartOf: {
      "@type": "CreativeWork",
      name: "MakcikGPT",
      url: `${SITE}/world/makcikgpt/`,
    },
  };
}

function stripHtmlToBodyFragment(html) {
  // Take the inner body of the makcikgpt-md mirror so the noscript fallback
  // is a clean <article>-shaped block. We deliberately keep only the parts
  // that are useful to a no-JS reader / crawler: cover, h2/h3, p, ul/ol, blockquote.
  if (!html) return "";
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const inner = m ? m[1] : html;
  // Drop the <style> and <script> tags from the mirror.
  let cleaned = inner
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "");
  return cleaned.trim();
}

function stampSlugShell(spaHtml, piece, slug) {
  const title = piece.title || slug;
  const description = buildDescription(piece);
  const url = `${SITE}/world/makcikgpt/${slug}`;
  const pageTitle = `${title} — MakcikGPT | arif-fazil.com`;
  const jsonLd = buildJsonLd(piece, slug, description);

  let html = spaHtml;

  // 1. <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(pageTitle)}</title>`,
  );

  // 2. description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );

  // 3. author
  html = html.replace(
    /<meta\s+name="author"\s+content="[^"]*"\s*\/>/,
    `<meta name="author" content="Muhammad Arif bin Fazil" />`,
  );

  // 4. canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${url}" />`,
  );

  // 5. og:* (title, description, url, type=article)
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${url}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:type" content="article" />`,
  );
  if (piece.date) {
    html = html.replace(
      /<meta\s+property="article:published_time"\s+content="[^"]*"\s*\/>/,
      `<meta property="article:published_time" content="${escapeHtml(piece.date)}" />`,
    );
  }

  // 6. twitter:title / twitter:description
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  );

  // 7. JSON-LD: replace the existing WebSite/Person graph with one that
  //    includes the article as a NewsArticle. We rewrite the entire script tag.
  const newJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE}/#person`,
        name: "Muhammad Arif bin Fazil",
        alternateName: "Arif Fazil",
        url: SITE,
        jobTitle: "Exploration Geoscientist",
        sameAs: ["https://github.com/ariffazil", "https://t.me/ariffazil"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: "arif-fazil.com",
      },
      jsonLd,
    ],
  }, null, 0);
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">${newJsonLd}</script>`,
  );

  // 8. Inject a noscript body fallback so crawlers / no-JS readers get the
  //    real article content. The mirror at public/makcikgpt-md/<slug>.html
  //    carries the cover + body already (generated by generate-md-mirrors.cjs).
  const mirrorPath = path.join(PUBLIC_MD_DIR, `${slug}.html`);
  let noscriptInner = "";
  if (fs.existsSync(mirrorPath)) {
    try {
      const mirrorHtml = fs.readFileSync(mirrorPath, "utf8");
      const bodyFragment = stripHtmlToBodyFragment(mirrorHtml);
      noscriptInner = bodyFragment;
    } catch (e) {
      // Fall through to a minimal fallback below.
    }
  }
  if (!noscriptInner) {
    noscriptInner = `<article><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></article>`;
  }

  const noscriptBlock =
    `<noscript>` +
    `<article lang="${escapeHtml(piece.lang || "ms")}" data-makcik-slug="${escapeHtml(slug)}" ` +
    `data-makcik-date="${escapeHtml(piece.date || "")}" ` +
    `data-makcik-seal="${escapeHtml(piece.seal || "")}" ` +
    `style="padding:2rem;max-width:48rem;margin:0 auto;font-family:Georgia,serif;color:#EDEAE2;background:#0A0B0D;line-height:1.6;">` +
    `<p style="font-family:monospace;color:#D9A62E;font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;">` +
    `MakcikGPT · Civic Intelligence · ${escapeHtml(piece.date || "")} · Seal ${escapeHtml(piece.seal || "")}` +
    `</p>` +
    `<p style="font-family:sans-serif;color:#9AA0A8;font-size:0.875rem;">` +
    `JavaScript is disabled — the static article view is shown below. For the live experience, ` +
    `<a style="color:#E4572E;" href="${url}">open the article with JavaScript enabled</a>.` +
    `</p>` +
    `${noscriptInner}` +
    `</article>` +
    `</noscript>`;

  // Replace the existing <noscript>...</noscript> with the article-aware one.
  if (/<noscript>[\s\S]*?<\/noscript>/i.test(html)) {
    html = html.replace(
      /<noscript>[\s\S]*?<\/noscript>/i,
      noscriptBlock,
    );
  } else {
    // No noscript in the template — inject it just before </body>.
    html = html.replace("</body>", `  ${noscriptBlock}\n</body>`);
  }

  // 9. Add a hidden SEO h1 inside <main> for crawlers that strip <noscript>
  //    but still need a top-level heading on the static shell.
  const seoH1 =
    `<h1 style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">` +
    `${escapeHtml(title)} — MakcikGPT` +
    `</h1>`;
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${seoH1}</div>`,
  );

  return html;
}

function main() {
  const spaEntry = path.join(DIST_ROOT, "index.html");
  if (!fs.existsSync(spaEntry)) {
    console.error(`[prerender-makcik-slugs] ERROR: ${spaEntry} not found. Run vite build first.`);
    process.exit(1);
  }
  const spaHtml = fs.readFileSync(spaEntry, "utf8");

  const { pieces } = getMakcikSource();
  if (!Array.isArray(pieces) || pieces.length === 0) {
    console.error("[prerender-makcik-slugs] ERROR: no canonical pieces found.");
    process.exit(1);
  }

  let stamped = 0;
  let skipped = 0;
  let mirrorMissing = 0;
  const missingSlugs = [];

  for (const piece of pieces) {
    const destPath = piece && piece.dest && piece.dest.path;
    if (!destPath || !destPath.startsWith(CANONICAL_PREFIX)) {
      skipped++;
      continue;
    }
    const slug = destPath.slice(CANONICAL_PREFIX.length).replace(/\/$/, "");
    if (!slug) {
      skipped++;
      continue;
    }
    if (!fs.existsSync(path.join(PUBLIC_MD_DIR, `${slug}.html`))) {
      mirrorMissing++;
      missingSlugs.push(slug);
    }
    // Keep a hand-published column. Stamping the SPA shell here deletes it.
    const handPath = path.join(SITE_ROOT, "public/world/makcikgpt", slug, "index.html");
    if (fs.existsSync(handPath)) {
      skipped++;
      continue;
    }

    const stampedHtml = stampSlugShell(spaHtml, piece, slug);

    for (const baseDir of TARGET_ROOTS) {
      const outDir = path.join(baseDir, slug);
      fs.mkdirSync(outDir, { recursive: true });
      const outFile = path.join(outDir, "index.html");
      fs.writeFileSync(outFile, stampedHtml, "utf8");
      stamped++;
    }
  }

  console.log(
    `[prerender-makcik-slugs] stamped=${stamped} (${pieces.length} articles × ${TARGET_ROOTS.length} roots) skipped=${skipped} missing-mirror=${mirrorMissing}`,
  );
  if (missingSlugs.length) {
    console.warn(
      `[prerender-makcik-slugs] WARNING: ${missingSlugs.length} article(s) have no makcikgpt-md/<slug>.html mirror — falling back to minimal noscript. Slugs:`,
    );
    for (const s of missingSlugs) console.warn(`  - ${s}`);
  }
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error(`[prerender-makcik-slugs] FATAL: ${e.stack || e.message}`);
    process.exit(1);
  }
}

module.exports = { main, stampSlugShell, buildDescription, buildJsonLd, stripHtmlToBodyFragment };
