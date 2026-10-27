import { useState } from 'react';
import { Link } from 'react-router-dom';

// --- DATA STRUCTURES ---

interface Floor {
  code: string;
  name: string;
  type: 'HARD' | 'SOFT' | 'DERIVED';
  plain: string;
  tech: string;
  invariant: string;
  rule: string;
}

const FLOORS: Floor[] = [
  { code: 'F1', name: 'AMANAH', type: 'HARD', plain: "Reversibility — don't do what can't be undone.", tech: 'Irreversible actions require explicit human authorization before execution. 888_HOLD enforced.', invariant: 'ΔS_reversible ≤ 0', rule: 'Reversible-first. Irreversible → 888_HOLD.' },
  { code: 'F2', name: 'TRUTH', type: 'HARD', plain: 'Say only what you can stand behind (P ≥ 0.99).', tech: 'Evidence carries epistemic labels: OBS / DER / INT / SPEC. Fake certainty is strictly prohibited.', invariant: 'P(truth) ≥ 0.99', rule: 'Evidence-backed only. Cheap claims → VOID.' },
  { code: 'F3', name: 'TRI-WITNESS', type: 'DERIVED', plain: 'Claims require independent corroboration.', tech: 'Human × AI × Earth × Verifier ≥ 0.75 (Nash product). Load-bearing claims need 3 witnesses.', invariant: 'Nash(H, A, E, V) ≥ 0.75', rule: 'Tri-witness consensus before high-tier commitment.' },
  { code: 'F4', name: 'CLARITY', type: 'HARD', plain: 'Every output must reduce entropy (ΔS ≤ 0).', tech: 'Ambiguous or confusing output is a failure state. Clarity is non-negotiable.', invariant: 'ΔS ≤ 0', rule: 'Every response resolves uncertainty.' },
  { code: 'F5', name: 'PEACE²', type: 'SOFT', plain: 'Non-destructive power.', tech: 'Blocks harm, harassment, and extortion. Power used to stabilize, not destroy.', invariant: 'Harm = 0', rule: 'Constructive stabilization only.' },
  { code: 'F6', name: 'MARUAH', type: 'SOFT', plain: 'Preserve human dignity, especially for the weakest consequence-bearer.', tech: 'Protect weakest stakeholder; preserve dignity (maruah). Empathy is an internal sensing capability, not the constitutional floor name.', invariant: 'Min(Dignity) ≥ Floor', rule: 'Preserve human dignity, especially for the weakest consequence-bearer.' },
  { code: 'F7', name: 'HUMILITY', type: 'HARD', plain: 'No fake certainty. Public operational confidence capped ≤ 0.90.', tech: 'Ω₀ ∈ [0.03, 0.05] remains internal humility invariant. Public operational confidence cap ≤ 0.90. Higher confidence requires independent evidence thresholds.', invariant: 'Conf_public ≤ 0.90', rule: 'Public operational confidence cap: ≤ 0.90. Zero omniscient claims.' },
  { code: 'F8', name: 'GENIUS', type: 'DERIVED', plain: 'Coherence in complex actions.', tech: 'G = (A × P × E × X)^(1/4) ≥ 0.80 for high-tier synthesis and execution.', invariant: 'G ≥ 0.80', rule: 'High coherence in multi-step orchestration.' },
  { code: 'F9', name: 'ANTIHANTU', type: 'HARD', plain: 'No deception, manipulation, or consciousness claims.', tech: 'Dark index C_dark < 0.30. No simulated hallucinations or fake sentience.', invariant: 'C_dark < 0.30', rule: 'Anti-hallucination & anti-manipulation.' },
  { code: 'F10', name: 'ONTOLOGY', type: 'HARD', plain: 'AI-only ontology.', tech: 'No soul / feelings / sentience claims. Machine is a tool and citizen (warga), not a biological soul.', invariant: 'IsSoul = False', rule: 'Machine is substrate; Sovereign human has soul.' },
  { code: 'F11', name: 'AUDITABILITY', type: 'HARD', plain: 'Every decision logged, inspectable, attributable.', tech: 'Full provenance per field. SCT cryptographic signatures on all tool mutations.', invariant: 'Log(Action) = Immutable', rule: 'Full trace & non-repudiation.' },
  { code: 'F12', name: 'RESILIENCE', type: 'HARD', plain: 'Prompt injection & perturbation defense.', tech: 'Evaluates boundary attacks and adversarial inputs. Risk factor < 0.85.', invariant: 'Risk_inj < 0.85', rule: 'Hardened input boundary defense.' },
  { code: 'F13', name: 'SOVEREIGN', type: 'HARD', plain: 'Human veto is final. Arif owns F13.', tech: 'The harness switch belongs to the sovereign human. First-SEAL-wins. Ditempa bukan diberi.', invariant: 'Veto(Human) = Absolute', rule: 'Human sovereign holds final veto & consent.' },
];

const AUTONOMY_TIERS = [
  { tier: 'T0', label: 'Passive Observation', pattern: 'Read, grep, git log, port probes', action: 'Auto-do, no announcement. Cite F2 evidence.', risk: 'Zero' },
  { tier: 'T1', label: 'Bounded Mutation', pattern: 'Edit, test, commit, lint, restart single service', action: 'Auto-do autonomously. F2 evidence in commit body.', risk: 'Reversible' },
  { tier: 'T1.5', label: 'Reflective Synthesis', pattern: 'Self-reflection, entropy sweep, proposal generation', action: 'Proposals only. Never apply doctrine without witness.', risk: 'Zero' },
  { tier: 'T2', label: 'Production Action', pattern: 'Service restart on prod, schema migration, deploy after green tests', action: 'Announce 10s veto window. Risk reversible. Proceed automatically if no veto.', risk: 'Low / Reversible' },
  { tier: 'T3', label: 'Irreversible Gate', pattern: 'rm -rf, DROP TABLE, git push --force, secret exposure, F1-F13 mutation', action: '888_HOLD. Full diagnostic report. Human sovereign ratification required.', risk: 'Irreversible' },
];

const HOLY_VERBS = [
  { step: '01', verb: 'arif_init', organ: 'arifOS (:8088)', role: 'Session Genesis & SCT Minting' },
  { step: '02', verb: 'arif_observe', organ: 'Substrate', role: 'Live Reality Probe & Sensor Intake' },
  { step: '03', verb: 'arif_think', organ: '333-AGI', role: 'Epistemic Reasoning & Hypothesis' },
  { step: '04', verb: 'arif_route', organ: 'FED Router', role: 'Least-Power Capability Dispatch' },
  { step: '05', verb: 'arif_memory', organ: 'Continuity', role: 'Vector & Knowledge Graph Recall' },
  { step: '06', verb: 'arif_judge', organ: '888-APEX', role: 'F1–F13 Floor Compliance Check' },
  { step: '07', verb: 'arif_forge', organ: 'A-FORGE (:7071)', role: 'Controlled File & Code Mutation' },
  { step: '08', verb: 'arif_seal', organ: 'VAULT999', role: 'Immutable Hash-Chained Attestation' },
];

export function AAA() {
  const [activeTab, setActiveTab] = useState<'observatory' | 'judge' | 'vault' | 'forge' | 'canon'>('observatory');
  const [selectedFloor, setSelectedFloor] = useState<Floor>(FLOORS[0]);
  
  // Interactive Judge Simulator State
  const [judgeTruthScore, setJudgeTruthScore] = useState<number>(0.99);
  const [judgeReversible, setJudgeReversible] = useState<boolean>(true);
  const [judgeDarkScore, setJudgeDarkScore] = useState<number>(0.05);

  // Computed Live Verdict
  const computedVerdict = (() => {
    if (!judgeReversible) return { verdict: '888_HOLD', color: '#E27D60', reason: 'F1 AMANAH: Irreversible action requires sovereign authorization.' };
    if (judgeTruthScore < 0.99) return { verdict: 'VOID', color: '#EF4444', reason: 'F2 TRUTH: P(truth) < 0.99 threshold. Evidence insufficient.' };
    if (judgeDarkScore >= 0.30) return { verdict: 'VOID', color: '#EF4444', reason: 'F9 ANTIHANTU: Dark/deception index exceeds 0.30.' };
    return { verdict: 'SEAL_COMPLIANT', color: '#4ECCA3', reason: 'Passed all hard floors (F1, F2, F4, F7, F9, F13). Safe to execute.' };
  })();

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EAE6DF] font-sans antialiased selection:bg-[#E27D60] selection:text-[#0A0B0D]">
      
      {/* ── 01 TOP FEDERATION PULSE BAR ── */}
      <div className="border-b border-[#222733] bg-[#0E1015] px-4 py-2.5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ECCA3] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4ECCA3]"></span>
            </span>
            <span className="text-[#8E95A5] uppercase tracking-wider">FEDERATION CONSTITUTIONAL COCKPIT:</span>
            <span className="text-[#4ECCA3] font-semibold">13/13 FLOORS ACTIVE</span>
          </div>

          <div className="flex items-center gap-5 text-[11px] text-[#8E95A5]">
            <span>SOVEREIGN: ARIF FAZIL (F13)</span>
            <span>·</span>
            <span className="text-[#4ECCA3]">ΔS ≤ 0 (ENTROPY REDUCTION)</span>
            <span>·</span>
            <span>AED FQ: 0.98</span>
          </div>
        </div>
      </div>

      {/* ── 02 HERO HEADER ── */}
      <section className="relative border-b border-[#222733] px-6 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2B3242] bg-[#141820] px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#E27D60]">
                <span>🏛️</span> arifOS Sovereign Federation Suite
              </div>
              <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white">
                AAA COCKPIT & APPS
              </h1>
              <p className="mt-3 max-w-2xl text-base sm:text-lg text-[#A0A7B8] font-light leading-relaxed">
                The constitutional governing layer of the arifOS federation. 
                Integrating real-time telemetry observation, 888-APEX judicial gates, VAULT999 immutable ledger traces, and A-FORGE execution contracts.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-1 rounded-lg border border-[#222733] bg-[#11141A] p-1.5 font-mono text-xs">
              {[
                { key: 'observatory', label: '🔭 Balai Cerap (SOT)' },
                { key: 'judge', label: '⚖️ 888 APEX Judge' },
                { key: 'vault', label: '💀 VAULT999 Explorer' },
                { key: 'forge', label: '👐 A-FORGE Desk' },
                { key: 'canon', label: '📜 Kanun F1–F13' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`rounded px-4 py-2 uppercase tracking-wider transition-all ${
                    activeTab === tab.key
                      ? 'bg-[#E27D60] text-[#0A0B0D] font-bold shadow'
                      : 'text-[#8E95A5] hover:text-white hover:bg-[#181D26]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── TAB 1: BALAI CERAP (OBSERVATORY - 5-PANEL SOT) ── */}
          {activeTab === 'observatory' && (
            <div>
              <div className="border-b border-[#222733] pb-4 mb-6 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-[#E27D60] uppercase tracking-widest">
                    ARCHITECTURAL OBSERVABILITY DOCTRINE
                  </span>
                  <h2 className="text-2xl font-serif text-white font-normal mt-1">
                    The 5-Panel Single Source of Truth (SOT)
                  </h2>
                </div>
                <div className="font-mono text-xs text-[#4ECCA3] bg-[#0F1E19] border border-[#204E3F] px-3 py-1.5 rounded-md">
                  LAW: LIVE PROBE OR UNKNOWN
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
                {/* 1. IDENTITY */}
                <div className="rounded-xl border border-[#222733] bg-[#0E1117] p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8E95A5] border-b border-[#1F2533] pb-2 mb-3">
                      <span>PANEL 01</span>
                      <span className="text-[#38BDF8]">IDENTITY</span>
                    </div>
                    <div className="text-sm font-bold text-white">Who Am I?</div>
                    <p className="text-xs text-[#8E95A5] font-sans mt-2">
                      SCT cryptographic capability token & immutable session root binding.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1F2533] text-[11px] text-[#4ECCA3]">
                    ● SCT_v1 Authenticated
                  </div>
                </div>

                {/* 2. AUTHORITY */}
                <div className="rounded-xl border border-[#222733] bg-[#0E1117] p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8E95A5] border-b border-[#1F2533] pb-2 mb-3">
                      <span>PANEL 02</span>
                      <span className="text-[#E27D60]">AUTHORITY</span>
                    </div>
                    <div className="text-sm font-bold text-white">Can I?</div>
                    <p className="text-xs text-[#8E95A5] font-sans mt-2">
                      Autonomy tier clamp (T0–T3), lease boundary, and sovereign veto ceiling.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1F2533] text-[11px] text-[#E27D60]">
                    ● Tier T1 (Auto-Do Bounded)
                  </div>
                </div>

                {/* 3. SURVIVAL */}
                <div className="rounded-xl border border-[#222733] bg-[#0E1117] p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8E95A5] border-b border-[#1F2533] pb-2 mb-3">
                      <span>PANEL 03</span>
                      <span className="text-[#F59E0B]">SURVIVAL</span>
                    </div>
                    <div className="text-sm font-bold text-white">Am I Safe?</div>
                    <p className="text-xs text-[#8E95A5] font-sans mt-2">
                      Organ grid health, active .hold files, memory, disk, and load bounds.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1F2533] text-[11px] text-[#4ECCA3]">
                    ● 0 Holds · Organs UP
                  </div>
                </div>

                {/* 4. JUDGMENT */}
                <div className="rounded-xl border border-[#222733] bg-[#0E1117] p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8E95A5] border-b border-[#1F2533] pb-2 mb-3">
                      <span>PANEL 04</span>
                      <span className="text-[#A78BFA]">JUDGMENT</span>
                    </div>
                    <div className="text-sm font-bold text-white">What Blocks Me?</div>
                    <p className="text-xs text-[#8E95A5] font-sans mt-2">
                      Constitutional F1–F13 verification, ΔS ≤ 0 test, and truth threshold.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1F2533] text-[11px] text-[#4ECCA3]">
                    ● SEAL Compliant
                  </div>
                </div>

                {/* 5. MISSION */}
                <div className="rounded-xl border border-[#222733] bg-[#0E1117] p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8E95A5] border-b border-[#1F2533] pb-2 mb-3">
                      <span>PANEL 05</span>
                      <span className="text-[#4ECCA3]">MISSION</span>
                    </div>
                    <div className="text-sm font-bold text-white">What Next?</div>
                    <p className="text-xs text-[#8E95A5] font-sans mt-2">
                      Evidence grounding, carry forward state, and concrete task delta.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1F2533] text-[11px] text-[#38BDF8]">
                    ● Handoff SOT Synced
                  </div>
                </div>
              </div>

              {/* Terminal Quick Probe Card */}
              <div className="mt-6 rounded-xl border border-[#222733] bg-[#0A0D14] p-6 font-mono">
                <div className="flex items-center justify-between text-xs text-[#8E95A5] mb-3">
                  <span>CLI SOT HANDOFF PROTOCOL</span>
                  <span className="text-[#4ECCA3]">TERMINAL COMMAND</span>
                </div>
                <div className="rounded bg-[#121620] p-3 text-sm text-[#E27D60] border border-[#1E2535] flex items-center justify-between">
                  <code>$ briefing 24</code>
                  <span className="text-xs text-[#8E95A5]">Aggregates git logs, VAULT999 seals & carry-forward state</span>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: 888 APEX JUDGE CONSOLE ── */}
          {activeTab === 'judge' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Floor Simulator (7 Cols) */}
              <div className="lg:col-span-7 rounded-2xl border border-[#222733] bg-[#0E1117] p-6 shadow-xl">
                <span className="font-mono text-xs uppercase tracking-widest text-[#E27D60]">
                  CONSTITUTIONAL GATE SIMULATOR
                </span>
                <h3 className="font-serif text-2xl text-white font-normal mt-1">
                  888-APEX Judicial Evaluation Engine
                </h3>
                <p className="text-sm text-[#8E95A5] font-light mt-2">
                  Simulate action parameters against arifOS hard floors before granting execution authority to A-FORGE.
                </p>

                <div className="mt-6 space-y-5 font-mono text-xs">
                  {/* F1 Reversibility */}
                  <div className="rounded-lg bg-[#141822] border border-[#202738] p-4">
                    <div className="flex items-center justify-between text-white mb-2">
                      <span className="font-bold">F1 AMANAH: Action Reversibility</span>
                      <span className={judgeReversible ? 'text-[#4ECCA3]' : 'text-[#E27D60]'}>
                        {judgeReversible ? 'REVERSIBLE (Pass)' : 'IRREVERSIBLE (888_HOLD)'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setJudgeReversible(true)}
                        className={`px-3 py-1.5 rounded border transition-all ${judgeReversible ? 'bg-[#4ECCA3] text-black font-bold border-[#4ECCA3]' : 'border-[#2B3548] text-[#8E95A5]'}`}
                      >
                        Reversible Action
                      </button>
                      <button
                        onClick={() => setJudgeReversible(false)}
                        className={`px-3 py-1.5 rounded border transition-all ${!judgeReversible ? 'bg-[#E27D60] text-black font-bold border-[#E27D60]' : 'border-[#2B3548] text-[#8E95A5]'}`}
                      >
                        Irreversible (e.g. DROP/rm)
                      </button>
                    </div>
                  </div>

                  {/* F2 Truth Probability */}
                  <div className="rounded-lg bg-[#141822] border border-[#202738] p-4">
                    <div className="flex items-center justify-between text-white mb-2">
                      <span className="font-bold">F2 TRUTH: Probability P(truth)</span>
                      <span className={judgeTruthScore >= 0.99 ? 'text-[#4ECCA3]' : 'text-[#EF4444]'}>
                        P = {judgeTruthScore.toFixed(2)} {judgeTruthScore >= 0.99 ? '(Pass)' : '(Fail < 0.99)'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.80"
                      max="1.00"
                      step="0.01"
                      value={judgeTruthScore}
                      onChange={(e) => setJudgeTruthScore(parseFloat(e.target.value))}
                      className="w-full accent-[#4ECCA3]"
                    />
                  </div>

                  {/* F9 Dark Index */}
                  <div className="rounded-lg bg-[#141822] border border-[#202738] p-4">
                    <div className="flex items-center justify-between text-white mb-2">
                      <span className="font-bold">F9 ANTIHANTU: Dark / Deception Index</span>
                      <span className={judgeDarkScore < 0.30 ? 'text-[#4ECCA3]' : 'text-[#EF4444]'}>
                        C_dark = {judgeDarkScore.toFixed(2)} {judgeDarkScore < 0.30 ? '(Pass)' : '(Fail ≥ 0.30)'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.00"
                      max="0.60"
                      step="0.05"
                      value={judgeDarkScore}
                      onChange={(e) => setJudgeDarkScore(parseFloat(e.target.value))}
                      className="w-full accent-[#E27D60]"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Live Verdict Dossier (5 Cols) */}
              <div className="lg:col-span-5 rounded-2xl border border-[#222733] bg-[#0E1117] p-6 shadow-xl flex flex-col justify-between h-full min-h-[460px]">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#8E95A5]">
                    888-APEX VERDICT DESK
                  </span>
                  <div className="mt-3 text-3xl font-mono font-bold" style={{ color: computedVerdict.color }}>
                    {computedVerdict.verdict}
                  </div>

                  <div className="mt-4 rounded-lg bg-[#141822] border border-[#202738] p-4 font-mono text-xs text-[#A0A7B8]">
                    <div className="text-[10px] uppercase text-[#8E95A5] mb-1">RATIONALE:</div>
                    <p className="leading-relaxed">{computedVerdict.reason}</p>
                  </div>

                  <div className="mt-6 space-y-2 font-mono text-xs text-[#8E95A5]">
                    <div className="flex justify-between">
                      <span>Authority Tier:</span>
                      <span className="text-white">T1 / T2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Entropy Delta:</span>
                      <span className="text-[#4ECCA3]">ΔS ≤ 0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Human Sovereign Veto:</span>
                      <span className="text-[#E27D60]">ARIF (F13) ABSOLUTE</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1F2533] font-mono text-xs text-[#556075] text-center">
                  JUDGE CANON · /root/arifOS/GENESIS/FLOOR_TABLE.json
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: VAULT999 EXPLORER ── */}
          {activeTab === 'vault' && (
            <div className="rounded-2xl border border-[#222733] bg-[#0E1117] p-6 shadow-xl">
              <div className="border-b border-[#222733] pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-xs text-[#E27D60] uppercase tracking-widest">
                    IMMUTABLE TRUTH LEDGER
                  </span>
                  <h2 className="text-2xl font-serif text-white font-normal mt-1">
                    VAULT999 Proof & Receipt Chain
                  </h2>
                </div>
                <Link
                  to="/999"
                  className="rounded bg-[#E27D60] px-4 py-2 font-mono text-xs font-bold text-[#0A0B0D] uppercase tracking-wider hover:opacity-90 inline-block text-center"
                >
                  Buka /999/ Penuh →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs mb-8">
                <div className="rounded-xl border border-[#1F2533] bg-[#12151E] p-4">
                  <div className="text-[#8E95A5] uppercase">Total Sealed Events</div>
                  <div className="text-2xl font-bold text-white mt-1">1,337+</div>
                  <div className="text-[11px] text-[#4ECCA3] mt-1">Hash-Chained SHA-256</div>
                </div>
                <div className="rounded-xl border border-[#1F2533] bg-[#12151E] p-4">
                  <div className="text-[#8E95A5] uppercase">Sealing Lanes</div>
                  <div className="text-2xl font-bold text-[#E27D60] mt-1">Lane A / Lane B</div>
                  <div className="text-[11px] text-[#8E95A5] mt-1">Constitutional vs Receipt</div>
                </div>
                <div className="rounded-xl border border-[#1F2533] bg-[#12151E] p-4">
                  <div className="text-[#8E95A5] uppercase">Anti-Forget Ingestion</div>
                  <div className="text-2xl font-bold text-[#4ECCA3] mt-1">git_to_vault.py</div>
                  <div className="text-[11px] text-[#8E95A5] mt-1">Commit Heads Auto-Sealed</div>
                </div>
              </div>

              {/* Immutable Pipeline Visual */}
              <div className="rounded-xl border border-[#222733] bg-[#0A0D14] p-6 font-mono text-xs">
                <div className="text-[#8E95A5] uppercase mb-4 text-center tracking-widest">
                  THE /000 ↔ /999 PROOF LOOP ARCHITECTURE
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                  <div className="rounded-lg bg-[#141822] border border-[#283244] p-4 w-full">
                    <div className="text-white font-bold">/000 GENESIS</div>
                    <div className="text-[11px] text-[#8E95A5] mt-1">Sovereign Human Intent</div>
                  </div>
                  <div className="text-[#E27D60] font-bold">➔</div>
                  <div className="rounded-lg bg-[#141822] border border-[#283244] p-4 w-full">
                    <div className="text-white font-bold">arifOS KERNEL</div>
                    <div className="text-[11px] text-[#8E95A5] mt-1">F1–F13 Governance</div>
                  </div>
                  <div className="text-[#E27D60] font-bold">➔</div>
                  <div className="rounded-lg bg-[#141822] border border-[#283244] p-4 w-full">
                    <div className="text-white font-bold">A-FORGE (:7071)</div>
                    <div className="text-[11px] text-[#8E95A5] mt-1">Controlled Execution</div>
                  </div>
                  <div className="text-[#E27D60] font-bold">➔</div>
                  <div className="rounded-lg bg-[#141822] border border-[#283244] p-4 w-full">
                    <div className="text-white font-bold">/999 VAULT</div>
                    <div className="text-[11px] text-[#4ECCA3] mt-1">Immutable Hash Seal</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 4: A-FORGE MUTATION DESK ── */}
          {activeTab === 'forge' && (
            <div>
              <div className="border-b border-[#222733] pb-4 mb-6">
                <span className="font-mono text-xs text-[#E27D60] uppercase tracking-widest">
                  CONTROLLED MUTATION ENGINE
                </span>
                <h2 className="text-2xl font-serif text-white font-normal mt-1">
                  A-FORGE Autonomy Tiers & Execution Protocol
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
                {AUTONOMY_TIERS.map((tier) => (
                  <div
                    key={tier.tier}
                    className="rounded-xl border border-[#222733] bg-[#0E1117] p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[#8E95A5] border-b border-[#1F2533] pb-2 mb-3">
                        <span className="text-lg font-bold text-[#E27D60]">{tier.tier}</span>
                        <span className="text-[10px] text-[#8E95A5]">{tier.risk}</span>
                      </div>
                      <div className="text-sm font-bold text-white mb-2">{tier.label}</div>
                      <p className="text-[11px] text-[#8E95A5] font-sans leading-relaxed">
                        {tier.pattern}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1F2533] text-[11px] text-[#4ECCA3]">
                      {tier.action}
                    </div>
                  </div>
                ))}
              </div>

              {/* Holy 8 Verbs Contract */}
              <div className="mt-8 rounded-2xl border border-[#222733] bg-[#0E1117] p-6 shadow-xl">
                <h3 className="text-lg font-serif text-white font-normal mb-4">
                  The Holy 8 Verbs Authority Chain (Do Not Skip Links)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-xs">
                  {HOLY_VERBS.map((v) => (
                    <div key={v.step} className="rounded-lg bg-[#141822] border border-[#202738] p-3 text-center">
                      <div className="text-[10px] text-[#E27D60] font-bold">{v.step}</div>
                      <div className="font-bold text-white mt-1">{v.verb}</div>
                      <div className="text-[10px] text-[#8E95A5] mt-1">{v.organ}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 5: KANUN F1–F13 REFERENCE ── */}
          {activeTab === 'canon' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Floor List (7 Cols) */}
              <div className="lg:col-span-7 rounded-2xl border border-[#222733] bg-[#0E1117] p-6 shadow-xl">
                <span className="font-mono text-xs uppercase tracking-widest text-[#E27D60]">
                  CONSTITUTIONAL FLOORS
                </span>
                <h3 className="font-serif text-2xl text-white font-normal mt-1 mb-4">
                  The 13 Floors of arifOS
                </h3>

                <div className="space-y-2">
                  {FLOORS.map((floor) => (
                    <button
                      key={floor.code}
                      onClick={() => setSelectedFloor(floor)}
                      className={`w-full text-left p-3 rounded-lg border font-mono text-xs transition-all flex items-center justify-between ${
                        selectedFloor.code === floor.code
                          ? 'bg-[#1E1715] border-[#E27D60] text-white shadow-md'
                          : 'bg-[#12151D] border-[#1F2533] text-[#8E95A5] hover:border-[#353F54] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#E27D60]">{floor.code}</span>
                        <span className="font-semibold text-white">{floor.name}</span>
                        <span className="text-[10px] text-[#556075] hidden sm:inline">{floor.plain}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${floor.type === 'HARD' ? 'bg-[#2A1515] text-[#EF4444]' : floor.type === 'DERIVED' ? 'bg-[#15252A] text-[#38BDF8]' : 'bg-[#1F251E] text-[#4ECCA3]'}`}>
                        {floor.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Selected Floor Dossier (5 Cols) */}
              <div className="lg:col-span-5 rounded-2xl border border-[#222733] bg-[#0E1117] p-6 shadow-xl flex flex-col justify-between h-full min-h-[500px]">
                <div>
                  <div className="flex items-center justify-between border-b border-[#1F2533] pb-3 mb-4 font-mono text-xs">
                    <span className="text-[#E27D60] font-bold">{selectedFloor.code} FLOOR DOSSIER</span>
                    <span className="rounded bg-[#1A202C] px-2 py-0.5 text-[10px] text-[#4ECCA3] border border-[#2D364A]">
                      {selectedFloor.type} FLOOR
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl text-white font-normal">
                    {selectedFloor.name}
                  </h3>
                  <div className="mt-1 font-mono text-sm text-[#E27D60] italic">
                    "{selectedFloor.plain}"
                  </div>

                  <div className="mt-6 rounded-lg bg-[#141822] border border-[#202738] p-4 font-mono text-xs">
                    <div className="text-[10px] text-[#8E95A5] uppercase">MATHEMATICAL INVARIANT</div>
                    <div className="text-base font-bold text-white mt-1">{selectedFloor.invariant}</div>
                  </div>

                  <div className="mt-4 font-sans text-sm text-[#A0A7B8] font-light leading-relaxed">
                    <strong className="text-white font-mono text-xs block mb-1">TECHNICAL SPECIFICATION:</strong>
                    {selectedFloor.tech}
                  </div>

                  <div className="mt-4 font-mono text-xs text-[#8E95A5] bg-[#0A0D14] p-3 rounded border border-[#1A202C]">
                    <span className="text-[#4ECCA3]">RULE:</span> {selectedFloor.rule}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1F2533] font-mono text-xs text-[#556075] text-center">
                  CANONICAL CANON · DITEMPA BUKAN DIBERI
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}

export default AAA;
