import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PageMeta } from '@/components/PageMeta'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { discoveries } from '@/data/discoveries'

/**
 * Home — Temporal Minimal (human-first apex surface).
 * Visual hierarchy:
 *   1. Full-viewport Digital Clock (live MYT / UTC+8 temporal horizon)
 *   2. ARIF FAZIL (largest typographic presence after the clock)
 *   3. Single human statement + primary path
 *   4. Three clear layers: Who · What I have done · What I build
 * Machine doors remain available and subordinate in the footer.
 */

function HeroDigitalClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now)

  const hh = parts.find((p) => p.type === 'hour')?.value ?? '00'
  const mm = parts.find((p) => p.type === 'minute')?.value ?? '00'
  const ss = parts.find((p) => p.type === 'second')?.value ?? '00'

  const dateStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
    .format(now)
    .toUpperCase()

  return (
    <div className="w-full" role="timer" aria-label={`Kuala Lumpur time ${hh}:${mm}:${ss} MYT`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-10">
        <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-[#9AA0A8]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#D4A853]" aria-hidden="true" />
          <span>KUALA LUMPUR</span>
          <span className="text-[#4B525E]">·</span>
          <span>UTC+8</span>
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9AA0A8] tabular-nums">
          {dateStr}
        </div>
      </div>

      <div className="relative flex items-baseline justify-center md:justify-start gap-2 md:gap-4 select-none">
        {/* Analog dial — home.md §1: the clock is built from clock-face.svg.
            The live surface uses a digital timepiece, so the hand-drawn dial is
            carried as a ghost layer behind the ticking digits (inverted to read
            on the dark page). Decorative only. */}
        <img
          src="/clock-face.svg"
          alt=""
          aria-hidden="true"
          width={1200}
          height={1200}
          loading="eager"
          decoding="async"
          className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-auto w-[min(78vw,540px)] opacity-[0.13]"
          style={{ filter: 'invert(1)' }}
        />
        <div
          className="relative z-10 font-mono font-semibold tabular-nums tracking-[-0.045em] leading-[0.88] text-[#EDEAE2]"
          style={{ fontSize: 'clamp(3.6rem, 16vw, 13rem)' }}
        >
          <span>{hh}</span>
          <span className="text-[#D4A853] mx-[0.02em]">:</span>
          <span>{mm}</span>
          <span className="text-[#D4A853] mx-[0.02em]">:</span>
          <span className="text-[#EDEAE2]/80">{ss}</span>
        </div>
        <span className="font-mono text-xs md:text-base uppercase tracking-[0.25em] text-[#D4A853] font-medium self-end pb-1.5 md:pb-5">
          MYT
        </span>
      </div>

      {/* Structural horizon line */}
      <div className="mt-8 md:mt-12 relative flex items-center">
        <div className="h-px w-full bg-gradient-to-r from-[#D4A853]/60 via-[#EDEAE2]/15 to-transparent" />
      </div>
    </div>
  )
}

const PROOF_CASES = [
  {
    id: 'bekantan-1',
    outcome: 'Shallowest flowing oil discovery recorded in the Malay Basin.',
    trail: 'Role → Evidence → What changed',
  },
  {
    id: 'lebah-emas-1',
    outcome: '11 hydrocarbon-bearing intervals; opened a new hinge play fairway.',
    trail: 'Decision lineage → Evidence → Uncertainty',
  },
  {
    id: 'bunga-tasbih-1',
    outcome: 'Commercial oil in post-rift sands; syn-rift risk recalibrated across the margin.',
    trail: 'Case → Evidence → Learning',
  },
] as const

const EPISTEMIC_CONTRACT = [
  { label: 'OBSERVED', meaning: 'Direct physical or recorded evidence' },
  { label: 'INTERPRETED', meaning: 'Reasoned from incomplete evidence' },
  { label: 'UNKNOWN', meaning: 'Not enough evidence to claim' },
  { label: 'HOLD', meaning: 'Pause until authority and proof exist' },
] as const

// ALIGNMENT 2026-11-22 (kimi-code/FI-008): the system map now matches the site's own
// canon (canon/navigation.json secondary_links_organs) — every organ appears once, every
// destination is distinct, and every one resolves. The previous list pointed arifOS at
// /arifos/ (a static surface with no client route → NotFound), pointed A-FORGE at /forge/
// (no client route → NotFound) and GEOX at /earth, which duplicated the organ map with the
// human surfaces below. Canonical organ hosts carry the map; human surfaces stay below.
const SYSTEMS = [
  {
    name: 'arifOS',
    role: 'Judgment',
    desc: 'Decides whether a machine action is admissible before execution.',
    href: 'https://mcp.arif-fazil.com/',
    external: true,
  },
  {
    name: 'AAA',
    role: 'Attention',
    desc: 'Separates routine machine work from decisions that genuinely require ARIF.',
    href: 'https://aaa.arif-fazil.com/',
    external: true,
  },
  {
    name: 'A-FORGE',
    role: 'Execution',
    desc: 'Changes external state only after authority and scope are established.',
    href: 'https://a-forge.arif-fazil.com/',
    external: true,
  },
  {
    name: 'GEOX',
    role: 'Earth',
    desc: 'Grounds reasoning against physical subsurface and geological evidence.',
    href: 'https://geox.arif-fazil.com',
    external: true,
  },
  {
    name: 'WEALTH',
    role: 'Capital',
    desc: 'Reads capital, market and risk into decisions that stay defensible.',
    href: 'https://wealth.arif-fazil.com',
    external: true,
  },
  {
    name: 'WELL',
    role: 'Human',
    desc: 'Keeps human and machine vitality measurable, so readiness is never assumed.',
    href: 'https://well.arif-fazil.com',
    external: true,
  },
  {
    name: 'Observatory',
    role: 'Witness',
    desc: 'Publishes what is measured, proven, stale, degraded, or unknown.',
    href: 'https://arifos.arif-fazil.com/',
    external: true,
  },
] as const

// ALIGNMENT 2026-11-22: /world/petronas/shadow/ and /map have no client route (both
// soft-200 at the server, NotFound in the router). Replaced with routes that exist:
// /politics/shadow (ShadowPMs) and /graph (RealityGraphView).
const EXPLORE_AXES = [
  { label: 'Earth', sub: 'Subsurface & Malay Basin', to: '/earth' },
  { label: 'Wealth', sub: 'Putrajaya ⇄ KLCC Telemetry', to: '/wealth' },
  { label: 'Shadow', sub: 'Institutional Governance', to: '/politics/shadow' },
  { label: 'Living Map', sub: 'Full Ecosystem Topology', to: '/graph' },
] as const

export function Home() {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#EDEAE2]">
      <PageMeta
        title="Arif Fazil — Exploration Geoscientist · Evidence, Decisions & Sovereign Systems"
        description="I turn uncertain ground into defensible decisions — exploration geoscientist building AI systems bounded by evidence and human authority."
        path="/"
      />

      {/* ── 01 HERO — DIGITAL CLOCK → ARIF FAZIL → CLARITY ─────────────── */}
      <section className="min-h-[90vh] flex flex-col justify-center border-b border-[#EDEAE2]/10">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:py-24">
          <HeroDigitalClock />

          <div className="mt-10 md:mt-14">
            <h1
              className="font-sans font-bold uppercase tracking-[0.04em] leading-[0.94] text-[#EDEAE2]"
              style={{ fontSize: 'clamp(3rem, 8.2vw, 7.25rem)' }}
            >
              ARIF FAZIL
            </h1>

            <p className="mt-4 font-mono text-xs md:text-sm uppercase tracking-[0.18em] text-[#D4A853]">
              Exploration Geoscientist · Systems under Uncertainty · Kuala Lumpur
            </p>

            <p className="mt-8 max-w-2xl font-display text-xl md:text-2xl text-[#EDEAE2]/90 leading-[1.45] font-normal">
              I turn uncertain ground into <em className="text-[#D4A853] not-italic">defensible</em>{' '}
              decisions — reading incomplete Earth data, refusing fake certainty, and building AI
              systems bounded by evidence and human authority.
            </p>

            <div className="mt-9 flex items-center">
              <Link
                to="/work"
                className="inline-flex items-center gap-2 bg-[#D4A853] text-[#0A0B0D] font-mono text-xs font-bold uppercase tracking-[0.14em] px-6 py-3 rounded hover:bg-[#E2BC6B] transition-colors"
              >
                See the work <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 WHO — HUMAN PRESENCE & EPISTEMIC DISCIPLINE ─────────────── */}
      <section className="py-20 md:py-28 border-b border-[#EDEAE2]/10 bg-[#0D0F13]" id="who">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnScroll>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#D4A853] mb-3">
              01 · Who
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[#EDEAE2] max-w-3xl leading-[1.15]">
              Geology taught me reality never arrives clean.
            </h2>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7 space-y-5 font-sans text-base md:text-lg text-[#9AA0A8] leading-relaxed">
                <p>
                  Seismic is incomplete. Wells are sparse. Models contradict each other. Yet real
                  capital and real consequences still depend on the call you make.
                </p>
                <p>
                  Modern AI fails in the exact same way at a larger scale: missing evidence gets
                  replaced with fluent, confident language.
                </p>
                <p className="text-[#EDEAE2]">
                  I build around one rule across subsurface geology, institutional strategy, and
                  autonomous software: know what is observed, name what is unknown, and never let
                  confidence outrun evidence.
                </p>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                {EPISTEMIC_CONTRACT.map((item) => (
                  <div
                    key={item.label}
                    className="rounded border border-[#EDEAE2]/10 bg-[#0A0B0D] p-4"
                  >
                    <div className="font-mono text-[11px] font-semibold tracking-[0.16em] text-[#D4A853] mb-1.5">
                      {item.label}
                    </div>
                    <p className="font-sans text-xs md:text-sm text-[#EDEAE2]/85 leading-snug">
                      {item.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── 03 WHAT I HAVE DONE — SUBSURFACE PROOF ─────────────────────── */}
      <section className="py-20 md:py-28 border-b border-[#EDEAE2]/10 bg-[#0A0B0D]" id="wells">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#D4A853] mb-3">
                02 · What I Have Done
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[#EDEAE2]">
                Work in the ground
              </h2>
            </div>
            <Link
              to="/work"
              className="font-mono text-xs uppercase tracking-[0.16em] text-[#D4A853] hover:underline"
            >
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
                  className="rounded border border-[#EDEAE2]/10 bg-[#101216] p-6 flex flex-col justify-between hover:border-[#D4A853]/45 transition-colors"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-3 mb-2">
                      <h3 className="font-sans text-lg font-bold uppercase tracking-wide text-[#EDEAE2]">
                        {d.title}
                      </h3>
                      <span className="font-mono text-xs text-[#D4A853] tabular-nums whitespace-nowrap">
                        {d.year}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#9AA0A8] mb-4">
                      {d.location}
                    </p>
                    <p className="font-sans text-sm text-[#EDEAE2]/90 leading-relaxed">
                      {c.outcome}
                    </p>
                    <p className="mt-4 font-mono text-[11px] text-[#9AA0A8]">{c.trail}</p>
                  </div>
                  <div className="pt-4 mt-5 border-t border-[#EDEAE2]/10 flex items-center justify-between gap-2">
                    <Link
                      to="/work"
                      className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#D4A853] hover:underline"
                    >
                      Read case &amp; evidence →
                    </Link>
                    <span className="font-mono text-[10px] text-[#9AA0A8]/60">
                      Verified 2026-08-17
                    </span>
                  </div>
                </article>
              )
            })}
          </div>

          <p className="mt-8 font-mono text-[11px] leading-relaxed text-[#9AA0A8]/80 max-w-3xl">
            Personal professional contribution — not claims on behalf of PETRONAS. Decision
            lineage, uncertainty, evidence, and withheld boundaries live on{' '}
            <Link to="/work" className="text-[#D4A853] hover:underline">
              the full work record
            </Link>
            . Last verified 2026-08-17.
          </p>
        </div>
      </section>

      {/* ── 04 WHAT I BUILD — SYSTEMS AS SECONDARY DOORS ───────────────── */}
      <section className="py-20 md:py-28 border-b border-[#EDEAE2]/10 bg-[#0D0F13]" id="systems">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#D4A853] mb-3">
                03 · What I Build
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[#EDEAE2]">
                Systems bounded by evidence
              </h2>
            </div>
            <a
              href="/arifos/"
              className="font-mono text-xs uppercase tracking-[0.16em] text-[#D4A853] hover:underline"
            >
              Open Observatory →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SYSTEMS.map((sys) => {
              const cardClass =
                'group rounded border border-[#EDEAE2]/10 bg-[#0A0B0D] p-5 hover:border-[#D4A853]/45 transition-colors flex flex-col justify-between'
              const inner = (
                <>
                  <div>
                    <div className="font-sans text-base font-bold text-[#EDEAE2] group-hover:text-[#D4A853] transition-colors">
                      {sys.name}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4A853] mt-1 mb-3">
                      {sys.role}
                    </div>
                    <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed">{sys.desc}</p>
                  </div>
                  <div className="mt-4 font-mono text-[11px] text-[#9AA0A8] group-hover:text-[#EDEAE2] transition-colors">
                    Open →
                  </div>
                </>
              )
              return sys.external ? (
                <a key={sys.name} href={sys.href} className={cardClass}>
                  {inner}
                </a>
              ) : (
                <Link key={sys.name} to={sys.href} className={cardClass}>
                  {inner}
                </Link>
              )
            })}
          </div>

          {/* Quiet secondary exploration axes */}
          <div className="mt-10 pt-8 border-t border-[#EDEAE2]/10">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#9AA0A8] mb-4">
              Active research surfaces
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {EXPLORE_AXES.map((axis) => (
                <Link
                  key={axis.label}
                  to={axis.to}
                  className="rounded border border-[#EDEAE2]/10 bg-[#0A0B0D]/70 px-4 py-3 hover:border-[#D4A853]/40 transition-colors flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-mono text-xs font-semibold text-[#EDEAE2]">
                      {axis.label}
                    </div>
                    <div className="font-sans text-xs text-[#9AA0A8]">{axis.sub}</div>
                  </div>
                  <span className="font-mono text-xs text-[#D4A853]">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 PATHS & SUBORDINATE MACHINE FOOTER ──────────────────────── */}
      <section className="py-16 md:py-20 bg-[#08090C]" id="routes">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            <Link
              to="/work"
              className="rounded border border-[#EDEAE2]/10 bg-[#0D0F13] p-5 hover:border-[#D4A853]/45 transition-colors block"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9AA0A8] mb-2">
                Understand my work
              </div>
              <div className="font-mono text-xs text-[#EDEAE2] uppercase tracking-wider">
                Wells &amp; evidence →
              </div>
            </Link>
            {/* ALIGNMENT 2026-11-22: /words was the one canon journey door
                (canon/navigation.json primary_links_journey → Read) the homepage
                never offered. RULE 2 wants every core destination within 3 clicks. */}
            <Link
              to="/words"
              className="rounded border border-[#EDEAE2]/10 bg-[#0D0F13] p-5 hover:border-[#D4A853]/45 transition-colors block"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9AA0A8] mb-2">
                Read the writing
              </div>
              <div className="font-mono text-xs text-[#EDEAE2] uppercase tracking-wider">
                Essays &amp; doctrine →
              </div>
            </Link>
            <a
              href="/institution/"
              className="rounded border border-[#EDEAE2]/10 bg-[#0D0F13] p-5 hover:border-[#D4A853]/45 transition-colors block"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9AA0A8] mb-2">
                Work with me
              </div>
              <div className="font-mono text-xs text-[#EDEAE2] uppercase tracking-wider">
                Request a briefing →
              </div>
            </a>
            <Link
              to="/999"
              className="rounded border border-[#EDEAE2]/10 bg-[#0D0F13] p-5 hover:border-[#D4A853]/45 transition-colors block"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9AA0A8] mb-2">
                Verify a claim
              </div>
              <div className="font-mono text-xs text-[#EDEAE2] uppercase tracking-wider">
                Evidence &amp; provenance →
              </div>
            </Link>
            <a
              href="https://mcp.arif-fazil.com/"
              className="rounded border border-[#EDEAE2]/10 bg-[#0D0F13] p-5 hover:border-[#D4A853]/45 transition-colors block"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9AA0A8] mb-2">
                For machines &amp; agents
              </div>
              <div className="font-mono text-xs text-[#EDEAE2] uppercase tracking-wider">
                MCP &amp; /llms.txt →
              </div>
            </a>
          </div>

          <p className="mt-8 font-mono text-[11px] leading-relaxed text-[#9AA0A8]/75 max-w-2xl">
            Personal site of ARIF FAZIL. Views and interpretations are personal unless explicitly
            identified as published institutional material. No confidential subsurface or
            commercial information is presented.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Home
