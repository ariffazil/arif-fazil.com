/**
 * Portfolio data — extracted first-party from ARIF_FAZIL_PETRONAS_PORTFOLIO_2026.pdf
 * SHA-256: d353606ae038705a0dee2dc6106ef84daae41fb7c3a7ba35ce03ae3dfe88dc81
 * 18 pages · WeasyPrint 70.0 · compiled 2026-10-02
 * Source set: 12 items (8 file-backed hash-listed; 1 owner testimony; 3 synthetic-figure classes)
 *
 * Every claim carries truth_class + publication_class.
 * No reserve/resource volumes, NPV/IRR/EMV, internal seismic, maps, coordinates, or well logs.
 * Reality > Everything.
 */

export type TruthClass =
  | 'DOCUMENTED'
  | 'SYNTHETIC_EXPLANATORY'
  | 'OPINION'
  | 'WITHHELD'

export type PublicationClass =
  | 'PUBLICATION_SAFE'
  | 'DOCUMENTED_PRIVATE'
  | 'PUBLIC_SOURCE'
  | 'EXCLUDED'
  | 'NEVER_REPRODUCED'

export interface Claim {
  id: string
  statement: string
  truth_class: TruthClass
  publication_class: PublicationClass
  source: string
  date?: string
  withheld_reason?: string
}

export interface FlagshipCase {
  id: string
  project: string
  year: string
  basin: string
  block?: string
  role: string
  problem: string
  earth_signal: string
  role_and_decision: string
  what_followed: string
  what_was_proven: string
  claim_ids: string[]
  publication_class: PublicationClass
  geox_link?: string
}

export interface CareerMilestone {
  date: string
  label: string
  evidence_ref: string
  truth_class: TruthClass
}

export interface PortfolioSection {
  id: string
  number: string
  title: string
  subtitle: string
  claim_ids: string[]
}

// ─── PDF METADATA ──────────────────────────────────────────────────────────
export const portfolioPdf = {
  title: 'Arif Fazil — Subsurface · Systems · Intelligence',
  filename: 'portfolio.pdf',
  path: '/work/exploration-2013-2026/portfolio.pdf',
  pages: 18,
  compiled: '2026-10-02',
  renderer: 'WeasyPrint 70.0',
  sha256: 'd353606ae038705a0dee2dc6106ef84daae41fb7c3a7ba35ce03ae3dfe88dc81',
  source_set_count: 12,
  note: 'Known defect: figure numbering out of sequence (07 → 09 → 08). PDF frozen as-is.',
}

// ─── HERO ──────────────────────────────────────────────────────────────────
export const heroData = {
  name: 'ARIF FAZIL',
  tagline: 'SUBSURFACE · SYSTEMS · INTELLIGENCE',
  years: '13',
  yearsLabel: 'YEARS EXPLORATION GEOSCIENCE',
  question: 'What does reality actually support?',
  affiliation: 'PETRONAS Carigali · Exploration Geoscience',
  location: 'Kuala Lumpur, Malaysia · 2013–2026',
}

// ─── 30-SECOND ARIF ────────────────────────────────────────────────────────
export const thirtySecondArif = {
  thesis: 'A subsurface geoscientist who learned to connect geology, uncertainty, evidence, human judgment and machine intelligence — not a geologist who used AI, and not an AI person who read a geology book.',
  pillars: [
    {
      id: 'earth',
      title: 'EARTH',
      body: 'Thirteen years reading the subsurface across the Malay Basin and offshore Sabah — seismic interpretation, structural and sequence stratigraphy, petroleum systems, prospect maturation. Work that has carried prospects from regional screening to drill-or-drop, including first-of-trend plays and honest close-outs.',
    },
    {
      id: 'decisions',
      title: 'DECISIONS',
      body: 'Depth in the part of exploration that is not about rock but about judgment under incomplete evidence: risking, volumetrics, value-of-information, and knowing when the data says stop. Has held subsurface accountability across a portfolio of operated platforms, not a single field.',
    },
    {
      id: 'systems',
      title: 'SYSTEMS',
      body: 'Turned that discipline into software. Author and architect of arifOS — a governance layer that checks a proposed AI action against constitutional constraints before it executes. An independent initiative; the same instinct that separates a checked interpretation from a persuasive one.',
    },
  ],
  stats: [
    { value: '13', label: 'YEARS EXPLORATION GEOSCIENCE' },
    { value: '2', label: 'BASIN THEATRES — MALAY & SABAH' },
    { value: '4+', label: 'WELLS NAMED IN THE PUBLIC RECORD' },
    { value: '1', label: 'INDEPENDENT KERNEL — PUBLISHED, LIVE' },
  ],
}

// ─── CAREER ARC ────────────────────────────────────────────────────────────
export const careerArc: CareerMilestone[] = [
  { date: '2009', label: 'PETRONAS scholarship awarded', evidence_ref: 'CV v2 (Sept 2026)', truth_class: 'DOCUMENTED' },
  { date: '2009–2013', label: 'Dual degree: Geology + Economics', evidence_ref: 'CV v2', truth_class: 'DOCUMENTED' },
  { date: '2013', label: 'Joined PETRONAS Carigali — Exploration Geoscience', evidence_ref: 'Career form (29 Sept 2026), on file', truth_class: 'DOCUMENTED' },
  { date: '2014–Present', label: 'Malay Basin regional synthesis — decade-long', evidence_ref: 'CV v2', truth_class: 'DOCUMENTED' },
  { date: '2016–Present', label: 'Sabah Basin & Fold-Thrust Belt regional evaluation', evidence_ref: 'CV v2', truth_class: 'DOCUMENTED' },
  { date: '2017', label: 'Puteri Basement-1 — originated play concept', evidence_ref: 'CV v2; ExxonMobil CV (Apr 2026)', truth_class: 'DOCUMENTED' },
  { date: '2024', label: 'Bekantan-1 — shallowest flowing oil discovery, Malay Basin', evidence_ref: 'CV v2; portfolio PDF (frozen 2026-10-02)', truth_class: 'DOCUMENTED' },
  { date: '2018–2022', label: 'Block H deepwater margin — subsurface evaluation', evidence_ref: 'CV v2', truth_class: 'DOCUMENTED' },
  { date: '2024', label: 'Kinabalu Basin Integrated Study — 88-well database', evidence_ref: 'CV v2; GEOX KL2 notes (Jun 2026)', truth_class: 'DOCUMENTED' },
  { date: '2024', label: 'Bunga Tasbih-1 — post-drill play assessment & close-out', evidence_ref: 'CV v2; ExxonMobil CV (Apr 2026)', truth_class: 'DOCUMENTED' },
  { date: '2024–Present', label: 'GEOX — Earth-reasoning computational stack', evidence_ref: 'GitHub ariffazil/GEOX', truth_class: 'DOCUMENTED' },
  { date: '2024–Present', label: 'arifOS — constitutional governance kernel (F1–F13)', evidence_ref: 'GitHub ariffazil/arifOS; PyPI', truth_class: 'DOCUMENTED' },
  { date: '2025', label: 'Lebah Emas-1 — 11 hydrocarbon-bearing intervals', evidence_ref: 'CV v2', truth_class: 'DOCUMENTED' },
  { date: '2026-06', label: 'KL2 time-depth review — independent biostratigraphic correction', evidence_ref: 'GEOX KL2 eureka notes', truth_class: 'DOCUMENTED' },
  { date: '2026-09', label: 'Career form v2 — Executive Geoscientist; Principal = target', evidence_ref: 'Career form (29 Sept 2026)', truth_class: 'DOCUMENTED' },
]

export const careerArcNarrative = {
  held: 'A consistent technical spine — read the data, hold the interpretation, carry it to a decision. Across regime changes, price cycles and reorganisations, the constant is depth in one theatre rather than breadth across many.',
  grown: 'From prospect-level work to portfolio-scale accountability, then to systems: transferable reasoning, governance of data, and finally a discipline applied to machine intelligence itself.',
}

// ─── WHERE THE WORK LIVES ──────────────────────────────────────────────────
export const theatres = [
  {
    id: 'malay-basin',
    name: 'MALAY BASIN',
    description: 'Mature, well-drilled, and therefore unforgiving — the place where a model is tested fastest and where superficial understanding is least survivable. Bekantan-1, Lebah Emas-1, Bunga Tasbih-1 and the basement play concept sit here.',
    geox_link: '/earth/malay-basin/',
    geox_label: 'Explore Malay Basin →',
  },
  {
    id: 'offshore-sabah',
    name: 'OFFSHORE SABAH',
    description: 'Frontier and deepwater — sparse data, high consequence, structurally complex. The Kinabalu Basin integrated study, the Layang-Layang outboard evaluation area, the inherited dry-hole corpus, and platform subsurface assurance all belong to this theatre.',
    geox_link: '/earth/kinabalu-basin/',
    geox_label: 'Explore Kinabalu Basin →',
  },
]

// ─── FLAGSHIP CASES ────────────────────────────────────────────────────────
export const flagshipCases: FlagshipCase[] = [
  {
    id: 'lebah-emas-1',
    project: 'LEBAH EMAS-1',
    year: '2025',
    basin: 'Malay Basin',
    block: 'Western hinge fault zone',
    role: 'Senior Exploration Geoscientist · Prospect-to-Well Lead',
    problem: 'Mature Malay Basin acreage where the standing view had already mapped the productive fairway. The question was whether a stacked-sand architecture — the kind modelled on the Gulf of Thailand play — could be demonstrated at the prospect location.',
    earth_signal: 'Seismic amplitude and motif analysis combined with well-tie calibration pointed to a multi-storey clastic system with more hydrocarbon-bearing intervals than the initial model had allowed for.',
    role_and_decision: 'Led the integrated interpretation — seismic, petrophysics, structural — and retained authorship across the evaluation cycle. Recommended the well; supported the regulatory and authorisation path to spud.',
    what_followed: 'The well carried eleven hydrocarbon-bearing reservoirs, confirming the stacked-sand architecture and adding a new reference case for the play going forward.',
    what_was_proven: 'Multi-reservoir prospect maturation, and the ability to hold an interpretation all the way to a live decision.',
    claim_ids: ['C05', 'C06'],
    publication_class: 'PUBLICATION_SAFE',
    geox_link: 'https://geox.arif-fazil.com',
  },
  {
    id: 'bekantan-1',
    project: 'BEKANTAN-1',
    year: '2024',
    basin: 'Malay Basin',
    block: 'Cendor Graben flank',
    role: 'Exploration Geoscientist · Prospect Generation',
    problem: 'The shallow section of the play had been treated as below the working oil horizon — effectively a closed question. Testing it meant arguing against the standing portfolio view.',
    earth_signal: 'A four-way anticline trap in the shallow Miocene section became interpretable once the charge model was rebuilt. Basin modelling — not optimism — is what made the case.',
    role_and_decision: 'Identified the trap, ran the charge risk assessment, prepared the prospect risking matrix, and recommended the well location.',
    what_followed: 'The well established the shallowest oil accumulation tested in the Malay Basin at the time, and reframed the depth-horizon model for the play.',
    what_was_proven: 'Willingness to test a basin model the portfolio had already closed — the harder half of exploration.',
    claim_ids: ['C07'],
    publication_class: 'PUBLICATION_SAFE',
    geox_link: 'https://geox.arif-fazil.com',
  },
  {
    id: 'kinabalu-ibs',
    project: 'KINABALU BASIN INTEGRATED STUDY',
    year: '2024',
    basin: 'Offshore Sabah',
    role: 'Integrated Study · Regional Framework Author',
    problem: 'Sparse, conflicting datasets across a structurally complex frontier basin. Regional questions had no shared reference framework — every team was reading from a different map.',
    earth_signal: 'Compiling an 88-well database exposed a seismic-motif signature that mapped a new play indicator. It also surfaced contested biostratigraphic questions that could not be left unresolved if the framework was to hold.',
    role_and_decision: 'Compiled the database, identified the motif, and drove the contested biostratigraphic questions to a documented position — a written answer, not an assumption carried forward.',
    what_followed: 'A regional framework that could be handed over as a working system — the kind of artifact that keeps a team aligned years after the author has moved on.',
    what_was_proven: 'Integrating sparse, conflicting datasets into a regional model — and naming the gaps rather than papering over them.',
    claim_ids: ['C08'],
    publication_class: 'PUBLICATION_SAFE',
    geox_link: '/earth/kinabalu-basin/',
  },
  {
    id: 'puteri-basement-1',
    project: 'PUTERI BASEMENT-1',
    year: '2017',
    basin: 'Malay Basin',
    role: 'Exploration Geoscientist · Play Originator',
    problem: 'Basement was not part of the accepted portfolio in this basin — no template, no analogue, no standing prospect. Generating it meant building the case from first principles.',
    earth_signal: 'Integrated aerogravity, seismic and well data supported a pre-salt play concept targeting a fractured basement reservoir. Pre-stack depth migration was required to place the target correctly.',
    role_and_decision: 'Originated the play concept and its evaluation. Characterised the specific risks a basement test carries — lithology, charge, top seal — rather than transferring clastic-play assumptions onto a different system.',
    what_followed: 'A first basement test in the trend, and a documented risk characterisation that outlives the well itself.',
    what_was_proven: 'Generating a new play outside the accepted template — the rarer skill in a mature organisation.',
    claim_ids: ['C09'],
    publication_class: 'PUBLICATION_SAFE',
    geox_link: 'https://geox.arif-fazil.com/viewer/',
  },
  {
    id: 'bunga-tasbih-1',
    project: 'BUNGA TASBIH-1',
    year: '2024',
    basin: 'Malay Basin',
    block: 'Eastern basin margin',
    role: 'Lead Geoscientist · Post-Drill Play Assessment',
    problem: 'The play was marginal, and the expected temptation after a costly well is to extend it on narrative rather than close it on evidence. That temptation is the quiet source of much wasted capital.',
    earth_signal: 'The prospect had been generated from MBR+ (mass-balance residual) mapping, with a sequence-stratigraphic framework used to identify a turbidite fairway. Post-drill, that framework had to be held to account.',
    role_and_decision: 'Co-authored the well proposal and the G&G authorisation documentation, then led the post-drill assessment that closed the marginal play on the evidence rather than extending it.',
    what_followed: 'A disciplined close-out — the kind that protects capital later. In exploration, the willingness to say stop is worth more than the willingness to say drill, and it is much rarer in a career record.',
    what_was_proven: 'Honest portfolio close-outs. The discipline that makes the successes credible.',
    claim_ids: ['C10', 'C11'],
    publication_class: 'PUBLICATION_SAFE',
    geox_link: 'https://geox.arif-fazil.com',
  },
  {
    id: 'dry-hole-corpus',
    project: 'INHERITED DRY-HOLE CORPUS',
    year: '2016–Present',
    basin: 'Offshore Sabah',
    block: 'Outboard fairway (multiple blocks)',
    role: 'Subsurface Assurance · Prospect-Risk Calibration',
    problem: 'Six inherited dry holes — Solisip, Pekaka, Maligan, Kudat, Balambangan, Kalutan — plus the early-career Wakid-3 deepwater evaluation, sat in the record as failures with no shared calibration value.',
    earth_signal: 'Auditing wells that did not find hydrocarbons is how a fairway\'s real risk profile is discovered. Each dry hole is an anchor case for the outboard prospect in the Kinabalu fairway.',
    role_and_decision: 'Audited the inherited corpus into calibrated anchor cases for outboard prospect risk — converting historical failure into usable decision input.',
    what_followed: 'A risk model grounded in this basin\'s own history rather than a generic analogue — and a documented instance of treating failure as evidence, not as something to be quietly buried.',
    what_was_proven: 'Converting historical failure into downstream decision value.',
    claim_ids: ['C12'],
    publication_class: 'PUBLICATION_SAFE',
    geox_link: 'https://geox.arif-fazil.com',
  },
]

// ─── UNCERTAINTY ───────────────────────────────────────────────────────────
export const uncertaintyData = {
  title: 'Uncertainty as a Technical Skill',
  subtitle: 'How a model actually changes.',
  example: 'The 2026 KL2 time-depth review is the clearest example in the record of something more useful than being right the first time: knowing when the data has contradicted you, and saying so in writing.',
  flow: [
    { step: 'EVIDENCE', description: 'The signal that was easy to miss — in the KL2 well dataset, one well carries a literal "SYNTHETIC" label in its header row.' },
    { step: 'INTERPRETATION', description: 'A deviated well in the same dataset needs a ray-traced time-depth correction, not a straight-line vertical projection.' },
    { step: 'CHALLENGE', description: 'An independent biostratigraphic check from the EGRS domain specialist confirmed the correction cascade.' },
    { step: 'NEW DATA', description: 'The deviation that mattered — a difference of several milliseconds, which in a thin reservoir is the difference between a target and a miss.' },
    { step: 'REVISED MODEL', description: 'The correction cascade documented in writing, not absorbed silently.' },
    { step: 'DECISION', description: 'Details like this decide wells.' },
  ],
  principles: [
    'Risk is not pessimism. It is the price of the information you do not yet have.',
    'Value of information. The most expensive data is the data you bought too late to change a decision.',
    'Reversibility as a design goal. Prefer the interpretation that can be re-opened.',
    'The result always wins. The well is the only witness that cannot be argued with.',
  ],
}

// ─── HUMAN TRANSFER ────────────────────────────────────────────────────────
export const humanTransfer = {
  thesis: 'Expertise is the reasoning, made transferable.',
  body: 'The answer is the smallest part of what a senior geoscientist carries. What matters is whether the reasoning behind it can survive the person leaving the room — and whether the next person can re-open it when the data changes.',
  mentoring: {
    title: 'MENTORING, BOTH DIRECTIONS',
    body: 'Thirteen years of Malay Basin to pass on — and still a great deal to learn from people who read the same data differently. The stated development priority is not more breadth; it is having interpretations read and tested, which is the only thing that sharpens a geologist.',
  },
  handover: {
    title: 'HANDOVER AS CRAFT',
    body: 'A handover is done properly when the person receiving the portfolio understands what they are receiving — the model, the caveats, the open questions, the decision history. Not a file dump. A working surface that the next person can stand on.',
  },
}

// ─── AI + GEOSCIENCE ───────────────────────────────────────────────────────
export const aiGeoscience = {
  title: 'An amplifier, not a replacement.',
  carries: 'Exploration teaches one durable habit: a model\'s confidence is not evidence, and the cheapest error is the one caught before the bit turns. Applied to machine intelligence, that habit becomes a governance layer — an action checked against constraints before it runs.',
  doesNot: 'AI does not replace geological judgment — it makes the cost of unstructured judgment higher, because output arrives faster and in more volume. The discipline of knowing which model to trust is more valuable in an AI-augmented workflow, not less.',
  stages: [
    'Manual interpretation',
    'Digital workflow',
    'AI-assisted analysis',
    'Governed agentic intelligence',
  ],
  arifOS_note: 'arifOS is an independent personal initiative. It is not an employer project, and nothing in this section is affiliated with or derived from PETRONAS work.',
}

// ─── REALITY MANIFESTO ─────────────────────────────────────────────────────
export const realityManifesto = {
  lines: [
    'The map is not the basin.',
    'The seismic is not the geology.',
    'The model is not the reservoir.',
    'The AI is not the judgment.',
  ],
  closing: 'Every representation is useful only while it remains answerable to reality.',
  tag: 'WORKING PRINCIPLE · APPLIED DAILY SINCE 2013',
}

// ─── NEXT HORIZON ──────────────────────────────────────────────────────────
export const nextHorizon = {
  depth: {
    title: 'DEPTH',
    body: 'Deeper geoscience in one theatre, not surface-level across many. Interpretation that can be tested, tested again, and handed over intact. The stated target is the technical ladder, at the principal-geoscientist level — the work of being the reference point a team brings a seismic line to.',
  },
  systems: {
    title: 'SYSTEMS',
    body: 'The governance instinct is not a hobby — it is what happens when a discipline built on uncertainty is applied to any system that makes decisions under incomplete evidence. That includes AI systems, and it will include the next one.',
  },
  transfer: {
    title: 'TRANSFER',
    body: 'Making the reasoning transferable is not a soft skill appended to the technical work; it is part of the technical work. A framework that cannot be handed over is not finished.',
  },
  current_title: 'Executive Geoscientist',
  target_title: 'Principal Geoscientist',
  title_note: 'Current documented title is Executive Geoscientist. "Principal" appears here only as the named target on the technical ladder (career form, 29 Sept 2026), never as a claim of having held the title.',
}

// ─── CLAIMS ────────────────────────────────────────────────────────────────
export const claims: Claim[] = [
  { id: 'C01', statement: '13 years exploration geoscience, 2013–2026', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'CV v2 (Sept 2026); career form (29 Sept 2026)' },
  { id: 'C02', statement: '2 basin theatres — Malay Basin & offshore Sabah', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'CV v2 selected exploration record' },
  { id: 'C03', statement: '4+ wells named in the public record', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'CV v2; well names are published identifiers' },
  { id: 'C04', statement: '1 independent kernel — published, live (arifOS)', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'GitHub ariffazil/arifOS; PyPI published' },
  { id: 'C05', statement: 'Lebah Emas-1: eleven hydrocarbon-bearing reservoirs across Group H, I, J sandstone targets', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'CV v2 selected exploration record' },
  { id: 'C06', statement: 'Lebah Emas-1: opened new hinge play fairway; acreage subsequently entered commercial farm-out', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'CV v2; farm-out is public record' },
  { id: 'C07', statement: 'Bekantan-1: shallowest oil accumulation tested in the Malay Basin', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'CV v2 selected exploration record' },
  { id: 'C08', statement: 'Kinabalu Basin IBS: 88-well database compiled into one defensible model', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'CV v2; GEOX KL2 eureka notes (Jun 2026)' },
  { id: 'C09', statement: 'Puteri Basement-1: originated play concept targeting fractured basement reservoir', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'CV v2; ExxonMobil CV (Apr 2026)' },
  { id: 'C10', statement: 'Bunga Tasbih-1: commercial oil in post-rift Group I and J sands', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'CV v2; ExxonMobil CV (Apr 2026)' },
  { id: 'C11', statement: 'Bunga Tasbih-1: supported MBR+ Round I Small Field Asset PSC award (2024)', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'CV v2; public bid round record' },
  { id: 'C12', statement: 'Inherited dry-hole corpus: Solisip, Pekaka, Maligan, Kudat, Balambangan, Kalutan + Wakid-3', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'CV v2 names all seven wells' },
  { id: 'C13', statement: 'KL2 time-depth review (Jun 2026): independent biostratigraphic check confirmed correction cascade', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'GEOX KL2 eureka notes' },
  { id: 'C14', statement: 'Current title: Executive Geoscientist. Principal = named target on technical ladder.', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'Career form (29 Sept 2026)' },
  { id: 'C15', statement: 'Source set: 12 items — 8 file-backed hash-listed; 1 owner testimony; 3 synthetic-figure classes', truth_class: 'DOCUMENTED', publication_class: 'PUBLICATION_SAFE', source: 'PDF reproducibility section' },
]

export const claimsWithheld = [
  { id: 'W01', considered: '100% exploration success / zero dry wells', disposition: 'NOT CLAIMED', reason: 'Public record itself names dry holes (Wakid-3 and six inherited wells).' },
  { id: 'W02', considered: 'Discovery leader / 20% cycle reduction', disposition: 'NOT CLAIMED', reason: 'No document in the source set substantiates the numbers.' },
  { id: 'W03', considered: 'Reserve / resource volumes', disposition: 'EXCLUDED', reason: 'Not publication-safe. No GIIP, STOIIP, or recovery figure.' },
  { id: 'W04', considered: 'Economic outcomes (NPV / IRR / EMV)', disposition: 'EXCLUDED', reason: 'Commercial figures not publication-safe.' },
  { id: 'W05', considered: 'Internal maps, seismic, well logs, coordinates', disposition: 'NEVER REPRODUCED', reason: 'Confidential by default.' },
  { id: 'W06', considered: 'Title: Principal Geoscientist', disposition: 'FRAMED AS TARGET', reason: 'Documented title is Executive Geoscientist. Principal is the named next-ladder target only.' },
  { id: 'W07', considered: 'Institutional matters (restructuring, exit process)', disposition: 'PRIVATE', reason: 'Technical career record. Employment-process detail excluded by design.' },
]
