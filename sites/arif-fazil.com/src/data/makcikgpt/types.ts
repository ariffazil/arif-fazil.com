export type EpistemicTag = 'OBS' | 'DER' | 'INT' | 'SPEC' | 'HYP';
export type MaruahReviewStatus = 'approved' | 'pending' | 'not_applicable';
export type ProvenanceStatus = 'legacy' | 'migrating' | 'sealed';

export interface ClaimItem {
  claim_id: string;
  text: string;
  tag: EpistemicTag;
  source_id?: string;
  confidence_basis?: string;
  // Canonical values: MaruahReviewStatus. essays.json (the SOT) also carries
  // annotated approvals ("approved — …"); the sealed gate checks exact 'pending'.
  maruah_review?: MaruahReviewStatus | string;
}

export interface SourceItem {
  source_id: string;
  // Union projects the values actually present in essays.json (the SOT).
  // A new source type must be added here — the build fails closed on drift.
  type: 'filing' | 'document' | 'court_record' | 'news' | 'official_statement' | 'analysis'
    | 'primary_record' | 'hadith' | 'reference' | 'dataset' | 'company_registry'
    | 'official_report' | 'exchange_filing' | 'market_data';
  title: string;
  url: string;
  archived_url?: string;
  retrieved_at?: string;
  content_hash?: string;
}

export interface CounterEvidenceItem {
  source_id?: string;
  summary: string;
  disposition: string;
}

export interface VersionLineage {
  version: string;
  published: string;
  last_updated: string;
  supersedes?: string;
  superseded_by?: string;
}

export interface ArticleContent {
  slug: string;
  html: string;
}

export interface TemporalValidity {
  valid_as_of?: string;
  verify_at?: string;
  stale_after?: string;
}

export interface MakcikArticleMeta {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  domain: string;
  language: 'ms' | 'en' | 'bilingual';
  excerpt: string;
  tags: string[];
  seal: string;

  // APEX Provenance & Claim Register Schema
  provenance_status?: ProvenanceStatus;
  claim_register?: ClaimItem[];
  source_ledger?: SourceItem[];
  counter_evidence?: CounterEvidenceItem[];
  version_lineage?: VersionLineage;
  merkle_leaf?: string;

  // Temporal validity — when was this evidence good, and when should it be re-checked
  temporal_validity?: TemporalValidity;
}

