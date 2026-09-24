# AAA × MakcikGPT Integration Specification (Phase 333)

> **Status:** APPROVED SPECIFICATION  
> **Timestamp:** 2026-09-24T08:56:00+08:00  

---

## 1. Integration Boundary

MakcikGPT interfaces with the AAA federation strictly through **read-only discovery and provenance witnessing**:

```
[MakcikGPT Articles & Claims] 
         │
         ▼
[Deterministic Hash / Merkle Leaf]
         │
         ▼
[AAA Witness / VAULT999 Seal Lineage] ──► Verified at /999/verify
         │
         ▼
[Discovery Manifests] ──► /world/makcikgpt/llms.txt & /feed.xml
```

---

## 2. Manifest Additions

The root [`/llms.txt`](file:///root/arif-fazil.com/sites/arif-fazil.com/public/llms.txt) and [`/llms.json`](file:///root/arif-fazil.com/sites/arif-fazil.com/public/llms.json) will point directly to:
- `/world/makcikgpt/llms.txt` — Scoped machine context for MakcikGPT.
- `/world/makcikgpt/articles.json` — Structured article index with series, dates, and claim counts.
- `/feed.xml` — Canonical RSS feed.

No write routes, no automated publication endpoints, and no interactive execution APIs are exposed.
