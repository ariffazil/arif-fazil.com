# Baseline Report — AAA & MakcikGPT Alignment (Phase 000)

> **Timestamp:** 2026-09-24T08:48:00+08:00  
> **Git Branch:** `feat/aaa-makcikgpt-alignment-v2`  
> **HEAD SHA:** `e4cd5627e36c3a8e9975e6571a8031b399c351d6`  
> **Sovereign Authority:** Arif Fazil (F13)  
> **Mode:** 000 RECON / READ-ONLY BASELINE  

---

## 1. System & Deployment Inventory

- **Repository Root:** `/root/arif-fazil.com`
- **Active Sub-app:** `sites/arif-fazil.com` (Vite 8.2 + React 19 + Tailwind CSS + SSG)
- **Caddy Document Root:** `/var/www/html/arif`
- **Reverse Proxy:** Caddy v2 with Cloudflare Origin TLS, Strict SNI, CSP, and Tailscale mesh isolation
- **Link Header Broadcast:**
  `Link: </llms.txt>; rel="llms", </.well-known/ard.json>; rel="ard", </.well-known/ai-catalog.json>; rel="ai-catalog", </.well-known/webmcp.json>; rel="webmcp"`

---

## 2. Quantitative Truth & Counts Baseline

| Measurement Point | Total Count | Breakdown / Details |
|---|---|---|
| **All Articles (`essays.json`)** | **71** | 35 English (`en`) + 36 BM (`bm`) |
| **English S-Series (`essays.json`)** | **35** | S1 (5), S2 (2), S3 (4), S4 (9), S5 (3), S6 (3), S7 (3), S8 (3), S9 (3) |
| **MakcikGPT in `essays.json`** | **34** | GENESIS (4), M1 (8), M2 (10), M3 (2), M4 (2), M5 (4), M6 (4) |
| **MakcikGPT in `src/data/makcikgpt/index.ts`** | **40** | 42 slugs referenced, 40 distinct metadata cards in React SPA |
| **Drift: in `index.ts` NOT in `essays.json`** | **8** | `yang-x-diungkap-truth-sembunyi-dalam-void`, `kenapa-syarikat-tu-hantu`, `ai-johor-makcik-tanya`, `nexg-mykad-siapa-beli`, `bang-non-pergi-kuching`, `kit-lipas-meja-kopi`, `taufik-pergi-mana`, `petronas-bod-evolution` |
| **Drift: in `essays.json` NOT in `index.ts`** | **2** | `petronas-full-reality-rakyat-dossier` (PDF), `petronas-leadership-1974-2026` (PDF) |
| **Public MakcikGPT Markdown Index (`makcikgpt-md`)** | **34** | Generated 2026-09-22 from `essays.json` |
| **Public RSS Feed (`public/feed.xml`)** | **34** | Generated Tue, 22 Sep 2026 09:23:23 +0800 |
| **Sitemap MakcikGPT Routes (`public/sitemap.xml`)** | **35** | 1 landing (`/world/makcikgpt/`) + 34 individual articles |
| **Canonical Surfaces Catalog (`surfaces.json`)** | **71** | 27 pages, 3 dynamic, 3 docs, 14 machine, 22 redirects, 1 API, 1 gone |
| **WebMCP Live Tools (`src/data/webmcp.ts`)** | **11** | All 11 live tools verified returning HTTP 200 |

---

## 3. Machine Endpoint Probing (All 200 OK)

- `https://arif-fazil.com/llms.txt` — 200 text/plain (3,394 bytes)
- `https://arif-fazil.com/llms.json` — 200 application/json (7,385 bytes)
- `https://arif-fazil.com/page.json` — 200 application/json (2,164 bytes)
- `https://arif-fazil.com/surfaces.json` — 200 application/json (26,774 bytes)
- `https://arif-fazil.com/missions.json` — 200 application/json (4,500 bytes)
- `https://arif-fazil.com/.well-known/webmcp.json` — 200 application/json
- `https://arif-fazil.com/.well-known/did.json` — 200 application/json
- `https://arif-fazil.com/feed.xml` — 200 text/xml (16 KB)
- `https://arif-fazil.com/sitemap.xml` — 200 text/xml (9.6 KB)
- `https://arif-fazil.com/world/makcikgpt/` — 200 text/html
