# MakcikGPT Publication Schema Specification (Phase 555)

> **Schema Version:** 2.0.0 (Backwards-compatible extension of `essays.json`)  
> **Target:** `src/data/makcikgpt/types.ts` & `src/data/essays.json`  

---

## 1. Article Object Schema (TypeScript Definition)

```typescript
export type EpistemicBand = 'CLAIM' | 'PLAUSIBLE' | 'HYPOTHESIS' | 'UNKNOWN';
export type EpistemicBasis = 'OBS' | 'INT' | 'DER' | 'SPEC' | 'UNKNOWN';
export type PublicationStatus = 'CURRENT' | 'UPDATED' | 'ARCHIVED' | 'CORRECTED' | 'CONTESTED';

export interface SourceReference {
  source_id: string;
  title: string;
  url: string;
  publisher?: string;
  published_at?: string;
  source_type: 'primary' | 'secondary' | 'official_statement' | 'report' | 'unknown';
}

export interface ClaimEntry {
  claim_id: string;
  text: string;
  tag: EpistemicBasis;
  band?: EpistemicBand;
  source_ids?: string[];
  counterevidence_source_ids?: string[];
  maruah_review: 'approved' | 'pending' | 'not_applicable';
}

export interface MakcikCanonicalArticle {
  id: string;
  slug: string;
  canonical_url: string;
  title: string;
  dek: string | null;
  date: string;
  updated_at?: string | null;
  revision: number;
  lang: 'bm';
  series: {
    id: 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'GENESIS';
    n: number;
    note?: string;
  };
  article_type: 'dispatch' | 'dossier' | 'analysis' | 'commentary' | 'correction';
  status: PublicationStatus;
  tags: string[];
  entities?: string[];
  geography?: string[];
  claim_register?: ClaimEntry[];
  source_ledger?: SourceReference[];
  seal: '999';
  provenance_status: 'sealed' | 'legacy' | 'migrating';
  correction_note?: string | null;
}
```

---

## 2. Default & Missing Field Rule

If an existing article does not yet carry atomic claims or sources, fields must explicitly render:

```json
{
  "claim_register": [],
  "source_ledger": [],
  "epistemic_status": "UNKNOWN",
  "reason": "Legacy article awaiting atomic claim decomposition"
}
```

Never invent citations, confidence scores, or verification claims.
