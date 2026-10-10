// post-build: copy static HTML pages into dist subdirectories
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distRoot = path.join(root, "dist");
const publicRoot = path.join(root, "public");

const SKIP_DIRS = new Set([
  "assets",          // Vite-managed bundler output (already in dist/assets/)
  "node_modules",
  ".git",
]);

// SPA canonical routes that MUST use the React SPA bundle (dist/index.html)
const SPA_ROUTES = [
  "home",
  "about",
  "words",
  "words/essays",
  "words/makcikgpt",
  "world",
  "work",
  "work/exploration-2013-2026",
  "work/exploration-2013-2026/evidence",
  "AAA",
  "aaa",
  "makcikgpt",
  "world/makcikgpt",
  "missions",
  "economics",
  "sanctuary",
  "graph",
  "evidence",
  "reality",
];

const SKIP_FILES = new Set([
  "feed.xml",
  "llms.json",
  "llms.txt",
  "llms-full.txt",
  "sitemap.xml",
  "rsl.xml",
  "robots.txt",
  "page.json",
  "missions.json",
  "soul.json",
]);

// Static index.html files that MUST be copied verbatim from public/ → dist/
// instead of being treated as SPA fallback targets. These are non-React pages
// (e.g. /world/politics/shadow/ PM Bayang hub + 33 Bayang Anwar Ibrahim).
// Route-specific metadata for SPA shells (2026-10-01, external audit P0).
// The SPA fallback served the ROOT title/description on every route — crawlers,
// link unfurlers, and no-JS users got the homepage shell on /about, /work/, etc.
// When injecting the SPA shell for a route, stamp that route's own identity.
// Values mirror each page's PageMeta component (client-side truth stays canonical).
const SITE = "https://arif-fazil.com";
const ROUTE_META = {
  about: {
    title: "About — Arif Fazil",
    description: "I turn uncertain Earth data into defensible decisions — and build AI systems that stay bounded by evidence and human authority.",
    path: "/about",
    h1: "About Arif Fazil",
  },
  work: {
    title: "Selected Work — Arif Fazil",
    description: "Selected offshore exploration work, public evidence, roles, outcomes, and governed AI systems by Arif Fazil.",
    path: "/work/",
    h1: "The Work & the Record",
  },
  "work/exploration-2013-2026": {
    title: "Exploration 2013–2026 — Arif Fazil",
    description: "Thirteen years of offshore exploration geoscience, evidence-tagged. Malay Basin and offshore Sabah — flagged work, uncertainty discipline, and what was proven.",
    path: "/work/exploration-2013-2026/",
    h1: "Arif Fazil — Subsurface · Systems · Intelligence",
  },
  "work/exploration-2013-2026/evidence": {
    title: "Exploration Portfolio — Evidence Ledger",
    description: "Every claim in the exploration portfolio, tagged by truth class and publication class. Includes what was deliberately withheld, and why.",
    path: "/work/exploration-2013-2026/evidence/",
    h1: "Evidence Ledger",
  },
  reality: {
    title: "Reality Domains — Arif Fazil",
    description: "The reality atlas: Earth, capital, institutions, and governed machines — each domain bounded by evidence.",
    path: "/reality/",
    h1: "Reality Domains",
  },
  evidence: {
    title: "Evidence Register — Arif Fazil",
    description: "Public evidence behind the claims on this site: sources, dates, limitations, what is withheld, and explicit Consequence Episodes.",
    path: "/evidence/",
    h1: "Evidence Register",
  },
  graph: {
    title: "Reality Graph — Arif Fazil",
    description: "The linked map of domains, claims, and evidence across the federation.",
    path: "/graph/",
    h1: "Reality Graph",
  },
  economics: {
    title: "Research — Arif Fazil",
    description: "Public-numbers research: PETRONAS vitals, Malaysian fiscal structure, commodities.",
    path: "/economics/",
    h1: "Research in Public Numbers",
  },
  missions: {
    title: "Missions — Arif Fazil",
    description: "Active missions across the federation: status, evidence, and boundaries.",
    path: "/missions/",
    h1: "Missions",
  },
  sanctuary: {
    title: "Sanctuary — arifOS",
    description: "arifOS is not a product. It is Witnessed Territory — a place where a human can think, decide, bear consequence, and grow.",
    path: "/sanctuary/",
    h1: "Sanctuary",
  },
};

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Stamp a route's own title/description/canonical/OG onto the SPA shell and
// give no-JS readers and crawlers real content inside #root (React replaces it on mount).
function stampRouteShell(spaHtml, route) {
  const meta = ROUTE_META[route];
  if (!meta) return spaHtml;
  const url = SITE + meta.path;
  let html = spaHtml;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${url}" />`
  );
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`);
  html = html.replace(/<meta property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`);
  html = html.replace(/<meta name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`);
  const fallback =
    `<main style="padding:2rem;max-width:48rem;margin:0 auto;font-family:sans-serif;">` +
    `<h1>${escapeHtml(meta.h1)}</h1>` +
    `<p>${escapeHtml(meta.description)}</p>` +
    `<p><a href="/" style="color:#E4572E;">Home</a> · <a href="/work/" style="color:#E4572E;">Work</a> · <a href="/institution/" style="color:#E4572E;">Briefing</a></p>` +
    `</main>`;
  html = html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
  return html;
}

const STATIC_INDEX_ALLOWLIST = new Set([
  "world/politics/shadow/index.html",
  "world/politics/shadow/anwar-ibrahim/index.html",
  "institution/index.html",
  "human/index.html",
  // Sealed dossiers (2026-09-18). Deep static documents, not React routes.
  // served by the human-lane try_files {path}/index.html branch.
  "world/makcikgpt/petronas-full-reality-rakyat-dossier/index.html",
  "world/makcikgpt/petronas-leadership-1974-2026/index.html",
  // /world/ — curated static hub (2026-09-18). This route is ALSO in SPA_ROUTES;
  // without this entry every build replaced the hub with the SPA shell.
  "world/index.html",
  // /words/ — content-first static hub with Atlas & Compass + 7 Civilizations (2026-09-24).
  // Preserved so raw curl/agents get full semantic HTML; postbuild enriches with SPA bundle.
  "words/index.html",
  // Curated pages that Caddy ALREADY prefers over React. Its try_files lines read
  // `{path} {path}/index.html /<route>/index.html /index.html =404` and
  // `/world/makcikgpt/index.html /index.html =404` — static first, shell as fallback.
  // The build was injecting the SPA shell into dist/ BEFORE that fallback could ever
  // be reached, so the curated page never got deployed and every browser got the bare
  // React shell carrying the ROOT title. Found 2026-09-18 by nav audit: public/ had
  // Words 16.5 KB / Work 10.1 KB / MakcikGPT 42.1 KB with correct per-route titles;
  // the webroot had 8.6 KB of the homepage on all three.
  "world/makcikgpt/index.html",
  // /words/essays/, /words/wiki/, /words/makcikgpt/ — peer subpages of the
  // Words hub (2026-10-01). Static shells with proper titles so agent/SEO
  // crawlers see correct metadata before React hydration. Hybrid enrichment
  // (same pattern as /words/index.html) injects Vite assets on build.
  "words/essays/index.html",
  "words/wiki/index.html",
  "words/makcikgpt/index.html",
  // /000/ + /999/ — sovereign proof pages (2026-10-02). Hand-forged, NO SPA shell
  // injection, NO React hydration. The Caddy @genesis / @validation handlers route
  // the canonical trailing-slash URLs to these files; SPA bundle clobbering them
  // was the root cause of the witness's "DRIFT — SEAL MUST NOT RUN" verdict.
  // Removed from SPA_ROUTES above (no route-stamping, no overwrite).
  "000/index.html",
  "999/index.html",
  ]);

function shouldSkip(relativePath, isDir) {
  const parts = relativePath.split(path.sep);
  if (isDir && parts.some(p => SKIP_DIRS.has(p))) return true;
  // index.html: skip UNLESS on the static allowlist (those are non-React pages)
  if (!isDir && relativePath === "index.html") {
    return !STATIC_INDEX_ALLOWLIST.has(relativePath);
  }
  if (!isDir && SKIP_FILES.has(parts[parts.length - 1])) return true;
  return false;
}

function mirrorDir(srcDir, destDir, baseRel = "") {
  let entries;
  try { entries = fs.readdirSync(srcDir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const rel = baseRel ? path.join(baseRel, e.name) : e.name;
    if (shouldSkip(rel, e.isDirectory())) continue;
    const sp = path.join(srcDir, e.name);
    const dp = path.join(destDir, e.name);
    if (e.isDirectory()) {
      fs.mkdirSync(dp, { recursive: true });
      mirrorDir(sp, dp, rel);
    } else if (e.isFile()) {
      fs.mkdirSync(path.dirname(dp), { recursive: true });
      fs.copyFileSync(sp, dp);
    }
  }
}

// 1. Mirror public/ → dist/
if (fs.existsSync(publicRoot)) {
  console.log("postbuild: mirroring public/ → dist/...");
  mirrorDir(publicRoot, distRoot);
}

// 2. Ensure all canonical SPA routes use the compiled React SPA entry (dist/index.html)
const spaEntryPath = path.join(distRoot, "index.html");
if (fs.existsSync(spaEntryPath)) {
  const spaHtml = fs.readFileSync(spaEntryPath, "utf8");
  for (const route of SPA_ROUTES) {
    const routeDir = path.join(distRoot, route);
    const targetFile = path.join(routeDir, "index.html");
    // A route may ALSO have a hand-built static page in public/. If that file is
    // allowlisted, it is the authority — do NOT clobber it with the SPA shell.
    // (2026-09-18: /world/ was in SPA_ROUTES with no allowlist entry, so every build
    // silently replaced the 148 KB curated hub with the 8.5 KB shell. dist/ is
    // gitignored, so the overwrite left no trace. That is why the hub kept vanishing.)
    if (STATIC_INDEX_ALLOWLIST.has(`${route}/index.html`) || STATIC_INDEX_ALLOWLIST.has(`${route}/index.html`.replace(/\\/g, "/"))) {
      console.log(`postbuild: preserving static page for /${route} (allowlisted, not injecting SPA shell)`);
      // Hybrid enrichment: inject Vite assets into any allowlisted static page so
      // React hydration still works on top of curated SEO shell. Pattern generalized
      // from the original /words/ case (2026-09-24) to all allowlisted routes including
      // the new /words/{essays,wiki,makcikgpt}/ peer subpages (2026-10-01).
      const staticDistPath = path.join(distRoot, route, "index.html");
      if (fs.existsSync(staticDistPath)) {
        let staticHtml = fs.readFileSync(staticDistPath, "utf8");
        const scriptMatches = [...spaHtml.matchAll(/<script type="module" crossorigin src="([^"]+)"><\/script>/g)];
        const cssMatches = [...spaHtml.matchAll(/<link rel="stylesheet" crossorigin href="([^"]+)">/g)];
        let changed = false;
        for (const m of cssMatches) {
          if (!staticHtml.includes(m[0])) {
            staticHtml = staticHtml.replace("</head>", `  ${m[0]}\n</head>`);
            changed = true;
          }
        }
        for (const m of scriptMatches) {
          if (!staticHtml.includes(m[0])) {
            staticHtml = staticHtml.replace("</body>", `  ${m[0]}\n</body>`);
            changed = true;
          }
        }
        if (changed) {
          fs.writeFileSync(staticDistPath, staticHtml, "utf8");
          console.log(`postbuild: enriched /${route}/index.html with Vite assets for hybrid SPA hydration`);
        }
      }
      continue;
    }
    fs.mkdirSync(routeDir, { recursive: true });
    const stamped = stampRouteShell(spaHtml, route);
    fs.writeFileSync(targetFile, stamped, "utf8");
    console.log(`postbuild: injected SPA shell for /${route} -> ${path.relative(root, targetFile)}${stamped === spaHtml ? "" : " (route-stamped)"}`);
  }

  // 2b. Inject per-slug MakcikGPT article HTML so direct URL access renders the article
  // (not the listing fallback or the SPA shell). This is critical for Telegram/social links —
  // without it, Cloudflare served the SPA shell for direct /world/makcikgpt/<slug> requests
  // because the SPA-injected index.html (8202 B, root title) overwrote the article HTML
  // mirrored from public/makcikgpt-md/<slug>.html (11-37 KB, article-specific title).
  //
  // Source: public/makcikgpt-md/<slug>.html — generated by scripts/generate-md-mirrors.cjs
  // from src/data/makcikgpt/index.ts. Each file is a fully-rendered static article with the
  // correct <title>, OG tags, and HTML body. We copy it verbatim AND apply the same
  // hybrid enrichment (Vite assets) the script uses for allowlisted routes, so React
  // hydration still works on top of the static SEO shell.
  try {
    // Slugs live in src/data/makcikgpt/index.ts (TS source of truth).
    // Parse the makcikArticlesMeta array — look for slug: '...' lines.
    let slugs = [];
    const indexTsPath = path.join(root, "src/data/makcikgpt/index.ts");
    if (fs.existsSync(indexTsPath)) {
      const src = fs.readFileSync(indexTsPath, "utf8");
      const matches = [...src.matchAll(/^\s*slug:\s*['"]([^'"]+)['"]/gm)];
      slugs = matches.map((m) => m[1]).filter(Boolean);
    }
    const targetBaseDirs = [
      path.join(distRoot, "world/makcikgpt"),
      path.join(distRoot, "makcikgpt")
    ];
    // Pre-extract Vite asset tags from the SPA entry for hybrid enrichment.
    const cssTagMatches = [...spaHtml.matchAll(/<link rel="stylesheet" crossorigin href="([^"]+)">/g)].map(m => m[0]);
    const scriptTagMatches = [...spaHtml.matchAll(/<script type="module" crossorigin src="([^"]+)"><\/script>/g)].map(m => m[0]);
    let writtenCount = 0;
    let missingCount = 0;
    for (const slug of slugs) {
      if (!slug) continue;
      // A hand page under public/world/makcikgpt/<slug>/ is already mirrored.
      // Replacing it with the markdown shell drops the column people are reading.
      const handPath = path.join(publicRoot, "world/makcikgpt", slug, "index.html");
      if (fs.existsSync(handPath)) continue;
      const srcHtmlPath = path.join(publicRoot, "makcikgpt-md", slug + ".html");
      if (!fs.existsSync(srcHtmlPath)) {
        console.warn(`postbuild: makcikgpt slug '${slug}' has no public/makcikgpt-md/${slug}.html — skipping (no silent SPA fallback)`);
        missingCount++;
        continue;
      }
      let articleHtml = fs.readFileSync(srcHtmlPath, "utf8");
      // Hybrid enrichment: inject Vite assets (CSS in <head>, JS before </body>) so React
      // hydration runs on top of the static article HTML. Same pattern as the
      // STATIC_INDEX_ALLOWLIST branch above.
      for (const tag of cssTagMatches) {
        if (!articleHtml.includes(tag)) {
          articleHtml = articleHtml.replace("</head>", `  ${tag}\n</head>`);
        }
      }
      for (const tag of scriptTagMatches) {
        if (!articleHtml.includes(tag)) {
          articleHtml = articleHtml.replace("</body>", `  ${tag}\n</body>`);
        }
      }
      for (const baseDir of targetBaseDirs) {
        const slugDir = path.join(baseDir, slug);
        fs.mkdirSync(slugDir, { recursive: true });
        const slugFile = path.join(slugDir, "index.html");
        fs.writeFileSync(slugFile, articleHtml, "utf8");
        writtenCount++;
      }
    }
    console.log(`postbuild: wrote ${writtenCount} per-slug MakcikGPT article HTML files across world/makcikgpt and makcikgpt (${missingCount} missing source files skipped)`);
  } catch (e) {
    console.warn(`postbuild: per-slug MakcikGPT article HTML injection skipped (${e.message})`);
  }
}

console.log(`postbuild: static html sync complete.`);
