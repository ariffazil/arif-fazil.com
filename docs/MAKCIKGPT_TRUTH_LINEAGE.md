# MakcikGPT Truth Lineage & Lineage Analysis

> **Status:** RATIFIED GROUND TRUTH  
> **Timestamp:** 2026-09-24T08:52:00+08:00  
> **Author:** AGY CLI (Antigravity) under F13 Sovereign Mandate  

---

## 1. The Two Competing Truth Stores

Our reconnaissance reveals that `arif-fazil.com` has two competing content repositories for MakcikGPT:

```
                      ┌────────────────────────────────────────┐
                      │          AUTHORED ESSAYS & DOSSIERS    │
                      └───────────────────┬────────────────────┘
                                          │
            ┌─────────────────────────────┴─────────────────────────────┐
            ▼                                                           ▼
┌───────────────────────────────────────┐   ┌───────────────────────────────────────┐
│ STORE A: src/data/essays.json         │   │ STORE B: src/data/makcikgpt/*.ts      │
│ (34 MakcikGPT items / 71 total)       │   │ (40 items in index.ts / 41 files)     │
│ Contains:                             │   │ Contains:                             │
│ - Epistemic claim_register (33 items) │   │ - Full HTML article bodies            │
│ - Series IDs and numbers (M1-M6)      │   │ - Rich subtitles and excerpts         │
│ - Tags and destination routes         │   │ - 8 newer articles written Sep 17-22  │
│ Fed into:                             │   │ Fed into:                             │
│ - Node SSG & generator scripts        │   │ - React Router SPA (MakcikGPT.tsx)    │
│ - public/makcikgpt-md/index.html      │   │ - MakcikGptArticle.tsx dynamic reader │
│ - public/feed.xml (RSS)               │   │                                       │
│ - public/sitemap.xml                  │   │                                       │
└───────────────────────────────────────┘   └───────────────────────────────────────┘
```

---

## 2. Why Counts Differ Across Surfaces

1. **Why the React SPA shows 40 articles:**  
   The client-side React page imports `makcikArticlesMeta` from `@/data/makcikgpt/index.ts`, which registers 40 distinct article cards.
2. **Why `feed.xml`, `sitemap.xml`, and `makcikgpt-md/index.html` show 34 articles:**  
   These artifacts are generated at build time by `generate-makcik-index.cjs` and `generate-feed.cjs`, both of which call `scripts/lib/makcik-source.cjs`. That loader reads exclusively from `src/data/essays.json`.
3. **The 8 Unlinked Articles:**  
   Eight articles created between 2026-09-14 and 2026-09-22 exist as TypeScript files in `src/data/makcikgpt/` and are registered in `index.ts`, but were never backported to `src/data/essays.json`. Consequently, they are missing from RSS, sitemaps, and machine indexes.
4. **The 2 Missing Dossiers in React SPA:**  
   Two formal PETRONAS PDF dossiers (`petronas-full-reality-rakyat-dossier` and `petronas-leadership-1974-2026`) were added to `src/data/essays.json`, but never registered in `src/data/makcikgpt/index.ts`.

---

## 3. The Required Single-Source Pipeline

To prevent future drift, the architecture must flow unidirectionally:

```text
src/data/essays.json (Single Canonical Database with Claims + Sources + Series)
  │
  ├─► scripts/generate-makcik-index.cjs ──► public/makcikgpt-md/index.html
  ├─► scripts/generate-feed.cjs         ──► public/feed.xml
  ├─► scripts/generate-sitemap.cjs      ──► public/sitemap.xml
  ├─► scripts/generate-agent-shells.cjs ──► public/world/makcikgpt/llms.txt & llms.json
  └─► src/data/makcikgpt/index.ts       ──► React SPA (MakcikGPT.tsx & Article View)
```
