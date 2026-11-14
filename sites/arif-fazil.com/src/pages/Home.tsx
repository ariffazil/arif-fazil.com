import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PageMeta } from '@/components/PageMeta'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { discoveries } from '@/data/discoveries'

/**
 * Home — human first screen.
 * The header already carries the doors. This page keeps the sentence, the creed,
 * the wells record (the full record stays on /work), and one briefing.
 * Organ addresses and the machine map stay off this screen.
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

export function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <PageMeta
        title="Arif Fazil — Exploration Geoscientist & Sovereign Systems"
        description="I turn uncertain Earth data into defensible decisions — and build AI systems that stay bounded by evidence and human authority."
        path="/"
      />

      {/* ── HERO — one loud element: the sentence ─────────────────────── */}
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
                Arif Fazil · Exploration Geoscientist · Kuala Lumpur
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
              I read incomplete Earth data and refuse fake certainty — and I build AI systems that
              stay bounded by evidence and human authority.
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
              <Link
                to="/doctrine"
                className="font-mono text-sm text-ink-soft hover:text-ink uppercase tracking-wider transition-colors"
              >
                Read the doctrine →
              </Link>
            </div>
            <p className="mt-14 font-display italic text-base text-ink-soft/70">
              Ditempa bukan diberi — forged, not given.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="py-16 md:py-20 border-b border-[#1F2733] bg-[#0A0D14]" id="idea">
        <div className="mx-auto max-w-[1360px] px-6">
          <RevealOnScroll>
            <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-3">
              The Governing Idea
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-6">
              Decisions under noise
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <p className="font-sans text-lg md:text-xl text-[#9AA0A8] leading-relaxed max-w-3xl">
              The subsurface is incomplete. Markets are noisy. Institutions simplify. Commercial AI fills gaps too confidently with disembodied chatter.
            </p>
            <p className="font-sans text-base text-[#EDEAE2]/85 leading-relaxed max-w-3xl mt-4">
              My work is to anchor intelligence to hard ground: preserving evidence, naming uncertainty honestly, and building machines that know their limits. Teks bukan manusia. Lega bukan selesai. Ditempa bukan diberi.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── THE WELLS RECORD — real-world grounding FIRST ────────────── */}
      <section className="py-16 md:py-20 border-b border-[#1F2733] bg-[#07090E]" id="wells">
        <div className="mx-auto max-w-[1360px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-2">
                Subsurface Ledger
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#EDEAE2]">
                The Wells Record
              </h2>
            </div>
            <Link to="/work" className="font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider">
              Full work record →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discoveries.filter((d) => d.category === 'wells').slice(0, 4).map((d) => (
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
                  <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed line-clamp-3">
                    {d.summary}
                  </p>
                  <details className="mt-3">
                    <summary className="cursor-pointer select-none font-mono text-[11px] uppercase tracking-wider text-[#9AA0A8] hover:text-[#E4572E] transition-colors">
                      Evidence drawer ▾
                    </summary>
                    <ul className="mt-2 space-y-1.5 border-l-2 border-[#1F2733] pl-3">
                      {d.evidence.map((e) => (
                        <li key={e} className="text-xs text-[#9AA0A8]/80 leading-relaxed">
                          — {e}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[#9AA0A8]/80">
                      source · {d.linkLabel ?? 'Explore GEOX'} · {d.year} · limitations ·{' '}
                      {d.limits ?? 'Internal technical detail withheld.'}
                    </div>
                  </details>
                </div>
                <div className="pt-4 mt-4 border-t border-[#1F2733]">
                  <span className="font-mono text-[11px] text-[#9AA0A8]">
                    {d.evidence.length} evidence item{d.evidence.length === 1 ? '' : 's'}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-6 font-mono text-[11px] leading-relaxed text-[#9AA0A8]/80 max-w-3xl">
            Four flagship wells. Personal professional contribution — not claims on behalf of PETRONAS.
            Internal technical detail is withheld. Last verified 2026-08-17.{' '}
            <Link to="/work" className="text-[#E4572E] hover:underline">
              Case studies and the full record live on /work
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── PROOF — bounded, not absolute ───────────────────────────── */}
      <section className="py-16 md:py-20 border-b border-[#1F2733] bg-[#05070B]" id="proof">
        <div className="mx-auto max-w-[1360px] px-6">
          <div className="font-mono text-xs uppercase tracking-widest text-[#E4572E] mb-3">
            Proof, not performance
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#EDEAE2] mb-6">
            Evidence over assertion
          </h2>
          <p className="font-sans text-base text-[#9AA0A8] leading-relaxed max-w-3xl mb-8">
            Material claims link to evidence, or are marked as interpretation. Where evidence is incomplete,
            the system returns UNKNOWN or HOLD — it does not invent an answer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-2">For institutions</div>
              <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed mb-4">What I can contribute, what you can inspect, how to start.</p>
              <a href="/institution/" className="font-mono text-xs text-[#EDEAE2] hover:underline uppercase tracking-wider">Request a briefing →</a>
              <br />
              <a href="/pilot/" className="font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider">Design partner pilot →</a>
            </div>
            <div className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-2">For agents</div>
              <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed mb-4">Start here: identity, read-only paths, what requires approval.</p>
              <Link to="/human" className="font-mono text-xs text-[#EDEAE2] hover:underline uppercase tracking-wider">Agent start here →</Link>
            </div>
            <div className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-2">For verification</div>
              <p className="font-sans text-sm text-[#9AA0A8] leading-relaxed mb-4">Inspect provenance. These are evidence snapshots, not self-issued certificates.</p>
              <Link to="/999" className="font-mono text-xs text-[#EDEAE2] hover:underline uppercase tracking-wider">Verification & provenance →</Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-5">
            <p className="font-mono text-[11px] leading-relaxed text-[#9AA0A8] max-w-3xl">
              Personal site of ARIF FAZIL. Views and interpretations are personal unless explicitly
              identified as published institutional material. No confidential subsurface or commercial information
              is presented. Ditempa bukan diberi — forged, not given.
            </p>
          </div>

          {/* Final button — same label, same destination as the hero (rulebook #12) */}
          <div className="mt-10 flex justify-center">
            <Link
              to="/work"
              className="inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-gold hover:text-human-300 transition-colors"
            >
              See the work <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Home
