# MakcikGPT Drift Audit Report (Phase 111)

> **Audit Date:** 2026-09-24T08:53:00+08:00  
> **Status:** F2 ANOMALY DETECTED & CLASSIFIED  

---

## 1. Summary of Drift

- **`src/data/essays.json` count:** 34 MakcikGPT articles
- **`src/data/makcikgpt/index.ts` count:** 40 articles
- **Net Delta:** 6 articles (8 in `index.ts` only, 2 in `essays.json` only)

---

## 2. Articles in `index.ts` Missing from `essays.json`

The following 8 articles exist as rendered web pages in the SPA, but are omitted from canonical metadata, RSS feeds, and the markdown mirror:

1. `yang-x-diungkap-truth-sembunyi-dalam-void` (2026-09-22) — *Yang x Diungkap: Kenapa Truth Sembunyi dalam Void*
2. `kenapa-syarikat-tu-hantu` (2026-09-22) — *Kenapa Syarikat Tu Hantu*
3. `ai-johor-makcik-tanya` (2026-09-17) — *Bang Non, Hang Tanya Makcik Pasal AI...*
4. `nexg-mykad-siapa-beli` (2026-09-27) — *Hang Beli MyKad Hang Sendiri Ke, Atau Ishak Beli Depa?*
5. `bang-non-pergi-kuching` (2026-09-17) — *Bang Non Pergi Kuching, Cakap Aku Nak Setel...*
6. `kit-lipas-meja-kopi` (2026-09-17) — *Macam Mana Makcik Tahu Semua Ni? — Kit Lipas Meja Kopi Episode 1*
7. `taufik-pergi-mana` (2026-10-05) — *Taufik Lepas Ni Pergi Mana? Empat Sebab CEO Takut, Satu Sebab Dia Stay*
8. `petronas-bod-evolution` (2026-09-14) — *BOD PETRONAS: Tadak Minyak, Tadak AGM, Tadak Siapa Boleh Tanya*

---

## 3. Articles in `essays.json` Missing from `index.ts`

The following 2 items exist in `essays.json` and are published as standalone PDFs/dossiers, but lack cards in the React SPA index:

1. `petronas-full-reality-rakyat-dossier` (2026-08-26) — *PETRONAS: The Full Reality — A Civic Intelligence Dossier for the Rakyat of Malaysia* (Series M1#3)
2. `petronas-leadership-1974-2026` (2026-09-17) — *Every PETRONAS Chairman & Chief Executive 1974–2026 — Sovereign Intelligence Dossier* (Series M1#4)

---

## 4. Reconciliation Strategy (Hold for 888 Review)

To reconcile this cleanly without loss of content or provenance:
1. Backport the 8 missing articles into `src/data/essays.json` with assigned series, dates, tags, and provisional claim registers (`maruah_review: "approved"` or `"pending"`).
2. Wire the 2 PETRONAS dossiers into `src/data/makcikgpt/index.ts` so they appear as first-class dossier cards in the React broadsheet.
3. Re-run `generate-makcik-index.cjs`, `generate-feed.cjs`, and `generate-agent-shells.cjs` to produce exact 1:1 parity (42 total articles across all surfaces).
