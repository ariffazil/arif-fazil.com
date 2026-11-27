/**
 * Earth Geology Source Resolver — Lane A (Macrostrat v2 Upgrade) + Lane B (JMG 1:500k Local POC Plug-in)
 * Same-origin, zero-dependency UMD module (CSP-safe, testable in Node.js and browser).
 *
 * Governance & Transparent Flag Rules:
 * - Pinned Macrostrat API: https://macrostrat.org/api/v2 (CC-BY 4.0, verified live 2026-11-27)
 * - Never serves stale cache when upstream is unreachable (returns UNKNOWN).
 * - Separates coarse global scale (COARSE_GLOBAL_SCALE, e.g. source_id 154 Chorlton 1:25M)
 *   from mismatched basin comments (COMMENT_REGION_MISMATCH, e.g. "Barito Basin" in comments
 *   when clicked in Sabah/Sarawak). Displays the coarse unit honestly with scale caveat and
 *   withholds mismatched comment text from being presented as local basin geology.
 * - Zero count != absence of bedrock.
 * - JMG 1:500k local POC asset is optional and gitignored while JMG redistribution rights remain HOLD.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.EarthGeologyResolver = factory();
  }
})(typeof self !== "undefined" ? self : globalThis, function () {
  "use strict";

  const MACROSTRAT_API_BASE = "https://macrostrat.org/api/v2";
  const MACROSTRAT_API_VERSION = "api-v2";
  const MACROSTRAT_LICENSE = "CC-BY 4.0";
  const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
  const DEFAULT_JMG_POC_URL = "/earth/data/jmg-local-poc/malaysia_jmg_poc.json";

  // Known coarse global compilation source IDs in Macrostrat (e.g., 154 = Chorlton 1:25M GSC Open File 5529)
  const COARSE_GLOBAL_SOURCE_IDS = new Set([154]);

  // Non-overlapping Malaysian onshore envelopes (Lawas/Limbang 4.75N,115.0E -> Sarawak, not Sabah)
  const MALAYSIA_REGIONS = [
    { name: "Sabah", minLng: 115.45, maxLng: 119.4, minLat: 4.05, maxLat: 7.45 },
    { name: "Sarawak", minLng: 109.5, maxLng: 115.45, minLat: 0.85, maxLat: 5.05 },
    { name: "Peninsular Malaysia", minLng: 99.6, maxLng: 104.6, minLat: 1.2, maxLat: 6.75 },
  ];

  // Basin/region labels known to appear in coarse polygon `comments` that do not match Sabah/Sarawak/Peninsular
  const NON_LOCAL_COMMENT_TOKENS = [
    "barito basin",
    "barito",
    "kutai basin",
    "kutei basin",
    "kutei",
    "tarakan basin",
    "tarakan",
    "natuna",
    "melawi",
    "ketungau",
    "kapuas",
    "sumatra",
    "java",
    "sulawesi",
    "palawan",
    "mindanao",
  ];

  function detectMalaysiaJurisdiction(lat, lng) {
    for (const r of MALAYSIA_REGIONS) {
      if (lat >= r.minLat && lat <= r.maxLat && lng >= r.minLng && lng <= r.maxLng) {
        return r.name;
      }
    }
    return null;
  }

  /**
   * Transparent flag calculation:
   * 1) COARSE_GLOBAL_SCALE: triggered when source_id is in COARSE_GLOBAL_SOURCE_IDS (e.g. 154 = Chorlton 1:25M).
   * 2) COMMENT_REGION_MISMATCH: triggered ONLY when clicked inside Malaysia AND unit.comments contains
   *    a non-local basin/region token. Does NOT fabricate external place names not present in the API.
   */
  function evaluateMacrostratFlags(lat, lng, unit) {
    const flags = [];
    const details = {};
    if (!unit) return { flags, details };

    if (COARSE_GLOBAL_SOURCE_IDS.has(Number(unit.source_id))) {
      flags.push("COARSE_GLOBAL_SCALE");
      details.scale = {
        rule: "source_id in COARSE_GLOBAL_SOURCE_IDS",
        source_id: Number(unit.source_id),
        note: "Generalized global compilation (e.g., Chorlton 1:25M, GSC Open File 5529); low spatial resolution, not a location error.",
      };
    }

    const malaysiaRegion = detectMalaysiaJurisdiction(lat, lng);
    const commentsRaw = String(unit.comments || "").trim();
    if (malaysiaRegion && commentsRaw) {
      const lower = commentsRaw.toLowerCase();
      for (const token of NON_LOCAL_COMMENT_TOKENS) {
        if (lower.includes(token)) {
          flags.push("COMMENT_REGION_MISMATCH");
          details.comment_mismatch = {
            rule: "clicked_in_malaysia && unit.comments matches NON_LOCAL_COMMENT_TOKENS",
            clicked_jurisdiction: malaysiaRegion,
            matched_field: "comments",
            matched_token: token,
            raw_comments: commentsRaw,
            note: `Polygon comments ("${commentsRaw}") do not match clicked jurisdiction (${malaysiaRegion}); withheld as local basin label.`,
          };
          break;
        }
      }
    }

    return { flags, details };
  }

  // Pure-JS point-in-ring (ray casting) + hole support for Polygon / MultiPolygon
  function pointInRing(lng, lat, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0], yi = ring[i][1];
      const xj = ring[j][0], yj = ring[j][1];
      const intersect = (yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-15) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function pointInPolygonCoords(lng, lat, polyCoords) {
    if (!polyCoords || !polyCoords.length) return false;
    if (!pointInRing(lng, lat, polyCoords[0])) return false;
    for (let h = 1; h < polyCoords.length; h++) {
      if (pointInRing(lng, lat, polyCoords[h])) return false;
    }
    return true;
  }

  function pointInGeometry(lng, lat, geom) {
    if (!geom || !geom.coordinates) return false;
    if (geom.type === "Polygon") return pointInPolygonCoords(lng, lat, geom.coordinates);
    if (geom.type === "MultiPolygon") {
      for (const poly of geom.coordinates) {
        if (pointInPolygonCoords(lng, lat, poly)) return true;
      }
    }
    return false;
  }

  function classifyContrast(jmgRes, msRes) {
    const jOk = jmgRes && jmgRes.status === "RESOLVED";
    const mOk = msRes && msRes.status === "RESOLVED";
    if (!jOk && !mOk) return "UNKNOWN";
    if (!jOk || !mOk) return "ONE_SOURCE_UNRESOLVED";
    if (msRes.flags && msRes.flags.includes("COARSE_GLOBAL_SCALE")) {
      return "DIFFERS_IN_SCALE";
    }
    const jUnit = String(jmgRes.unit_name_display || jmgRes.formation_original || "").toLowerCase();
    const mUnit = String(msRes.unit_name || "").toLowerCase();
    if (mUnit.startsWith("cenozoic") || mUnit.startsWith("mesozoic") || mUnit.startsWith("paleozoic")) {
      return "DIFFERS_IN_SCALE";
    }
    if (jUnit && mUnit && jUnit === mUnit) return "AGREES_BROADLY";
    return "DIFFERS_IN_UNIT";
  }

  function createResolver(options) {
    const opts = options || {};
    const fetchFn = opts.fetchFn || (typeof fetch === "function" ? fetch.bind(globalThis) : null);
    const cacheTtlMs = typeof opts.cacheTtlMs === "number" ? opts.cacheTtlMs : DEFAULT_CACHE_TTL_MS;
    const nowFn = opts.nowFn || (() => Date.now());
    const jmgPocUrl = opts.jmgPocUrl !== undefined ? opts.jmgPocUrl : DEFAULT_JMG_POC_URL;

    const msCache = new Map();
    let jmgDataset = opts.jmgDataset || null;
    let jmgLoadAttempted = Boolean(opts.jmgDataset);

    function cacheKey(lat, lng) {
      return `${lat.toFixed(4)},${lng.toFixed(4)}`;
    }

    async function loadJmgLocalPoc() {
      if (jmgLoadAttempted) return jmgDataset;
      jmgLoadAttempted = true;
      if (!fetchFn || !jmgPocUrl) return null;
      try {
        const res = await fetchFn(jmgPocUrl);
        if (!res || !res.ok) return null;
        const data = await res.json();
        if (data && Array.isArray(data.features)) {
          jmgDataset = data;
          return jmgDataset;
        }
      } catch (_) {}
      return null;
    }

    async function queryJmg(lat, lng) {
      const retrievedUtc = new Date(nowFn()).toISOString();
      const malaysiaRegion = detectMalaysiaJurisdiction(lat, lng);
      const baseMeta = {
        source: "JMG MyGEMS 1:500,000 (Local POC)",
        endpoint: jmgPocUrl || "LOCAL_POC_DISABLED",
        data_version: (jmgDataset && jmgDataset.build_version) || "local-poc-rights-hold",
        retrieved_utc: retrievedUtc,
        license: "UNKNOWN (HOLD pending JMG confirmation)",
        nominal_scale: "1:500,000 (external attribution)",
      };

      if (!malaysiaRegion) {
        return {
          ...baseMeta,
          status: "NO_FEATURE",
          coverage_class: "none",
          flags: [],
          message: "No verified JMG feature returned (outside Malaysia coverage).",
        };
      }

      const ds = await loadJmgLocalPoc();
      if (!ds) {
        return {
          ...baseMeta,
          status: "UNAVAILABLE",
          coverage_class: "none",
          flags: ["JMG_RIGHTS_HOLD_LOCAL_POC_ABSENT"],
          message: "No verified JMG feature returned (local POC dataset not loaded; redistribution rights HOLD).",
        };
      }

      for (const feat of ds.features) {
        const b = feat.bbox;
        if (b && (lng < b[0] || lat < b[1] || lng > b[2] || lat > b[3])) continue;
        if (pointInGeometry(lng, lat, feat.geometry)) {
          const p = feat.properties || {};
          return {
            ...baseMeta,
            status: "RESOLVED",
            coverage_class: "jmg_polygon",
            flags: [],
            feature_id: p.feature_id || null,
            jurisdiction: p.jurisdiction || malaysiaRegion,
            source_layer_id: p.source_layer_id ?? null,
            source_layer_name: p.source_layer_name || null,
            source_object_id: p.source_object_id ?? null,
            source_url: p.source_url || "https://mygems.jmg.gov.my/server/rest/services/Demarcation/Litology_by_Negeri/MapServer",
            unit_code_original: p.unit_code_original || null,
            unit_name_original: p.unit_name_original || null,
            formation_original: p.formation_original || null,
            age_original: p.age_original || null,
            lithology_original: p.lithology_original || null,
            description_original: p.description_original || null,
            unit_name_display: p.unit_name_display || p.formation_original || p.unit_name_original || "Unnamed JMG unit",
            age_display: p.age_display || p.age_original || "UNKNOWN",
            lithology_display: p.lithology_display || p.lithology_original || "UNKNOWN",
            normalization_status: p.normalization_status || "CANDIDATE_HOLD_PENDING_ARIF",
            geological_review_status: p.geological_review_status || "HOLD_PENDING_ARIF",
          };
        }
      }

      return {
        ...baseMeta,
        status: "NO_FEATURE",
        coverage_class: "none",
        flags: [],
        message: "No verified JMG feature returned at this coordinate.",
      };
    }

    async function queryMacrostrat(lat, lng, msBuildVersion) {
      const key = cacheKey(lat, lng);
      const now = nowFn();
      const cached = msCache.get(key);
      if (cached && now - cached.storedAt < cacheTtlMs) {
        return { ...cached.result, cache_hit: true };
      }

      const mapUrl = `${MACROSTRAT_API_BASE}/geologic_units/map?lat=${lat.toFixed(4)}&lng=${lng.toFixed(4)}`;
      const unitsUrl = `${MACROSTRAT_API_BASE}/units?lat=${lat.toFixed(4)}&lng=${lng.toFixed(4)}`;
      const retrievedUtc = new Date(now).toISOString();
      const dataVersion = msBuildVersion ? `${MACROSTRAT_API_VERSION} (${msBuildVersion})` : MACROSTRAT_API_VERSION;

      if (!fetchFn) {
        return {
          status: "UNKNOWN",
          source: "UNKNOWN",
          endpoint: mapUrl,
          data_version: dataVersion,
          retrieved_utc: retrievedUtc,
          license: MACROSTRAT_LICENSE,
          coverage_class: "none",
          flags: ["MACROSTRAT_UNREACHABLE"],
          message: "UNKNOWN — Macrostrat fetch unavailable.",
          cache_hit: false,
        };
      }

      try {
        const [mapResp, unitsResp] = await Promise.all([
          fetchFn(mapUrl),
          fetchFn(unitsUrl).catch(() => null),
        ]);

        if (!mapResp || !mapResp.ok) {
          throw new Error(`Macrostrat HTTP ${mapResp ? mapResp.status : "NETWORK_ERROR"}`);
        }

        const mapJson = await mapResp.json();
        const mapSuccess = (mapJson && mapJson.success) || {};
        const mapData = Array.isArray(mapSuccess.data) ? mapSuccess.data : [];
        const refs = mapSuccess.refs || {};
        const license = mapSuccess.license || MACROSTRAT_LICENSE;

        let unitsData = [];
        if (unitsResp && unitsResp.ok) {
          try {
            const unitsJson = await unitsResp.json();
            unitsData = (unitsJson && unitsJson.success && Array.isArray(unitsJson.success.data))
              ? unitsJson.success.data
              : [];
          } catch (_) {
            unitsData = [];
          }
        }

        const coverageClass = unitsData.length > 0 ? "unit_polygon" : mapData.length > 0 ? "map_polygon" : "none";

        if (mapData.length === 0) {
          const emptyResult = {
            status: "NO_FEATURE",
            source: "Macrostrat",
            endpoint: mapUrl,
            units_endpoint: unitsUrl,
            data_version: dataVersion,
            retrieved_utc: retrievedUtc,
            license,
            coverage_class: coverageClass,
            unit_count: unitsData.length,
            map_count: 0,
            flags: [],
            flag_details: {},
            message: "No mapped bedrock unit returned (0 records does not prove absence of bedrock).",
            cache_hit: false,
          };
          msCache.set(key, { storedAt: now, result: emptyResult });
          return emptyResult;
        }

        const u = mapData[0];
        const tAge = u.t_int_age != null ? u.t_int_age : u.t_age;
        const bAge = u.b_int_age != null ? u.b_int_age : u.b_age;
        const refStr = refs[u.source_id] ? String(refs[u.source_id]) : "";
        const { flags, details } = evaluateMacrostratFlags(lat, lng, u);
        const commentWithheld = flags.includes("COMMENT_REGION_MISMATCH");

        const result = {
          status: "RESOLVED",
          source: "Macrostrat",
          endpoint: mapUrl,
          units_endpoint: unitsUrl,
          data_version: dataVersion,
          retrieved_utc: retrievedUtc,
          license,
          coverage_class: coverageClass,
          unit_count: unitsData.length,
          map_count: mapData.length,
          source_id: u.source_id ?? null,
          color: u.color || "#666666",
          flags,
          flag_details: details,
          unit_name: u.name || "Unnamed unit",
          age_text: `${tAge} – ${bAge} Ma${u.best_int_name || u.t_int_name ? " · " + (u.best_int_name || u.t_int_name) : ""}`,
          lith: u.lith || "lithology not recorded",
          descrip: u.descrip || "",
          // Never surface mismatched comment text as a local basin label
          comments_display: commentWithheld ? null : (u.comments || ""),
          comments_raw_flagged: commentWithheld ? (u.comments || "") : null,
          ref_citation: refStr,
          cache_hit: false,
        };
        msCache.set(key, { storedAt: now, result });
        return result;
      } catch (err) {
        // NEVER serve a stale cache as live when Macrostrat is down
        return {
          status: "UNKNOWN",
          source: "UNKNOWN",
          endpoint: mapUrl,
          data_version: dataVersion,
          retrieved_utc: retrievedUtc,
          license: MACROSTRAT_LICENSE,
          coverage_class: "none",
          flags: ["MACROSTRAT_UNREACHABLE"],
          flag_details: {},
          message: "UNKNOWN — Macrostrat unreachable; stale cache withheld.",
          error: String(err && err.message ? err.message : err),
          cache_hit: false,
        };
      }
    }

    async function resolvePoint(lat, lng, reqOpts) {
      const ro = reqOpts || {};
      const mode = String(ro.mode || "AUTO").toUpperCase();
      const msBuildVersion = ro.msBuildVersion || "";

      if (mode === "MACROSTRAT") {
        const ms = await queryMacrostrat(lat, lng, msBuildVersion);
        return { mode, primary_source: ms.source, primary: ms, fallback_notice: null };
      }

      if (mode === "JMG") {
        const jmg = await queryJmg(lat, lng);
        return { mode, primary_source: jmg.source, primary: jmg, fallback_notice: null };
      }

      if (mode === "CONTRAST") {
        const [jmg, ms] = await Promise.all([
          queryJmg(lat, lng),
          queryMacrostrat(lat, lng, msBuildVersion),
        ]);
        return {
          mode,
          primary_source: "CONTRAST (JMG + Macrostrat)",
          jmg,
          macrostrat: ms,
          contrast_relation: classifyContrast(jmg, ms),
          fallback_notice: null,
        };
      }

      const malaysiaRegion = detectMalaysiaJurisdiction(lat, lng);
      if (malaysiaRegion) {
        const jmg = await queryJmg(lat, lng);
        if (jmg.status === "RESOLVED") {
          return { mode: "AUTO", primary_source: jmg.source, primary: jmg, fallback_notice: null };
        }
        const ms = await queryMacrostrat(lat, lng, msBuildVersion);
        return {
          mode: "AUTO",
          primary_source: ms.source,
          primary: ms,
          jmg_status: jmg.status,
          fallback_notice:
            jmg.status === "UNAVAILABLE"
              ? "JMG local POC unavailable (redistribution rights HOLD); showing Macrostrat."
              : "JMG did not resolve at this location; showing Macrostrat.",
        };
      }

      const ms = await queryMacrostrat(lat, lng, msBuildVersion);
      return { mode: "AUTO", primary_source: ms.source, primary: ms, fallback_notice: null };
    }

    return {
      resolvePoint,
      queryMacrostrat,
      queryJmg,
      detectMalaysiaJurisdiction,
      evaluateMacrostratFlags,
      classifyContrast,
      clearCache: () => msCache.clear(),
    };
  }

  return {
    MACROSTRAT_API_BASE,
    MACROSTRAT_API_VERSION,
    MACROSTRAT_LICENSE,
    DEFAULT_CACHE_TTL_MS,
    COARSE_GLOBAL_SOURCE_IDS,
    createResolver,
    detectMalaysiaJurisdiction,
    evaluateMacrostratFlags,
    classifyContrast,
    pointInGeometry,
  };
});
