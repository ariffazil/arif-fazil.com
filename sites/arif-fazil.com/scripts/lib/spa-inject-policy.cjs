/**
 * spa-inject-policy.cjs — per-slug SPA shell injection decision (M1, 2026-11-04)
 *
 * Single predicate for copy-static-html.js step 2b. The injection must never
 * clobber: (a) content-first shells (real pre-JS body), (b) hand-authored
 * allowlisted static pages (sealed dossiers etc.). Everything else gets the
 * SPA shell for direct-URL hydration. The allowlist is passed IN by the
 * caller (copy-static-html.js STATIC_INDEX_ALLOWLIST) — single source, no drift.
 */
const CONTENT_FIRST_MARKER = 'id="content-first-body"';

/**
 * @param {string|null} existingHtml file contents, or null when no file exists
 * @param {string} relativeIndexPath e.g. "world/makcikgpt/<slug>/index.html"
 * @param {Set<string>} allowlist STATIC_INDEX_ALLOWLIST from copy-static-html.js
 * @returns {boolean} true when the SPA shell may be written
 */
function shouldInjectSpaShell(existingHtml, relativeIndexPath, allowlist) {
  if (existingHtml == null) return true; // nothing to clobber
  if (existingHtml.includes(CONTENT_FIRST_MARKER)) return false; // real pre-JS content
  const norm = String(relativeIndexPath).replace(/\\/g, "/");
  if (allowlist && allowlist.has(norm)) return false; // hand-authored authority
  return true;
}

module.exports = { shouldInjectSpaShell, CONTENT_FIRST_MARKER };
