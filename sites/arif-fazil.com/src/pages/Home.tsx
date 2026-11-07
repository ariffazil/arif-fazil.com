import { Link } from 'react-router-dom'
import { PageMeta } from '@/components/PageMeta'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { discoveries } from '@/data/discoveries'
import { agenticMirrors } from '@/components/ArrowNavbar'

/**
 * Home — human-clarity-first landing (constitution: RULE 1, F13 2026-11-07).
 * Layer 1 (Human Truth): one hero sentence + four plain doors — no telemetry.
 * Layer 3 (Agent Truth): quiet mirror row at the bottom only.
 * FQ / floors / vault hashes live on /arifos/ — not on the human front page.
 */

const doors = [
  {
    name: 'GEOX — The Earth',
    href: 'https://geox.arif-fazil.com',
    external: true,
    line: 'Seismic lines, basins and wells — the subsurface, read honestly.',
  },
  {
    name: 'MakcikGPT — The Voice',
    href: '/world/makcikgpt/',
    external: false,
    line: 'Civic writing in plain Malay. She speaks for no institution.',
  },
  {
    name: 'arifOS — The Machine',
    href: '/arifos/',
    external: false,
    line: 'An AI that refuses to invent: evidence first, or it says UNKNOWN.',
  },
  {
    name: 'Words — The Hand',
    href: '/words',
    external: false,
    line: 'Essays and biography, written by hand.',
  },
]

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
            <div className="flex items-center gap-4 mb-10">
              <img
                src="/images/portal-portrait.jpg"
                alt="Portrait of Arif Fazil"
                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover ring-1 ring-strata-700"
              />
              <div className="font-mono text-xs uppercase tracking-widest text-ink-soft leading-relaxed">
                Muhammad Arif bin Fazil · Exploration Geoscientist · Kuala Lumpur
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

      {/* ── FOUR DOORS — table of contents, hairlines, no chrome ──────── */}
      <section className="border-b border-strata-700" id="doors">
        <div className="mx-auto max-w-[1360px] px-6 py-14 md:py-16">
          <RevealOnScroll>
            <div className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-4">
              Four doors
            </div>
          </RevealOnScroll>
          <nav aria-label="Site doors">
            {doors.map((d, i) => (
              <RevealOnScroll key={d.name} delay={i * 80}>
                <a
                  href={d.href}
                  {...(d.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="group grid grid-cols-1 md:grid-cols-[340px_1fr_auto] gap-x-8 gap-y-1 items-baseline py-6 md:py-7 border-t border-strata-700 last:border-b hover:bg-basalt-900/40 transition-colors px-2 -mx-2 rounded-sm"
                >
                  <h3 className="font-display text-xl md:text-2xl font-bold text-ink group-hover:text-human-300 transition-colors">
                    {d.name}
                  </h3>
                  <p className="font-sans text-base text-ink-soft leading-relaxed">{d.line}</p>
                  <span
                    aria-hidden="true"
                    className="hidden md:inline text-ink-soft group-hover:text-ember group-hover:translate-x-0.5 transition-all"
                  >
                    ↗
                  </span>
                </a>
              </RevealOnScroll>
            ))}
          </nav>
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
                <div className="pt-4 mt-4 border-t border-[#1F2733] flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#9AA0A8]">
                    {d.evidence.length} evidence item{d.evidence.length === 1 ? '' : 's'}
                  </span>
                  <a
                    href={d.link ?? 'https://geox.arif-fazil.com'}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider"
                  >
                    {d.linkLabel ?? 'Explore GEOX'} ↗
                  </a>
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

          {/* Agentic mirror (organs) */}
          <div className="rounded-lg border border-[#1F2733] bg-[#080B10] p-5 mb-10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-3">
              Other doors — for agents
            </div>
            <div className="flex flex-wrap gap-2">
              {agenticMirrors.map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded bg-[#10141D] border border-[#1F2733] text-[11px] font-mono uppercase text-[#9AA0A8] hover:text-[#EDEAE2] hover:border-[#E4572E]/50 transition-colors"
                  title={m.desc}
                >
                  {m.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg border border-[#1F2733] bg-[#0F131D] p-5">
            <p className="font-mono text-[11px] leading-relaxed text-[#9AA0A8] max-w-3xl">
              Personal site of Muhammad Arif bin Fazil. Views and interpretations are personal unless explicitly
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
