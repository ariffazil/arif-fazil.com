// Site status truth — generated snapshot + live refresh when reachable.
// Snapshot: src/lib/status.generated.json (scripts/gen_status.py, build time).
// The public host does not expose /drift, so the browser cannot re-probe; the
// snapshot's generated_at is always shown so no figure ever looks live-proof.

import generated from './status.generated.json'

export type SiteStatus = {
  canonical: number
  live: number | null
  driftOk: boolean | null
  runtimeCommit: string | null
  mainHead: string
  internal: number
  generatedAt: string
}

export const STATUS: SiteStatus = {
  canonical: generated.canonical,
  live: generated.live ?? null,
  driftOk: generated.drift_ok ?? null,
  runtimeCommit: generated.runtime_commit ?? null,
  mainHead: generated.main_head,
  internal: generated.internal,
  generatedAt: generated.generated_at,
}

export function liveLabel(): string {
  if (STATUS.live == null) return `${STATUS.canonical} canonical`
  return `${STATUS.live}/${STATUS.canonical} live/canonical`
}
