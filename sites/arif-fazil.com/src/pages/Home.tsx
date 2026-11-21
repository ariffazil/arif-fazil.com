import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PageMeta } from '@/components/PageMeta'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { discoveries } from '@/data/discoveries'

/**
 * Home — human first screen.
 * Identity, geological proof, the bridge to governed AI, and five simple system roles.
 * No organ matrix, port numbers, floor arrays, or telemetry dashboards on this screen.
 */

function LiveClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)
  return (
    <span
      className="font-mono text-xs tracking-widest text-ink-soft tabular-nums whitespace-nowrap"
      title="Local time — Kuala Lumpur (MYT, UTC+8)"
    >
      KUALA LUMPUR&thinsp;·&thinsp;{time}&thinsp;MYT
    </span>
  )
}

const PROOF_CASES = [
  {
    id: 'bekantan-1',
    outcome: 'Shallowest flowing oil discovery recorded in the Malay Basin.',
    trail: 'My role → Evidence → What changed',
  },
  {
    id: 'lebah-emas-1',
    outcome: '11 hydrocarbon-bearing intervals; opened a new hinge play fairway.',
    trail: 'Decision lineage → Evidence → What remains uncertain',
  },
  {
    id: 'bunga-tasbih-1',
    outcome: 'Commercial oil in post-rift sands; syn-rift risk recalibrated across the margin.',
    trail: 'Case → Evidence → Learning',
  },
] as const

const EPISTEMIC_CONTRACT = [
  { label: 'OBSERVED', meaning: 'Direct evidence' },
  { label: 'INTERPRETED', meaning: 'Reasoned from evidence' },
  { label: 'UNKNOWN', meaning: 'Not enough evidence' },
  { label: 'HOLD', meaning: 'Do not proceed yet' },
] as const

const SYSTEMS = [
  { name: 'arifOS', role: 'Judgment', desc: 'Decides whether a machine action is admissible.' },
  { name: 'AAA', role: 'Attention', desc: 'Determines what needs machine work and what genuinely needs ARIF.' },
  { name: 'A-FORGE', role: 'Execution', desc: 'Changes reality after authority has been established.' },
  { name: 'GEOX', role: 'Earth', desc: 'Grounds reasoning against physical geological evidence.' },
  { name: 'Observatory', role: 'Witness', desc: 'Shows what is measured, proven, stale, degraded or unknown.' },
] as const

const METHOD_STEPS = [
  { step: 'Question', prompt: 'Is this interpretation or action defensible?' },
  { step: 'Evidence', prompt: 'What did we actually observe?' },
  { step: 'Contradictions', prompt: "What doesn't fit?" },
  { step: 'Decision', prompt: 'What can legitimately be concluded?' },
  { step: 'Permission & Action', prompt: 'What is permitted?' },
  { step: 'Receipt', prompt: 'What actually happened?' },
] as const

export function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <PageMeta
        title="Arif Fazil — Exploration Geoscientist · Evidence, Decisions & AI Systems"
        description="I turn uncertain ground into defensible decisions — exploration geoscientist building evidence-bounded AI systems."
        path="/"
      />

      {/* ── 01 HERO — ARIF first, systems second ───────────────────────── */}
      <section className="border-b border-strata-700">
        <div className="mx-auto max-w-[1360px] px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <RevealOnScroll>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-10">
              <svg
                viewBox="0 0 64 64"
                className="w-14 h-14 md:w-16 md:h-16 shrink-0 text-ink"
                role="img"
                aria-label="Emblem — forged triangle within a witness ring"
              >
                <circle
                  cx="32" cy="32" r="29"
                  fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 4"
                />
                <path
                  d="M32 14 L49 44 L15 44 Z"
                  fill="none" className="stroke-gold" strokeWidth="1.5" strokeLinejoin="round"
                />
                <line x1="32" y1="22" x2="32" y2="44" stroke="currentColor" strokeOpacity="0.8" strokeWidth="1.25" />
                <circle cx="32" cy="44" r="2.5" className="fill-gold" />
              </svg>
              <div className="font-mono text-xs uppercase tracking-widest text-ink-soft leading-relaxed">
                Arif Fazil · Exploration geoscientist building systems for decisions under uncertainty · Kuala Lumpur
              </div>
              <div className="ml-auto">
                <LiveClock />
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={120}>
            <h1 className="font-display normal-case font-normal tracking-[-0.01em] text-[clamp(2.5rem,5.6vw,4.6rem)] leading-[1.06] max-w-5xl">
              I turn uncertain ground into <em>defensible</em> decisions.
            </h1>
            <p className="mt-7 max-w-2xl font-sans text-lg md:text-xl text-ink-soft leading-relaxed">
              I work where evidence is incomplete: subsurface geology, institutional decisions and
              increasingly AI. The same rule applies to all three: know what is observed, name what
              isn&apos;t known, and never let confidence outrun evidence.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={240}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                to="/work"
                className="inline-flex items-center gap-2 bg-gold text-paper font-mono text-sm font-bold uppercase tracking-wider px-7 py-3.5 rounded-md hover:bg-human-300 transition-colors"
              >
                See the work <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#systems"
                className="font-mono text-sm text-ink-soft hover:text-ink uppercase tracking-wider transition-colors"
              >
                See the systems →
              </a>
              <Link
                to="/map"
                className="font-mono text-sm text-[#2DD4BF] hover:underline uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                🗺 Living Ecosystem Map →
              </Link>
            </div>

            {/* ── 4-AXIS SOVEREIGN REALITY CONSOLE (L0 INSTRUMENT HUD) ── */}
            <div className="mt-14 pt-8 border-t border-[#1F2733]/80">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="font-mono text-[11px] uppercase tracking-widest text-gold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  L0 Sovereign Reality Instrument · 4 Paksi Teras
                </div>
                <div className="font-mono text-[11px] text-[#9AA0A8]">
                  CHRON · 2026-11-22 · UTC+8 · LIVE
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Earth (Biru) */}
                <Link
                  to="/earth"
                  className="group relative rounded-lg border border-[#1F2733] bg-[#0A0E17]/80 p-5 hover:border-[#38BDF8] transition-all block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#38BDF8] font-bold">01 · Earth (Biru)</span>
                    <span className="font-mono text-[9px] bg-[#38BDF8]/10 text-[#38BDF8] px-1.5 py-0.5 rounded border border-[#38BDF8]/30">[OBS]</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    Geosains &amp; Glob Terestrial
                  </h3>
                  <p className="font-mono text-xs text-[#9AA0A8] mt-1.5 leading-relaxed">
                    Macrostrat WebGL 3D, telaga minyak Lembangan Melayu &amp; bukti fizikal.
                  </p>
                  <div className="mt-3 font-mono text-[11px] text-[#38BDF8] flex items-center gap-1">
                    Buka /earth/ <span>→</span>
                  </div>
                </Link>

                {/* 2. Wealth / Capital (Kuning) */}
                <Link
                  to="/wealth"
                  className="group relative rounded-lg border border-[#1F2733] bg-[#0F1420]/80 p-5 hover:border-[#E8B84B] transition-all block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#E8B84B] font-bold">02 · Wealth (Kuning)</span>
                    <span className="font-mono text-[9px] bg-[#E8B84B]/10 text-[#E8B84B] px-1.5 py-0.5 rounded border border-[#E8B84B]/30">[DER]</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-[#E8B84B] transition-colors">
                    Putrajaya ⇄ KLCC Telemetri
                  </h3>
                  <p className="font-mono text-xs text-[#9AA0A8] mt-1.5 leading-relaxed">
                    Kunci kira-kira negara: Subsidi RM40.0B ganding dividen RM32.0B.
                  </p>
                  <div className="mt-3 font-mono text-[11px] text-[#E8B84B] flex items-center gap-1">
                    Buka /wealth/ <span>→</span>
                  </div>
                </Link>

                {/* 3. Shadow / Governance (Merah) */}
                <Link
                  to="/world/petronas/shadow/"
                  className="group relative rounded-lg border border-[#1F2733] bg-[#140C12]/80 p-5 hover:border-[#EF4444] transition-all block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#EF4444] font-bold">03 · Shadow (Merah)</span>
                    <span className="font-mono text-[9px] bg-[#EF4444]/10 text-[#EF4444] px-1.5 py-0.5 rounded border border-[#EF4444]/30">[INT]</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-[#EF4444] transition-colors">
                    Kerusi Bayang &amp; 33 Bayang
                  </h3>
                  <p className="font-mono text-xs text-[#9AA0A8] mt-1.5 leading-relaxed">
                    Galeri 13 Pengerusi/CEO PETRONAS &amp; audit kuasa teknokratik TMT.
                  </p>
                  <div className="mt-3 font-mono text-[11px] text-[#EF4444] flex items-center gap-1">
                    Buka /shadow/ <span>→</span>
                  </div>
                </Link>

                {/* 4. Living Map (Cyan/Slate) */}
                <Link
                  to="/map"
                  className="group relative rounded-lg border border-[#1F2733] bg-[#0C141C]/80 p-5 hover:border-[#2DD4BF] transition-all block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#2DD4BF] font-bold">04 · Living Map</span>
                    <span className="font-mono text-[9px] bg-[#2DD4BF]/10 text-[#2DD4BF] px-1.5 py-0.5 rounded border border-[#2DD4BF]/30">[SPEC]</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white group-hover:text-[#2DD4BF] transition-colors">
                    Peta Seni Bina Ekosistem
                  </h3>
                  <p className="font-mono text-xs text-[#9AA0A8] mt-1.5 leading-relaxed">
                    Graf nod hidup L0–L4, sambungan gandingan &amp; pariti mesin penuh.
                  </p>
                  <div className="mt-3 font-mono text-[11px] text-[#2DD4BF] flex items-center gap-1">
                    Buka /map/ <span>→</span>
                  </div>
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── 02 WORK IN THE GROUND — prove the human first ──────────────── */}
      <section className="py-16 md:py-20 border-b border-[#1F2733] bg-[#07090E]" id="wells">
        <div className="mx-auto max-w-[1360px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-2">
                02 · Subsurface Record
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#EDEAE2]">
                Work in the ground
              </h2>
            </div>
            <Link to="/work" className="font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider">
              Full work record →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROOF_CASES.map((c) => {
              const d = discoveries.find((x) => x.id === c.id)
              if (!d) return null
              return (
                <article
                  key={d.id}
                  className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6 flex flex-col justify-between hover:border-[#9AA0A8]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#EDEAE2]">
                        {d.title}
                      </h3>
                      <span className="font-mono text-xs text-[#9AA0A8] whitespace-nowrap">{d.year}</span>
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-[#9AA0A8] mb-3">
                      {d.location}
                    </p>
                    <p className="font-sans text-sm text-[#EDEAE2] leading-relaxed">
                      {c.outcome}
                    </p>
                    <p className="mt-3 font-mono text-[11px] text-[#9AA0A8]">
                      {c.trail}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#1F2733]">
                    <Link to="/work" className="font-mono text-[11px] text-[#E4572E] hover:underline uppercase tracking-wider">
                      Full case on /work →
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>

          <p className="mt-6 font-mono text-[11px] leading-relaxed text-[#9AA0A8]/80 max-w-3xl">
            Personal professional contribution — not claims on behalf of PETRONAS. Decision, role,
            uncertainty, evidence and withheld boundaries live on{' '}
            <Link to="/work" className="text-[#E4572E] hover:underline">
              the full work record
            </Link>
            . Last verified 2026-08-17.
          </p>
        </div>
      </section>

      {/* ── 03 THE BRIDGE — why geologist → AI systems ─────────────────── */}
      <section className="py-16 md:py-20 border-b border-[#1F2733] bg-[#0A0D14]" id="bridge">
        <div className="mx-auto max-w-[1360px] px-6">
          <RevealOnScroll>
            <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-3">
              03 · The Bridge
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-6">
              The same problem kept appearing
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={120}>
            <div className="max-w-3xl space-y-4 font-sans text-base md:text-lg text-[#9AA0A8] leading-relaxed">
              <p>
                Geology taught me that reality does not arrive as a clean dataset. Seismic is
                incomplete. Wells are sparse. Models contradict each other. Decisions still have
                to be made.
              </p>
              <p>
                AI has the same failure mode at a different scale: missing evidence gets replaced
                with confident language.
              </p>
              <p className="text-[#EDEAE2]">
                So I began building systems around the discipline I already trusted: distinguish
                observation from interpretation, preserve provenance, expose uncertainty and require
                authority before consequence.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── 04 PROOF, NOT PERFORMANCE — simple epistemic contract ──────── */}
      <section className="py-16 md:py-20 border-b border-[#1F2733] bg-[#07090E]" id="proof">
        <div className="mx-auto max-w-[1360px] px-6">
          <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-3">
            04 · The Principle
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-4">
            Proof, not performance — Evidence over assertion
          </h2>
          <p className="font-sans text-base text-[#9AA0A8] leading-relaxed max-w-2xl mb-8">
            Material claims link to evidence or are marked as interpretation. Where evidence is
            incomplete, the system does not invent an answer.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {EPISTEMIC_CONTRACT.map((item) => (
              <div key={item.label} className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-5">
                <div className="font-mono text-xs font-bold tracking-widest text-gold mb-2">
                  {item.label}
                </div>
                <p className="font-sans text-sm text-[#EDEAE2]">{item.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 SYSTEMS — five simple roles ─────────────────────────────── */}
      <section className="py-16 md:py-20 border-b border-[#1F2733] bg-[#0A0D14]" id="systems">
        <div className="mx-auto max-w-[1360px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-2">
                05 · The Systems
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#EDEAE2]">
                Systems forged from that problem
              </h2>
            </div>
            <a
              href="https://arif-fazil.com/arifos/"
              className="font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider"
            >
              Explore the system →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SYSTEMS.map((sys) => (
              <div key={sys.name} className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-5">
                <div className="font-display text-lg font-bold text-[#EDEAE2] mb-1">{sys.name}</div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-gold mb-3">
                  {sys.role}
                </div>
                <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed">{sys.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 ONE METHOD — how I work ─────────────────────────────────── */}
      <section className="py-16 md:py-20 border-b border-[#1F2733] bg-[#07090E]" id="method">
        <div className="mx-auto max-w-[1360px] px-6">
          <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-3">
            06 · One Method
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            How I work
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {METHOD_STEPS.map((m, i) => (
              <div key={m.step} className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-5">
                <div className="font-mono text-[11px] text-[#9AA0A8] mb-2">0{i + 1}</div>
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-gold mb-2">
                  {m.step}
                </div>
                <p className="font-sans text-sm text-[#EDEAE2] leading-relaxed">{m.prompt}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 font-sans text-sm text-[#9AA0A8]">
            This started as geoscience discipline. It now shapes how I build machine systems.
          </p>
        </div>
      </section>

      {/* ── 07 AUDIENCE ROUTES & 08 CLOSING ────────────────────────────── */}
      <section className="py-16 md:py-20 bg-[#05070B]" id="routes">
        <div className="mx-auto max-w-[1360px] px-6">
          <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-3">
            07 · Choose Your Path
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-8">
            If you&apos;re here to…
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link to="/work" className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6 hover:border-[#9AA0A8]/40 transition-colors block">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-2">Understand my work</div>
              <div className="font-mono text-xs text-[#EDEAE2] uppercase tracking-wider">Explore wells &amp; evidence →</div>
            </Link>
            <a href="/institution/" className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6 hover:border-[#9AA0A8]/40 transition-colors block">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-2">Work with me</div>
              <div className="font-mono text-xs text-[#EDEAE2] uppercase tracking-wider">Request a briefing →</div>
            </a>
            <a href="https://mcp.arif-fazil.com/" className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6 hover:border-[#9AA0A8]/40 transition-colors block">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-2">Integrate an agent</div>
              <div className="font-mono text-xs text-[#EDEAE2] uppercase tracking-wider">Machine start here →</div>
            </a>
            <Link to="/999" className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6 hover:border-[#9AA0A8]/40 transition-colors block">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-2">Verify a claim</div>
              <div className="font-mono text-xs text-[#EDEAE2] uppercase tracking-wider">Evidence &amp; provenance →</div>
            </Link>
          </div>

          <div className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-5">
            <p className="font-mono text-[11px] leading-relaxed text-[#9AA0A8] max-w-3xl">
              Personal site of ARIF FAZIL. Views and interpretations are personal unless explicitly
              identified as published institutional material. No confidential subsurface or commercial information
              is presented.
            </p>
            <p className="mt-3 font-display italic text-base text-gold">
              Ditempa bukan diberi — forged, not given.
            </p>
          </div>

          {/* ── CLOSED-LOOP FOOTER NAVIGATION ("LOOP IT ALL") ── */}
          <div className="mt-8 pt-6 border-t border-[#1F2733] flex flex-wrap justify-between items-center gap-4">
            <nav className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-wider text-[#9AA0A8]" aria-label="Closed-Loop Navigation">
              <span className="text-white font-bold">L0 Home</span>
              <Link to="/earth" className="hover:text-[#38BDF8]">⇄ Earth (/earth/)</Link>
              <Link to="/wealth" className="hover:text-gold">⇄ Wealth (/wealth/)</Link>
              <Link to="/petronas" className="hover:text-gold">⇄ KLCC (/petronas/)</Link>
              <Link to="/world/petronas/shadow/" className="hover:text-[#EF4444]">⇄ Shadow (/shadow/)</Link>
              <Link to="/map" className="hover:text-[#2DD4BF] text-[#2DD4BF]">🗺 Peta Sistem (/map/)</Link>
              <a href="/llms.txt" className="hover:text-white">🤖 /llms.txt</a>
            </nav>
            <div className="font-mono text-[11px] text-[#9AA0A8]">
              arifOS Sovereign Reality Instrument · seal 999
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Home
