/**
 * realityAtlas.ts — Canonical Ontology & Knowledge Graph for Arif Reality Atlas
 *
 * ARCHITECTURAL LAW:
 * Layer A (Visible Navigation): 8 Human-Intuitive Domains (Human, Institution, Earth, Economics, Intelligence, Civilization, Physics, Universe)
 * Layer B (Engine Room / Eigenvector Graph): 5 Reality Primitives (Reality, Witness, Governance, Consequence, Continuity)
 * Layer C (Nodes): Canonical Eurekas acting as cross-domain eigenvectors
 * Layer D (Evidence / Substrate): Physical, market, subsurface, and organizational witness objects
 *
 * "The Eurekas are coherent. The topology is not.
 *  You already have the stars. This file weaves the constellation."
 */

export type RealityPrimitiveId = 'reality' | 'witness' | 'governance' | 'consequence' | 'continuity';

export interface RealityPrimitive {
  id: RealityPrimitiveId;
  label: string;
  question: string;
  essence: string;
  accentColor: string;
}

export const REALITY_PRIMITIVES: Record<RealityPrimitiveId, RealityPrimitive> = {
  reality: {
    id: 'reality',
    label: 'Reality',
    question: 'What is actually happening?',
    essence: 'The objective substrate that constrains all models, beliefs, and predictions.',
    accentColor: '#38BDF8', // Cyan / Sky
  },
  witness: {
    id: 'witness',
    label: 'Witness',
    question: 'How do we know?',
    essence: 'Verification without narrative; evidence with verifiable provenance before judgment.',
    accentColor: '#F59E0B', // Amber
  },
  governance: {
    id: 'governance',
    label: 'Governance',
    question: 'What constrains behavior?',
    essence: 'Constitutional boundaries, invariants, and structural dignity floors.',
    accentColor: '#E4572E', // Ember / Terracotta
  },
  consequence: {
    id: 'consequence',
    label: 'Consequence',
    question: 'Who pays the bill?',
    essence: 'Risk, skin in the game, entropy costs, and scars that cannot be externalized.',
    accentColor: '#EF4444', // Red
  },
  continuity: {
    id: 'continuity',
    label: 'Continuity',
    question: 'What survives?',
    essence: 'Substrate endurance, autonomous learning loops, memory, and generational truth.',
    accentColor: '#10B981', // Emerald
  },
};

export type RealityDomainId =
  | 'human'
  | 'institution'
  | 'earth'
  | 'economics'
  | 'intelligence'
  | 'civilization'
  | 'physics'
  | 'universe';

export interface RealityDomain {
  id: RealityDomainId;
  label: string;
  subtitle: string;
  description: string;
  icon: string;
  accent: string;
  canonicalPath: string;
}

export const REALITY_DOMAINS: Record<RealityDomainId, RealityDomain> = {
  human: {
    id: 'human',
    label: 'Human',
    subtitle: 'Attention, Dignity & Biological Invariants',
    description: 'Attention preservation, identity metabolism, grief, somatic truth, and the human sovereign.',
    icon: '👤',
    accent: '#F472B6',
    canonicalPath: '/reality#human',
  },
  institution: {
    id: 'institution',
    label: 'Institution',
    subtitle: 'Trust, Mandate & Adaptation Gaps',
    description: 'PETRONAS, national corporations, governance architectures, and systemic adaptation.',
    icon: '🏛️',
    accent: '#38BDF8',
    canonicalPath: '/institution/',
  },
  earth: {
    id: 'earth',
    label: 'Earth',
    subtitle: 'Subsurface Geology, Basins & Physical Wells',
    description: 'Malay Basin, deepwater turbidites, seismic inversion, and 13+ years of reading incomplete rock records.',
    icon: '🌍',
    accent: '#E4572E',
    canonicalPath: '/earth/',
  },
  economics: {
    id: 'economics',
    label: 'Economics',
    subtitle: 'Commodities, Capital & Fiscal Realities',
    description: 'Oil, gas, gold, national debt, currency dynamics, and cash versus asset barrels.',
    icon: '💰',
    accent: '#F59E0B',
    canonicalPath: '/economics',
  },
  intelligence: {
    id: 'intelligence',
    label: 'Intelligence',
    subtitle: 'AI Runtimes, Autonomous Systems & Agency',
    description: 'Bounded agents, runtime versus weights, autonomous understanding, and capability graphs.',
    icon: '⚡',
    accent: '#A855F7',
    canonicalPath: '/reality#intelligence',
  },
  civilization: {
    id: 'civilization',
    label: 'Civilization',
    subtitle: 'Culture, Sinks & Institutional Churn',
    description: 'Calhoun behavioral sinks, civic intelligence (MakcikGPT), and cultural resilience.',
    icon: '🌐',
    accent: '#34D399',
    canonicalPath: '/reality#civilization',
  },
  physics: {
    id: 'physics',
    label: 'Physics',
    subtitle: 'Entropy, Thermodynamics & Constraints',
    description: 'Governance physics, dissipative systems, thermodynamic limits, and constraint over intelligence.',
    icon: '⚛️',
    accent: '#60A5FA',
    canonicalPath: '/reality#physics',
  },
  universe: {
    id: 'universe',
    label: 'Universe',
    subtitle: 'Cosmic Horizons, Horizons & Emergence',
    description: 'Deep time horizons, ultimate survivability, emergence, and unknown bounds.',
    icon: '🌌',
    accent: '#818CF8',
    canonicalPath: '/reality#universe',
  },
};

export interface EvidenceRef {
  title: string;
  type: 'subsurface_well' | 'market_terminal' | 'telemetry' | 'field_data' | 'fiscal_vitals';
  uri: string;
  summary: string;
}

export interface EurekaNode {
  id: string;
  title: string;
  primitive: RealityPrimitiveId;
  domains: RealityDomainId[];
  thesis: string;
  questionItAnswers: string;
  status: 'CANONICAL' | 'ACTIVE' | 'SEALED';
  keyEvidence: EvidenceRef[];
  relatedNodes: string[];
}

export const EUREKA_NODES: EurekaNode[] = [
  // ── 1. REALITY PRIMITIVE ──────────────────────────────────────────
  {
    id: 'reality-alignment',
    title: 'Reality Alignment',
    primitive: 'reality',
    domains: ['human', 'intelligence', 'physics'],
    thesis: 'Reality constrains every model. Never protect a model, doctrine, or prompt from contradictory empirical evidence.',
    questionItAnswers: 'What is actually happening?',
    status: 'SEALED',
    keyEvidence: [
      {
        title: 'Macrostrat & USGS Seismic Feed',
        type: 'field_data',
        uri: '/earth/',
        summary: 'Live empirical rock measurements and plate tectonic boundary feeds.',
      },
    ],
    relatedNodes: ['attention-reality', 'witness-void', 'consequence-binding'],
  },
  {
    id: 'attention-reality',
    title: 'Attention Reality',
    primitive: 'reality',
    domains: ['human', 'economics', 'civilization'],
    thesis: 'Human attention is the ultimate scarce thermodynamic resource (W888). Asking humans HOW is an attention leak.',
    questionItAnswers: 'Where does human cognitive value genuinely concentrate?',
    status: 'CANONICAL',
    keyEvidence: [
      {
        title: 'MakcikGPT Public Inquiries',
        type: 'field_data',
        uri: '/world/makcikgpt/',
        summary: 'Democratizing complex fiscal issues into direct, attention-preserving civic answers.',
      },
    ],
    relatedNodes: ['reality-alignment', 'consequence-binding', 'calhoun-sink'],
  },
  {
    id: 'human-eureka-kernel',
    title: 'Human Reality Invariants',
    primitive: 'reality',
    domains: ['human', 'civilization'],
    thesis: 'Biological, grief, family, and dignity bounds are invariants, not variables to be optimized away by synthetic systems.',
    questionItAnswers: 'What human boundaries are non-negotiable?',
    status: 'SEALED',
    keyEvidence: [
      {
        title: 'Chrono-Epigenetic DunedinPACE',
        type: 'telemetry',
        uri: '/about',
        summary: 'Measuring biological aging pace against chronological time.',
      },
    ],
    relatedNodes: ['attention-reality', 'scar-gravity'],
  },

  // ── 2. WITNESS PRIMITIVE ──────────────────────────────────────────
  {
    id: 'witness-void',
    title: 'Witness Void & Zero Filtering',
    primitive: 'witness',
    domains: ['institution', 'intelligence', 'earth'],
    thesis: 'Witness reports reality as observed without narrative smoothing. "No data" does not mean "all clear" — it means "cannot witness".',
    questionItAnswers: 'How do we know what is true versus what is narrative?',
    status: 'CANONICAL',
    keyEvidence: [
      {
        title: 'PETRONAS Vitals: Cash vs Tank',
        type: 'fiscal_vitals',
        uri: '/vitals/',
        summary: 'First-party financial balance sheet contrasted with barrel replenishment horizons.',
      },
    ],
    relatedNodes: ['reality-alignment', 'amanah-gap', 'registry-witness'],
  },
  {
    id: 'tri-witness-test',
    title: 'Tri-Witness Diversity Protocol',
    primitive: 'witness',
    domains: ['intelligence', 'physics'],
    thesis: 'Consensus is not truth. Three agents agreeing on inherited unverified assumptions is correlated error, not verification.',
    questionItAnswers: 'How do we prevent synthetic hallucinations from cascading?',
    status: 'SEALED',
    keyEvidence: [
      {
        title: 'Multi-Model Calibration Matrix',
        type: 'telemetry',
        uri: '/map/',
        summary: 'Blind independent falsification across distinct model weights and reasoning paths.',
      },
    ],
    relatedNodes: ['witness-void', 'runtime-not-model'],
  },

  // ── 3. GOVERNANCE PRIMITIVE ───────────────────────────────────────
  {
    id: 'registry-witness',
    title: 'Registry Witness Governance',
    primitive: 'governance',
    domains: ['institution', 'civilization'],
    thesis: 'Govern capabilities, not intentions. A capability is verified only through working receipts, not declarative claims.',
    questionItAnswers: 'What should constrain institutional and agentic behavior?',
    status: 'CANONICAL',
    keyEvidence: [
      {
        title: 'Sovereign Token Registry',
        type: 'telemetry',
        uri: '/laws/',
        summary: 'Deterministic constitutional authority boundaries F1 through F13.',
      },
    ],
    relatedNodes: ['amanah-gap', 'consequence-binding', 'witness-void'],
  },
  {
    id: 'amanah-gap',
    title: 'The AMANAH Gap',
    primitive: 'governance',
    domains: ['institution', 'economics'],
    thesis: 'The systemic divergence between fiduciary duty declared on paper and actual resource allocation under bureaucratic entropy.',
    questionItAnswers: 'Why do large institutions lose adaptation velocity?',
    status: 'ACTIVE',
    keyEvidence: [
      {
        title: 'National Oil Extraction Horizons',
        type: 'fiscal_vitals',
        uri: '/vitals/',
        summary: 'Audited annual reports versus forward replacement reserves.',
      },
    ],
    relatedNodes: ['registry-witness', 'consequence-binding', 'calhoun-sink'],
  },
  {
    id: 'governance-physics',
    title: 'AI Governance Physics',
    primitive: 'governance',
    domains: ['physics', 'intelligence', 'civilization'],
    thesis: 'Governance is a thermodynamic problem: maintaining order without absorbing so much friction that the system suffocates.',
    questionItAnswers: 'How to maintain constitutional safety without bureaucratic collapse?',
    status: 'CANONICAL',
    keyEvidence: [
      {
        title: 'Dissipative System Logs',
        type: 'telemetry',
        uri: '/canon/',
        summary: 'Entropy tracking and metabolic verification across federated organs.',
      },
    ],
    relatedNodes: ['registry-witness', 'apex-theory'],
  },

  // ── 4. CONSEQUENCE PRIMITIVE ─────────────────────────────────────
  {
    id: 'consequence-binding',
    title: 'Consequence Binding',
    primitive: 'consequence',
    domains: ['economics', 'human', 'intelligence', 'institution'],
    thesis: 'Intelligence without consequences is vanity. Systems must possess skin in the game, where errors cost real resources.',
    questionItAnswers: 'Who pays the bill when models or decisions fail?',
    status: 'SEALED',
    keyEvidence: [
      {
        title: 'Exploration Drilling Portfolio',
        type: 'subsurface_well',
        uri: '/work',
        summary: 'Bekantan-1, Lebah Emas-1, Puteri Basement-1 — drilling decisions with multimillion dollar consequence.',
      },
    ],
    relatedNodes: ['scar-gravity', 'governance-gap', 'reality-alignment'],
  },
  {
    id: 'scar-gravity',
    title: 'Scar Gravity & Memory',
    primitive: 'consequence',
    domains: ['human', 'intelligence', 'institution'],
    thesis: 'Past failures that cost blood, capital, or trust must exert gravitational pull on future decisions to prevent repeat errors.',
    questionItAnswers: 'How does experience transform into structural wisdom?',
    status: 'CANONICAL',
    keyEvidence: [
      {
        title: 'Subsurface Exploration Post-Mortems',
        type: 'field_data',
        uri: '/earth/',
        summary: 'Uncommercial basement drill tests calibrating regional charge risk.',
      },
    ],
    relatedNodes: ['consequence-binding', 'capability-reality'],
  },
  {
    id: 'apex-theory',
    title: 'APEX Theory of Action',
    primitive: 'consequence',
    domains: ['physics', 'intelligence', 'economics'],
    thesis: 'Optimize for maximum truthful uncertainty reduction with beneficial consequence, per minimum entropy and human attention wasted.',
    questionItAnswers: 'What is the mathematical definition of BIJAKSANA?',
    status: 'SEALED',
    keyEvidence: [
      {
        title: 'APEX Sovereign Metric Logs',
        type: 'telemetry',
        uri: '/canon/',
        summary: 'Bijaksana ratio evaluation across federated agent execution.',
      },
    ],
    relatedNodes: ['consequence-binding', 'governance-physics'],
  },
  {
    id: 'calhoun-sink',
    title: 'Calhoun Institutional Behavioral Sink',
    primitive: 'consequence',
    domains: ['civilization', 'institution'],
    thesis: 'Hyper-specialized role saturation without truth contact leads to self-referential bureaucratic death spirals.',
    questionItAnswers: 'What causes societal and corporate institutional decay?',
    status: 'ACTIVE',
    keyEvidence: [
      {
        title: 'Political Economy & Election Analysis',
        type: 'field_data',
        uri: '/world/politics/',
        summary: 'Electoral dynamics, constituency patronage networks, and reform bottlenecks.',
      },
    ],
    relatedNodes: ['amanah-gap', 'attention-reality'],
  },

  // ── 5. CONTINUITY PRIMITIVE ──────────────────────────────────────
  {
    id: 'capability-reality',
    title: 'Capability Reality & Provenance',
    primitive: 'continuity',
    domains: ['intelligence', 'institution'],
    thesis: 'Declared capability does not equal working capability. A capability is alive only if its artifact and test resolve right now.',
    questionItAnswers: 'What survives beyond rhetoric and declarative claims?',
    status: 'CANONICAL',
    keyEvidence: [
      {
        title: 'Organ Liveliness Telemetry',
        type: 'telemetry',
        uri: '/organs/',
        summary: 'Live health probes and deterministic verification of all federation services.',
      },
    ],
    relatedNodes: ['runtime-not-model', 'registry-witness'],
  },
  {
    id: 'runtime-not-model',
    title: 'Runtime > Model Weights',
    primitive: 'continuity',
    domains: ['intelligence', 'physics'],
    thesis: 'Raw model weights are commodities. Value and truth live in the runtime harness, grounding loops, and verification gates.',
    questionItAnswers: 'Why do foundation models fail in real-world deployment?',
    status: 'SEALED',
    keyEvidence: [
      {
        title: 'Commodity Trading Engine Two-Rail Test',
        type: 'market_terminal',
        uri: '/gold',
        summary: 'Deterministic signal calibration vs probabilistic LLM forecasts.',
      },
    ],
    relatedNodes: ['capability-reality', 'tri-witness-test'],
  },
];

export interface GraphEdge {
  source: string;
  target: string;
  relation: 'CONSTRAINS' | 'GROUNDS' | 'MEASURES' | 'SURVIVES_IN';
}

export const GRAPH_EDGES: GraphEdge[] = [
  { source: 'reality-alignment', target: 'witness-void', relation: 'GROUNDS' },
  { source: 'witness-void', target: 'registry-witness', relation: 'CONSTRAINS' },
  { source: 'registry-witness', target: 'consequence-binding', relation: 'CONSTRAINS' },
  { source: 'consequence-binding', target: 'capability-reality', relation: 'SURVIVES_IN' },
  { source: 'attention-reality', target: 'consequence-binding', relation: 'GROUNDS' },
  { source: 'amanah-gap', target: 'witness-void', relation: 'MEASURES' },
  { source: 'runtime-not-model', target: 'capability-reality', relation: 'GROUNDS' },
  { source: 'scar-gravity', target: 'consequence-binding', relation: 'MEASURES' },
  { source: 'governance-physics', target: 'apex-theory', relation: 'CONSTRAINS' },
  { source: 'calhoun-sink', target: 'amanah-gap', relation: 'MEASURES' },
];
