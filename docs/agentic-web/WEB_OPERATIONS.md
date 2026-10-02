# WEB_OPERATIONS.md — builder operating manual (v1, 2026-10-02, openclaw/FI-017)

Complements: WEB_ROUTING.yaml (routing contract) · PAGE_CONTRACT.schema.json (per-page contract) ·
WEB_CAPABILITY_STATE.json (evidence-labelled truth state) · ROUTE-REGISTRY.yaml (serving topology) ·
DEPLOYMENT-POLICY.md (authority).

## 1. Ground law

REALITY > EVERYTHING. Every claim on a page is paid for by an entry in its evidence ledger.
Where payment cannot be made, the sentence is removed — never softened. Numbers are
VERIFIED / REPORTED / DERIVED / UNKNOWN; UNKNOWN prints empty.

## 2. The one build loop

```
edit source (never generated output)
  → CI=true npm run build        (KVM4 lacks /root/web-canon; af-forge runs it)
  → verify locally (200s, links, hash, confidentiality grep)
  → surfaces.json + public/surfaces.json BOTH (dual-copy law)
  → commit (one artifact = one transaction)
  → push branch
  → af-forge: make deploy         (deploy = sealed, never self-authorized)
  → external witness re-fetch of live URLs (no "deployed" from CI output alone)
```

## 3. Dual-copy law (defect found 2026-10-02)

`generate-discovery.cjs` overwrites site-root `surfaces.json` from `public/surfaces.json`
on every build. Editing one copy silently reverts. Edit both, keep byte-identical, verify
with grep across root/public/dist post-build.

## 4. Adding a route (full checklist)

See WEB_ROUTING.yaml `required_steps` 1–7. A route exists when App.tsx route + SPA_ROUTES
+ ROUTE_META shell + surfaces entries + sitemap/llms + local verify are all done, and only
af-forge can make it live.

## 5. PROVEN gate (the bar)

A page is PROVEN only with: 200 reachable · correct content · mobile correct · keyboard
accessible · readable without JS · no overflow · visual QA · no broken links · metadata
correct · structured data correct · sitemap/llms updated · confidentiality check ·
performance measured · deployment receipt. HTTP 200 alone is REACHABLE, nothing more.
Self-attestation never converts UNMEASURED into VERIFIED.

## 6. Confidentiality invariants (never publish)

Reserve/resource volumes · NPV/IRR/EMV · internal seismic/maps/logs · licence geometry ·
coordinates · internal screenshots/correspondence · internal employer documents.
Current documented title ≠ "Principal" (target only). "economist" removed from machine
catalogs by F13 directive 2026-10-02 — do not re-introduce.

## 7. Content source rule

First-party extraction only. Second-hand summaries (another lane's report) are REPORTED,
not content. Defects from a mission brief are fact-checked against the artifact before any
fix is built; a defect that does not reproduce gets no fix code.

## 8. Rollback

Branch is the rollback: delete branch / revert commit on main, redeploy last good state via
af-forge. Frozen PDF hash must move in the same commit that replaces the PDF.
