#!/usr/bin/env node
/**
 * restamp-shell-assets.cjs — postbuild re-stamp for static shells (v2).
 *
 * Failure class (found 2026-11-14, M1.1): public/words/writing/<slug>/index.html
 * static shells were generated long ago and BAKED the then-current asset hash.
 * vite copies public/ verbatim into dist/, so stale shells reference a css file
 * the current build never emits -> 404 -> unstyled page. And when only the css
 * ref is fixed, the shell still shows its OLD prerendered template, then flashes
 * to the new shell on hydration.
 *
 * v2 policy: a shell whose /assets/index-*.css reference does NOT resolve is
 * DEAD — replace its whole body with a minimal SPA shell:
 *   original <title> + description kept, current css, #root, current entry js.
 * React hydration then renders the mandated ATLAS shell directly. No flash.
 *
 * Order matters: run AFTER copy-static-html.js (which copies public/ over dist).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ASSETS = path.join(DIST, 'assets');

function emitted(suffix) {
  try {
    const files = fs
      .readdirSync(ASSETS)
      .filter((f) => new RegExp(`^index-.*\\.${suffix}$`).test(f))
      .sort();
    return files.length ? `/assets/${files[files.length - 1]}` : null;
  } catch {
    return null;
  }
}

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function spaShell(title, desc, css, js) {
  return `<!doctype html>
<html lang="en" data-ring="SOUL">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="theme-color" content="#0A0B0D" />
    ${desc ? `<meta name="description" content="${desc}" />` : ''}
    <link rel="canonical" href="https://arif-fazil.com/" />
    <link rel="stylesheet" href="${css}" />
    <script type="module" src="${js}"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;
}

function extract(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

function main() {
  const css = emitted('css');
  const js = emitted('js');
  if (!css || !js) {
    console.log('restamp: emitted index css/js not found — skipping');
    return;
  }
  const files = walk(DIST);
  let replaced = 0;
  let refixed = 0;
  for (const f of files) {
    let html;
    try {
      html = fs.readFileSync(f, 'utf8');
    } catch {
      continue;
    }
    if (!html.includes('/assets/index-')) continue;
    const cssRef = extract(html, /href="(\/assets\/index-[A-Za-z0-9_-]+\.css)"/);
    if (!cssRef) continue;
    if (fs.existsSync(path.join(ASSETS, path.basename(cssRef)))) continue; // healthy shell

    // dead shell: full SPA re-stamp (title/description preserved)
    const title = extract(html, /<title>([^<]+)<\/title>/) || 'Arif Fazil — arifOS';
    const desc = extract(html, /<meta name="description" content="([^"]*)"/);
    fs.writeFileSync(f, spaShell(title, desc, css, js));
    replaced += 1;
  }
  if (replaced > 0) {
    console.log(`restamp: ${replaced} dead shell(s) re-stamped to minimal SPA shell (css=${css}, js=${js})`);
  } else {
    console.log('restamp: all shell asset refs resolve — nothing to do');
  }
}

main();
