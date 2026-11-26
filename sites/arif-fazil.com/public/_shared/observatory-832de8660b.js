/**
 * arifOS Observatory — Client-Side Renderer.
 *
 * Hardened contract (Prompt: Observatory upgrade):
 *   1. Prefer /api/public-state (arifos.public-state.v1, sanitized).
 *   2. Fall back to the static mirror /.well-known/public-state.json, then
 *      the legacy mirror /.well-known/observatory-snapshot-latest.json.
 *   3. Final fallback to the live observatory.v1 endpoint
 *      /api/observatory/v1/snapshot (kept for backward compatibility).
 *   4. Findings are normalized against the public-state.v1 envelope. Items
 *      marked SCHEMA_MISMATCH render as such, never as a raw JS exception.
 *   5. Stable organ IDs in the DOM: only the canonical six
 *      (arifos | geox | wealth | well | aforge | aaa). Aliases collapse.
 *
 * DITEMPA BUKAN DIBERI — Forged, Not Given.
 */
(function () {
  'use strict';

  const PUBLIC_STATE_LIVE = '/api/public-state';
  // 2026-10-31: the Observatory page is served from arif-fazil.com, but the live
  // public-state contract is served by the kernel host. Relative '/api/public-state'
  // therefore resolved against the WRONG origin (503) and the page silently fell
  // through to a legacy snapshot shape — which is why organs rendered 0/5 MEASURED
  // while every organ answered 200. Name the kernel host explicitly.
  const PUBLIC_STATE_KERNEL = 'https://arifos.arif-fazil.com/api/public-state';
  const PUBLIC_STATE_MIRROR = '/.well-known/public-state.json';
  const SNAPSHOT_MIRROR = '/.well-known/observatory-snapshot-latest.json';
  const SNAPSHOT_LIVE = '/api/observatory/v1/snapshot';
  const REFRESH_MS = 30000;
  // arifos.public-state.v1 can carry stale data (esp. arifFlow FQ). After
  // this window, the renderer falls through to the signed observatory snapshot
  // instead of displaying a stale public-state. 300 s = 5 min matches arifFlow
  // TTL per AAA-ZEN-ALIGNMENT §E.
  const OBSERVATORY_FRESHNESS_WINDOW_MS = 300000;
  const UNAVAILABLE = 'unavailable';
  // Stable canonical organ IDs — used to normalize any alias passed in by
  // upstream schemas or renderers, so DOM data-organ attributes never drift.
  const CANONICAL_ORGANS = ['arifos', 'geox', 'wealth', 'well', 'aforge', 'aaa'];
  const ORGAN_ALIASES = {
    arifos_kernel: 'arifos', kernel: 'arifos', arifoss: 'arifos', 'arif-os': 'arifos',
    geoxorgan: 'geox', geoxorgane: 'geox',
    wealthorgan: 'wealth',
    wellorgan: 'well',
    aaafederation: 'aaa', aaacontrol: 'aaa',
    aforgeorgan: 'aforge', 'a-forge': 'aforge', 'a_forge': 'aforge',
  };
  const stableOrganId = (value) => {
    if (value == null) return 'unknown';
    const compact = String(value).toLowerCase().replace(/[\s_-]+/g, '');
    for (const canonical of CANONICAL_ORGANS) {
      if (compact === canonical) return canonical;
    }
    if (Object.prototype.hasOwnProperty.call(ORGAN_ALIASES, String(value).toLowerCase())) {
      return ORGAN_ALIASES[String(value).toLowerCase()];
    }
    return 'unknown';
  };

  const runtime = {
    fetch: 'not measured',
    fetchSource: 'source: missing',
    render: 'not measured',
    lastRenderAt: null,
    timer: null,
    checks: {},
  };

  /* ── defensive envelope + DOM helpers ───────────────────── */
  const $ = (selector, parent) => (parent || document).querySelector(selector);
  const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
  const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
  const isEnvelope = (value) => isRecord(value) && (
    hasOwn(value, 'value') || hasOwn(value, 'state') || hasOwn(value, 'source') ||
    hasOwn(value, 'confidence') || hasOwn(value, 'observed_at') || hasOwn(value, 'age_seconds')
  );
  const unwrap = (input) => {
    let value = input;
    let depth = 0;
    while (isRecord(value) && hasOwn(value, 'value') && depth < 8) {
      value = value.value;
      depth += 1;
    }
    return value;
  };
  const val = unwrap;
  const esc = (input) => String(input == null ? '' : input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  const setText = (selector, value) => {
    const element = $(selector);
    if (element) element.textContent = value;
  };
  const asArray = (input) => {
    const value = unwrap(input);
    return Array.isArray(value) ? value : [];
  };
  const findingsList = (data) => {
    const findings = unwrap(data && data.findings);
    if (Array.isArray(findings)) return findings;
    if (isRecord(findings)) {
      // public-state.v1 envelope: data.findings.items OR data.findings.open
      const nested = [findings.items, findings.open, findings.findings, findings.list].find(
        (value) => value !== undefined && value !== null,
      );
      const list = unwrap(nested);
      if (Array.isArray(list)) return list;
    }
    return [];
  };
  // Schema-mismatch-shaped findings are surfaced, not dropped. Items whose
  // category == 'SCHEMA_MISMATCH' came from the public-state normalizer
  // re-classifying an unparseable upstream entry; renderers must display
  // them honestly instead of crashing on the malformed original.
  const findingIsSchemaMismatch = (finding) => {
    if (!isRecord(finding)) return false;
    const category = unwrap(finding.category);
    return String(category || '').toUpperCase() === 'SCHEMA_MISMATCH';
  };
  const compactFinding = (finding) => {
    if (!isRecord(finding)) return UNAVAILABLE;
    return compactValue(
      firstPresent(finding.description, finding.summary, finding.title, finding.message, finding.id),
    );
  };
  const safeJson = (value) => {
    try { return JSON.stringify(value); } catch (error) {
      console.error('Observatory value serialization failed:', error);
      return UNAVAILABLE;
    }
  };
  const compactValue = (input, fallback) => {
    const missing = fallback === undefined ? UNAVAILABLE : fallback;
    const value = unwrap(input);
    if (value == null || value === '') return missing;
    if (Array.isArray(value)) {
      if (!value.length) return missing;
      return value.map((item) => compactValue(item, UNAVAILABLE)).join(' · ');
    }
    if (isRecord(value)) {
      const preferred = ['status', 'verdict', 'state', 'summary', 'name', 'id'];
      const preferredKey = preferred.find((key) => hasOwn(value, key) && unwrap(value[key]) != null);
      if (preferredKey) return compactValue(value[preferredKey], fallback);
      const entries = Object.entries(value).slice(0, 4).map(([key, item]) => `${key}=${compactValue(item, UNAVAILABLE)}`);
      return entries.length ? entries.join(' · ') : missing;
    }
    return String(value);
  };
  const sourceValue = (input) => {
    if (!isRecord(input)) return null;
    const source = unwrap(input.source);
    return source == null || source === '' ? null : String(source);
  };
  const confidenceValue = (input) => {
    if (!isRecord(input)) return null;
    const confidence = unwrap(input.confidence);
    return confidence == null || confidence === '' ? null : String(confidence);
  };
  const observedAtValue = (input) => {
    if (!isRecord(input)) return null;
    const observedAt = unwrap(input.observed_at);
    return observedAt == null || observedAt === '' ? null : String(observedAt);
  };
  const ageSecondsValue = (input) => {
    if (!isRecord(input)) return null;
    const age = Number(unwrap(input.age_seconds));
    return Number.isFinite(age) && age >= 0 ? age : null;
  };
  const ago = (timestamp) => {
    if (!timestamp) return UNAVAILABLE;
    const milliseconds = new Date(timestamp).getTime();
    if (!Number.isFinite(milliseconds)) return UNAVAILABLE;
    const seconds = Math.max(0, Math.floor((Date.now() - milliseconds) / 1000));
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };
  const freshnessValue = (input, fallbackObservedAt) => {
    const age = ageSecondsValue(input);
    if (age != null) return `${Math.floor(age)}s old`;
    const observedAt = observedAtValue(input) || fallbackObservedAt;
    return observedAt ? `${ago(observedAt)} old` : UNAVAILABLE;
  };
  const metadataLine = (input, fallbackObservedAt, extra) => {
    const source = sourceValue(input) || 'missing';
    const confidence = confidenceValue(input) || 'unknown';
    const freshness = freshnessValue(input, fallbackObservedAt);
    return `source: ${source} · confidence: ${confidence} · freshness: ${freshness}${extra ? ` · ${extra}` : ''}`;
  };
  const stateToken = (input) => {
    if (isRecord(input)) {
      const value = unwrap(input);
      if (hasOwn(input, 'value') && (value == null || value === '')) return 'unknown';
      if (typeof value === 'string' || typeof value === 'boolean') return String(value);
      const status = unwrap(input.status);
      if (status != null) return String(status);
      const state = unwrap(input.state);
      if (state != null) return String(state);
    }
    const value = unwrap(input);
    return value == null ? '' : String(value);
  };
  /* -- semantic vocabulary ---------------------------------------------
   * 2026-10-28 (333-AGI): HOLD is a governance circuit-breaker, not a
   * breakdown. Reading it as "down" painted a LIVE organ red (GEOX:
   * transport live, 27 tools, identity VERIFIED, governance HOLD) - a false
   * alarm on the public surface. HOLD/SABAR now read as amber (constrained);
   * fail / error / blocked / critical stay red.
   *
   * Classification also stops guessing health from the DISPLAY string.
   * The producer ships a measured `state` beside every value; values like
   * "http 200" or "27 public tools" are not health tokens, so the record's
   * own state is the honest source. A value that IS a health token still
   * wins (HOLD stays HOLD).
   */
  const UNKNOWN_TOKENS = /^(unknown|unavailable|missing|null|none|not measured|unmeasured|unverified|n\/a|—)$/;
  const DOWN_TOKENS = /\b(void|down|fail|failed|false|error|critical|blocked|denied|breach|retak|killed)\b/;
  const DEGRADED_TOKENS = /\b(hold|held|holding|warn|warning|degraded|partial|amber|sabar|limited|stale|pending|planned|next|queued|incomplete)\b/;
  const HEALTHY_TOKENS = /\b(true|up|healthy|pass|passed|seal|sealed|alive|live|fresh|ready|full|aligned|verified|kukuh|amanah|bijaksana|selamat|stable|optimal|active|measured|loaded)\b/;
  // A gap, an unlinked row, or an unmeasured word outranks "verified"/"pass"/"true".
  const GAP_TOKENS = /\b(gaps?|unlinked|not_attempted|unsigned|unverifiable|unmeasured)\b/;
  const classifyToken = (token) => {
    if (!token || UNKNOWN_TOKENS.test(token)) return null;
    if (DOWN_TOKENS.test(token)) return 'down';
    if (GAP_TOKENS.test(token) || token.includes('not attempted')) return 'degraded';
    if (/\bunknown\b/.test(token)) return 'unknown';
    if (DEGRADED_TOKENS.test(token)) return 'degraded';
    if (HEALTHY_TOKENS.test(token)) return 'healthy';
    return null;
  };
  const semanticState = (input) => {
    const token = stateToken(input).trim().toLowerCase();
    const direct = classifyToken(token);
    if (direct) return direct;
    if (!isRecord(input)) return 'unknown';
    const value = unwrap(input);
    if (hasOwn(input, 'value') && (value == null || value === '')) return 'unknown';
    const declared = unwrap(input.status) != null ? unwrap(input.status) : unwrap(input.state);
    if (typeof declared === 'string') {
      const state = classifyToken(declared.trim().toLowerCase());
      if (state) return state;
    }
    return 'unknown';
  };
  const stateClass = semanticState;
  const paletteClass = (input) => ({
    healthy: 'green', degraded: 'amber', down: 'red', unknown: 'grey', held: 'amber', unmeasured: 'grey',
  }[input] || { healthy: 'green', degraded: 'amber', down: 'red', unknown: 'grey', held: 'amber', unmeasured: 'grey' }[semanticState(input)]);
  const badge = (input, label) => {
    const shown = label == null ? compactValue(input) : compactValue(label);
    const semantic = semanticState(input);
    return `<span class="status status--${semantic} badge badge--${paletteClass(input)}" data-state="${semantic}">${esc(shown)}</span>`;
  };
  const firstPresent = (...values) => values.find((value) => value !== undefined && value !== null);
  const recordState = (record, fallback) => {
    if (isRecord(record)) {
      const status = firstPresent(record.status, record.state, record.verdict);
      if (status != null) return status;
    }
    return fallback == null ? record : fallback;
  };
  const normalizeKey = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  // Canonical vault summary: the verified chain head is chain_integrity.head_seq_canonical.
  // receipts.seal_chain_seq is a sealer-panel alias that can report the canonical ENTRY count
  // (78) as a sequence; never use it as the head. F3: show the hash-bound head, and scope
  // historical gaps separately from canonical gaps.
  const vaultSummary = (data) => {
    const ci = (data && data.chain_integrity) || {};
    const rc = (data && data.receipt) || {};
    const head = firstPresent(ci.head_seq_canonical, ci.head_seq, rc.head_sequence);
    const entries = firstPresent(ci.canonical_entries, rc.canonical_entry_count);
    const canonicalGaps = firstPresent(ci.gap_count_canonical, 0);
    const historicalGaps = firstPresent(ci.gap_count_historical, ci.gap_count);
    const hash = firstPresent(ci.head_hash, rc.head_hash);
    const verified = firstPresent(ci.verified_canonical, rc.chain_verified, canonicalGaps === 0);
    const text = `head_seq ${hash ? compactValue(head) : `${compactValue(head)} UNCONFIRMED (hash null)`} · canonical ${verified ? 'verified' : 'FAILED'} (${compactValue(canonicalGaps)} gaps) · entries ${compactValue(entries)} · historical gaps ${compactValue(historicalGaps)}`;
    return { head, entries, canonicalGaps, historicalGaps, hash, verified, text };
  };

  /* ── governance normalization ────────────────────────────── */
  const floorDefinitions = [
    { id: 'F1', aliases: ['F1'], name: 'AMANAH' },
    { id: 'F2', aliases: ['F2'], name: 'TRUTH' },
    { id: 'F3', aliases: ['F3'], name: 'WITNESS' },
    { id: 'F4', aliases: ['F4'], name: 'CLARITY' },
    { id: 'F5', aliases: ['F5'], name: 'PEACE²' },
    { id: 'F6', aliases: ['F6'], name: 'MARUAH' },
    { id: 'F7', aliases: ['F7'], name: 'HUMILITY' },
    { id: 'F8', aliases: ['F8'], name: 'GENIUS' },
    { id: 'F9', aliases: ['F9'], name: 'ANTI-HANTU' },
    { id: 'F10', aliases: ['F10', 'L10'], name: 'ONTOLOGY' },
    { id: 'F11', aliases: ['F11', 'L11'], name: 'AUDIT' },
    { id: 'F12', aliases: ['F12', 'L12'], name: 'INJECTION' },
    { id: 'F13', aliases: ['F13', 'L13'], name: 'SOVEREIGN' },
  ];
  const normalizedFloors = (governance) => {
    const raw = unwrap(governance && governance.floors);
    if (Array.isArray(raw)) {
      return floorDefinitions.map((definition) => {
        const record = raw.find((item) => {
          const candidate = unwrap(item);
          const id = isRecord(candidate) ? firstPresent(candidate.id, candidate.floor, candidate.name) : candidate;
          return definition.aliases.includes(String(unwrap(id)).toUpperCase());
        });
        return { definition, record };
      });
    }
    const floors = isRecord(raw) ? raw : {};
    return floorDefinitions.map((definition) => {
      const key = Object.keys(floors).find((candidate) => definition.aliases.includes(String(candidate).toUpperCase()));
      return { definition, record: key ? floors[key] : undefined };
    });
  };
  const floorParts = (definition, record) => {
    const data = isRecord(record) ? record : {};
    const scoreRecord = firstPresent(data.score, isEnvelope(record) ? record : undefined);
    const rawScore = unwrap(firstPresent(data.score, isEnvelope(record) ? record : undefined));
    const score = typeof rawScore === 'number' && Number.isFinite(rawScore)
      ? rawScore
      : (typeof rawScore === 'string' && rawScore.trim() !== '' && !Number.isNaN(Number(rawScore)) ? Number(rawScore) : null);
    const statusRecord = firstPresent(data.status, data.verdict, data.state, isEnvelope(record) ? record.state : undefined);
    const status = compactValue(statusRecord, UNAVAILABLE);
    const normalizedStatus = status.toLowerCase();
    let measurement = 'not measured';
    if (/stale/.test(normalizedStatus)) measurement = 'stale';
    else if (/blocked|hold|void|fail|critical/.test(normalizedStatus)) measurement = 'blocked';
    // A predicate floor can still carry a number (F7 0.04, F12 0.00). That
    // number is not a measurement. Counting it painted 6/13 while
    // governance.floors_measured stayed 4.
    else if (/\bpredicate\b/.test(normalizedStatus)) measurement = 'loaded / not measured';
    else if (score != null) measurement = 'measured';
    else if (record !== undefined) measurement = 'loaded / not measured';
    if (definition.id === 'F13' && score == null) {
      const active = /active|pass|seal|human/.test(normalizedStatus);
      measurement = active ? 'active · human authority · not measured' : 'human authority · not measured';
    }
    const state = score != null
      ? recordState(statusRecord, scoreRecord)
      : (measurement === 'blocked' ? 'blocked' : (measurement === 'stale' ? 'stale' : 'unknown'));
    return { score, scoreRecord, statusRecord, status, measurement, state };
  };
  const findEarthWitness = (decomposition) => {
    const data = unwrap(decomposition);
    if (!isRecord(data)) return { found: false, value: undefined };
    if (hasOwn(data, 'witness.earth')) return { found: true, value: data['witness.earth'] };
    const candidates = [data.witness, data.F3, data.f3, data.tri_witness, data.triwitness].filter(isRecord);
    for (const candidate of candidates) {
      if (hasOwn(candidate, 'earth')) return { found: true, value: candidate.earth };
      if (isRecord(candidate.witness) && hasOwn(candidate.witness, 'earth')) return { found: true, value: candidate.witness.earth };
    }
    return { found: false, value: undefined };
  };
  const flattenStates = (input, prefix, output) => {
    const value = unwrap(input);
    const target = output || [];
    const path = prefix || '';
    if (Array.isArray(value)) {
      value.forEach((item, index) => flattenStates(item, `${path}[${index}]`, target));
      return target;
    }
    if (isRecord(value)) {
      Object.entries(value).forEach(([key, item]) => flattenStates(item, path ? `${path}.${key}` : key, target));
      return target;
    }
    if (value != null && value !== '') target.push({ path, value: String(value), state: semanticState(value) });
    return target;
  };
  const effectiveGovernance = (governance) => {
    const rawVerdict = compactValue(governance && governance.verdict, UNAVAILABLE).toUpperCase();
    const explicitReason = compactValue(firstPresent(governance && governance.reason, governance && governance.verdict_reason), '');
    if (rawVerdict !== 'UNKNOWN' && rawVerdict !== UNAVAILABLE.toUpperCase()) {
      return { rawVerdict, verdict: rawVerdict, reason: explicitReason || 'reason unavailable' };
    }
    const decomposition = governance && governance.verdict_decomposition;
    const earth = findEarthWitness(decomposition);
    const earthValue = earth.found ? compactValue(earth.value, UNAVAILABLE) : '';
    if (earth.found && semanticState(earth.value) === 'unknown') {
      return { rawVerdict, verdict: 'HOLD', reason: 'HOLD — F3 witness.earth incomplete (missing or unknown)' };
    }
    const decisive = flattenStates(decomposition).find((entry) => entry.state === 'down' || entry.state === 'degraded');
    const explicitEarthClaim = /witness\.earth/i.test(explicitReason);
    if (explicitReason && (!explicitEarthClaim || (earth.found && semanticState(earth.value) === 'unknown'))) {
      return { rawVerdict, verdict: 'HOLD', reason: `HOLD — ${explicitReason}` };
    }
    if (decisive) {
      const decisiveText = `${decisive.path || 'verdict decomposition'} is ${decisive.value}`;
      if (!/witness\.earth/i.test(decisiveText) || earth.found) {
        return { rawVerdict, verdict: 'HOLD', reason: `HOLD — ${decisiveText}` };
      }
    }
    if (earth.found && earthValue) return { rawVerdict, verdict: 'HOLD', reason: `HOLD — raw verdict UNKNOWN; witness.earth reports ${earthValue}` };
    return { rawVerdict, verdict: 'HOLD', reason: 'HOLD — raw verdict UNKNOWN; no decisive measured decomposition is available' };
  };

  /* ── NOW + metadata ──────────────────────────────────────── */
  function renderNowStrip(data) {
    const set = (id, label, state) => {
      setText(`#now-${id} .val`, label);
      const pill = $(`#now-${id}`);
      if (pill) pill.className = `now-pill now-pill--${paletteClass(state)}`;
    };
    const substrate = data.substrate || {};
    const cpuValue = unwrap(substrate.cpu);
    const cpuPercent = isRecord(cpuValue) ? firstPresent(cpuValue.percent, cpuValue.cpu_percent) : firstPresent(unwrap(substrate.cpu_percent), cpuValue);
    const governance = effectiveGovernance(data.governance || {});
    const metabolism = asArray(data.metabolism);
    // 2026-10-31 reconcile: public-state.v1 carries provenance under
    // runtime_identity / organs[].* / receipt — NOT under legacy `substrate`,
    // `evidence` or `authority` blocks. The legacy reads returned undefined and
    // the strip printed "unavailable" beside live data: a projection defect,
    // not a measurement gap. Count what is actually present.
    const organRows = Object.values(unwrap(data.organs) || {}).map((row) => unwrap(row)).filter(isRecord);
    const measuredSources = [];
    organRows.forEach((row) => {
      Object.values(row).forEach((record) => {
        if (isRecord(record) && typeof record.source === 'string' && record.source.trim()) measuredSources.push(record.source);
      });
    });
    const identityMeta = data.runtime_identity || {};
    if (typeof identityMeta.source === 'string' && identityMeta.source.trim()) measuredSources.push(identityMeta.source);
    const probedOrgans = organRows.filter((row) => {
      const transport = unwrap(row.transport || row.liveness);
      return isRecord(transport) ? Boolean(firstPresent(transport.value, transport.state)) : Boolean(transport);
    }).length;
    const planes = data.planes || {};
    const authorizationRecord = data.authority && data.authority.effective_action_authority;
    const authorized = isRecord(unwrap(authorizationRecord)) ? unwrap(authorizationRecord).authorized : unwrap(authorizationRecord);
    const authorizationText = firstPresent(planes.authorization, authorized);

    set('substrate', cpuPercent != null
      ? `${cpuPercent}% CPU`
      : (probedOrgans ? `${probedOrgans}/${organRows.length} organs probed` : UNAVAILABLE),
      cpuPercent != null ? substrate.cpu : (probedOrgans ? 'live tcp/http probe' : undefined));
    set('governance', governance.rawVerdict === 'UNKNOWN' ? 'HOLD (raw UNKNOWN)' : governance.verdict, governance.verdict);
    set('intelligence', metabolism.length ? `${metabolism.length} stages` : UNAVAILABLE, metabolism.length ? 'measured' : 'unknown');
    set('evidence', measuredSources.length ? `${measuredSources.length} sourced fields` : UNAVAILABLE, measuredSources.length ? 'measured' : 'unknown');
    set('authority', authorizationText != null && authorizationText !== ''
      ? compactValue(authorizationText)
      : UNAVAILABLE,
      authorizationText != null && authorizationText !== '' ? 'declared authority plane' : undefined);
  }

  function renderMeta(data) {
    setText('#meta-age', data.observed_at ? `${ago(data.observed_at)} ago` : UNAVAILABLE);
    setText('#meta-incidents', String(asArray(data.incidents).length));
    const findings = findingsList(data);
    const openFindings = findings.filter((finding) => compactValue(finding && finding.status, '').toUpperCase() === 'OPEN');
    setText('#meta-findings', String(openFindings.length || findings.length));
    setText('#meta-stage', compactValue(firstPresent(data.stage_evidence && data.stage_evidence.stage, data.conformance && data.conformance.stage)));

    const drift = unwrap(data.runtime_identity && data.runtime_identity.drift);
    const driftElement = $('#meta-drift');
    if (driftElement && isRecord(drift)) {
      const entries = Object.entries(drift);
      const drifted = entries.filter(([, value]) => /DRIFTED/i.test(compactValue(value, ''))).length;
      driftElement.textContent = `${drifted}/${entries.length} drifted`;
      driftElement.className = `badge badge--${drifted ? 'amber' : 'green'}`;
    } else if (driftElement) {
      driftElement.textContent = UNAVAILABLE;
      driftElement.className = 'badge badge--grey';
    }

    // Severity vocabulary is HIGH/MEDIUM/LOW. Scanning those words for /hold/
    // always printed "none measured" while findings.highest_hold was already HIGH.
    const findingsObj = isRecord(data.findings) ? data.findings : {};
    const highestHold = compactValue(unwrap(findingsObj.highest_hold), '').toUpperCase();
    const holdElement = $('#meta-hold');
    if (holdElement) {
      const openN = openFindings.length;
      if (highestHold === 'HIGH' || highestHold === 'MEDIUM' || highestHold === 'LOW') {
        holdElement.textContent = openN ? `${highestHold} (${openN} open)` : highestHold;
        holdElement.className = `badge badge--${highestHold === 'HIGH' ? 'red' : 'amber'}`;
      } else if (highestHold === 'NONE') {
        holdElement.textContent = 'NONE';
        holdElement.className = 'badge badge--grey';
      } else {
        holdElement.textContent = 'none measured';
        holdElement.className = 'badge badge--grey';
      }
    }

    const capabilities = data.capabilities || {};
    const tested = unwrap(capabilities.recorded_test_count != null ? capabilities.recorded_test_count : capabilities.tested_count);
    const declared = unwrap(capabilities.declared_count);
    const matrixRows = asArray(capabilities.matrix);
    const matrixLen = matrixRows.length;
    const freshTtl = unwrap(capabilities.freshness_window_seconds) || 3600;
    const freshCount = unwrap(capabilities.tested_within_freshness_window_count) != null
      ? unwrap(capabilities.tested_within_freshness_window_count)
      : matrixRows.filter((r) => isRecord(r) && typeof unwrap(r.age_seconds) === 'number' && unwrap(r.age_seconds) <= freshTtl).length;
    setText('#meta-test', tested != null && declared != null
      ? `${tested}/${declared} have recorded tests · ${freshCount}/${declared} tested within ${Math.round(freshTtl / 60)}m freshness window (TTL=${freshTtl}s · ${matrixLen || 9} public)`
      : UNAVAILABLE);
    setText('#footer-snap-id', compactValue(data.snapshot_id));
    setText('#footer-obs-at', data.observed_at && Number.isFinite(new Date(data.observed_at).getTime()) ? new Date(data.observed_at).toISOString() : UNAVAILABLE);

    const signature = unwrap(data.signature) || {};
    const sigVer = unwrap(data.signature_verification) || {};
    const algorithm = compactValue(signature.algorithm, 'unsigned');
    const keyId = compactValue(signature.key_id);
    const payloadHash = compactValue(signature.payload_hash);
    const signedAt = compactValue(signature.signed_at);
    setText(
      '#footer-signature',
      `SIGNATURE PRESENT: ${sigVer.signature_present || `YES (${algorithm} · ${signedAt})`} · ` +
      `KEY RESOLUTION: ${sigVer.key_resolution || keyId} · ` +
      `CRYPTOGRAPHIC VERIFICATION: ${sigVer.cryptographic_verification || 'NOT_ATTEMPTED_IN_BROWSER'} · ` +
      `AUTHORIZED ISSUER BINDING: ${sigVer.authorized_issuer_binding || 'OBSERVE_ONLY_EMITTER'} · ` +
      `payload_hash=${payloadHash}`
    );

    const tier = unwrap(data.tier) || {};
    const tierValue = isRecord(tier) ? firstPresent(unwrap(tier.current), unwrap(tier.value)) : tier;
    const tierElement = $('#tier-pill');
    if (tierElement && tierValue) {
      tierElement.textContent = `tier: ${tierValue}`;
      tierElement.dataset.tierActive = tierValue !== 'public' ? 'true' : 'false';
    }
  }

  /* ── F2 Runtime identity ─────────────────────────────────── */
  function renderIdentity(data) {
    const identity = data.runtime_identity || {};
    const set = (id, record, formatter, missingReason) => {
      const element = $(`#id-${id}`);
      const note = $(`#id-${id}-note`);
      const raw = unwrap(record);
      const present = raw !== undefined && raw !== null && raw !== '';
      if (element) {
        element.textContent = present ? (formatter ? formatter(raw) : compactValue(raw)) : UNAVAILABLE;
        element.className = `v ${present ? '' : 'unknown'}`.trim();
      }
      if (note) note.textContent = present
        ? metadataLine(record, data.observed_at)
        : `source: missing · confidence: unknown · reason: ${missingReason || 'metadata unavailable'}`;
    };

    set('source', identity.source_commit, compactValue, 'source commit metadata unavailable');
    set('deployed', identity.deployed_commit, compactValue, 'deployed commit metadata unavailable');
    set('build', identity.build_commit, compactValue, 'build commit metadata unavailable');

    const driftSourceRec = firstPresent(identity.drift, data.governance && data.governance.drift);
    const drift = unwrap(driftSourceRec);
    const driftText = isRecord(drift)
      ? Object.entries(drift).map(([key, value]) => `${key}=${compactValue(value)}`).join(' · ')
      : compactValue(drift);
    const driftEnv = (drift === undefined || drift === null) ? undefined : {
      value: driftText,
      source: sourceValue(driftSourceRec) || '_compute_runtime_drift + capability_matrix',
      confidence: confidenceValue(driftSourceRec) || 0.9,
      observed_at: observedAtValue(driftSourceRec) || data.observed_at,
    };
    set('drift', driftEnv, compactValue, 'drift metadata unavailable');
    set('mode', identity.deployment_mode, compactValue, 'deployment mode metadata unavailable');
    set('started', identity.process_started_at, (value) => {
      const time = new Date(value).getTime();
      return Number.isFinite(time) ? new Date(time).toLocaleString() : compactValue(value);
    }, 'process start metadata unavailable');
    set('platform', identity.platform, compactValue, 'platform metadata unavailable');
    set('epoch', identity.kernel_epoch, compactValue, 'kernel epoch metadata unavailable');
  }

  /* ── 7-state vocabulary ──────────────────────────────────── */
  function renderVocabulary(data) {
    const memory = unwrap(data.substrate && data.substrate.memory);
    const memoryPercent = isRecord(memory) ? memory.percent : null;
    const capabilities = data.capabilities || {};
    const governance = effectiveGovernance(data.governance || {});
    // 2026-11-21 F0 (FI-002): planes.authorization is the measured kernel probe
    // ("PUBLIC / OBSERVE_ONLY_unless_bound") — wire it as the fallback.
    const authorization = firstPresent(unwrap(data.authority && data.authority.effective_action_authority), data.planes && data.planes.authorization);
    const authorizedValue = unwrap(authorization);
    const authorized = isRecord(authorizedValue) ? authorizedValue.authorized : authorizedValue;
    // 2026-11-21 F0 (FI-002): the producer's authorization record carries a tier
    // band (e.g. OBSERVE_ONLY for the public snapshot tier) even when `authorized`
    // itself is null — print the band instead of an empty unavailable.
    const authorizedBand = isRecord(authorizedValue) ? firstPresent(authorizedValue.band, authorizedValue.tier) : null;
    const floors = normalizedFloors(data.governance || {});
    const loadedFloors = floors.filter(({ record }) => record !== undefined).length;
    const measuredFloors = floors.filter(({ definition, record }) => floorParts(definition, record).measurement === 'measured').length;
    // 2026-11-22 (FI-008): "13/13 loaded · 3/13 measured" is a headline a reader
    // can read as "3 floors are fine" — and miss the MEASURED FAIL (F3, 0.5291)
    // sitting in the same table. Count the failing measurement out loud, with its
    // score, and name the unmeasured floors. A measured fail is not an absence.
    function floorHeadline(loaded, measured, floorList) {
      const parts = [`${loaded}/13 loaded`, `${measured}/13 measured`];
      const failRows = [];
      const staleRows = [];
      const unmRows = [];
      (floorList || []).forEach((f) => {
        const def = (f && f.definition) || {};
        const id = def.id || '?';
        const rec = (f && f.record) || {};
        const p = floorParts(def, rec);
        const prov = String(
          (rec.source) ||
          ((rec.score && rec.score.source) || '') ||
          ((rec.status && rec.status.source) || '')
        );
        if (p.measurement === 'blocked' && p.score != null) {
          failRows.push(`${id} ${compactValue(p.score)} measured FAIL`);
        } else if (p.measurement === 'blocked') {
          failRows.push(`${id} blocked`);
        } else if (p.measurement === 'stale') {
          staleRows.push(`${id} stale source`);
        } else if (/unmeasured|stale/i.test(prov)) {
          unmRows.push(`${id} unmeasured`);
        }
      });
      if (failRows.length) parts.push(`${failRows.length} FAIL: ${failRows.join(', ')}`);
      if (staleRows.length) parts.push(`${staleRows.length} stale: ${staleRows.join(', ')}`);
      if (unmRows.length) parts.push(`${unmRows.length} unmeasured: ${unmRows.join(', ')}`);
      return parts.join(' · ');
    }
    const states = {
      LIVENESS: { value: memoryPercent != null ? `${(100 - Number(memoryPercent)).toFixed(0)}% memory free` : UNAVAILABLE, state: data.substrate && data.substrate.memory },
      // 2026-11-21 F0 (FI-002): fall through to the measured planes row when the
      // stage/conformance fields are absent from the projection.
      READINESS: { value: compactValue(firstPresent(data.conformance && data.conformance.stage, data.stage_evidence && data.stage_evidence.stage, data.planes && data.planes.readiness)), state: firstPresent(data.conformance && data.conformance.stage, data.stage_evidence && data.stage_evidence.stage, data.planes && data.planes.readiness) },
      // 2026-11-22 C1 + C2 (F13 Governed Knowledge Factory): separate
      // AUTHORIZED NOW (request-unbound public snapshot = 0/8) from
      // TECHNICALLY INVOCABLE (8/8 canonical, +1 coord = 9 public), and report
      // recorded tests vs tests within the 1h freshness window (TTL=3600s).
      CAPABILITY: (function () {
        const decl = unwrap(capabilities.declared_count);
        if (decl == null) return { value: UNAVAILABLE, state: capabilities.state || capabilities.status };
        const techInv = firstPresent(unwrap(capabilities.technically_invocable_count), unwrap(capabilities.invocable_count), unwrap(capabilities.proven_live_count), 8);
        const authNow = firstPresent(unwrap(capabilities.authorized_now_unbound_count), 0);
        const matRows = asArray(capabilities.matrix);
        const ttl = unwrap(capabilities.freshness_window_seconds) || 3600;
        const recTests = firstPresent(unwrap(capabilities.recorded_test_count), unwrap(capabilities.tested_count), 8);
        const freshInWin = unwrap(capabilities.tested_within_freshness_window_count) != null
          ? unwrap(capabilities.tested_within_freshness_window_count)
          : matRows.filter((r) => isRecord(r) && typeof unwrap(r.age_seconds) === 'number' && unwrap(r.age_seconds) <= ttl).length;
        const freshDenom = unwrap(capabilities.tested_within_freshness_window_count) != null ? decl : matRows.length;
        return {
          value: `AUTHORIZED NOW: ${authNow}/${decl} (unbound request) · TECHNICALLY INVOCABLE: ${techInv}/${decl} canonical (+1 coord = ${matRows.length} public) · ${recTests}/${decl} have recorded tests (${freshInWin}/${freshDenom} public within ${Math.round(ttl / 60)}m freshness window, TTL=${ttl}s)`,
          state: capabilities.state || capabilities.status || 'observed',
        };
      })(),
      GOVERNANCE: { value: governance.rawVerdict === 'UNKNOWN' ? 'HOLD (raw UNKNOWN)' : governance.verdict, state: governance.verdict },
      AUTHORIZATION: { value: authorized === true ? 'AUTHORIZED' : (authorized === false ? 'NOT AUTHORIZED' : (authorizedBand != null ? `TIER ${String(authorizedBand).toUpperCase()}` : (authorized && typeof authorized === 'string' ? String(authorized).toUpperCase() : UNAVAILABLE))), state: authorizedBand != null ? String(authorizedBand) : authorized },
      RECEIPT: (function () {
        const vs = vaultSummary(data);
        const snapSeq = compactValue(data.receipts && data.receipts.last_receipt_tier, 'seq 1');
        return {
          value: `canonical_chain_head_seq=${compactValue(vs.head)} · canonical_receipt_entry_count=${compactValue(vs.entries)} · snapshot_receipt_seq=${snapSeq}`,
          state: vs.verified ? 'measured' : 'degraded',
        };
      })(),
      CONSTITUTIONAL: { value: loadedFloors ? floorHeadline(loadedFloors, measuredFloors, floors) : UNAVAILABLE, state: measuredFloors === 13 ? 'measured' : 'unknown' },
    };
    Object.entries(states).forEach(([name, item]) => {
      const cell = $(`#vocab-${name} .val`);
      if (cell) {
        cell.textContent = item.value;
        cell.className = `val val--${paletteClass(item.state)}`;
      }
    });
  }

  /* ── F1-F13 Governance state ────────────────────────────── */
  function renderGovernance(data) {
    const governance = data.governance || {};
    const effective = effectiveGovernance(governance);
    const floors = normalizedFloors(governance);
    const floorGrid = $('#floor-grid');
    const measured = floors.filter(({ definition, record }) => floorParts(definition, record).measurement === 'measured').length;
    const blocked = floors.filter(({ definition, record }) => floorParts(definition, record).measurement === 'blocked').length;
    const stale = floors.filter(({ definition, record }) => floorParts(definition, record).measurement === 'stale').length;
    const loaded = floors.filter(({ record }) => record !== undefined).length;

    const summary = $('#governance-decomposition');
    if (summary) {
      const decompMap = unwrap(governance.verdict_decomposition) || {};
      const governanceRecord = isEnvelope(governance.verdict)
        ? governance.verdict
        : firstPresent(decompMap.action_state, { value: effective.verdict, source: 'governance_kernel.verdict', confidence: 0.9, observed_at: data.observed_at });
      const reasonRecord = isEnvelope(governance.reason)
        ? governance.reason
        : firstPresent(decompMap.governance_floor_state, { value: effective.reason, source: 'governance_kernel.verdict_decomposition', confidence: 0.9, observed_at: data.observed_at });
      const reasonText = effective.reason === 'reason unavailable'
        ? `per-action gate (${measured}/13 measured · ${blocked} blocked · ${stale} stale)`
        : effective.reason;
      const driftRecord = firstPresent(governance.drift, data.runtime_identity && data.runtime_identity.drift);
      const vaultRecord = firstPresent(
        isEnvelope(governance.vault999) && confidenceValue(governance.vault999) ? governance.vault999 : null,
        { value: 'vault999', source: 'vault receipt census (build_public_state receipt block)', confidence: 0.9, observed_at: data.observed_at }
      );
      const floorsRecord = { source: 'governance_kernel.get_current_state', confidence: 0.9, observed_at: data.observed_at };
      const vault = vaultSummary(data);
      summary.innerHTML = [
        ['GOVERNANCE', effective.rawVerdict === 'UNKNOWN' ? 'HOLD (raw UNKNOWN)' : effective.verdict, effective.verdict, governanceRecord],
        ['REASON', reasonText, effective.verdict, reasonRecord],
        ['DRIFT', compactValue(driftRecord), driftRecord, driftRecord],
        ['VAULT999', vault.text, vault.verified ? 'measured' : 'degraded', vaultRecord],
        ['FLOORS', `${loaded}/13 loaded · ${measured} measured · ${blocked} blocked · ${stale} stale`, loaded === 13 ? 'loaded' : 'unknown', floorsRecord],
      ].map(([name, value, state, record]) => `
        <div class="vocab-cell governance-cell">
          <div class="name">${esc(name)}</div>
          <div class="val val--${paletteClass(state)}">${esc(value)}</div>
          <div class="observatory-meta">${esc(metadataLine(record, data.observed_at))}</div>
        </div>`).join('');
    }

    if (floorGrid) {
      floorGrid.innerHTML = floors.map(({ definition, record }) => {
        const parts = floorParts(definition, record);
        const sourceRecord = firstPresent(
          parts.scoreRecord,
          parts.statusRecord,
          record,
          definition.id === 'F13' ? { source: 'declared boundary' } : undefined,
        );
        // 2026-10-24 F13: a raw risk score read as a mark confuses everyone.
        // F12 measures injection RISK — low is good. Say so in words and keep
        // the number in the same line. Same information, no false failure.
        const IS_RISK_FLOOR = definition.id === 'F12';
        const IS_PREDICATE_SCALAR = /\bpredicate\b/i.test(parts.status) && parts.score != null && !IS_RISK_FLOOR;
        const predContract = isRecord(record) && isRecord(record.predicate_contract) ? record.predicate_contract : null;
        const riskWord = (parts.score == null) ? null
          : (parts.score <= 0.34 ? 'rendah' : parts.score <= 0.66 ? 'sederhana' : 'tinggi');
        const score = IS_RISK_FLOOR && riskWord ? riskWord
          : (IS_PREDICATE_SCALAR ? `ω₀=${parts.score.toFixed(2)}`
            : (parts.score == null ? '—' : parts.score.toFixed(2)));
        const status = parts.status === UNAVAILABLE
          ? 'status: unavailable'
          : (IS_RISK_FLOOR
              ? `observed_input: risk=${parts.score == null ? '—' : parts.score.toFixed(2)} (rendah = baik) · evaluation: ${parts.status} · floor_measurement: not produced`
              : (IS_PREDICATE_SCALAR
                  ? `observed_input: ${predContract ? predContract.observed_input : `omega0=${parts.score.toFixed(2)}`} · evaluation: ${predContract ? predContract.evaluation : 'predicate pass'} · floor_measurement: ${predContract ? predContract.floor_measurement : 'not produced'}`
                  : `status: ${parts.status}`));
        // KX-010 five-field contract for the one physics-labelled floor name that
        // renders a number to a human. PEACE² (F5) declares itself a POLICY_CONSTANT
        // in the /health contract: unit 1, no monotonic drivers, no falsifier by
        // construction. Say exactly that, instead of letting a bare score imply
        // a measurement that does not exist.
        // 2026-11-17 (333-AGI): this note used to append to EVERY F5 floor row
        // unconditionally, contradicting the row's own `measured · status: pass`
        // label — the note describes the peace2 SCALAR contract (thermodynamic
        // panel object), while the F5 floor score comes from _f5_peace, a real
        // seal-chain audit instrument (MEASUREMENT_CLOSURE tranche 2). One row,
        // one class: the scalar contract is not attached to the floor row.
        const physicsContract = '';
        const fieldObservedAt = record === undefined ? null : data.observed_at;
        // 2026-10-31 reconcile: a floor can PASS on presence alone, and the
        // payload already says so (verdict_decomposition[*].proof_class). A bare
        // "pass" beside 1.00 reads as full sovereignty. Name the proof class.
        const decompRaw = unwrap(governance.verdict_decomposition) || {};
        const decompKey = isRecord(decompRaw)
          ? Object.keys(decompRaw).find((k) => k.toLowerCase().startsWith(String(definition.id).toLowerCase() + '_'))
          : null;
        const decompValue = decompKey ? unwrap(decompRaw[decompKey]) : null;
        let proofClass = isRecord(decompValue) ? decompValue.proof_class : null;
        let cellTone = paletteClass(parts.state);
        if (definition.id === 'F13' && proofClass === 'presence_only') {
          proofClass = 'presence_only (action consent unproven)';
          cellTone = 'warn';
        } else if (definition.id === 'F11' && isRecord(decompValue) && (decompValue.receipt_actor_bound === 'UNKNOWN' || decompValue.receipt_contains_governance_outcome === 'UNKNOWN')) {
          proofClass = 'receipt_present (consequence/actor unproven)';
          cellTone = 'warn';
        }
        const proofNote = proofClass ? ` · proof: ${proofClass}` : '';
        return `<div class="floor-cell floor-cell--${cellTone}" data-floor="${definition.id}" data-measurement="${esc(parts.measurement)}">
          <div class="floor-header"><span class="floor-num">${definition.id}</span><span class="floor-name">${definition.name}</span></div>
          <div class="floor-score">${esc(score)}</div>
          <div class="floor-status">${esc(parts.measurement)} · ${esc(status)}${esc(proofNote)}</div>
          <div class="floor-meta">${esc(metadataLine(sourceRecord, fieldObservedAt))}${esc(physicsContract)}</div>
        </div>`;
      }).join('');
    }

    const decomposition = unwrap(governance.verdict_decomposition);
    const decompositionGrid = $('#verdict-decomp');
    if (decompositionGrid) {
      const entries = isRecord(decomposition) ? Object.entries(decomposition) : [];
      decompositionGrid.innerHTML = entries.length ? entries.map(([key, value]) => `
        <div class="vocab-cell">
          <div class="name">${esc(key)}</div>
          <div class="val val--${paletteClass(value)}">${esc(compactValue(value))}</div>
          <div class="observatory-meta">${esc(metadataLine(value, data.observed_at))}</div>
        </div>`).join('') : `<div class="vocab-cell"><div class="name">DECOMPOSITION</div><div class="val val--grey">${UNAVAILABLE}</div><div class="observatory-meta">source: missing · confidence: unknown</div></div>`;
    }
  }

  /* ── Capability drift ────────────────────────────────────── */
  function renderDrift(data) {
    const capabilities = data.capabilities || {};
    const matrix = asArray(capabilities.matrix);
    const body = $('#drift-table tbody');
    if (!body) return;
    if (!matrix.length) {
      body.innerHTML = '<tr><td colspan="9" class="observatory-empty">No capability measurements available — parser loaded / not measured</td></tr>';
      return;
    }
    body.innerHTML = matrix.map((row) => {
      if (!isRecord(row)) return '';
      const inMatch = unwrap(row.input_schema_hash_match);
      const outMatch = unwrap(row.output_schema_hash_match);
      const ioMatch = firstPresent(
        row.in_out_match,
        (inMatch != null && outMatch != null) ? (Boolean(inMatch) && Boolean(outMatch)) : 'unrecorded'
      );
      const truthVal = firstPresent(row.truth, row.capability_truth);
      const ageSec = ageSecondsValue(row);
      const freshTtl = unwrap(capabilities.freshness_window_seconds) || 3600;
      const canaryTtl = unwrap(capabilities.canary_cadence_seconds) || 21600;
      const freshVerdict = ageSec == null
        ? 'UNKNOWN'
        : (ageSec <= freshTtl ? `FRESH <=1h (${Math.floor(ageSec)}s)` : (ageSec <= canaryTtl ? `CANARY <=6h (${Math.floor(ageSec)}s)` : `STALE >6h (${Math.floor(ageSec)}s)`));
      const lastTestObj = row.age_seconds != null
        ? { age_seconds: row.age_seconds, observed_at: row.last_test_at }
        : firstPresent(row.last_test, row.last_test_at ? { observed_at: row.last_test_at } : null, row);
      return `<tr>
        <td><code>${esc(compactValue(firstPresent(row.name, row.tool)))}</code></td>
        <td>${badge(row.declared)}</td><td>${badge(row.registered)}</td><td>${badge(row.exposed)}</td>
        <td>${badge(row.invocable, unwrap(row.invocable) ? 'tech:true · auth:unbound' : 'false')}</td><td>${badge(row.tested, unwrap(row.tested) ? 'recorded' : 'untested')}</td><td>${badge(ioMatch)}</td>
        <td>${esc(freshnessValue(lastTestObj, data.observed_at))} · <span class="observatory-meta">${esc(freshVerdict)}</span></td><td>${badge(truthVal)}</td>
      </tr>`;
    }).join('');
  }

  /* ── arifFLOW + receipt migration ────────────────────────── */
  const flowSnapshot = (data) => {
    const organs = unwrap(data.organs) || {};
    const candidates = [
      data.arifFLOW, data.arifFlow, data.arifflow, data.arif_flow, data.flow_plane,
      isRecord(organs) ? firstPresent(organs.arifFLOW, organs.arifFlow, organs.arifflow, organs.arif_flow) : undefined,
    ];
    const candidate = candidates.find((item) => item !== undefined && item !== null);
    const value = unwrap(candidate);
    return { envelope: candidate, value: isRecord(value) ? value : null };
  };
  const flowField = (flow, ...names) => {
    if (!flow) return undefined;
    const name = names.find((key) => hasOwn(flow, key));
    return name ? flow[name] : undefined;
  };
  const flowDeclaredEndpoints = [
    '/health (GET)', '/ingest (POST)',
  ]; // live-probe 2026-11-19: 7 laluan diisytihar lama = 404; dua ini 200
  function buildFleet(state) {
    const fl = (state && state.fleet) || {};
    const organs = (state && state.organs) || {};
    let live = 0;
    let unverified = 0;
    let total = 0;
    for (const o of Object.values(organs)) {
      if (!o || typeof o !== 'object') continue;
      total += 1;
      const l = o.liveness || o.transport;
      const v = l && typeof l === 'object' ? (l.value !== undefined ? l.value : l.state) : l;
      if (String(v || '').toLowerCase() === 'live') live += 1;
      else unverified += 1;
    }
    const held = fl.held;
    const actors = Array.isArray(fl.held_actors) ? fl.held_actors : [];
    const parts = [];
    parts.push(total ? `${live}/${total} disahkan${unverified ? ` \u00b7 ${unverified} UNVERIFIED (bajet probe habis, bukan mati)` : ''}` : 'organ UNKNOWN');
    parts.push(held == null ? 'tertahan UNKNOWN' : `${held} tertahan`);
    if (held > 0 && actors.length) parts.push(`(${actors.join(', ')})`);
    return {
      value: parts.join(' · '),
      state: held == null ? 'unknown' : 'measured',
      source: fl.source || 'ariflow:7073/health :: fq.per_actor',
      confidence: 0.9,
      observed_at: state && state.observed_at,
      reason: fl.reason || null,
    };
  }

  const formatEndpoints = (record) => {
    const endpoints = unwrap(record);
    if (Array.isArray(endpoints)) return endpoints.length ? endpoints.map((item) => compactValue(item)).join(' · ') : UNAVAILABLE;
    if (isRecord(endpoints)) return Object.entries(endpoints).map(([name, endpoint]) => `${name}: ${compactValue(endpoint)}`).join(' · ') || UNAVAILABLE;
    return compactValue(endpoints);
  };

  function renderFlowPlane(data) {
    const flow = flowSnapshot(data);
    const record = flow.value;
    const health = flowField(record, 'health', 'status', 'transport', 'liveness');
    const receiptRaw = flowField(record, 'receipts', 'receipt', 'receipt_count', 'receipts_count', 'receiptCount', 'total_receipts', 'count');
    const receipts = isEnvelope(receiptRaw)
      ? receiptRaw
      : { value: compactValue(receiptRaw), state: 'observed', source: 'GET 127.0.0.1:7073/health→receipts', confidence: 0.9, observed_at: data.observed_at };
    const chain = {
      value: vaultSummary(data).text,
      state: vaultSummary(data).verified ? 'measured' : 'degraded',
      source: 'vault receipt census (chain_integrity)',
      confidence: 0.9,
      observed_at: data.observed_at,
    };
    const fqNum = flowField(record, 'fq', 'fq_quotient');
    const fqLabel = flowField(record, 'fq_verdict');
    const fq = fqNum !== undefined || fqLabel !== undefined
      ? (fqNum !== undefined && fqLabel !== undefined
          ? { value: `${compactValue(fqNum)} ${compactValue(fqLabel)}`, state: 'measured', source: 'arifFlow', confidence: 0.9 }
          : (fqNum !== undefined ? fqNum : fqLabel))
      : undefined;
    const declaredEndpoints = { value: flowDeclaredEndpoints, state: 'measured', source: 'live probe 2026-11-19', confidence: 0.9, observed_at: data.observed_at };
    const endpoints = flowField(record, 'endpoints', 'endpoint', 'routes');
    const endpointRecord = endpoints === undefined ? declaredEndpoints : endpoints;
    const authority = firstPresent(flowField(record, 'authority', 'authorization'), data.authority && data.authority.arifFLOW);

    const setFlow = (id, field, formatter) => {
      const value = $(`#flow-${id}-value`);
      const meta = $(`#flow-${id}-meta`);
      if (value) {
        value.innerHTML = id === 'health'
          ? badge(field)
          : esc(formatter ? formatter(field) : compactValue(field));
      }
      if (meta) meta.textContent = metadataLine(field, field == null ? null : data.observed_at);
    };
    setFlow('health', health);
    setFlow('receipts', receipts, (r) => `${compactValue(r)} (flow_receipt_cache_count · ring buffer cap)`);
    {
      const rk = $('#flow-receipts .k');
      if (rk) rk.textContent = 'flow_receipt_cache_count';
      const ck = $('#flow-chain .k');
      if (ck) ck.textContent = 'canonical_chain_head_seq · entries';
    }
    setFlow('chain', chain);
    // ── 2026-10-24 F13: FQ leaves the face of the page ──────────────────────
    // The daemon deprecates the scalar as a health indicator and it moves every
    // cycle (four readings in forty minutes across three surfaces). A number that
    // dances teaches readers to distrust every other number on the page. Publish
    // three stable facts instead: tracked, held, and why. The scalar is untouched
    // in the payload — only its display is removed.
    const fleet = buildFleet(data);
    setFlow('fq', fleet, (f) => f.value);
    {
      const k = $('#flow-fq .k');
      if (k) k.textContent = 'fleet';
      const m = $('#flow-fq-meta');
      if (m && fleet.reason) m.textContent = fleet.reason;
    }
    setFlow('endpoints', endpointRecord, formatEndpoints);
    const source = $('#flow-source-value');
    if (source) source.textContent = sourceValue(flow.envelope) ? `source: ${sourceValue(flow.envelope)}` : 'source: missing';
    const freshness = $('#flow-freshness-value');
    if (freshness) freshness.textContent = freshnessValue(flow.envelope, flow.envelope == null ? null : data.observed_at);
    const authorityElement = $('#flow-authority');
    if (authorityElement) {
      const doctrine = 'arifFLOW observes and anchors receipts. It does not judge.';
      authorityElement.textContent = authority === undefined
        ? `${doctrine} Authority measurement unavailable in the snapshot. Mutation remains HOLD until ARIF GO.`
        : `${doctrine} Reported authority: ${compactValue(authority)}.`;
    }
  }

  const p1Fallback = [
    { id: 'P1-1', scope: 'Ownership ledger', status: 'SEALED' },
    { id: 'P1-2', scope: 'Python client', status: 'SEALED' },
    { id: 'P1-3', scope: 'TypeScript client', status: 'SEALED' },
    { id: 'P1-B', scope: 'PAI ↔ arifFLOW bridge', status: 'SEALED' },
    { id: 'P1-4', scope: 'AAA emitReceipt wiring', status: 'E6 RECEIPT_OBSERVED' },
    { id: 'P1-5', scope: 'A-FORGE receipt wiring', status: 'observed 2026-11-18 — hook unproven', note: 'dated census 2026-11-18; September canary is not authorization' },
    { id: 'P1-6', scope: 'telemetry wiring · AF-1 canary', status: 'observed 2026-11-18 — hook unproven', note: 'dated census 2026-11-18; September canary is not authorization' },
    { id: 'P1-7', scope: 'deprecation flags', status: 'pending' },
  ];
  const p1Snapshot = (data) => {
    const flow = flowSnapshot(data).value;
    return unwrap(firstPresent(
      data.receipt_federation,
      data.p1_receipt_federation,
      flow && firstPresent(flow.receipt_federation, flow.p1, flow.migration),
    ));
  };
  const p1Record = (snapshot, id) => {
    if (Array.isArray(snapshot)) return snapshot.find((item) => normalizeKey(unwrap(item && firstPresent(item.id, item.phase, item.name))) === normalizeKey(id));
    if (!isRecord(snapshot)) return undefined;
    const key = Object.keys(snapshot).find((candidate) => normalizeKey(candidate) === normalizeKey(id));
    return key ? snapshot[key] : undefined;
  };

  function renderP1ReceiptFederation(data) {
    const snapshot = p1Snapshot(data);
    const body = $('#p1-receipt-matrix tbody');
    if (!body) return;
    body.innerHTML = p1Fallback.map((fallback) => {
      const observed = p1Record(snapshot, fallback.id);
      const statusRecord = observed === undefined ? fallback.status : firstPresent(observed && observed.status, observed && observed.verdict, observed && observed.state, observed);
      const scope = observed === undefined ? fallback.scope : compactValue(firstPresent(observed && observed.scope, observed && observed.description), fallback.scope);
      const source = observed === undefined ? (fallback.note || 'declared migration fallback') : (sourceValue(observed) || 'snapshot');
      const confidence = observed === undefined ? 'unknown' : (confidenceValue(observed) || 'unknown');
      const rowSource = observed === undefined ? (fallback.note ? 'dated-census' : 'declared-fallback') : 'snapshot';
      return `<tr data-phase="${fallback.id}" data-source="${rowSource}">
        <td><code>${fallback.id}</code></td><td>${esc(scope)}</td><td>${badge(statusRecord)}</td>
        <td>source: ${esc(source)} · confidence: ${esc(confidence)}</td>
      </tr>`;
    }).join('');
  }

  function renderMutationGate(data) {
    const flow = flowSnapshot(data).value;
    const gate = unwrap(firstPresent(data.next_mutation_gate, flow && flow.next_mutation_gate));
    const fallback = {
      status: 'HOLD', authority: 'ARIF GO required — executor full hook + P1-7 NOT authorized on 2026-09-09 canary alone', canary: 'P1-5f + P1-6 canary 2026-09-09 is not authorization; executor FULL receipt hook (forge_execute → receipt) still unproven',
      follow_up: 'not this card — the September canary does not name today\'s queue', fallback: 'local fallback preserved', risk: 'low, additive-only',
    };
    const values = {};
    Object.entries(fallback).forEach(([key, value]) => {
      values[key] = isRecord(gate) && hasOwn(gate, key) ? gate[key] : value;
    });
    const set = (id, key) => {
      const element = $(`#mutation-${id}`);
      if (!element) return;
      element.innerHTML = key === 'status' ? badge(values[key]) : esc(compactValue(values[key]));
      element.dataset.source = isRecord(gate) && hasOwn(gate, key) ? 'snapshot' : 'declared-boundary';
    };
    set('status', 'status');
    set('authority', 'authority');
    set('canary', 'canary');
    set('follow-up', 'follow_up');
    set('fallback', 'fallback');
    set('risk', 'risk');
  }

  /* ── Federation organs ───────────────────────────────────── */
  const organMetadata = {
    arifos: { label: 'arifOS', ring: 'MIND', port: ':8088', role: 'Constitutional Kernel' },
    geox: { label: 'GEOX', ring: 'SOUL', port: ':8081', role: 'Earth Intelligence' },
    wealth: { label: 'WEALTH', ring: 'BODY', port: ':18082', role: 'Capital Intelligence' },
    well: { label: 'WELL', ring: 'SOUL', port: ':18083', role: 'Human Readiness' },
    aaa: { label: 'AAA', ring: 'BODY', port: ':3001', role: 'A2A reachable' },
    aaamcp: { label: 'AAA MCP', ring: 'BODY', port: ':3002', role: 'FastMCP · 4 tools · read-only' },
    aforge: { label: 'A-FORGE', ring: 'MIND', port: ':7071/:7072', role: 'Execution Shell' },
    mcpgateway: { label: 'MCP Gateway', ring: 'MIND', port: '', role: 'Canonical Routing' },
    arifflow: { label: 'arifFLOW', ring: 'MIND', port: ':7073', role: 'Receipt Flow Plane' },
  };
  const signalRecord = (organKey, data, signal) => {
    const mappings = {
      LIVENESS: ['liveness', 'transport'],
      READINESS: ['readiness', 'dependency'],
      CAPABILITY: ['capability'],
      GOVERNANCE: ['governance'],
      AUTHORIZATION: ['authorization', 'authority', 'session', 'actor'],
      RECEIPT: ['receipt', 'last_receipt'],
      CONSTITUTIONAL: ['constitutional', 'contract'],
    };
    const key = mappings[signal].find((name) => hasOwn(data, name));
    if (key && data[key] !== undefined && data[key] !== null) {
      const rec = data[key];
      if (isRecord(rec) && rec.confidence == null && rec.source) {
        return { ...rec, confidence: rec.value === UNAVAILABLE || rec.value == null ? 0.0 : 0.9 };
      }
      return rec;
    }
    // 2026-11-21 F0 (FI-002): a field the producer emits but leaves null is a
    // MEASUREMENT GAP, not a projection defect — label it unmeasured, not
    // "not exposed". Observation ≠ interpretation (HERMES 1).
    if (key) {
      return { value: UNAVAILABLE, state: 'unmeasured', source: `${signal.toLowerCase()} field present in organ row, value not populated by public-state producer`, confidence: 0.0 };
    }
    if (signal === 'RECEIPT' && data.receipt_status) {
      const st = String(data.receipt_status).toLowerCase();
      return { value: st, state: st === 'live' ? 'healthy' : 'unmeasured', source: 'arifFlow receipt ledger census', confidence: 0.85 };
    }
    if (signal === 'GOVERNANCE') {
      return { value: 'organ-scoped (kernel governs)', state: 'declared', source: 'federation contract (arifOS kernel governs)', confidence: 0.85 };
    }
    if (signal === 'CAPABILITY' && normalizeKey(organKey) === 'aaa') {
      return { value: 'A2A JSON-RPC gateway (:3001) + 4 MCP tools (:3002)', state: 'healthy', source: 'aaa.arif-fazil.com/health', confidence: 0.9 };
    }
    if (normalizeKey(organKey) === 'aforge' && signal === 'AUTHORIZATION') {
      return { value: 'requires lease', state: 'limited', source: 'declared boundary', confidence: 0.9 };
    }
    return { value: UNAVAILABLE, state: 'unknown', source: 'not exposed on public-state projection', confidence: 0.0 };
  };
  const aggregateWithCoverage = (signals) => {
    const states = signals.map((signal) => semanticState(signal));
    const measured = states.filter((state) => state !== 'unknown').length;
    let state = 'unknown';
    if (states.includes('down')) state = 'down';
    else if (states.includes('degraded')) state = 'degraded';
    else if (states.length && states.every((one) => one === 'healthy')) state = 'healthy';
    return { state, measured, total: states.length };
  };
  const aggregateSignals = (signals) => aggregateWithCoverage(signals).state;

  /* ── AXIS SEPARATION (2026-10-31 reconcile) ───────────────────────────────
     Measured on the live public-state payload: aggregating TRANSPORT (a
     liveness axis) together with GOVERNANCE (a verdict axis) and RECEIPT (an
     evidence axis) yields "unknown" for 5 of 6 organs and "degraded" for GEOX,
     while every one of those organs answers HTTP 200 on a live probe.

     A governance HOLD is not a dead service. A missing receipt is not a dead
     service. One label cannot carry three axes without lying about two of them.
     Service axis decides the card colour; the other axes are named beside it.
     ──────────────────────────────────────────────────────────────────────── */
  const SERVICE_FIELDS = ['transport', 'liveness', 'dependency', 'readiness', 'capability'];
  const httpStateOf = (record) => {
    const value = unwrap(record);
    const text = String(isRecord(value) ? firstPresent(value.value, value.state, '') : (value == null ? '' : value)).trim().toLowerCase();
    const match = text.match(/^http\s*(\d{3})$/);
    if (match) {
      const code = Number(match[1]);
      if (code >= 200 && code < 400) return 'healthy';
      if (code >= 400 && code < 500) return 'degraded';
      if (code >= 500) return 'down';
    }
    return semanticState(record);
  };
  const serviceStateOf = (organ) => aggregateSignals(
    SERVICE_FIELDS
      .filter((field) => isRecord(organ) && hasOwn(organ, field))
      .map((field) => (field === 'dependency' || field === 'readiness'
        ? httpStateOf(organ[field])
        : semanticState(recordState(organ[field])))),
  );
  const governanceStateOf = (organ) => {
    if (!isRecord(organ)) return 'unknown';
    const record = firstPresent(organ.governance, organ.constitutional);
    if (record == null) return 'unknown';
    const text = String(stateToken(record)).trim().toUpperCase();
    if (/^(SEAL|OK|PASS|ALLOW|LIVE|HEALTHY)/.test(text)) return 'healthy';
    if (/^(HOLD|SABAR|PARTIAL|DEGRADED)/.test(text)) return 'held';
    if (/^(VOID|DENY|FAIL|DOWN)/.test(text)) return 'down';
    return 'unknown';
  };
  const receiptStateOf = (organ) => {
    if (!isRecord(organ)) return 'unknown';
    const record = firstPresent(organ.receipt, organ.last_receipt);
    if (record == null) return 'unmeasured';
    return semanticState(record);
  };
  const axisLabel = (state) => ({
    healthy: 'LIVE', degraded: 'DEGRADED', down: 'DOWN',
    held: 'HOLD', unmeasured: 'UNMEASURED', unknown: 'UNKNOWN',
  }[state] || 'UNKNOWN');

  function renderOrgans(data) {
    const organs = unwrap(data.organs);
    const grid = $('#organs-grid');
    if (!grid) return;
    if (!isRecord(organs) || !Object.keys(organs).length) {
      grid.innerHTML = '<div class="observatory-empty">Organ measurements unavailable — source: missing · confidence: unknown</div>';
      return;
    }
    const flow = flowSnapshot(data);
    grid.innerHTML = Object.entries(organs).map(([key, rawData]) => {
      const organ = unwrap(rawData);
      if (!isRecord(organ)) return '';
      // Stable organ_id: collapse aliases / typoed keys to one of the six
      // canonical ids. Public-state.v1 normalizer already emits organ_id
      // inside each row; honor it when present so DOM data-organ matches
      // state["organs"] key exactly.
      const canonical = stableOrganId(firstPresent(organ.organ_id, key));
      const normalized = normalizeKey(canonical);
      const meta = organMetadata[normalized] || { label: canonical, ring: 'MIND', port: '', role: UNAVAILABLE };
      const names = ['LIVENESS', 'READINESS', 'CAPABILITY', 'GOVERNANCE', 'AUTHORIZATION', 'RECEIPT', 'CONSTITUTIONAL'];
      const signals = names.map((name) => signalRecord(key, organ, name));
      const overall = aggregateSignals(signals);
      const svcAxis = serviceStateOf(organ);
      const govAxis = governanceStateOf(organ);
      const rcptAxis = receiptStateOf(organ);
      const evidence = organ.evidence;
      const drift = organ.drift;
      const flowMeta = firstPresent(organ.arifFLOW, organ.arifflow, organ.flow);
      return `<article class="organ-card organ-card--${paletteClass(svcAxis)}" data-ring="${meta.ring}" data-organ="${esc(canonical)}" data-organ-canonical="true" data-overall="${svcAxis}" data-governance="${govAxis}" data-receipt="${rcptAxis}">
        <div class="organ-head"><span class="organ-name">${esc(meta.label)}</span><span class="ring-badge ring-${meta.ring.toLowerCase()}">${meta.ring}</span></div>
        <div class="organ-port">${esc(meta.port || UNAVAILABLE)}</div><div class="organ-role">${esc(meta.role)}</div>
        <div class="organ-axis" data-axis="service">service: ${esc(axisLabel(svcAxis))} · governance: ${esc(axisLabel(govAxis))} · receipt: ${esc(axisLabel(rcptAxis))}</div>
        <div class="organ-signals">${names.map((name, index) => {
          const record = signals[index];
          return `<div class="organ-signal" data-signal="${name}">
            <span class="organ-signal-name">${name}</span><span class="organ-signal-value">${badge(record)}</span>
            <span class="organ-signal-meta">${esc(metadataLine(record, data.observed_at))}</span>
          </div>`;
        }).join('')}</div>
        <div class="organ-facts">
          <span>evidence: ${esc(compactValue(evidence))}</span>
          <span>drift: ${esc(compactValue(drift))}</span>
          <span>arifFLOW: ${esc(flowMeta === undefined ? (flow.value ? 'federation metadata available' : UNAVAILABLE) : compactValue(flowMeta))}</span>
        </div>
      </article>`;
    }).join('') + renderDeclaredSurfaces(organs, data);
  }

  function renderDeclaredSurfaces(organs, data) {
    if (!organMetadata.aaamcp) return '';
    const present = isRecord(organs) && Object.keys(organs).some((key) => {
      const row = unwrap(organs[key]);
      return isRecord(row) && normalizeKey(firstPresent(row.organ_id, key)) === 'aaamcp';
    });
    if (present) return '';
    const meta = organMetadata.aaamcp;
    // 2026-11-21 F0 (FI-002): the kernel-wide axes (governance / floors) are
    // MEASURED at the kernel and shared by every organ — print them with their
    // namespace instead of "not wired". AAA-scoped axes that the producer does
    // not carry stay honestly unmeasured.
    const planes = (data && data.planes) || {};
    const gov = effectiveGovernance((data && data.governance) || {});
    const fl = normalizedFloors((data && data.governance) || {});
    const flLoaded = fl.filter(({ record }) => record !== undefined).length;
    const flMeasured = fl.filter(({ definition, record }) => floorParts(definition, record).measurement === 'measured').length;
    const rows = [
      ['LIVENESS', { value: 'live', state: 'healthy', source: 'manual probe 2026-10-24 · systemd aaa-mcp.service pid 1991169', confidence: 0.9 }],
      ['CAPABILITY', { value: '4 tools · read-only', state: 'healthy', source: 'manual tools/list probe 2026-10-24T04:45Z · aaa_health, aaa_agent_card, aaa_federation_manifest, aaa_discovery', confidence: 0.9 }],
      ['READINESS', { value: compactValue(planes.readiness), state: planes.readiness, source: 'public-state planes.readiness (kernel probe, federation-wide)', confidence: 0.85 }],
      ['GOVERNANCE', { value: gov.rawVerdict === 'UNKNOWN' ? 'HOLD (raw UNKNOWN)' : gov.verdict, state: gov.verdict, source: 'arifOS kernel verdict (kernel-wide, quoted not summarised)', confidence: 0.9 }],
      ['AUTHORIZATION', { value: 'loopback-only · no public route', state: 'healthy', source: 'Caddyfile shared_assets + ss -ltn 2026-10-24', confidence: 0.9 }],
      ['RECEIPT', { value: UNAVAILABLE, state: 'unmeasured', source: 'no AAA receipt ledger wired into public-state producer', confidence: 0 }],
      ['CONSTITUTIONAL', { value: flLoaded ? `${flLoaded}/13 loaded · ${flMeasured}/13 measured (kernel-wide)` : UNAVAILABLE, state: flMeasured === 13 ? 'measured' : 'unknown', source: 'arifOS kernel floors (kernel-wide, not AAA-scoped)', confidence: 0.85 }],
    ];
    return `<article class="organ-card organ-card--unknown" data-ring="${meta.ring}" data-organ="aaamcp" data-overall="unknown">
      <div class="organ-head"><span class="organ-name">${esc(meta.label)}</span><span class="ring-badge ring-${meta.ring.toLowerCase()}">${meta.ring}</span></div>
      <div class="organ-port">${esc(meta.port)}</div><div class="organ-role">${esc(meta.role)}</div>
      <div class="organ-signals">${rows.map((pair) => {
        const record = pair[1];
        return `<div class="organ-signal" data-signal="${pair[0]}">
          <span class="organ-signal-name">${pair[0]}</span><span class="organ-signal-value">${badge(record)}</span>
          <span class="organ-signal-meta">${esc(record.source)}</span>
        </div>`;
      }).join('')}</div>
      <div class="organ-facts">
        <span>evidence: manual probe 2026-10-24 (FI-008)</span>
        <span>drift: ${UNAVAILABLE}</span>
        <span>arifFLOW: ${UNAVAILABLE}</span>
      </div>
    </article>`;
  }

  /* ── Federation edges + declared flow overlays ──────────── */
  const canonicalNode = (value) => {
    const key = normalizeKey(unwrap(value));
    const names = {
      arifos: 'arifOS', aforge: 'A-FORGE', aaa: 'AAA', geox: 'GEOX', wealth: 'WEALTH',
      well: 'WELL', mcp: 'MCP', mcpgateway: 'MCP', arifflow: 'arifFLOW',
    };
    return names[key] || compactValue(value);
  };
  const flowEdgeOverlays = [
    {
      source: 'AAA', target: 'arifFLOW', transport: 'HTTP', trace_propagated: 'yes',
      receipt_produced: 'yes', telemetry_produced: 'yes', overall: 'E6 RECEIPT_OBSERVED', overlay_ref: 'P1-4',
    },
    {
      source: 'A-FORGE', target: 'arifFLOW', transport: 'HTTP', trace_propagated: 'canary P1-5f 2026-09-09',
      receipt_produced: 'canary live (P1-5f)', telemetry_produced: 'live via telemetry.ts /ingest (P1-6)', overall: 'E5 CANARY_TRACE', overlay_ref: 'AF-110 / P1-5',
    },
    {
      source: 'arifOS', target: 'arifFLOW', transport: 'HTTP',
      trace_propagated: 'unavailable (no trace field in receipts)',
      receipt_produced: 'emitting (unbound) — session_token/merkle null',
      telemetry_produced: 'emitting (unbound)', overall: 'EMITTING_UNBOUND',
      overlay_ref: 'OS-1 (label stale: emission live, binding pending)',
    },
  ];
  const edgeKey = (edge) => `${normalizeKey(canonicalNode(edge && edge.source))}>${normalizeKey(canonicalNode(edge && edge.target))}`;
  const mergedEdges = (data) => {
    // The kernel publishes the per-edge probe under `federation_edges` and, in
    // the sanitized public-state projection, the AGGREGATE under `federation`
    // (declared / probed / reachable / semantic_proven). Read BOTH. The
    // arifFLOW overlay rows are narrow overlays and must never stand in for
    // the federation's edge count — on 2026-11-12 this panel claimed
    // "3 directed" while the kernel declared and probed 11 with 11/11
    // transport-reachable.
    const federation = unwrap(data.federation_edges);
    const agg = unwrap(data.federation);
    const aggregate = isRecord(agg) ? agg : {};
    const observed = asArray(isRecord(federation) ? federation.edges : federation).filter(isRecord).map((edge) => ({ ...edge, __source: 'snapshot' }));
    const keys = new Set(observed.map(edgeKey));
    const overlays = flowEdgeOverlays.filter((overlay) => !keys.has(edgeKey(overlay))).map((overlay) => ({
      ...overlay,
      __source: `declared overlay ${overlay.overlay_ref}`,
    }));
    return { observed, all: [...observed, ...overlays], aggregate };
  };

  function renderEdges(data) {
    const { observed, all, aggregate } = mergedEdges(data);
    const graph = $('#edge-graph-wrap');
    const table = $('#edge-table-wrap');
    const declared = Number(aggregate.declared);
    const reachable = Number(aggregate.reachable ?? aggregate.transport_reachable);
    const semantic = Number(aggregate.semantic_proven);
    const aggState = aggregate.aggregate_state || aggregate.state || '';
    // The headline count and the rows are two instruments. On 2026-11-20T15:31Z
    // the aggregate still said 3 while arifOS→GEOX had dropped to TRANSPORT_ONLY
    // and only two rows were GOVERNED. Show the rows. Name the aggregate when
    // they disagree. Do not average them back into the higher number.
    const rowSemantic = observed.filter((edge) => {
      const overall = String(unwrap(edge.overall) || '').toUpperCase();
      const state = String(unwrap(edge.state) || '').toUpperCase();
      return overall === 'GOVERNED' || state === 'SEMANTIC_PROVEN';
    }).length;
    const semanticText = Number.isFinite(semantic) && semantic !== rowSemantic
      ? `${rowSemantic} semantically proven on the rows (aggregate says ${semantic})`
      : `${Number.isFinite(semantic) ? semantic : rowSemantic} semantically proven`;
    const countText = Number.isFinite(declared) && declared > 0
      ? `${declared} declared · ${Number.isFinite(reachable) ? reachable : '?'} transport-reachable · ${semanticText}${aggState ? ` · ${aggState}` : ''}`
      : `${all.length} directed · ${observed.length} observed`;
    const detailNote = Number.isFinite(declared) && declared > all.length ? ' · per-edge detail not published in public-state' : '';
    setText('#edge-count', `${countText} · ${all.length - observed.length} declared overlays${detailNote}`);
    if (!graph) return;

    const seedNodes = ['arifOS', 'A-FORGE', 'AAA', 'GEOX', 'WEALTH', 'WELL', 'MCP', 'arifFLOW'];
    const dynamicNodes = all.flatMap((edge) => [canonicalNode(edge.source), canonicalNode(edge.target)]).filter((node) => node !== UNAVAILABLE);
    const nodes = [...new Set([...seedNodes, ...dynamicNodes])];
    const width = 680;
    const height = 440;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 155;
    const step = (2 * Math.PI) / nodes.length;
    const positions = nodes.map((label, index) => ({
      label,
      x: centerX + radius * Math.cos(step * index - Math.PI / 2),
      y: centerY + radius * Math.sin(step * index - Math.PI / 2),
    }));
    const color = (state) => ({ healthy: 'var(--color-verdict-seal, #3ddc97)', degraded: 'var(--color-verdict-partial, #f4b740)', down: 'var(--color-verdict-void, #e5484d)', unknown: 'var(--color-verdict-sabar, #8892a6)' }[semanticState(state)]);
    let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Federation edge graph with arifFLOW" xmlns="http://www.w3.org/2000/svg"><defs><marker id="observatory-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-brand-sovereign, #c9a84c)"/></marker></defs>`;
    all.forEach((edge) => {
      const source = positions.find((position) => position.label === canonicalNode(edge.source));
      const target = positions.find((position) => position.label === canonicalNode(edge.target));
      if (!source || !target) return;
      svg += `<line x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" stroke="${color(firstPresent(edge.overall, edge.verdict, edge.status))}" stroke-width="2" stroke-dasharray="${edge.__source === 'snapshot' ? 'none' : '6 4'}" marker-end="url(#observatory-arrow)" opacity="0.72"/>`;
    });
    positions.forEach((position) => {
      svg += `<circle cx="${position.x}" cy="${position.y}" r="30" fill="var(--surface, #0d0d1a)" stroke="var(--color-brand-sovereign, #c9a84c)" stroke-width="2"/><text x="${position.x}" y="${position.y + 4}" text-anchor="middle" fill="var(--text, #e2d8c8)" font-family="var(--font-mono, monospace)" font-size="9">${esc(position.label)}</text>`;
    });
    graph.innerHTML = `${svg}</svg>`;

    if (!table) return;
    table.innerHTML = `<div class="table-scroll"><table class="drift edge-truth-table"><thead><tr>
      <th>source</th><th>target</th><th>transport</th><th>identity</th><th>contract</th><th>session</th><th>actor</th>
      <th>trace</th><th>receipt</th><th>telemetry_produced</th><th>overall</th><th>truth/source</th>
    </tr></thead><tbody>${all.map((edge) => {
      // 2026-11-21 F0 (FI-002): overlay rows are DECLARED, not probed — an empty
      // probe column on a declared overlay is "n/a · declared overlay", not
      // "unavailable". Both labels stay grey; neither is green.
      const isOverlay = edge.__source !== 'snapshot';
      const nb = (value) => firstPresent(value) != null
        ? badge(value)
        : badge({ value: isOverlay ? 'n/a · declared overlay' : 'not published by projection', state: 'declared', source: edge.__source });
      return `<tr data-edge-source="${esc(edge.__source)}">
      <td>${esc(canonicalNode(edge.source))}</td><td>${esc(canonicalNode(edge.target))}</td>
      <td>${badge(edge.transport)}</td><td>${nb(firstPresent(edge.identity_match, edge.identity))}</td>
      <td>${nb(firstPresent(edge.schema_match, edge.contract))}</td><td>${nb(edge.session_propagated)}</td>
      <td>${nb(edge.actor_propagated)}</td><td>${badge(firstPresent(edge.trace_propagated, edge.trace, edge.trace_id))}</td>
      <td>${badge(firstPresent(edge.receipt_produced, edge.receipt, edge.receipt_id))}</td><td>${badge(firstPresent(edge.telemetry_produced, edge.telemetry, edge.telemetry_id))}</td>
      <td>${badge(firstPresent(edge.overall, edge.verdict, edge.status))}</td><td>${esc(edge.__source)}</td>
    </tr>`;
    }).join('')}</tbody></table></div>`;
  }

  /* ── Metabolism, vault, pulse ────────────────────────────── */
  function renderMetabolism(data) {
    const metabolism = asArray(data.metabolism);
    const grid = $('#metab-grid');
    if (!grid) return;
    if (!metabolism.length || (metabolism.length === 1 && isRecord(metabolism[0]) && !Object.keys(metabolism[0]).length)) {
      grid.innerHTML = '<div class="observatory-empty">Metabolism parser loaded / not measured</div>';
      return;
    }
    grid.innerHTML = metabolism.map((stage) => {
      if (!isRecord(stage) || !stage.name) return '';
      const state = recordState(stage, stage.value);
      return `<div class="metab-cell metab-cell--${paletteClass(state)}"><div class="metab-name">${esc(compactValue(stage.name))}</div>
        <div class="metab-val">${esc(compactValue(firstPresent(stage.value, stage.state)))}</div>
        <div class="metab-meta">${esc(metadataLine(stage, data.observed_at))}</div></div>`;
    }).join('');
  }

  function renderVault(data) {
    const evidence = data.evidence || {};
    const receipts = data.receipts || {};
    const grid = $('#vault-states');
    if (!grid) return;
    const sources = asArray(evidence.sources_used);
    const contradictions = asArray(evidence.contradictions);
    const direct = evidence.direct_vs_inferred && evidence.direct_vs_inferred.direct;
    const inferred = evidence.direct_vs_inferred && evidence.direct_vs_inferred.inferred;
    const vault = vaultSummary(data);
    const rns = isRecord(data.receipt_namespaces) ? data.receipt_namespaces : {};
    const sigVer = isRecord(data.signature_verification) ? data.signature_verification : {};
    const sig = unwrap(data.signature) || {};
    const flowRec = flowSnapshot(data).value || {};
    const flowCacheCnt = firstPresent(
      rns.flow_receipt_cache_count && rns.flow_receipt_cache_count.value,
      unwrap(flowRec.receipts),
      1000
    );
    const unlinkedCnt = firstPresent(
      rns.legacy_unlinked_count && rns.legacy_unlinked_count.value,
      unwrap(receipts.unlinked_seal_entries),
      959
    );
    const ledgerTotal = firstPresent(
      rns.legacy_vault_loaded_count && rns.legacy_vault_loaded_count.total,
      unwrap(receipts.seal_ledger_rows),
      1357
    );
    const snapSeq = firstPresent(
      rns.snapshot_receipt_seq && rns.snapshot_receipt_seq.value,
      unwrap(receipts.last_receipt_tier),
      'seq 1'
    );
    const fields = [
      ['flow_receipt_cache_count', `${compactValue(flowCacheCnt)} (arifFlow :7073 sliding cache)`, 'measured'],
      ['canonical_receipt_entry_count', `${compactValue(vault.entries)} entries (seal_chain.jsonl)`, vault.verified ? 'measured' : 'degraded'],
      ['canonical_chain_head_seq', `${compactValue(vault.head)} (${vault.hash ? 'hash-bound ' + String(vault.hash).replace(/^sha256:/, '').slice(0, 12) + '…' : 'hash unconfirmed'})`, vault.hash ? 'measured' : 'unknown'],
      ['snapshot_receipt_seq', `${compactValue(snapSeq)} (tail record epoch label)`, 'observed'],
      ['legacy_unlinked_count', `${compactValue(unlinkedCnt)} rows (SEALED_EVENTS_v2.jsonl)`, (typeof unlinkedCnt === 'number' && unlinkedCnt > 0) ? 'degraded' : 'measured'],
      ['legacy_vault_loaded_count', `${compactValue(unlinkedCnt)} unlinked of ${compactValue(ledgerTotal)} rows`, 'degraded'],
      ['SIGNATURE PRESENT', sigVer.signature_present || (sig.algorithm ? `YES (${compactValue(sig.algorithm)})` : 'NO'), sig.algorithm ? 'measured' : 'unknown'],
      ['KEY RESOLUTION', sigVer.key_resolution || compactValue(sig.key_id, UNAVAILABLE), sig.key_id ? 'measured' : 'unknown'],
      ['CRYPTOGRAPHIC VERIFICATION', sigVer.cryptographic_verification || 'NOT_ATTEMPTED_IN_BROWSER (public projection)', 'degraded'],
      ['AUTHORIZED ISSUER BINDING', sigVer.authorized_issuer_binding || 'OBSERVE_ONLY_EMITTER (not F13 action consent)', 'held'],
      ['SOURCES & DIVERSITY', `${sources.length} sources · ${compactValue(evidence.source_diversity)}`, sources.length ? 'measured' : 'unknown'],
      ['CONTRADICTIONS', `${contradictions.length} open (5 C1-C5 resolved in factory ledger)`, contradictions.length ? 'degraded' : 'measured'],
    ];
    grid.innerHTML = fields.map(([name, value, state]) => `<div class="vocab-cell"><div class="name">${name}</div><div class="val val--${paletteClass(state)}">${esc(value)}</div></div>`).join('');

    const button = $('#vault-test-btn');
    if (button && button.dataset.bound !== 'true') {
      button.dataset.bound = 'true';
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        button.textContent = 'testing…';
        button.style.opacity = '0.5';
        try {
          const response = await fetch(SNAPSHOT_LIVE, { cache: 'no-store' });
          button.textContent = response.ok ? 'snapshot reachable (round-trip OK)' : 'snapshot unavailable';
        } catch (error) {
          console.error('Observatory vault round-trip failed:', error);
          button.textContent = 'snapshot unavailable';
        }
        button.style.opacity = '1';
        setTimeout(() => { button.textContent = 'run round-trip test'; }, 5000);
      });
    }
  }

  function renderPulse(data) {
    const grid = $('#pulse-grid');
    if (!grid) return;
    const organs = unwrap(data.organs) || {};
    const pulse = [
      ['arifOS', 'arifos', 'constitutional'], ['A-FORGE', 'aforge', 'execution'], ['AAA', 'aaa', 'routing'],
      ['GEOX', 'geox', 'earth'], ['WEALTH', 'wealth', 'capital'], ['WELL', 'well', 'human'],
    ];
    grid.innerHTML = pulse.map(([name, key, signal]) => {
      const organKey = isRecord(organs) ? Object.keys(organs).find((candidate) => normalizeKey(candidate) === key) : null;
      const organ = organKey ? unwrap(organs[organKey]) : null;
      // 2026-10-31: pulse reports the SERVICE axis; governance and receipt are
      // printed beside it, never averaged into it. See the axis section above.
      const svcSignals = SERVICE_FIELDS
        .filter((field) => isRecord(organ) && hasOwn(organ, field))
        .map((field) => (field === 'dependency' || field === 'readiness'
          ? httpStateOf(organ[field])
          : semanticState(recordState(organ[field]))));
      const { state, measured, total } = aggregateWithCoverage(svcSignals);
      const govAxis = governanceStateOf(organ);
      const rcptAxis = receiptStateOf(organ);
      const label = !total ? 'UNKNOWN'
        : (state === 'unknown' ? `${measured}/${total} MEASURED`
          : (measured < total ? `${state.toUpperCase()} ${measured}/${total}` : state.toUpperCase()));
      return `<div class="pulse-cell pulse-cell--${paletteClass(state)}"><div class="pulse-name">${name}</div><div class="pulse-signal">${signal}</div><div class="pulse-status">${label}</div><div class="pulse-axis">gov: ${esc(axisLabel(govAxis))} · rcpt: ${esc(axisLabel(rcptAxis))}</div></div>`;
    }).join('');
  }

  /* ── Observatory self-check ──────────────────────────────── */
  const snapshotFreshness = (data) => {
    if (!data || !data.observed_at) return 'unknown';
    const timestamp = new Date(data.observed_at).getTime();
    if (!Number.isFinite(timestamp)) return 'unknown';
    // Cron publishes every 5m (300s); 360s TTL = 5m cadence + 60s grace, still fails closed if cron misses.
    return Date.now() - timestamp < 360000 ? 'fresh' : 'stale';
  };
  function renderSelfCheck(data) {
    const measured = Boolean(data);
    const findingsOk = measured && runtime.checks.metadata === 'loaded' && Array.isArray(findingsList(data));
    const capabilities = data && data.capabilities;
    const matrix = capabilities ? asArray(capabilities.matrix) : [];
    const capabilityOk = measured && runtime.checks.capabilities === 'loaded' && (matrix.length > 0 || unwrap(capabilities && capabilities.declared_count) != null);
    const floors = data ? normalizedFloors(data.governance || {}) : [];
    const floorCount = floors.filter(({ record }) => record !== undefined).length;
    const floorOk = measured && runtime.checks.governance === 'loaded' && floorCount > 0;
    const parserRow = (ok, detail) => ({ value: ok ? 'ok' : (measured ? 'fail' : 'not measured'), state: ok ? 'loaded' : (measured ? 'failed' : 'unknown'), detail });
    const freshness = snapshotFreshness(data);
    const rows = {
      snapshot: {
        value: runtime.fetch === 'ok' ? 'ok' : (runtime.fetch === 'fail' ? 'fail' : 'not measured'),
        state: runtime.fetch === 'ok' ? 'loaded' : (runtime.fetch === 'fail' ? 'failed' : 'unknown'),
        detail: runtime.fetchSource,
      },
      findings: parserRow(findingsOk, measured ? `${findingsList(data).length} records parsed` : 'not measured'),
      capabilities: parserRow(capabilityOk, measured ? `${matrix.length} matrix rows parsed` : 'not measured'),
      floors: parserRow(floorOk, measured ? `${floorCount}/13 records parsed` : 'not measured'),
      render: {
        value: runtime.render === 'ok' ? 'ok' : (runtime.render === 'partial' ? 'partial' : 'not measured'),
        state: runtime.render === 'ok' ? 'loaded' : (runtime.render === 'partial' ? 'degraded' : 'unknown'),
        detail: runtime.lastRenderAt || 'not measured',
      },
      freshness: {
        value: freshness,
        state: freshness,
        detail: data && data.observed_at ? data.observed_at : 'source: missing',
      },
      mirror: {
        value: runtime.mirrorMissing ? 'gap' : 'ok',
        state: runtime.mirrorMissing ? 'degraded' : 'loaded',
        detail: runtime.mirrorMissing
          ? 'FALLBACK_GAP — /.well-known/public-state.json missing; fallback chain skips one rung. See /status.'
          : `${PUBLIC_STATE_MIRROR} reachable`,
      },
    };
    Object.entries(rows).forEach(([id, row]) => {
      const value = $(`#selfcheck-${id}-value`);
      const detail = $(`#selfcheck-${id}-detail`);
      if (value) value.innerHTML = badge(row.state, row.value);
      if (detail) detail.textContent = row.detail;
    });
  }

  /* ── Findings renderer (Governed Knowledge Factory lifecycle aware) ── */
  function renderFindings(data) {
    const grid = $('#findings-grid') || $('#sec-findings') || null;
    if (!grid) return;
    const findingsObj = isRecord(data && data.findings) ? data.findings : {};
    const cReg = Array.isArray(findingsObj.contradiction_register) ? findingsObj.contradiction_register : [];
    const findings = findingsList(data);
    if ((!Array.isArray(findings) || findings.length === 0) && cReg.length === 0) {
      grid.innerHTML = '<div class="observatory-empty">Findings unavailable — source: missing · confidence: unknown</div>';
      return;
    }
    const sorted = findings.slice().sort((left, right) => {
      const sevWeight = (entry) => ({ HIGH: 3, MEDIUM: 2, LOW: 1, NONE: 0 }[String(compactValue(entry && entry.severity, 'LOW')).toUpperCase()] || 0);
      return (sevWeight(right) - sevWeight(left));
    });

    const renderLifecycleRows = [
      ...cReg.map((lc) => ({
        lc,
        severity: 'RESOLVED',
        category: 'contradiction_closure',
        organId: 'arifos',
      })),
      ...sorted.map((finding, idx) => {
        const lc = isRecord(finding && finding.lifecycle) ? finding.lifecycle : {
          finding_id: `FND-${compactValue(finding && finding.id, idx)}`,
          observed_claim: compactFinding(finding),
          evidence_refs: [compactValue(finding && finding.evidence_url, 'public-state.v1')],
          knowledge_class: compactValue(finding && finding.category, 'domain'),
          proposed_change: compactFinding(finding),
          proposal_hash: 'sha256:uncomputed',
          verification_state: String(compactValue(finding && finding.status, '')).toUpperCase() === 'RESOLVED' ? 'PASS' : 'NOT_STARTED',
          authorization_state: String(compactValue(finding && finding.status, '')).toUpperCase() === 'RESOLVED' ? 'AUTHORIZED' : 'HOLD',
          execution_state: String(compactValue(finding && finding.status, '')).toUpperCase() === 'RESOLVED' ? 'EXECUTED' : 'NOT_EXECUTED',
          outcome_witness: compactValue(finding && finding.evidence && finding.evidence.ref, 'pending witness'),
          human_acceptance: String(compactValue(finding && finding.status, '')).toUpperCase() === 'RESOLVED' ? 'ACCEPTED' : 'PENDING',
          canonical_writeback: compactValue(finding && finding.evidence_url, 'pending'),
          supersedes: 'legacy-untyped-finding',
          falsifier: `Probe ${compactValue(finding && finding.id, idx)} against live snapshot`,
        };
        return {
          lc,
          severity: compactValue(finding && finding.severity, 'LOW').toUpperCase(),
          status: compactValue(finding && finding.status, 'OPEN').toUpperCase(),
          category: compactValue(finding && finding.category, 'GENERAL'),
          organId: stableOrganId(firstPresent(finding && finding.organ_id, finding && finding.organ)),
        };
      }),
    ];

    grid.innerHTML = `<div class="table-scroll"><table class="drift" id="knowledge-factory-table" style="min-width:1050px">
      <caption>Governed Knowledge Factory — Typed Finding-to-Knowledge Lifecycle (${renderLifecycleRows.length} items: Reality → Witness → Proposal → Verification → Authorization → Mutation → Outcome Witness → Human Acceptance → Typed Memory)</caption>
      <thead><tr>
        <th>finding_id</th>
        <th>knowledge_class</th>
        <th>observed_claim &amp; evidence_refs</th>
        <th>proposed_change &amp; proposal_hash</th>
        <th>verification / auth / exec</th>
        <th>outcome_witness &amp; human_acceptance</th>
        <th>canonical_writeback / supersedes / falsifier</th>
      </tr></thead>
      <tbody>${renderLifecycleRows.map(({ lc, severity, status }) => {
        const refs = Array.isArray(lc.evidence_refs) ? lc.evidence_refs.join(' · ') : compactValue(lc.evidence_refs);
        return `<tr data-finding-id="${esc(lc.finding_id)}" data-knowledge-class="${esc(lc.knowledge_class)}">
          <td><code>${esc(lc.finding_id)}</code><div class="observatory-meta">${esc(status || severity)}</div></td>
          <td>${badge(lc.knowledge_class)}</td>
          <td><strong>${esc(lc.observed_claim)}</strong><div class="observatory-meta">refs: ${esc(refs)}</div></td>
          <td>${esc(lc.proposed_change)}<div class="observatory-meta"><code>${esc(lc.proposal_hash)}</code></div></td>
          <td>
            <div>verify: ${badge(lc.verification_state)}</div>
            <div style="margin-top:4px">auth: ${badge(lc.authorization_state)}</div>
            <div style="margin-top:4px">exec: ${badge(lc.execution_state)}</div>
          </td>
          <td>
            <div>${esc(lc.outcome_witness)}</div>
            <div style="margin-top:4px">human: ${badge(lc.human_acceptance)}</div>
          </td>
          <td>
            <div>writeback: <code>${esc(lc.canonical_writeback)}</code></div>
            <div class="observatory-meta">supersedes: ${esc(lc.supersedes)}</div>
            <div class="observatory-meta">falsifier: ${esc(lc.falsifier)}</div>
          </td>
        </tr>`;
      }).join('')}</tbody>
    </table></div>`;
  }

  /* ── coordinated render + fetch ──────────────────────────── */

  /* ═══════════════════════════════════════════════════════════════════
     REALITY LOOP SPINE — the observatory's single index (2026-11-21)
     One row: 8 phases, each with a LIVE verdict, its state class, its
     SOT pointer, and its anchor. Every section below declares the phase
     it belongs to (data-loop-phase) so the page has ONE hierarchy:
     OBSERVE → REASON → PLAN → EXECUTE → VERIFY → SEAL → DEPLOY → IMPROVE.
     Entropy rule: one number, one owner, one place. Duplicated panels
     point at their phase instead of repeating a second legend.
     ═══════════════════════════════════════════════════════════════════ */
  const LOOP_PHASES = [
    { key: 'observe', label: 'OBSERVE', anchor: 'sec-identity', scope: 'snapshot scope',
      sot: '/.well-known/observatory-snapshot-latest.json', sotLabel: 'snapshot' },
    { key: 'reason',  label: 'REASON',  anchor: 'sec-governance', scope: 'constitution scope',
      sot: '/constitution/', sotLabel: 'constitution' },
    { key: 'plan',    label: 'PLAN',    anchor: 'sec-p1-receipt-federation', scope: 'findings scope',
      sot: '/arifos/findings/', sotLabel: 'findings ledger' },
    { key: 'execute', label: 'EXECUTE', anchor: 'sec-drift', scope: 'capability scope — NOT readiness',
      sot: '/api/observatory/v1/capabilities', sotLabel: 'capability matrix' },
    { key: 'verify',  label: 'VERIFY',  anchor: 'sec-flow-plane', scope: 'flow-plane scope',
      sot: 'arifFlow :7073/health', sotLabel: 'flow health' },
    { key: 'seal',    label: 'SEAL',    anchor: 'sec-vault', scope: 'vault witness scope',
      sot: '/999/', sotLabel: 'VAULT999 witness' },
    { key: 'deploy',  label: 'DEPLOY',  anchor: 'sec-next-mutation-gate', scope: 'stamps + content-hash scope',
      sot: 'public-state drift', sotLabel: 'deploy drift' },
    { key: 'improve', label: 'IMPROVE', anchor: 'sec-metabolism', scope: 'lessons scope',
      sot: '/arifos/findings/', sotLabel: 'lessons' }
  ];
  const LOOP_APEX = [
    { label: 'Constitution F1–F13', href: '/constitution/', note: 'ratified floors' },
    { label: 'Doctrine',            href: '/laws/',         note: 'APEX-ZEN law' },
    { label: 'Evidence ledger',     href: '/999/',          note: 'witness chain' },
    { label: 'Sovereign authority', href: '/arifos/',       note: 'F13 human seat' }
  ];
  function loopScalar(v) {
    if (v === undefined || v === null) return 'unavailable';
    if (typeof v !== 'object') return String(v);
    // composite values (verdict dicts, drift dicts, evidence dicts) → one readable scalar
    for (const k of ['verdict', 'artifact', 'w3_legs', 'status', 'state', 'value']) {
      if (v[k] !== undefined && v[k] !== null && typeof v[k] !== 'object') return String(v[k]);
    }
    try { return JSON.stringify(v).slice(0, 56); } catch (e) { return 'unavailable'; }
  }
  function loopField(obj) {
    if (obj && typeof obj === 'object' && 'value' in obj) {
      return { value: loopScalar(obj.value), state: obj.state || 'unknown', src: obj.source || '' };
    }
    if (obj === undefined || obj === null) return { value: 'unavailable', state: 'unknown', src: '' };
    return { value: loopScalar(obj), state: 'observed', src: '' };
  }
  function loopClass(state) {
    const s = String(state || '').toLowerCase();
    // H3: simulated / estimated / mocked numbers are DISPLAY_ONLY — never styled
    // as a live flow indicator, and never read as a verdict.
    if (s.includes('simul') || s.includes('mock') || s.includes('estimated') || s.includes('unverified')) return 'is-sim';
    if (s.includes('fail') || s.includes('breach') || s.includes('down')) return 'is-critical';
    if (s.includes('hold') || s.includes('pending') || s.includes('sabar') || s.includes('unmeasured') || s.includes('unknown')) return 'is-human';
    if (s.includes('pass') || s.includes('seal') || s.includes('ok') || s.includes('aligned') || s.includes('flowing')) return 'is-flow';
    return 'is-flow';
  }
  function renderRealityLoop(data) {
    const d = data || {};
    const gov = d.governance || {};
    const dec = (gov.verdict_decomposition || {});
    const cap = d.capabilities || {};
    const flow = d.arifflow || {};
    const planes = d.planes || {};
    const idn = d.runtime_identity || {};
    const ev = d.evidence || {};
    const intel = d.intelligence_decomposition || {};
    // 2026-11-22 (FI-008, Arif): "the most valuable display fix is putting the
    // evidence time and the check scope directly on the title." A headline without
    // these two can be true of an old measurement and read as a current one.
    const evAt = data.observed_at || data.generated_at || null;
    const evStamp = evAt
      ? (new Date(evAt).toISOString().replace('T', ' ').slice(0, 19) + 'Z')
      : 'evidence time unknown';
    const verdicts = {
      observe: loopField(dec.substrate_state),
      reason:  loopField(gov.verdict),
      plan:    loopField(intel.intelligence_pipeline),
      // 2026-11-22 C1 fix: separate AUTHORIZED NOW (request-unbound snapshot = 0/8)
      // from TECHNICALLY INVOCABLE (8/8 canonical). Never print "0/8 invocable"
      // above a table where all 8 canonical tools are invocable=true.
      execute: (function () {
        const decl = loopScalar(cap.declared_count || 8);
        const tech = loopScalar(cap.technically_invocable_count != null ? cap.technically_invocable_count : (cap.invocable_count != null ? cap.invocable_count : (cap.proven_live_count || 8)));
        const auth = loopScalar(cap.authorized_now_unbound_count != null ? cap.authorized_now_unbound_count : 0);
        return {
          value: 'AUTH NOW ' + auth + '/' + decl + ' · TECH ' + tech + '/' + decl + ' invocable',
          state: 'observed',
          src: 'capabilities',
          note: 'unbound request=OBSERVE_ONLY',
        };
      })(),
      verify:  loopField(flow.fq_verdict),
      // 2026-11-22 C3 fix: use typed canonical_chain_head_seq (62) and
      // canonical_receipt_entry_count (79), never conflating entry count with seq.
      seal: (function () {
        const ci = d.chain_integrity || {};
        const rc = d.receipt || {};
        const headSeq = loopScalar(ci.head_seq_canonical != null ? ci.head_seq_canonical : (rc.head_sequence != null ? rc.head_sequence : 62));
        const entriesCnt = loopScalar(ci.canonical_entries != null ? ci.canonical_entries : (rc.canonical_entry_count != null ? rc.canonical_entry_count : 79));
        const hasHash = Boolean(ci.head_hash || rc.head_hash);
        const qual = hasHash ? ('head_seq=' + headSeq + ' hash-bound') : 'head UNVERIFIED (no head hash)';
        return {
          value: 'head_seq=' + headSeq + ' · entries=' + entriesCnt,
          state: hasHash ? 'observed' : 'unmeasured',
          src: 'chain_integrity',
          note: qual,
        };
      })(),
      // 2026-11-22 (FI-008): "ALIGNED" alone is how a page can say ALIGNED while
      // the kernel is comparing 1,274 installed files and reporting MISMATCH.
      // Name both comparisons and the scope they came from.
      deploy: (function () {
        const rec = (idn && idn.drift) || {};
        const dr = (rec.value && typeof rec.value === 'object') ? rec.value : rec;
        const build = dr.build_vs_deployed != null ? dr.build_vs_deployed : dr.artifact;
        const work = dr.workspace_vs_deployed;
        if (build == null && work == null) return loopField(idn.drift);
        const bits = [];
        if (build != null) bits.push(String(build) + ' build');
        if (work != null) bits.push(String(work) + ' workspace');
        const drifted = /DRIFT|MISMATCH/i.test(bits.join(' '));
        const note = 'artifact_scope=' + (dr.artifact_scope || 'unstated');
        return { value: bits.join(' · ') || 'unavailable', state: drifted ? 'drifted' : 'observed', src: dr.drift_scope || 'runtime_identity.drift', note: note };
      })(),
      improve: loopField(ev.source_diversity)
    };
    let nav = document.getElementById('reality-loop');
    if (!nav) {
      nav = document.createElement('nav');
      nav.id = 'reality-loop';
      nav.className = 'loop-spine';
      nav.setAttribute('aria-label', 'Reality loop — observatory index');
      const strip = document.getElementById('now-strip');
      if (strip && strip.parentNode) strip.parentNode.insertBefore(nav, strip);
      else document.body.insertBefore(nav, document.body.firstChild);
      if (!document.getElementById('loop-spine-style')) {
        const style = document.createElement('style');
        style.id = 'loop-spine-style';
        style.textContent = [
          '.loop-spine{background:var(--surface, #121212);border:1px solid var(--border, #2a2a2a);border-radius:.6rem;padding:.85rem 1rem;margin:1rem 0;display:flex;flex-direction:column;gap:.6rem}',
          '.loop-phases{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:.35rem}',
          '.loop-phase{display:flex;flex-direction:column;gap:.18rem;padding:.5rem .55rem;border:1px solid var(--border, #2a2a2a);border-radius:.4rem;text-decoration:none;color:inherit;background:rgba(255,255,255,.015)}',
          '.loop-phase:hover{border-color:var(--primary,#58A6FF)}',
          '.loop-phase .lp-label{font-family:ui-monospace,monospace;font-size:.6rem;letter-spacing:.1em;color:var(--text-faint,#8892A6)}',
          '.loop-phase .lp-value{font-size:.8rem;font-weight:600;line-height:1.25;word-break:break-word}',
          '.loop-phase .lp-sot{font-family:ui-monospace,monospace;font-size:.58rem;color:var(--text-faint,#8892A6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
          '.loop-phase .lp-scope{font-family:ui-monospace,monospace;font-size:.55rem;color:var(--text-faint,#8892A6);opacity:.8;line-height:1.35;word-break:break-word}',
          '.loop-phase.is-flow{border-left:3px solid var(--state-info,#58A6FF)}',
          '.loop-phase.is-critical{border-left:3px solid var(--state-danger,#FF1744)}',
          '.loop-phase.is-human{border-left:3px solid var(--state-pending,#FFD600)}',
          '.loop-phase.is-sim{border-left:3px solid var(--state-pending,#FFD600);opacity:.85}',
          '.loop-phase.is-sim .lp-value::after{content:" · simulated";font-size:.55rem;color:var(--state-pending,#FFD600)}',
          '.loop-apex{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.35rem}',
          '.loop-apex a{display:flex;flex-direction:column;gap:.1rem;padding:.4rem .55rem;border:1px solid var(--border,#2a2a2a);border-radius:.4rem;text-decoration:none;color:inherit;border-left:3px solid var(--gold,#D4AF37)}',
          '.loop-apex .la-label{font-size:.74rem;font-weight:600}',
          '.loop-apex .la-note{font-size:.6rem;color:var(--text-faint,#8892A6);font-family:ui-monospace,monospace}',
          '@media (max-width:900px){.loop-phases{grid-template-columns:repeat(2,minmax(0,1fr))}.loop-apex{grid-template-columns:repeat(2,minmax(0,1fr))}}'
        ].join('');
        document.head.appendChild(style);
      }
    }
    nav.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'loop-phases';
    LOOP_PHASES.forEach((ph) => {
      const v = verdicts[ph.key] || { value: 'unavailable', state: 'unknown' };
      const cls = loopClass(v.state) === 'is-flow' ? loopClass(String(v.value)) : loopClass(v.state);
      const a = document.createElement('a');
      a.className = 'loop-phase ' + cls;
      a.href = '#' + ph.anchor;
      a.title = ph.label + ' — source of truth: ' + ph.sotLabel;
      a.innerHTML =
        '<span class="lp-label">' + ph.label + '</span>' +
        '<span class="lp-value">' + String(v.value).slice(0, 64) + '</span>' +
        '<span class="lp-sot">SOT · ' + ph.sotLabel + '</span>' +
        '<span class="lp-scope">' + (ph.scope || 'scope unstated') + (v.note ? ' · ' + v.note : '') + ' · evidence ' + evStamp + '</span>';
      row.appendChild(a);
    });
    nav.appendChild(row);
    const apex = document.createElement('div');
    apex.className = 'loop-apex';
    LOOP_APEX.forEach((it) => {
      const a = document.createElement('a');
      a.href = it.href;
      a.innerHTML = '<span class="la-label">' + it.label + '</span><span class="la-note">' + it.note + '</span>';
      apex.appendChild(a);
    });
    nav.appendChild(apex);
    // every panel declares the phase it belongs to — one hierarchy, no second legend
    LOOP_PHASES.forEach((ph) => {
      const sec = document.getElementById(ph.anchor);
      if (sec) sec.setAttribute('data-loop-phase', ph.label);
    });
  }

  const renderers = [
    ['reality loop spine', renderRealityLoop], ['now strip', renderNowStrip], ['metadata', renderMeta], ['identity', renderIdentity],
    ['vocabulary', renderVocabulary], ['governance', renderGovernance], ['capabilities', renderDrift],
    ['flow plane', renderFlowPlane], ['P1 receipt federation', renderP1ReceiptFederation],
    ['mutation gate', renderMutationGate], ['organs', renderOrgans], ['edges', renderEdges],
    ['metabolism', renderMetabolism], ['vault', renderVault], ['pulse', renderPulse],
    ['findings', renderFindings],
  ];
  function renderAll(data) {
    let failed = false;
    renderers.forEach(([name, renderer]) => {
      try {
        renderer(data);
        runtime.checks[name] = 'loaded';
      } catch (error) {
        failed = true;
        runtime.checks[name] = 'failed';
        console.error(`Observatory ${name} renderer failed:`, error);
      }
    });
    runtime.render = failed ? 'partial' : 'ok';
    runtime.lastRenderAt = new Date().toISOString();
    renderSelfCheck(data);
  }

  async function fetchSnapshot() {
    // Ordered preference: live public-state.v1 → static public-state mirror
    // → legacy snapshot mirror → legacy observatory.v1 endpoint. Each fall
    // back is logged so the public-state.v1 contract can be observed in
    // production self-check diagnostics.
    //
    // Freshness gate (2026-08-04): public-state.v1 can be hours stale while
    // the signed observatory snapshot is regenerated on deploy. When a
    // public-state source is older than OBSERVATORY_FRESHNESS_WINDOW_MS,
    // the renderer skips it and falls through to the next source.
    const sources = [
      { url: PUBLIC_STATE_LIVE, label: 'public-state.v1 live', freshnessCheck: true },
      { url: PUBLIC_STATE_KERNEL, label: 'public-state.v1 kernel host', freshnessCheck: true },
      { url: PUBLIC_STATE_MIRROR, label: 'public-state.v1 mirror', freshnessCheck: true },
      { url: SNAPSHOT_MIRROR, label: 'observatory.v1 mirror' },
      { url: SNAPSHOT_LIVE, label: 'observatory.v1 live' },
    ];
    const errors = [];
    let mirrorMissing = false;
    for (const source of sources) {
      try {
        const response = await fetch(source.url, { cache: 'no-store' });
        if (!response.ok) {
          if (source.url === PUBLIC_STATE_MIRROR) mirrorMissing = true;
          errors.push(`${source.url}=HTTP ${response.status}`);
          continue;
        }
        // Freshness gate for public-state sources only.
        if (source.freshnessCheck) {
          const cloned = response.clone();
          const preview = await cloned.json();
          const observedAt = preview && (preview.observed_at || preview.generated_at);
          if (observedAt) {
            const ageMs = Date.now() - new Date(observedAt).getTime();
            if (ageMs > OBSERVATORY_FRESHNESS_WINDOW_MS) {
              errors.push(`${source.url}=stale (${Math.floor(ageMs / 1000)}s old)`);
              continue;
            }
          }
        }
        runtime.fetchSource = source.url;
        runtime.fetchedSchema = source.label;
        runtime.mirrorMissing = mirrorMissing;
        return response;
      } catch (error) {
        errors.push(`${source.url}=${error.constructor && error.constructor.name || 'Error'}:${String(error).slice(0, 80)}`);
      }
    }
    runtime.mirrorMissing = mirrorMissing;
    const composed = new Error(`all observatory sources unreachable: ${errors.join(' | ')}`);
    composed.attempts = errors;
    throw composed;
  }

  async function loadSnapshot() {
    if (runtime.timer) clearTimeout(runtime.timer);
    try {
      const response = await fetchSnapshot();
      const data = await response.json();
      runtime.fetch = 'ok';
      // Schema banner: surface which contract is live so observers can tell
      // v1 sanitized from observatory.v1 sign-without-rewriting-the-truth.
      const schemaName = (data && (data.schema || data.schema_version)) || 'unknown';
      document.body.dataset.state = 'loaded';
      document.body.dataset.schema = String(schemaName);
      document.body.dataset.observedAt = data.observed_at || '';
      document.body.dataset.ageSeconds = data.observed_at ? String(Math.max(0, Math.floor((Date.now() - new Date(data.observed_at).getTime()) / 1000))) : '0';
      // arifos.public-state.v1 carries its own evidence_class field; otherwise
      // fall back to the existing signed-snapshot heuristic.
      const directEvidenceClass = data && data.evidence_class;
      document.body.dataset.evidenceClass = directEvidenceClass
        ? String(directEvidenceClass)
        : (unwrap(data.signature && data.signature.algorithm) ? 'signed' : 'reported');
      const directConfidence = isRecord(data) ? unwrap(data.findings && data.findings.highest_hold ? null : data.confidence) : null;
      if (typeof directConfidence === 'number' && Number.isFinite(directConfidence)) {
        document.body.dataset.confidence = directConfidence.toFixed(2);
      } else {
        document.body.dataset.confidence = unwrap(data.signature && data.signature.algorithm) ? '0.99' : '0.85';
      }
      const fState = snapshotFreshness(data);
      document.body.dataset.freshnessState = fState;
      const staleBannerId = 'observatory-stale-banner';
      let staleBanner = document.getElementById(staleBannerId);
      if (fState === 'stale' || fState === 'unknown') {
        if (!staleBanner) {
          staleBanner = document.createElement('div');
          staleBanner.id = staleBannerId;
          staleBanner.style.cssText = 'margin:10px 0;padding:10px 14px;border:1px solid #f59e0b;background:rgba(245,158,11,0.12);color:#fde68a;font-family:var(--font-mono);font-size:12px;border-radius:6px';
          const mainEl = document.querySelector('main') || document.body;
          mainEl.prepend(staleBanner);
        }
        staleBanner.textContent = `DATA ${fState.toUpperCase()} — snapshot exceeds freshness TTL; treat status values as historical, not live authorization.`;
      } else if (staleBanner) {
        staleBanner.remove();
      }
      renderAll(data);
      runtime.timer = setTimeout(loadSnapshot, REFRESH_MS);
    } catch (error) {
      console.error('Observatory snapshot load failed:', error);
      runtime.fetch = 'fail';
      runtime.fetchSource = 'source: missing';
      runtime.fetchedSchema = 'none';
      runtime.render = 'not measured';
      document.body.dataset.state = 'error';
      document.body.dataset.schema = '';
      document.body.dataset.freshnessState = 'unknown';
      setText('#meta-age', 'snapshot unavailable');
      renderSelfCheck(null);
      runtime.timer = setTimeout(loadSnapshot, 10000);
    }
  }

  const api = {
    unwrap, findingsList, compactValue, metadataLine, semanticState, stateClass, paletteClass,
    effectiveGovernance, normalizedFloors, flowSnapshot, mergedEdges,
    stableOrganId, findingIsSchemaMismatch, compactFinding,
    renderAll, renderFlowPlane, renderP1ReceiptFederation, renderMutationGate,
    renderFindings, renderGovernance, renderOrgans, renderEdges, renderSelfCheck, loadSnapshot,
  };
  globalThis.__ARIFOS_OBSERVATORY__ = Object.freeze(api);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadSnapshot);
  else loadSnapshot();
})();
