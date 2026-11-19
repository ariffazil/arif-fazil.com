import { machineNav, primaryNav, secondaryNav } from './navCanon';

export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type WellItem = {
  name: string;
  playType: string;
  basin: string;
  summary: string;
  role: string;
  impact: string;
  publicStatus: string;
  sourceLabel: string;
  sourceHref: string;
  placeholderLabel?: string;
};

export type SystemProject = {
  title: string;
  role: string;
  status: 'LIVE' | 'MIXED' | 'SCAFFOLD';
  summary: string;
  artifactLabel: string;
  artifactHref: string;
  surfaceLabel: string;
  surfaceHref: string;
  placeholderLabel?: string;
};

// Primary / civic / machine nav — DERIVED from web-canon via navCanon.ts.
// Do not diverge. Edit /root/web-canon/canon/navigation.json only.
export const primaryLinks: LinkItem[] = primaryNav.map(({ label, href, external }) => ({
  label,
  href,
  external,
}));

// Civic shelf — secondary live surfaces (politics, VITALS, map, …)
export const civicLinks: LinkItem[] = secondaryNav.map(({ label, href, external }) => ({
  label,
  href,
  external,
}));

// Machine doors — footer / agent strip
export const machineLinks: LinkItem[] = machineNav.map(({ label, href, external }) => ({
  label,
  href,
  external,
}));

// Plain — no scores, no stats, no framing
export const trustStrip = [
  'PETRONAS Carigali, offshore Malaysia',
  'Geology, geophysics, and a bit of economics',
  'I build things when the work calls for it',
];

export const scaleLegend = [
  'This page is for humans',
  '/000 is for AI and agents — notes and context',
  '/999 is verification and machine-facing content',
];

export const wellsPortfolio: WellItem[] = [
  {
    name: 'BEKANTAN-1',
    playType: 'Shallow Clastic Reservoir / Appraisal',
    basin: 'Malay Basin (Block PM304)',
    summary: 'Appraisal/exploration well targeting Group E and H15 clastic sands near Cendor Graben.',
    role: 'Lead Subsurface Interpreter & Prospect Maturation.',
    impact: 'Proved the shallowest flowing oil discovery recorded in the Malay Basin. Proved bypassed shallow clastic pay in a mature basin setting.',
    publicStatus: 'public record',
    sourceLabel: 'GitHub',
    sourceHref: 'https://github.com/ariffazil',
    placeholderLabel: 'Technical pack withheld',
  },
  {
    name: 'PUTERI BASEMENT-1',
    playType: 'Fractured Basement Play Test',
    basin: 'Malay Basin',
    summary: 'Evaluated pre-Tertiary fractured granite reservoirs beneath sedimentary basin fill.',
    role: 'Structural Lead & Basement Prospect Maturation.',
    impact: 'Basement tested water-bearing (defining charge/seal risk bounds), but discovered commercial hydrocarbons in overlying K-5 sands. De-risked subsequent PM318 evaluations.',
    publicStatus: 'public record',
    sourceLabel: 'GitHub',
    sourceHref: 'https://github.com/ariffazil',
    placeholderLabel: 'Subsurface sections withheld',
  },
  {
    name: 'LEBAH EMAS-1',
    playType: 'Western Hinge Margin Wildcat',
    basin: 'Offshore Terengganu · Block PM6/12',
    summary: 'Frontier wildcat targeting Group H, I, and J sandstone reservoirs along the western hinge fault zone.',
    role: 'Prospect Framing & Discovery Evaluation.',
    impact: 'Logged 11 hydrocarbon-bearing intervals (oil and gas), confirming a working petroleum system and opening a new hinge play fairway along the basin margin. Block later included in commercial farm-out.',
    publicStatus: 'public record — scar documented',
    sourceLabel: 'GitHub',
    sourceHref: 'https://github.com/ariffazil',
    placeholderLabel: 'Full technical pack and internal ranking withheld',
  },
  {
    name: 'BUNGA TASBIH-1',
    playType: 'Syn-Rift Test / Post-Rift Discovery',
    basin: 'Eastern Malay Basin Margin · MBR+',
    summary: 'Exploration well evaluating syn-rift and post-rift plays.',
    role: 'Opportunity Evaluation & Post-Drill Risk Recalibration.',
    impact: 'Primary syn-rift target tested water-bearing, but post-rift I and J sands proved commercial oil. Reshaped margin prospectivity and supported 2024 MBR+ Small Field Asset PSC award.',
    publicStatus: 'public record',
    sourceLabel: 'GitHub',
    sourceHref: 'https://github.com/ariffazil',
    placeholderLabel: 'Award-phase details withheld',
  },
];

export const practiceAreas = [
  'Basin analysis and prospect work under real uncertainty.',
  'Structural interpretation and reading signals in noisy data.',
  'Decisions where knowing what you don\'t know matters more than the model.',
];

export const publicRecord = [
  'Worked in Sabah and Malay Basin at PETRONAS Carigali.',
  'Education: geology/geophysics and economics, UW–Madison.',
  'Built arifOS because the geology work demanded it.',
];

export const systemProjects: SystemProject[] = [
  {
    title: 'arifOS',
    role: 'Constitutional AI kernel · F1–F13 floors',
    status: 'LIVE',
    summary:
      'Philosophy: Sovereign human veto must be absolute. Engineering: Pre-execution constraints validate all dynamic tool leases. Verification: Live cognitive test harness verifies 42/42 validation floors.',
    artifactLabel: 'Constitution',
    artifactHref: 'https://arifos.arif-fazil.com/constitution.json',
    surfaceLabel: 'Observatory',
    surfaceHref: 'https://arifos.arif-fazil.com',
  },
  {
    title: 'GEOX',
    role: 'Earth intelligence · Physics-9 witness',
    status: 'LIVE',
    summary:
      'Philosophy: Subsurface evidence precedes model confidence. Engineering: Contrast theory heatmaps process raw seismic and well-log payloads. Verification: Core lithology classification tests validated against public basin records.',
    artifactLabel: 'App registry',
    artifactHref: 'https://geox.arif-fazil.com/apps.json',
    surfaceLabel: 'GEOX surface',
    surfaceHref: 'https://geox.arif-fazil.com',
  },
  {
    title: 'WEALTH',
    role: 'Capital intelligence · NPV / EMV engine',
    status: 'LIVE',
    summary:
      'Philosophy: Capital obeys thermodynamic limits, not narratives. Engineering: NPV/EMV valuation engine built on 13 cash flow primitives. Verification: Historical pipeline runs audited against verified bursa financial statements.',
    artifactLabel: 'Tool registry',
    artifactHref: 'https://aaa.arif-fazil.com/mcp/tools.json',
    surfaceLabel: 'Daily briefing',
    surfaceHref: '/wealth/',
  },
  {
    title: 'AAA',
    role: 'Coordination surface · A2A handoff',
    status: 'LIVE',
    summary:
      'Philosophy: Coordination attends — it does not judge. Engineering: Agent cards, skills mesh, and A2A handoff envelopes under bearer credentials. Verification: Dynamic-state checks verify process live port bounds.',
    artifactLabel: 'Endpoint metadata',
    artifactHref: 'https://aaa.arif-fazil.com/mcp/endpoint.json',
    surfaceLabel: 'AAA cockpit',
    surfaceHref: 'https://aaa.arif-fazil.com',
  },
  {
    title: 'WELL',
    role: 'Vitality mirror · Substrate health monitor',
    status: 'LIVE',
    summary:
      'Philosophy: Technology must protect operator dignity, not bypass it. Engineering: Passive telemetry surfaces cognitive and metabolic pressure trends. Verification: Read-only check guarantees prevent any automated feedback execution.',
    artifactLabel: 'Health endpoint',
    artifactHref: 'https://well.arif-fazil.com/health',
    surfaceLabel: 'WELL surface',
    surfaceHref: 'https://well.arif-fazil.com',
  },
  {
    title: 'A-FORGE',
    role: 'Metabolic shell · Engineering actuator',
    status: 'LIVE',
    summary:
      'Philosophy: Execution has no independent legislative authority. Engineering: Strict task graphs execute mutations only when a valid SEAL is present. Verification: Local git status and build checks run automatically before deployment.',
    artifactLabel: 'Health endpoint',
    artifactHref: 'https://forge.arif-fazil.com/health',
    surfaceLabel: 'A-FORGE surface',
    surfaceHref: 'https://forge.arif-fazil.com',
  },
];

// ── Human-scale links (for arif-fazil.com footer only) ──────────────
// MCP registry listings, full organ directory, and config snippets
// live at mcp.arif-fazil.com — not on the human homepage.
export const contactLinks: LinkItem[] = [
  { label: 'GitHub / ariffazil', href: 'https://github.com/ariffazil', external: true },
  { label: 'Telegram / ariffazil', href: 'https://t.me/ariffazil', external: true },
  { label: 'Email', href: 'mailto:arifbfazil@gmail.com', external: true },
];
