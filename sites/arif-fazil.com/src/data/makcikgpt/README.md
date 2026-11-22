# MakcikGPT — Canonical Single-Source Publishing Contract

> **ONE workflow. Zero hand-edited HTML. Zero Caddy reloads.**

## Canonical Pipeline
1. **Work in an isolated worktree** (`/root/worktrees/<lane>/arif-fazil.com`). Never edit `/root/arif-fazil.com` main checkout directly.
2. **Author / update article body:** `src/data/makcikgpt/<slug>.ts` (exporting `ArticleContent` with `slug` + `html`), and register in `src/data/makcikgpt/index.ts`.
3. **Register metadata & provenance:** Add or update the entry in `src/data/essays.json` (with `dest.path: "/world/makcikgpt/<slug>/"`, `series`, `claim_register`, `source_ledger`, and `version_lineage.last_updated` when revising).
4. **Build (`npm run build`):** `scripts/lib/makcik-source.cjs` reads `essays.json` + `src/data/makcikgpt/*.ts` and automatically generates ALL downstream surfaces:
   - `public/world/makcikgpt/index.html` (hub)
   - `public/world/makcikgpt/<slug>/index.html` (content-first article shell with `<link rel="alternate" type="text/markdown">`)
   - `public/makcikgpt-md/<slug>.md`, `public/world/makcikgpt/<slug>.md`, `public/world/makcikgpt/makcikgpt-md/<slug>.md` (Markdown mirrors)
   - `public/makcikgpt-md/index.html`, `public/rsl.xml`, `public/sitemap.xml`, `public/llms.json`, `public/feed.xml`
5. **Run offline gates:**
   - `python3 sites/arif-fazil.com/scripts/check-design-tokens.py`
   - `python3 sites/arif-fazil.com/scripts/compile-design-tokens.py --check`
   - `node sites/arif-fazil.com/scripts/validate-jsonld.mjs`
6. **Deploy additively** via signed `deploy-envelope.json` + `rsync -a --update --chown www-data:www-data` (never `--delete`).

## Hard Prohibitions (Anti-Chaos Rules)
- **NEVER hand-edit `public/world/makcikgpt/**/*.html` or `public/makcikgpt-md/**/*`** — every build overwrites them from `src/data/`.
- **NEVER run `./deploy-makcik.sh`** — it uses `rsync --delete` and reloads Caddy (T3 HOLD).
- **Design Token SOT:** Keep colors aligned with `tokens/design-tokens.json` (`#0A0B0D` bg, `#121318` card, `#232730` border, `#D4AF37` gold, `#58A6FF` link, `#D65656` red text).
