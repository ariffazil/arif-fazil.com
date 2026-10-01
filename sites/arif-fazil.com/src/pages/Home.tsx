import { Link } from 'react-router-dom'
import { LiveClock } from '@/components/LiveClock'
import { FederationConstellation } from '@/components/FederationConstellation'
import { PageMeta } from '@/components/PageMeta'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { ZenPulse } from '@/components/ZenPulse'
import { discoveries } from '@/data/discoveries'
import { agenticMirrors } from '@/components/ArrowNavbar'

/**
 * Home — Federated Agentic Web Environment Root.
 *
 * Layer 0 (Substrate): Live Chrono-Epigenetic Clock (DunedinPACE rate of aging).
 * Layer 1 (Cognitive Orchestrator): AAA 333-AGI · 555-ASI · 888-APEX.
 * Layer 2 (Organs): EARTH, WORDS, WORLD, 000, 999, HERMES.
 */

export function Home() {
  return (
    <div className="min-h-screen bg-[#07090E] text-[#EDEAE2]">
      <PageMeta
        title="Arif Fazil — Exploration Geoscientist & Sovereign Systems"
        description="I turn uncertain Earth data into defensible decisions — and build AI systems that stay bounded by evidence and human authority."
        path="/"
      />
      {/* ── ZEN PULSE — orientation in 3 seconds ──────────────────────── */}
      <ZenPulse
        whereAmI="Kuala Lumpur"
        whyCare="Exploration geoscientist. I read incomplete ground and refuse fake certainty."
        whatNext="Earth, research, writing, or a briefing."
      />

      {/* ── HERO — who, what, why + Dual Chrono-Epigenetic Clock ─────── */}
      <section className="relative overflow-hidden border-b border-[#1F2733] bg-[#07090E] py-16 md:py-24">
        <FederationConstellation />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #EDEAE2 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />

        <div className="mx-auto max-w-[1360px] px-6 relative z-10">
          {/* Status bar: identity + live clock */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1F2733]">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#9AA0A8]">
              <span className="w-2 h-2 rounded-full bg-[#E4572E]" />
              <span>ARIF FAZIL · KUALA LUMPUR</span>
            </div>
            <LiveClock withDate className="text-[#9AA0A8]" />
          </div>

          <div className="max-w-3xl">
            <div>
              <h1 className="font-display font-black text-[clamp(2.8rem,6.5vw,5.2rem)] leading-[0.92] uppercase tracking-tight text-[#EDEAE2] mb-6">
                Arif<br />
                <span className="text-[#9AA0A8]">Fazil</span>
              </h1>
              <p className="font-mono text-xs text-[#E4572E] uppercase tracking-widest mb-4">
                Exploration Geoscientist · PETRONAS Carigali · Basin Analysis · Offshore Malaysia
              </p>
              <p className="font-sans text-lg md:text-xl text-[#9AA0A8] leading-relaxed max-w-2xl mb-4">
                I turn uncertain Earth data into defensible decisions — and build AI systems that stay bounded by evidence and human authority.
              </p>
              <p className="font-sans text-base text-[#EDEAE2]/85 leading-relaxed max-w-2xl mb-4">
                I help technical teams make defensible decisions when evidence is incomplete — across offshore subsurface work and governed AI systems.
              </p>
              <p className="font-sans text-base text-[#9AA0A8] leading-relaxed max-w-2xl mb-6">
                I find signals in difficult subsurface data. I refuse fake certainty. That is the same work, in rocks and in machines. Ditempa bukan diberi.
              </p>

              {/* Credibility strip — proof points already on the record */}
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#9AA0A8] mb-8">
                13 years offshore exploration · 4 flagship wells · Public evidence linked · Human authority explicit
              </p>

              {/* START HERE — one professional path, two actions */}
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#9AA0A8] mb-3">
                Start here
              </p>
              <div className="flex flex-wrap gap-3 mb-5">
                <a href="/institution/" className="inline-flex items-center justify-center px-6 min-h-[44px] rounded bg-[#E4572E] text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-[#E4572E]/90 transition-colors">Request a briefing →</a>
                <Link to="/work" className="inline-flex items-center justify-center px-6 min-h-[44px] rounded border border-[#EDEAE2]/40 bg-[#10141D] text-[#EDEAE2] font-mono text-xs uppercase tracking-wider font-semibold hover:border-[#EDEAE2]/70 hover:text-white transition-colors">View selected work →</Link>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#9AA0A8] leading-loose">
                Explore the public record —{' '}
                <a href="/earth/" className="underline decoration-[#1F2733] underline-offset-4 hover:text-[#EDEAE2] transition-colors">Earth</a>
                {' · '}
                <Link to="/evidence" className="underline decoration-[#1F2733] underline-offset-4 hover:text-[#EDEAE2] transition-colors">Evidence register</Link>
                {' · '}
                <a href="/words/" className="underline decoration-[#1F2733] underline-offset-4 hover:text-[#EDEAE2] transition-colors">Writing</a>
                {' · '}
                <Link to="/reality" className="underline decoration-[#1F2733] underline-offset-4 hover:text-[#EDEAE2] transition-colors">Systems map</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DECISIONS UNDER NOISE — the governing idea ──────────────── */}
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
              The subsurface is incomplete. Markets are noisy. Institutions simplify. AI fills gaps too confidently.
            </p>
            <p className="font-sans text-base text-[#EDEAE2]/85 leading-relaxed max-w-3xl mt-4">
              My work is to preserve the evidence, name the uncertainty, and improve the decision. Ditempa bukan diberi.
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
        </div>
      </section>
    </div>
  )
}
export default Home
