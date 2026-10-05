# ROUTING FIX SPEC · RM48B article identity (F02 fix, F13 binary C path a)

> **Source defect:** `/world/makcikgpt/rm48-bilion-belanjawan-atau-darurat/` 301→ `/world/makcikgpt/rm48-bilion-belanjawan-atau-darurat` (no trailing slash) → 200, 83,149 B, `<title>` = "MakcikGPT — Civic Intelligence in Bahasa Makcik · Arif Fazil" (the index), `og:url` = "https://arif-fazil.com/world/makcikgpt/". The article URL is impersonating the index.
> **Smoking gun:** the article HTML **exists and is complete** at `/root/arif-fazil.com/sites/arif-fazil.com/dist/makcikgpt-md/rm48-bilion-belanjawan-atau-darurat.html` (16,636 B total, 14,042 B body, full identity metadata — title, meta description, og:url, og:title, og:description all correct). The article's own static HTML is rendered with `og:url` pointing to the canonical `/world/makcikgpt/rm48-bilion-belanjawan-atau-darurat` (no trailing slash) — so the canonical is the article, not the index.
> **Root cause:** `src/App.tsx:95` — `<Route path="/world/makcikgpt/:slug" element={<MakcikGptArticle />} />` — the SPA renders a shell for any `/world/makcikgpt/<slug>` URL without checking whether a static article body exists at `/makcikgpt-md/<slug>.html`.
> **Ratification:** F13 binary C, path (a) — restore the article at its own URL. 2026-10-05.
> **Scope:** 1 URL restored (this article); the routing fix is the durable change.
> **Author lane:** 333-AGI / FI-003 (architect — proposal only). A-FORGE applies.

---

## Fix (TWO options, A-FORGE picks)

### Option A — Caddy file_server rule (preferred; no JS change)

Add to `/etc/caddy/Caddyfile`, in the `arif-fazil.com` site block, before any `try_files` that falls through to the SPA:

```caddyfile
# Serve static MakcikGPT articles at their canonical /world/makcikgpt/<slug> URL.
# The static files live under /makcikgpt-md/<slug>.html.
@makcik_article path /world/makcikgpt/* /world/makcikgpt
@makcik_article_slash path_regexp ^/world/makcikgpt/([a-z0-9-]+)/?$
handle @makcik_article_slash {
    @has_static file /makcikgpt-md/{re.1}.html
    rewrite @has_static /makcikgpt-md/{re.1}.html
    file_server
    # If no static file exists, fall through to the SPA route below.
}
```

This is the durable server-level fix. The SPA still handles `/world/makcikgpt/` (the index) and any slug that does NOT have a static file (so the SPA fallback is preserved). For any slug with a static file, the file is served at the canonical URL with no redirect (preserves the article's `og:url`).

### Option B — SPA loader change in `src/App.tsx` + `MakcikGptArticle` component

Modify `MakcikGptArticle` to fetch the static HTML body when the slug matches a known static article:

```tsx
// src/App.tsx
import { lazy, Suspense } from "react";

const MakcikGptArticleStatic = lazy(() => import("./components/MakcikGptArticleStatic"));

// In <Routes>:
<Route path="/world/makcikgpt/:slug" element={<MakcikGptArticleStatic />} />
```

```tsx
// src/components/MakcikGptArticleStatic.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MakcikGptArticleStatic() {
  const { slug } = useParams<{ slug: string }>();
  const [html, setHtml] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setHtml(null); setErr(null);
    fetch(`/makcikgpt-md/${slug}.html`, { headers: { Accept: "text/html" } })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(setHtml)
      .catch(e => setErr(e.message));
  }, [slug]);

  if (err) return <p>Article body not available: {err}. <a href="/world/makcikgpt/">See all articles</a>.</p>;
  if (html === null) return <p>Loading…</p>;
  return <article className="makcik-article" dangerouslySetInnerHTML={{ __html: html }} />;
}
```

This is the JS-side fix. The SPA still owns the URL; the article body is fetched and rendered inline.

---

## Why Option A is preferred

- **No JS hydration cost.** The article is a static HTML file; serving it as a static file is faster and avoids any "Loading…" state.
- **No double-rendering bug.** Option B renders the SPA shell first, then replaces it with the article body — a flicker, and a Googlebot sees the shell first.
- **No `dangerouslySetInnerHTML` XSS surface.** Option B requires a known-safe source; the static files are part of the build, but the pattern is more risky than serving a file directly.
- **Revertible in one Caddy line.** Option A is a 5-line Caddy block; removing it returns to the SPA-only behavior.

A-FORGE may pick Option B if the Caddy change is constrained.

---

## Surfaces.json entry (F02 batch update)

`/root/arif-fazil.com/sites/arif-fazil.com/surfaces.json` — the `status:dynamic_page` for `/world/makcikgpt/:slug` is correct; the bug is routing, not catalog. **No surfaces.json change** for this specific URL. (The /pulse/ status update is a separate line; see `surfaces-batch-2026-10-05.json`.)

---

## Acceptance test

For `/world/makcikgpt/rm48-bilion-belanjawan-atau-darurat`:

- `curl -sS -A "Mozilla/5.0" https://arif-fazil.com/world/makcikgpt/rm48-bilion-belanjawan-atau-darurat | grep -oE '<title>[^<]*</title>'` returns the **article's own title**, not the index title.
- `curl -sS -A "Mozilla/5.0" https://arif-fazil.com/world/makcikgpt/rm48-bilion-belanjawan-atau-darurat | grep -oE 'property="og:url"[^>]*content="[^"]*"'` returns `og:url` = `https://arif-fazil.com/world/makcikgpt/rm48-bilion-belanjawan-atau-darurat` (the article URL, not the index).
- The response body contains the article's first sentence: "Makcik tak kisah Anwar baca belanjawan macam kerani."
- Response body size is ~16 KB (the static file), not ~83 KB (the index).
- `curl -sS -A "Googlebot" https://arif-fazil.com/world/makcikgpt/rm48-bilion-belanjawan-atau-darurat` returns the **same HTML** with the article's own title (no markdown-shell-only response).

For the index `/world/makcikgpt/`:

- Continues to work; index renders the 42-article list.

For any other slug under `/world/makcikgpt/<slug>/` that does NOT have a static file (e.g. a future draft):

- Continues to render the SPA shell (`MakcikGptArticle` with no static body) — fallback preserved.

## Reversibility

- Option A: 5-line Caddy block. Revert: remove the block; SPA restores.
- Option B: 1 React import + 1 component. Revert: revert the import + the route.

DITEMPA BUKAN DIBEI ⚒️
