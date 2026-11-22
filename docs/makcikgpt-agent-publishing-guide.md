# MakcikGPT Agent Publishing Guide

> **Purpose**: Any future FI agent (Qwen, Claude, Codex, Kimi, Grok, OpenCode, AGY) must be able to publish or revise a MakcikGPT article autonomously without causing drift or chaos.
> **Last updated**: 2026-11-22
> **Maintainer**: F13 Sovereign
> **ANTI-CHAOS LAW:** Work strictly in an isolated worktree (`/root/worktrees/<lane>/arif-fazil.com`). NEVER hand-edit `public/world/makcikgpt/**/*.html` or `public/makcikgpt-md/**/*`. NEVER run `./deploy-makcik.sh` (it runs `rsync --delete` and reloads Caddy = T3 HOLD).

---

## Canonical Single-Source Pipeline (ONE Workflow)

```
src/data/makcikgpt/<slug>.ts  +  src/data/essays.json
                    │
                    ▼
       scripts/lib/makcik-source.cjs
                    │
                    ▼   (npm run build)
  ┌─────────────────┴──────────────────────────────────────┐
  │ Auto-generated surfaces (NEVER hand-edited):           │
  │ • public/world/makcikgpt/index.html         (hub)      │
  │ • public/world/makcikgpt/<slug>/index.html  (shells)   │
  │ • public/world/makcikgpt/<slug>.md          (rsl twin) │
  │ • public/world/makcikgpt/makcikgpt-md/*.md  (bot lane) │
  │ • public/makcikgpt-md/*.md + index.html     (mirrors)  │
  │ • public/{rsl.xml,sitemap.xml,llms.json,feed.xml}      │
  └────────────────────────────────────────────────────────┘
                    │
                    ▼   (additive deploy, zero Caddy reload)
       rsync -a --update --chown www-data:www-data
```

---

## File Structure

```
/root/arif-fazil.com/sites/arif-fazil.com/
├── src/data/makcikgpt/
│   ├── types.ts              ← Schema definitions (ArticleContent, MakcikArticleMeta)
│   ├── index.ts              ← Barrel: imports all articles, exports lookup functions
│   ├── cerita-makcik.ts      ← Example article (content + slug)
│   ├── taufik-klcc-ceo-petronas.ts
│   ├── ... (27+ article files)
│   └── fix.mjs               ← Utility script
├── src/pages/
│   ├── MakcikGPT.tsx         ← Article listing page (/world/makcikgpt/)
│   ├── MakcikGptArticle.tsx  ← Individual article renderer (/world/makcikgpt/:slug)
│   └── MakcikGptAlias.tsx    ← Route alias wrapper
├── src/App.tsx               ← Routes: /world/makcikgpt, /world/makcikgpt/:slug
├── src/index.css             ← .makcik-article CSS (lines 375-573)
├── deploy-makcik.sh          ← One-command deploy script
└── dist/                     ← Build output (synced to /var/www/html/arif/)
```

---

## Step-by-Step: How to Publish a New Article

### 1. CREATE the article file

Create a new `.ts` file in `/root/arif-fazil.com/sites/arif-fazil.com/src/data/makcikgpt/`:

```typescript
import type { ArticleContent } from './types';

const content: ArticleContent = {
  slug: 'your-article-slug',  // kebab-case, URL-safe
  html: `<div class="cover">
  <div class="cover-emoji">🛢️ 🏢 🇲🇾</div>
  <div class="cover-kicker">YOUR KICKER TEXT</div>
  <h1 class="cover-title">Your Article Title</h1>
  <p class="cover-subtitle">Your subtitle</p>
  <div class="cover-byline">
    <strong>Oleh MakcikGPT</strong> — description
    <br>999 Meterai · Version · Date
  </div>
</div>

<h1>Section Heading</h1>
<p>Article body content...</p>

<div class="fact-box">
  <div class="fact-box-title">▲ Box Title</div>
  <div class="fact-box-content">
    Factual content with sources.
  </div>
</div>

<div class="pull-quote">
  "A powerful quote."
</div>

<div class="callout">
  <div class="callout-title">▲ Call to Action</div>
  Action items here.
</div>

<footer>
  <em>Ditulis oleh MakcikGPT. Sources listed here.</em><br><br>
  <em>DITEMPA BUKAN DIBERI</em><br>
  <em>Meterai 999 — arifOS, DATE.</em>
</footer>`,
};

export default content;
```

**Available HTML classes:**
| Class | Purpose |
|-------|---------|
| `.cover` | Article header container (gradient, red border) |
| `.cover-emoji` | Large emoji row |
| `.cover-kicker` | Monospace, uppercase, gold kicker |
| `.cover-title` | Large display title |
| `.cover-subtitle` | Gray subtitle |
| `.cover-byline` | Author/date info |
| `.fact-box` | Dark card with gold border for data |
| `.fact-box-title` | Fact box header |
| `.fact-box-content` | Fact box body |
| `.pull-quote` | Italic blockquote with gold border |
| `.callout` | Gradient CTA card |
| `.callout-title` | CTA header |

### 2. REGISTER in index.ts

Edit `/root/arif-fazil.com/sites/arif-fazil.com/src/data/makcikgpt/index.ts`:

```typescript
// Add import (alphabetical or at top):
import yourArticle from './your-article-slug';

// Add to makcikArticleModules array (newest first):
export const makcikArticleModules: ArticleContent[] = [
  yourArticle,  // ← ADD HERE (newest first)
  taufikPengecutDenganTitle,
  // ... rest
];

// Add to makcikArticlesMeta array (newest first):
export const makcikArticlesMeta: MakcikArticleMeta[] = [
  {
    slug: 'your-article-slug',
    title: 'Your Article Title',
    subtitle: 'Your subtitle',
    date: '2026-09-14',
    domain: 'MAKCIKGPT × CATEGORY',
    language: 'ms',  // 'ms' | 'en' | 'bilingual'
    excerpt: 'One paragraph summary...',
    tags: ['tag1', 'tag2', 'makcikgpt', 'malaysia'],
    seal: '999',
    // Optional APEX provenance:
    // provenance_status: 'sealed',
    // claim_register: [...],
    // source_ledger: [...],
  },
  // ... rest
];
```

### 3. REGISTER in essays.json, BUILD, and DEPLOY ADDITIVELY

1. Add or update the article metadata entry in `sites/arif-fazil.com/src/data/essays.json` (ensure `dest.path` uses trailing slash `/world/makcikgpt/<slug>/`, and bump `version_lineage.last_updated` on revisions).
2. Run the canonical build & offline gates inside your isolated worktree (`/root/worktrees/<lane>/arif-fazil.com`):

```bash
cd /root/worktrees/<lane>/arif-fazil.com/sites/arif-fazil.com
npm run build
cd /root/worktrees/<lane>/arif-fazil.com
python3 sites/arif-fazil.com/scripts/check-design-tokens.py
python3 sites/arif-fazil.com/scripts/compile-design-tokens.py --check
node sites/arif-fazil.com/scripts/validate-jsonld.mjs
```

3. **NEVER run `./deploy-makcik.sh`** (deprecated: uses `rsync --delete` and reloads Caddy, which is a T3 HOLD).
4. **Deploy additively** after signing a `deploy-envelope.json` (`bash scripts/require-deploy-envelope.sh`):

```bash
rsync -a --update --chown www-data:www-data dist/ /var/www/html/arif/
```

No Caddy reload is required. Verify live HTTP 200 on `/world/makcikgpt/`, `/world/makcikgpt/<slug>/`, and `/world/makcikgpt/<slug>.md`.

---

## TypeScript Types Reference

```typescript
// From types.ts:
interface ArticleContent {
  slug: string;      // URL-safe kebab-case
  html: string;      // Full HTML content with MakcikGPT CSS classes
}

interface MakcikArticleMeta {
  slug: string;
  title: string;
  subtitle: string;
  date: string;           // YYYY-MM-DD
  domain: string;         // "MAKCIKGPT × CATEGORY"
  language: 'ms' | 'en' | 'bilingual';
  excerpt: string;        // 1-2 paragraph summary
  tags: string[];         // Always include 'makcikgpt' and 'malaysia'
  seal: string;           // '999' for published
  
  // Optional APEX provenance:
  provenance_status?: 'legacy' | 'migrating' | 'sealed';
  claim_register?: ClaimItem[];
  source_ledger?: SourceItem[];
  counter_evidence?: CounterEvidenceItem[];
  version_lineage?: VersionLineage;
  merkle_leaf?: string;
}

interface ClaimItem {
  claim_id: string;       // 'C001', 'C002', etc.
  text: string;           // The claim
  tag: 'OBS' | 'DER' | 'INT' | 'SPEC';  // Epistemic label
  source_id?: string;     // Links to source_ledger
  confidence_basis?: string;
  maruah_review?: 'approved' | 'pending' | 'not_applicable';
}

interface SourceItem {
  source_id: string;      // 'SRC-001', 'SRC-002', etc.
  type: 'filing' | 'document' | 'court_record' | 'news' | 'official_statement' | 'analysis';
  title: string;
  url: string;
  archived_url?: string;
  retrieved_at?: string;  // ISO-8601
  content_hash?: string;
}
```

---

## Series / Domain Tags

Articles are filtered by series in the listing page:

| Tab | Series ID | Focus |
|-----|-----------|-------|
| ALL | (all) | Show everything |
| M1 | PETRONAS DNA | Corporate culture, governance, history |
| M2 | SEARAH & Gas Sarawak | SEARAH deal, Petros dispute, Sarawak rights |
| M3 | YTL & Ilmu | YTL monopoly, ILMU AI, national AI failures |
| M4 | Rakyat & Sara Hidup | Cost of living, jobs, AI displacement |
| M5 | Akal & Kedaulatan | Sovereignty, AI governance, validator sovereignty |

The `domain` field controls series assignment. Format: `MAKCIKGPT × CATEGORY`.

---

## Routing (SPA)

| URL Pattern | Component | Behavior |
|-------------|-----------|----------|
| `/world/makcikgpt` | MakcikGPT.tsx | Listing page (bare) |
| `/world/makcikgpt/` | MakcikGPT.tsx | Listing page (trailing slash) |
| `/world/makcikgpt/:slug` | MakcikGptArticle.tsx | Individual article |

Legacy redirects exist for `/wealth/makcikgpt/` and `/economics/makcikgpt/`.

---

## Deploy Pipeline Detail

```
deploy-makcik.sh
│
├── Phase 1: Article Scavenger
│   └── Scans src/data/makcikgpt/*.ts for unregistered files
│
├── Phase 2: npm install
│   └── npm install --legacy-peer-deps (if node_modules stale)
│
├── Phase 3: Static Generation
│   ├── scripts/generate-makcik-index.cjs  (article index)
│   └── scripts/generate-md-mirrors.cjs    (markdown mirrors for bots)
│
├── Phase 4: Build
│   └── tsc -b && vite build → dist/
│
├── Phase 5: Deploy
│   ├── rsync public/makcikgpt-md/ → /var/www/html/arif/makcikgpt-md/
│   ├── rsync dist/ → /var/www/html/arif/ (--delete, aaa/** protected)
│   ├── sync-serving-roots.sh (llms.txt, sitemap.xml, feed.xml)
│   └── caddy reload
│
└── Phase 6: Verify
    ├── JS bundle hash match (dist vs live)
    ├── Each article slug returns 200 (bot + browser)
    ├── Listing page returns 200
    └── feed.xml, sitemap.xml, llms.txt return 200
```

---

## Full Deploy (All Sites)

For deploying ALL sites (not just MakcikGPT):

```bash
/root/arif-fazil.com/scripts/deploy-vps.sh
```

This builds React sites, deploys to `/var/www/html/`, reloads Caddy.

---

## Writing Conventions

1. **Language**: Bahasa Malaysia (colloquial "Makcik" voice). English for technical terms.
2. **Voice**: MakcikGPT = kampung auntie who asks the questions nobody else dares.
3. **Tone**: Direct, no-nonsense, confrontational but grounded in facts.
4. **Epistemic discipline**: Every claim tagged OBS/DER/INT/SPEC. Sources cited.
5. **Structure**: Cover → Sections with fact-boxes → Pull quotes → CTA callout → Footer with sources.
6. **Seal**: Always `seal: '999'` for published articles.
7. **Tags**: Always include `'makcikgpt'` and `'malaysia'`.

---

## Common Failures & Fixes

| Failure | Cause | Fix |
|---------|-------|-----|
| Article 404 | Not registered in index.ts | Add import + entry in both arrays |
| Build fails | TypeScript error in .ts file | Check imports, trailing commas, quotes |
| Blank page | SPA shell loaded but JS failed | Check browser console, verify dist/ has JS bundle |
| Stale content | Old bundle cached | Run deploy-makcik.sh, verify JS hash match |
| Missing from listing | Meta entry missing from makcikArticlesMeta | Add metadata object |
| Feed/sitemap stale | generate scripts didn't run | Check prebuild scripts in package.json |

---

## Quick Reference Commands

```bash
# Check what's registered
grep -c "import" /root/arif-fazil.com/sites/arif-fazil.com/src/data/makcikgpt/index.ts

# Verify live state
cd /root/arif-fazil.com/sites/arif-fazil.com && ./deploy-makcik.sh --verify-only

# Dry run (check registration only)
cd /root/arif-fazil.com/sites/arif-fazil.com && ./deploy-makcik.sh --dry-run

# Full deploy
cd /root/arif-fazil.com/sites/arif-fazil.com && ./deploy-makcik.sh

# Check live article
curl -s -o /dev/null -w "%{http_code}" https://arif-fazil.com/world/makcikgpt/YOUR-SLUG

# Count total articles
ls /root/arif-fazil.com/sites/arif-fazil.com/src/data/makcikgpt/*.ts | grep -v index | grep -v types | grep -v fix | grep -v jsonld | wc -l
```
