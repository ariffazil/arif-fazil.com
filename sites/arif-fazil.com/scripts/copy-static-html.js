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
  "world",
  "work",
  "AAA",
  "aaa",
  "makcikgpt",
  "world/makcikgpt",
  "missions",
  "economics",
  "000",
  "999",
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
      if (route === "words") {
        const wordsDistPath = path.join(distRoot, "words/index.html");
        if (fs.existsSync(wordsDistPath)) {
          let wordsHtml = fs.readFileSync(wordsDistPath, "utf8");
          const scriptMatches = [...spaHtml.matchAll(/<script type="module" crossorigin src="([^"]+)"><\/script>/g)];
          const cssMatches = [...spaHtml.matchAll(/<link rel="stylesheet" crossorigin href="([^"]+)">/g)];
          for (const m of cssMatches) {
            if (!wordsHtml.includes(m[0])) {
              wordsHtml = wordsHtml.replace("</head>", `  ${m[0]}\n</head>`);
            }
          }
          for (const m of scriptMatches) {
            if (!wordsHtml.includes(m[0])) {
              wordsHtml = wordsHtml.replace("</body>", `  ${m[0]}\n</body>`);
            }
          }
          fs.writeFileSync(wordsDistPath, wordsHtml, "utf8");
          console.log(`postbuild: enriched /words/index.html with Vite assets for hybrid SPA hydration`);
        }
      }
      continue;
    }
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(targetFile, spaHtml, "utf8");
    console.log(`postbuild: injected SPA shell for /${route} -> ${path.relative(root, targetFile)}`);
  }

  // 2b. Inject per-slug SPA shells for MakcikGPT articles so direct URL access renders the article
  // (not the listing fallback). This is critical for Telegram/social links — without it,
  // Cloudflare serves the parent listing HTML for direct /world/makcikgpt/<slug> requests.
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
    let injectedCount = 0;
    for (const slug of slugs) {
      if (!slug) continue;
      for (const baseDir of targetBaseDirs) {
        const slugDir = path.join(baseDir, slug);
        fs.mkdirSync(slugDir, { recursive: true });
        const slugFile = path.join(slugDir, "index.html");
        fs.writeFileSync(slugFile, spaHtml, "utf8");
        injectedCount++;
      }
    }
    console.log(`postbuild: injected ${injectedCount} per-slug MakcikGPT SPA shells across world/makcikgpt and makcikgpt`);
  } catch (e) {
    console.warn(`postbuild: per-slug SPA shell injection skipped (${e.message})`);
  }
}

console.log(`postbuild: static html sync complete.`);
