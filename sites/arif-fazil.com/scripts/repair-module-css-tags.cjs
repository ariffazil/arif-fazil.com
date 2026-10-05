#!/usr/bin/env node
/**
 * repair-module-css-tags.cjs — fix corrupted entry-script tags in the live webroot.
 *
 * Incident 2026-10-05: a sibling patcher rewrote /assets/index-DFZuDSKa.js ->
 * /assets/index-Zr7-y6kE.js AND /assets/index-Bo--C9u4.css -> /assets/index-oCpUcSq2.css
 * by raw string replace. Because the old JS tag contained the substring
 * "index-Bo--C9u4.css"? No — the corruption came from the CSS string being
 * substituted into the JS tag position: pages ended up with
 *   <script type="module" crossorigin src="/assets/index-oCpUcSq2.css"></script>
 * (CSS URL in a module script tag) and/or
 *   <link rel="stylesheet" crossorigin href="/assets/index-*.js">
 * React never loads from a CSS script tag, so hydration was dead on those pages.
 *
 * Repair: rewrite any such corrupted tag to the canonical current entry JS /
 * CSS from dist/index.html. Backs up every touched file. Idempotent.
 */
const fs = require("node:fs");
const path = require("node:path");

const ROOT = "/var/www/html/arif";
const DIST_INDEX = "/root/arif-fazil.com/sites/arif-fazil.com/dist/index.html";
const BACKUP = "/var/www/html/.modulecss-backup-20261005";

const distHtml = fs.readFileSync(DIST_INDEX, "utf8");
const entryJs = (distHtml.match(/assets\/(index-[A-Za-z0-9_-]+\.js)/) || [])[1];
const entryCss = (distHtml.match(/assets\/(index-[A-Za-z0-9_-]+\.css)/) || [])[1];
if (!entryJs || !entryCss) {
  console.log("FATAL: could not resolve entry js/css from dist/index.html");
  process.exit(1);
}
console.log("canonical entry js:", entryJs, "| css:", entryCss);

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "assets" || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const badScript = /<script type="module" crossorigin src="\/assets\/index-[A-Za-z0-9_-]+\.css"><\/script>/g;
const badLink = /<link rel="stylesheet" crossorigin href="\/assets\/index-[A-Za-z0-9_-]+\.js">/g;

let files = 0, fixedS = 0, fixedL = 0;
const residual = [];
for (const file of walk(ROOT, [])) {
  const src = fs.readFileSync(file, "utf8");
  const nS = (src.match(badScript) || []).length;
  const nL = (src.match(badLink) || []).length;
  if (!nS && !nL) continue;
  let out = src.replace(badScript, '<script type="module" crossorigin src="/assets/' + entryJs + '"></script>');
  out = out.replace(badLink, '<link rel="stylesheet" crossorigin href="/assets/' + entryCss + '">');
  const b = path.join(BACKUP, path.relative(ROOT, file));
  fs.mkdirSync(path.dirname(b), { recursive: true });
  fs.copyFileSync(file, b);
  fs.writeFileSync(file, out);
  files++;
  fixedS += nS;
  fixedL += nL;
}
console.log("files repaired:", files, "| module-css script tags fixed:", fixedS, "| stylesheet-js links fixed:", fixedL);

let resid = 0;
for (const file of walk(ROOT, [])) {
  const t = fs.readFileSync(file, "utf8");
  if (t.match(badScript) || t.match(badLink)) {
    resid++;
    console.log("RESIDUAL:", file);
  }
}
console.log("residual corrupted files:", resid);
