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
  "world/makcikgpt",
  "missions",
  "economics",
  // "000" removed — /000 uses static combined HTML (Sanctuary + Genesis)
  // "999" removed — /999 uses static HTML (Proof Chamber)
  // "sanctuary" removed — /sanctuary uses static HTML (Sanctuary duplicate)
  // These routes use static HTML from public/ that survives the build
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
    fs.mkdirSync(routeDir, { recursive: true });
    const targetFile = path.join(routeDir, "index.html");
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
    const articleDir = path.join(distRoot, "world/makcikgpt");
    let injectedCount = 0;
    for (const slug of slugs) {
      if (!slug) continue;
      const slugDir = path.join(articleDir, slug);
      fs.mkdirSync(slugDir, { recursive: true });
      const slugFile = path.join(slugDir, "index.html");
      fs.writeFileSync(slugFile, spaHtml, "utf8");
      injectedCount++;
    }
    console.log(`postbuild: injected ${injectedCount} per-slug MakcikGPT SPA shells`);
  } catch (e) {
    console.warn(`postbuild: per-slug SPA shell injection skipped (${e.message})`);
  }
}

console.log(`postbuild: static html sync complete.`);
