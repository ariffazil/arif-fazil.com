# RECEIPT — EARTH observatory reality-alignment stabilization
Date: 2026-10-26 · Agent: kimi-code/FI-008 · Session: SEAL-e7c44f72932a4b7c · Trace: trc-e783288291be
Trigger: sovereign instruction (Arif) after enterprise audit of the three public EARTH pages.

## What changed (commit b865f68, deployed same session)
- ADOPTED orphan: public/earth/borneo-sections.html (live-only, untracked; would have been destroyed by next `rsync --delete` split-roots sync — OBSERVED failure class, not hypothetical).
- NEW machine layer: public/earth/data/transects.json (5 transect registrations, transfer domains) · public/earth/data/claims_ledger.json (17 claims; OBS/DER/INT/SPEC/EXT; georeference gap flags; verdict rules R1–R5).
- Page A: H1–H4 hypothesis-family fields + admissibility/maturity per model; 3/8 false-equivalence ring replaced with per-model decisive counts (root cause: dataset-wide done/total rendered identically on all cards).
- Page B: "Model D KILLED" → D1 CONTRADICTED / D2 SUPPORTED / D3 HOLD (KMY point georeference MISSING — rule R1); Moho reconciliation table (32.8 / ~60 / ~24 / 32.8–52.5 / 25–55± / summit-gap); A/F/C nested-modifier declaration; mobile-shale declared switchable H1 layer; Active Earth panel.
- Page C: analogue firewall banner; gravity "independent check" → compatible + non-unique; "active now" → young deformation only; fossil trench → interpreted-as-model; Sarawak-cycles correlation firewall; footer claim IDs.

## Verification (all live probes, not claims)
JSON parse OK · inline JS syntax OK · make build exit 0 · make split-roots aligned · make verify-pages PASS 265/265 · curl: 5/5 URLs 200 with new bytes present (A:2 B:3 C:3 markers, both JSONs served).

## Open gaps (named decisive observations, deliberately unresolved)
1. KMY station coordinates + interface definition (unblocks or kills D3). 2. Surface-wave tomography DOI for 25–55 km / LAB≈100 km claims (ledger CL-SW-CRUST-25-55 marked EXT). 3. Moho control beneath Kinabalu summit. 4. KL2 Sarawak-cycle↔SB crosswalk. 5. Kernel state: SOURCE_BUILD_DRIFT + this session OBSERVE_ONLY — arif_memory write HOLD; canonical lesson lives in this receipt + commit body.

## Lesson (for next generation)
Public interpretive pages rot by (1) orphan drift, (2) aggregated scores read as model evidence, (3) kill verdicts crossing spatial gaps. Counter each with: registry+adoption, per-entity scoring, claim-addressable georeferenced ledger with explicit null-with-gap. Verification is the terminal state — the orphan was only real once `git ls-files` + the split-roots `--delete` semantics were probed.

---

## ADDENDUM — second repair pass, commits e042265 (arif-fazil.com) + a3cf3e55 (GEOX)

Same session SEAL-e7c44f72932a4b7c, following the EARTH/GEOX site audit (second enterprise audit, 2026-10-26).

**Collocation finding (the audit's biggest unresolved → resolved by computation):**
KMY_BROADBAND (evidence_chain.json: 5.98N 116.07E) = the transect control point "Kota Kinabalu", chainage 429.9 km. The A/D Moho predictions sit at chainage 520.0 km. Separation 90.1 km along-chain / 82.5 km straight-line vs ~20–30 km RF footprint → the deterministic "Model A PASS / Model D KILLED" could never see its own test location. Withdrawn as collocation error; non-destructive `audit_amendment_2026_10_26` block added to evidence_chain.json (original run record untouched). Identity defect also flagged: chain MODEL-A (30–35 km) ≠ display MODEL-A (Moho 60 km @ 485 km) — same label, two crustal states.

**P0 claim-language (EARTH):** 100%-preservation withdrawn; synthetic log panel de-welled (4 motifs, watermark, no MD depths, no GOC/commerciality proof); founder outcomes relabelled PRIVATE WITNESS / ATTESTED tier across index + malay-basin + kinabalu-basin + cross-sections; exact well coordinates in malay-basin JS replaced by jittered basin-approximates; "same coordinates the founder drilled on" demo-point claim withdrawn; global "nothing here is claimed unobserved" → per-number tier grammar.
**F13 decision queued:** wells.json `tier_policy_amendment_proposed` — ratify two-tier (EXISTENCE | ATTESTED-with-witness-labels), or order deletion of `significance`/outcome fields. Data values untouched pending ruling.

**P0 runtime honesty (GEOX):** landing SPA (built tree = only surviving copy; repo copy was OLDER — second orphan-drift instance) live-patched: SYSTEM_LIVE/VAULT_999_CONNECTED → "RUNTIME: SEE /health"; "42 tools"/31/32 hardcodes → live /health · tools/list grammar (registry drift gate PASS at 27; freshness timestamps already fixed by the running build aa980ce9). arif site /geox/ shell badge now fetches /health client-side (unreachable ⇒ explicitly "not a claim of health").

**Left in other lanes (flagged, not touched):**
- GEOX `make deploy-apps` target is broken against current layout (`/opt/geox/app` paths fail; would also restart geox-mcp + reseed). I performed only the sanctioned static copy `apps/index.html → /var/www/html/geox/apps/` and verified served bytes.
- `deployment_drift` reported by GEOX /health is an arifOS dependency identity (source 07b4312 vs built 83bae89) — kernel rebuild/deploy is the arifOS lane's call.
- GEOX deployed build (aa980ce9) ≠ /root/GEOX HEAD (aa7dab58): deploy-lag belongs to whichever lane is mid-P0-patch on fix/geox-p0-rebased.

**Verification:** make build ×2, split-roots ×2, verify-pages PASS 265/265; live curl probes show 0 remnants of SYSTEM_LIVE / "42 tools" / 100%-preservation / "proves commercial" / "claimed unobserved" on all served surfaces; evidence_chain amendment present in dist + /var/www/html copies.
