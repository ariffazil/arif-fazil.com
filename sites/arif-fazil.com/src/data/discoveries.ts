export interface Discovery {
  id: string;
  title: string;
  category: 'wells' | 'regional' | 'systems';
  categoryLabel: string;
  role: string;
  year: string;
  location: string;
  summary: string;
  evidence: string[];
  limits?: string;
  link?: string;
  linkLabel?: string;
}

export const discoveries: Discovery[] = [
  // ── 1. DISCOVERIES & EXPLORATION WELLS ──────────────────────────────
  {
    id: 'bekantan-1',
    title: 'BEKANTAN‑1',
    category: 'wells',
    categoryLabel: 'Discoveries & Exploration Wells',
    role: 'Lead Subsurface Interpreter & Prospect Maturation',
    year: '2018',
    location: 'Malay Basin (Block PM304 / Cendor Graben Flank)',
    summary: 'Appraisal and exploration well targeting Group E and H15 clastic sandstone reservoirs near the Cendor Graben. Proved the shallowest flowing oil discovery recorded in the Malay Basin, demonstrating that bypassed shallow clastic reservoirs in a mature basin hold material producible hydrocarbons.',
    evidence: [
      'Wireline logs and production testing confirmed flowing oil in Group E and H15 clastic reservoirs',
      'Established the shallowest productive oil reservoir interval in the Malay Basin',
      'Calibrated structural and stratigraphic trapping models across the Cendor Graben margin'
    ],
    limits: 'Technical pack withheld.',
    link: 'https://geox.arif-fazil.com',
    linkLabel: 'Explore GEOX →'
  },
  {
    id: 'puteri-basement',
    title: 'PUTERI BASEMENT‑1',
    category: 'wells',
    categoryLabel: 'Discoveries & Exploration Wells',
    role: 'Structural Lead & Basement Prospect Maturation',
    year: '2020',
    location: 'Malay Basin, Offshore Peninsular Malaysia',
    summary: 'Basement-involved structural test designed to evaluate pre-Tertiary fractured granite reservoirs beneath basin fill. While the crystalline basement itself tested water-bearing (due to lack of charge timing or top seal breach), the well successfully discovered commercial hydrocarbons in the overlying K-5 sandstone reservoirs, yielding crucial calibration on basement charge risk and near-field asset valuation.',
    evidence: [
      'Hydrocarbon discovery confirmed in overlying K-5 sandstone reservoirs',
      'Basement interval confirmed granite/granodiorite and tested water-bearing, establishing critical charge/seal risk bounds',
      'De-risked adjacent structural trends and contributed to PM318 asset evaluation'
    ],
    limits: 'Subsurface sections withheld.',
    link: 'https://geox.arif-fazil.com/viewer/',
    linkLabel: 'Open Viewer →'
  },
  {
    id: 'lebah-emas-1',
    title: 'LEBAH EMAS‑1',
    category: 'wells',
    categoryLabel: 'Discoveries & Exploration Wells',
    role: 'Prospect Framing & Discovery Evaluation',
    year: '2025',
    location: 'Western Hinge Fault Zone, Malay Basin Margin · Block PM6/12',
    summary: 'Frontier wildcat exploration well targeting Group H, I, and J sandstone reservoirs along the structurally complex western hinge fault zone. Successfully proved a working petroleum system in the margin play, encountering 11 hydrocarbon-bearing intervals and opening a new hinge play fairway.',
    evidence: [
      '11 hydrocarbon-bearing intervals logged across Group H, I, and J sandstone targets (gas and oil)',
      'Opened a new hinge fault play fairway along the western margin of the Malay Basin',
      'Block PM6/12 subsequently included in commercial farm-out arrangements'
    ],
    limits: 'Full technical pack and internal ranking withheld.',
    link: 'https://geox.arif-fazil.com',
    linkLabel: 'Explore GEOX →'
  },
  {
    id: 'bunga-tasbih-1',
    title: 'BUNGA TASBIH‑1',
    category: 'wells',
    categoryLabel: 'Discoveries & Exploration Wells',
    role: 'Opportunity Evaluation & Post-Drill Risk Recalibration',
    year: '2024',
    location: 'Eastern Malay Basin Margin · Malaysia Bid Round Plus (MBR+)',
    summary: 'Exploration well evaluating syn-rift and post-rift plays on the eastern basin margin. While the primary syn-rift objective proved water-bearing, the well discovered commercial oil in post-rift Group I and J sands. The outcome demonstrated that the post-rift petroleum system was fully effective while providing crucial lessons that recalibrated syn-rift risk across the margin (later supporting an MBR+ Round I Small Field Asset PSC award).',
    evidence: [
      'Oil discovery confirmed in post-rift Group I and J reservoir sands',
      'Primary syn-rift objective tested water-bearing, providing crucial calibration to downgrade regional syn-rift risk',
      'Post-drill resource evaluation supported inclusion and award in MBR+ Round I Small Field Asset PSC (2024)'
    ],
    limits: 'Award-phase details withheld.',
    link: 'https://geox.arif-fazil.com',
    linkLabel: 'Explore GEOX →'
  },

  // ── 2. REGIONAL BASIN WORK & SYNTHESES ─────────────────────────────
  {
    id: 'malay-basin',
    title: 'Malay Basin Regional Synthesis',
    category: 'regional',
    categoryLabel: 'Regional Basin Work',
    role: 'Lead Regional Basin Synthesist',
    year: '2014–Present',
    location: 'Malay Basin, Peninsular Malaysia & Adjacent Waters',
    summary: 'A decade-long regional synthesis of the Malay Basin pull-apart rift system. Mapped key play fairways, decline-rate distributions, and structural controls on reservoir quality across deltaic sandstone targets.',
    evidence: [
      'Mapped regional depletion dynamics and mature field rejuvenation potential',
      'Integrated structural inversion, fault seal (SGR), and Group A→M stratigraphy synthesis',
      'Applied epistemic uncertainty and cognitive bias auditing to subsurface prospect mapping'
    ],
    limits: 'Internal technical detail withheld.',
    link: 'https://geox.arif-fazil.com/map/',
    linkLabel: 'Open Map →'
  },
  {
    id: 'sabah-basin-regional',
    title: 'Sabah Basin & Fold-Thrust Belt',
    category: 'regional',
    categoryLabel: 'Regional Basin Work',
    role: 'Regional Evaluator & Deepwater Structural Specialist',
    year: '2016–Present',
    location: 'Offshore NW Sabah, Deepwater Fold-Thrust Belt',
    summary: 'Regional tectono-stratigraphic synthesis of the Sabah deepwater margin. Evaluated post-MMU turbidite reservoirs, structural fold-thrust closures, and fluid pressure profiles.',
    evidence: [
      'Mapped distal turbidite fairway geometry and overpressure transition zones',
      'Evaluated collision-related wedge deformation and mass transport deposits',
      'Calibrated deepwater prospect risk matrices against regional well results'
    ],
    limits: 'Internal technical detail withheld.',
    link: 'https://geox.arif-fazil.com',
    linkLabel: 'Explore GEOX →'
  },
  {
    id: 'block-h-evaluation',
    title: 'Block H & Deepwater Margin',
    category: 'regional',
    categoryLabel: 'Regional Basin Work',
    role: 'Subsurface Evaluator & Margin Specialist',
    year: '2018–2022',
    location: 'Deepwater Sabah · Block H',
    summary: 'Subsurface evaluation and reservoir characterization of deepwater gas accumulations and turbidite channel systems in Block H.',
    evidence: [
      'Seismic amplitude interpretation and DHI conformance evaluation',
      'Turbidite channel architecture and reservoir connectivity modeling',
      'Supported commercial and volumetric maturation for deepwater development'
    ],
    limits: 'Internal technical detail withheld.',
    link: 'https://geox.arif-fazil.com',
    linkLabel: 'Explore GEOX →'
  },

  // ── 3. COMPUTATIONAL & AUTONOMOUS SYSTEMS ──────────────────────────
  {
    id: 'geox-engine',
    title: 'GEOX',
    category: 'systems',
    categoryLabel: 'Computational Systems',
    role: 'System Architect & Subsurface Domain Lead',
    year: '2024–Present',
    location: 'Sovereign Subsurface Intelligence Plane',
    summary: 'Earth-reasoning computational stack for subsurface exploration. Enforces evidence-first reasoning: raw seismic, well-log payloads, and lithology classifications are verified against public basin records before model confidence is minted.',
    evidence: [
      'Contrast-theory heatmaps processing raw seismic and well-log payloads',
      'Physics-9 witness architecture enforcing falsifiable prospect hypotheses',
      'Deterministic verification gates across well ingest, petrophysics, and geomechanics'
    ],
    limits: 'Internal technical detail withheld.',
    link: 'https://geox.arif-fazil.com',
    linkLabel: 'Launch GEOX Surface ↗'
  },
  {
    id: 'arifos-kernel',
    title: 'arifOS',
    category: 'systems',
    categoryLabel: 'Computational Systems',
    role: 'Creator & Sovereign Architect',
    year: '2024–Present',
    location: 'Constitutional Governance Layer',
    summary: 'Constitutional operating system for autonomous agents. Translates lessons from exploration geology under irreducible uncertainty into 13 formal constitutional floors (F1–F13) with absolute human veto (F13 SOVEREIGN).',
    evidence: [
      '13 constitutional floors (F1 Amanah to F13 Sovereign) with mathematical verification',
      '8 canonical kernel MCP verbs with Ed25519 cryptographic session leases',
      'Full open-source kernel published on PyPI and GitHub'
    ],
    limits: 'Internal technical detail withheld.',
    link: 'https://arifos.arif-fazil.com',
    linkLabel: 'Visit Observatory ↗'
  },
  {
    id: 'wealth-engine',
    title: 'WEALTH',
    category: 'systems',
    categoryLabel: 'Computational Systems',
    role: 'System Architect',
    year: '2025–Present',
    location: 'Capital Intelligence Plane',
    summary: 'Thermodynamic valuation engine built on 13 cash flow primitives, evaluating NPV, EMV, and capital entropy without narrative inflation.',
    evidence: [
      'NPV/EMV valuation engine grounded in audited financial statements',
      'Thermodynamic capital decay modeling and risk-weighted decision trees',
      'Federated MCP integration with governance guardrails'
    ],
    limits: 'Internal technical detail withheld.',
    link: 'https://wealth.arif-fazil.com',
    linkLabel: 'Explore WEALTH ↗'
  },
  {
    id: 'well-engine',
    title: 'WELL',
    category: 'systems',
    categoryLabel: 'Computational Systems',
    role: 'System Architect',
    year: '2025–Present',
    location: 'Vitality & Dignity Monitor',
    summary: 'Operator vitality mirror and substrate health monitor designed to protect human maruah (dignity) and metabolic homeostasis.',
    evidence: [
      'Passive telemetry tracking cognitive and metabolic pressure trends',
      'Strict read-only safety guarantees preventing automated feedback intrusion',
      'Dignity floor enforcement (F6) with sovereign privacy boundaries'
    ],
    limits: 'Internal technical detail withheld.',
    link: 'https://well.arif-fazil.com',
    linkLabel: 'Explore WELL ↗'
  },
  {
    id: 'aaa-cockpit',
    title: 'AAA',
    category: 'systems',
    categoryLabel: 'Computational Systems',
    role: 'Federation Architect',
    year: '2024–Present',
    location: 'Agent Federation Gateway',
    summary: 'Inter-agent operations surface and A2A gateway ensuring explicit, structural trust and HOLD/SEAL token issuance across all federation organs.',
    evidence: [
      'A2A gateway with bearer credential validation and capability gating',
      'Dynamic-state checks verifying live process port boundaries',
      'Multi-agent protocol governance and audit trail witness'
    ],
    limits: 'Internal technical detail withheld.',
    link: 'https://aaa.arif-fazil.com',
    linkLabel: 'Open AAA Cockpit ↗'
  }
];
